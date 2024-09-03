import { Divider, Grid } from "@mui/material";
import { Card, DetailPageWrapper, TooltipComponent } from "@wizehub/components";
import React, { useState } from "react";
import {
  StyledInnerGridDashedTableContainer,
  StyledInnerGridTableHeadingTypography,
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
  StyledFab5TeamNameTypography,
  StyledTeamMonthTotalTypography,
} from "./styles";
import { lockupDays } from "../firmProfile/people/mathFunctions";
import { Id } from "@wizehub/common/models";

interface Props {
  revenueEntity: Fab5RevnueEntity[];
  profitabilityEntity: Fab5ProfitabilityEntity[];
  lockupEntity: Fab5LockupEntity[];
  salesEntity: Fab5SalesEntity[];
  npsEntity: Fab5NpsEntity[];
  currentMonth: string;
}

const HorizontalView: React.FC<Props> = ({
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

  const [currentActiveTeam, setCurrentActiveTeam] = useState<Id>(null);

  const previousMonth = moment().subtract(1, "months").month();

  const teamEntity = revenueEntity?.map((item) => ({
    id: item?.budgetTeamId,
    name: item?.teamName,
  }));

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
      <Card
        cardCss={{
          width: "100%",
        }}
        noHeader={true}
      >
        <Grid container item xs={12}>
          <StyledInnerGridDashedTableContainer item xs={12} borderType="solid">
            <StyledInnerGridTableHeadingTypography textAlign="center">
              {messages?.measure?.fab5?.keyPerformanceIndicator}
            </StyledInnerGridTableHeadingTypography>
          </StyledInnerGridDashedTableContainer>
        </Grid>
        <Grid container item xs={12} gap={2}>
          <Grid container item xs={2}>
            <StyledInnerGridDashedTableContainer item xs={12} height="109px">
              <StyledInnerGridTableHeadingTypography>
                {messages?.measure?.fab5?.team}
              </StyledInnerGridTableHeadingTypography>
            </StyledInnerGridDashedTableContainer>
            <StyledInnerGridDashedTableContainer
              item
              xs={12}
              noBackgroundColor={true}
            ></StyledInnerGridDashedTableContainer>
            {teamEntity?.map((team, index) => {
              return (
                <>
                  <StyledInnerGridDashedTableContainer
                    key={team?.id}
                    item
                    xs={12}
                    paddingValue="11px 14px"
                    isClickable={true}
                    onClick={() => setCurrentActiveTeam(team?.id)}
                    isSelected={currentActiveTeam === team?.id}
                  >
                    <TooltipComponent
                      text={team?.name}
                      textComponent={
                        <StyledFab5TeamNameTypography>
                          {team?.name}
                        </StyledFab5TeamNameTypography>
                      }
                    ></TooltipComponent>
                  </StyledInnerGridDashedTableContainer>
                  <StyledInnerGridDashedTableContainer
                    item
                    xs={12}
                    noBackgroundColor={true}
                  ></StyledInnerGridDashedTableContainer>
                </>
              );
            })}
            <StyledInnerGridDashedTableContainer
              item
              xs={12}
              noBorderBottom={true}
            >
              <StyledInnerGridTableHeadingTypography>
                {messages?.measure?.fab5?.total}
              </StyledInnerGridTableHeadingTypography>
            </StyledInnerGridDashedTableContainer>
          </Grid>
          <StyledTeamBudgetScrollableContainer
            container
            item
            xs
            flexGrow={1}
            display="grid"
            gridAutoFlow="column"
            overflow="auto"
          >
            <Grid container item xs minWidth="405px" flexGrow={1}>
              <StyledInnerGridDashedTableContainer
                item
                xs={12}
                borderType="solid"
              >
                <StyledInnerGridTableHeadingTypography textAlign="center">
                  {messages?.measure?.fab5?.revenue}
                </StyledInnerGridTableHeadingTypography>
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={2.5}
                paddingValue="10px 6.5px"
              >
                <StyledTeamBudgetMonthTypography textAlign="center">
                  {messages?.measure?.fab5?.actualYtdLastYear}
                </StyledTeamBudgetMonthTypography>
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={2.5}
                paddingValue="10px 6.5px"
              >
                <StyledTeamBudgetMonthTypography textAlign="center">
                  {messages?.measure?.fab5?.actualYtdThisYear}
                </StyledTeamBudgetMonthTypography>
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={2}
                paddingValue="10px 6.5px"
              >
                <StyledTeamBudgetMonthTypography textAlign="center">
                  {messages?.measure?.fab5?.growth}
                </StyledTeamBudgetMonthTypography>
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={2.5}
                paddingValue="10px 6.5px"
              >
                <StyledTeamBudgetMonthTypography textAlign="center">
                  {messages?.measure?.fab5?.budgetYtd}
                </StyledTeamBudgetMonthTypography>
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={2.5}
                paddingValue="10px 6.5px"
              >
                <StyledTeamBudgetMonthTypography textAlign="center">
                  {messages?.measure?.fab5?.budgetVariance}
                </StyledTeamBudgetMonthTypography>
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={12}
                noBackgroundColor={true}
              ></StyledInnerGridDashedTableContainer>
              {revenueEntity?.map((revenue) => {
                const growth = percentageCalculatorFunction(
                  revenue?.totalCurrentYTD - revenue?.totalPreviousYTD,
                  revenue?.totalPreviousYTD
                );
                const budgetVariance = twoSubtractFunction(
                  revenue?.totalCurrentYTD,
                  revenue?.totalBudget
                );
                return (
                  <>
                    <StyledInnerGridDashedTableContainer
                      item
                      xs={2.5}
                      paddingValue="11px 5px"
                      isSelected={
                        currentActiveTeam ===
                        teamEntity?.filter(
                          (team) => team?.name === revenue?.teamName
                        )[0]?.id
                      }
                    >
                      <TooltipComponent
                        text={formatCurrency(revenue?.totalPreviousYTD, false)}
                        textComponent={
                          <StyledTeamBudgetMonthTypography textAlign="center">
                            {formatCurrency(revenue?.totalPreviousYTD, false)}
                          </StyledTeamBudgetMonthTypography>
                        }
                      />
                    </StyledInnerGridDashedTableContainer>
                    <StyledInnerGridDashedTableContainer
                      item
                      xs={2.5}
                      paddingValue="11px 5px"
                      isSelected={
                        currentActiveTeam ===
                        teamEntity?.filter(
                          (team) => team?.name === revenue?.teamName
                        )[0]?.id
                      }
                    >
                      <TooltipComponent
                        text={formatCurrency(revenue?.totalCurrentYTD, false)}
                        textComponent={
                          <StyledTeamBudgetMonthTypography textAlign="center">
                            {formatCurrency(revenue?.totalCurrentYTD, false)}
                          </StyledTeamBudgetMonthTypography>
                        }
                      />
                    </StyledInnerGridDashedTableContainer>
                    <StyledInnerGridDashedTableContainer
                      item
                      xs={2}
                      paddingValue="11px 5px"
                      isSelected={
                        currentActiveTeam ===
                        teamEntity?.filter(
                          (team) => team?.name === revenue?.teamName
                        )[0]?.id
                      }
                    >
                      <TooltipComponent
                        text={nullablePlaceHolder(growth)}
                        textComponent={
                          <StyledTeamBudgetMonthTypography textAlign="center">
                            {nullablePlaceHolder(growth)}
                          </StyledTeamBudgetMonthTypography>
                        }
                      />
                    </StyledInnerGridDashedTableContainer>
                    <StyledInnerGridDashedTableContainer
                      item
                      xs={2.5}
                      paddingValue="11px 5px"
                      isSelected={
                        currentActiveTeam ===
                        teamEntity?.filter(
                          (team) => team?.name === revenue?.teamName
                        )[0]?.id
                      }
                    >
                      <TooltipComponent
                        text={formatCurrency(revenue?.totalBudget, false)}
                        textComponent={
                          <StyledTeamBudgetMonthTypography textAlign="center">
                            {formatCurrency(revenue?.totalBudget, false)}
                          </StyledTeamBudgetMonthTypography>
                        }
                      />
                    </StyledInnerGridDashedTableContainer>
                    <StyledInnerGridDashedTableContainer
                      item
                      xs={2.5}
                      paddingValue="11px 5px"
                      isSelected={
                        currentActiveTeam ===
                        teamEntity?.filter(
                          (team) => team?.name === revenue?.teamName
                        )[0]?.id
                      }
                    >
                      <TooltipComponent
                        text={formatCurrency(budgetVariance, false)}
                        textComponent={
                          <StyledTeamBudgetMonthTypography textAlign="center">
                            {formatCurrency(budgetVariance, false)}
                          </StyledTeamBudgetMonthTypography>
                        }
                      />
                    </StyledInnerGridDashedTableContainer>
                    <StyledInnerGridDashedTableContainer
                      item
                      xs={12}
                      noBackgroundColor={true}
                    ></StyledInnerGridDashedTableContainer>
                  </>
                );
              })}
              <StyledInnerGridDashedTableContainer
                item
                xs={2.5}
                noBorderBottom={true}
                paddingValue="12px 5px"
              >
                <TooltipComponent
                  text={formatCurrency(totalPreviousYtd, false)}
                  textComponent={
                    <StyledTeamMonthTotalTypography textAlign="center">
                      {formatCurrency(totalPreviousYtd, false)}
                    </StyledTeamMonthTotalTypography>
                  }
                />
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={2.5}
                noBorderBottom={true}
                paddingValue="12px 5px"
              >
                <TooltipComponent
                  text={formatCurrency(totalCurrentYtd, false)}
                  textComponent={
                    <StyledTeamMonthTotalTypography textAlign="center">
                      {formatCurrency(totalCurrentYtd, false)}
                    </StyledTeamMonthTotalTypography>
                  }
                />
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={2}
                noBorderBottom={true}
                paddingValue="12px 5px"
              >
                <TooltipComponent
                  text={nullablePlaceHolder(totalGrowthPercentage)}
                  textComponent={
                    <StyledTeamMonthTotalTypography textAlign="center">
                      {nullablePlaceHolder(totalGrowthPercentage)}
                    </StyledTeamMonthTotalTypography>
                  }
                />
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={2.5}
                noBorderBottom={true}
                paddingValue="12px 5px"
              >
                <TooltipComponent
                  text={formatCurrency(totalBudget, false)}
                  textComponent={
                    <StyledTeamMonthTotalTypography textAlign="center">
                      {formatCurrency(totalBudget, false)}
                    </StyledTeamMonthTotalTypography>
                  }
                />
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={2.5}
                noBorderBottom={true}
                paddingValue="12px 5px"
              >
                <TooltipComponent
                  text={formatCurrency(totalBudgetVariance, false)}
                  textComponent={
                    <StyledTeamMonthTotalTypography textAlign="center">
                      {formatCurrency(totalBudgetVariance, false)}
                    </StyledTeamMonthTotalTypography>
                  }
                />
              </StyledInnerGridDashedTableContainer>
            </Grid>
            <Grid container item xs minWidth="380px" flexGrow={1}>
              <StyledInnerGridDashedTableContainer
                item
                xs={12}
                borderType="solid"
              >
                <StyledInnerGridTableHeadingTypography textAlign="center">
                  {messages?.measure?.fab5?.profitability}
                </StyledInnerGridTableHeadingTypography>
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={2.4}
                paddingValue="10px 6.5px"
              >
                <StyledTeamBudgetMonthTypography textAlign="center">
                  {messages?.measure?.fab5?.costOfGoods}
                </StyledTeamBudgetMonthTypography>
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={2.4}
                paddingValue="10px 6.5px"
              >
                <StyledTeamBudgetMonthTypography textAlign="center">
                  {messages?.measure?.fab5?.ytdEbitda}
                </StyledTeamBudgetMonthTypography>
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={2.4}
                paddingValue="10px 6.5px"
              >
                <StyledTeamBudgetMonthTypography textAlign="center">
                  {messages?.measure?.fab5?.ytdEbitdaPercentage}
                </StyledTeamBudgetMonthTypography>
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={2.4}
                paddingValue="10px 6.5px"
              >
                <StyledTeamBudgetMonthTypography textAlign="center">
                  {messages?.measure?.fab5?.writeOnOff}
                </StyledTeamBudgetMonthTypography>
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={2.4}
                paddingValue="10px 6.5px"
              >
                <StyledTeamBudgetMonthTypography textAlign="center">
                  {messages?.measure?.fab5?.writeOnOffPercentage}
                </StyledTeamBudgetMonthTypography>
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={12}
                noBackgroundColor={true}
              ></StyledInnerGridDashedTableContainer>
              {teamEntity?.map((team) => {
                const entity = profitabilityEntity?.filter(
                  (profit) => profit?.budgetTeamId === team?.id
                )[0];
                const cogs = percentageCalculatorFunction(
                  addAnyNumberOfValues(
                    entity?.wages,
                    entity?.directExpenses,
                    entity?.otherDirectExpenses
                  ),
                  entity?.revenue
                );
                const grossProfit = twoSubtractFunction(entity?.revenue, cogs);
                const ebitda = twoSubtractFunction(
                  grossProfit,
                  entity?.overhead
                );
                const ebitdaPercentage = percentageCalculatorFunction(
                  ebitda,
                  entity?.revenue
                );
                const writeOff = percentageCalculatorFunction(
                  entity?.totalWriteOffs,
                  entity?.revenue
                );
                return (
                  <>
                    <StyledInnerGridDashedTableContainer
                      item
                      xs={2.4}
                      paddingValue="11px 5px"
                      isSelected={currentActiveTeam === team?.id}
                    >
                      <TooltipComponent
                        text={nullablePlaceHolder(cogs)}
                        textComponent={
                          <StyledTeamBudgetMonthTypography textAlign="center">
                            {nullablePlaceHolder(cogs)}
                          </StyledTeamBudgetMonthTypography>
                        }
                      />
                    </StyledInnerGridDashedTableContainer>
                    <StyledInnerGridDashedTableContainer
                      item
                      xs={2.4}
                      paddingValue="11px 5px"
                      isSelected={currentActiveTeam === team?.id}
                    >
                      <TooltipComponent
                        text={formatCurrency(ebitda, false)}
                        textComponent={
                          <StyledTeamBudgetMonthTypography textAlign="center">
                            {formatCurrency(ebitda, false)}
                          </StyledTeamBudgetMonthTypography>
                        }
                      />
                    </StyledInnerGridDashedTableContainer>
                    <StyledInnerGridDashedTableContainer
                      item
                      xs={2.4}
                      paddingValue="11px 5px"
                      isSelected={currentActiveTeam === team?.id}
                    >
                      <TooltipComponent
                        text={nullablePlaceHolder(ebitdaPercentage)}
                        textComponent={
                          <StyledTeamBudgetMonthTypography textAlign="center">
                            {nullablePlaceHolder(ebitdaPercentage)}
                          </StyledTeamBudgetMonthTypography>
                        }
                      />
                    </StyledInnerGridDashedTableContainer>
                    <StyledInnerGridDashedTableContainer
                      item
                      xs={2.4}
                      paddingValue="11px 5px"
                      isSelected={currentActiveTeam === team?.id}
                    >
                      <TooltipComponent
                        text={formatCurrency(entity?.totalWriteOffs, false)}
                        textComponent={
                          <StyledTeamBudgetMonthTypography textAlign="center">
                            {formatCurrency(entity?.totalWriteOffs, false)}
                          </StyledTeamBudgetMonthTypography>
                        }
                      />
                    </StyledInnerGridDashedTableContainer>
                    <StyledInnerGridDashedTableContainer
                      item
                      xs={2.4}
                      paddingValue="11px 5px"
                      isSelected={currentActiveTeam === team?.id}
                    >
                      <TooltipComponent
                        text={nullablePlaceHolder(writeOff)}
                        textComponent={
                          <StyledTeamBudgetMonthTypography textAlign="center">
                            {nullablePlaceHolder(writeOff)}
                          </StyledTeamBudgetMonthTypography>
                        }
                      />
                    </StyledInnerGridDashedTableContainer>
                    <StyledInnerGridDashedTableContainer
                      item
                      xs={12}
                      noBackgroundColor={true}
                    ></StyledInnerGridDashedTableContainer>
                  </>
                );
              })}
              <StyledInnerGridDashedTableContainer
                item
                xs={2.4}
                noBorderBottom={true}
                paddingValue="12px 5px"
              >
                <TooltipComponent
                  text={nullablePlaceHolder(totalCogs)}
                  textComponent={
                    <StyledTeamMonthTotalTypography textAlign="center">
                      {nullablePlaceHolder(totalCogs)}
                    </StyledTeamMonthTotalTypography>
                  }
                />
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={2.4}
                noBorderBottom={true}
                paddingValue="12px 5px"
              >
                <TooltipComponent
                  text={formatCurrency(totalEbitda, false)}
                  textComponent={
                    <StyledTeamMonthTotalTypography textAlign="center">
                      {formatCurrency(totalEbitda, false)}
                    </StyledTeamMonthTotalTypography>
                  }
                />
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={2.4}
                noBorderBottom={true}
                paddingValue="12px 5px"
              >
                <TooltipComponent
                  text={nullablePlaceHolder(totalEbitdaPercentage)}
                  textComponent={
                    <StyledTeamMonthTotalTypography textAlign="center">
                      {nullablePlaceHolder(totalEbitdaPercentage)}
                    </StyledTeamMonthTotalTypography>
                  }
                />
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={2.4}
                noBorderBottom={true}
                paddingValue="12px 5px"
              >
                <TooltipComponent
                  text={formatCurrency(totalWriteOffs, false)}
                  textComponent={
                    <StyledTeamMonthTotalTypography textAlign="center">
                      {formatCurrency(totalWriteOffs, false)}
                    </StyledTeamMonthTotalTypography>
                  }
                />
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={2.4}
                noBorderBottom={true}
                paddingValue="12px 5px"
              >
                <TooltipComponent
                  text={nullablePlaceHolder(totalWriteOffsPercentage)}
                  textComponent={
                    <StyledTeamMonthTotalTypography textAlign="center">
                      {nullablePlaceHolder(totalWriteOffsPercentage)}
                    </StyledTeamMonthTotalTypography>
                  }
                />
              </StyledInnerGridDashedTableContainer>
            </Grid>
            <Grid container item xs minWidth="200px" flexGrow={1}>
              <StyledInnerGridDashedTableContainer
                item
                xs={12}
                borderType="solid"
              >
                <StyledInnerGridTableHeadingTypography textAlign="center">
                  {messages?.measure?.fab5?.lockup}
                </StyledInnerGridTableHeadingTypography>
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={4}
                paddingValue="10px 6.5px"
              >
                <StyledTeamBudgetMonthTypography textAlign="center">
                  {messages?.measure?.fab5?.ytdWipBalance}
                </StyledTeamBudgetMonthTypography>
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={4}
                paddingValue="10px 6.5px"
              >
                <StyledTeamBudgetMonthTypography textAlign="center">
                  {messages?.measure?.fab5?.debtorsBalance}
                </StyledTeamBudgetMonthTypography>
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={4}
                paddingValue="10px 6.5px"
              >
                <StyledTeamBudgetMonthTypography textAlign="center">
                  {messages?.measure?.fab5?.lockupDays}
                </StyledTeamBudgetMonthTypography>
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={12}
                noBackgroundColor={true}
              ></StyledInnerGridDashedTableContainer>
              {teamEntity?.map((team) => {
                const entity = lockupEntity?.filter(
                  (lockup) => lockup?.budgetTeamId === team?.id
                )[0];
                const teamBudget = revenueEntity?.filter(
                  (revenue) => revenue?.teamName === team?.name
                )[0]?.totalBudget;
                const lockup = lockupDays(
                  entity?.totalWorkInProgress,
                  entity?.totalDebts,
                  teamBudget,
                  financialYearStartMonth,
                  currentMonth
                );
                return (
                  <>
                    <StyledInnerGridDashedTableContainer
                      item
                      xs={4}
                      paddingValue="11px 5px"
                      isSelected={currentActiveTeam === team?.id}
                    >
                      <TooltipComponent
                        text={formatCurrency(
                          entity?.totalWorkInProgress,
                          false
                        )}
                        textComponent={
                          <StyledTeamBudgetMonthTypography textAlign="center">
                            {formatCurrency(entity?.totalWorkInProgress, false)}
                          </StyledTeamBudgetMonthTypography>
                        }
                      />
                    </StyledInnerGridDashedTableContainer>
                    <StyledInnerGridDashedTableContainer
                      item
                      xs={4}
                      paddingValue="11px 5px"
                      isSelected={currentActiveTeam === team?.id}
                    >
                      <TooltipComponent
                        text={formatCurrency(entity?.totalDebts, false)}
                        textComponent={
                          <StyledTeamBudgetMonthTypography textAlign="center">
                            {formatCurrency(entity?.totalDebts, false)}
                          </StyledTeamBudgetMonthTypography>
                        }
                      />
                    </StyledInnerGridDashedTableContainer>
                    <StyledInnerGridDashedTableContainer
                      item
                      xs={4}
                      paddingValue="11px 5px"
                      isSelected={currentActiveTeam === team?.id}
                    >
                      <TooltipComponent
                        text={lockup}
                        textComponent={
                          <StyledTeamBudgetMonthTypography textAlign="center">
                            {lockup}
                          </StyledTeamBudgetMonthTypography>
                        }
                      />
                    </StyledInnerGridDashedTableContainer>
                    <StyledInnerGridDashedTableContainer
                      item
                      xs={12}
                      noBackgroundColor={true}
                    ></StyledInnerGridDashedTableContainer>
                  </>
                );
              })}
              <StyledInnerGridDashedTableContainer
                item
                xs={4}
                noBorderBottom={true}
                paddingValue="12px 5px"
              >
                <TooltipComponent
                  text={formatCurrency(totalWip, false)}
                  textComponent={
                    <StyledTeamMonthTotalTypography textAlign="center">
                      {formatCurrency(totalWip, false)}
                    </StyledTeamMonthTotalTypography>
                  }
                />
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={4}
                noBorderBottom={true}
                paddingValue="12px 5px"
              >
                <TooltipComponent
                  text={formatCurrency(totalDebtors, false)}
                  textComponent={
                    <StyledTeamMonthTotalTypography textAlign="center">
                      {formatCurrency(totalDebtors, false)}
                    </StyledTeamMonthTotalTypography>
                  }
                />
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={4}
                noBorderBottom={true}
                paddingValue="12px 5px"
              >
                <TooltipComponent
                  text={totalLocupDays}
                  textComponent={
                    <StyledTeamMonthTotalTypography textAlign="center">
                      {totalLocupDays}
                    </StyledTeamMonthTotalTypography>
                  }
                />
              </StyledInnerGridDashedTableContainer>
            </Grid>
            <Grid container item xs minWidth="245px" flexGrow={1}>
              <StyledInnerGridDashedTableContainer
                item
                xs={12}
                borderType="solid"
              >
                <StyledInnerGridTableHeadingTypography textAlign="center">
                  {messages?.measure?.fab5?.sales}
                </StyledInnerGridTableHeadingTypography>
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={5}
                paddingValue="10px 6.5px"
              >
                <StyledTeamBudgetMonthTypography textAlign="center">
                  {messages?.measure?.fab5?.prospectsToClients}
                </StyledTeamBudgetMonthTypography>
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={3}
                paddingValue="10px 6.5px"
              >
                <StyledTeamBudgetMonthTypography textAlign="center">
                  {messages?.measure?.fab5?.feesWon}
                </StyledTeamBudgetMonthTypography>
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={2}
                paddingValue="10px 6.5px"
              >
                <StyledTeamBudgetMonthTypography textAlign="center">
                  {messages?.measure?.fab5?.feesLost}
                </StyledTeamBudgetMonthTypography>
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={2}
                paddingValue="10px 6.5px"
              >
                <StyledTeamBudgetMonthTypography textAlign="center">
                  {messages?.measure?.fab5?.net}
                </StyledTeamBudgetMonthTypography>
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={12}
                noBackgroundColor={true}
              ></StyledInnerGridDashedTableContainer>
              {teamEntity?.map((team) => {
                const entity = salesEntity?.filter(
                  (sales) => sales?.budgetTeamId === team?.id
                )[0];
                const totalFeeWon = twoSumFunction(
                  entity?.wonCurrentYearAccounting,
                  entity?.wonCurrentYearBookkeeping
                );
                const totalFeeLost = twoSumFunction(
                  entity?.lostCurrentYearAccounting,
                  entity?.lostCurrentYearBookkeeping
                );
                const netFee = twoSubtractFunction(totalFeeWon, totalFeeLost);
                return (
                  <>
                    <StyledInnerGridDashedTableContainer
                      item
                      xs={5}
                      paddingValue="11px 5px"
                      isSelected={currentActiveTeam === team?.id}
                    >
                      <StyledTeamBudgetMonthTypography textAlign="center">
                        -
                      </StyledTeamBudgetMonthTypography>
                    </StyledInnerGridDashedTableContainer>
                    <StyledInnerGridDashedTableContainer
                      item
                      xs={3}
                      paddingValue="11px 5px"
                      isSelected={currentActiveTeam === team?.id}
                    >
                      <TooltipComponent
                        text={formatCurrency(totalFeeWon, false)}
                        textComponent={
                          <StyledTeamBudgetMonthTypography textAlign="center">
                            {formatCurrency(totalFeeWon, false)}
                          </StyledTeamBudgetMonthTypography>
                        }
                      />
                    </StyledInnerGridDashedTableContainer>
                    <StyledInnerGridDashedTableContainer
                      item
                      xs={2}
                      paddingValue="11px 5px"
                      isSelected={currentActiveTeam === team?.id}
                    >
                      <TooltipComponent
                        text={formatCurrency(totalFeeLost, false)}
                        textComponent={
                          <StyledTeamBudgetMonthTypography textAlign="center">
                            {formatCurrency(totalFeeLost, false)}
                          </StyledTeamBudgetMonthTypography>
                        }
                      />
                    </StyledInnerGridDashedTableContainer>
                    <StyledInnerGridDashedTableContainer
                      item
                      xs={2}
                      paddingValue="11px 5px"
                      isSelected={currentActiveTeam === team?.id}
                    >
                      <TooltipComponent
                        text={formatCurrency(netFee, false)}
                        textComponent={
                          <StyledTeamBudgetMonthTypography textAlign="center">
                            {formatCurrency(netFee, false)}
                          </StyledTeamBudgetMonthTypography>
                        }
                      />
                    </StyledInnerGridDashedTableContainer>
                    <StyledInnerGridDashedTableContainer
                      item
                      xs={12}
                      noBackgroundColor={true}
                    ></StyledInnerGridDashedTableContainer>
                  </>
                );
              })}
              <StyledInnerGridDashedTableContainer
                item
                xs={5}
                noBorderBottom={true}
                paddingValue="12px 5px"
              >
                <TooltipComponent
                  text={"-"}
                  textComponent={
                    <StyledTeamMonthTotalTypography textAlign="center">
                      {"-"}
                    </StyledTeamMonthTotalTypography>
                  }
                />
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={3}
                noBorderBottom={true}
                paddingValue="12px 5px"
              >
                <TooltipComponent
                  text={formatCurrency(feeWon, false)}
                  textComponent={
                    <StyledTeamMonthTotalTypography textAlign="center">
                      {formatCurrency(feeWon, false)}
                    </StyledTeamMonthTotalTypography>
                  }
                />
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={2}
                noBorderBottom={true}
                paddingValue="12px 5px"
              >
                <TooltipComponent
                  text={formatCurrency(feeLost, false)}
                  textComponent={
                    <StyledTeamMonthTotalTypography textAlign="center">
                      {formatCurrency(feeLost, false)}
                    </StyledTeamMonthTotalTypography>
                  }
                />
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={2}
                noBorderBottom={true}
                paddingValue="12px 5px"
              >
                <TooltipComponent
                  text={formatCurrency(totalNetFee, false)}
                  textComponent={
                    <StyledTeamMonthTotalTypography textAlign="center">
                      {formatCurrency(totalNetFee, false)}
                    </StyledTeamMonthTotalTypography>
                  }
                />
              </StyledInnerGridDashedTableContainer>
            </Grid>
            <Grid container item xs minWidth="125px" flexGrow={1}>
              <StyledInnerGridDashedTableContainer
                item
                xs={12}
                borderType="solid"
              >
                <StyledInnerGridTableHeadingTypography textAlign="center">
                  {messages?.measure?.fab5?.nps}
                </StyledInnerGridTableHeadingTypography>
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={6}
                paddingValue="10px 6.5px"
              >
                <StyledTeamBudgetMonthTypography textAlign="center">
                  {messages?.measure?.fab5?.clientTeam}
                  <br />
                  {messages?.measure?.fab5?.nps}
                </StyledTeamBudgetMonthTypography>
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={6}
                paddingValue="10px 6.5px"
              >
                <StyledTeamBudgetMonthTypography textAlign="center">
                  {messages?.measure?.fab5?.team}
                  <br />
                  {messages?.measure?.fab5?.nps}
                </StyledTeamBudgetMonthTypography>
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={12}
                noBackgroundColor={true}
              ></StyledInnerGridDashedTableContainer>
              {teamEntity?.map((team) => {
                const entity = npsEntity?.filter(
                  (nps) => nps?.budgetTeamId === team?.id
                )[0];
                return (
                  <>
                    <StyledInnerGridDashedTableContainer
                      item
                      xs={6}
                      paddingValue="11px 5px"
                      isSelected={currentActiveTeam === team?.id}
                    >
                      <TooltipComponent
                        text={nullablePlaceHolder(
                          entity?.averageClientScore?.toFixed(2)
                        )}
                        textComponent={
                          <StyledTeamBudgetMonthTypography textAlign="center">
                            {nullablePlaceHolder(
                              entity?.averageClientScore?.toFixed(2)
                            )}
                          </StyledTeamBudgetMonthTypography>
                        }
                      />
                    </StyledInnerGridDashedTableContainer>
                    <StyledInnerGridDashedTableContainer
                      item
                      xs={6}
                      paddingValue="11px 5px"
                      isSelected={currentActiveTeam === team?.id}
                    >
                      <TooltipComponent
                        text={nullablePlaceHolder(
                          entity?.averageTeamScore?.toFixed(2)
                        )}
                        textComponent={
                          <StyledTeamBudgetMonthTypography textAlign="center">
                            {nullablePlaceHolder(
                              entity?.averageTeamScore?.toFixed(2)
                            )}
                          </StyledTeamBudgetMonthTypography>
                        }
                      />
                    </StyledInnerGridDashedTableContainer>
                    <StyledInnerGridDashedTableContainer
                      item
                      xs={12}
                      noBackgroundColor={true}
                    ></StyledInnerGridDashedTableContainer>
                  </>
                );
              })}
              <StyledInnerGridDashedTableContainer
                item
                xs={6}
                noBorderBottom={true}
                paddingValue="12px 5px"
              >
                <TooltipComponent
                  text={formatCurrency(totalClientNps, false)}
                  textComponent={
                    <StyledTeamMonthTotalTypography textAlign="center">
                      {formatCurrency(totalClientNps, false)}
                    </StyledTeamMonthTotalTypography>
                  }
                />
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={6}
                noBorderBottom={true}
                paddingValue="12px 5px"
              >
                <TooltipComponent
                  text={formatCurrency(totalTeamNps, false)}
                  textComponent={
                    <StyledTeamMonthTotalTypography textAlign="center">
                      {formatCurrency(totalTeamNps, false)}
                    </StyledTeamMonthTotalTypography>
                  }
                />
              </StyledInnerGridDashedTableContainer>
            </Grid>
          </StyledTeamBudgetScrollableContainer>
        </Grid>
      </Card>
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

export default HorizontalView;
