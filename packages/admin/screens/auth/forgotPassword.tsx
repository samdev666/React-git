import React from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { push } from 'connected-react-router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import { HttpMethods, emailValidator, required } from '@wizehub/common/utils';
import {
  Button,
  Form,
  FormRow,
  FormRowItem,
  TextInput,
  Toast,
} from '@wizehub/components';
import { useFormReducer } from '@wizehub/common/hooks';
import { greyScaleColour } from '@wizehub/common/theme/style.palette';
import { fontSize } from '@wizehub/common/theme/style.typography';
import {
  StyledInfoContainer, StyledFormHeading, StyledFormSubHeading, StyledLink, StyledLinkContainer,
} from '@wizehub/admin/screens/auth/styles';
import messages from '../../messages';

import { routes } from '../../utils';

import { Container } from '../../components';
import {
  StyledFormContainer,
  StyledScreenWrapper,
} from './styles';
import { apiCall } from '../../redux/actions';
import { RESET_PASSWORD_REQUEST_LINK } from '../../api';
import SidePanel from './sidePanel';

const validators = {
  email: [
    required(messages?.login?.form?.errors?.emailRequired),
    emailValidator,
  ],
};

interface FormData{
  email: string;
}

const ForgotPassword = () => {
  const {
    submitting, handleSubmit, connectField, setSubmitError,
  } = useFormReducer(validators);
  const reduxDispatch = useDispatch();

  const onSubmit = async (data: FormData) => new Promise<void>((resolve, reject) => {
    reduxDispatch(
      apiCall(
        RESET_PASSWORD_REQUEST_LINK,
        resolve,
        reject,
        HttpMethods.POST,
        { email: data?.email },
      ),
    );
  })
    .then(() => {
      toast(() => (
        <Toast subText={messages?.forgotPassword?.form?.success} />
      ));
      setTimeout(() => {
        reduxDispatch(push(routes.login));
      }, 2000);
    })
    .catch((err) => {
      toast(() => (
        <Toast subText={messages?.forgotPassword?.form?.success} />
      ));
      setTimeout(() => {
        reduxDispatch(push(routes.login));
      }, 2000);
      setSubmitError(err.message);
    });

  return (
    <Container hideSidebar noMargin noPadding hasHeader={false}>
      <StyledScreenWrapper>
        <SidePanel />
        <StyledFormContainer>
          <StyledInfoContainer>
            <StyledFormHeading variant="h3">
              {messages?.forgotPassword?.heading}
            </StyledFormHeading>
            <StyledFormSubHeading>
              {messages?.forgotPassword?.subHeading}
            </StyledFormSubHeading>
          </StyledInfoContainer>
          <Form
            onSubmit={handleSubmit(onSubmit)}
            style={{ padding: '24px 0px' }}
            hasPadding
          >
            <FormRow mb={3}>
              <FormRowItem>
                {connectField('email', {
                  label: messages?.login?.form?.email,
                  required: true,
                })(TextInput)}
              </FormRowItem>
            </FormRow>
            <FormRow mb={3}>
              <FormRowItem>
                <Button
                  label={messages?.forgotPassword?.form?.submitCta}
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
                    <ArrowBackIcon style={{
                      color: greyScaleColour.grey100,
                      width: fontSize.h5,
                      height: fontSize.h5,
                    }}
                    />
                  </IconButton>
                  <StyledLink>
                    {messages?.forgotPassword?.form?.logIn}
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

export default ForgotPassword;
