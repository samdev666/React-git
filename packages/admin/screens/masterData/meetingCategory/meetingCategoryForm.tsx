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
import {
  CategoryEntity,
  FeeLostReasonEntity,
} from "@wizehub/common/models/genericEntities";
import messages from "../../../messages";
import { apiCall } from "../../../redux/actions";
import { CATEGORY_BY_ID } from "../../../api";

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
  isUpdate?: boolean;
  meetingCategory?: CategoryEntity;
}

interface FormData {
  name: string;
  status: Status;
}

const validators = {
  name: [
    required(
      messages?.sidebar?.menuItems?.secondaryMenu?.subMenuItems?.masterData
        ?.subItems?.meetingCategory?.form?.validators.name
    ),
    emptyValueValidator,
  ],
};

const MeetingCategoryForm: React.FC<Props> = ({
  onCancel,
  onSuccess,
  meetingCategory,
  isUpdate = false,
}) => {
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
    };

    return new Promise<void>((resolve, reject) => {
      reduxDispatch(
        apiCall(
          isUpdate
            ? `${CATEGORY_BY_ID}/${meetingCategory?.id}`
            : CATEGORY_BY_ID,
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
      change("name", meetingCategory?.name);
      change("status", meetingCategory?.status === "ACTIVE");
    }
  }, []);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow minWidth="530px">
        <FormRowItem>
          {connectField("name", {
            label:
              messages?.sidebar?.menuItems?.secondaryMenu?.subMenuItems
                ?.masterData?.subItems?.meetingCategory?.form?.name,
            required: true,
          })(MaterialTextInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          {connectField("status", {
            label:
              messages?.sidebar?.menuItems?.secondaryMenu?.subMenuItems
                ?.masterData?.subItems?.meetingCategory?.form?.status,
          })(SwitchInput)}
        </FormRowItem>
      </FormRow>
      {submitError && (
        <FormRow>
          <FormRowItem>
            <FormError
              message={
                messages?.sidebar?.menuItems?.secondaryMenu?.subMenuItems
                  ?.masterData?.subItems?.meetingCategory?.form?.error
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
          label={
            messages?.sidebar?.menuItems?.secondaryMenu?.subMenuItems
              ?.masterData?.subItems?.meetingCategory?.form.cancel
          }
        />
        <Button
          variant="contained"
          type="submit"
          disabled={submitting}
          label={
            messages?.sidebar?.menuItems?.secondaryMenu?.subMenuItems
              ?.masterData?.subItems?.meetingCategory?.form?.[
              isUpdate ? "update" : "create"
            ]
          }
        />
      </FormRow>
    </Form>
  );
};

export default MeetingCategoryForm;
