import { Button, Form, FormRow, FormRowItem, MaterialAutocompleteInput, MaterialTextInput } from "@wizehub/components";
import React, { useEffect, useState } from "react";
import { StyledClientDetailsModalSeparator } from "./styles";
import { useFormReducer, useOptions } from "@wizehub/common/hooks";
import messages from "../../../messages";
import { LEAD_PROGRESS_API, LEAD_STAGE_STATUS_LISTING_API, PEOPLE_LISTING_API } from "../../../api";
import { LeadProgressEntity, LeadStageStatus, PersonBasicDetailEntity } from "@wizehub/common/models/genericEntities";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import { HttpMethods, mapIdFullNameToOption, mapIdNameToOptionWithoutCaptializing, required } from "@wizehub/common/utils";
import { LeadProgressStatusOptions } from "../../../utils/constant";
import { apiCall } from "../../../redux/actions";
import { useDispatch } from "react-redux";
import { getOption } from "./addEditLeadClientForm";
import { Option } from "@wizehub/common/models";

interface Props {
    onCancel: () => void;
    onSuccess: () => void;
    clientId: string;
    isEdit?: boolean;
    id?: number;
}

const validators = {
    actionStep: [
        required(messages?.leadManagement?.leadProgress?.form?.validators?.actionStepRequired)
    ],
    status: [
        required(messages?.leadManagement?.form?.error?.statusRequired)
    ],
    who: [
        required(messages?.leadManagement?.leadProgress?.form?.validators?.employeeRequired)
    ]
};

const AddEditProgressForm: React.FC<Props> = ({
    onCancel, onSuccess, clientId, isEdit, id
}) => {
    const reduxDispatch = useDispatch();
    const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
    const [leadProgressData, setLeadProgressData] = useState(null);

    const {
        submitting,
        handleSubmit,
        connectField,
        change,
        setSubmitError
    } = useFormReducer(validators);

    const {
        options: stageStatusOptions,
        searchOptions: stageStatusSearchOptions,
    } = useOptions<LeadStageStatus>(
        `${LEAD_STAGE_STATUS_LISTING_API.replace(":id", tenantId)}`,
        true
    );

    const {
        options: peopleOptions,
        searchOptions: peopleSearchOptions,
    } = useOptions<PersonBasicDetailEntity>(
        `${PEOPLE_LISTING_API.replace(":tenantId", tenantId)}`,
        true
    );

    const getLeadProgressDataById = async () => {
        return new Promise<void>((resolve, reject) => {
            reduxDispatch(
                apiCall(
                    `${LEAD_PROGRESS_API}/${id}`,
                    resolve,
                    reject,
                    HttpMethods.GET
                )
            );
        })
            .then((res: any) => {
                setLeadProgressData(res);
            })
            .catch((error) => {
                console.log(error?.message)
            });
    }

    const onSubmit = async (data: any) => {
        let sanitizeBody: any = {
            tenantId: tenantId,
            clientId: clientId,
            leadStatusId: data?.actionStep?.id,
            status: data?.status?.id,
            actionBy: data?.who?.id
        };

        return new Promise<void>((resolve, reject) => {
            reduxDispatch(
                apiCall(
                    isEdit ? `${LEAD_PROGRESS_API}/${id}` : LEAD_PROGRESS_API,
                    resolve,
                    reject,
                    isEdit ? HttpMethods.PATCH : HttpMethods.POST,
                    sanitizeBody
                )
            );
        })
            .then(() => {
                onSuccess();
            })
            .catch((error) => {
                setSubmitError(error?.message);
            });
    };

    useEffect(() => {
        getLeadProgressDataById();
    }, [id])

    useEffect(() => {
        if (isEdit && leadProgressData) {
            change('actionStep', getOption(leadProgressData?.leadStatus));
            change('status', leadProgressData?.status
                ? {
                    id: leadProgressData?.status,
                    label: LeadProgressStatusOptions?.find((item: Option) => item.id === leadProgressData?.status)?.label,
                } : '');
            change('who', leadProgressData?.actionBy?.id
                ? {
                    id: leadProgressData?.actionBy?.id,
                    label: `${leadProgressData?.actionBy?.firstName} ${leadProgressData?.actionBy?.lastName}`,
                } : ''
            );
        }
    }, [leadProgressData])

    return (
        <Form style={{ width: '562px' }} onSubmit={handleSubmit(onSubmit)}>
            <FormRow mb={"16px"}>
                <FormRowItem>
                    {connectField("actionStep", {
                        label: "Action step",
                        options: stageStatusOptions?.map(mapIdNameToOptionWithoutCaptializing),
                        searchOptions: stageStatusSearchOptions,
                        required: true,
                    })(MaterialAutocompleteInput)}
                </FormRowItem>
                <FormRowItem>
                    {connectField("status", {
                        label: messages?.settings?.systemPreferences?.leadIndustrySetup?.status,
                        options: LeadProgressStatusOptions,
                        required: true,
                    })(MaterialAutocompleteInput)}
                </FormRowItem>
            </FormRow>
            <FormRow mb={"16px"}>
                <FormRowItem xs={6}>
                    {connectField("who", {
                        label: "Who",
                        options: peopleOptions?.map(mapIdFullNameToOption),
                        searchOptions: peopleSearchOptions,
                        required: true,
                    })(MaterialAutocompleteInput)}
                </FormRowItem>
            </FormRow>
            <StyledClientDetailsModalSeparator borderColor={"#D9D9D9"} />
            <FormRow mt={"28px"} mb={0} justifyContent={"end"}>
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
                    label={isEdit ? 'Update' : messages?.plan?.budgetAndCapacity?.teamCapacityTab?.teamMemberForm?.add}
                />
            </FormRow>
        </Form>
    )
};

export default AddEditProgressForm;