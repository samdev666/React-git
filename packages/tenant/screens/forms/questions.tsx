import React, { useEffect } from 'react';
import {
    CustomRadioGroup,
    MaterialTextInput,
    CheckboxComponent,
    MaterialAutocompleteInput,
    MaterialDateInput,
    ResponseButtonComponent,
    ToggleButtonComponent
} from '@wizehub/components';
import { RadioOption } from '@wizehub/components/radioGroups';
import { Option } from '@wizehub/common/models';
import { Question } from '@wizehub/common/models/genericEntities';
import { CalendarIcon } from '@mui/x-date-pickers';
import moment from 'moment';
import { ResponseButtonOption } from '@wizehub/components/responseButton';

interface Props {
    question: Question;
    connectField?: (name: string | number, extraProps?: Record<any, any>) => (Field: any) => any;
    change?: (key: string | number, value: any, error?: any) => void;
}

// const dateInputStyle = { display: 'flex', flexDirection: 'column' }

const Questions: React.FC<Props> = ({ question, connectField, change }) => {
    const { presentationData, configurationData, id: questionId } = question || {};

    useEffect(() => {
        if (question?.answer) {
            change(questionId, question?.type === 'DATEPICKER'
                ? moment(question?.answer, question?.configurationData?.displayMode === "Month" ? 'MM' : 'YYYY')
                : question?.answer);
        }
    }, [question]);

    const rangeArray = Array.from({ length: configurationData?.maxRange - configurationData?.minRange + 1 }, (_, i) =>
        i + configurationData?.minRange);

    const componentToRender = (type: string) => {
        switch (type) {
            case 'SWITCH':
                return connectField(questionId, {
                    label: presentationData?.title,
                    required: question?.configurationData?.validators?.isRequired,
                    options: configurationData?.options,
                    questionId: questionId
                })(ToggleButtonComponent)
            case 'CUSTOM_RADIO_GROUP':
                return connectField(questionId, {
                    title: presentationData?.title,
                    subTitle: presentationData?.subTitle,
                    options: configurationData?.options?.map((option: ResponseButtonOption) => {
                        return {
                            id: option.id,
                            label: option.label,
                            subText: option?.subText || ''
                        }
                    }),
                    required: question?.configurationData?.validators?.isRequired
                })(ResponseButtonComponent)
            case 'DATEPICKER':
                return connectField(questionId, {
                    label: presentationData?.title,
                    placeholder: presentationData?.fieldText,
                    views: [configurationData?.displayMode?.toLowerCase()],
                    slots: {
                        openPickerIcon: () => <CalendarIcon />,
                    },
                    dateFormat: configurationData?.displayMode === 'Year'
                        ? 'YYYY'
                        : configurationData?.displayMode === 'Month'
                            ? 'MMM'
                            : 'DD/MM/YYYY',
                    calendarHeight: 'auto',
                    required: true,
                    externalLabel: true,
                    isCustomMonthHeader: true
                })(MaterialDateInput);
            case 'CHECKBOX':
                return connectField(questionId, {
                    heading: presentationData?.title,
                    options: configurationData?.options?.map((option: Option) => {
                        return {
                            id: option?.id,
                            label: option?.label
                        }
                    }),
                    required: question?.configurationData?.validators?.isRequired
                })(CheckboxComponent);
            case 'RADIO_GROUP':
                return connectField(questionId, {
                    label: presentationData?.title,
                    subLabel: presentationData?.subTitle,
                    isInitialValue: false,
                    options: configurationData?.options?.map((option: RadioOption) => {
                        return Array.isArray(option)
                            ? option?.map((item: RadioOption) => {
                                return {
                                    value: item?.label?.toLowerCase(),
                                    label: item?.label
                                }
                            })
                            : {
                                value: option?.label?.toLowerCase(),
                                label: option?.label
                            }
                    }),
                    required: question?.configurationData?.validators?.isRequired,
                })(CustomRadioGroup)
            case 'TEXT_AREA':
                return connectField(questionId, {
                    label: presentationData?.title,
                    subLabel: presentationData?.subTitle,
                    placeholder: presentationData?.fieldText,
                    multiline: true,
                    minRows: 3,
                    maxRows: 3,
                    required: question?.configurationData?.validators?.isRequired,
                    externalLabel: true
                })(MaterialTextInput);
            case 'RANGE_DROPDOWN':
                return connectField(questionId, {
                    label: presentationData?.title,
                    placeholder: presentationData?.fieldText,
                    options: rangeArray?.map((option: Number) => {
                        return {
                            id: option,
                            label: option
                        }
                    }),
                    required: question?.configurationData?.validators?.isRequired,
                    externalLabel: true
                })(MaterialAutocompleteInput)
            case 'NUMERIC':
                return connectField(questionId, {
                    label: presentationData?.title,
                    subLabel: presentationData?.subTitle,
                    placeholder: presentationData?.fieldText,
                    type: 'number',
                    isIntegerType: question?.configurationData?.validators?.type === "integer",
                    required: question?.configurationData?.validators?.isRequired,
                    externalLabel: true
                })(MaterialTextInput);
            default:
                return connectField(questionId, {
                    label: presentationData?.title,
                    subLabel: presentationData?.subTitle,
                    placeholder: presentationData?.fieldText,
                    required: question?.configurationData?.validators?.isRequired,
                    externalLabel: true
                })(MaterialTextInput);
        }
    };

    return (
        <>
            {componentToRender(question?.type)}
        </>
    );
};

export default Questions;
