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
  MaterialTextInput,
  Table,
  Toast,
} from "@wizehub/components";
import React, { useEffect } from "react";
import {
  StyledEditIcon,
  StyledRemoveCircleIcon,
} from "@wizehub/components/table/styles";
import {
  Id,
  MetaData,
  Option,
  PaginatedEntity,
  UserActionType,
  getDefaultMetaData,
} from "@wizehub/common/models";
import { EbitdaThresholdEntity } from "@wizehub/common/models/genericEntities";
import { useSelector } from "react-redux";
import {
  HttpMethods,
  numberValidator,
  required,
  requiredIf,
} from "@wizehub/common/utils";
import { useDispatch } from "react-redux";
import { apiCall } from "@wizehub/common/redux/actions";
import { toast } from "react-toastify";
import { EBITDA_THRESHOLD_ACTION } from "../../redux/actions";
import {
  EBITDA_THRESHOLD_BY_ID,
  EBITDA_THRESHOLD_LISTING_API,
} from "../../api";
import messages from "../../messages";
import { ReduxState } from "../../redux/reducers";
import { StyledPlanTextTypography } from "../plan/budgetAndCapacity/styles";
import { ResponsiveAddIcon } from "../systemPreferences/launchPadSetup/launchPadSetup";
import { StyledTenantManagementNoteText } from "../systemPreferences/launchPadSetup/styles";

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
  ebidtaId: Id;
}

export const paginatedEbitdaThreshold: PaginatedEntity = {
  key: "ebitdaThreshold",
  name: EBITDA_THRESHOLD_ACTION,
  api: EBITDA_THRESHOLD_LISTING_API,
};

interface FormData {
  ebitaThresholdPercentage: number;
  triggeredBonusPercentage: number;
}

export const getDefaultPlanFilter = (): MetaData<EbitdaThresholdEntity> => ({
  ...getDefaultMetaData<EbitdaThresholdEntity>(),
  order: "ebitaThresholdPercentage",
  allResults: true,
});

