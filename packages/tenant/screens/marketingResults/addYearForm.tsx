import { useFormReducer } from "@wizehub/common/hooks";
import { Button, Form, FormError, FormRow, FormRowItem, MaterialDateInput, MaterialTextInput } from "@wizehub/components";
import React, { useEffect, useState } from "react";
import messages from "../../messages";
import { capitalizeLegend, HttpMethods, required } from "@wizehub/common/utils";
import { useDispatch } from "react-redux";
import { apiCall } from "../../redux/actions";
import { MarketingResultsEntity } from "@wizehub/common/models/genericEntities";
import { Months } from "@wizehub/common/models/modules";
import { Id, Option } from "@wizehub/common/models";
import { MARKETING_RESULTS_API } from "../../api";
import moment from "moment";
import { useLocation } from "react-router-dom";
import { getMarketingType, MonthEntity } from ".";
import { useSelector } from "react-redux";
import { ReduxState } from "../../redux/reducers";
import { StyledDivider, StyledFormTotalSubtext, StyledFormTotalText } from "./styles";

interface Props {
    onCancel: () => void;
    onSuccess: () => void;
    monthsArray: MonthEntity[];
    isUpdate?: boolean;
    typeId?: Id;
};

const validators = {
    financialYear: [
        required(messages?.marketingResults?.form?.error?.validators?.financialYear),
    ],
};

const AddYearForm: React.FC<Props> = ({
    onCancel,
    onSuccess,
    monthsArray,
    isUpdate = false,
    typeId
}) => {
    const location = useLocation();
    const reduxDispatch = useDispatch();
    const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
    const [monthlyData, setMonthlyData] = useState<MarketingResultsEntity | null>(null);

    const createPairs = () => {
        const result = [];
        for (let i = 0; i < monthsArray?.length; i += 2) {
            result.push(monthsArray.slice(i, i + 2));
        }
        return result;
    };

    const {
        submitting,
        submitError,
        handleSubmit,
        connectField,
        setSubmitError,
        change,
        formValues
    } = useFormReducer(validators);

    const getMarketingDataById = async () => {
        return new Promise<void>((resolve, reject) => {
            reduxDispatch(
                apiCall(
                    `${MARKETING_RESULTS_API}/${typeId}`,
                    resolve,
                    reject,
                    HttpMethods.GET
                )
            );
        })
            .then((res: any) => setMonthlyData(res))
            .catch(() => { });
    };

    const onSubmit = async (data: { [x: string]: any; financialYear?: string; }) => {
        const monthsData = Object.keys(data).filter((item) => item !== "financialYear" && data[item])?.map((val: string) => {
            return {
                month: Months.find((item: Option) => item.label === capitalizeLegend(val))?.id,
                value: Number(data[val])
            }
        })

        const sanitizeBody = {
            tenantId: tenantId,
            type: getMarketingType(location?.pathname),
            year: new Date(data?.financialYear).getFullYear(),
            data: {
                monthlyResults: monthsData
            }
        };

        return new Promise<void>((resolve, reject) => {
            reduxDispatch(
                apiCall(
                    isUpdate ? `${MARKETING_RESULTS_API}/${typeId}` : MARKETING_RESULTS_API,
                    resolve,
                    reject,
                    isUpdate ? HttpMethods.PATCH : HttpMethods.POST,
                    sanitizeBody
                )
            );
        })
            .then(() => {
                onSuccess();
            })
            .catch((error) => {
                setSubmitError(error?.message);
            });
    };

    useEffect(() => {
        if (isUpdate) {
            getMarketingDataById();
        }
    }, []);

    useEffect(() => {
        if (isUpdate) {
            change('financialYear', moment(monthlyData?.year, 'YYYY'))
            monthsArray?.forEach((val: MonthEntity) => {
                const result = monthlyData?.data?.monthlyResults?.find((item) => item?.month === val?.monthNumber);
                change(val?.monthName?.toLowerCase(), result?.value)
            })
        }
    }, [monthlyData]);
    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <FormRow minWidth="580px" mb={"16px"}>
                <FormRowItem>
                    {connectField('financialYear', {
                        label: messages?.marketingResults?.form?.financialYear,
                        required: true,
                        views: ['year'],
                        dateFormat: 'YYYY',
                        calendarHeight: 'auto',
                        disableFuture: true
                    })(MaterialDateInput)}
                </FormRowItem>
            </FormRow>
            <StyledDivider />
            <>
                {createPairs()?.map((value: MonthEntity[], index) => (
                    <FormRow key={index} mb={"16px"}>
                        {value?.map((item: MonthEntity) => (
                            <FormRowItem key={item?.monthNumber}>
                                {connectField(item?.monthName?.toLowerCase(), {
                                    label: item?.monthName,
                                    type: 'number'
                                })(MaterialTextInput)}
                            </FormRowItem>
                        )
                        )}
                    </FormRow>
                ))}
            </>
            {isUpdate && <StyledDivider />}
            {isUpdate &&
                <FormRow mb={"16px"} display={"flex"} justifyContent={"space-between"}>
                    <StyledFormTotalText>
                        Total($)
                    </StyledFormTotalText>
                    <StyledFormTotalSubtext>
                        {Object.keys(formValues)
                            .filter((item) => item !== "financialYear")
                            .reduce((sum, item) => sum + parseFloat(formValues[item]?.value || 0), 0)}
                    </StyledFormTotalSubtext>
                </FormRow>
            }
            {submitError && (
                <FormRow>
                    <FormRowItem>
                        <FormError
                            message={messages?.marketingResults?.form?.error?.serverError?.[submitError]}
                        />
                    </FormRowItem>
                </FormRow>
            )}
            <FormRow justifyContent="end" mb={0} pt={"12px"}>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={onCancel}
                    label={messages?.firmProfile?.teamStructure?.form?.cancel}
                />
                <Button
                    variant="contained"
                    type="submit"
                    disabled={submitting}
                    label={isUpdate ? messages?.general?.update : messages?.plan?.budgetAndCapacity?.teamCapacityTab?.teamMemberForm
                        ?.add}
                />
            </FormRow>
        </Form>
    )
};

export default AddYearForm;