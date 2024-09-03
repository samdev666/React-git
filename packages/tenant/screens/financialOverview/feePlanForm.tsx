import {
  useFormReducer,
  useOptions,
  usePagination,
  usePopupReducer,
} from "@wizehub/common/hooks";
import {
  Button,
  Form,
  FormError,
  FormRow,
  FormRowItem,
  MaterialAutocompleteInput,
  MaterialDateInput,
  MaterialTextInput,
  SwitchInput,
  Table,
  Toast,
} from "@wizehub/components";
import React, { useEffect } from "react";
import { StyledEditIcon } from "@wizehub/components/table/styles";
import { Divider } from "@mui/material";
import {
  MetaData,
  Option,
  PaginatedEntity,
  UserActionType,
  getDefaultMetaData,
} from "@wizehub/common/models";
import moment from "moment";
import {
  LockupPlanEntity,
  PlanEntity,
} from "@wizehub/common/models/genericEntities";
import { useSelector } from "react-redux";
import {
  emptyValueValidator,
  HttpMethods,
  mapIdNameToOptionWithoutCaptializing,
  required,
  trimWordWrapper,
  validatePassedYear,
} from "@wizehub/common/utils";
import { Status } from "@wizehub/common/models/modules";
import { useDispatch } from "react-redux";
import { apiCall } from "@wizehub/common/redux/actions";
import { toast } from "react-toastify";
import { LOCKUP_PLAN_ACTION } from "../../redux/actions";
import {
  LOCKUP_PLAN_FILTER_LISTING_API,
  FEE_PLAN_LISTING_API,
  PLAN_LISTING_API,
  ADD_FEE_PLAN,
  FEE_PLAN,
} from "../../api";
import messages from "../../messages";
import { ReduxState } from "../../redux/reducers";
import { StyledPlanTextTypography } from "../plan/budgetAndCapacity/styles";
import { ResponsiveAddIcon } from "../systemPreferences/launchPadSetup/launchPadSetup";

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
}

export const paginatedPlans: PaginatedEntity = {
  key: "lockupPlan",
  name: LOCKUP_PLAN_ACTION,
  api: LOCKUP_PLAN_FILTER_LISTING_API,
};

interface FormData {
  capacityPlan: Option;
  active: Status;
  title: string;
}

export const getDefaultPlanFilter = (): MetaData<LockupPlanEntity> => ({
  ...getDefaultMetaData<LockupPlanEntity>(),
  order: "title",
});

export const getDefaultCapacityPlanFilter = (
  year: string
): MetaData<PlanEntity> => ({
  ...getDefaultMetaData<PlanEntity>(),
  order: "name",
  allResults: true,
  filters: {
    financialYear: year,
  },
});

const validators = {
  forecastYear: [
    required(
      messages?.measure?.financialOverview?.fees?.planForm?.validators
        ?.forecastYear
    ),
    validatePassedYear(messages?.general?.errors?.invalidYear),
  ],
  capacityPlan: [
    required(
      messages?.measure?.financialOverview?.fees?.planForm?.validators
        ?.capacityPlan
    ),
  ],
  title: [
    required(
      messages?.measure?.financialOverview?.fees?.planForm?.validators?.planName
    ),
    emptyValueValidator,
  ],
};

