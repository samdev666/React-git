import React, { ComponentType, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ReduxState } from "../../redux/reducers";
import StepForm from "@wizehub/components/stepForm";
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';
import CustomForm from "./customForm";
import { FeeHistoryEntity, PresentationData, Question, Section, TenantFormData } from "@wizehub/common/models/genericEntities";
import { useDispatch } from "react-redux";
import { apiCall, FEE_HISTORY, setCurrentStep } from "../../redux/actions";
import { TenantFormsCode } from "../../utils/constant";
import { GET_FEE_HISTORY_LISTING, UPDATE_TENANT_FORMS, UPDATE_TENANT_FORMS_SECTION } from "../../api";
import { getDefaultMetaData, MetaData, PaginatedEntity } from "@wizehub/common/models";
import { usePagination, usePopupReducer } from "@wizehub/common/hooks";
import {
    StyledFeeHistoryButtonContainer,
    StyledFeeHistoryContainer,
    StyledFormSectionHeadingContainer,
    StyledFormSectionTitle,
    StyledFormSubSectionTitle
} from "./styles";
import { Button, Card, Modal } from "@wizehub/components";
import { greyScaleColour } from "@wizehub/common/theme/style.palette";
import { Grid } from "@mui/material";
import messages from "../../messages";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FeeHistory from "../businessScorecards/feeHistory/feeHistory";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { HttpMethods } from "@wizehub/common/utils";
import BusinessAssessmentFormModal from "../businessScorecards/businessAssessment/businessAssessmentFormModal";

interface Props {
    tenantFormsData?: TenantFormData;
    getTenantForms?: (value?: boolean) => Promise<void>;
    code?: string;
    formCompletionComponent?: ComponentType<unknown>;
    isPrevValue?: boolean;
}

export interface SubmitData {
    tenantId: number | string;
    userResponses: {
        questions: Question[];
    };
    completionStatus: string;
    score?: number;
}

