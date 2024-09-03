import { Divider, Grid } from "@mui/material";
import {
  colourProviderFunction,
  financialYearStartMonth,
  formatCurrency,
  nullablePlaceHolder,
  totalValueMethod,
} from "@wizehub/common/utils";
import { Button, Card, CustomBarChart, CustomTabs } from "@wizehub/components";
import React, { useEffect, useState } from "react";
import {
  StyledFeeContainerFooterTotalTypography,
  StyledFeeContainerFooterTypography,
} from "./styles";
import messages from "../../messages";
import {
  StyledAddTeamSubTextTypography,
  StyledValueTypography,
} from "../plan/budgetAndCapacity/styles";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import InsightsIcon from "@mui/icons-material/Insights";
import { useSelector } from "react-redux";
import { ReduxState } from "../../redux/reducers";
import { Id } from "@wizehub/common/models";
import { useEntity } from "@wizehub/common/hooks";
import {
  FeeBreakdownEntity,
  FeeBreakdownFirmWideEntity,
  TeamMonthlyBudgetEntity,
} from "@wizehub/common/models/genericEntities";
import {
  FEE_TEAM_BY_ID,
  FIRM_WIDE_MONTHLY_BUDGET,
  GET_FIRM_WIDE_FEES,
  GET_TEAM_MONTHLY_BUDGET,
} from "../../api";
import { useDispatch } from "react-redux";
import { apiCall } from "@wizehub/common/redux/actions";
import { twoSubtractFunction } from "../plan/budgetAndCapacity/budgetAndCapacityFormula";
import { otherColour } from "@wizehub/common/theme/style.palette";

interface Props {
  feeId: Id;
  feeTeamId: Id;
  budgetId: Id;
}

const varianceAnalysisTabs = [
  {
    id: "billing",
    label: messages?.measure?.financialOverview?.fees?.billing,
  },
  {
    id: "budget",
    label: messages?.measure?.financialOverview?.fees?.budget,
  },
];

const varianceAnalysisIconTabs = [
  {
    id: "tables",
    label: <FormatListBulletedIcon />,
  },
  {
    id: "chart",
    label: <InsightsIcon />,
  },
];