const FeePlanForm: React.FC<Props> = ({ onCancel, onSuccess }) => {
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
  const { entity: planEntity, applyFilters } = usePagination<LockupPlanEntity>(
    {
      ...paginatedPlans,
      api: FEE_PLAN_LISTING_API.replace(":tenantId", tenantId),
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
      moment(formValues?.forecastYear?.value).format("YYYY")
    )
  );

  useEffect(() => {
    if (formValues?.forecastYear?.value) {
      refreshOptions();
    }
  }, [formValues?.forecastYear?.value]);

  const {
    visibility: addPlanVisibility,
    showPopup: showAddPlanForm,
    hidePopup: hideAddPlanForm,
    metaData: addPlanConfig,
  } = usePopupReducer<{
    type: UserActionType;
    planInformation: LockupPlanEntity;
  }>();

  useEffect(() => {
    if (addPlanConfig?.type === UserActionType.EDIT) {
      change(
        "forecastYear",
        moment(addPlanConfig?.planInformation?.plan?.financialYear, "YYYY")
      );
      change("capacityPlan", {
        id: addPlanConfig?.planInformation?.plan?.id,
        label: addPlanConfig?.planInformation?.plan?.name,
      });
      change("title", addPlanConfig?.planInformation?.title);
      change(
        "active",
        addPlanConfig?.planInformation?.status === Status.active
      );
    }
  }, [addPlanConfig]);

  const onSubmit = async (data: FormData) => {
    let sanitizedBody: any = {
      tenantId: tenantId,
      planId: data?.capacityPlan?.id,
      status: data?.active ? Status.active : Status.inactive,
      title: trimWordWrapper(data?.title),
    };
    return new Promise<void>((resolve, reject) => {
      reduxDispatch(
        apiCall(
          addPlanConfig?.type === UserActionType.EDIT
            ? `${FEE_PLAN}/${addPlanConfig?.planInformation?.id}`
            : ADD_FEE_PLAN,
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
              messages?.measure?.financialOverview?.fees?.planForm?.success?.[
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
                {messages?.measure?.financialOverview?.fees?.planForm?.heading}
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
              <Table
                specs={[
                  {
                    id: "title",
                    label:
                      messages?.measure?.financialOverview?.fees?.planForm
                        ?.table?.planName,
                  },
                  {
                    id: "year",
                    label:
                      messages?.measure?.financialOverview?.fees?.planForm
                        ?.table?.forecastYear,
                    getValue: (row: LockupPlanEntity) => row?.plan,
                    format: (row: any) => row?.name,
                  },
                  {
                    id: "capacityYear",
                    label:
                      messages?.measure?.financialOverview?.fees?.planForm
                        ?.table?.capacityYear,
                    getValue: (row: LockupPlanEntity) => row?.plan,
                    format: (row: any) => row?.financialYear,
                  },
                ]}
                metadata={planEntity?.metadata}
                data={planEntity?.records}
                actions={[
                  {
                    id: "edit",
                    component: <StyledEditIcon />,
                    onClick: (row: LockupPlanEntity) => {
                      showAddPlanForm({
                        type: UserActionType.EDIT,
                        planInformation: {
                          id: row?.id,
                          plan: row?.plan,
                          title: row?.title,
                          status: row?.status,
                        },
                      });
                    },
                  },
                ]}
                disableSorting={["sno"]}
              />
            </FormRowItem>
          </FormRow>
        </>
      )}
      {addPlanVisibility && (
        <>
          <FormRow minWidth="530px">
            <FormRowItem>
              {connectField("forecastYear", {
                label:
                  messages?.measure?.financialOverview?.fees?.planForm
                    ?.forecastYear,
                views: ["year"],
                required: true,
                dateFormat: "YYYY",
                calendarHeight: "auto",
                disabled: addPlanConfig?.type === UserActionType.EDIT,
              })(MaterialDateInput)}
            </FormRowItem>
            <FormRowItem>
              {connectField("capacityPlan", {
                label:
                  messages?.measure?.financialOverview?.fees?.planForm
                    ?.capacityPlan,
                options: planOptions?.map(mapIdNameToOptionWithoutCaptializing),
                searchOptions: searchOptions,
                disabled:
                  !formValues?.forecastYear?.value ||
                  addPlanConfig?.type === UserActionType.EDIT,
              })(MaterialAutocompleteInput)}
            </FormRowItem>
          </FormRow>
          <FormRow>
            <FormRowItem>
              {connectField("title", {
                label:
                  messages?.measure?.financialOverview?.fees?.planForm?.title,
                disabled: !formValues?.forecastYear?.value,
                required: true,
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
  );
};

export default FeePlanForm;