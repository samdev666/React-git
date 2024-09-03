import React, { useEffect, useState } from "react";
import {
    StyledButton,
    StyledClientDetailsModalForm,
    StyledClientDetailsModalFormRow,
    StyledClientDetailsModalInfoHeading,
    StyledClientDetailsModalSeparator
} from "../../leadManagement/leadBoard/styles";
import { Box } from "@mui/material";
import {
    Button,
    FormError,
    FormRow,
    FormRowItem,
    MaterialAutocompleteInput,
    MaterialTextInput
} from "@wizehub/components";
import { ResponsiveAddIcon } from "../../systemPreferences/launchPadSetup/launchPadSetup";
import messages from "../../../messages";
import { useFormReducer, useOptions } from "@wizehub/common/hooks";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { ClientEntity, FeeLostReasonEntity, FeeLostsEntity } from "@wizehub/common/models/genericEntities";
import { FEE_LOST_REASON_LISTING_API, FEE_LOSTS_API, GET_TENANT_CLIENTS } from "../../../api";
import { getDefaultClientPortfolioFilter } from "../../clientPortfolio.tsx/tabularView";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import { apiCall } from "../../../redux/actions";
import { HttpMethods, mapIdNameToOption, required } from "@wizehub/common/utils";
import { useDispatch } from "react-redux";
import { Id } from "react-toastify";
import {
    StyledLostClientFormFooterContainer,
    StyledLostClientFormFooterHeading,
    StyledLostClientFormFooterSubContainer,
    StyledLostClientFormFooterSubHeading
} from "./styles";
import { getDefaultFeeLostReasonFilter } from "../../systemPreferences/feeLostReasonSetup/feeLostReason";

interface Props {
    onCancel: () => void;
    onSuccess: () => void;
    isEdit?: boolean;
    clientId?: Id;
    feeWonAndLostId: Id;
    feeWonAndLostTeamId: Id;
}

const validators = {
    client: [
        required(messages?.measure?.financialOverview?.feesWonAndLost?.lostClientsTab?.validators?.clientRequired),
    ]
};

