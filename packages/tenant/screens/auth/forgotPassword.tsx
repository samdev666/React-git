import React from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { push } from 'connected-react-router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import messages from '../../messages';
import { HttpMethods, emailValidator, required } from '@wizehub/common/utils';

import { routes } from '../../utils';

import {
    Button,
    Form,
    FormRow,
    FormRowItem,
    TextInput,
    Toast,
} from '@wizehub/components';
import { Container } from '../../components';
import {
    StyledForgotPasswordLoginLink,
    StyledFormContainer,
    StyledScreenWrapper,
} from './styles';
import { useFormReducer } from '@wizehub/common/hooks';
import { apiCall } from '../../redux/actions';
import { RESET_PASSWORD_REQUEST_LINK } from '../../api';
import { colors } from '@wizehub/common/theme/style.palette';
import { SidePanel } from '.';
import { StyledInfoContainer, StyledFormHeading, StyledFormSubHeading, StyledLink, StyledLinkContainer } from '@wizehub/admin/screens/auth/styles';

const validators = {
    email: [
        required(messages?.login?.form?.errors?.emailRequired),
        emailValidator,
    ],
};

const ForgotPassword = () => {
    const { submitting, handleSubmit, connectField, setSubmitError } =
        useFormReducer(validators);
    const reduxDispatch = useDispatch();

    const onSubmit = async (data: any) =>
        new Promise<any>((resolve, reject) => {
            reduxDispatch(
                apiCall(
                    RESET_PASSWORD_REQUEST_LINK,
                    resolve,
                    reject,
                    HttpMethods.POST,
                    { email: data?.email }
                )
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

    const iconStyle = {
        color: colors.grey100,
        width: '18px',
        height: '18px',
    };

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
                        <FormRow marginBottom="24px">
                            <FormRowItem>
                                {connectField('email', {
                                    label: messages?.login?.form?.email,
                                    required: true,
                                })(TextInput)}
                            </FormRowItem>
                        </FormRow>
                        <FormRow marginBottom="24px">
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
                                    <IconButton style={{ padding: 0, marginRight: '2px' }}>
                                        <ArrowBackIcon style={iconStyle} />
                                    </IconButton>
                                    <StyledForgotPasswordLoginLink>
                                        {messages?.forgotPassword?.form?.logIn}
                                    </StyledForgotPasswordLoginLink>
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
