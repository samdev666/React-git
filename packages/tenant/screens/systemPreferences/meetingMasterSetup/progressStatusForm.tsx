import { useFormReducer } from "@wizehub/common/hooks";
import {
  Button,
  Form,
  FormError,
  FormRow,
  FormRowItem,
  MaterialTextInput,
  SwitchInput,
  Toast,
} from "@wizehub/components";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  HttpMethods,
  emptyValueValidator,
  required,
  trimWordWrapper,
} from "@wizehub/common/utils";
import { Status } from "@wizehub/common/models/modules";
import {
  FeeLostReasonEntity,
  LeadStageEntity,
  ProgressEntity,
} from "@wizehub/common/models/genericEntities";
import messages from "../../../messages";
import { apiCall } from "@wizehub/common/redux/actions";
import {
  FEE_LOST_REASON_BY_ID,
  LEAD_STAGE_BY_ID,
  MEETING_PROGRESS_BY_ID,
} from "../../../api";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
  isUpdate?: boolean;
  progressEntity?: ProgressEntity;
}

interface FormData {
  name: string;
  status: Status;
}

const validators = {
  name: [
    required(
      messages?.settings?.systemPreferences?.meetingMasterSetup
        ?.progressStatusPage?.form?.validators?.name
    ),
    emptyValueValidator,
  ],
};

const ProgressStatusForm: React.FC<Props> = ({
  onCancel,
  onSuccess,
  progressEntity,
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

  const onSubmit = async (data: FormData) => {
    const sanitizeBody = {
      tenantId: tenantId,
      name: trimWordWrapper(data?.name),
      status: data.status ? Status.active : Status.inactive,
    };

    return new Promise<void>((resolve, reject) => {
      reduxDispatch(
        apiCall(
          isUpdate
            ? `${MEETING_PROGRESS_BY_ID}/${progressEntity?.id}`
            : MEETING_PROGRESS_BY_ID,
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
              messages?.settings?.systemPreferences?.meetingMasterSetup
                ?.progressStatusPage?.form?.success?.[
                isUpdate ? "updated" : "created"
              ]
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
      change("name", progressEntity?.name);
      change("status", progressEntity?.status === "ACTIVE");
    }
  }, []);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow minWidth="530px">
        <FormRowItem>
          {connectField("name", {
            label:
              messages?.settings?.systemPreferences?.meetingMasterSetup
                ?.progressStatusPage?.form?.name,
            required: true,
          })(MaterialTextInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          {connectField("status", {
            label:
              messages?.settings?.systemPreferences?.meetingMasterSetup
                ?.progressStatusPage?.form?.status,
          })(SwitchInput)}
        </FormRowItem>
      </FormRow>
      {submitError && (
        <FormRow>
          <FormRowItem>
            <FormError
              message={
                messages?.settings?.systemPreferences?.meetingMasterSetup
                  ?.progressStatusPage?.form?.error?.serverError?.[submitError]
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
          disabled={submitting}
          label={
            messages?.settings?.systemPreferences?.meetingMasterSetup
              ?.progressStatusPage?.form?.cancel
          }
        />
        <Button
          variant="contained"
          type="submit"
          disabled={submitting}
          label={
            messages?.settings?.systemPreferences?.meetingMasterSetup
              ?.progressStatusPage?.form?.[isUpdate ? "update" : "create"]
          }
        />
      </FormRow>
    </Form>
  );
};

export default ProgressStatusForm;