const EbitdaThresholdForm: React.FC<Props> = ({
  onCancel,
  onSuccess,
  ebidtaId,
}) => {
  const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);

  const {
    visibility: addPlanVisibility,
    showPopup: showAddPlanForm,
    hidePopup: hideAddPlanForm,
    metaData: addPlanConfig,
  } = usePopupReducer<{
    type: UserActionType;
    ebitdaThreshold: EbitdaThresholdEntity;
  }>();

  const {
    visibility: deletePlanVisibility,
    showPopup: showDeletePlanForm,
    hidePopup: hideDeletePlanForm,
    metaData: deletePlanConfig,
  } = usePopupReducer<{
    id: Id;
  }>();

  const validators = {
    ebitaThresholdPercentage: [
      requiredIf(
        messages?.measure?.financialOverview?.ebidta?.ebitdaThresholdForm
          ?.validators?.ebitdaThreshold,
        () => addPlanVisibility
      ),
    ],
    triggeredBonusPercentage: [
      requiredIf(
        messages?.measure?.financialOverview?.ebidta?.ebitdaThresholdForm
          ?.validators?.triggeredBonus,
        () => addPlanVisibility
      ),
    ],
  };
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
  const { entity: planEntity, applyFilters } =
    usePagination<EbitdaThresholdEntity>(
      {
        ...paginatedEbitdaThreshold,
        api: EBITDA_THRESHOLD_LISTING_API.replace(
          ":tenantId",
          tenantId
        ).replace(":ebitaId", ebidtaId?.toString()),
      },
      getDefaultPlanFilter()
    );

  useEffect(() => {
    if (addPlanConfig?.type === UserActionType.EDIT) {
      change(
        "ebitaThresholdPercentage",
        addPlanConfig?.ebitdaThreshold?.ebitaThresholdPercentage
      );
      change(
        "triggeredBonusPercentage",
        addPlanConfig?.ebitdaThreshold?.triggeredBonusPercentage
      );
    }
  }, [addPlanConfig]);

  const onSubmit = async (data: FormData) => {
    if (addPlanVisibility) {
      let sanitizedBody: any = {
        tenantId: tenantId,
        ebitaId: ebidtaId,
        ebitaThresholdPercentage: data?.ebitaThresholdPercentage,
        triggeredBonusPercentage: data?.triggeredBonusPercentage,
      };
      return new Promise<void>((resolve, reject) => {
        reduxDispatch(
          apiCall(
            addPlanConfig?.type === UserActionType.EDIT
              ? `${EBITDA_THRESHOLD_BY_ID}/${addPlanConfig?.ebitdaThreshold?.id}`
              : EBITDA_THRESHOLD_BY_ID,
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
                messages?.measure?.financialOverview?.ebidta
                  ?.ebitdaThresholdForm?.success?.[
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
    } else {
      return new Promise<void>((resolve, reject) => {
        reduxDispatch(
          apiCall(
            `${EBITDA_THRESHOLD_BY_ID}/${deletePlanConfig?.id}`,
            resolve,
            reject,
            HttpMethods.DELETE
          )
        );
      })
        .then(() => {
          hideDeletePlanForm();
          applyFilters();
          reset();
          toast(
            <Toast
              text={
                messages?.measure?.financialOverview?.ebidta
                  ?.ebitdaThresholdForm?.success?.deleted
              }
            />
          );
        })
        .catch((error) => {
          setSubmitError(error?.message);
        });
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {!addPlanVisibility && !deletePlanVisibility && (
        <>
          <FormRow minWidth="530px" alignItems="center">
            <FormRowItem>
              <StyledPlanTextTypography>
                {
                  messages?.measure?.financialOverview?.ebidta
                    ?.ebitdaThresholdForm?.thresholdSetting
                }
              </StyledPlanTextTypography>
            </FormRowItem>
            <FormRowItem justifyContent="flex-end">
              <Button
                startIcon={<ResponsiveAddIcon />}
                variant="text"
                color="primary"
                label={
                  messages?.measure?.financialOverview?.ebidta
                    ?.ebitdaThresholdForm?.addNew
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
                    id: "ebitaThresholdPercentage",
                    label:
                      messages?.measure?.financialOverview?.ebidta
                        ?.ebitdaThresholdForm?.table?.ebitdaThreshold,
                  },
                  {
                    id: "triggeredBonusPercentage",
                    label:
                      messages?.measure?.financialOverview?.ebidta
                        ?.ebitdaThresholdForm?.table?.triggeredBonus,
                  },
                ]}
                metadata={planEntity?.metadata}
                data={planEntity?.records}
                actions={[
                  {
                    id: "edit",
                    component: <StyledEditIcon />,
                    onClick: (row: EbitdaThresholdEntity) => {
                      showAddPlanForm({
                        type: UserActionType.EDIT,
                        ebitdaThreshold: {
                          id: row?.id,
                          ebitaThresholdPercentage:
                            row?.ebitaThresholdPercentage,
                          triggeredBonusPercentage:
                            row?.triggeredBonusPercentage,
                        },
                      });
                    },
                  },
                  {
                    id: "delete",
                    component: <StyledRemoveCircleIcon />,
                    onClick: (row: EbitdaThresholdEntity) => {
                      showDeletePlanForm({ id: row?.id });
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
              {connectField("ebitaThresholdPercentage", {
                label:
                  messages?.measure?.financialOverview?.ebidta
                    ?.ebitdaThresholdForm?.table?.ebitdaThreshold,
                type: "number",
                required: true,
              })(MaterialTextInput)}
            </FormRowItem>
            <FormRowItem>
              {connectField("triggeredBonusPercentage", {
                label:
                  messages?.measure?.financialOverview?.ebidta
                    ?.ebitdaThresholdForm?.table?.triggeredBonus,
                type: "number",
                required: true,
              })(MaterialTextInput)}
            </FormRowItem>
          </FormRow>
        </>
      )}
      {deletePlanVisibility && (
        <>
          <FormRow minWidth="630px">
            <FormRowItem>
              <StyledTenantManagementNoteText>
                {
                  messages?.measure?.financialOverview?.ebidta
                    ?.ebitdaThresholdForm?.note
                }
              </StyledTenantManagementNoteText>
            </FormRowItem>
          </FormRow>
        </>
      )}
      {submitError && (
        <FormRow>
          <FormRowItem>
            <FormError
              message={
                messages?.measure?.financialOverview?.ebidta
                  ?.ebitdaThresholdForm?.error?.serverError?.[submitError]
              }
            />
          </FormRowItem>
        </FormRow>
      )}
      {deletePlanVisibility && (
        <FormRow justifyContent="end" mb={0}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onCancel}
            label={
              messages?.measure?.financialOverview?.ebidta?.ebitdaThresholdForm
                ?.cancel
            }
          />
          <Button
            variant="contained"
            type="submit"
            color="error"
            disabled={submitting}
            label={
              messages?.measure?.financialOverview?.ebidta?.ebitdaThresholdForm
                ?.delete
            }
          />
        </FormRow>
      )}
      {addPlanVisibility && (
        <FormRow justifyContent="end" mb={0}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onCancel}
            label={
              messages?.measure?.financialOverview?.ebidta?.ebitdaThresholdForm
                ?.cancel
            }
          />
          <Button
            variant="contained"
            type="submit"
            disabled={submitting}
            label={
              messages?.measure?.financialOverview?.ebidta
                ?.ebitdaThresholdForm?.[
                addPlanConfig?.type === UserActionType.EDIT ? "update" : "add"
              ]
            }
          />
        </FormRow>
      )}
    </Form>
  );
};

export default EbitdaThresholdForm;