const LostClientsForm: React.FC<Props> = ({
    onCancel,
    onSuccess,
    isEdit,
    clientId,
    feeWonAndLostId,
    feeWonAndLostTeamId
}) => {
    const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
    const [feeLostData, setFeeLostData] = useState<FeeLostsEntity>(null);
    const reduxDispatch = useDispatch();
    const {
        options: leadManagement,
        searchOptions,
    } = useOptions<ClientEntity>(
        GET_TENANT_CLIENTS.replace(":tenantId", tenantId),
        true,
        getDefaultClientPortfolioFilter(true),
    );

    const {
        options: feeLostReason,
        searchOptions: feeLostReasonSearchOptions,
    } = useOptions<FeeLostReasonEntity>(
        FEE_LOST_REASON_LISTING_API.replace(":id", tenantId),
        true,
        getDefaultFeeLostReasonFilter()
    );

    const getFeeLostsDataById = async () => {
        return reduxDispatch(
            apiCall(
                `${FEE_LOSTS_API}/${clientId}`,
                (resolve) => {
                    setFeeLostData(resolve);
                },
                (reject) => { }
            )
        );
    }

    const {
        submitting,
        handleSubmit,
        connectField,
        change,
        submitError,
        setSubmitError,
        formValues
    } = useFormReducer(validators);

    const onSubmit = async (data: any) => {
        const sanitizedBody: any = {
            tenantId: tenantId,
            feeWonLostId: Number(feeWonAndLostId),
            feeWonLostTeamId: Number(feeWonAndLostTeamId),
            clientId: data?.client?.id,
            currentYearAccountingFee: Number(data?.currentYearAccountingFee),
            currentYearBookkeepingFee: Number(data?.currentYearBookkeepingFee),
            nextYearAccountingFee: Number(data?.nextYearAccountingFee),
            nextYearBookkeepingFee: Number(data?.nextYearBookkeepingFee),
            feeLostReasonId: data?.reason?.id
        };

        return new Promise<void>((resolve, reject) => {
            reduxDispatch(
                apiCall(
                    isEdit ? `${FEE_LOSTS_API}/${clientId}` : FEE_LOSTS_API,
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
        if (isEdit) {
            getFeeLostsDataById();
        }
    }, [isEdit])

    useEffect(() => {
        if (isEdit && feeLostData) {
            change('client', {
                id: feeLostData?.client?.id,
                label: feeLostData?.client?.businessName
            });
            change('currentYearAccountingFee', feeLostData?.currentYearAccountingFee);
            change('currentYearBookkeepingFee', feeLostData?.currentYearBookkeepingFee);
            change('nextYearAccountingFee', feeLostData?.nextYearAccountingFee);
            change('nextYearBookkeepingFee', feeLostData?.nextYearBookkeepingFee);
            change('reason', feeLostData?.feeLostReason?.id && {
                id: feeLostData?.feeLostReason?.id,
                label: feeLostData?.feeLostReason?.name
            });
        }
    }, [feeLostData])

    return (
        <StyledClientDetailsModalForm onSubmit={handleSubmit(onSubmit)}>
            <StyledClientDetailsModalFormRow>
                <Box display={"flex"} width={"100%"}>
                    <Box flex={4}>
                        <FormRowItem>
                            {connectField("client", {
                                label: "Clients Lost (Name)",
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
                                label={
                                    "Create new"
                                }
                                onClick={() => { }}
                            />
                        </FormRowItem>
                    </Box>
                </Box>
            </StyledClientDetailsModalFormRow>
            <StyledClientDetailsModalInfoHeading>
                {`${messages?.measure?.financialOverview?.feesWonAndLost?.lostClientsTab?.subHeading1} (${new Date().getFullYear()})`}
            </StyledClientDetailsModalInfoHeading>
            <StyledClientDetailsModalFormRow mt={"10px"}>
                <FormRowItem>
                    {connectField("currentYearAccountingFee", {
                        label: messages?.leadManagement?.clientDetailsModal?.labels?.taxAndAccountingDivision,
                    })(MaterialTextInput)}
                </FormRowItem>
                <FormRowItem>
                    {connectField("currentYearBookkeepingFee", {
                        label: messages?.leadManagement?.clientDetailsModal?.labels?.bookkeepingDivision,
                    })(MaterialTextInput)}
                </FormRowItem>
            </StyledClientDetailsModalFormRow>
            <StyledClientDetailsModalSeparator borderColor={"#D9D9D9"} borderStyle="dashed" />
            <StyledClientDetailsModalInfoHeading sx={{ marginTop: "16px" }}>
                {`${messages?.measure?.financialOverview?.feesWonAndLost?.lostClientsTab?.subHeading2} (${new Date().getFullYear() + 1})`}
            </StyledClientDetailsModalInfoHeading>
            <StyledClientDetailsModalFormRow mt={"10px"}>
                <FormRowItem>
                    {connectField("nextYearAccountingFee", {
                        label: messages?.leadManagement?.clientDetailsModal?.labels?.taxAndAccountingDivision,
                    })(MaterialTextInput)}
                </FormRowItem>
                <FormRowItem>
                    {connectField("nextYearBookkeepingFee", {
                        label: messages?.leadManagement?.clientDetailsModal?.labels?.bookkeepingDivision,
                    })(MaterialTextInput)}
                </FormRowItem>
            </StyledClientDetailsModalFormRow>
            <StyledClientDetailsModalFormRow>
                <FormRowItem>
                    {connectField("reason", {
                        label: messages?.measure?.financialOverview?.feesWonAndLost?.lostClientsTab?.leavingReason,
                        options: feeLostReason?.map(mapIdNameToOption),
                        searchOptions: feeLostReasonSearchOptions
                    })(MaterialAutocompleteInput)}
                </FormRowItem>
            </StyledClientDetailsModalFormRow>
            <StyledClientDetailsModalSeparator borderColor={"#D9D9D9"} />
            <StyledLostClientFormFooterContainer>
                <StyledLostClientFormFooterSubContainer>
                    <StyledLostClientFormFooterHeading>
                        {messages?.measure?.financialOverview?.feesWonAndLost?.lostClientsTab?.feesLost}
                    </StyledLostClientFormFooterHeading>
                    <InfoOutlinedIcon sx={{ width: '15px', height: '15px', color: "#737373" }} />
                </StyledLostClientFormFooterSubContainer>
                <StyledLostClientFormFooterSubHeading>
                    {messages?.measure?.financialOverview?.feesWonAndLost?.lostClientsTab?.footerHeading}
                    <div>
                        {messages?.measure?.financialOverview?.feesWonAndLost?.lostClientsTab?.footerSubHeading}
                    </div>
                </StyledLostClientFormFooterSubHeading>
            </StyledLostClientFormFooterContainer>
            {submitError && (
                <FormRow>
                    <FormRowItem>
                        <FormError
                            message={
                                messages?.measure?.financialOverview?.feesWonAndLost?.error?.serverError?.[submitError]
                            }
                        />
                    </FormRowItem>
                </FormRow>
            )}
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
                        ? messages?.general?.update
                        : messages?.settings?.systemPreferences?.feeLostReasonSetup?.form?.create}
                />
            </FormRow>
        </StyledClientDetailsModalForm>
    )
};

export default LostClientsForm;