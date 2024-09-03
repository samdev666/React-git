import { Box, Grid } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Card, FormRow, FormRowItem, Modal } from "@wizehub/components";
import React, { useRef, useState } from "react";
import Questions from "./questions";
import { useFormReducer, usePopupReducer } from "@wizehub/common/hooks";
import { HttpMethods, capitalizeLegend, emptyValueValidator, required, trimWordWrapper, validatePassedDate } from "@wizehub/common/utils";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { apiCall, setCurrentStep, updateAuthenticationStatus } from "../../redux/actions";
import { ReduxState } from "../../redux/reducers";
import { Section, Question, SubSection, SubSectionRow } from "@wizehub/common/models/genericEntities";
import { greyScaleColour } from "@wizehub/common/theme/style.palette";
import {
    StyledButtonFormRow,
    StyledFeeHistoryButtonContainer,
    StyledFeeHistoryContainer,
    StyledFormSectionHeadingContainer,
    StyledFormSectionRowSubTitle,
    StyledFormSectionRowTitle,
    StyledFormSectionTitle,
    StyledFormSubSectionTitle,
    StyledHeadingsContainer,
    StyledScoreContainer,
    StyledScoreText,
    StyledSeparator,
    StyledSubSectionHeading,
    StyledTotalScoreContainer,
    StyledTotalScoreText,
    StyledWizeGapForm,
    StyledWizeGapFormCard
} from "./styles";
import messages from "../../messages";
import FeeHistory from "../businessScorecards/feeHistory/feeHistory";
import { ToggleButtonOptions } from "@wizehub/components/toggleButtons";
import { TenantFormsCode } from "../../utils/constant";
import { UPDATE_TENANT_FORMS, UPDATE_TENANT_FORMS_SECTION } from "../../api";
import BusinessAssessmentFormModal from "../businessScorecards/businessAssessment/businessAssessmentFormModal";
import moment from "moment";
import { SubmitData } from "./formComponent";
import { AuthenticationStatus } from "../../redux/reducers/auth";

interface Props {
    section: Section;
    formLength: number;
    getTenantForms: (value?: boolean) => Promise<void>;
    traversedPages?: any;
    setTraversedPages?: any;
    code: string;
    formId?: number;
    formCompletionStatus?: string;
}

