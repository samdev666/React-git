import { Box, Grid } from "@mui/material";
import { useFormReducer, useOptions, usePagination } from "@wizehub/common/hooks";
import { Button, FormError, FormRow, FormRowItem, MaterialAutocompleteInput, MaterialDateInput, MaterialTextInput } from "@wizehub/components";
import React, { useEffect, useState } from "react";
import {
    StyledButton,
    StyledClientDetailsModalForm,
    StyledClientDetailsModalFormRow,
    StyledClientDetailsModalHeading,
    StyledClientDetailsModalInfoHeading,
    StyledClientDetailsModalSeparator,
    StyledClientDetailsModalText
} from "./styles";
import messages from "../../../messages";
import { greyScaleColour } from "@wizehub/common/theme/style.palette";
import { ClientEntity, FeeWonsEntity, PlanEntity } from "@wizehub/common/models/genericEntities";
import moment from "moment";
import { emptyValueValidator, HttpMethods, required } from "@wizehub/common/utils";
import { getDefaultClientPortfolioFilter } from "../../clientPortfolio.tsx/tabularView";
import { ADD_PLAN, FEE_WONS_API, GET_TENANT_CLIENTS } from "../../../api";
import { paginatedLeadManagement } from "../leadManagement";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import { ResponsiveAddIcon } from "../../systemPreferences/launchPadSetup/launchPadSetup";
import { routes } from "../../../utils";
import { push } from "connected-react-router";
import { useDispatch } from "react-redux";
import { apiCall } from "../../../redux/actions";
import { Id } from "@wizehub/common/models";
import { GET_TEAM_DETAILS_FORM_PLAN, PLAN_LISTING_API } from "../../../api";
import { Status } from "@wizehub/common/models/modules";

interface Props {
    onCancel: () => void;
    onSuccess: () => void;
    endpoint?: string;
    isEdit?: boolean;
    card?: ClientEntity;
    clientId?: Id;
    feeWonAndLostId?: Id;
    feeWonAndLostTeamId?: Id;
}

