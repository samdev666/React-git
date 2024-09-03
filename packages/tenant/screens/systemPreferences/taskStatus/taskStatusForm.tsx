import { useFormReducer } from "@wizehub/common/hooks";
import {
  Button,
  Form,
  FormError,
  FormRow,
  FormRowItem,
  MaterialTextInput,
  SwitchInput,
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
import { TaskStatusEntity } from "@wizehub/common/models/genericEntities";
import messages from "../../../messages";
import { apiCall } from "../../../redux/actions";
import { TASK_STATUS_BY_ID } from "../../../api";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
  isUpdate?: boolean;
  taskStatus?: TaskStatusEntity;
}

interface FormData {
  name: string;
  status: Status;
}

const validators = {
  name: [
    required(
      messages?.settings?.systemPreferences?.taskStatus?.form?.validators.name
    ),
    emptyValueValidator,
  ],
};

const TaskStatusForm: React.FC<Props> = ({
  onCancel,
  onSuccess,
  taskStatus,
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
    const sanitizBody = {
      name: trimWordWrapper(data?.name),
      status: data?.status ? Status.active : Status.inactive,
      code: trimWordWrapper(data?.name?.toUpperCase()),
      tenantId: tenantId,
    };

    return new Promise<void>((resolve, reject) => {
      reduxDispatch(
        apiCall(
          isUpdate
            ? `${TASK_STATUS_BY_ID}/${taskStatus?.id}`
            : TASK_STATUS_BY_ID,
          resolve,
          reject,
          isUpdate ? HttpMethods.PATCH : HttpMethods.POST,
          sanitizBody
        )
      );
    })
      .then(() => {
        onSuccess();
      })
      .catch((err) => {
        setSubmitError(err?.message);
      });
  };

  useEffect(() => {
    if (isUpdate) {
      change("name", taskStatus?.name);
      change("status", taskStatus?.status === "ACTIVE");
    }
  }, []);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow minWidth="530px">
        <FormRowItem>
          {connectField("name", {
            label:
              messages?.settings?.systemPreferences?.taskStatus?.form?.name,
            required: true,
          })(MaterialTextInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          {connectField("status", {
            label:
              messages?.settings?.systemPreferences?.taskStatus?.form?.status,
          })(SwitchInput)}
        </FormRowItem>
      </FormRow>
      {submitError && (
        <FormRow>
          <FormRowItem>
            <FormError
              message={
                messages?.settings?.systemPreferences?.taskStatus?.form?.error
                  ?.serverError?.[submitError]
              }
            />
          </FormRowItem>
        </FormRow>
      )}
      <FormRow justifyContent="end" marginBottom="0px">
        <Button
          variant="outlined"
          color="secondary"
          onClick={onCancel}
          disabled={submitting}
          label={messages?.settings?.systemPreferences?.taskStatus?.form.cancel}
        />
        <Button
          variant="contained"
          type="submit"
          disabled={submitting}
          label={
            messages?.settings?.systemPreferences?.taskStatus?.form?.[
              isUpdate ? "update" : "create"
            ]
          }
        />
      </FormRow>
    </Form>
  );
};

export default TaskStatusForm;
