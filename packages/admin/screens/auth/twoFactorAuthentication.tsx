import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { IconButton } from '@mui/material';
import {
  HttpMethods,
  maskData,
} from '@wizehub/common/utils';
import {
  Button,
  Form,
  FormError,
  FormRow,
  FormRowItem,
  OTPInput,
} from '@wizehub/components';
import { useFormReducer } from '@wizehub/common/hooks';
import { useLocation } from 'react-router-dom';
import { apiCall } from '@wizehub/common/redux/actions';
import md5 from 'md5';
import { MethodType, MethodValue } from '@wizehub/common/models';
import messages from '../../messages';
import { routes } from '../../utils';
import { Container } from '../../components';
import {
  StyledArrowBackIcon,
  StyledFormContainer,
  StyledFormHeading,
  StyledFormSubHeading,
  StyledInfoContainer,
  StyledLink,
  StyledLinkContainer,
  StyledScreenWrapper,
} from './styles';
import SidePanel from './sidePanel';
import { TWO_FACTOR_AUTHENTICATION } from '../../api';
import { postLogin } from '../../redux/actions';

const validators = {};

const TwoFactorAuthentication = () => {
  const {
    submitting,
    handleSubmit,
    setSubmitError,
    submitError,
  } = useFormReducer(validators);
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(''));
  const reduxDispatch = useDispatch();
  const location = useLocation();
  const {
    email, password, method, senderDetail,
  } = location.state as {
    email: string;
    password: string;
    method: string;
    senderDetail: string;
  };

  const onSubmit = async () => new Promise<any>((resolve, reject) => {
    if (otpValues.some((value) => value === '')) {
      reject(new Error('Please fill in all OTP blocks'));
    } else {
      const sanitizedBody = {
        email,
        password: md5(password),
        tokenType: MethodValue.OTP,
        token: otpValues.join(''),
      };
      reduxDispatch(
        apiCall(
          TWO_FACTOR_AUTHENTICATION,
          resolve,
          reject,
          HttpMethods.POST,
          sanitizedBody,
          { ignoreStatus: true },
        ),
      );
    }
  })
    .then((res) => {
      reduxDispatch(postLogin(res?.token));
      reduxDispatch(push(routes.dashboard.root));
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
            <StyledFormHeading variant="h3">
              {messages?.twoFactorAuthentication?.heading}
            </StyledFormHeading>
            <StyledFormSubHeading>
              {messages?.twoFactorAuthentication?.subHeading}
              {method !== MethodType.EMAIL ? messages?.twoFactorAuthentication?.mobile : messages?.twoFactorAuthentication?.email}
              {method !== MethodType.EMAIL ? `"+${maskData(senderDetail)}"` : `"${maskData(senderDetail)}"`}
            </StyledFormSubHeading>
          </StyledInfoContainer>
          <Form
            onSubmit={handleSubmit(onSubmit)}
            style={{ padding: '24px 0px' }}
            hasPadding
          >
            <FormRow mb={3} width="386px">
              <FormRowItem>
                <OTPInput otpValues={otpValues} setOtpValues={setOtpValues} />
              </FormRowItem>
            </FormRow>
            {submitError && (
              <FormRow>
                <FormRowItem>
                  <FormError
                    message={
                      messages?.twoFactorAuthentication?.form?.errors?.enterOtp
                    }
                  />
                </FormRowItem>
              </FormRow>
            )}
            <FormRow mb={3}>
              <FormRowItem>
                <Button
                  label={messages?.twoFactorAuthentication?.form?.submitCta}
                  type="submit"
                  disabled={submitting}
                  variant="contained"
                  fullWidth
                />
              </FormRowItem>
            </FormRow>
            <FormRow>
              <FormRowItem justifyContent="center" alignItems="center">
                <StyledLinkContainer href={routes.login}>
                  <IconButton>
                    <StyledArrowBackIcon />
                  </IconButton>
                  <StyledLink>
                    {messages?.twoFactorAuthentication?.form?.logIn}
                  </StyledLink>
                </StyledLinkContainer>
              </FormRowItem>
            </FormRow>
          </Form>
        </StyledFormContainer>
      </StyledScreenWrapper>
    </Container>
  );
};

export default TwoFactorAuthentication;
