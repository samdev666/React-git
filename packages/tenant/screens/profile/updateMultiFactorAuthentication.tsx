import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    Button,
    CustomRadioGroup,
    Form,
    FormError,
    FormRow,
    FormRowItem,
    PhoneInput,
    TextInput,
} from '@wizehub/components';
import { useFormReducer } from '@wizehub/common/hooks';
import {
    HttpMethods,
    emailValidator,
    requiredIf,
} from '@wizehub/common/utils';
import { Id, VerificationActionType } from '@wizehub/common/models';
import { apiCall } from '../../redux/actions';
import messages from '../../messages';
import { StyledUpdateMultiFactorAuthenticationNote } from './styles';
import {
    TWO_FA_AUTHENTICATION_METHOD,
    USER_TWO_FA_AUTENTICATION,
} from '../../api';
import { ReduxState } from '../../redux/reducers';
import { useSelector } from 'react-redux';

interface Props {
    onSuccess: () => void;
    onCancel: () => void;
    showUpdateMFAForm: (
        metaData?: Partial<{
            method: Id;
            value: string;
            verificationActionType: VerificationActionType;
            prevMethod: Id;
            prevMethodValue: string;
        }>
    ) => void;
    isEnable?: boolean;
}

interface FormData {
    methodId: Id;
    mobile?: string;
    email?: string;
}

const checkVerifyMethod = (type: string) => (formValues: { verifyMethod: { value: string } }) => formValues?.verifyMethod?.value === type;

const validators = {
    mobile: [
        requiredIf(
            messages?.activeTwoFactorAuthentication?.form?.validators?.phone,
            checkVerifyMethod('mobile'),
        ),
    ],
    email: [
        requiredIf(
            messages?.activeTwoFactorAuthentication?.form?.validators?.email,
            checkVerifyMethod('email'),
        ),
        emailValidator,
    ],
};

const UpdateMultiFactorAuthenticationForm: React.FC<Props> = ({
    onSuccess,
    onCancel,
    showUpdateMFAForm,
    isEnable,
}) => {
    const userProfile = useSelector((state: ReduxState) => state.profile);
    const reduxDispatch = useDispatch();
    const [twoFaMethods, setTwoFaMethods] = useState<
        Array<{
            id: Id;
            name: 'Mobile' | 'Email';
            code: 'SMS' | 'EMAIL';
        }>
    >([]);

    const {
        submitting,
        submitError,
        handleSubmit,
        connectField,
        change,
        formValues,
        setSubmitError,
    } = useFormReducer(validators);
    const onSubmit = async (data: FormData) => new Promise<any>((resolve, reject) => {
        const modifySanitizedBody = {
            methodId: twoFaMethods?.find(
                (item) => item.name.toLowerCase() === formValues?.verifyMethod?.value,
            )?.id,
            senderDetail:
                formValues?.verifyMethod?.value === 'mobile'
                    ? data?.mobile
                    : data?.email,
            actionType: VerificationActionType.MODIFY,
        };
        const setupModifyBody = {
            methodId: twoFaMethods?.find(
                (item) => item.name.toLowerCase() === formValues?.verifyMethod?.value,
            )?.id,
            senderDetail:
                formValues?.verifyMethod?.value === 'mobile'
                    ? data?.mobile
                    : data?.email,
        };
        reduxDispatch(
            apiCall(
                USER_TWO_FA_AUTENTICATION,
                resolve,
                reject,
                HttpMethods.POST,
                isEnable ? setupModifyBody : modifySanitizedBody,
            ),
        );
    })
        .then(async (res) => {
            onSuccess();
            showUpdateMFAForm({
                method: twoFaMethods?.find(
                    (item) => item.name.toLowerCase() === formValues?.verifyMethod?.value,
                )?.id,
                value:
                    formValues?.verifyMethod?.value === 'mobile'
                        ? data?.mobile
                        : data?.email,
                verificationActionType: VerificationActionType.MODIFY,
                prevMethod: !isEnable && res?.method?.id,
                prevMethodValue: !isEnable && res?.senderDetail,
            });
        })
        .catch((error) => {
            setSubmitError(error?.message);
        });

    useEffect(() => {
        change('verifyMethod', 'email');
        change('email', userProfile?.email);
        change('mobile', userProfile.phoneNumber && `${+userProfile.dialCode + userProfile.phoneNumber}`);
        reduxDispatch(
            apiCall(
                TWO_FA_AUTHENTICATION_METHOD,
                (res) => {
                    if (res) {
                        setTwoFaMethods(res);
                    }
                },
                (err) => err,
            ),
        );
    }, []);

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <FormRow width="562px">
                <FormRowItem>
                    <StyledUpdateMultiFactorAuthenticationNote>
                        {messages?.profile?.updateMultiFactorAuthentication?.note}
                    </StyledUpdateMultiFactorAuthenticationNote>
                </FormRowItem>
            </FormRow>
            <FormRow>
                {connectField('verifyMethod', {
                    options: [
                        {
                            value: 'email',
                            label: messages?.activeTwoFactorAuthentication?.form?.email,
                        },
                        {
                            value: 'mobile',
                            label:
                                messages?.activeTwoFactorAuthentication?.form?.mobileNumber,
                        },
                    ],
                    required: true,
                })(CustomRadioGroup)}
            </FormRow>
            <FormRow height={"70px"}>
                {formValues?.verifyMethod?.value === 'mobile' ? (
                    <FormRowItem>
                        {connectField('mobile', {
                            label: messages?.profile?.editForm?.phoneNumber,
                            type: 'number',
                            enableSearch: true,
                            required: true,
                            placeholder: messages?.profile?.editForm?.phoneNumber,
                        })(PhoneInput)}
                    </FormRowItem>
                ) : (
                    <FormRowItem>
                        {connectField('email', {
                            label:
                                messages?.activeTwoFactorAuthentication?.form?.emailAddress,
                            required: true,
                        })(TextInput)}
                    </FormRowItem>
                )}
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
                    label={messages?.general?.cancel}
                />
                <Button
                    variant="contained"
                    type="submit"
                    disabled={submitting}
                    label={messages?.general?.[isEnable ? 'setup' : 'update']}
                />
            </FormRow>
        </Form>
    );
};

export default UpdateMultiFactorAuthenticationForm;
