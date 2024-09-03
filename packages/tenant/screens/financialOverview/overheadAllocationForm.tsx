import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ReduxState } from "../../redux/reducers";
import { useDispatch } from "react-redux";
import {
  financialYearStartMonth,
  HttpMethods,
  totalValueMethod,
} from "@wizehub/common/utils";
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
  OVERHEAD_TYPE,
  OverheadAllocationMethod,
} from "@wizehub/common/models/modules";
import { Id, Option } from "@wizehub/common/models";
import { apiCall } from "@wizehub/common/redux/actions";
import { ALLOCATE_OVERHEAD, TEAM_OVERHEAD } from "../../api";
import { OverheadEntity } from "@wizehub/common/models/genericEntities";
import { toast } from "react-toastify";
import { StyledTeamCapacityBottomCardTypography } from "../plan/budgetAndCapacity/styles";

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
  ebidtaId: Id;
  teamwiseAllocation: Array<{
    teamId: Id;
    totalRevenue: number;
    teamRevenue: number;
    teamMembers: number;
  }>;
  teamOptions: Array<Option>;
}

const OverheadAllocationForm: React.FC<Props> = ({
  onCancel,
  onSuccess,
  ebidtaId,
  teamwiseAllocation,
  teamOptions,
}) => {
  const { tenantData, firmProfile } = useSelector((state: ReduxState) => state);
  const [overheadData, setOverheadData] = useState<Array<OverheadEntity>>([]);
  const { tenantId } = tenantData;
  const monthArray = financialYearStartMonth(
    firmProfile?.financialYearStartMonth
  );

  const totalEmployees = totalValueMethod(teamwiseAllocation, "teamMembers");

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

  const {
    submitting,
    submitError,
    handleSubmit,
    connectField,
    change,
    setSubmitError,
    formValues,
  } = useFormReducer();

  useEffect(() => {
    if (ebidtaId) {
      reduxDispatch(
        apiCall(
          TEAM_OVERHEAD.replace(":tenantId", tenantId).replace(
            ":ebitaId",
            ebidtaId.toString()
          ),
          (resolve) => {
            setOverheadData(resolve);
          },
          (reject) => {
            console.log(reject);
          }
        )
      );
    }
  }, [ebidtaId]);

  useEffect(() => {
    if (overheadData) {
      overheadData?.map((overhead) => {
        const monthName = Months[overhead?.month - 1]?.label;
        let overheadMethod;
        switch (overhead?.overheadType) {
          case OVERHEAD_TYPE.REVENUE:
            overheadMethod = OverheadAllocationMethod[0];
            break;
          case OVERHEAD_TYPE.HEADCOUNT:
            overheadMethod = OverheadAllocationMethod[1];
            break;
          default:
            overheadMethod = OverheadAllocationMethod[2];
            break;
        }
        if (overhead?.overheadType) {
          change(`${monthName}-overheadAllocationMethod`, overheadMethod);
        }
        change(`${monthName}-ytdOverheads`, overhead?.totalOverhead);
        overhead?.monthlyOverheads?.map((monthly) => {
          change(
            `${monthName}-${monthly?.id}-overheadAllocation`,
            monthly?.overhead
          );
        });
      });
    }
  }, [overheadData]);

  const handleOverheadType = () => {
    const overheadAllocationLabel =
      formValues?.[
        `${Months[Number(activeMonthTab) - 1]?.label}-overheadAllocationMethod`
      ]?.value?.label;
    switch (overheadAllocationLabel) {
      case OverheadAllocationMethod[0]?.label:
        return OVERHEAD_TYPE.REVENUE;
      case OverheadAllocationMethod[1]?.label:
        return OVERHEAD_TYPE.HEADCOUNT;
      default:
        return OVERHEAD_TYPE.MANUAL;
    }
  };

  const onSubmit = async (data: any) => {
    const selectedOption =
      formValues?.[
        `${Months[Number(activeMonthTab) - 1]?.label}-overheadAllocationMethod`
      ]?.value?.label;
    let sanitizedBody: any = {
      tenantId: tenantId,
      month: activeMonthTab,
      overheadType: handleOverheadType(),
    };
    if (selectedOption === OverheadAllocationMethod[2]?.label) {
      sanitizedBody = {
        ...sanitizedBody,
        totalOverhead:
          data[
            `${Months[Number(activeMonthTab) - 1].label}-overheadAllocation`
          ],
        overheads: overheadData
          ?.filter((overhead) => overhead?.month === activeMonthTab)[0]
          ?.monthlyOverheads?.map((monthly) => {
            return {
              ebitaTeamId: monthly?.id,
              overhead:
                data[
                  `${Months[Number(activeMonthTab) - 1].label}-${
                    monthly?.id
                  }-overheadAllocation`
                ],
            };
          }),
      };
    } else if (selectedOption === OverheadAllocationMethod[0]?.label) {
      console.log(teamwiseAllocation);
      sanitizedBody = {
        ...sanitizedBody,
        totalOverhead:
          data[`${Months[Number(activeMonthTab) - 1].label}-ytdOverheads`],
        overheads: teamwiseAllocation
          ?.filter((team) => team?.teamRevenue)
          ?.map((team) => {
            return {
              ebitaTeamId: team?.teamId,
              overhead: Number(
                (
                  (Number(team?.teamRevenue) / Number(team?.totalRevenue)) *
                  Number(
                    data[
                      `${Months[Number(activeMonthTab) - 1].label}-ytdOverheads`
                    ]
                  )
                ).toFixed(2)
              ),
            };
          }),
      };
    } else {
      sanitizedBody = {
        ...sanitizedBody,
        totalOverhead:
          data[`${Months[Number(activeMonthTab) - 1].label}-ytdOverheads`],
        overheads: teamwiseAllocation?.map((team) => {
          return {
            ebitaTeamId: team?.teamId,
            overhead: Number(
              (
                (Number(team?.teamMembers) / Number(totalEmployees)) *
                Number(
                  data[
                    `${Months[Number(activeMonthTab) - 1].label}-ytdOverheads`
                  ]
                )
              ).toFixed(2)
            ),
          };
        }),
      };
    }

    return new Promise<void>((resolve, reject) => {
      reduxDispatch(
        apiCall(
          `${ALLOCATE_OVERHEAD}/${ebidtaId}`,
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
              messages?.measure?.financialOverview?.ebidta
                ?.overheadAllocationForm?.success?.updated
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
                      {connectField(
                        `${month?.monthName}-overheadAllocationMethod`,
                        {
                          label:
                            messages?.measure?.financialOverview?.ebidta
                              ?.overheadAllocationForm
                              ?.overheadAllocationMethod,
                          options: OverheadAllocationMethod,
                        }
                      )(MaterialAutocompleteInput)}
                    </FormRowItem>
                  </FormRow>
                  {formValues?.[`${month?.monthName}-overheadAllocationMethod`]
                    ?.value?.label === OverheadAllocationMethod[2]?.label ? (
                    <>
                      {teamOptions?.map((team) => (
                        <FormRow alignItems="center">
                          <FormRowItem justifyContent="center">
                            <StyledTeamCapacityBottomCardTypography>
                              {team?.label}
                            </StyledTeamCapacityBottomCardTypography>
                          </FormRowItem>
                          <FormRowItem>
                            {connectField(
                              `${month?.monthName}-${team?.id}-overheadAllocation`,
                              {
                                label:
                                  messages?.measure?.financialOverview?.ebidta
                                    ?.overheadAllocationForm
                                    ?.overheadAllocation,
                              }
                            )(MaterialTextInput)}
                          </FormRowItem>
                        </FormRow>
                      ))}
                    </>
                  ) : (
                    <FormRow>
                      <FormRowItem>
                        {connectField(`${month?.monthName}-ytdOverheads`, {
                          label:
                            messages?.measure?.financialOverview?.ebidta
                              ?.overheadAllocationForm?.yearToDateOverhead,
                        })(MaterialTextInput)}
                      </FormRowItem>
                    </FormRow>
                  )}
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
                messages?.measure?.financialOverview?.ebidta
                  ?.overheadAllocationForm?.error?.serverError?.[submitError]
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
            messages?.measure?.financialOverview?.ebidta?.overheadAllocationForm
              ?.cancel
          }
        />
        <Button
          variant="contained"
          type="submit"
          disabled={submitting}
          label={
            messages?.measure?.financialOverview?.ebidta?.overheadAllocationForm
              ?.update
          }
        />
      </FormRow>
    </Form>
  );
};

export default OverheadAllocationForm;
