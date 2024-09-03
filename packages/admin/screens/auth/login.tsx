import React from 'react';
import { useDispatch } from 'react-redux';
import md5 from 'md5';
import { push } from 'connected-react-router';
import { HttpMethods, emailValidator, required } from '@wizehub/common/utils';
import {
  Button,
  Form,
  FormError,
  FormRow,
  FormRowItem,
  PasswordInput,
  TextInput,
} from '@wizehub/components';
import { useFormReducer } from '@wizehub/common/hooks';
import CustomChip from '@wizehub/components/chip';
import { apiCall } from '@wizehub/common/redux/actions';
import { fontSize, fontWeight } from '@wizehub/common/theme/style.typography';
import messages from '../../messages';
import { routes } from '../../utils';
import { Container } from '../../components';
import {
  StyledFormContainer,
  StyledFormHeading,
  StyledFormSubHeading,
  StyledInfoContainer,
  StyledLink,
  StyledScreenWrapper,
} from './styles';
import { postLogin } from '../../redux/actions';
import SidePanel from './sidePanel';
import { LOGIN } from '../../api';

interface FormData{
  email: string;
  password: string;
}

const validators = {
  email: [
    required(messages?.login?.form?.errors?.emailRequired),
    emailValidator,
  ],
  password: [required(messages?.login?.form?.errors?.passwordRequired)],
};

const Login = () => {
  const {
    submitting,
    submitError,
    handleSubmit,
    connectField,
    setSubmitError,
  } = useFormReducer(validators);
  const reduxDispatch = useDispatch();

  const onSubmit = async (data: FormData) => new Promise<any>((resolve, reject) => {
    reduxDispatch(
      apiCall(
        LOGIN,
        resolve,
        reject,
        HttpMethods.POST,
        {
          email: data?.email,
          password: md5(data?.password),
        },
        { ignoreStatus: true },
      ),
    );
  })
    .then((res) => {
      if (res.token) {
        reduxDispatch(postLogin(res?.token));
        reduxDispatch(push(routes.dashboard.root));
      } else {
        reduxDispatch(
          push(routes.twoFaAuth, {
            email: data?.email,
            password: data?.password,
            method: res?.data?.method?.name,
            senderDetail: res?.data?.senderDetail,
          }),
        );
      }
    })
    .catch((error) => {
      setSubmitError(error?.message);
    });

  return (
    <Container hideSidebar noPadding hasHeader={false}>
      <StyledScreenWrapper>
        <SidePanel />
        <StyledFormContainer>
          <CustomChip
            label={messages?.login?.saasOwner}
            color="primary"
            variant="filled"
            fontSize={fontSize.b2}
            fontWeight={fontWeight.medium}
          />
          <StyledInfoContainer>
            <StyledFormHeading variant="h1">
              {messages?.login?.heading}
            </StyledFormHeading>
            <StyledFormSubHeading>
              {messages?.login?.subHeading}
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
            <FormRow mb={1}>
              <FormRowItem>
                {connectField('password', {
                  label: messages?.login?.form?.password,
                  required: true,
                })(PasswordInput)}
              </FormRowItem>
            </FormRow>
            <FormRow mb={3}>
              <FormRowItem justifyContent="flex-end">
                <StyledLink href={routes.forgotPassword}>
                  {messages?.login?.form?.forgotPassword}
                </StyledLink>
              </FormRowItem>
            </FormRow>
            {submitError && (
              <FormRow>
                <FormRowItem>
                  <FormError
                    message={messages?.login?.form?.errors?.[submitError]}
                  />
                </FormRowItem>
              </FormRow>
            )}
            <FormRow width="366px">
              <FormRowItem>
                <Button
                  label={messages?.login?.form?.logIn}
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  disabled={submitting}
                />
              </FormRowItem>
            </FormRow>
          </Form>
        </StyledFormContainer>
      </StyledScreenWrapper>
    </Container>
  );
};

export default Login;
