import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ReduxState } from "../../redux/reducers";
import { useDispatch } from "react-redux";
import { financialYearStartMonth, HttpMethods } from "@wizehub/common/utils";
import {
  Button,
  Form,
  FormError,
  FormRow,
  FormRowItem,
  MaterialAutocompleteInput,
  MaterialTextInput,
  MultiTabComponent,
  Toast,
} from "@wizehub/components";
import { useFormReducer } from "@wizehub/common/hooks";
import messages from "../../messages";
import {
  Months,
  OverheadAllocationMethod,
} from "@wizehub/common/models/modules";
import { Id } from "@wizehub/common/models";
import { Divider } from "@mui/material";
import { StyledPlanTextTypography } from "../plan/budgetAndCapacity/styles";
import { apiCall } from "../../redux/actions";
import { TEAM_COGS, TEAM_MONTHLY_COGS } from "../../api";
import { TeamMonthlyCogs } from "@wizehub/common/models/genericEntities";
import { toast } from "react-toastify";

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
  ebidtaId: Id;
  ebidtaTeamId: Id;
}

const validators = {};

const EditTeamDetailsForm: React.FC<Props> = ({
  onCancel,
  onSuccess,
  ebidtaId,
  ebidtaTeamId,
}) => {
  const { tenantData, firmProfile } = useSelector((state: ReduxState) => state);
  const [totalMonthlyCogs, setTotalMonthlyCogs] = useState<
    Array<TeamMonthlyCogs>
  >([]);
  const { tenantId } = tenantData;
  const monthArray = financialYearStartMonth(
    firmProfile?.financialYearStartMonth
  );

  const {
    submitting,
    submitError,
    handleSubmit,
    connectField,
    change,
    setSubmitError,
    formValues,
  } = useFormReducer(validators);

  const monthTabs = monthArray?.map((month) => {
    return {
      id: month.monthNumber,
      label: month.monthName,
    };
  });

  const [activeMonthTab, setActiveMonthTab] = useState<Id>(
    monthArray[0]?.monthNumber
  );
  const reduxDispatch = useDispatch();

  useEffect(() => {
    if (ebidtaId && ebidtaTeamId) {
      reduxDispatch(
        apiCall(
          TEAM_MONTHLY_COGS.replace(":tenantId", tenantId)
            .replace(":ebitaId", ebidtaId.toString())
            .replace(":ebitaTeamId", ebidtaTeamId.toString()),
          (resolve) => {
            setTotalMonthlyCogs(resolve);
          },
          (reject) => console.log(reject)
        )
      );
    }
  }, [ebidtaId, ebidtaTeamId]);

  useEffect(() => {
    if (totalMonthlyCogs) {
      totalMonthlyCogs?.map((monthCogs) => {
        change(
          `${Months[monthCogs?.month - 1]?.label}-salaries`,
          monthCogs?.wages
        );
        change(
          `${Months[monthCogs?.month - 1]?.label}-directExpenses`,
          monthCogs?.directExpenses
        );
        change(
          `${Months[monthCogs?.month - 1]?.label}-otherDirectExpenses`,
          monthCogs?.otherDirectExpenses
        );
        change(
          `${Months[monthCogs?.month - 1]?.label}-withdrawlSalary`,
          monthCogs?.ownerWithdrawalSalary
        );
        change(
          `${Months[monthCogs?.month - 1]?.label}-marketSalary`,
          monthCogs?.ownerMarketSalary
        );
      });
    }
  }, [totalMonthlyCogs]);

  const onSubmit = async (data: any) => {
    const sanitizedBody = {
      tenantId: tenantId,
      ebitaId: ebidtaId,
      cogs: Array.from({ length: 12 }, (_, i) => {
        const wages = data[`${Months[i].label}-salaries`];
        const directExpenses = data[`${Months[i].label}-directExpenses`];
        const otherDirectExpenses =
          data[`${Months[i].label}-otherDirectExpenses`];
        const ownerWithdrawalSalary =
          data[`${Months[i].label}-withdrawlSalary`];
        const ownerMarketSalary = data[`${Months[i].label}-marketSalary`];
        return {
          month: i + 1,
          wages: wages,
          directExpenses: directExpenses,
          otherDirectExpenses: otherDirectExpenses,
          ownerWithdrawalSalary: ownerWithdrawalSalary,
          ownerMarketSalary: ownerMarketSalary,
        };
      }),
    };
    return new Promise<void>((resolve, reject) => {
      reduxDispatch(
        apiCall(
          `${TEAM_COGS}/${ebidtaTeamId}`,
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
              messages?.measure?.financialOverview?.ebidta?.editForm?.success
                ?.updated
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
      <FormRow>
        <FormRowItem>
          <MultiTabComponent
            tabs={monthTabs}
            activeTab={activeMonthTab}
            setActiveTab={setActiveMonthTab}
          />
        </FormRowItem>
      </FormRow>
      <>
        {monthArray?.map((month) => {
          return (
            <>
              {activeMonthTab === month?.monthNumber && (
                <>
                  <FormRow key={month?.monthNumber}>
                    <FormRowItem>
                      {connectField(`${month?.monthName}-salaries`, {
                        label:
                          messages?.measure?.financialOverview?.ebidta?.editForm
                            ?.salaries,
                        type: "number",
                      })(MaterialTextInput)}
                    </FormRowItem>
                    <FormRowItem>
                      {connectField(`${month?.monthName}-directExpenses`, {
                        label:
                          messages?.measure?.financialOverview?.ebidta?.editForm
                            ?.directExpenses,
                        type: "number",
                      })(MaterialTextInput)}
                    </FormRowItem>
                  </FormRow>
                  <FormRow>
                    <FormRowItem>
                      {connectField(`${month?.monthName}-otherDirectExpenses`, {
                        label:
                          messages?.measure?.financialOverview?.ebidta?.editForm
                            ?.otherDirectExpenses,
                        type: "number",
                      })(MaterialTextInput)}
                    </FormRowItem>
                  </FormRow>
                  <FormRow>
                    <Divider sx={{ width: "100%" }} />
                  </FormRow>
                  <FormRow>
                    <FormRowItem>
                      <StyledPlanTextTypography>
                        {
                          messages?.measure?.financialOverview?.ebidta?.editForm
                            ?.ownerSalary
                        }
                      </StyledPlanTextTypography>
                    </FormRowItem>
                  </FormRow>
                  <FormRow>
                    <FormRowItem>
                      {connectField(`${month?.monthName}-withdrawlSalary`, {
                        label:
                          messages?.measure?.financialOverview?.ebidta?.editForm
                            ?.withdrawlSalaries,
                        type: "number",
                      })(MaterialTextInput)}
                    </FormRowItem>
                    <FormRowItem>
                      {connectField(`${month?.monthName}-marketSalary`, {
                        label:
                          messages?.measure?.financialOverview?.ebidta?.editForm
                            ?.marketSalaries,
                        type: "number",
                      })(MaterialTextInput)}
                    </FormRowItem>
                  </FormRow>
                </>
              )}
            </>
          );
        })}
      </>
      {submitError && (
        <FormRow>
          <FormRowItem>
            <FormError
              message={
                messages?.measure?.financialOverview?.ebidta?.editForm?.error
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
          label={messages?.measure?.financialOverview?.ebidta?.editForm?.cancel}
        />
        <Button
          variant="contained"
          type="submit"
          disabled={submitting}
          label={messages?.measure?.financialOverview?.ebidta?.editForm?.update}
        />
      </FormRow>
    </Form>
  );
};

export default EditTeamDetailsForm;