const FormComponent: React.FC<Props> = ({ tenantFormsData, getTenantForms, code, formCompletionComponent, isPrevValue }) => {
    const reduxDispatch = useDispatch();
    const { stepForm, tenantData } = useSelector((state: ReduxState) => state);
    const currentFormIndex = stepForm.currentPage;

    const [traversedPages, setTraversedPages] = useState<Array<number>>([]);
    const [showWizegapPopup, setShowWizegapPopup] = useState<boolean>(false);

    const displayOrder = tenantFormsData?.sectionDisplayOrder;
    const sortedSections = displayOrder?.map((sectionId: string | number) => {
        const section = tenantFormsData?.sections?.find((section: Section) => section.id === Number(sectionId));
        return section;
    });

    const paginatedFeeHistory: PaginatedEntity = {
        key: 'feeHistory',
        name: FEE_HISTORY,
        api: GET_FEE_HISTORY_LISTING.replace(':tenantId', tenantData?.tenantId),
    };

    const getDefaultFeeHistoryFilter = (): MetaData<FeeHistoryEntity> => ({
        ...getDefaultMetaData<FeeHistoryEntity>(),
        order: 'year'
    });

    const {
        entity: feeHistory,
        applyFilters,
        fetchPage,
        updateLimit,
        updateFilters
    } = usePagination<FeeHistoryEntity>(
        paginatedFeeHistory,
        getDefaultFeeHistoryFilter()
    );

    const {
        visibility: formVisibility,
        showPopup: showForm,
        hidePopup: hideForm,
    } = usePopupReducer();

    const handleFormSectionSubmit = async (
        sectionId: string | number,
        sanitizedBody: SubmitData,
        onSuccess: () => void
    ) => new Promise<void>((resolve, reject) => {
        reduxDispatch(
            apiCall(
                UPDATE_TENANT_FORMS_SECTION.replace(':id', sectionId?.toString()),
                resolve,
                reject,
                HttpMethods.PATCH,
                sanitizedBody,
            ),
        );
    })
        .then(() => {
            onSuccess();
        })
        .catch((error) => {
            console.log(error.message)
        });

    const submitForm = async () => new Promise<void>((resolve, reject) => {
        if (code === TenantFormsCode.businessAssessment && tenantFormsData?.completionStatus === 'INPROGRESS') {
            setShowWizegapPopup(true);
        }
        reduxDispatch(
            apiCall(
                UPDATE_TENANT_FORMS.replace(':id', tenantFormsData?.id?.toString()),
                resolve,
                reject,
                HttpMethods.PATCH,
                {
                    tenantId: tenantData?.tenantId,
                    completionStatus: "COMPLETED"
                },
            ),
        );
    })
        .then(() => {
            if (code === TenantFormsCode.businessAssessment) {
                showForm();
            }
        })
        .catch((error) => {
            console.log(error?.message)
        });

    const FeeHistoryComponent = (sectionId: number, presentationData: PresentationData) => (
        <StyledFeeHistoryContainer>
            <Card
                headerCss={{
                    backgroundColor: greyScaleColour.grey60
                }}
                cardCss={{ overflow: 'visible !important' }}
                header={
                    <StyledFormSectionHeadingContainer container>
                        <Grid item xs={12}>
                            <StyledFormSectionTitle>
                                {presentationData?.title}
                            </StyledFormSectionTitle>
                        </Grid>
                        <Grid item xs={12}>
                            <StyledFormSubSectionTitle>
                                {presentationData?.subTitle}
                            </StyledFormSubSectionTitle>
                        </Grid>
                    </StyledFormSectionHeadingContainer>
                }
            />
            <FeeHistory
                feeHistoryData={feeHistory}
                applyFilters={applyFilters}
                fetchPage={fetchPage}
                updateLimit={updateLimit}
                updateFilters={updateFilters}
            />
            <StyledFeeHistoryButtonContainer container>
                <Grid item>
                    <Button
                        label={messages?.general?.previous}
                        variant="outlined"
                        color="secondary"
                        startIcon={<ArrowBackIcon />}
                        size="large"
                        onClick={() => {
                            if (currentFormIndex - 1 >= 0) {
                                getTenantForms(true);
                                reduxDispatch(
                                    setCurrentStep(currentFormIndex - 1),
                                )
                            }
                        }}
                    />
                </Grid>
                <Grid item>
                    <Button
                        label={currentFormIndex + 1 === displayOrder?.length
                            ? messages?.general?.finish
                            : messages?.general?.next}
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={async () => {
                            const sanitizedBody: any = {
                                tenantId: tenantData?.tenantId,
                                completionStatus: "COMPLETED"
                            };
                            handleFormSectionSubmit(sectionId, sanitizedBody, () => { });
                            await submitForm();
                        }}
                        endIcon={currentFormIndex + 1 < displayOrder?.length && <ArrowForwardIcon />}
                    />
                </Grid>
            </StyledFeeHistoryButtonContainer>
        </StyledFeeHistoryContainer>
    )

    const forms = sortedSections?.map((section: Section) => {
        return section && {
            component: () => section?.questions?.[0]?.type === TenantFormsCode.feeHistory
                ? FeeHistoryComponent(section?.id, section?.presentationData)
                : (
                    <CustomForm
                        section={section}
                        formLength={displayOrder?.length}
                        getTenantForms={getTenantForms}
                        traversedPages={traversedPages}
                        setTraversedPages={setTraversedPages}
                        code={code}
                        formId={tenantFormsData?.id}
                        formCompletionStatus={tenantFormsData?.completionStatus}
                    />
                ),
            navIcon: WatchLaterOutlinedIcon
        };
    });

    useEffect(() => {
        if (!isPrevValue) {
            const data = sortedSections
                ?.map((item: any, index: number) => {
                    if (item?.completionStatus === "COMPLETED") {
                        return index;
                    }
                    return null;
                })
                ?.filter(index => index !== null);
            if (data?.length) {
                setTraversedPages(data);
            }
        }
    }, [tenantFormsData]);

    useEffect(() => {
        if (currentFormIndex - 1 !== -1 && !traversedPages?.includes(currentFormIndex - 1)) {
            setTraversedPages([...traversedPages, currentFormIndex - 1]);
        }
    }, [currentFormIndex])

    useEffect(() => {
        if (code !== TenantFormsCode.wizeGap && traversedPages?.length === sortedSections?.length) {
            reduxDispatch(setCurrentStep(0));
        } else {
            reduxDispatch(setCurrentStep(traversedPages?.length));
        }
    }, [traversedPages])

    return (
        <>
            <StepForm
                forms={forms}
                traversedPages={traversedPages}
                setTraversedPages={setTraversedPages}
                sections={sortedSections}
                formCompletionComponent={formCompletionComponent}
            />
            <Modal
                show={formVisibility}
                onClose={hideForm}
                fitContent
            >
                <BusinessAssessmentFormModal
                    showWizegapPopup={showWizegapPopup}
                />
            </Modal>
        </>
    )
};

export default FormComponent;