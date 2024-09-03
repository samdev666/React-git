import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button,
  Form,
  FormError,
  FormRow,
  FormRowItem,
  OTPInput,
} from '@wizehub/components';
import { useFormReducer } from '@wizehub/common/hooks';
import { HttpMethods } from '@wizehub/common/utils';
import { Id, VerificationActionType } from '@wizehub/common/models';
import { apiCall } from '../../redux/actions';
import messages from '../../messages';
import { StyledUpdateMultiFactorAuthenticationNote } from './styles';
import { VERIFY_USER_TWO_FA_AUTHENTICATION } from '../../api';

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
  method: Id;
  value: string;
  actionType: VerificationActionType;
  showRecoveryCodeForm: (metaData?: Partial<unknown>) => void;
}

const validators = {};

const VerifySecureCodeForm: React.FC<Props> = ({
  onSuccess,
  onCancel,
  method,
  value,
  actionType,
  showRecoveryCodeForm,
}) => {
  const reduxDispatch = useDispatch();

  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(''));

  const {
    submitting,
    submitError,
    handleSubmit,
    setSubmitError,
  } = useFormReducer(validators);

  const onSubmit = async () => new Promise<any>((resolve, reject) => {
    if (otpValues.some((value) => value === '')) {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject({ message: 'error.invalidOtp' });
    } else {
      const sanitizedBody = {
        actionType,
        methodId: method,
        senderDetail: value,
        verificationToken: otpValues.join(''),
      };
      reduxDispatch(
        apiCall(
          VERIFY_USER_TWO_FA_AUTHENTICATION,
          resolve,
          reject,
          HttpMethods.POST,
          sanitizedBody,
        ),
      );
    }
  })
    .then((res) => {
      onSuccess();
      showRecoveryCodeForm({
        data: res?.data,
      });
    })
    .catch((error) => {
      setSubmitError(error?.message);
    });

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow width="386px">
        <FormRowItem>
          <StyledUpdateMultiFactorAuthenticationNote>
            {messages?.profile?.verifySecureCode?.note}
            {method === '1' ? messages?.profile?.verifySecureCode?.mobile : messages?.profile?.verifySecureCode?.email}
            {method === '1' ? `"+${value}"` : `"${value}"`}
          </StyledUpdateMultiFactorAuthenticationNote>
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <OTPInput otpValues={otpValues} setOtpValues={setOtpValues} />
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
      <FormRow justifyContent="end" mb={0}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onCancel}
          label={messages?.profile?.verifySecureCode?.cancel}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={submitting}
          label={messages?.profile?.verifySecureCode?.verify}
        />
      </FormRow>
    </Form>
  );
};

export default VerifySecureCodeForm;
