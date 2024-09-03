import React, { useEffect, useState } from 'react';
import { Container } from '../../components';
import {
    StyledAccountText,
    StyledDot,
    StyledFormContainer,
    StyledLinkText,
    StyledRegisterInfoContainer,
    StyledScreenWrapper,
    StyledTermsAndConditionsText
} from './styles';
import { SidePanel } from '.';
import {
    Button,
    CheckboxComponent,
    Form,
    FormError,
    FormRow,
    FormRowItem,
    MaterialAutocompleteInput,
    MaterialDateInput,
    PasswordInput,
    PhoneInput,
    TextInput,
    Toast,
} from '@wizehub/components';
import { useFormReducer } from '@wizehub/common/hooks';
import { routes } from '../../utils';
import {
    HttpMethods,
    confirmPassword,
    emailValidator,
    emptyValueValidator,
    encodeBase64,
    passwordValidator,
    required,
    requiredIf,
    trimWordWrapper
} from '@wizehub/common/utils';
import { fetchUserAccessRights, GET_COUNTRIES, SIGNUP } from '../../api';
import { useDispatch } from 'react-redux';
import md5 from 'md5';
import messages from '../../messages';
import { apiCall, fetchBaseData, fetchUserProfile, updateAuthenticationStatus, updateRights, updateTenantId, updateToken } from '../../redux/actions';
import { push } from 'connected-react-router';
import { toast } from 'react-toastify';
import { brandColour } from '@wizehub/common/theme/style.palette';
import { StyledFormHeading, StyledFormSubHeading } from '@wizehub/admin/screens/auth/styles';
import { Typography } from '@mui/material';
import { AuthenticationStatus, defaultUserRights } from '../../redux/reducers/auth';
import { StyledCalendarIcon } from '@wizehub/components/dateRangePicker/styles';
import moment from 'moment';

interface CountryData {
    id: string;
    name: string;
    isoCode: string;
    dialCode: string;
    currencyCode: string;
    currencySymbol: string;
    status: string;
}

const validators = {
    firstName: [
        required(messages?.signup?.form?.errors?.firstNameRequired),
        emptyValueValidator,
    ],
    lastName: [
        required(messages?.signup?.form?.errors?.lastNameRequired),
        emptyValueValidator,
    ],
    businessName: [
        required(messages?.signup?.form?.errors?.businessNameRequired),
        emptyValueValidator,
    ],
    financialYear: [
        required(messages?.signup?.form?.errors?.financialYearRequired)
    ],
    email: [
        required(messages?.signup?.form?.errors?.emailRequired),
        emailValidator,
    ],
    country: [
        required(messages?.signup?.form?.errors?.countryRequired)
    ],
    city: [
        required(messages?.signup?.form?.errors?.cityRequired),
        emptyValueValidator,
    ],
    password: [
        required(messages?.signup?.form?.errors?.passwordRequired),
        passwordValidator
    ],
    confirmPassword: [
        required(messages?.signup?.form?.errors?.confirmPasswordRequired),
        confirmPassword(messages?.signup?.form?.errors?.confirmPasswordMatchRequired),
    ],
    termsAndConditions: [
        required(messages?.signup?.form?.errors?.termsAndConditionsRequired),
    ],
};

