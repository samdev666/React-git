import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { IconButton } from '@mui/material';
import {
    decodeBase64,
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
    StyledForgotPasswordLoginLink,
    StyledFormContainer,
    StyledFormHeading,
    StyledFormSubHeading,
    StyledInfoContainer,
    StyledLink,
    StyledLinkContainer,
    StyledResentOtpText,
    StyledScreenWrapper,
} from './styles';
import { GET_TENANT_FORMS, GET_USER_LINKED_TENANTS, LOGIN, TWO_FACTOR_AUTHENTICATION } from '../../api';
import { postLogin, updateAuthenticationStatus, updateTenantId } from '../../redux/actions';
import { SidePanel } from '.';
import { TenantData, TenantFormData } from '@wizehub/common/models/genericEntities';
import { TenantFormsCode } from '../../utils/constant';
import { AuthenticationStatus, Right } from '../../redux/reducers/auth';

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
                        HttpMethods.GET
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

    const resendOtp = async () => {
        return new Promise<any>((resolve, reject) => {
            reduxDispatch(
                apiCall(
                    LOGIN,
                    resolve,
                    reject,
                    HttpMethods.POST,
                    {
                        email: email,
                        password: md5(password),
                    },
                    { ignoreStatus: true },
                ),
            );
        })
            .then((res) => {
                console.log(res, "res");
            })
            .catch((error) => {
                setSubmitError(error?.message);
            });
    }

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
            getLinkedTenantsData();
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
                            <FormRowItem justifyContent="center" alignItems="center" marginLeft={"20px"}>
                                <StyledResentOtpText onClick={() => resendOtp()}>
                                    Resend OTP
                                </StyledResentOtpText>
                            </FormRowItem>
                        </FormRow>
                        <FormRow>
                            <FormRowItem justifyContent="center" alignItems="center">
                                <StyledLinkContainer href={routes.login}>
                                    <IconButton>
                                        <StyledArrowBackIcon />
                                    </IconButton>
                                    <StyledForgotPasswordLoginLink>
                                        {messages?.twoFactorAuthentication?.form?.logIn}
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

export default TwoFactorAuthentication;
