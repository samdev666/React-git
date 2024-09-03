import React from "react";
import { useDispatch } from "react-redux";
import {
  Button,
  Form,
  FormError,
  FormRow,
  FormRowItem,
} from "@wizehub/components";
import { useFormReducer } from "@wizehub/common/hooks";
import { HttpMethods } from "@wizehub/common/utils";
import { apiCall } from "@wizehub/common/redux/actions";
import messages from "../../../messages";
import { StyledTenantManagementNoteText } from "./styles";
import {
  StyledCautionIcon,
  StyledCautionText,
  StyledCautionTextContainer,
} from "../../firmProfile/styles";

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
  bodyText: string;
  cancelButton: string;
  confirmButton: string;
  api: string;
  deleteBody?: unknown;
  apiMethod?: HttpMethods;
  hasInfoText?: boolean;
  infoText?: string;
}

const DeleteCTAForm: React.FC<Props> = ({
  onSuccess,
  onCancel,
  api,
  bodyText,
  cancelButton,
  confirmButton,
  deleteBody,
  apiMethod,
  hasInfoText,
  infoText,
}) => {
  const reduxDispatch = useDispatch();

  const { submitting, submitError, handleSubmit, setSubmitError } =
    useFormReducer();

  const onSubmit = async () =>
    new Promise<void>((resolve, reject) => {
      reduxDispatch(
        apiCall(
          api,
          resolve,
          reject,
          apiMethod || HttpMethods.DELETE,
          deleteBody || null
        )
      );
    })
      .then(() => {
        onSuccess();
      })
      .catch((err) => {
        setSubmitError(err?.message);
      });

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow width="562px">
        <FormRowItem>
          <StyledTenantManagementNoteText>
            {bodyText}
          </StyledTenantManagementNoteText>
        </FormRowItem>
      </FormRow>
      {hasInfoText && (
        <FormRow>
          <FormRowItem>
            <StyledCautionTextContainer>
              <StyledCautionIcon />
              <StyledCautionText>{infoText}</StyledCautionText>
            </StyledCautionTextContainer>
          </FormRowItem>
        </FormRow>
      )}
      {submitError && (
        <FormRow>
          <FormRowItem>
            <FormError
              message={messages?.general?.error?.serverError?.[submitError]}
            />
          </FormRowItem>
        </FormRow>
      )}
      <FormRow justifyContent="flex-end" mb={0}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onCancel}
          label={cancelButton}
        />
        <Button
          variant="contained"
          color="error"
          type="submit"
          disabled={submitting}
          label={confirmButton}
        />
      </FormRow>
    </Form>
  );
};

export default DeleteCTAForm;
