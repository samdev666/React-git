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
import { Id, VerificationActionType } from '@wizehub/common/models';
import { apiCall } from '../../redux/actions';
import messages from '../../messages';
import { StyledUpdateMultiFactorAuthenticationNote } from './styles';
import { USER_TWO_FA_AUTENTICATION } from '../../api';

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
  showVerifySecureCodeForm: (
    metaData?: Partial<{
      method: Id;
      value: string;
      verificationActionType: VerificationActionType;
    }>
  ) => void;
}

const DisableMFAForm: React.FC<Props> = ({
  onSuccess,
  onCancel,
  showVerifySecureCodeForm,
}) => {
  const reduxDispatch = useDispatch();

  const {
    submitting,
    submitError,
    handleSubmit,
    setSubmitError,
  } = useFormReducer();

  const onSubmit = async () => new Promise<any>((resolve, reject) => {
    reduxDispatch(apiCall(USER_TWO_FA_AUTENTICATION, resolve, reject));
  })
    .then(async (res) => new Promise<void>((resolve, reject) => {
      const sanitizedBody = {
        methodId: res[0]?.method?.id,
        senderDetail: res[0]?.senderDetail,
        actionType: VerificationActionType.DISABLE,
      };
      reduxDispatch(
        apiCall(
          USER_TWO_FA_AUTENTICATION,
          resolve,
          reject,
          HttpMethods.POST,
          sanitizedBody,
        ),
      );
    })
      .then(() => {
        onSuccess();
        showVerifySecureCodeForm({
          method: res[0]?.method?.id,
          value: res[0]?.senderDetail,
          verificationActionType: VerificationActionType.DISABLE,
        });
      })
      .catch((err) => {
        setSubmitError(err.message);
      }))
    .catch((err) => {
      setSubmitError(err.message);
    });

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow width="562px">
        <FormRowItem>
          <StyledUpdateMultiFactorAuthenticationNote>
            {messages?.profile?.disableMFAForm?.note}
          </StyledUpdateMultiFactorAuthenticationNote>
        </FormRowItem>
      </FormRow>
      {submitError && (
        <FormRow>
          <FormRowItem>
            <FormError
              message={
                messages?.profile?.form?.errors?.serverErrors?.[submitError]
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
          label={messages?.profile?.disableMFAForm?.cancel}
        />
        <Button
          variant="contained"
          color="error"
          type="submit"
          disabled={submitting}
          label={messages?.profile?.disableMFAForm?.disableMFA}
        />
      </FormRow>
    </Form>
  );
};

export default DisableMFAForm;
