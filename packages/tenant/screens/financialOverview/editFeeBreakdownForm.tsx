import { Divider, Grid } from "@mui/material";
import { useFormReducer } from "@wizehub/common/hooks";
import { greyScaleColour } from "@wizehub/common/theme/style.palette";
import {
  financialYearStartMonth,
  HttpMethods,
  nullablePlaceHolder,
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
import { StyledFormPercentageTypography } from "./styles";
import messages from "../../messages";
import {
  StyledAddTeamSubTextTypography,
  StyledValueTypography,
} from "../plan/budgetAndCapacity/styles";
import { useSelector } from "react-redux";
import { ReduxState } from "../../redux/reducers";
import { FEE_TYPE, Months } from "@wizehub/common/models/modules";
import { useDispatch } from "react-redux";
import { apiCall } from "@wizehub/common/redux/actions";
import { toast } from "react-toastify";
import { Id } from "@wizehub/common/models";
import { ADD_FEE_PLAN } from "../../api";
import { FeeBreakdownEntity } from "@wizehub/common/models/genericEntities";
import { percentageCalculatorFunction } from "../plan/budgetAndCapacity/budgetAndCapacityFormula";

const validators = {};

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
  feeEntity: {
    type: FEE_TYPE;
  };
  feeId: Id;
  feeBreakdownEntity: Array<FeeBreakdownEntity>;
  feeTeamId: Id;
}

const EditFeeBreakdownForm: React.FC<Props> = ({
  onCancel,
  onSuccess,
  feeEntity,
  feeId,
  feeBreakdownEntity,
  feeTeamId,
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
  } = useFormReducer(validators);

  const onSubmit = async (data: any) => {
    const sanitizedBody = {
      tenantId: tenantId,
      feeId: feeId,
      type: feeEntity?.type,
      fees: Array.from({ length: 12 }, (_, i) => {
        const value = formValues?.[Months[i].label]?.value;
        return { month: i + 1, fee: value };
      }),
    };
    return new Promise<void>((resolve, reject) => {
      reduxDispatch(
        apiCall(
          `${ADD_FEE_PLAN}/${feeTeamId}`,
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
              messages?.measure?.financialOverview?.fees?.editDetailForm
                ?.success?.[
                feeEntity?.type === FEE_TYPE.CURRENT
                  ? "currentFeeUpdate"
                  : "previousFeeUpdate"
              ]
            }
          />
        );
      })
      .catch((error) => {
        setSubmitError(error?.message);
      });
  };

  const monthArray = financialYearStartMonth(
    firmProfile?.financialYearStartMonth
  );

  const total = Object.values(formValues)?.reduce(
    (acc, item: { value: number | string; error: string }) =>
      acc + (item?.value !== null ? Number(item?.value) : 0),
    0
  );

  useEffect(() => {
    if (feeBreakdownEntity) {
      feeBreakdownEntity?.map((item) => {
        change(
          Months[item?.month - 1]?.label,
          feeEntity?.type === FEE_TYPE.CURRENT
            ? item?.currentMonthFee
            : item?.previousMonthFee
        );
      });
    }
  }, [feeBreakdownEntity]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <>
        {Array.from({ length: 6 }, (_, i) => {
          return (
            <FormRow minWidth={i === 0 && "700px"}>
              <FormRowItem
                gap={2}
                alignItems="center"
                borderRight={`1px dashed ${greyScaleColour.grey80}`}
              >
                <Grid item xs={10}>
                  {connectField(monthArray[i]?.monthName, {
                    label: `${monthArray[i]?.monthName} ($)`,
                    type: "number",
                  })(MaterialTextInput)}
                </Grid>
                <Grid item xs={2}>
                  <StyledFormPercentageTypography>
                    {formValues?.[monthArray[i]?.monthName]?.value
                      ? `${percentageCalculatorFunction(
                          formValues?.[monthArray[i]?.monthName]?.value,
                          total
                        )}%`
                      : "-"}
                  </StyledFormPercentageTypography>
                </Grid>
              </FormRowItem>
              <FormRowItem gap={2} alignItems="center">
                <Grid item xs={10}>
                  {connectField(monthArray[i + 6]?.monthName, {
                    label: `${monthArray[i + 6]?.monthName} ($)`,
                    type: "number",
                  })(MaterialTextInput)}
                </Grid>
                <Grid item xs={2}>
                  <StyledFormPercentageTypography>
                    {formValues?.[monthArray[i + 6]?.monthName]?.value
                      ? `${percentageCalculatorFunction(
                          formValues?.[monthArray[i + 6]?.monthName]?.value,
                          total
                        )}%`
                      : "-"}
                  </StyledFormPercentageTypography>
                </Grid>
              </FormRowItem>
            </FormRow>
          );
        })}
      </>
      <FormRow>
        <FormRowItem>
          <Divider sx={{ width: "100%" }} />
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <StyledAddTeamSubTextTypography>
            {messages?.measure?.financialOverview?.fees?.editDetailForm?.total}
          </StyledAddTeamSubTextTypography>
        </FormRowItem>
        <FormRowItem justifyContent="end">
          <StyledValueTypography>{total}</StyledValueTypography>
        </FormRowItem>
      </FormRow>
      {submitError && (
        <FormRow>
          <FormRowItem>
            <FormError
              message={
                messages?.measure?.financialOverview?.fees?.editDetailForm
                  ?.error?.serverError?.[submitError]
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
            messages?.measure?.financialOverview?.fees?.editDetailForm?.cancel
          }
        />
        <Button
          variant="contained"
          type="submit"
          disabled={submitting}
          label={
            messages?.measure?.financialOverview?.fees?.editDetailForm?.update
          }
        />
      </FormRow>
    </Form>
  );
};

export default EditFeeBreakdownForm;
