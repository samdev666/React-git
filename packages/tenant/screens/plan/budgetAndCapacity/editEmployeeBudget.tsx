import { Divider, Grid } from "@mui/material";
import { useFormReducer } from "@wizehub/common/hooks";
import {
  brandColour,
  greyScaleColour,
  otherColour,
} from "@wizehub/common/theme/style.palette";
import {
  financialYearStartMonth,
  formatCurrency,
  HttpMethods,
} from "@wizehub/common/utils";
import {
  Button,
  Form,
  FormError,
  FormRow,
  FormRowItem,
  MaterialTextInput,
  Toast,
} from "@wizehub/components";
import React, { useEffect } from "react";
import messages from "../../../messages";
import {
  StyledAddTeamSubTextTypography,
  StyledEditEmployeeBudgetTypography,
} from "./styles";
import { Months } from "@wizehub/common/models/modules";
import { Id } from "@wizehub/common/models";
import { TeamBudgetEntity } from "@wizehub/common/models/genericEntities";
import { TEAM_BUDGET_ALLOCATION_API } from "../../../api";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import { useDispatch } from "react-redux";
import { apiCall } from "@wizehub/common/redux/actions";
import { toast } from "react-toastify";

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
  budgetTeamId: Id;
  budgetId: Id;
  employeeBudget: TeamBudgetEntity;
}

const EditEmployeeBudgetForm: React.FC<Props> = ({
  onCancel,
  onSuccess,
  budgetTeamId,
  budgetId,
  employeeBudget,
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
    setSubmitError,
    formValues,
  } = useFormReducer();

  const onSubmit = async (data: any) => {
    const sanitizedBody = {
      tenantId: tenantId,
      budgetId: budgetId,
      budgetTeamId: budgetTeamId,
      budgets: Array.from({ length: 12 }, (_, i) => {
        const value = formValues?.[Months[i].label]?.value;
        return { month: i + 1, budget: value };
      }),
    };
    return new Promise<void>((resolve, reject) => {
      reduxDispatch(
        apiCall(
          `${TEAM_BUDGET_ALLOCATION_API}/${employeeBudget?.employee?.id}`,
          resolve,
          reject,
          HttpMethods.PATCH,
          sanitizedBody
        )
      );
    })
      .then(() => {
        onSuccess();
        toast(
          <Toast
            text={
              messages?.plan?.budgetAndCapacity?.teamBudgetTab
                ?.editTeamBudgetForm?.success
            }
          />
        );
      })
      .catch((error) => {
        setSubmitError(error?.message);
      });
  };

  const total = Object.values(formValues)?.reduce(
    (acc, item: { value: number | string; error: string }) =>
      acc + (item?.value !== null ? Number(item?.value) : 0),
    0
  );

  const monthArray = financialYearStartMonth(
    firmProfile?.financialYearStartMonth
  );

  useEffect(() => {
    if (employeeBudget) {
      employeeBudget?.monthlyBudget?.map((monthBudget) => {
        change(Months[monthBudget?.month - 1]?.label, monthBudget?.budget);
      });
    }
  }, [employeeBudget]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow>
        <FormRowItem>
          <StyledAddTeamSubTextTypography>
            {
              messages?.plan?.budgetAndCapacity?.teamBudgetTab
                ?.editTeamBudgetForm?.totalBudget
            }
          </StyledAddTeamSubTextTypography>
        </FormRowItem>
        <FormRowItem>
          <StyledAddTeamSubTextTypography>
            {
              messages?.plan?.budgetAndCapacity?.teamBudgetTab
                ?.editTeamBudgetForm?.currentBudget
            }
          </StyledAddTeamSubTextTypography>
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <StyledEditEmployeeBudgetTypography color={brandColour?.primaryDark}>
            {formatCurrency(employeeBudget?.annualBudget, false)}
          </StyledEditEmployeeBudgetTypography>
        </FormRowItem>
        <FormRowItem>
          <StyledEditEmployeeBudgetTypography
            color={
              employeeBudget?.annualBudget >= total
                ? otherColour?.successDefault
                : otherColour?.errorDefault
            }
          >
            {formatCurrency(total?.toFixed(2), false)}
          </StyledEditEmployeeBudgetTypography>
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <Divider sx={{ width: "100%", borderStyle: "dashed" }} />
        </FormRowItem>
      </FormRow>
      <>
        {Array.from({ length: 6 }, (_, i) => {
          return (
            <FormRow minWidth={i === 0 && "700px"}>
              <FormRowItem
                gap={2}
                alignItems="center"
                borderRight={`1px dashed ${greyScaleColour.grey80}`}
              >
                <Grid item xs={11.5}>
                  {connectField(monthArray[i]?.monthName, {
                    label: `${monthArray[i]?.monthName} ($)`,
                    type: "number",
                  })(MaterialTextInput)}
                </Grid>
              </FormRowItem>
              <FormRowItem gap={2} alignItems="center">
                <Grid item xs={12}>
                  {connectField(monthArray[i + 6]?.monthName, {
                    label: `${monthArray[i + 6]?.monthName} ($)`,
                    type: "number",
                  })(MaterialTextInput)}
                </Grid>
              </FormRowItem>
            </FormRow>
          );
        })}
      </>
      {submitError && (
        <FormRow>
          <FormRowItem>
            <FormError
              message={
                messages?.plan?.budgetAndCapacity?.teamBudgetTab
                  ?.editTeamBudgetForm?.error?.serverError?.[submitError]
              }
            />
          </FormRowItem>
        </FormRow>
      )}
      <FormRow justifyContent="end" mb={0} mt={2}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onCancel}
          label={
            messages?.plan?.budgetAndCapacity?.teamBudgetTab?.editTeamBudgetForm
              ?.cancel
          }
        />
        <Button
          variant="contained"
          type="submit"
          disabled={submitting}
          label={
            messages?.plan?.budgetAndCapacity?.teamBudgetTab?.editTeamBudgetForm
              ?.update
          }
        />
      </FormRow>
    </Form>
  );
};

export default EditEmployeeBudgetForm;
