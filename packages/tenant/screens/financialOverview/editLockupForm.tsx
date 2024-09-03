import { Divider, Grid } from "@mui/material";
import { useEntity, useFormReducer } from "@wizehub/common/hooks";
import { greyScaleColour } from "@wizehub/common/theme/style.palette";
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
import messages from "../../messages";
import {
  StyledAddTeamSubTextTypography,
  StyledValueTypography,
} from "../plan/budgetAndCapacity/styles";
import { LOCKUP_MONTH_TYPE, Months } from "@wizehub/common/models/modules";
import { Id } from "@wizehub/common/models";
import { LockupTeamEntity } from "@wizehub/common/models/genericEntities";
import { LOCKUP_TEAM_BY_ID, TENANT_LOCKUP } from "../../api";
import { useSelector } from "react-redux";
import { ReduxState } from "../../redux/reducers";
import { useDispatch } from "react-redux";
import { apiCall } from "@wizehub/common/redux/actions";
import { toast } from "react-toastify";

const validators = {};

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
  lockupEntity: {
    type: LOCKUP_MONTH_TYPE;
    value: Id;
  };
  lockupId: Id;
}

const EditLockupForm: React.FC<Props> = ({
  onCancel,
  onSuccess,
  lockupEntity,
  lockupId,
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
      lockupId: lockupId,
      type: lockupEntity?.type,
      lockups: Array.from({ length: 12 }, (_, i) => {
        const value = formValues?.[Months[i].label]?.value;
        return { month: i + 1, value };
      }),
    };
    return new Promise<void>((resolve, reject) => {
      reduxDispatch(
        apiCall(
          `${TENANT_LOCKUP}/${lockupEntity?.value}`,
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
              messages?.measure?.financialOverview?.lockup?.editForm?.success?.[
                lockupEntity?.type === LOCKUP_MONTH_TYPE.DEBTORS
                  ? "debtorsUpdated"
                  : "wipUpdated"
              ]
            }
          />
        );
      })
      .catch((error) => {
        setSubmitError(error?.message);
      });
  };

  const { entity: lockupTeamEntity } = useEntity<Array<LockupTeamEntity>>(
    LOCKUP_TEAM_BY_ID.replace(":tenantId", tenantId).replace(
      ":lockupId",
      lockupId.toString()
    ),
    lockupEntity?.value
  );

  const total = Object.values(formValues)?.reduce(
    (acc, item: { value: number | string; error: string }) =>
      acc + (item?.value !== null ? Number(item?.value) : 0),
    0
  );

  useEffect(() => {
    if (lockupTeamEntity) {
      lockupTeamEntity?.map((item) =>
        change(
          Months[item?.month - 1]?.label,
          lockupEntity?.type === LOCKUP_MONTH_TYPE.DEBTORS
            ? item?.debts
            : item?.workInProgress
        )
      );
    }
  }, [lockupTeamEntity]);

  const monthArray = financialYearStartMonth(
    firmProfile?.financialYearStartMonth
  );
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
          <StyledValueTypography>
            {formatCurrency(total, false)}
          </StyledValueTypography>
        </FormRowItem>
      </FormRow>
      {submitError && (
        <FormRow>
          <FormRowItem>
            <FormError
              message={
                messages?.measure?.financialOverview?.lockup?.editForm?.error
                  ?.serverError?.[submitError]
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

export default EditLockupForm;
