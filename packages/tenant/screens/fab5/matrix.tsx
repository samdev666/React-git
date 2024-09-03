import { Grid } from "@mui/material";
import { brandColour, otherColour } from "@wizehub/common/theme/style.palette";
import {
  CustomBarChart,
  CustomChartWrapper,
  CustomLineChart,
  GroupChart,
} from "@wizehub/components";
import React, { useEffect, useState } from "react";
import messages from "../../messages";
import { useSelector } from "react-redux";
import { ReduxState } from "../../redux/reducers";
import { useDispatch } from "react-redux";
import { apiCall } from "@wizehub/common/redux/actions";
import { FEE_FIRM_WIDE_RESULTS } from "../../api";
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
import { addAnyNumberOfValues, totalValueMethod } from "@wizehub/common/utils";

interface Props {
  revenueEntity: Fab5RevnueEntity[];
  profitabilityEntity: Fab5ProfitabilityEntity[];
  npsEntity: Fab5NpsEntity[];
  lockupEntity: Fab5LockupEntity[];
  salesEntity: Fab5SalesEntity[];
}

interface FeesEntity {
  financialYear: number;
  currentActualFee: number;
}

const Matrix: React.FC<Props> = ({
  revenueEntity,
  profitabilityEntity,
  npsEntity,
  lockupEntity,
  salesEntity,
}) => {
  const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
  const [fee, setFee] = useState<Array<any>>([]);
  const reduxDispatch = useDispatch();

  const totalCurrentYtd = totalValueMethod(revenueEntity, "totalCurrentYTD");
  const totalBudget = totalValueMethod(revenueEntity, "totalBudget");

  const revenueByTeam = revenueEntity?.map((revenue) => ({
    name: revenue?.teamName,
    lastYear: revenue?.totalPreviousYTD,
    currentYear: revenue?.totalCurrentYTD,
    budget: revenue?.totalBudget,
  }));

  const feeWonLostByTeam = salesEntity?.map((sales) => ({
    name: sales?.teamName,
    feeWon: Number(
      twoSumFunction(
        sales?.wonCurrentYearAccounting,
        sales?.wonCurrentYearBookkeeping
      )
    ),
    feeLost: Number(
      twoSumFunction(
        sales?.lostCurrentYearAccounting,
        sales?.lostCurrentYearBookkeeping
      )
    ),
    net: Number(
      twoSubtractFunction(
        Number(
          twoSumFunction(
            sales?.wonCurrentYearAccounting,
            sales?.wonCurrentYearBookkeeping
          )
        ),
        Number(
          twoSumFunction(
            sales?.lostCurrentYearAccounting,
            sales?.lostCurrentYearBookkeeping
          )
        )
      )
    ),
  }));

  const profitabilityByTeam = profitabilityEntity?.map((profitability) => ({
    name: profitability?.teamName,
    cogs: Number(
      percentageCalculatorFunction(
        addAnyNumberOfValues(
          profitability?.wages,
          profitability?.directExpenses,
          profitability?.otherDirectExpenses
        ),
        profitability?.revenue
      )
    ),
    ebitda: Number(
      twoSubtractFunction(
        percentageCalculatorFunction(
          addAnyNumberOfValues(
            profitability?.wages,
            profitability?.directExpenses,
            profitability?.otherDirectExpenses
          ),
          profitability?.revenue
        ),
        profitability?.overhead
      )
    ),
    ebitdaPercentage: Number(
      percentageCalculatorFunction(
        twoSubtractFunction(
          percentageCalculatorFunction(
            addAnyNumberOfValues(
              profitability?.wages,
              profitability?.directExpenses,
              profitability?.otherDirectExpenses
            ),
            profitability?.revenue
          ),
          profitability?.overhead
        ),
        profitability?.revenue
      )
    ),
  }));

  const npsByTeam = npsEntity?.map((nps) => ({
    client: nps?.averageClientScore,
    team: nps?.averageTeamScore,
    name: nps?.teamName,
  }));

  console.log("sales ",salesEntity);

  const salesByTeam = salesEntity?.map((sales) => ({
    name: sales?.teamName,
    leadToClientPercentage: Number(
      percentageCalculatorFunction(sales?.clientCount, sales?.leadCount)
    ),
  }));

  const extraXAxisProp = [
    {
      name: "Actual YTD",
      currentActualFee: totalCurrentYtd,
    },
    {
      name: "Budget",
      currentActualFee: totalBudget,
    },
  ];

  useEffect(() => {
    reduxDispatch(
      apiCall(
        FEE_FIRM_WIDE_RESULTS.replace(":tenantId", tenantId),
        (resolve) => {
          setFee(
            resolve?.map((res: FeesEntity) => ({
              name: res?.financialYear,
              currentActualFee: res?.currentActualFee,
            }))
          );
        },
        (reject) => {}
      )
    );
  }, []);
  return (
    <Grid container gap={1}>
      <Grid container item xs={12} columnSpacing={1} rowGap={1}>
        <Grid container item xs={6}>
          <CustomChartWrapper
            heading={
              messages?.measure?.fab5?.planForm?.matrixPage?.revenue?.heading
            }
            chart={
              <GroupChart
                data={revenueByTeam}
                barConfig={[
                  {
                    name: "lastYear",
                    color: brandColour?.primary100,
                  },
                  {
                    name: "currentYear",
                    color: otherColour.pastelGreen,
                  },
                  {
                    name: "budget",
                    color: otherColour.turquoise,
                  },
                ]}
              />
            }
            legends={[
              {
                color: brandColour?.primary100,
                value:
                  messages?.measure?.fab5?.planForm?.matrixPage?.revenue
                    ?.legends?.actualYtd,
              },
              {
                color: otherColour.turquoise,
                value:
                  messages?.measure?.fab5?.planForm?.matrixPage?.revenue
                    ?.legends?.budget,
              },
              {
                color: otherColour.pastelGreen,
                value:
                  messages?.measure?.fab5?.planForm?.matrixPage?.revenue
                    ?.legends?.actualYtdThisYear,
              },
            ]}
          />
        </Grid>
        <Grid container item xs={6}>
          <CustomChartWrapper
            heading={
              messages?.measure?.fab5?.planForm?.matrixPage?.fees?.heading
            }
            chart={
              <CustomBarChart
                data={[...fee, ...extraXAxisProp]}
                height={400}
                xAxisDataKey="name"
                yAxisDataKeys={["currentActualFee"]}
                colors={[brandColour.primaryMain]}
                specialTicks={["Actual YTD", "Budget"]}
                specialTickColors={["#80D7FE", "#D0ED7E"]}
                barSize={10}
                margin={{
                  top: 20,
                  right: 20,
                  left: 20,
                  bottom: 10,
                }}
                yAxisTickMargin={35}
              />
            }
            legends={[
              {
                color: brandColour?.primary100,
                value:
                  messages?.measure?.fab5?.planForm?.matrixPage?.fees?.legends
                    ?.default,
              },
              {
                color: otherColour.turquoise,
                value:
                  messages?.measure?.fab5?.planForm?.matrixPage?.fees?.legends
                    ?.actualYtd,
              },
              {
                color: otherColour.pastelGreen,
                value:
                  messages?.measure?.fab5?.planForm?.matrixPage?.fees?.legends
                    ?.budget,
              },
            ]}
          />
        </Grid>
      </Grid>
      <Grid container item xs={12} columnSpacing={1} rowGap={1}>
        <Grid container item xs={6}>
          <CustomChartWrapper
            heading={
              messages?.measure?.fab5?.planForm?.matrixPage?.profitability
                ?.heading
            }
            chart={
              <GroupChart
                data={profitabilityByTeam}
                barConfig={[
                  {
                    name: "cogs",
                    color: brandColour?.primary100,
                  },
                  {
                    name: "ebitda",
                    color: otherColour.pastelGreen,
                  },
                  {
                    name: "ebitdaPercentage",
                    color: otherColour.turquoise,
                  },
                ]}
              />
            }
            legends={[
              {
                color: brandColour?.primary100,
                value:
                  messages?.measure?.fab5?.planForm?.matrixPage?.profitability
                    ?.legends?.cogs,
              },
              {
                color: otherColour.turquoise,
                value:
                  messages?.measure?.fab5?.planForm?.matrixPage?.profitability
                    ?.legends?.ebitda,
              },
              {
                color: otherColour.pastelGreen,
                value:
                  messages?.measure?.fab5?.planForm?.matrixPage?.profitability
                    ?.legends?.ebitdaPercentage,
              },
            ]}
          />
        </Grid>
        <Grid container item xs={6}>
          <CustomChartWrapper
            heading={
              messages?.measure?.fab5?.planForm?.matrixPage?.feesWonAndLost
                ?.heading
            }
            chart={
              <GroupChart
                data={feeWonLostByTeam}
                barConfig={[
                  {
                    name: "feeWon",
                    color: brandColour?.primary100,
                  },
                  {
                    name: "feeLost",
                    color: otherColour.turquoise,
                  },
                  {
                    name: "net",
                    color: otherColour.pastelGreen,
                  },
                ]}
              />
            }
            legends={[
              {
                color: brandColour?.primary100,
                value:
                  messages?.measure?.fab5?.planForm?.matrixPage?.feesWonAndLost
                    ?.legends?.won,
              },
              {
                color: otherColour.turquoise,
                value:
                  messages?.measure?.fab5?.planForm?.matrixPage?.feesWonAndLost
                    ?.legends?.lost,
              },
              {
                color: otherColour.pastelGreen,
                value:
                  messages?.measure?.fab5?.planForm?.matrixPage?.feesWonAndLost
                    ?.legends?.fees,
              },
            ]}
          />
        </Grid>
      </Grid>
      <Grid container item xs={12} columnSpacing={1} rowGap={1}>
        <Grid container item xs={6}>
          <CustomChartWrapper
            heading={
              messages?.measure?.fab5?.planForm?.matrixPage?.leadsToClient
                ?.heading
            }
            chart={
              <CustomBarChart
                data={salesByTeam}
                height={400}
                xAxisDataKey="name"
                yAxisDataKeys={["leadToClientPercentage"]}
                colors={[brandColour.primaryMain]}
                barSize={20}
                margin={{
                  top: 20,
                  right: 50,
                  left: 30,
                  bottom: 11,
                }}
                yAxisTickMargin={55}
              />
            }
            legends={[
              {
                color: otherColour.turquoise,
                value:
                  messages?.measure?.fab5?.planForm?.matrixPage?.leadsToClient
                    ?.legends?.converted,
              },
            ]}
          />
        </Grid>
        <Grid container item xs={6}>
          <CustomChartWrapper
            heading={
              messages?.measure?.fab5?.planForm?.matrixPage?.npsClient?.heading
            }
            chart={
              <GroupChart
                data={npsByTeam}
                barConfig={[
                  {
                    name: "client",
                    color: brandColour?.primary100,
                  },
                  {
                    name: "team",
                    color: otherColour.turquoise,
                  },
                ]}
              />
            }
            legends={[
              {
                color: otherColour.turquoise,
                value:
                  messages?.measure?.fab5?.planForm?.matrixPage?.npsClient
                    ?.legends?.client,
              },
              {
                color: otherColour.pastelGreen,
                value:
                  messages?.measure?.fab5?.planForm?.matrixPage?.npsClient
                    ?.legends?.team,
              },
            ]}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Matrix;
