import { Divider, Grid } from "@mui/material";
import { Card, DetailPageWrapper } from "@wizehub/components";
import React from "react";
import {
  StyledEbitdaGridTableContainer,
  StyledEntityPercentageTableTextTypography,
  StyledEntityTableTextTypography,
  StyledGridTableContainer,
  StyledInnerGridDashedColouredTableContainer,
  StyledInnerGridDashedTableContainer,
  StyledInnerGridTableBoldTypography,
  StyledInnerGridTableContainer,
  StyledInnerGridTableHeadingTypography,
  StyledInnerGridTableNormalTypography,
  StyledTeamBudgetScrollableContainer,
} from "../financialOverview/styles";
import messages from "../../messages";
import { StyledTeamScoreMonthTypography } from "../netPromoterScore/styles";
import {
  addAnyNumberOfValues,
  formatCurrency,
  nullablePlaceHolder,
  totalValueMethod,
} from "@wizehub/common/utils";
import {
  StyledTeamBudgetMonthTypography,
  StyledTeamCapacityPrimaryCardTypography,
} from "../plan/budgetAndCapacity/styles";
import {
  Fab5LockupEntity,
  Fab5NpsEntity,
  Fab5ProfitabilityEntity,
  Fab5RevnueEntity,
  Fab5SalesEntity,
} from "@wizehub/common/models/genericEntities";
import {
  percentageCalculatorFunction,
  twoSubtractFunction,
  twoSumFunction,
} from "../plan/budgetAndCapacity/budgetAndCapacityFormula";
import { greyScaleColour } from "@wizehub/common/theme/style.palette";
import { useSelector } from "react-redux";
import { ReduxState } from "../../redux/reducers";
import moment from "moment";
import { Months } from "@wizehub/common/models/modules";
import {
  StyledDetailTableContent,
  StyledDetailTableHeading,
} from "@wizehub/components/detailPageWrapper/styles";
import {
  StyledBenchmarksNoteText,
  StyledTeamMonthTotalTypography,
} from "./styles";
import { lockupDays } from "../firmProfile/people/mathFunctions";

interface Props {
  revenueEntity: Fab5RevnueEntity[];
  profitabilityEntity: Fab5ProfitabilityEntity[];
  lockupEntity: Fab5LockupEntity[];
  salesEntity: Fab5SalesEntity[];
  npsEntity: Fab5NpsEntity[];
  currentMonth: string;
}

