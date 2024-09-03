import React from 'react';
import { useDispatch } from 'react-redux';
import {
    Button,
    Form,
    FormError,
    FormRow,
    FormRowItem,
} from '@wizehub/components';
import { useFormReducer } from '@wizehub/common/hooks';
import { HttpMethods } from '@wizehub/common/utils';
import { Id, VerificationActionType } from '@wizehub/common/models';
import { apiCall } from '../../redux/actions';
import messages from '../../messages';
import { StyledUpdateMultiFactorAuthenticationNote } from './styles';
import { USER_TWO_FA_AUTENTICATION } from '../../api';

interface Props {
    onSuccess: () => void;
    onCancel: () => void;
    showVerifySecureCodeForm: (
        metaData?: Partial<{
            method: Id;
            value: string;
            verificationActionType: VerificationActionType;
        }>
    ) => void;
}

const EnableMFAForm: React.FC<Props> = ({
    onSuccess,
    onCancel,
    showVerifySecureCodeForm,
}) => {
    const reduxDispatch = useDispatch();

    const {
        submitting,
        submitError,
        handleSubmit,
        setSubmitError,
    } = useFormReducer();

    const onSubmit = async () => new Promise<any>((resolve, reject) => {
        reduxDispatch(apiCall(USER_TWO_FA_AUTENTICATION, resolve, reject));
    })
        .then(async (res) => new Promise<void>((resolve, reject) => {
            const sanitizedBody = {
                methodId: res[0]?.method?.id,
                senderDetail: res[0]?.senderDetail,
                actionType: VerificationActionType.ENABLE,
            };
            reduxDispatch(
                apiCall(
                    USER_TWO_FA_AUTENTICATION,
                    resolve,
                    reject,
                    HttpMethods.POST,
                    sanitizedBody,
                ),
            );
        })
            .then(() => {
                onSuccess();
                showVerifySecureCodeForm({
                    method: res[0]?.method?.id,
                    value: res[0]?.senderDetail,
                    verificationActionType: VerificationActionType.ENABLE,
                });
            })
            .catch((err) => {
                setSubmitError(err.message);
            }))
        .catch((err) => {
            setSubmitError(err.message);
        });

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <FormRow width="562px">
                <FormRowItem>
                    <StyledUpdateMultiFactorAuthenticationNote>
                        {messages?.profile?.enableMFAForm?.note}
                    </StyledUpdateMultiFactorAuthenticationNote>
                </FormRowItem>
            </FormRow>
            {submitError && (
                <FormRow>
                    <FormRowItem>
                        <FormError
                            message={
                                messages?.general?.form?.error?.serverError?.[submitError]
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
                    label={messages?.profile?.enableMFAForm?.cancel}
                />
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={submitting}
                    label={messages?.profile?.enableMFAForm?.enableMFA}
                />
            </FormRow>
        </Form>
    );
};

export default EnableMFAForm;
