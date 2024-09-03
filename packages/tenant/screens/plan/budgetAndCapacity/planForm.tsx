import {
  useFormReducer,
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
import messages from "../../../messages";
import { StyledPlanTextTypography } from "./styles";
import { ResponsiveAddIcon } from "../../systemPreferences/launchPadSetup/launchPadSetup";
import { StyledEditIcon } from "@wizehub/components/table/styles";
import { Divider } from "@mui/material";
import {
  MetaData,
  PaginatedEntity,
  UserActionType,
  getDefaultMetaData,
} from "@wizehub/common/models";
import moment from "moment";
import { PlanEntity } from "@wizehub/common/models/genericEntities";
import { ADD_PLAN, PLAN_LISTING_API } from "../../../api";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import { PLAN_ACTION } from "../../../redux/actions";
import {
  emptyValueValidator,
  HttpMethods,
  required,
  trimWordWrapper,
  validatePassedYear,
} from "@wizehub/common/utils";
import { Status } from "@wizehub/common/models/modules";
import { useDispatch } from "react-redux";
import { apiCall } from "@wizehub/common/redux/actions";
import { toast } from "react-toastify";

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
}

const paginatedPlans: PaginatedEntity = {
  key: "plan",
  name: PLAN_ACTION,
  api: PLAN_LISTING_API,
};

interface FormData {
  planName: string;
  planYear: number;
  active: Status;
}

const getDefaultPlanFilter = (): MetaData<PlanEntity> => ({
  ...getDefaultMetaData<PlanEntity>(),
  order: "name",
});

const validators = {
  planName: [
    required(messages?.plan?.budgetAndCapacity?.planForm?.validators?.planName),
    emptyValueValidator,
  ],
  planYear: [
    required(messages?.plan?.budgetAndCapacity?.planForm?.validators?.planYear),
    validatePassedYear(messages?.general?.errors?.invalidYear),
  ],
};

const PlanForm: React.FC<Props> = ({ onCancel, onSuccess }) => {
  const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
  const reduxDispatch = useDispatch();
  const {
    submitting,
    submitError,
    handleSubmit,
    connectField,
    change,
    setSubmitError,
    reset,
  } = useFormReducer(validators);
  const {
    entity: planEntity,
    applyFilters,
    fetchPage,
    updateLimit,
    updateFilters,
  } = usePagination<PlanEntity>(
    {
      ...paginatedPlans,
      api: PLAN_LISTING_API.replace(":tenantId", tenantId),
    },
    getDefaultPlanFilter()
  );
  const {
    visibility: addPlanVisibility,
    showPopup: showAddPlanForm,
    hidePopup: hideAddPlanForm,
    metaData: addPlanConfig,
  } = usePopupReducer<{
    type: UserActionType;
    planInformation: PlanEntity;
  }>();
  useEffect(() => {
    if (addPlanConfig?.type === UserActionType.EDIT) {
      change(
        "planYear",
        moment(addPlanConfig?.planInformation?.financialYear, "YYYY")
      );
      change("planName", addPlanConfig?.planInformation?.name);
      change(
        "active",
        addPlanConfig?.planInformation?.status === Status.active
      );
    }
  }, [addPlanConfig]);

  const onSubmit = async (data: FormData) => {
    let sanitizedBody: any = {
      tenantId: tenantId,
      name: trimWordWrapper(data?.planName),
      status: data?.active ? Status.active : Status.inactive,
    };
    if (addPlanConfig?.type !== UserActionType.EDIT) {
      sanitizedBody = {
        ...sanitizedBody,
        financialYear: moment(data?.planYear).toDate().getFullYear(),
      };
    }
    return new Promise<void>((resolve, reject) => {
      reduxDispatch(
        apiCall(
          addPlanConfig?.type === UserActionType.EDIT
            ? `${ADD_PLAN}/${addPlanConfig?.planInformation?.id}`
            : ADD_PLAN,
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
              messages?.plan?.budgetAndCapacity?.planForm?.success?.[
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
                {messages?.plan?.budgetAndCapacity?.plan}
              </StyledPlanTextTypography>
            </FormRowItem>
            <FormRowItem justifyContent="flex-end">
              <Button
                startIcon={<ResponsiveAddIcon />}
                variant="text"
                color="primary"
                label={messages?.plan?.budgetAndCapacity?.planForm?.addPlan}
                onClick={() => showAddPlanForm()}
              />
            </FormRowItem>
          </FormRow>
          <FormRow mb={0}>
            <FormRowItem>
              <Table
                specs={[
                  {
                    id: "name",
                    label:
                      messages?.plan?.budgetAndCapacity?.planForm?.table
                        ?.planName,
                  },
                  {
                    id: "financialYear",
                    label:
                      messages?.plan?.budgetAndCapacity?.planForm?.table
                        ?.planYear,
                  },
                ]}
                data={planEntity?.records}
                metadata={planEntity?.metadata}
                actions={[
                  {
                    id: "edit",
                    component: <StyledEditIcon />,
                    onClick: (row: any) => {
                      showAddPlanForm({
                        type: UserActionType.EDIT,
                        planInformation: row,
                      });
                    },
                  },
                ]}
                fetchPage={fetchPage}
                disableSorting={["sno"]}
                updateLimit={updateLimit}
                updateFilters={(filterParams: any) => {
                  updateFilters(filterParams);
                  applyFilters();
                }}
              />
            </FormRowItem>
          </FormRow>
        </>
      )}
      {addPlanVisibility && (
        <>
          <FormRow minWidth="530px">
            <FormRowItem>
              {connectField("planYear", {
                label:
                  messages?.plan?.budgetAndCapacity?.planForm?.selectPlanYear,
                views: ["year"],
                required: true,
                dateFormat: "YYYY",
                calendarHeight: "auto",
                disabled: addPlanConfig?.type === UserActionType.EDIT,
              })(MaterialDateInput)}
            </FormRowItem>
          </FormRow>
          <FormRow>
            <FormRowItem>
              {connectField("planName", {
                label: messages?.plan?.budgetAndCapacity?.planForm?.addPlanName,
                multiline: true,
                required: true,
                minRows: 3,
              })(MaterialTextInput)}
            </FormRowItem>
          </FormRow>
          <FormRow>
            <FormRowItem>
              {connectField("active", {
                label: messages?.plan?.budgetAndCapacity?.planForm?.active,
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
                messages?.plan?.budgetAndCapacity?.planForm?.error
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
            label={messages?.firmProfile?.teamStructure?.form?.cancel}
          />
          <Button
            variant="contained"
            type="submit"
            disabled={submitting}
            label={
              messages?.plan?.budgetAndCapacity?.addTeam?.[
                addPlanConfig?.type === UserActionType.EDIT ? "update" : "add"
              ]
            }
          />
        </FormRow>
      )}
    </Form>
  );
};

export default PlanForm;