const VerticalView: React.FC<Props> = ({
  lockupEntity,
  npsEntity,
  profitabilityEntity,
  revenueEntity,
  salesEntity,
  currentMonth,
}) => {
  const { financialYearStartMonth } = useSelector(
    (state: ReduxState) => state?.firmProfile
  );

  const previousMonth = moment().subtract(1, "months").month();

  const totalPreviousYtd = totalValueMethod(revenueEntity, "totalPreviousYTD");
  const totalCurrentYtd = totalValueMethod(revenueEntity, "totalCurrentYTD");
  const totalGrowthPercentage = percentageCalculatorFunction(
    totalCurrentYtd - totalPreviousYtd,
    totalPreviousYtd
  );

  const totalBudget = totalValueMethod(revenueEntity, "totalBudget");

  const totalBudgetVariance = twoSubtractFunction(totalCurrentYtd, totalBudget);

  const totalCogs = percentageCalculatorFunction(
    addAnyNumberOfValues(
      totalValueMethod(profitabilityEntity, "wages"),
      totalValueMethod(profitabilityEntity, "directExpenses"),
      totalValueMethod(profitabilityEntity, "otherDirectExpenses")
    ),
    totalValueMethod(profitabilityEntity, "revenue")
  );

  const grossProfit = twoSubtractFunction(
    totalValueMethod(profitabilityEntity, "revenue"),
    totalCogs
  );

  const totalEbitda = twoSubtractFunction(
    grossProfit,
    totalValueMethod(profitabilityEntity, "overhead")
  );

  const totalEbitdaPercentage = percentageCalculatorFunction(
    totalEbitda,
    totalValueMethod(profitabilityEntity, "revenue")
  );

  const totalWriteOffs = totalValueMethod(
    profitabilityEntity,
    "totalWriteOffs"
  );

  const totalWriteOffsPercentage = percentageCalculatorFunction(
    totalWriteOffs,
    totalValueMethod(profitabilityEntity, "revenue")
  );

  const totalWip = totalValueMethod(lockupEntity, "totalWorkInProgress");
  const totalDebtors = totalValueMethod(lockupEntity, "totalDebts");

  const totalClientNps = totalValueMethod(npsEntity, "averageClientScore");
  const totalTeamNps = totalValueMethod(npsEntity, "averageTeamScore");

  const totalLocupDays = lockupDays(
    totalWip,
    totalDebtors,
    totalBudget,
    financialYearStartMonth,
    currentMonth
  );

  const feeWon = twoSumFunction(
    totalValueMethod(salesEntity, "wonCurrentYearAccounting"),
    totalValueMethod(salesEntity, "wonCurrentYearBookkeeping")
  );

  const feeLost = twoSumFunction(
    totalValueMethod(salesEntity, "lostCurrentYearAccounting"),
    totalValueMethod(salesEntity, "lostCurrentYearBookkeeping")
  );

  const totalNetFee = twoSubtractFunction(feeWon, feeLost);

  return (
    <>
      <StyledEbitdaGridTableContainer
        container
        xs={12}
        gap={1}
        hasPadding={true}
      >
        <StyledGridTableContainer container item xs={3}>
          <StyledInnerGridTableContainer item xs={12}>
            <StyledInnerGridTableHeadingTypography>
              {messages?.measure?.fab5?.keyPerformanceIndicator}
            </StyledInnerGridTableHeadingTypography>
          </StyledInnerGridTableContainer>
          <StyledInnerGridDashedTableContainer item xs={12}>
            <StyledInnerGridTableBoldTypography>
              {messages?.measure?.fab5?.revenue}
            </StyledInnerGridTableBoldTypography>
            <StyledInnerGridTableNormalTypography hasMarginLeft={true}>
              {messages?.measure?.fab5?.actualYtdLastYear}
            </StyledInnerGridTableNormalTypography>
            <StyledInnerGridTableNormalTypography hasMarginLeft={true}>
              {messages?.measure?.fab5?.actualYtdThisYear}
            </StyledInnerGridTableNormalTypography>
            <StyledInnerGridTableNormalTypography hasMarginLeft={true}>
              {messages?.measure?.fab5?.growth}
            </StyledInnerGridTableNormalTypography>
            <StyledInnerGridTableNormalTypography hasMarginLeft={true}>
              {messages?.measure?.fab5?.budgetYtd}
            </StyledInnerGridTableNormalTypography>
            <StyledInnerGridTableNormalTypography hasMarginLeft={true}>
              {messages?.measure?.fab5?.budgetVariance}
            </StyledInnerGridTableNormalTypography>
          </StyledInnerGridDashedTableContainer>
          <StyledInnerGridDashedTableContainer
            item
            xs={12}
            noBackgroundColor={true}
          ></StyledInnerGridDashedTableContainer>
          <StyledInnerGridDashedTableContainer item xs={12}>
            <StyledInnerGridTableBoldTypography>
              {messages?.measure?.fab5?.profitability}
            </StyledInnerGridTableBoldTypography>
            <StyledInnerGridTableNormalTypography hasMarginLeft={true}>
              {messages?.measure?.fab5?.costOfGoods}
            </StyledInnerGridTableNormalTypography>
            <StyledInnerGridTableNormalTypography hasMarginLeft={true}>
              {messages?.measure?.fab5?.ytdEbitda}
            </StyledInnerGridTableNormalTypography>
            <StyledInnerGridTableNormalTypography hasMarginLeft={true}>
              {messages?.measure?.fab5?.ytdEbitdaPercentage}
            </StyledInnerGridTableNormalTypography>
            <StyledInnerGridTableNormalTypography hasMarginLeft={true}>
              {messages?.measure?.fab5?.writeOnOff}
            </StyledInnerGridTableNormalTypography>
          </StyledInnerGridDashedTableContainer>
          <StyledInnerGridDashedTableContainer
            item
            xs={12}
            noBackgroundColor={true}
          ></StyledInnerGridDashedTableContainer>
          <StyledInnerGridDashedTableContainer item xs={12}>
            <StyledInnerGridTableBoldTypography>
              {messages?.measure?.fab5?.lockup}
            </StyledInnerGridTableBoldTypography>
            <StyledInnerGridTableNormalTypography hasMarginLeft={true}>
              {messages?.measure?.fab5?.ytdWipBalance}
            </StyledInnerGridTableNormalTypography>
            <StyledInnerGridTableNormalTypography hasMarginLeft={true}>
              {messages?.measure?.fab5?.debtorsBalance}
            </StyledInnerGridTableNormalTypography>
            <StyledInnerGridTableNormalTypography hasMarginLeft={true}>
              {messages?.measure?.fab5?.lockupDays}
            </StyledInnerGridTableNormalTypography>
          </StyledInnerGridDashedTableContainer>
          <StyledInnerGridDashedTableContainer
            item
            xs={12}
            noBackgroundColor={true}
          ></StyledInnerGridDashedTableContainer>
          <StyledInnerGridDashedTableContainer item xs={12}>
            <StyledInnerGridTableBoldTypography>
              {messages?.measure?.fab5?.sales}
            </StyledInnerGridTableBoldTypography>
            <StyledInnerGridTableNormalTypography hasMarginLeft={true}>
              {messages?.measure?.fab5?.prospectsToClients}
            </StyledInnerGridTableNormalTypography>
            <StyledInnerGridTableNormalTypography hasMarginLeft={true}>
              {messages?.measure?.fab5?.feesWon}
            </StyledInnerGridTableNormalTypography>
            <StyledInnerGridTableNormalTypography hasMarginLeft={true}>
              {messages?.measure?.fab5?.feesLost}
            </StyledInnerGridTableNormalTypography>
            <StyledInnerGridTableNormalTypography hasMarginLeft={true}>
              {messages?.measure?.fab5?.net}
            </StyledInnerGridTableNormalTypography>
          </StyledInnerGridDashedTableContainer>
          <StyledInnerGridDashedTableContainer
            item
            xs={12}
            noBackgroundColor={true}
          ></StyledInnerGridDashedTableContainer>
          <StyledInnerGridDashedTableContainer
            item
            xs={12}
            noBorderBottom={true}
          >
            <StyledInnerGridTableBoldTypography>
              {messages?.measure?.fab5?.nps}
            </StyledInnerGridTableBoldTypography>
            <StyledInnerGridTableNormalTypography hasMarginLeft={true}>
              {messages?.measure?.fab5?.client}
            </StyledInnerGridTableNormalTypography>
            <StyledInnerGridTableNormalTypography hasMarginLeft={true}>
              {messages?.measure?.fab5?.teamNps}
            </StyledInnerGridTableNormalTypography>
          </StyledInnerGridDashedTableContainer>
        </StyledGridTableContainer>

        <StyledGridTableContainer container item xs={2}>
          <StyledInnerGridTableContainer item xs={12}>
            <StyledInnerGridTableHeadingTypography>
              {messages?.measure?.financialOverview?.ebidta?.firmWide}
            </StyledInnerGridTableHeadingTypography>
          </StyledInnerGridTableContainer>
          <StyledInnerGridDashedTableContainer item xs={12}>
            <StyledInnerGridTableBoldTypography
              noHeight={false}
            ></StyledInnerGridTableBoldTypography>
            <StyledTeamMonthTotalTypography>
              {formatCurrency(totalPreviousYtd, false)}
            </StyledTeamMonthTotalTypography>
            <StyledTeamMonthTotalTypography>
              {formatCurrency(totalCurrentYtd, false)}
            </StyledTeamMonthTotalTypography>
            <StyledTeamMonthTotalTypography>
              {totalGrowthPercentage}
            </StyledTeamMonthTotalTypography>
            <StyledTeamMonthTotalTypography>
              {formatCurrency(totalBudget, false)}
            </StyledTeamMonthTotalTypography>
            <StyledTeamMonthTotalTypography>
              {formatCurrency(totalBudgetVariance, false)}
            </StyledTeamMonthTotalTypography>
          </StyledInnerGridDashedTableContainer>
          <StyledInnerGridDashedTableContainer
            item
            xs={12}
            noBackgroundColor={true}
          ></StyledInnerGridDashedTableContainer>
          <StyledInnerGridDashedTableContainer item xs={12}>
            <StyledInnerGridTableBoldTypography
              noHeight={false}
            ></StyledInnerGridTableBoldTypography>
            <StyledTeamMonthTotalTypography>
              {nullablePlaceHolder(totalCogs)}
            </StyledTeamMonthTotalTypography>
            <StyledTeamMonthTotalTypography>
              {formatCurrency(totalEbitda, false)}
            </StyledTeamMonthTotalTypography>
            <StyledTeamMonthTotalTypography>
              {nullablePlaceHolder(totalEbitdaPercentage)}
            </StyledTeamMonthTotalTypography>
            <StyledTeamMonthTotalTypography>
              {formatCurrency(totalWriteOffs, false)}
            </StyledTeamMonthTotalTypography>
          </StyledInnerGridDashedTableContainer>
          <StyledInnerGridDashedTableContainer
            item
            xs={12}
            noBackgroundColor={true}
          ></StyledInnerGridDashedTableContainer>
          <StyledInnerGridDashedTableContainer item xs={12}>
            <StyledInnerGridTableBoldTypography
              noHeight={false}
            ></StyledInnerGridTableBoldTypography>
            <StyledTeamMonthTotalTypography>
              {formatCurrency(totalWip, false)}
            </StyledTeamMonthTotalTypography>
            <StyledTeamMonthTotalTypography>
              {formatCurrency(totalDebtors, false)}
            </StyledTeamMonthTotalTypography>
            <StyledTeamMonthTotalTypography>
              {nullablePlaceHolder(totalLocupDays)}
            </StyledTeamMonthTotalTypography>
          </StyledInnerGridDashedTableContainer>
          <StyledInnerGridDashedTableContainer
            item
            xs={12}
            noBackgroundColor={true}
          ></StyledInnerGridDashedTableContainer>
          <StyledInnerGridDashedTableContainer item xs={12}>
            <StyledInnerGridTableBoldTypography
              noHeight={false}
            ></StyledInnerGridTableBoldTypography>
            <StyledTeamMonthTotalTypography>-</StyledTeamMonthTotalTypography>
            <StyledTeamMonthTotalTypography>
              {formatCurrency(feeWon, false)}
            </StyledTeamMonthTotalTypography>
            <StyledTeamMonthTotalTypography>
              {formatCurrency(feeLost, false)}
            </StyledTeamMonthTotalTypography>
            <StyledTeamMonthTotalTypography>
              {formatCurrency(totalNetFee, false)}
            </StyledTeamMonthTotalTypography>
          </StyledInnerGridDashedTableContainer>
          <StyledInnerGridDashedTableContainer
            item
            xs={12}
            noBackgroundColor={true}
          ></StyledInnerGridDashedTableContainer>
          <StyledInnerGridDashedTableContainer
            item
            xs={12}
            noBorderBottom={true}
          >
            <StyledInnerGridTableBoldTypography
              noHeight={false}
            ></StyledInnerGridTableBoldTypography>
            <StyledTeamMonthTotalTypography>
              {totalClientNps}
            </StyledTeamMonthTotalTypography>
            <StyledTeamMonthTotalTypography>
              {totalTeamNps}
            </StyledTeamMonthTotalTypography>
          </StyledInnerGridDashedTableContainer>
        </StyledGridTableContainer>

        <StyledGridTableContainer
          container
          item
          xs
          flexGrow={1}
          display="grid"
          gridAutoFlow="column"
          overflow="auto"
        >
          {revenueEntity?.map((revenue) => {
            const growth = percentageCalculatorFunction(
              revenue?.totalCurrentYTD - revenue?.totalPreviousYTD,
              revenue?.totalPreviousYTD
            );
            const budgetVariance = twoSubtractFunction(
              revenue?.totalCurrentYTD,
              revenue?.totalBudget
            );
            const teamProfitability = profitabilityEntity.filter(
              (entity) => entity?.budgetTeamId === revenue?.budgetTeamId
            )[0];
            const cogs = percentageCalculatorFunction(
              addAnyNumberOfValues(
                teamProfitability?.wages,
                teamProfitability?.directExpenses,
                teamProfitability?.otherDirectExpenses
              ),
              teamProfitability?.revenue
            );
            const grossProfit = twoSubtractFunction(
              teamProfitability?.revenue,
              cogs
            );
            const ebitda = twoSubtractFunction(
              grossProfit,
              teamProfitability?.overhead
            );
            const ebitdaPercentage = percentageCalculatorFunction(
              ebitda,
              teamProfitability?.revenue
            );
            const writeOff = percentageCalculatorFunction(
              teamProfitability?.totalWriteOffs,
              teamProfitability?.revenue
            );
            const teamLockup = lockupEntity?.filter(
              (lockup) => lockup?.budgetTeamId === revenue?.budgetTeamId
            )[0];
            const teamNps = npsEntity?.filter(
              (nps) => nps?.budgetTeamId === revenue?.budgetTeamId
            )[0];
            const sale = salesEntity?.filter(
              (sale) => sale?.budgetTeamId === revenue?.budgetTeamId
            )[0];
            const totalFeeWon = twoSumFunction(
              sale?.wonCurrentYearAccounting,
              sale?.wonCurrentYearBookkeeping
            );
            const totalFeeLost = twoSumFunction(
              sale?.lostCurrentYearAccounting,
              sale?.lostCurrentYearBookkeeping
            );
            const netFee = twoSubtractFunction(totalFeeWon, totalFeeLost);
            const lockup = lockupDays(
              teamLockup?.totalWorkInProgress,
              teamLockup?.totalDebts,
              totalBudget,
              financialYearStartMonth,
              currentMonth
            );
            return (
              <Grid
                container
                item
                xs
                minWidth="210px"
                flexGrow={1}
                key={revenue?.budgetTeamId}
              >
                <StyledInnerGridTableContainer container item xs={12}>
                  <StyledInnerGridTableHeadingTypography>
                    {revenue?.teamName}
                  </StyledInnerGridTableHeadingTypography>
                </StyledInnerGridTableContainer>
                <StyledInnerGridDashedTableContainer item xs={12}>
                  <StyledInnerGridTableBoldTypography
                    noHeight={false}
                  ></StyledInnerGridTableBoldTypography>
                  <StyledInnerGridTableNormalTypography>
                    {formatCurrency(revenue?.totalPreviousYTD, false)}
                  </StyledInnerGridTableNormalTypography>
                  <StyledInnerGridTableNormalTypography>
                    {formatCurrency(revenue?.totalCurrentYTD, false)}
                  </StyledInnerGridTableNormalTypography>
                  <StyledInnerGridTableNormalTypography>
                    {nullablePlaceHolder(growth)}
                  </StyledInnerGridTableNormalTypography>
                  <StyledInnerGridTableNormalTypography>
                    {formatCurrency(revenue?.totalBudget, false)}
                  </StyledInnerGridTableNormalTypography>
                  <StyledInnerGridTableNormalTypography>
                    {formatCurrency(budgetVariance, false)}
                  </StyledInnerGridTableNormalTypography>
                </StyledInnerGridDashedTableContainer>
                <StyledInnerGridDashedTableContainer
                  item
                  xs={12}
                  noBackgroundColor={true}
                ></StyledInnerGridDashedTableContainer>
                <StyledInnerGridDashedTableContainer item xs={12}>
                  <StyledInnerGridTableBoldTypography
                    noHeight={false}
                  ></StyledInnerGridTableBoldTypography>
                  <StyledInnerGridTableNormalTypography>
                    {nullablePlaceHolder(cogs)}
                  </StyledInnerGridTableNormalTypography>
                  <StyledInnerGridTableNormalTypography>
                    {formatCurrency(ebitda, false)}
                  </StyledInnerGridTableNormalTypography>
                  <StyledInnerGridTableNormalTypography>
                    {nullablePlaceHolder(ebitdaPercentage)}
                  </StyledInnerGridTableNormalTypography>
                  <StyledInnerGridTableNormalTypography>
                    {formatCurrency(writeOff, false)}
                  </StyledInnerGridTableNormalTypography>
                </StyledInnerGridDashedTableContainer>
                <StyledInnerGridDashedTableContainer
                  item
                  xs={12}
                  noBackgroundColor={true}
                ></StyledInnerGridDashedTableContainer>
                <StyledInnerGridDashedTableContainer item xs={12}>
                  <StyledInnerGridTableBoldTypography
                    noHeight={false}
                  ></StyledInnerGridTableBoldTypography>
                  <StyledInnerGridTableNormalTypography>
                    {formatCurrency(teamLockup?.totalWorkInProgress, false)}
                  </StyledInnerGridTableNormalTypography>
                  <StyledInnerGridTableNormalTypography>
                    {formatCurrency(teamLockup?.totalDebts, false)}
                  </StyledInnerGridTableNormalTypography>
                  <StyledInnerGridTableNormalTypography>
                    {nullablePlaceHolder(lockup)}
                  </StyledInnerGridTableNormalTypography>
                </StyledInnerGridDashedTableContainer>
                <StyledInnerGridDashedTableContainer
                  item
                  xs={12}
                  noBackgroundColor={true}
                ></StyledInnerGridDashedTableContainer>
                <StyledInnerGridDashedTableContainer item xs={12}>
                  <StyledInnerGridTableBoldTypography
                    noHeight={false}
                  ></StyledInnerGridTableBoldTypography>
                  <StyledInnerGridTableNormalTypography>
                    -
                  </StyledInnerGridTableNormalTypography>
                  <StyledInnerGridTableNormalTypography>
                    {formatCurrency(totalFeeWon, false)}
                  </StyledInnerGridTableNormalTypography>
                  <StyledInnerGridTableNormalTypography>
                    {formatCurrency(totalFeeLost, false)}
                  </StyledInnerGridTableNormalTypography>
                  <StyledInnerGridTableNormalTypography>
                    {formatCurrency(netFee, false)}
                  </StyledInnerGridTableNormalTypography>
                </StyledInnerGridDashedTableContainer>
                <StyledInnerGridDashedTableContainer
                  item
                  xs={12}
                  noBackgroundColor={true}
                ></StyledInnerGridDashedTableContainer>
                <StyledInnerGridDashedTableContainer
                  item
                  xs={12}
                  noBorderBottom={true}
                >
                  <StyledInnerGridTableBoldTypography
                    noHeight={false}
                  ></StyledInnerGridTableBoldTypography>
                  <StyledInnerGridTableNormalTypography>
                    {nullablePlaceHolder(
                      teamNps?.averageClientScore?.toFixed(2)
                    )}
                  </StyledInnerGridTableNormalTypography>
                  <StyledInnerGridTableNormalTypography>
                    {nullablePlaceHolder(teamNps?.averageTeamScore?.toFixed(2))}
                  </StyledInnerGridTableNormalTypography>
                </StyledInnerGridDashedTableContainer>
              </Grid>
            );
          })}
        </StyledGridTableContainer>
      </StyledEbitdaGridTableContainer>
      <Divider
        sx={{ width: "100%", borderStyle: "dashed", margin: "10px 0" }}
      />
      <Card
        cardCss={{
          width: "100%",
          backgroundColor: greyScaleColour.grey60,
          padding: "18px 24px",
        }}
        header={
          <Grid container xs={12} display="flex" justifyContent="space-between">
            <StyledTeamCapacityPrimaryCardTypography>
              {messages?.measure?.fab5?.wizeBenchmarks}
            </StyledTeamCapacityPrimaryCardTypography>
            <StyledTeamCapacityPrimaryCardTypography>
              {messages?.measure?.fab5?.period}{" "}
              {`${
                Months[
                  financialYearStartMonth ? financialYearStartMonth - 1 : 0
                ]?.label
              }`}{" "}
              - {`${currentMonth}`}
            </StyledTeamCapacityPrimaryCardTypography>
          </Grid>
        }
        noHeaderPadding={true}
      >
        <Divider
          sx={{ width: "100%", borderStyle: "dashed", margin: "13px 0px" }}
        />
        <Grid container item columnSpacing={2} rowGap={2}>
          <Grid item xs={3}>
            <StyledDetailTableHeading>
              {messages?.measure?.fab5?.growthPercentage}
            </StyledDetailTableHeading>
            <StyledDetailTableHeading>
              {messages?.measure?.fab5?.betterThan}
            </StyledDetailTableHeading>
            <StyledBenchmarksNoteText>{"11%"}</StyledBenchmarksNoteText>
          </Grid>
          <Grid item xs={2}>
            <StyledDetailTableHeading>
              {messages?.measure?.fab5?.costOfGoods}
            </StyledDetailTableHeading>
            <StyledBenchmarksNoteText>{"<=40%"}</StyledBenchmarksNoteText>
          </Grid>
          <Grid item xs={2}>
            <StyledDetailTableHeading>
              {messages?.measure?.fab5?.ytdEbitdaPercentage}
            </StyledDetailTableHeading>
            <StyledBenchmarksNoteText>{">=25%"}</StyledBenchmarksNoteText>
          </Grid>
          <Grid item xs={2}>
            <StyledDetailTableHeading>
              {messages?.measure?.fab5?.writeOffs}
            </StyledDetailTableHeading>
            <StyledBenchmarksNoteText>{"$0"}</StyledBenchmarksNoteText>
          </Grid>
          <Grid item xs={2}>
            <StyledDetailTableHeading>
              {messages?.measure?.fab5?.ytdWipBalanceAs}
            </StyledDetailTableHeading>
            <StyledBenchmarksNoteText>{"$0"}</StyledBenchmarksNoteText>
          </Grid>
          <Grid item xs={3}>
            <StyledDetailTableHeading>
              {messages?.measure?.fab5?.prospectsClient}
            </StyledDetailTableHeading>
            <StyledBenchmarksNoteText>{">50%"}</StyledBenchmarksNoteText>
          </Grid>
          <Grid item xs={2}>
            <StyledDetailTableHeading>
              {messages?.measure?.fab5?.lockupDays}
            </StyledDetailTableHeading>
            <StyledBenchmarksNoteText>{"$0"}</StyledBenchmarksNoteText>
          </Grid>
          <Grid item xs={2}>
            <StyledDetailTableHeading>
              {messages?.measure?.fab5?.client}
            </StyledDetailTableHeading>
            <StyledBenchmarksNoteText>{">=9"}</StyledBenchmarksNoteText>
          </Grid>
          <Grid item xs={2}>
            <StyledDetailTableHeading>
              {messages?.measure?.fab5?.teamNps}
            </StyledDetailTableHeading>
            <StyledBenchmarksNoteText>{">=9"}</StyledBenchmarksNoteText>
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

export default VerticalView;
