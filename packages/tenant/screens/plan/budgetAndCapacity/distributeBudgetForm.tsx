import { useEntity, useFormReducer } from "@wizehub/common/hooks";
import {
  Button,
  CustomRadioGroup,
  Form,
  FormError,
  FormRow,
  FormRowItem,
  Toast,
} from "@wizehub/components";
import React, { useEffect } from "react";
import messages from "../../../messages";
import { Typography } from "@mui/material";
import { StyledFormPercentageTypography } from "../../financialOverview/styles";
import { Id } from "@wizehub/common/models";
import {
  FeeBreakdownEntity,
  TeamBudgetEntity,
} from "@wizehub/common/models/genericEntities";
import { FEE_TEAM_BY_ID, TEAM_BUDGET_ALLOCATION_API } from "../../../api";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import {
  decimalFormatterFunction,
  HttpMethods,
  reorderMonthArray,
  totalValueMethod,
} from "@wizehub/common/utils";
import { allocateBudgetFunction } from "./budgetAndCapacityFormula";
import { useDispatch } from "react-redux";
import { apiCall } from "../../../redux/actions";
import { toast } from "react-toastify";

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
  feePlanId: Id;
  feeTeamId: Id;
  budgetId: Id;
  teamBudgetEntity: Array<TeamBudgetEntity>;
}

interface FormData {}

const DistributeBudgetForm: React.FC<Props> = ({
  onCancel,
  onSuccess,
  feePlanId,
  feeTeamId,
  budgetId,
  teamBudgetEntity,
}) => {
  const { tenantData, firmProfile } = useSelector((state: ReduxState) => state);
  const { tenantId } = tenantData;
  const reduxDispatch = useDispatch();
  const {
    submitting,
    submitError,
    handleSubmit,
    connectField,
    change,
    formValues,
    setSubmitError,
  } = useFormReducer();

  const { entity: feeBreakdownEntity } = useEntity<Array<FeeBreakdownEntity>>(
    FEE_TEAM_BY_ID.replace(":tenantId", tenantId).replace(
      ":feeId",
      feePlanId?.toString()
    ),
    feeTeamId
  );

  const previousValueFeeBreakdown = feeBreakdownEntity?.every(
    (item) => item?.previousMonthFee === null
  );

  const feeBreakdownTotal = totalValueMethod(
    feeBreakdownEntity,
    "previousMonthFee"
  );

  const onSubmit = async () => {
    try {
      const promises = teamBudgetEntity?.map((teamBudget) => {
        const totalTeamBudget = teamBudget?.annualBudget;
        if (!totalTeamBudget) {
          return Promise.resolve();
        }
        let sanitizedBody: any = {
          tenantId: tenantId,
          budgetId: budgetId,
          budgetTeamId: feeTeamId,
        };

        if (formValues?.distributeBy?.value === "lastYearActualFees") {
          sanitizedBody = {
            ...sanitizedBody,
            budgets: feeBreakdownEntity?.map((freeBreakdown) => {
              return {
                month: freeBreakdown?.month,
                budget: allocateBudgetFunction(
                  freeBreakdown?.previousMonthFee,
                  feeBreakdownTotal,
                  totalTeamBudget
                ),
              };
            }),
          };
        } else {
          sanitizedBody = {
            ...sanitizedBody,
            budgets: Array.from({ length: 12 }, (_, i) => {
              const value = Number((totalTeamBudget / 12).toFixed(2));
              return { month: i + 1, budget: value };
            }),
          };
        }

        sanitizedBody = {
          ...sanitizedBody,
          budgets: decimalFormatterFunction(
            reorderMonthArray(
              sanitizedBody?.budgets,
              firmProfile?.financialYearStartMonth,
              "month"
            ),
            totalTeamBudget,
            "budget"
          ),
        };

        return new Promise<void>((resolve, reject) => {
          reduxDispatch(
            apiCall(
              `${TEAM_BUDGET_ALLOCATION_API}/${teamBudget?.employee?.id}`,
              resolve,
              reject,
              HttpMethods.PATCH,
              sanitizedBody
            )
          );
        });
      });

      await Promise.all(promises);
      onSuccess();
    } catch (error) {
      onCancel();
      toast(
        <Toast
          text={
            messages?.plan?.budgetAndCapacity?.teamBudgetTab
              ?.distributeBudgetForm?.error?.serverError?.[error?.message]
          }
          type="error"
        />
      );
    }
  };

  useEffect(() => {
    if (previousValueFeeBreakdown || previousValueFeeBreakdown !== undefined)
      change("distributeBy", "lastYearActualFees");
    else change("distributeBy", "linear");
  }, [previousValueFeeBreakdown]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow width="562px">
        <FormRowItem alignItems="center" gap="16px">
          <Typography variant="subtitle1">
            {
              messages?.plan?.budgetAndCapacity?.teamBudgetTab
                ?.distributeBudgetForm?.distributeBy
            }
          </Typography>
          {connectField("distributeBy", {
            options: [
              {
                value: "lastYearActualFees",
                label:
                  messages?.plan?.budgetAndCapacity?.teamBudgetTab
                    ?.distributeBudgetForm?.lastYearActualFees,
                disabled: previousValueFeeBreakdown || previousValueFeeBreakdown === undefined,
              },
              {
                value: "linear",
                label:
                  messages?.plan?.budgetAndCapacity?.teamBudgetTab
                    ?.distributeBudgetForm?.linear,
              },
            ],
            required: true,
          })(CustomRadioGroup)}
        </FormRowItem>
      </FormRow>
      <FormRow mb={0}>
        {formValues?.distributeBy?.value === "lastYearActualFees" ? (
          <FormRowItem>
            <StyledFormPercentageTypography>
              {
                messages?.plan?.budgetAndCapacity?.teamBudgetTab
                  ?.distributeBudgetForm?.lastYearActualFeesText
              }
            </StyledFormPercentageTypography>
          </FormRowItem>
        ) : (
          <FormRowItem>
            <StyledFormPercentageTypography>
              {
                messages?.plan?.budgetAndCapacity?.teamBudgetTab
                  ?.distributeBudgetForm?.linearText
              }
            </StyledFormPercentageTypography>
          </FormRowItem>
        )}
      </FormRow>
      <FormRow>
        <FormRowItem>
          <StyledFormPercentageTypography>
            {
              messages?.plan?.budgetAndCapacity?.teamBudgetTab
                ?.distributeBudgetForm?.text
            }
          </StyledFormPercentageTypography>
        </FormRowItem>
      </FormRow>
      {submitError && (
        <FormRow>
          <FormRowItem>
            <FormError
              message={
                messages?.plan?.budgetAndCapacity?.teamBudgetTab
                  ?.distributeBudgetForm?.error?.serverError?.[submitError]
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
          label={
            messages?.plan?.budgetAndCapacity?.teamBudgetTab
              ?.distributeBudgetForm?.cancel
          }
        />
        <Button
          variant="contained"
          type="submit"
          disabled={submitting}
          label={
            messages?.plan?.budgetAndCapacity?.teamBudgetTab
              ?.distributeBudgetForm?.distribute
          }
        />
      </FormRow>
    </Form>
  );
};

export default DistributeBudgetForm;
