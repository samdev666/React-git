import React, { useState } from 'react';
import { Container } from '../../components';
import {
    StyledAccountText,
    StyledForgotPasswordLink,
    StyledFormContainer,
    StyledLinkText,
    StyledScreenWrapper
} from './styles';
import { SidePanel } from '.';
import {
    Button,
    Form,
    FormError,
    FormRow,
    FormRowItem,
    PasswordInput,
    TextInput
} from '@wizehub/components';
import { useFormReducer } from '@wizehub/common/hooks';
import { routes } from '../../utils';
import {
    HttpMethods,
    decodeBase64,
    emailValidator,
    emptyValueValidator,
    required
} from '@wizehub/common/utils';
import { useDispatch } from 'react-redux';
import md5 from 'md5';
import messages from '../../messages';
import { apiCall, postLogin, updateAuthenticationStatus, updateTenantId } from '../../redux/actions';
import { push } from 'connected-react-router';
import {
    StyledInfoContainer,
    StyledFormHeading,
    StyledFormSubHeading
} from '@wizehub/admin/screens/auth/styles';
import { GET_TENANT_FORMS, GET_USER_LINKED_GROUPS, GET_USER_LINKED_TENANTS, LOGIN } from '../../api';
import { GroupData, TenantData, TenantFormData } from '@wizehub/common/models/genericEntities';
import { TenantFormsCode } from '../../utils/constant';
import { AuthenticationStatus, Right } from '../../redux/reducers/auth';

interface FormData {
    email: string;
    password: string;
}

const validators = {
    email: [
        required(messages?.signup?.form?.errors?.emailRequired),
        emailValidator,
    ],
    password: [
        required(messages?.signup?.form?.errors?.passwordRequired),
        emptyValueValidator
    ]
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

    const getTenantForms = async (id: string) => {
        return new Promise((resolve, reject) => {
            reduxDispatch(
                apiCall(
                    GET_TENANT_FORMS.replace(':tenantId', id).replace(
                        ':code',
                        TenantFormsCode.businessAssessment
                    ),
                    resolve,
                    reject,
                    HttpMethods.GET
                )
            );
        })
            .then((res: TenantFormData) => {
                if (res?.completionStatus === 'COMPLETED') {
                    return res?.completionStatus;
                }
            })
            .catch((error) => {
                console.log(error, 'error');
            });
    };

    const getLinkedTenantsData = async () => {
        return (
            new Promise((resolve, reject) => {
                reduxDispatch(
                    apiCall(
                        GET_USER_LINKED_TENANTS,
                        resolve,
                        reject,
                        HttpMethods.GET,
                    )
                );
            })
                .then(async (response: TenantData[]) => {
                    if (response?.length === 1) {
                        reduxDispatch(updateTenantId(response?.[0]?.id))
                        const rights = decodeBase64(localStorage.getItem("rights"));

                        if (rights?.includes(Right.BUSINESS_ASSESSMENT)) {
                            const data = await getTenantForms(response?.[0]?.id);
                            if (data) {
                                reduxDispatch(updateAuthenticationStatus(AuthenticationStatus.AUTHENTICATED));
                                reduxDispatch(push(routes.overview));
                            } else {
                                reduxDispatch(updateAuthenticationStatus(AuthenticationStatus.INCOMPLETE_BUSINESS_ASSESSMENT));
                                reduxDispatch(push(routes.businessScoreccards.businessAssessment));
                            }
                        } else {
                            reduxDispatch(updateAuthenticationStatus(AuthenticationStatus.AUTHENTICATED));
                            reduxDispatch(push(routes.overview));
                        }
                    } else {
                        reduxDispatch(updateAuthenticationStatus(AuthenticationStatus.SET_TENANT));
                        reduxDispatch(push(routes.tenantAccess))
                    }
                })
                .catch((error) => {
                    reduxDispatch(push(routes.noAccess))
                })
        )
    }

    const onSubmit = async (data: FormData) => {
        return new Promise<any>((resolve, reject) => {
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
                if (res?.token) {
                    reduxDispatch(postLogin(res?.token));
                    getLinkedTenantsData();
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
    };

    return (
        <Container noPadding hideSidebar hasHeader={false}>
            <StyledScreenWrapper>
                <SidePanel />
                <StyledFormContainer>
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
                        <FormRow marginBottom="24px">
                            <FormRowItem>
                                {connectField('email', {
                                    label: messages?.login?.form?.email,
                                    required: true,
                                })(TextInput)}
                            </FormRowItem>
                        </FormRow>
                        <FormRow marginBottom="8px">
                            <FormRowItem>
                                {connectField('password', {
                                    label: messages?.login?.form?.password,
                                    required: true,
                                })(PasswordInput)}
                            </FormRowItem>
                        </FormRow>
                        <FormRow marginBottom="24px">
                            <FormRowItem justifyContent="flex-end">
                                <StyledForgotPasswordLink href={routes.forgotPassword}>
                                    {messages?.login?.form?.forgotPassword}
                                </StyledForgotPasswordLink>
                            </FormRowItem>
                        </FormRow>
                        {submitError && (
                            <FormRow>
                                <FormRowItem>
                                    <FormError
                                        message={messages?.login?.form?.errors?.serverError?.[submitError]}
                                    />
                                </FormRowItem>
                            </FormRow>
                        )}
                        <FormRow marginBottom="24px">
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
                        <FormRow width="366px">
                            <FormRowItem>
                                <StyledAccountText>
                                    {messages?.login?.form?.noAccount}
                                    <StyledLinkText href={routes.signup}>
                                        {messages?.login?.form?.createAccount}
                                    </StyledLinkText>
                                </StyledAccountText>
                            </FormRowItem>
                        </FormRow>
                    </Form>
                </StyledFormContainer>
            </StyledScreenWrapper>
        </Container>
    );
};

export default Login;
