import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
    Button,
    Form,
    FormError,
    FormRow,
    FormRowItem,
    OTPInput,
    Toast,
} from '@wizehub/components';
import { useFormReducer } from '@wizehub/common/hooks';
import { HttpMethods } from '@wizehub/common/utils';
import { Id, VerificationActionType } from '@wizehub/common/models';
import { apiCall } from '../../redux/actions';
import messages from '../../messages';
import {
    StyledSeparator,
    StyledUpdateMultiFactorAuthenticationNote,
} from './styles';
import { VERIFY_USER_TWO_FA_AUTHENTICATION } from '../../api';

interface Props {
    onSuccess: () => void;
    onCancel: () => void;
    method: Id;
    value: string;
    prevMethod: Id;
    prevMethodValue: string;
    actionType: VerificationActionType;
}

const ChangeMFAForm: React.FC<Props> = ({
    onSuccess,
    onCancel,
    method,
    value,
    actionType,
    prevMethod,
    prevMethodValue,
}) => {
    const reduxDispatch = useDispatch();

    const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(''));
    const [prevMethodOtpValues, setPrevMethodOtpValues] = useState<string[]>(
        Array(6).fill(''),
    );

    const {
        submitting,
        submitError,
        handleSubmit,
        setSubmitError,
    } = useFormReducer();

    const onSubmit = async () => new Promise<void>((resolve, reject) => {
        if (otpValues.some((value) => value === '')) {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({ message: 'error.invalidOtp' });
        } else {
            const sanitizedBody = {
                actionType,
                methodId: method,
                senderDetail: value,
                verificationToken: prevMethodOtpValues.join(''),
                newMethodVerificationToken: otpValues.join(''),
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
        .then(() => {
            onSuccess();
            toast(() => (
                <Toast text={messages?.profile?.updateVerifyCode?.success} />
            ));
        })
        .catch((error) => {
            setSubmitError(error?.message);
        });

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <FormRow width="386px">
                <FormRowItem>
                    <StyledUpdateMultiFactorAuthenticationNote>
                        {messages?.profile?.updateVerifyCode?.note}
                    </StyledUpdateMultiFactorAuthenticationNote>
                </FormRowItem>
            </FormRow>
            <FormRow width="386px">
                <FormRowItem>
                    <StyledUpdateMultiFactorAuthenticationNote>
                        {messages?.profile?.updateVerifyCode?.deviceNote}
                        {prevMethod === '1' ? messages?.profile?.updateVerifyCode?.mobile : messages?.profile?.updateVerifyCode?.email}
                        {prevMethod === '1' ? `"+${prevMethodValue}"` : `"${prevMethodValue}"`}
                    </StyledUpdateMultiFactorAuthenticationNote>
                </FormRowItem>
            </FormRow>
            <FormRow>
                <FormRowItem>
                    <OTPInput
                        otpValues={prevMethodOtpValues}
                        setOtpValues={setPrevMethodOtpValues}
                    />
                </FormRowItem>
            </FormRow>
            <FormRow>
                <FormRowItem>
                    <StyledSeparator />
                </FormRowItem>
            </FormRow>
            <FormRow width="386px">
                <FormRowItem>
                    <StyledUpdateMultiFactorAuthenticationNote>
                        {messages?.profile?.updateVerifyCode?.deviceNote}
                        {method === '1' ? 'mobile number ' : 'email address '}
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
                <FormRow maxWidth="386px">
                    <FormRowItem>
                        <FormError
                            message={messages?.profile?.updateVerifyCode?.error?.serverError?.[submitError]}
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

export default ChangeMFAForm;
