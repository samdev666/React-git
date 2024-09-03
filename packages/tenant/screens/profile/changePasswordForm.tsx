import React from 'react';
import { useDispatch } from 'react-redux';
import md5 from 'md5';
import { toast } from 'react-toastify';
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
import {
    HttpMethods,
    confirmPassword,
    passwordValidator,
    required,
} from '@wizehub/common/utils';
import { apiCall } from '../../redux/actions';
import messages from '../../messages';
import { CHANGE_PASSWORD } from '../../api';

interface Props {
    onSuccess: () => void;
    onCancel: () => void;
}

const validators = {
    oldPassword: [
        required(messages?.profile?.changePasswordForm?.required?.oldPassword),
    ],
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

interface FormData {
    oldPassword: string;
    password: string;
}

const ChangePasswordForm: React.FC<Props> = ({ onSuccess, onCancel }) => {
    const reduxDispatch = useDispatch();

    const {
        submitting,
        submitError,
        handleSubmit,
        connectField,
        setSubmitError,
    } = useFormReducer(validators);

    const onSubmit = async (data: FormData) => new Promise<void>((resolve, reject) => {
        const sanitizedBody = {
            oldPassword: md5(data?.oldPassword),
            newPassword: md5(data?.password),
        };
        reduxDispatch(
            apiCall(
                CHANGE_PASSWORD,
                resolve,
                reject,
                HttpMethods.POST,
                sanitizedBody,
            ),
        );
    })
        .then(() => {
            onSuccess();
            toast(() => (
                <Toast subText={messages?.profile?.changePasswordForm?.success} />
            ));
        })
        .catch((error) => {
            console.log('error', error); // eslint-disable-line no-console
            setSubmitError(error?.message);
        });

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <FormRow marginBottom="16px">
                <FormRowItem>
                    {connectField('oldPassword', {
                        label: messages?.profile?.changePasswordForm?.oldPassword,
                        required: true,
                        maxWidth: '340px',
                    })(PasswordInput)}
                </FormRowItem>
            </FormRow>
            <FormRow marginBottom="16px">
                <FormRowItem>
                    {connectField('password', {
                        label: messages?.profile?.changePasswordForm?.newPassword,
                        required: true,
                        maxWidth: '340px',
                    })(PasswordInput)}
                </FormRowItem>
            </FormRow>
            <FormRow marginBottom="24px">
                <FormRowItem>
                    {connectField('confirmPassword', {
                        label: messages?.profile?.changePasswordForm?.confirmNewPassword,
                        required: true,
                        maxWidth: '340px',
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
            <FormRow justifyContent="end" marginBottom="0px">
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
                    label={messages?.general?.update}
                />
            </FormRow>
        </Form>
    );
};

export default ChangePasswordForm;
