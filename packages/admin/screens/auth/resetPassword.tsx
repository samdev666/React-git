import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import md5 from 'md5';
import { toast } from 'react-toastify';
import { push } from 'connected-react-router';
import {
  HttpMethods,
  confirmPassword,
  passwordValidator,
  required,
} from '@wizehub/common/utils';
import {
  Button,
  Form,
  FormError,
  FormRow,
  FormRowItem,
  PasswordInput,
  Toast,
} from '@wizehub/components';
import { useFormReducer } from '@wizehub/common/hooks';
import messages from '../../messages';
import { routes } from '../../utils';
import { Container } from '../../components';
import {
  StyledFormContainer,
  StyledFormHeading,
  StyledFormSubHeading,
  StyledInfoContainer,
  StyledScreenWrapper,
} from './styles';
import { apiCall } from '../../redux/actions';
import { RESET_PASSWORD } from '../../api';
import SidePanel from './sidePanel';

const validators = {
  password: [
    required(messages?.profile?.changePasswordForm?.required?.password),
    passwordValidator,
  ],
  confirmPassword: [
    required(messages?.profile?.changePasswordForm?.required?.confirmPassword),
    confirmPassword(
      messages?.profile?.changePasswordForm?.required?.passwordNotMatched,
    ),
  ],
};

interface FormData{
  confirmPassword: string;
  password: string;
}

const ResetPassword = () => {
  const {
    submitting,
    submitError,
    handleSubmit,
    connectField,
    setSubmitError,
  } = useFormReducer(validators);
  const reduxDispatch = useDispatch();
  const { token } = useParams<{ token?: string }>();

  const onSubmit = async (data: FormData) => new Promise<void>((resolve, reject) => {
    const sanitizedBody = {
      token,
      confirmPassword: md5(data.confirmPassword),
      password: md5(data.password),
    };
    reduxDispatch(
      apiCall(
        RESET_PASSWORD,
        resolve,
        reject,
        HttpMethods.POST,
        sanitizedBody,
      ),
    );
  })
    .then(() => {
      toast(() => (
        <Toast subText={messages?.profile?.changePasswordForm?.success} />
      ));
      setTimeout(() => {
        reduxDispatch(push(routes.login));
      }, 2000);
    })
    .catch((error) => {
      setSubmitError(error?.message);
    });

  return (
    <Container hideSidebar noMargin noPadding hasHeader={false}>
      <StyledScreenWrapper>
        <SidePanel />
        <StyledFormContainer>
          <StyledInfoContainer>
            <StyledFormHeading>
              {messages?.resetPassword?.heading}
            </StyledFormHeading>
            <StyledFormSubHeading>
              {messages?.resetPassword?.subHeading}
            </StyledFormSubHeading>
          </StyledInfoContainer>
          <Form
            onSubmit={handleSubmit(onSubmit)}
            style={{ padding: '24px 0px', maxWidth: '340px' }}
            hasPadding
          >
            <FormRow mb={3} width="340px">
              <FormRowItem>
                {connectField('password', {
                  label: messages?.resetPassword?.form?.newPassword,
                  required: true,
                })(PasswordInput)}
              </FormRowItem>
            </FormRow>
            <FormRow mb={3}>
              <FormRowItem>
                {connectField('confirmPassword', {
                  label: messages?.resetPassword?.form?.confirmNewPassword,
                  required: true,
                })(PasswordInput)}
              </FormRowItem>
            </FormRow>
            {submitError && (
              <FormRow>
                <FormRowItem>
                  <FormError
                    message={
                      messages?.general?.error?.serverError?.[submitError]
                    }
                  />
                </FormRowItem>
              </FormRow>
            )}
            <FormRow>
              <FormRowItem>
                <Button
                  label={messages?.resetPassword?.form?.submitCta}
                  type="submit"
                  disabled={submitting}
                  variant="contained"
                  fullWidth
                />
              </FormRowItem>
            </FormRow>
          </Form>
        </StyledFormContainer>
      </StyledScreenWrapper>
    </Container>
  );
};

export default ResetPassword;
