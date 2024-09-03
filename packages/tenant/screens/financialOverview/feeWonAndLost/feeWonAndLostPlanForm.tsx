import {
    useFormReducer, useOptions, usePagination, usePopupReducer
} from "@wizehub/common/hooks";
import { MetaData, UserActionType, getDefaultMetaData } from "@wizehub/common/models";
import {
    FeeWonAndLostPlan,
    FeeWonAndLostPlanEntity,
    PlanEntity
} from "@wizehub/common/models/genericEntities";
import {
    Button,
    Card,
    Form,
    FormError,
    FormRow,
    FormRowItem,
    MaterialAutocompleteInput,
    MaterialDateInput,
    MaterialTextInput,
    SwitchInput,
    Toast
} from "@wizehub/components";
import React, { useEffect } from "react";
import messages from "../../../messages";
import { Divider, Typography } from "@mui/material";
import {
    FEE_WON_AND_LOST_PLAN,
    FEE_WON_AND_LOST_PLAN_LISTING_API,
    PLAN_LISTING_API
} from "../../../api";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import { getDefaultCapacityPlanFilter, paginatedPlans } from "../feePlanForm";
import moment from "moment";
import { emptyValueValidator, HttpMethods, mapIdNameToOptionWithoutCaptializing, required, trimWordWrapper } from "@wizehub/common/utils";
import { StyledPlanTextTypography } from "../../plan/budgetAndCapacity/styles";
import { ResponsiveAddIcon } from "../../systemPreferences/launchPadSetup/launchPadSetup";
import Table from "@wizehub/components/table";
import { StyledEditIcon } from "@wizehub/components/table/styles";
import { Status } from "@wizehub/common/models/modules";
import { apiCall } from "../../../redux/actions";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

interface Props {
    onCancel: () => void;
    onSuccess: () => void;
}

const validators = {
    year: [
        required(
            messages?.measure?.financialOverview?.feesWonAndLost?.planForm?.validators?.yearRequired
        ),
    ],
    teamPlan: [
        required(
            messages?.measure?.financialOverview?.feesWonAndLost?.planForm?.validators?.teamPlanRequired
        ),
    ],
    notes: [
        required(
            messages?.measure?.financialOverview?.feesWonAndLost?.planForm?.validators?.noteRequired
        ),
        emptyValueValidator
    ]
};

const getDefaultPlanFilter = (): MetaData<FeeWonAndLostPlanEntity> => ({
    ...getDefaultMetaData<FeeWonAndLostPlanEntity>(),
    order: "plan",
    allResults: true,
});