const CustomForm: React.FC<Props> = ({
    section, formLength, getTenantForms, code, formId, formCompletionStatus
}) => {
    const { stepForm, tenantData, auth } = useSelector((state: ReduxState) => state);
    const currentFormIndex = stepForm.currentPage;
    const { tenantId } = tenantData;
    const scoreObjRef = useRef<{ [key: number]: number }>({});

    const { presentationData, questions, layout, subSections } = section;

    const reduxDispatch = useDispatch();

    const subSectionValidators = () => subSections
        ?.flatMap((subSection: SubSection) => subSection.questions)
        ?.filter((item: Question) =>
            item?.configurationData?.validators?.isRequired &&
            item?.configurationData?.validators?.errorMessage
        )
        ?.reduce((acc: Record<number, any>, item: Question) => ({
            ...acc,
            [item?.id]: [required(item?.configurationData?.validators?.errorMessage)],
        }), {});

    const questionValidators = () => questions?.filter(
        (item: Question) => item?.configurationData?.validators?.isRequired &&
            item?.configurationData?.validators?.errorMessage)
        ?.reduce((acc: Record<number, any>, item: Question) => ({
            ...acc,
            [item?.id]: item?.type === 'DATEPICKER'
                ? [
                    required(item?.configurationData?.validators?.errorMessage),
                    validatePassedDate(messages?.general?.validYear, 2099)
                ]
                : (item?.type === 'TEXT' || item.type === 'TEXT_AREA')
                    ? [
                        required(item?.configurationData?.validators?.errorMessage),
                        emptyValueValidator
                    ]
                    : [required(item?.configurationData?.validators?.errorMessage)]
        }), {});

    const handleValidators = () => subSections?.length > 0
        ? subSectionValidators()
        : questionValidators()

    const {
        connectField, handleSubmit, change, submitting, formValues, setSubmitError
    } = useFormReducer(handleValidators());

    const getSubSectionQuestionArray = (data: Record<number, any>) => {
        return subSections.map((section: SubSection) => ({
            ...section,
            questions: section.questions.flatMap((question: Question) => {
                const matchedData = data[Number(question.id)];
                if (matchedData !== undefined) {
                    const result = matchedData.split('-');
                    const answer = result.length > 1 ? result[1] : result[0];
                    return {
                        id: question.id,
                        type: question.type,
                        presentationData: question.presentationData,
                        configurationData: question.configurationData,
                        answer: answer || "",
                    };
                }
                return null;
            }).filter((item) => item !== null) as Question[]
        }));
    };

    const getMainSectionQuestionArray = (data: Record<number, any>) => {
        const unMatchedQuestion = questions?.filter((val) => !Object.keys(data)?.includes((val.id).toString()));
        const dataArr = Object.keys(data)?.map((item: string) => {
            const matchedQuestion = questions?.find((val: Question) => Number(val.id) === Number(item));
            if (matchedQuestion) {
                return {
                    id: matchedQuestion.id,
                    type: matchedQuestion.type,
                    presentationData: matchedQuestion.presentationData,
                    configurationData: matchedQuestion.configurationData,
                    answer: matchedQuestion?.type === "DATEPICKER"
                        ? matchedQuestion?.configurationData?.displayMode === "Month"
                            ? (moment(data?.[Number(matchedQuestion.id)]).toDate().getMonth() + 1)
                            : moment(data?.[Number(matchedQuestion.id)]).toDate().getFullYear()
                        : (matchedQuestion?.type === "TEXT" || matchedQuestion?.type === "TEXT_AREA")
                            ? trimWordWrapper(data?.[Number(matchedQuestion.id)])
                            : data?.[Number(matchedQuestion.id)]
                };
            }
            return null;
        }).filter(item => item !== null);
        if (unMatchedQuestion) {
            unMatchedQuestion.forEach((element: Question) => {
                dataArr.push({
                    id: element.id,
                    type: element.type,
                    presentationData: element.presentationData,
                    configurationData: element.configurationData,
                    answer: ""
                });
            });
        }
        return dataArr;
    };

    const submitForm = async () => new Promise<void>((resolve, reject) => {
        reduxDispatch(
            apiCall(
                UPDATE_TENANT_FORMS.replace(':id', formId?.toString()),
                resolve,
                reject,
                HttpMethods.PATCH,
                {
                    tenantId: tenantId,
                    completionStatus: "COMPLETED"
                },
            ),
        );
    })
        .then(() => {
            if (code === TenantFormsCode.businessAssessment) {
                if (auth.status !== AuthenticationStatus.AUTHENTICATED) {
                    reduxDispatch(updateAuthenticationStatus(AuthenticationStatus.AUTHENTICATED));
                }
            }
        })
        .catch((error) => {
            setSubmitError(error?.message);
        });

    const handleFormSectionSubmit = async (
        sectionId: string | number,
        sanitizedBody: SubmitData,
        onSuccess: () => void
    ) => new Promise<void>((resolve, reject) => {
        reduxDispatch(
            apiCall(
                UPDATE_TENANT_FORMS_SECTION.replace(':id', sectionId?.toString()),
                resolve,
                reject,
                HttpMethods.PATCH,
                sanitizedBody,
            ),
        );
    })
        .then(() => {
            onSuccess();
        })
        .catch((error) => {
            setSubmitError(error?.message);
        });

    const onSubmit = async (data: Record<number, any>) => {
        if (subSections?.length > 0) {
            if (currentFormIndex + 1 < formLength) {
                reduxDispatch(
                    setCurrentStep(currentFormIndex + 1),
                )
            }
            const subSectionArr = getSubSectionQuestionArray(data);
            subSectionArr?.forEach((element: SubSection, index: number) => {
                const sanitizedBody: SubmitData = {
                    tenantId: tenantId,
                    userResponses: {
                        questions: element?.questions
                    },
                    completionStatus: "COMPLETED",
                    score: scoreObjRef.current[element?.id]
                };
                const sectionId: string | number = element?.id;
                const onSuccess = () => {
                    if (index === subSectionArr?.length - 1) {
                        const sectionSanitizedBody: any = {
                            tenantId: tenantId,
                            completionStatus: "COMPLETED"
                        };
                        handleFormSectionSubmit(section?.id, sectionSanitizedBody, () => { });
                    }
                }
                handleFormSectionSubmit(sectionId, sanitizedBody, onSuccess);
            })
        } else {
            const questionArr = getMainSectionQuestionArray(data);
            const sanitizedBody: SubmitData = {
                tenantId: tenantId,
                userResponses: {
                    questions: questionArr
                },
                completionStatus: "COMPLETED"
            };
            const sectionId: string | number = section?.id;
            const onSuccess = async () => {
                if (currentFormIndex + 1 <= formLength) {
                    if (currentFormIndex + 1 === formLength) {
                        await submitForm()
                    }
                    reduxDispatch(
                        setCurrentStep(currentFormIndex + 1),
                    )
                }
            }
            handleFormSectionSubmit(sectionId, sanitizedBody, onSuccess);
        }
    }

    const calculateSubSectionScore = (subSectionData: SubSection) => {
        let score = 0;

        subSectionData?.questions?.forEach((item: Question) => {
            const formValue = formValues?.[item.id]?.value;
            const positiveOptionLabel = item.configurationData?.options?.find(
                (val: ToggleButtonOptions) => val?.positive
            )?.label?.toLowerCase();

            if (formValue === `${item.id}-${positiveOptionLabel}` || formValue === positiveOptionLabel) {
                score = score + 2;
            }
        });

        scoreObjRef.current[subSectionData.id] = score;
        return score;
    };

    const renderHeaderComponent = () => presentationData && (
        <StyledFormSectionHeadingContainer container>
            <Grid item xs={12}>
                <StyledFormSectionTitle>
                    {presentationData?.title}
                </StyledFormSectionTitle>
            </Grid>
            <Grid item xs={12}>
                <StyledFormSubSectionTitle>
                    {presentationData?.subTitle}
                </StyledFormSubSectionTitle>
            </Grid>
        </StyledFormSectionHeadingContainer>
    )

    const renderPrevButton = () => (
        <Button
            label={messages?.general?.previous}
            variant="outlined"
            color="secondary"
            startIcon={<ArrowBackIcon />}
            size="large"
            onClick={() => {
                if (currentFormIndex - 1 >= 0) {
                    getTenantForms(true);
                    reduxDispatch(
                        setCurrentStep(currentFormIndex - 1),
                    )
                }
            }}
        />
    );

    return (
        <>
            <StyledWizeGapForm
                onSubmit={handleSubmit(onSubmit)}
                hasPadding
            >
                <StyledWizeGapFormCard
                    headerCss={{
                        backgroundColor: greyScaleColour.grey60,
                        borderBottom: `1px solid ${greyScaleColour.grey80}`,
                    }}
                    header={renderHeaderComponent()}
                >
                    <>
                        {layout?.rows?.map((rowVal: any, rowIndex: number) => {
                            const scores: Array<number> = Object.values(scoreObjRef.current)?.filter(value => value !== 0);
                            return (
                                <React.Fragment key={rowVal?.title}>
                                    <FormRow
                                        marginBottom={"0px !important"}
                                        rowGap={(rowVal?.subTitle || subSections?.length > 0) ? "16px" : "6px"}
                                        alignItems={"flex-end"}
                                    >
                                        {(rowVal?.title || rowVal.subTitle) &&
                                            <StyledHeadingsContainer>
                                                {rowVal.title &&
                                                    <StyledFormSectionRowTitle>
                                                        {`${rowVal.title}:`}
                                                    </StyledFormSectionRowTitle>
                                                }
                                                {rowVal.subTitle &&
                                                    <StyledFormSectionRowSubTitle>
                                                        {rowVal.subTitle}
                                                    </StyledFormSectionRowSubTitle>
                                                }
                                            </StyledHeadingsContainer>}
                                        {rowVal?.sectionIds &&
                                            <>
                                                {rowVal.sectionIds?.map((sectId: string) => {
                                                    const subSection = subSections?.find((val: SubSection) => val.id === Number(sectId));
                                                    return subSection && (
                                                        <>
                                                            {subSection?.presentationData?.title &&
                                                                <Grid
                                                                    container
                                                                    display="flex"
                                                                    justifyContent={"space-between"}
                                                                    marginTop={rowIndex !== 0 && "24px !important"}
                                                                >
                                                                    <Grid item>
                                                                        <StyledSubSectionHeading>
                                                                            {`${subSection?.presentationData?.title}`}
                                                                        </StyledSubSectionHeading>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <Grid container gap="10px" display="flex" alignItems={"center"}>
                                                                            <Grid item>
                                                                                <StyledScoreText>
                                                                                    Score
                                                                                </StyledScoreText>
                                                                            </Grid>
                                                                            <Grid item>
                                                                                <StyledScoreContainer>
                                                                                    <StyledScoreText>
                                                                                        {calculateSubSectionScore(subSection)}
                                                                                    </StyledScoreText>
                                                                                </StyledScoreContainer>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>}
                                                            {subSection.layout.rows.map((sectRow: SubSectionRow, sectRowIndex: number) => (
                                                                <React.Fragment key={sectRow?.title}>
                                                                    <FormRow
                                                                        marginBottom={"0px !important"}
                                                                        justifyContent='space-between'
                                                                    >
                                                                        {sectRow?.questionIds?.map((sectQuestId: number) => {
                                                                            const sectQuest = subSection?.questions?.find((val: Question) => Number(val.id) === sectQuestId);
                                                                            return sectQuest && (
                                                                                <FormRowItem key={sectQuestId} display="flex">
                                                                                    <Questions
                                                                                        question={sectQuest}
                                                                                        connectField={connectField}
                                                                                        change={change}
                                                                                    />
                                                                                </FormRowItem>
                                                                            )
                                                                        })}
                                                                    </FormRow>
                                                                    {sectRow?.hasSeparator && <StyledSeparator />}
                                                                </React.Fragment>
                                                            ))}
                                                        </>
                                                    )
                                                })}
                                                {rowIndex === subSections?.length - 1 &&
                                                    <>
                                                        <StyledSeparator marginTop="24px" />
                                                        <StyledTotalScoreContainer>
                                                            <Grid container gap="10px" display="flex" alignItems={"center"} justifyContent={"flex-end"} marginTop={"24px !important"}>
                                                                <Grid item>
                                                                    <StyledTotalScoreText>
                                                                        Total Score
                                                                    </StyledTotalScoreText>
                                                                </Grid>
                                                                <Grid item>
                                                                    <StyledScoreContainer>
                                                                        <StyledScoreText>
                                                                            {scores?.length
                                                                                ? scores?.reduce((acc, value) => acc * value, 1)
                                                                                : 0}
                                                                        </StyledScoreText>
                                                                    </StyledScoreContainer>
                                                                </Grid>
                                                            </Grid>
                                                        </StyledTotalScoreContainer>
                                                    </>
                                                }
                                            </>
                                        }
                                        {rowVal?.questionIds?.map((questId: number) => {
                                            const question = questions?.find((val: Question) => Number(val.id) === questId);
                                            const title = question?.presentationData?.title;
                                            return question && (
                                                <>
                                                    {question?.configurationData?.visibility
                                                        ? capitalizeLegend(formValues[question?.configurationData?.visibility?.questionId]?.value) === question?.configurationData?.visibility?.value
                                                            ? <FormRowItem minWidth="30%" key={questId}>
                                                                <Questions
                                                                    question={question}
                                                                    connectField={connectField}
                                                                    change={change}
                                                                />
                                                            </FormRowItem>
                                                            : null
                                                        : <FormRowItem minWidth="30%" key={questId} display="flex" alignItems={!title && "flex-end"}>
                                                            <Questions
                                                                question={question}
                                                                connectField={connectField}
                                                                change={change}
                                                            />
                                                        </FormRowItem>}
                                                </>
                                            )
                                        })}
                                        {rowVal?.emptyContainerCount &&
                                            Array.from({ length: rowVal?.emptyContainerCount }, (_, i) => i)?.map((_) =>
                                                <FormRowItem minWidth="30%" display="flex" alignItems={"flex-end"} />
                                            )
                                        }
                                    </FormRow>
                                    {rowVal?.hasSeparator && <StyledSeparator />}
                                </React.Fragment>
                            )
                        })}
                    </>
                </StyledWizeGapFormCard>
                <StyledButtonFormRow>
                    <FormRowItem>
                        {currentFormIndex > 0 && renderPrevButton()}
                    </FormRowItem>
                    <FormRowItem display="flex" justifyContent="flex-end">
                        <Button
                            label={(currentFormIndex + 1 === formLength)
                                ? messages?.general?.finish
                                : messages?.general?.next}
                            variant="contained"
                            color="primary"
                            size="large"
                            type="submit"
                            disabled={submitting}
                            endIcon={(currentFormIndex + 1 === formLength && code === TenantFormsCode.wizeGap)
                                ? <></>
                                : <ArrowForwardIcon />}
                        />
                    </FormRowItem>
                </StyledButtonFormRow>
            </StyledWizeGapForm >
        </>
    )
};

export default CustomForm;