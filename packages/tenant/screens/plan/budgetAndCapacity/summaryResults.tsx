import { Divider, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  StyledSumaryResultsWarningTypography,
  StyledSummaryResultInnerSecondaryContainer,
  StyledSummaryResultInnerSecondaryTypography,
  StyledSummaryResultSecondaryContainer,
  StyledSummaryResultsNoteTypography,
  StyledValueTypography,
} from "./styles";
import messages from "../../../messages";
import { StyledFormPercentageTypography } from "../../financialOverview/styles";
import { Id } from "@wizehub/common/models";
import { useDispatch } from "react-redux";
import { apiCall } from "../../../redux/actions";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import { TEAM_SUMMARY_RESULT_API } from "../../../api";
import { toast } from "react-toastify";
import { Toast } from "@wizehub/components";
import { SummaryResultEntity } from "@wizehub/common/models/genericEntities";
import { TEAM_TYPE } from "@wizehub/common/models/modules";
import { formatCurrency, nullablePlaceHolder } from "@wizehub/common/utils";
import {
  percentageCalculatorFunction,
  twoSubtractFunction,
  twoSumFunction,
} from "./budgetAndCapacityFormula";
import {
  greyScaleColour,
  otherColour,
} from "@wizehub/common/theme/style.palette";
import { fontSize, fontWeight } from "@wizehub/common/theme/style.typography";

interface Props {
  budgetId: Id;
  budgetTeamId: Id;
}