const FeeWonAndLostPlanForm: React.FC<Props> = ({
    onCancel, onSuccess
}) => {
    const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);

    const reduxDispatch = useDispatch();

    const {
        submitting,
        submitError,
        handleSubmit,
        connectField,
        change,
        setSubmitError,
        formValues,
        reset,
    } = useFormReducer(validators);

    const {
        entity: planEntity,
        applyFilters,
        updateFilters,
        fetchPage,
        updateLimit
    } = usePagination<FeeWonAndLostPlanEntity>(
        {
            ...paginatedPlans,
            api: FEE_WON_AND_LOST_PLAN_LISTING_API.replace(":tenantId", tenantId),
        },
        getDefaultPlanFilter()
    );

    const {
        options: planOptions,
        refreshOptions,
        searchOptions,
    } = useOptions<PlanEntity>(
        PLAN_LISTING_API.replace(":tenantId", tenantId),
        true,
        getDefaultCapacityPlanFilter(
            moment(formValues?.year?.value).format("YYYY")
        )
    );

    const {
        visibility: addPlanVisibility,
        showPopup: showAddPlanForm,
        hidePopup: hideAddPlanForm,
        metaData: addPlanConfig,
    } = usePopupReducer<{
        type: UserActionType;
        planInformation: FeeWonAndLostPlanEntity;
    }>();

    useEffect(() => {
        if (formValues?.year?.value) {
            refreshOptions();
        }
    }, [formValues?.year?.value]);

    useEffect(() => {
        if (addPlanConfig?.type === UserActionType.EDIT) {
            change(
                "year",
                moment(addPlanConfig?.planInformation?.plan?.financialYear, "YYYY")
            );
            change("teamPlan", {
                id: addPlanConfig?.planInformation?.plan?.id,
                label: addPlanConfig?.planInformation?.plan?.name,
            });
            change("notes", addPlanConfig?.planInformation?.notes);
            change(
                "active",
                addPlanConfig?.planInformation?.status === Status.active
            );
        }
    }, [addPlanConfig]);

    const onSubmit = async (data: any) => {
        let sanitizedBody: any = {
            tenantId: tenantId,
            planId: data?.teamPlan?.id,
            status: data?.active ? Status.active : Status.inactive,
            notes: trimWordWrapper(data?.notes) || "",
        };
        return new Promise<void>((resolve, reject) => {
            reduxDispatch(
                apiCall(
                    addPlanConfig?.type === UserActionType.EDIT
                        ? `${FEE_WON_AND_LOST_PLAN}/${addPlanConfig?.planInformation?.id}`
                        : FEE_WON_AND_LOST_PLAN,
                    resolve,
                    reject,
                    addPlanConfig?.type === UserActionType.EDIT
                        ? HttpMethods.PATCH
                        : HttpMethods.POST,
                    sanitizedBody
                )
            );
        })
            .then(() => {
                hideAddPlanForm();
                applyFilters();
                reset();
                toast(
                    <Toast
                        text={
                            messages?.measure?.financialOverview?.feesWonAndLost?.planForm?.success?.[
                            addPlanConfig?.type === UserActionType.EDIT
                                ? "updated"
                                : "created"
                            ]
                        }
                    />
                );
            })
            .catch((error) => {
                setSubmitError(error?.message);
            });
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            {!addPlanVisibility && (
                <>
                    <FormRow minWidth="530px" alignItems="center">
                        <FormRowItem>
                            <StyledPlanTextTypography>
                                {
                                    messages?.measure?.financialOverview?.lockup?.planForm
                                        ?.heading
                                }
                            </StyledPlanTextTypography>
                        </FormRowItem>
                        <FormRowItem justifyContent="flex-end">
                            <Button
                                startIcon={<ResponsiveAddIcon />}
                                variant="text"
                                color="primary"
                                label={
                                    messages?.measure?.financialOverview?.fees?.planForm?.addPlan
                                }
                                onClick={() =>
                                    showAddPlanForm({
                                        type: UserActionType.CREATE,
                                    })
                                }
                            />
                        </FormRowItem>
                    </FormRow>
                    <FormRow mb={0}>
                        <FormRowItem>
                            <Card
                                noHeader
                                cardCss={{
                                    width: '100%',
                                    margin: "0px !important"
                                }}
                            >
                                <Table
                                    specs={[
                                        {
                                            id: "plan",
                                            label: messages?.measure?.financialOverview?.feesWonAndLost?.planForm?.selectTeamPlan,
                                            getValue: (row: FeeWonAndLostPlanEntity) => row?.plan,
                                            format: (row: FeeWonAndLostPlan) => row?.name,
                                        },
                                        {
                                            id: "year",
                                            label: messages?.measure?.financialOverview?.feesWonAndLost?.planForm?.thisYear,
                                            getValue: (row: FeeWonAndLostPlanEntity) => row?.plan,
                                            format: (row: FeeWonAndLostPlan) => row?.financialYear,
                                        }
                                    ]}
                                    metadata={planEntity?.metadata}
                                    data={planEntity?.records}
                                    fetchPage={fetchPage}
                                    updateLimit={updateLimit}
                                    actions={[
                                        {
                                            id: "edit",
                                            component: <StyledEditIcon />,
                                            onClick: (row: FeeWonAndLostPlanEntity) => {
                                                showAddPlanForm({
                                                    type: UserActionType.EDIT,
                                                    planInformation: {
                                                        id: row?.id,
                                                        plan: row?.plan,
                                                        notes: row?.notes,
                                                        status: row?.status,
                                                    },
                                                });
                                            },
                                        },
                                    ]}
                                    disableSorting={["year"]}
                                    updateFilters={(filterParams: any) => {
                                        updateFilters(filterParams);
                                        applyFilters();
                                    }}
                                />
                            </Card>
                        </FormRowItem>
                    </FormRow>
                </>
            )}
            {addPlanVisibility && (
                <>
                    <FormRow minWidth="530px">
                        <FormRowItem>
                            {connectField("year", {
                                label: messages?.measure?.financialOverview?.feesWonAndLost?.planForm?.thisYear,
                                views: ["year"],
                                required: true,
                                dateFormat: "YYYY",
                                calendarHeight: 'auto',
                                disabled: addPlanConfig?.type === UserActionType.EDIT,
                            })(MaterialDateInput)}
                        </FormRowItem>
                        <FormRowItem display={"flex"} gap={"30px"} alignItems={"center"}>
                            <Typography sx={{ color: "#737373" }}>
                                {messages?.measure?.financialOverview?.feesWonAndLost?.planForm?.nextYear}
                            </Typography>
                            <Typography sx={{ color: "#232323", fontSize: "16px", fontWeight: 500 }}>
                                {formValues?.year?.value ? moment(formValues?.year?.value).add(1, 'year').format("YYYY") : '-'}
                            </Typography>
                        </FormRowItem>
                    </FormRow>
                    <FormRow>
                        <FormRowItem>
                            {connectField("teamPlan", {
                                label: messages?.measure?.financialOverview?.feesWonAndLost?.planForm?.selectTeamPlan,
                                options: planOptions?.map(mapIdNameToOptionWithoutCaptializing),
                                searchOptions: searchOptions,
                                disabled:
                                    !formValues?.year?.value ||
                                    addPlanConfig?.type === UserActionType.EDIT,
                                required: true
                            })(MaterialAutocompleteInput)}
                        </FormRowItem>
                    </FormRow>
                    <FormRow>
                        <FormRowItem>
                            {connectField("notes", {
                                label: messages?.measure?.financialOverview?.feesWonAndLost?.planForm?.notes,
                                multiline: true,
                                minRows: 3,
                                maxRows: 3,
                                required: true
                            })(MaterialTextInput)}
                        </FormRowItem>
                    </FormRow>
                    <FormRow>
                        <FormRowItem>
                            {connectField("active", {
                                label:
                                    messages?.measure?.financialOverview?.fees?.planForm?.active,
                            })(SwitchInput)}
                        </FormRowItem>
                    </FormRow>
                    <FormRow>
                        <Divider sx={{ width: "100%" }} />
                    </FormRow>
                </>
            )}
            {submitError && (
                <FormRow>
                    <FormRowItem>
                        <FormError
                            message={
                                messages?.measure?.financialOverview?.fees?.planForm?.error
                                    ?.serverError?.[submitError]
                            }
                        />
                    </FormRowItem>
                </FormRow>
            )}
            {addPlanVisibility && (
                <FormRow justifyContent="end" mb={0}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={onCancel}
                        label={
                            messages?.measure?.financialOverview?.lockup?.planForm?.cancel
                        }
                    />
                    <Button
                        variant="contained"
                        type="submit"
                        disabled={submitting}
                        label={
                            messages?.measure?.financialOverview?.fees?.planForm?.[
                            addPlanConfig?.type === UserActionType.EDIT ? "update" : "add"
                            ]
                        }
                    />
                </FormRow>
            )}
        </Form>
    )
};

export default FeeWonAndLostPlanForm;