const VarianceAnalysis: React.FC<Props> = ({ feeId, feeTeamId, budgetId }) => {
  const { tenantData, firmProfile } = useSelector((state: ReduxState) => state);
  const [firmWideResult, setFirmWideResult] = useState<
    Array<FeeBreakdownFirmWideEntity>
  >([]);
  const [teamMonthlyBudget, setTeamMonthlyBudget] = useState<
    Array<TeamMonthlyBudgetEntity>
  >([]);
  const reduxDispatch = useDispatch();
  const monthArray = financialYearStartMonth(
    firmProfile?.financialYearStartMonth
  );
  const { tenantId } = tenantData;
  const [activeTab, setActiveTab] = useState<"billing" | "budget">("billing");
  const [activeVarianceTab, setActiveVarianceTab] = useState<
    "tables" | "chart"
  >("tables");

  const { entity: feeBreakdownEntity, refreshEntity } = useEntity<
    Array<FeeBreakdownEntity>
  >(
    FEE_TEAM_BY_ID.replace(":tenantId", tenantId).replace(
      ":feeId",
      feeId?.toString()
    ),
    feeTeamId
  );

  useEffect(() => {
    if (feeId && feeTeamId && feeTeamId !== "firm-wide") {
      refreshEntity();
    } else if (feeId && feeTeamId && feeTeamId === "firm-wide") {
      reduxDispatch(
        apiCall(
          GET_FIRM_WIDE_FEES.replace(":tenantId", tenantId).replace(
            ":feeId",
            feeId.toString()
          ),
          (resolve) => {
            setFirmWideResult(resolve);
          },
          (reject) => {}
        )
      );
    }

    if (feeId && feeTeamId) {
      reduxDispatch(
        apiCall(
          feeTeamId !== "firm-wide"
            ? GET_TEAM_MONTHLY_BUDGET.replace(":tenantId", tenantId)
                .replace(":budgetId", budgetId.toString())
                .replace(":budgetTeamId", feeTeamId.toString())
            : FIRM_WIDE_MONTHLY_BUDGET.replace(":tenantId", tenantId).replace(
                ":budgetId",
                budgetId.toString()
              ),
          (resolve) => {
            setTeamMonthlyBudget(resolve);
          },
          (reject) => {}
        )
      );
    }
  }, [feeId, feeTeamId]);

  const finalFirmWideResult = firmWideResult?.map((monthData, index) => {
    const totalCurrentMonthFee = monthData.teamsData.reduce((total, team) => {
      return total + (team.currentActualFee || 0);
    }, 0);
    const totalPreviousMonthFee = monthData.teamsData.reduce((total, team) => {
      return total + (team.previousActualFee || 0);
    }, 0);
    return {
      id: index + 1,
      month: monthData.month,
      currentMonthFee: totalCurrentMonthFee,
      previousMonthFee: totalPreviousMonthFee,
    };
  });

  const barChartData = monthArray?.map(({ monthNumber, monthName }) => {
    return {
      name: monthName,
      value:
        feeTeamId !== "firm-wide"
          ? twoSubtractFunction(
              feeBreakdownEntity?.filter((fee) => fee?.month === monthNumber)[0]
                ?.currentMonthFee,
              teamMonthlyBudget?.filter(
                (monthlyBudget) => monthlyBudget?.month === monthNumber
              )[0]?.totalBudget
            ) !== "-"
            ? Number(
                twoSubtractFunction(
                  feeBreakdownEntity?.filter(
                    (fee) => fee?.month === monthNumber
                  )[0]?.currentMonthFee,
                  teamMonthlyBudget?.filter(
                    (monthlyBudget) => monthlyBudget?.month === monthNumber
                  )[0]?.totalBudget
                )
              )
            : 0
          : twoSubtractFunction(
              finalFirmWideResult?.filter(
                (fee) => fee?.month === monthNumber
              )[0]?.currentMonthFee,
              teamMonthlyBudget?.filter(
                (monthlyBudget) => monthlyBudget?.month === monthNumber
              )[0]?.totalBudget
            ) !== "-"
          ? Number(
              twoSubtractFunction(
                finalFirmWideResult?.filter(
                  (fee) => fee?.month === monthNumber
                )[0]?.currentMonthFee,
                teamMonthlyBudget?.filter(
                  (monthlyBudget) => monthlyBudget?.month === monthNumber
                )[0]?.totalBudget
              )
            )
          : 0,
    };
  });

  return (
    <>
      <Grid
        container
        xs={12}
        marginLeft="20px"
        mt={2}
        columnSpacing={1}
        rowGap={1}
      >
        <Grid item xs={6} display="flex" alignItems="center">
          <CustomTabs
            tabs={varianceAnalysisIconTabs}
            activeTab={activeVarianceTab}
            setActiveTab={setActiveVarianceTab}
            noMarginLeft={true}
            isIconTab={true}
          />
          <StyledFeeContainerFooterTotalTypography>
            {messages?.measure?.financialOverview?.fees?.varianceAnalysis}
          </StyledFeeContainerFooterTotalTypography>
        </Grid>
        <Grid item xs={6}>
          {activeVarianceTab !== "chart" && (
            <CustomTabs
              tabs={varianceAnalysisTabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              noMarginLeft={true}
            />
          )}
        </Grid>
      </Grid>
      {activeVarianceTab !== "chart" ? (
        <Grid container xs={12} marginLeft="20px" columnSpacing={1} rowGap={1}>
          <Grid container item xs={6}>
            <Card
              noHeader={true}
              cardCss={{
                margin: "20px 0px",
                width: "100%",
              }}
              contentCss={{
                margin: "20px 0",
                height: "fit-content",
                gap: "16px",
              }}
            >
              <>
                {monthArray?.map(({ monthNumber, monthName }) => {
                  return (
                    <Grid container padding="0px 24px" key={monthNumber}>
                      <Grid item xs={8}>
                        <StyledAddTeamSubTextTypography>
                          {`${monthName} ($)`}
                        </StyledAddTeamSubTextTypography>
                      </Grid>
                      <Grid item xs={4} display="flex" justifyContent="end">
                        <StyledValueTypography
                          color={colourProviderFunction(
                            feeTeamId !== "firm-wide"
                              ? twoSubtractFunction(
                                  feeBreakdownEntity?.filter(
                                    (fee) => fee?.month === monthNumber
                                  )[0]?.currentMonthFee,
                                  teamMonthlyBudget?.filter(
                                    (monthlyBudget) =>
                                      monthlyBudget?.month === monthNumber
                                  )[0]?.totalBudget
                                )
                              : twoSubtractFunction(
                                  finalFirmWideResult?.filter(
                                    (fee) => fee?.month === monthNumber
                                  )[0]?.currentMonthFee,
                                  teamMonthlyBudget?.filter(
                                    (monthlyBudget) =>
                                      monthlyBudget?.month === monthNumber
                                  )[0]?.totalBudget
                                )
                          )}
                        >
                          {feeTeamId !== "firm-wide"
                            ? formatCurrency(
                                twoSubtractFunction(
                                  feeBreakdownEntity?.filter(
                                    (fee) => fee?.month === monthNumber
                                  )[0]?.currentMonthFee,
                                  teamMonthlyBudget?.filter(
                                    (monthlyBudget) =>
                                      monthlyBudget?.month === monthNumber
                                  )[0]?.totalBudget
                                ),
                                false
                              )
                            : formatCurrency(
                                twoSubtractFunction(
                                  finalFirmWideResult?.filter(
                                    (fee) => fee?.month === monthNumber
                                  )[0]?.currentMonthFee,
                                  teamMonthlyBudget?.filter(
                                    (monthlyBudget) =>
                                      monthlyBudget?.month === monthNumber
                                  )[0]?.totalBudget
                                ),
                                false
                              )}
                        </StyledValueTypography>
                      </Grid>
                    </Grid>
                  );
                })}
              </>
              <Grid container padding="0px 24px">
                <Divider sx={{ width: "100%" }} />
              </Grid>
              <Grid container padding="0px 24px">
                <Grid item xs={8}>
                  <StyledFeeContainerFooterTypography>
                    {messages?.measure?.financialOverview?.fees?.total}
                  </StyledFeeContainerFooterTypography>
                </Grid>
                <Grid item xs={4} display="flex" justifyContent="end">
                  <StyledFeeContainerFooterTotalTypography>
                    {feeTeamId !== "firm-wide"
                      ? formatCurrency(
                          twoSubtractFunction(
                            totalValueMethod(
                              feeBreakdownEntity,
                              "currentMonthFee"
                            ),
                            totalValueMethod(teamMonthlyBudget, "totalBudget")
                          ),
                          false
                        )
                      : formatCurrency(
                          twoSubtractFunction(
                            totalValueMethod(
                              finalFirmWideResult,
                              "currentMonthFee"
                            ),
                            totalValueMethod(teamMonthlyBudget, "totalBudget")
                          ),
                          false
                        )}
                  </StyledFeeContainerFooterTotalTypography>
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid container item xs={6}>
            <Card
              noHeader={true}
              cardCss={{
                margin: "20px 0px",
                width: "100%",
              }}
              contentCss={{
                margin: "20px 0",
                height: "fit-content",
                gap: "16px",
              }}
            >
              <>
                {monthArray?.map(({ monthName, monthNumber }) => {
                  return (
                    <Grid container padding="0px 24px" key={monthNumber}>
                      <Grid item xs={8}>
                        <StyledAddTeamSubTextTypography>
                          {`${monthName} ($)`}
                        </StyledAddTeamSubTextTypography>
                      </Grid>
                      <Grid item xs={4} display="flex" justifyContent="end">
                        <StyledValueTypography>
                          {activeTab === "billing"
                            ? feeTeamId !== "firm-wide"
                              ? formatCurrency(
                                  feeBreakdownEntity?.filter(
                                    (fee) => fee?.month === monthNumber
                                  )[0]?.currentMonthFee,
                                  false
                                )
                              : formatCurrency(
                                  finalFirmWideResult?.filter(
                                    (fee) => fee?.month === monthNumber
                                  )[0]?.currentMonthFee,
                                  false
                                )
                            : formatCurrency(
                                teamMonthlyBudget?.filter(
                                  (monthlyBudget) =>
                                    monthlyBudget?.month === monthNumber
                                )[0]?.totalBudget,
                                false
                              )}
                        </StyledValueTypography>
                      </Grid>
                    </Grid>
                  );
                })}
              </>
              <Grid container padding="0px 24px">
                <Divider sx={{ width: "100%" }} />
              </Grid>
              <Grid container padding="0px 24px">
                <Grid item xs={8}>
                  <StyledFeeContainerFooterTypography>
                    {messages?.measure?.financialOverview?.fees?.total}
                  </StyledFeeContainerFooterTypography>
                </Grid>
                <Grid item xs={4} display="flex" justifyContent="end">
                  <StyledFeeContainerFooterTotalTypography>
                    {activeTab === "billing"
                      ? feeTeamId !== "firm-wide"
                        ? formatCurrency(
                            totalValueMethod(
                              feeBreakdownEntity,
                              "currentMonthFee"
                            ),
                            false
                          )
                        : formatCurrency(
                            totalValueMethod(
                              finalFirmWideResult,
                              "currentMonthFee"
                            ),
                            false
                          )
                      : formatCurrency(
                          totalValueMethod(teamMonthlyBudget, "totalBudget"),
                          false
                        )}
                  </StyledFeeContainerFooterTotalTypography>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Card
          noHeader={true}
          cardCss={{
            margin: "20px 0px 20px 20px",
            width: "100%",
          }}
        >
          <CustomBarChart
            data={barChartData}
            xAxisDataKey="name"
            yAxisDataKeys={["value"]}
            tooltip={true}
            barSize={50}
            colors={["#0088FE"]}
            xAxisPadding={{ left: 30, right: 30 }}
            yAxisPadding={{ top: 50 }}
            margin={{
              top: 0,
              right: 30,
              left: 0,
              bottom: 50,
            }}
            barRadius={[20, 20, 0, 0]}
            height={411}
            hoverColor={otherColour.turquoise}
          />
        </Card>
      )}
    </>
  );
};

export default VarianceAnalysis;