const SummaryResults: React.FC<Props> = ({ budgetId, budgetTeamId }) => {
  const reduxDispatch = useDispatch();
  const [summaryResult, setSummaryResult] = useState<
    Array<SummaryResultEntity>
  >([]);
  const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);

  useEffect(() => {
    if (budgetId && budgetTeamId) {
      reduxDispatch(
        apiCall(
          TEAM_SUMMARY_RESULT_API.replace(":tenantId", tenantId)
            .replace(":budgetId", budgetId?.toString())
            .replace(":budgetTeamId", budgetTeamId?.toString()),
          (resolve) => {
            setSummaryResult(resolve);
          },
          (reject) => {
            toast(
              <Toast
                text={messages?.general?.errors?.serverError}
                type="error"
              />
            );
          }
        )
      );
    }
  }, [budgetId, budgetTeamId]);

  const teamCapacityAnalysisAccountingTeam = summaryResult?.filter(
    (summary) => summary?.team_type === TEAM_TYPE.ACCOUNTING
  )[0];
  const teamCapacityAnalysisBookkeepingTeam = summaryResult?.filter(
    (summary) => summary?.team_type === TEAM_TYPE.BOOKKEEPING
  )[0];

  const totalOverCapacity = twoSubtractFunction(
    teamCapacityAnalysisAccountingTeam?.forecast_annual_fee,
    teamCapacityAnalysisAccountingTeam?.capacity_fee
  );

  const totalOverCapacityBookkeeping = twoSubtractFunction(
    teamCapacityAnalysisBookkeepingTeam?.forecast_annual_fee,
    teamCapacityAnalysisBookkeepingTeam?.capacity_fee
  );

  const combinedForecastActualFees = twoSumFunction(
    teamCapacityAnalysisAccountingTeam?.forecast_annual_fee,
    teamCapacityAnalysisBookkeepingTeam?.forecast_annual_fee
  );

  const combinedForecastCapacityFees = twoSumFunction(
    teamCapacityAnalysisAccountingTeam?.capacity_fee,
    teamCapacityAnalysisBookkeepingTeam?.capacity_fee
  );

  const combinedOverCapacity = twoSumFunction(
    totalOverCapacity,
    totalOverCapacityBookkeeping
  );

  const spareCapacity = percentageCalculatorFunction(
    combinedOverCapacity,
    combinedForecastCapacityFees
  );

  const grossProfitForecastedFees = twoSubtractFunction(
    teamCapacityAnalysisAccountingTeam?.forecast_annual_fee,
    teamCapacityAnalysisAccountingTeam?.totalSalary
  );

  const grossProfitForecastedFeesPercentage = percentageCalculatorFunction(
    grossProfitForecastedFees,
    teamCapacityAnalysisAccountingTeam?.forecast_annual_fee
  );

  const grossProfitForecastedBookkeeping = twoSubtractFunction(
    teamCapacityAnalysisBookkeepingTeam?.forecast_annual_fee,
    teamCapacityAnalysisBookkeepingTeam?.totalSalary
  );

  const grossProfitForecastedBookkeepingPercentage =
    percentageCalculatorFunction(
      grossProfitForecastedBookkeeping,
      teamCapacityAnalysisBookkeepingTeam?.forecast_annual_fee
    );

  const combinedGrossProfitBudgetBased = twoSumFunction(
    grossProfitForecastedFees,
    grossProfitForecastedBookkeeping
  );
  const combinedGrossProfitBudgetBasedPercentage = percentageCalculatorFunction(
    combinedGrossProfitBudgetBased,
    twoSumFunction(
      teamCapacityAnalysisAccountingTeam?.forecast_annual_fee,
      teamCapacityAnalysisBookkeepingTeam?.forecast_annual_fee
    )
  );

  const accountingGrossProfitCapacityFee = twoSubtractFunction(
    teamCapacityAnalysisAccountingTeam?.capacity_fee,
    teamCapacityAnalysisAccountingTeam?.totalSalary
  );

  const accountingGrossProfitCapacityFeePercentage =
    percentageCalculatorFunction(
      accountingGrossProfitCapacityFee,
      teamCapacityAnalysisAccountingTeam?.capacity_fee
    );

  const bookkeepingGrossProfitCapacityFee = twoSubtractFunction(
    teamCapacityAnalysisBookkeepingTeam?.capacity_fee,
    teamCapacityAnalysisBookkeepingTeam?.totalSalary
  );

  const bookkeepingGrossProfitCapacityFeePercentage =
    percentageCalculatorFunction(
      bookkeepingGrossProfitCapacityFee,
      teamCapacityAnalysisBookkeepingTeam?.capacity_fee
    );

  const combinedForecastedFees = twoSumFunction(
    grossProfitForecastedFees,
    grossProfitForecastedBookkeeping
  );

  const combinedForecastedFeePercentage = percentageCalculatorFunction(
    combinedForecastedFees,
    combinedForecastActualFees
  );

  const combinedCapacityFee = twoSumFunction(
    accountingGrossProfitCapacityFee,
    bookkeepingGrossProfitCapacityFee
  );

  const combinedCapacityFeePercentage = percentageCalculatorFunction(
    combinedCapacityFee,
    combinedForecastCapacityFees
  );

  const combinedGrossProfitForecastedFeesCapacityBased =
    combinedGrossProfitBudgetBased;
  const combinedGrossProfitForecastedFeesCapacityBasedPercentage =
    percentageCalculatorFunction(
      combinedGrossProfitForecastedFeesCapacityBased,
      twoSumFunction(
        teamCapacityAnalysisAccountingTeam?.forecast_annual_fee,
        teamCapacityAnalysisBookkeepingTeam?.forecast_annual_fee
      )
    );

  return (
    <StyledSummaryResultSecondaryContainer container xs={12}>
      <StyledSummaryResultInnerSecondaryContainer container item xs={12}>
        <StyledSummaryResultInnerSecondaryTypography>
          {
            messages?.plan?.budgetAndCapacity?.summaryResultsTab
              ?.teamCapacityAnalysis
          }
        </StyledSummaryResultInnerSecondaryTypography>
        <Divider sx={{ width: "100%" }} />
        <Grid container item xs={12}>
          <Grid item xs={6}></Grid>
          <Grid item xs={2}>
            <StyledFormPercentageTypography textAlign="end">
              {
                messages?.plan?.budgetAndCapacity?.summaryResultsTab
                  ?.forecastActualFees
              }
            </StyledFormPercentageTypography>
          </Grid>
          <Grid item xs={2}>
            <StyledFormPercentageTypography textAlign="end">
              {
                messages?.plan?.budgetAndCapacity?.summaryResultsTab
                  ?.capacityFees
              }
            </StyledFormPercentageTypography>
          </Grid>
          <Grid
            item
            xs={2}
            display="flex"
            flexWrap="wrap"
            justifyContent="flex-end"
          >
            <StyledFormPercentageTypography textAlign="end">
              {messages?.plan?.budgetAndCapacity?.summaryResultsTab?.over}
            </StyledFormPercentageTypography>
            <StyledFormPercentageTypography
              textAlign="end"
              color={otherColour.errorDefault}
            >
              {messages?.plan?.budgetAndCapacity?.summaryResultsTab?.under}
            </StyledFormPercentageTypography>
            <StyledFormPercentageTypography textAlign="end">
              {messages?.plan?.budgetAndCapacity?.summaryResultsTab?.capacity}
            </StyledFormPercentageTypography>
          </Grid>
        </Grid>
        <Grid container item xs={12}>
          <Grid item xs={6}>
            <StyledFormPercentageTypography textAlign="initial">
              {
                messages?.plan?.budgetAndCapacity?.summaryResultsTab
                  ?.accountingTeam
              }
            </StyledFormPercentageTypography>
          </Grid>
          <Grid item xs={2}>
            <StyledFormPercentageTypography
              textAlign="end"
              color={greyScaleColour.grey100}
            >
              {formatCurrency(
                teamCapacityAnalysisAccountingTeam?.forecast_annual_fee,
                false
              )}
            </StyledFormPercentageTypography>
          </Grid>
          <Grid item xs={2}>
            <StyledFormPercentageTypography
              textAlign="end"
              color={greyScaleColour.grey100}
            >
              {formatCurrency(
                teamCapacityAnalysisAccountingTeam?.capacity_fee,
                false
              )}
            </StyledFormPercentageTypography>
          </Grid>
          <Grid item xs={2}>
            <StyledFormPercentageTypography
              textAlign="end"
              color={
                Number(totalOverCapacity) < 0
                  ? otherColour.errorDefault
                  : greyScaleColour.grey100
              }
            >
              {formatCurrency(totalOverCapacity, false)}
            </StyledFormPercentageTypography>
          </Grid>
        </Grid>
        <Grid container item xs={12}>
          <Grid item xs={6}>
            <StyledFormPercentageTypography textAlign="initial">
              {
                messages?.plan?.budgetAndCapacity?.summaryResultsTab
                  ?.bookkeepingTeam
              }
            </StyledFormPercentageTypography>
          </Grid>
          <Grid item xs={2}>
            <StyledFormPercentageTypography
              textAlign="end"
              color={greyScaleColour.grey100}
            >
              {formatCurrency(
                teamCapacityAnalysisBookkeepingTeam?.forecast_annual_fee,
                false
              )}
            </StyledFormPercentageTypography>
          </Grid>
          <Grid item xs={2}>
            <StyledFormPercentageTypography
              textAlign="end"
              color={greyScaleColour.grey100}
            >
              {formatCurrency(
                teamCapacityAnalysisBookkeepingTeam?.capacity_fee,
                false
              )}
            </StyledFormPercentageTypography>
          </Grid>
          <Grid item xs={2}>
            <StyledFormPercentageTypography
              textAlign="end"
              color={
                Number(totalOverCapacityBookkeeping) < 0
                  ? otherColour.errorDefault
                  : greyScaleColour.grey100
              }
            >
              {formatCurrency(totalOverCapacityBookkeeping, false)}
            </StyledFormPercentageTypography>
          </Grid>
        </Grid>
        <Divider sx={{ width: "100%", borderStyle: "dashed" }} />
        <Grid container item xs={12}>
          <Grid item xs={6}>
            <StyledFormPercentageTypography textAlign="initial">
              {messages?.plan?.budgetAndCapacity?.summaryResultsTab?.combined}
            </StyledFormPercentageTypography>
          </Grid>
          <Grid item xs={2}>
            <StyledFormPercentageTypography textAlign="end">
              {formatCurrency(combinedForecastActualFees, false)}
            </StyledFormPercentageTypography>
          </Grid>
          <Grid item xs={2}>
            <StyledFormPercentageTypography textAlign="end">
              {formatCurrency(combinedForecastCapacityFees, false)}
            </StyledFormPercentageTypography>
          </Grid>
          <Grid item xs={2}>
            <StyledFormPercentageTypography
              textAlign="end"
              color={
                Number(combinedOverCapacity) < 0
                  ? otherColour.errorDefault
                  : greyScaleColour.grey100
              }
            >
              {formatCurrency(combinedOverCapacity, false)}
            </StyledFormPercentageTypography>
          </Grid>
        </Grid>
        <Divider sx={{ width: "100%", borderStyle: "dashed" }} />
        <Grid container item xs={12}>
          <Grid item xs={10}>
            <StyledFormPercentageTypography textAlign="initial">
              {
                messages?.plan?.budgetAndCapacity?.summaryResultsTab
                  ?.spareCapacity
              }
            </StyledFormPercentageTypography>
          </Grid>
          <Grid item xs={2}>
            <StyledFormPercentageTypography
              textAlign="end"
              fontSize={fontSize.h5}
              fontWeight={fontWeight.bold}
              color={
                Number(spareCapacity) >= 10 && Number(spareCapacity) <= 15
                  ? otherColour.successDefault
                  : otherColour.errorDefault
              }
            >
              {`${spareCapacity}%`}
            </StyledFormPercentageTypography>
          </Grid>
        </Grid>
        <Grid container item xs={12}>
          <Grid item xs={10}></Grid>
          <Grid item xs={12}>
            <StyledSumaryResultsWarningTypography textAlign="end">
              {messages?.plan?.budgetAndCapacity?.summaryResultsTab?.aim}
            </StyledSumaryResultsWarningTypography>
          </Grid>
        </Grid>
      </StyledSummaryResultInnerSecondaryContainer>
      <StyledSummaryResultInnerSecondaryContainer container item xs={12}>
        <StyledSummaryResultInnerSecondaryTypography>
          {
            messages?.plan?.budgetAndCapacity?.summaryResultsTab
              ?.grossProfitAnalysis
          }
        </StyledSummaryResultInnerSecondaryTypography>
        <Divider sx={{ width: "100%" }} />
        <Grid container item xs={12}>
          <Grid item xs={3}>
            <StyledValueTypography textAlign="initial">
              {
                messages?.plan?.budgetAndCapacity?.summaryResultsTab
                  ?.totalTeamCapacity
              }
            </StyledValueTypography>
          </Grid>
          <Grid item xs>
            <StyledFormPercentageTypography
              fontSize={fontSize.h5}
              fontWeight={fontWeight.bold}
            >
              {formatCurrency(combinedForecastCapacityFees, false)}
            </StyledFormPercentageTypography>
          </Grid>
        </Grid>
        <Divider sx={{ width: "100%", borderStyle: "dashed" }} />
        <Grid container item xs={12}>
          <Grid item xs={4}></Grid>
          <Grid item xs={4}>
            <StyledFormPercentageTypography textAlign="end">
              {
                messages?.plan?.budgetAndCapacity?.summaryResultsTab
                  ?.grossProfitForecastFees
              }
            </StyledFormPercentageTypography>
          </Grid>
          <Grid item xs={4}>
            <StyledFormPercentageTypography textAlign="end">
              {
                messages?.plan?.budgetAndCapacity?.summaryResultsTab
                  ?.grossProfitCapacityFees
              }
            </StyledFormPercentageTypography>
          </Grid>
        </Grid>
        <Grid container item xs={12}>
          <Grid item xs={4}></Grid>
          <Grid container item xs={4}>
            <Grid item xs={7}>
              <StyledFormPercentageTypography textAlign="end">
                {
                  messages?.plan?.budgetAndCapacity?.summaryResultsTab
                    ?.grossProfit
                }
              </StyledFormPercentageTypography>
            </Grid>
            <Grid item xs={5}>
              <StyledFormPercentageTypography textAlign="end">
                {
                  messages?.plan?.budgetAndCapacity?.summaryResultsTab
                    ?.percentage
                }
              </StyledFormPercentageTypography>
            </Grid>
          </Grid>
          <Grid container item xs={4}>
            <Grid item xs={7}>
              <StyledFormPercentageTypography textAlign="end">
                {
                  messages?.plan?.budgetAndCapacity?.summaryResultsTab
                    ?.grossProfit
                }
              </StyledFormPercentageTypography>
            </Grid>
            <Grid item xs={5}>
              <StyledFormPercentageTypography textAlign="end">
                {
                  messages?.plan?.budgetAndCapacity?.summaryResultsTab
                    ?.percentage
                }
              </StyledFormPercentageTypography>
            </Grid>
          </Grid>
        </Grid>
        <Grid container item xs={12}>
          <Grid item xs={4}>
            <StyledFormPercentageTypography>
              {
                messages?.plan?.budgetAndCapacity?.summaryResultsTab
                  ?.accountingTeam
              }
            </StyledFormPercentageTypography>
          </Grid>
          <Grid container item xs={4}>
            <Grid item xs={7}>
              <StyledFormPercentageTypography
                textAlign="end"
                color={greyScaleColour.grey100}
              >
                {formatCurrency(grossProfitForecastedFees, false)}
              </StyledFormPercentageTypography>
            </Grid>
            <Grid item xs={5}>
              <StyledFormPercentageTypography
                textAlign="end"
                color={greyScaleColour.grey100}
              >
                {nullablePlaceHolder(grossProfitForecastedFeesPercentage)}
              </StyledFormPercentageTypography>
            </Grid>
          </Grid>
          <Grid container item xs={4}>
            <Grid item xs={7}>
              <StyledFormPercentageTypography
                textAlign="end"
                color={greyScaleColour.grey100}
              >
                {formatCurrency(accountingGrossProfitCapacityFee, false)}
              </StyledFormPercentageTypography>
            </Grid>
            <Grid item xs={5}>
              <StyledFormPercentageTypography
                textAlign="end"
                color={greyScaleColour.grey100}
              >
                {nullablePlaceHolder(
                  accountingGrossProfitCapacityFeePercentage
                )}
              </StyledFormPercentageTypography>
            </Grid>
          </Grid>
        </Grid>
        <Grid container item xs={12}>
          <Grid item xs={4}>
            <StyledFormPercentageTypography>
              {
                messages?.plan?.budgetAndCapacity?.summaryResultsTab
                  ?.bookkeepingTeam
              }
            </StyledFormPercentageTypography>
          </Grid>
          <Grid container item xs={4}>
            <Grid item xs={7}>
              <StyledFormPercentageTypography
                textAlign="end"
                color={greyScaleColour.grey100}
              >
                {formatCurrency(grossProfitForecastedBookkeeping, false)}
              </StyledFormPercentageTypography>
            </Grid>
            <Grid item xs={5}>
              <StyledFormPercentageTypography
                textAlign="end"
                color={greyScaleColour.grey100}
              >
                {nullablePlaceHolder(
                  grossProfitForecastedBookkeepingPercentage
                )}
              </StyledFormPercentageTypography>
            </Grid>
          </Grid>
          <Grid container item xs={4}>
            <Grid item xs={7}>
              <StyledFormPercentageTypography
                textAlign="end"
                color={greyScaleColour.grey100}
              >
                {formatCurrency(bookkeepingGrossProfitCapacityFee, false)}
              </StyledFormPercentageTypography>
            </Grid>
            <Grid item xs={5}>
              <StyledFormPercentageTypography
                textAlign="end"
                color={greyScaleColour.grey100}
              >
                {nullablePlaceHolder(
                  bookkeepingGrossProfitCapacityFeePercentage
                )}
              </StyledFormPercentageTypography>
            </Grid>
          </Grid>
        </Grid>
        <Divider sx={{ width: "100%", borderStyle: "dashed" }} />
        <Grid container item xs={12}>
          <Grid item xs={4}>
            <StyledFormPercentageTypography>
              {messages?.plan?.budgetAndCapacity?.summaryResultsTab?.combined}
            </StyledFormPercentageTypography>
          </Grid>
          <Grid container item xs={4}>
            <Grid item xs={7}>
              <StyledFormPercentageTypography
                textAlign="end"
                color={
                  Number(combinedForecastedFees) < 60
                    ? otherColour.errorDefault
                    : greyScaleColour.secondaryMain
                }
              >
                {formatCurrency(combinedForecastedFees, false)}
              </StyledFormPercentageTypography>
            </Grid>
            <Grid item xs={5}>
              <StyledFormPercentageTypography
                textAlign="end"
                color={
                  Number(combinedForecastedFees) < 60
                    ? otherColour.errorDefault
                    : greyScaleColour.secondaryMain
                }
              >
                {`${nullablePlaceHolder(combinedForecastedFeePercentage)}%`}
              </StyledFormPercentageTypography>
            </Grid>
          </Grid>
          <Grid container item xs={4}>
            <Grid item xs={7}>
              <StyledFormPercentageTypography
                textAlign="end"
                color={
                  Number(combinedCapacityFee) < 60
                    ? otherColour.errorDefault
                    : greyScaleColour.secondaryMain
                }
              >
                {formatCurrency(combinedCapacityFee, false)}
              </StyledFormPercentageTypography>
            </Grid>
            <Grid item xs={5}>
              <StyledFormPercentageTypography
                textAlign="end"
                color={
                  Number(combinedCapacityFee) < 60
                    ? otherColour.errorDefault
                    : greyScaleColour.secondaryMain
                }
              >
                {`${nullablePlaceHolder(combinedCapacityFeePercentage)}%`}
              </StyledFormPercentageTypography>
            </Grid>
          </Grid>
        </Grid>
        <Divider sx={{ width: "100%", borderStyle: "dashed" }} />
        <Grid container item xs={12}>
          <Grid item xs={4}>
            <StyledFormPercentageTypography>
              {messages?.plan?.budgetAndCapacity?.summaryResultsTab?.kpi}
            </StyledFormPercentageTypography>
          </Grid>
          <Grid container item xs={4}>
            <Grid item xs={7}>
              <StyledSummaryResultsNoteTypography
                textAlign="end"
                meetsKPI={!(Number(combinedForecastedFeePercentage) < 60)}
              >
                {
                  messages?.plan?.budgetAndCapacity?.summaryResultsTab?.[
                    Number(combinedForecastedFeePercentage) < 60
                      ? "review"
                      : "exceedsText"
                  ]
                }
              </StyledSummaryResultsNoteTypography>
            </Grid>
            <Grid item xs={5}>
              <StyledFormPercentageTypography textAlign="end">
                60%
              </StyledFormPercentageTypography>
            </Grid>
          </Grid>
          <Grid container item xs={4}>
            <Grid item xs={7}>
              <StyledSummaryResultsNoteTypography
                textAlign="end"
                meetsKPI={!(Number(combinedCapacityFeePercentage) < 60)}
              >
                {
                  messages?.plan?.budgetAndCapacity?.summaryResultsTab?.[
                    Number(combinedCapacityFeePercentage) < 60
                      ? "review"
                      : "exceedsText"
                  ]
                }
              </StyledSummaryResultsNoteTypography>
            </Grid>
            <Grid item xs={5}>
              <StyledFormPercentageTypography textAlign="end">
                60%
              </StyledFormPercentageTypography>
            </Grid>
          </Grid>
        </Grid>
      </StyledSummaryResultInnerSecondaryContainer>
    </StyledSummaryResultSecondaryContainer>
  );
};

export default SummaryResults;