const SignUp = () => {
    const [countries, setCountries] = useState<CountryData[]>([]);
    const {
        submitting,
        submitError,
        handleSubmit,
        connectField,
        setSubmitError,
        formValues,
        change
    } = useFormReducer(validators);

    const reduxDispatch = useDispatch();

    const getCountries = async () => {
        return (
            new Promise((resolve, reject) => {
                reduxDispatch(
                    apiCall(
                        GET_COUNTRIES,
                        resolve,
                        reject,
                        HttpMethods.GET
                    )
                );
            })
                .then((res: any) => {
                    setCountries(res?.records)
                })
                .catch((err) => {
                    setCountries(err?.records)
                    setSubmitError(err?.message);
                })
        )
    }

    useEffect(() => {
        getCountries();
    }, [])

    const handleCountryValue = (countryData: CountryData) => {
        if (countryData) {
            const dataValue = {
                id: countryData?.id,
                label: countryData?.name,
                dialCode: countryData?.dialCode
            }
            change('country', dataValue);
        }
    }

    useEffect(() => {
        if (countries?.length) {
            const countryData = countries?.find(val => val.name === "Australia");
            handleCountryValue(countryData);
        }
    }, [countries])

    useEffect(() => {
        if (formValues?.phone?.value) {
            const countryData = countries?.find(val => {
                return val?.dialCode === `+${formValues?.phone?.value.replace(/\D/g, '')}`
            })
            handleCountryValue(countryData);
        }
    }, [formValues?.phone])

    const onSubmit = async (data: any) => {
        return new Promise<any>((resolve, reject) => {
            const sanitizedBody = {
                firstName: trimWordWrapper(data?.firstName),
                lastName: trimWordWrapper(data?.lastName),
                abn: data?.abn ? trimWordWrapper(data?.abn) : null,
                email: data?.email,
                businessName: data?.businessName ? trimWordWrapper(data?.businessName) : '',
                dialCode: data?.phone?.split('-')[0],
                phoneNumber: data?.phone?.split('-')[1] || null,
                countryId: data?.country?.id,
                city: trimWordWrapper(data?.city),
                password: md5(data?.password),
                termsAccepted: data?.termsAndConditions,
                financialStartMonth: moment(formValues?.financialYear?.value).toDate().getMonth() + 1
            }

            reduxDispatch(
                apiCall(
                    SIGNUP,
                    resolve,
                    reject,
                    HttpMethods.POST,
                    sanitizedBody
                )
            );
        })
            .then((res: any) => {
                if (res?.token && res?.data) {
                    toast(() => (
                        <Toast subText={messages?.signup?.form?.success?.created} />
                    ));
                    localStorage.setItem('rights', encodeBase64(defaultUserRights));
                    reduxDispatch(updateTenantId(res?.data?.id))
                    reduxDispatch(updateToken(res?.token, AuthenticationStatus.ONBOARDING))
                    reduxDispatch(fetchBaseData());
                    reduxDispatch(fetchUserProfile());
                    // reduxDispatch(push(routes.fileUpload));
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
                    <StyledRegisterInfoContainer>
                        <StyledFormHeading variant="h1">
                            {messages?.signup?.heading}
                        </StyledFormHeading>
                        <StyledFormSubHeading>
                            {messages?.signup?.subHeading}
                        </StyledFormSubHeading>
                    </StyledRegisterInfoContainer>
                    <Form
                        onSubmit={handleSubmit(onSubmit)}
                        style={{ padding: '24px 0px' }}
                        hasPadding
                    >
                        <FormRow marginBottom="24px">
                            <FormRowItem width="50%">
                                {connectField('firstName', {
                                    label: messages?.signup?.form?.firstName,
                                    required: true,
                                    maxWidth: '242px'
                                })(TextInput)}
                            </FormRowItem>
                            <FormRowItem width="50%">
                                {connectField('lastName', {
                                    label: messages?.signup?.form?.lastName,
                                    required: true,
                                    maxWidth: '242px'
                                })(TextInput)}
                            </FormRowItem>
                        </FormRow>
                        <FormRow marginBottom="24px">
                            <FormRowItem>
                                {connectField('businessName', {
                                    label: messages?.signup?.form?.businessName,
                                    required: true
                                })(TextInput)}
                            </FormRowItem>
                            <FormRowItem>
                                {connectField('financialYear', {
                                    label: messages?.signup?.form?.financialYear,
                                    views: ['month'],
                                    slots: {
                                        openPickerIcon: () => <StyledCalendarIcon />,
                                    },
                                    dateFormat: 'MMMM',
                                    calendarHeight: 'auto',
                                    required: true,
                                    maxWidth: 'calc(100% - 55px)',
                                    isCustomMonthHeader: true,
                                })(MaterialDateInput)}
                            </FormRowItem>
                        </FormRow>
                        <FormRow marginBottom="24px">
                            <FormRowItem>
                                {connectField('phone', {
                                    label: messages?.signup?.form?.mobileNumber,
                                    maxWidth: '242px'
                                })(PhoneInput)}
                            </FormRowItem>
                            <FormRowItem>
                                {connectField('email', {
                                    label: messages?.signup?.form?.email,
                                    required: true,
                                    maxWidth: '242px'
                                })(TextInput)}
                            </FormRowItem>
                        </FormRow>
                        <FormRow marginBottom="24px">
                            <FormRowItem>
                                {connectField('country', {
                                    label: messages?.signup?.form?.country,
                                    options: countries?.map((val: any) => {
                                        return {
                                            id: val.id,
                                            label: val.name,
                                            dialCode: val.dialCode
                                        }
                                    }),
                                    required: true,
                                    maxWidth: '242px'
                                })(MaterialAutocompleteInput)}
                            </FormRowItem>
                            <FormRowItem>
                                {connectField('city', {
                                    label: messages?.signup?.form?.city,
                                    required: true,
                                    maxWidth: '242px'
                                })(TextInput)}
                            </FormRowItem>
                        </FormRow>
                        <FormRow marginBottom="32px">
                            <FormRowItem>
                                {connectField('password', {
                                    label: messages?.signup?.form?.password,
                                    required: true,
                                    maxWidth: '242px'
                                })(PasswordInput)}
                            </FormRowItem>
                            <FormRowItem>
                                {connectField('confirmPassword', {
                                    label: messages?.signup?.form?.confirmPassword,
                                    required: true,
                                    maxWidth: '242px'
                                })(PasswordInput)}
                            </FormRowItem>
                        </FormRow>
                        {submitError && (
                            <FormRow>
                                <FormRowItem>
                                    <FormError
                                        message={messages?.signup?.form?.errors?.serverError?.[submitError]}
                                    />
                                </FormRowItem>
                            </FormRow>
                        )}
                        <FormRow marginBottom="10px">
                            <FormRowItem>
                                {connectField('termsAndConditions', {
                                    label: (
                                        <>
                                            <StyledTermsAndConditionsText>
                                                {messages?.signup?.form?.agree}
                                            </StyledTermsAndConditionsText>
                                            <StyledLinkText
                                                href={"https://www.wizementoring.com/terms-and-conditions/"}
                                                target='_blank'
                                            >
                                                {messages?.signup?.form?.termsAndConditions}
                                            </StyledLinkText>
                                            <StyledTermsAndConditionsText>
                                                {messages?.signup?.form?.and}
                                            </StyledTermsAndConditionsText>
                                            <StyledLinkText
                                                href={"https://www.wizementoring.com/privacy-policy/"}
                                                target='_blank'
                                            >
                                                {messages?.signup?.form?.privacyPolicy}
                                            </StyledLinkText>
                                            <StyledDot>.</StyledDot>
                                        </>
                                    ),
                                    required: true,
                                })(CheckboxComponent)}
                            </FormRowItem>
                        </FormRow>
                        <FormRow marginBottom="32px" width={"500px"}>
                            <FormRowItem>
                                <Button
                                    label={messages?.signup?.form?.buttonText}
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    fullWidth
                                    disabled={submitting}
                                />
                            </FormRowItem>
                        </FormRow>
                        <FormRow>
                            <FormRowItem>
                                <StyledAccountText>
                                    {messages?.signup?.form?.alreadyHaveAccount}
                                    <StyledLinkText href={routes.login}>
                                        {messages?.signup?.form?.login}
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

export default SignUp;
