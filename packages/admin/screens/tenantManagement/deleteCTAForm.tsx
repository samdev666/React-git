import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Button,
  Form,
  FormError,
  FormRow,
  FormRowItem,
} from '@wizehub/components';
import { useFormReducer } from '@wizehub/common/hooks';
import { HttpMethods } from '@wizehub/common/utils';
import { apiCall } from '../../redux/actions';
import messages from '../../messages';
import { StyledTenantManagementNoteText } from './styles';

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
  bodyText: string;
  cancelButton: string;
  confirmButton: string;
  api: string;
  deleteBody?: unknown;
  apiMethod?: HttpMethods;
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
}) => {
  const reduxDispatch = useDispatch();

  const {
    submitting, submitError, handleSubmit, setSubmitError,
  } = useFormReducer();

  const onSubmit = async () => new Promise<void>((resolve, reject) => {
    const sanitizedBody = {};
    reduxDispatch(
      apiCall(
        api,
        resolve,
        reject,
        apiMethod || HttpMethods.DELETE,
        deleteBody || sanitizedBody,
      ),
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
