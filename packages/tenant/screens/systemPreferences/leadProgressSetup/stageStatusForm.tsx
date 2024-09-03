import { useFormReducer, useOptions } from "@wizehub/common/hooks";
import {
  Button,
  Form,
  FormError,
  FormRow,
  FormRowItem,
  MaterialAutocompleteInput,
  MaterialTextInput,
  SwitchInput,
  Toast,
} from "@wizehub/components";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  HttpMethods,
  emptyValueValidator,
  mapIdNameToOptionWithoutCaptializing,
  required,
  trimWordWrapper,
} from "@wizehub/common/utils";
import { Status } from "@wizehub/common/models/modules";
import {
  LeadStageEntity,
  LeadStageStatus,
} from "@wizehub/common/models/genericEntities";
import messages from "../../../messages";
import { apiCall } from "@wizehub/common/redux/actions";
import { LEAD_STAGE_LISTING_API, LEAD_STAGE_STATUS_BY_ID } from "../../../api";
import { toast } from "react-toastify";
import { Id, MetaData, getDefaultMetaData } from "@wizehub/common/models";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
  isUpdate?: boolean;
  leadStageStatus?: LeadStageStatus;
}

interface FormData {
  name: string;
  status: Status;
  stage: {
    id: Id;
  };
}

const validators = {
  name: [
    required(
      messages?.settings?.systemPreferences?.practiceLeadStageSetup?.stageStatus
        ?.form?.validators?.name
    ),
    emptyValueValidator,
  ],
  stage: [
    required(
      messages?.settings?.systemPreferences?.practiceLeadStageSetup?.stageStatus
        ?.form?.validators?.stage
    ),
  ],
};

const getDefaultLeadStageFilter = (
  status?: string
): MetaData<LeadStageEntity> => ({
  ...getDefaultMetaData<LeadStageEntity>(),
  order: "name",
  filters: {
    status: Status.active,
  },
  allowedFilters: [status],
});

const StageStatusForm: React.FC<Props> = ({
  onCancel,
  onSuccess,
  leadStageStatus,
  isUpdate = false,
}) => {
  const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
  const {
    submitting,
    submitError,
    handleSubmit,
    connectField,
    change,
    setSubmitError,
  } = useFormReducer(validators);

  const reduxDispatch = useDispatch();

  const { options: leadStageOption, searchOptions } =
    useOptions<LeadStageEntity>(
      LEAD_STAGE_LISTING_API.replace(":id", tenantId),
      true,
      getDefaultLeadStageFilter()
    );

  const onSubmit = async (data: FormData) => {
    const sanitizeBody = {
      tenantId: tenantId,
      name: trimWordWrapper(data?.name),
      status: data?.status ? Status.active : Status.inactive,
      leadProgressStageId: data?.stage?.id,
    };

    return new Promise<void>((resolve, reject) => {
      reduxDispatch(
        apiCall(
          isUpdate
            ? `${LEAD_STAGE_STATUS_BY_ID}/${leadStageStatus?.id}`
            : LEAD_STAGE_STATUS_BY_ID,
          resolve,
          reject,
          isUpdate ? HttpMethods.PATCH : HttpMethods.POST,
          sanitizeBody
        )
      );
    })
      .then(() => {
        onSuccess();
        toast(
          <Toast
            text={
              isUpdate
                ? messages?.settings?.systemPreferences?.practiceLeadStageSetup
                    ?.leadStage?.form?.success?.updated
                : messages?.settings?.systemPreferences?.practiceLeadStageSetup
                    ?.leadStage?.form?.success?.created
            }
          />
        );
      })
      .catch((error) => {
        setSubmitError(error?.message);
      });
  };

  useEffect(() => {
    if (isUpdate) {
      change('name', leadStageStatus?.name);
      change('status', leadStageStatus?.status === 'ACTIVE');
      change('stage', {
        id: leadStageStatus?.leadProgressStage?.id,
        label: leadStageStatus?.leadProgressStage?.name,
      });
    }
  }, []);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow minWidth="530px">
        <FormRowItem>
          {connectField("name", {
            label:
              messages?.settings?.systemPreferences?.practiceLeadStageSetup
                ?.leadStage?.form?.name,
            required: true,
          })(MaterialTextInput)}
        </FormRowItem>
        <FormRowItem>
          {connectField("stage", {
            label:
              messages?.settings?.systemPreferences?.practiceLeadStageSetup
                ?.stageStatus?.form?.stage,
            required: true,
            enableClearable: true,
            searchOptions,
            options: leadStageOption?.map(mapIdNameToOptionWithoutCaptializing),
          })(MaterialAutocompleteInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          {connectField("status", {
            label:
              messages?.settings?.systemPreferences?.practiceLeadStageSetup
                ?.leadStage?.form?.status,
          })(SwitchInput)}
        </FormRowItem>
      </FormRow>
      {submitError && (
        <FormRow>
          <FormRowItem>
            <FormError
              message={
                messages?.settings?.systemPreferences?.practiceLeadStageSetup
                  ?.leadStage?.form?.error?.serverError?.[submitError]
              }
            />
          </FormRowItem>
        </FormRow>
      )}
      <FormRow justifyContent="end" mb={0}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onCancel}
          label={
            messages?.settings?.systemPreferences?.practiceLeadStageSetup
              ?.leadStage?.form?.cancelButton
          }
        />
        <Button
          variant="contained"
          type="submit"
          disabled={submitting}
          label={
            messages?.settings?.systemPreferences?.practiceLeadStageSetup
              ?.leadStage?.form?.[isUpdate ? "updateButton" : "createButton"]
          }
        />
      </FormRow>
    </Form>
  );
};

export default StageStatusForm;