const ClientDetailsModal: React.FC<Props> = ({
    onCancel,
    onSuccess,
    endpoint,
    isEdit,
    card,
    clientId,
    feeWonAndLostId,
    feeWonAndLostTeamId
}) => {
    const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
    const [feeWonData, setFeeWonData] = useState<FeeWonsEntity>(null);
    const [feeWonLostId, setFeeWonLostId] = useState<Id>(null);

    const validators = {
        startMonth: [
            required(messages?.leadManagement?.clientDetailsModal?.validators?.startMonthRequired),
        ],
        taxAndAccountingDivision: [
            required(messages?.leadManagement?.clientDetailsModal?.validators?.taxAccountDivisionRequired),
            emptyValueValidator,
        ],
        bookkeepingDivision: [
            required(messages?.leadManagement?.clientDetailsModal?.validators?.bookkeepingDivisionRequired),
            emptyValueValidator,
        ],
        fee: [
            required(messages?.leadManagement?.clientDetailsModal?.validators?.feeRequired),
        ]
    };

    let validatorsData = !card && {
        ...validators,
        client: [
            required(messages?.measure?.financialOverview?.feesWonAndLost?.lostClientsTab?.validators?.clientRequired),
        ],
    }

    const {
        submitting,
        handleSubmit,
        connectField,
        change,
        submitError,
        setSubmitError,
        formValues
    } = useFormReducer(validatorsData || validators);

    const {
        options: leadManagement,
        searchOptions,
    } = useOptions<ClientEntity>(
        GET_TENANT_CLIENTS.replace(":tenantId", tenantId),
        true,
        getDefaultClientPortfolioFilter(true),
    );

    const reduxDispatch = useDispatch();

    const currentYear = new Date().getFullYear();

    const getPlanById = async (planId: Id): Promise<PlanEntity | void> => {
        return new Promise<void>((resolve, reject) => {
            reduxDispatch(
                apiCall(
                    `${ADD_PLAN}/${planId}`,
                    resolve,
                    reject,
                    HttpMethods.GET
                )
            );
        }).then((res) => res).catch((error) => { setSubmitError(error?.message) });
    }

    const getAllPlans = async () => {
        return new Promise<void>((resolve, reject) => {
            reduxDispatch(
                apiCall(
                    `${PLAN_LISTING_API.replace(':tenantId', tenantId)}`,
                    resolve,
                    reject,
                    HttpMethods.GET
                )
            );
        }).then(async (res: any) => {
            const plans: PlanEntity[] = res?.records
            if (plans?.length) {
                const currentYearActivePlans = plans.filter(
                    (item) => item.financialYear === new Date().getFullYear() && item.status === Status.active);
                const data: PlanEntity | void = await getPlanById(currentYearActivePlans?.[0]?.id)
                if (data) {
                    setFeeWonLostId(data?.planFeeWonLostId);
                }
            }
        }).catch((error) => { setSubmitError(error?.message) });
    }

    const getTeamDetails = async () => {
        return new Promise<void>((resolve, reject) => {
            reduxDispatch(
                apiCall(
                    GET_TEAM_DETAILS_FORM_PLAN.replace(
                        ':tenantId', tenantId).replace(
                            ':feeWonLostId', feeWonLostId?.toString()).replace(
                                ':employeeId', card?.clientManager?.id?.toString()
                            ),
                    resolve,
                    reject,
                    HttpMethods.GET,
                )
            );
        }).then((res: any) => {
            return res?.[0]?.budgetTeamId;
        }).catch(() => { });
    }


    const renderDetailsInfo = (heading: string, value: string | number) => (
        <FormRowItem display={"flex"} flexDirection={"column"} gap={"8px"}>
            <StyledClientDetailsModalHeading>
                {heading}
            </StyledClientDetailsModalHeading>
            <StyledClientDetailsModalText>
                {value}
            </StyledClientDetailsModalText>
        </FormRowItem>
    );

    const GridItem: React.FC<{
        heading: string;
        value: number | null;
    }> = ({ heading, value }) => (
        <Grid item display="flex" flexDirection="column" gap="10px" xs={6}>
            <StyledClientDetailsModalHeading>{heading}</StyledClientDetailsModalHeading>
            <StyledClientDetailsModalText>{value || '-'}</StyledClientDetailsModalText>
        </Grid>
    );

    const getFeeWonsDataById = async () => {
        return reduxDispatch(
            apiCall(
                `${FEE_WONS_API}/${clientId}`,
                (resolve) => {
                    setFeeWonData(resolve);
                },
                (reject) => { }
            )
        );
    }

    const renderCalculatedInfo = (heading: string, taxValue: number, bookkeepingValue: number) => (
        <StyledClientDetailsModalFormRow mt={"16px"}>
            <FormRowItem display={"flex"} flexDirection={"column"} gap={"10px"}>
                <StyledClientDetailsModalInfoHeading>
                    {heading}
                </StyledClientDetailsModalInfoHeading>
                <Grid container display={"flex"}>
                    <GridItem heading={messages?.leadManagement?.clientDetailsModal?.subHeading1} value={taxValue} />
                    <GridItem heading={messages?.leadManagement?.clientDetailsModal?.subHeading2} value={bookkeepingValue} />
                </Grid>
            </FormRowItem>
        </StyledClientDetailsModalFormRow>
    )

    const getCalculatedInfo = (year: number) => {
        if (formValues?.fee?.value?.id === 'no') {
            return {
                taxValue: null,
                bookkeepingValue: null
            };
        }

        const isCurrentYear = formValues?.fee?.value?.id === year;

        const taxValue = isCurrentYear ? formValues?.taxAndAccountingDivision?.value : null;
        const bookkeepingValue = isCurrentYear ? formValues?.bookkeepingDivision?.value : null;

        return {
            taxValue,
            bookkeepingValue
        };
    };

    const getAnnualFeeDistribution = () => {
        if (formValues?.fee?.value?.id === 'no') {
            const totalMonths = 12;
            const selectedMonth = moment(formValues?.startMonth?.value)?.month();
            const nextYearMonths = selectedMonth;
            const remainingMonthsCurrentYear = totalMonths - selectedMonth;

            const taxValueCurrentYear = ((formValues?.taxAndAccountingDivision?.value) / 12) * remainingMonthsCurrentYear;
            const bookKeepingValueCurrentYear = ((formValues?.bookkeepingDivision?.value) / 12) * remainingMonthsCurrentYear;

            const taxValueNextYear = ((formValues?.taxAndAccountingDivision?.value) / 12) * nextYearMonths;
            const bookKeepingValueNextYear = ((formValues?.bookkeepingDivision?.value) / 12) * nextYearMonths;

            return {
                taxValueCurrentYear: taxValueCurrentYear?.toFixed(2),
                bookKeepingValueCurrentYear: bookKeepingValueCurrentYear?.toFixed(2),
                taxValueNextYear: taxValueNextYear?.toFixed(2),
                bookKeepingValueNextYear: bookKeepingValueNextYear?.toFixed(2)
            };
        }
    };

    const getSanitizedBody = (data: any, teamId?: Id) => {
        const currentYearAccountingFee = (getCalculatedInfo(currentYear).taxValue ??
            getAnnualFeeDistribution()?.taxValueCurrentYear) || null;
        const currentYearBookkeepingFee = (getCalculatedInfo(currentYear).bookkeepingValue ??
            getAnnualFeeDistribution()?.bookKeepingValueCurrentYear) || null;
        const nextYearAccountingFee = (getCalculatedInfo(currentYear + 1).taxValue ??
            getAnnualFeeDistribution()?.taxValueNextYear) || null;
        const nextYearBookkeepingFee = (getCalculatedInfo(currentYear + 1).bookkeepingValue ??
            getAnnualFeeDistribution()?.bookKeepingValueNextYear) || null;

        const sanitizedBody: any = {
            tenantId: tenantId,
            feeWonLostId: feeWonLostId || feeWonAndLostId,
            feeWonLostTeamId: teamId || feeWonAndLostTeamId,
            clientId: card?.id || data?.client?.id,
            currentYearAccountingFee: currentYearAccountingFee && Number(currentYearAccountingFee),
            currentYearBookkeepingFee: currentYearBookkeepingFee && Number(currentYearBookkeepingFee),
            nextYearAccountingFee: nextYearAccountingFee && Number(nextYearAccountingFee),
            nextYearBookkeepingFee: nextYearBookkeepingFee && Number(nextYearBookkeepingFee)
        };
        return sanitizedBody;
    }

    const onSubmit = async (data: any) => {
        // if (formValues?.taxAndAccountingDivision?.value && formValues?.bookkeepingDivision?.value) {
        //     const total = Number(formValues?.taxAndAccountingDivision?.value) +
        //         Number(formValues?.bookkeepingDivision?.value)
        //     if (card?.annualFee && total > card?.annualFee) {
        //         setSubmitError(messages?.leadManagement?.clientDetailsModal?.error?.totalError);
        //         return;
        //     }
        // }

        let sanitizedBody;
        if (card) {
            const teamId = await getTeamDetails();
            sanitizedBody = getSanitizedBody(data, teamId);
        } else {
            sanitizedBody = getSanitizedBody(data);
        }

        return new Promise<void>((resolve, reject) => {
            reduxDispatch(
                apiCall(
                    endpoint,
                    resolve,
                    reject,
                    isEdit ? HttpMethods.PATCH : HttpMethods.POST,
                    sanitizedBody
                )
            );
        }).then(() => {
            onSuccess();
        }).catch((error) => { setSubmitError(error?.message) });
    };

    useEffect(() => {
        if (card) {
            getAllPlans();
        }
    }, [card])

    useEffect(() => {
        if (isEdit) {
            getFeeWonsDataById();
        }
    }, [isEdit])

    useEffect(() => {
        if (isEdit && feeWonData) {
            change('client', {
                id: feeWonData?.client?.id,
                label: feeWonData?.client?.businessName
            })
        }
    }, [feeWonData])


    useEffect(() => {
        const calculatedInfo = getCalculatedInfo(currentYear);
        const calculatedInfoNextYear = getCalculatedInfo(currentYear + 1);
        const annualFeeDistribution = getAnnualFeeDistribution();

        if (feeWonData) {
            setFeeWonData((prevState) => ({
                ...prevState,
                currentYearAccountingFee: calculatedInfo.taxValue ?? annualFeeDistribution?.taxValueCurrentYear,
                currentYearBookkeepingFee: calculatedInfo.bookkeepingValue ?? annualFeeDistribution?.bookKeepingValueCurrentYear,
                nextYearAccountingFee: calculatedInfoNextYear.taxValue ?? annualFeeDistribution?.taxValueNextYear,
                nextYearBookkeepingFee: calculatedInfoNextYear.bookkeepingValue ?? annualFeeDistribution?.bookKeepingValueNextYear,
            }));
        }
    }, [formValues?.fee?.value?.id]);

    return (
        <StyledClientDetailsModalForm onSubmit={handleSubmit(onSubmit)}>
            <StyledClientDetailsModalFormRow>
                {card ?
                    <>
                        {renderDetailsInfo(
                            messages.profile.generalInformation.name,
                            card?.businessName
                        )}
                        {renderDetailsInfo(
                            messages?.leadManagement?.labels?.annualFeesDollar,
                            card?.annualFee || '-'
                        )}
                    </>
                    : <Box display={"flex"} width={"100%"}>
                        <Box flex={4}>
                            <FormRowItem>
                                {connectField("client", {
                                    label: "Clients Won (Name)",
                                    options: leadManagement?.map((item: ClientEntity) => {
                                        return {
                                            id: item.id,
                                            label: item.businessName
                                        }
                                    }),
                                    searchOptions,
                                    required: true,
                                })(MaterialAutocompleteInput)}
                            </FormRowItem>
                        </Box>
                        <Box flex={1}>
                            <FormRowItem justifyContent={"end"}>
                                <StyledButton
                                    startIcon={<ResponsiveAddIcon />}
                                    variant="text"
                                    color="primary"
                                    label={"Create new"}
                                    onClick={() => {
                                        reduxDispatch(push({
                                            pathname: `${routes.leadManagement.root}/add`,
                                            state: { type: "Lead" }
                                        }))
                                    }}
                                />
                            </FormRowItem>
                        </Box>
                    </Box>}
            </StyledClientDetailsModalFormRow >
            <StyledClientDetailsModalFormRow>
                <FormRowItem>
                    {connectField("startMonth", {
                        label: messages?.leadManagement?.clientDetailsModal?.labels?.engagementStartMonth,
                        views: ['month'],
                        dateFormat: 'MMM',
                        required: true,
                        calendarHeight: 'auto'
                    })(MaterialDateInput)}
                </FormRowItem>
            </StyledClientDetailsModalFormRow>
            <StyledClientDetailsModalFormRow>
                <FormRowItem>
                    {connectField("taxAndAccountingDivision", {
                        label: messages?.leadManagement?.clientDetailsModal?.labels?.taxAndAccountingDivision,
                        required: true,
                    })(MaterialTextInput)}
                </FormRowItem>
                <FormRowItem>
                    {connectField("bookkeepingDivision", {
                        label: messages?.leadManagement?.clientDetailsModal?.labels?.bookkeepingDivision,
                        required: true,
                    })(MaterialTextInput)}
                </FormRowItem>
            </StyledClientDetailsModalFormRow>
            <StyledClientDetailsModalFormRow>
                <FormRowItem>
                    {connectField("fee", {
                        label: messages?.leadManagement?.clientDetailsModal?.labels?.onceOffFee,
                        options: [
                            { id: currentYear, label: `Year ${currentYear}` },
                            { id: currentYear + 1, label: `Year ${currentYear + 1}` },
                            { id: 'no', label: "No" },
                        ],
                        required: true,
                    })(MaterialAutocompleteInput)}
                </FormRowItem>
            </StyledClientDetailsModalFormRow>
            <StyledClientDetailsModalSeparator borderColor={"#D9D9D9"} />
            {
                renderCalculatedInfo(
                    `${messages?.leadManagement?.clientDetailsModal?.heading1} (${currentYear})`,
                    feeWonData?.currentYearAccountingFee || (getCalculatedInfo(currentYear).taxValue ?? getAnnualFeeDistribution()?.taxValueCurrentYear),
                    feeWonData?.currentYearBookkeepingFee ?? getCalculatedInfo(currentYear).bookkeepingValue ?? getAnnualFeeDistribution()?.bookKeepingValueCurrentYear
                )
            }
            <StyledClientDetailsModalSeparator borderColor={greyScaleColour.grey70} borderStyle="dashed" />
            {
                renderCalculatedInfo(
                    `${messages?.leadManagement?.clientDetailsModal?.heading2} (${currentYear + 1})`,
                    feeWonData?.nextYearAccountingFee || (getCalculatedInfo(currentYear + 1).taxValue ?? getAnnualFeeDistribution()?.taxValueNextYear),
                    feeWonData?.nextYearBookkeepingFee ?? getCalculatedInfo(currentYear + 1).bookkeepingValue ?? getAnnualFeeDistribution()?.bookKeepingValueNextYear
                )
            }
            {
                submitError && (
                    <FormRow>
                        <FormRowItem>
                            <FormError
                                message={
                                    messages?.leadManagement?.clientDetailsModal?.error?.serverError?.[submitError] ||
                                    messages?.measure?.financialOverview?.feesWonAndLost?.error?.serverError?.[submitError]
                                }
                            />
                        </FormRowItem>
                    </FormRow>
                )
            }
            <FormRow mt={"12px"} mb={0} justifyContent={"end"}>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={onCancel}
                    label={messages?.firmProfile?.teamStructure?.form?.cancel}
                />
                <Button
                    variant="contained"
                    type="submit"
                    disabled={submitting}
                    label={isEdit
                        ? 'Update'
                        :
                        messages?.settings?.systemPreferences?.feeLostReasonSetup?.form?.create}
                />
            </FormRow>
        </StyledClientDetailsModalForm >
    )
};

export default ClientDetailsModal;