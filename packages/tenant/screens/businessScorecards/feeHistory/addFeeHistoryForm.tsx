import React from 'react';
import { useDispatch } from 'react-redux';
import {
    Form,
    FormError,
    FormRow,
    FormRowItem,
    MaterialTextInput,
    Toast,
    Button,
    MaterialDateInput,
} from '@wizehub/components';
import { toast } from 'react-toastify';
import messages from '../../../messages';
import { FEE_HISTORY_API } from '../../../api';
import { apiCall } from '../../../redux/actions';
import { HttpMethods, required, validatePassedDate } from '@wizehub/common/utils';
import { ErrorMessage, useFormReducer } from '@wizehub/common/hooks';
import moment from 'moment';
import { StyledEbitdaPercentText } from './styles';

interface Props {
    onCancel: () => void;
    onSuccess: () => void;
    tenantId: string;
}

interface FormData {
    tenantId: number;
    year: number;
    ebita: number;
    annualFee: number;
    ebitaPercentage: number;
}

export const validateEbitda = (
    message: string,
    validateWith: 'annualFee',
) => (value: any, formValues: any): ErrorMessage => {
    if (value) {
        return Number(value) >= Number(formValues?.[validateWith]?.value)
            ? message : undefined;
    }
    return undefined;
};

const validators = {
    year: [required(messages?.businessAssessment?.feeHistory?.forms?.validators?.tradingYearRequired),
    validatePassedDate(
        messages?.businessAssessment?.feeHistory?.forms?.validators?.validTradingYear,
        2099
    )
    ],
    annualFee: [
        required(messages?.businessAssessment?.feeHistory?.forms?.validators?.annualFeesRequired)
    ],
    ebita: [
        required(messages?.businessAssessment?.feeHistory?.forms?.validators?.ebitdaRequired),
        validateEbitda(
            messages?.businessAssessment?.feeHistory?.forms?.validators?.ebitdaLessThanAnnualFee,
            "annualFee"
        )
    ]
};

const FeeHistoryForm: React.FC<Props> = ({
    onCancel,
    onSuccess,
    tenantId
}) => {
    const {
        submitting,
        submitError,
        handleSubmit,
        connectField,
        setSubmitError,
        formValues
    } = useFormReducer(validators);

    const reduxDispatch = useDispatch();

    const onSubmit = async (data: FormData) => {
        const ebitaData = Number(data?.ebita);
        const annualFeeData = Number(data?.annualFee);
        const sanitizedBody = {
            tenantId: tenantId,
            year: moment(data?.year).toDate().getFullYear(),
            ebita: ebitaData,
            annualFee: annualFeeData,
            ebitaPercentage: (ebitaData / annualFeeData) * 100
        };

        return new Promise<void>((resolve, reject) => {
            reduxDispatch(
                apiCall(
                    FEE_HISTORY_API,
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
                    <Toast
                        text={messages?.businessAssessment?.feeHistory?.forms?.success?.created}
                    />
                ));
            })
            .catch((error) => {
                toast(() => (
                    <Toast
                        text={messages?.businessAssessment?.feeHistory?.forms?.error?.serverError?.[error?.message]}
                        type="error"
                    />
                ));
            });
    }

    const annualFeeValue = Number(formValues?.annualFee?.value);
    const ebitaValue = Number(formValues?.ebita?.value);

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <FormRow minWidth="530px">
                <FormRowItem>
                    {connectField('year', {
                        label: messages?.businessAssessment?.feeHistory?.labels?.tradingYear,
                        required: true,
                        views: ['year'],
                        dateFormat: 'YYYY',
                        calendarHeight: 'auto',
                        disableFuture: true,
                    })(MaterialDateInput)}
                </FormRowItem>
            </FormRow>
            <FormRow>
                <FormRowItem>
                    {connectField('annualFee', {
                        label: messages?.businessAssessment?.feeHistory?.forms?.annualFeesRevenue,
                        required: true,
                        type: 'number'
                    })(MaterialTextInput)}
                </FormRowItem>
                <FormRowItem>
                    {connectField('ebita', {
                        label: messages?.businessAssessment?.feeHistory?.forms?.ebitdaDollar,
                        required: true,
                        type: 'number'
                    })(MaterialTextInput)}
                </FormRowItem>
            </FormRow>
            <FormRow>
                <FormRowItem>
                    <StyledEbitdaPercentText>
                        {`${messages?.businessAssessment?.feeHistory?.forms?.ebitdaPercent} = 
                        ${(ebitaValue > 0 && annualFeeValue > 0)
                                ? `${((ebitaValue / annualFeeValue)
                                    * 100).toFixed(2)
                                }%`
                                : '0.00%'
                            }`}
                    </StyledEbitdaPercentText>
                </FormRowItem>
            </FormRow>
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
                    label={messages?.settings?.systemPreferences?.feeLostReasonSetup?.form?.create}
                />
            </FormRow>
        </Form>
    );
};

export default FeeHistoryForm;
