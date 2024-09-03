import { DetailPageWrapper } from "@wizehub/components";
import React, { useEffect } from "react";
import messages from "../../../messages";
import { Divider, Grid, Tooltip } from "@mui/material";
import {
  StyledAddTeamFormTypography,
  StyledAddTeamSubTextBoldTypography,
  StyledEntitySubTextTypography,
  StyledEntityTypography,
  StyledInfoIcon,
  StyledPlaceholderDiv,
  StyledPlanTextTypography,
} from "./styles";
import { Id } from "@wizehub/common/models";
import { useEntity } from "@wizehub/common/hooks";
import { BUDGET_TEAMS } from "../../../api";
import { FeeBudgetEntity } from "@wizehub/common/models/genericEntities";
import { formatCurrency, nullablePlaceHolder } from "@wizehub/common/utils";
import {
  percentageCalculatorFunction,
  twoSumFunction,
} from "./budgetAndCapacityFormula";
import {
  StyledNoDataInfo,
  StyledNoDataInfoContainer,
  StyledResponsiveIcon,
} from "@wizehub/components/table/styles";

interface Props {
  activeTeam: Id;
  currentYear: number;
}

export const StyledResponsiveInfoIcon = StyledResponsiveIcon(StyledInfoIcon);

const FeeBudget: React.FC<Props> = ({ activeTeam, currentYear }) => {
  const { entity: feeBudgetEntity, refreshEntity } = useEntity<FeeBudgetEntity>(
    BUDGET_TEAMS,
    activeTeam
  );
  useEffect(() => {
    if (activeTeam) {
      refreshEntity();
    }
  }, [activeTeam]);
  return (
    <Grid item xs={12} mb={2}>
      {feeBudgetEntity ? (
        <DetailPageWrapper
          hasNoHeader={false}
          cardContent={[
            {
              value: (
                <Grid container columnSpacing={2} rowGap={2}>
                  <Grid item xs={3.2}>
                    <StyledAddTeamFormTypography>
                      {messages?.plan?.budgetAndCapacity?.feeBudgetTab?.team}
                    </StyledAddTeamFormTypography>
                  </Grid>
                  <Grid item xs={3}>
                    <StyledAddTeamSubTextBoldTypography>
                      {
                        messages?.plan?.budgetAndCapacity?.feeBudgetTab
                          ?.teamSeniorClientManager
                      }
                    </StyledAddTeamSubTextBoldTypography>
                    <StyledEntityTypography>
                      {feeBudgetEntity?.scm?.name
                        ? feeBudgetEntity?.scm?.name
                        : "-"}
                    </StyledEntityTypography>
                  </Grid>
                  <Grid
                    container
                    item
                    xs={2.6}
                    display="flex"
                    flexDirection="column"
                  >
                    <Grid
                      item
                      display="flex"
                      flexDirection="row"
                      gap="8px"
                      alignItems="center"
                    >
                      <StyledAddTeamSubTextBoldTypography>
                        {messages?.plan?.budgetAndCapacity?.feeBudgetTab?.cpi}
                      </StyledAddTeamSubTextBoldTypography>
                      <Tooltip
                        title={
                          <>
                            <StyledPlanTextTypography>
                              {
                                messages?.plan?.budgetAndCapacity?.feeBudgetTab
                                  ?.inflation
                              }
                            </StyledPlanTextTypography>
                            <StyledEntitySubTextTypography>
                              {
                                messages?.plan?.budgetAndCapacity?.feeBudgetTab
                                  ?.cpiNote
                              }
                            </StyledEntitySubTextTypography>
                          </>
                        }
                        arrow
                        placement="right"
                      >
                        <StyledResponsiveInfoIcon />
                      </Tooltip>
                    </Grid>
                    <Grid item>
                      <StyledEntityTypography>
                        {`${nullablePlaceHolder(feeBudgetEntity?.cpi)}%`}
                      </StyledEntityTypography>
                    </Grid>
                  </Grid>
                </Grid>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <Grid item xs={12}>
                  <Divider sx={{ width: "100%", marginTop: "16px" }} />
                </Grid>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <Grid container columnSpacing={2} rowGap={2}>
                  <Grid item xs={3.2}>
                    <StyledAddTeamFormTypography>
                      {`${
                        messages?.plan?.budgetAndCapacity?.feeBudgetTab
                          ?.feesBilledInPreviousFinancialYear
                      } ${currentYear - 1}`}
                    </StyledAddTeamFormTypography>
                  </Grid>
                  <Grid item xs={3}>
                    <StyledAddTeamSubTextBoldTypography>
                      {
                        messages?.plan?.budgetAndCapacity?.feeBudgetTab
                          ?.taxAccountingDivision
                      }
                    </StyledAddTeamSubTextBoldTypography>
                    <StyledEntityTypography>
                      {formatCurrency(
                        feeBudgetEntity?.divisionsBudgets[0]?.previous_year_fee,
                        false
                      )}
                    </StyledEntityTypography>
                  </Grid>
                  <Grid item xs={2.6}>
                    <StyledAddTeamSubTextBoldTypography>
                      {
                        messages?.plan?.budgetAndCapacity?.feeBudgetTab
                          ?.bookkeepingDivision
                      }
                    </StyledAddTeamSubTextBoldTypography>
                    <StyledEntityTypography>
                      {formatCurrency(
                        feeBudgetEntity?.divisionsBudgets[1]?.previous_year_fee,
                        false
                      )}
                    </StyledEntityTypography>
                  </Grid>
                  <Grid item xs={2}>
                    <StyledAddTeamSubTextBoldTypography>
                      {messages?.plan?.budgetAndCapacity?.feeBudgetTab?.total}
                    </StyledAddTeamSubTextBoldTypography>
                    <StyledEntityTypography>
                      {formatCurrency(
                        twoSumFunction(
                          feeBudgetEntity?.divisionsBudgets[0]
                            ?.previous_year_fee,
                          feeBudgetEntity?.divisionsBudgets[1]
                            ?.previous_year_fee
                        ),
                        false
                      )}
                    </StyledEntityTypography>
                  </Grid>
                </Grid>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <Grid item xs={12}>
                  <Divider sx={{ width: "100%", marginTop: "16px" }} />
                </Grid>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <Grid container columnSpacing={2} rowGap={2}>
                  <Grid item xs={3.2}>
                    <StyledAddTeamFormTypography>
                      {messages?.plan?.budgetAndCapacity?.feeBudgetTab?.feesLost
                        ?.replace(":firstYear", currentYear - 1)
                        .replace(":secondYear", currentYear)}
                    </StyledAddTeamFormTypography>
                  </Grid>
                  <Grid item xs={3}>
                    <StyledAddTeamSubTextBoldTypography>
                      {
                        messages?.plan?.budgetAndCapacity?.feeBudgetTab
                          ?.taxAccountingDivision
                      }
                    </StyledAddTeamSubTextBoldTypography>
                    <StyledEntityTypography>
                      {formatCurrency(
                        feeBudgetEntity?.divisionsBudgets[0]?.uninvoicedFeeLost,
                        false
                      )}
                    </StyledEntityTypography>
                  </Grid>
                  <Grid item xs={2.6}>
                    <StyledAddTeamSubTextBoldTypography>
                      {
                        messages?.plan?.budgetAndCapacity?.feeBudgetTab
                          ?.bookkeepingDivision
                      }
                    </StyledAddTeamSubTextBoldTypography>
                    <StyledEntityTypography>
                      {formatCurrency(
                        feeBudgetEntity?.divisionsBudgets[1]?.uninvoicedFeeLost,
                        false
                      )}
                    </StyledEntityTypography>
                  </Grid>
                  <Grid item xs={2}>
                    <StyledAddTeamSubTextBoldTypography>
                      {messages?.plan?.budgetAndCapacity?.feeBudgetTab?.total}
                    </StyledAddTeamSubTextBoldTypography>
                    <StyledEntityTypography>
                      {formatCurrency(
                        twoSumFunction(
                          feeBudgetEntity?.divisionsBudgets[0]
                            ?.uninvoicedFeeLost,
                          feeBudgetEntity?.divisionsBudgets[1]
                            ?.uninvoicedFeeLost
                        ),
                        false
                      )}
                    </StyledEntityTypography>
                  </Grid>
                </Grid>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <Grid item xs={12}>
                  <Divider sx={{ width: "100%", marginTop: "16px" }} />
                </Grid>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <Grid container columnSpacing={2} rowGap={2}>
                  <Grid item xs={3.2}>
                    <StyledAddTeamFormTypography>
                      {
                        messages?.plan?.budgetAndCapacity?.feeBudgetTab
                          ?.subTotal
                      }
                    </StyledAddTeamFormTypography>
                  </Grid>
                  <Grid item xs={3}>
                    <StyledAddTeamSubTextBoldTypography>
                      {
                        messages?.plan?.budgetAndCapacity?.feeBudgetTab
                          ?.subTotalTaxAccountingDivision
                      }
                    </StyledAddTeamSubTextBoldTypography>
                    <StyledEntityTypography>
                      {formatCurrency(
                        feeBudgetEntity?.divisionsBudgets[0]?.subtotalTax,
                        false
                      )}
                    </StyledEntityTypography>
                  </Grid>
                  <Grid item xs={2.6}>
                    <StyledAddTeamSubTextBoldTypography>
                      {
                        messages?.plan?.budgetAndCapacity?.feeBudgetTab
                          ?.subTotalbookkeepingDivision
                      }
                    </StyledAddTeamSubTextBoldTypography>
                    <StyledEntityTypography>
                      {formatCurrency(
                        feeBudgetEntity?.divisionsBudgets[1]?.subtotalTax,
                        false
                      )}
                    </StyledEntityTypography>
                  </Grid>
                  <Grid item xs={2}>
                    <StyledAddTeamSubTextBoldTypography>
                      {messages?.plan?.budgetAndCapacity?.feeBudgetTab?.total}
                    </StyledAddTeamSubTextBoldTypography>
                    <StyledEntityTypography>
                      {formatCurrency(
                        twoSumFunction(
                          feeBudgetEntity?.divisionsBudgets[0]?.subtotalTax,
                          feeBudgetEntity?.divisionsBudgets[1]?.subtotalTax
                        ),
                        false
                      )}
                    </StyledEntityTypography>
                  </Grid>
                </Grid>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <Grid item xs={12}>
                  <Divider sx={{ width: "100%", marginTop: "16px" }} />
                </Grid>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <Grid container columnSpacing={2} rowGap={2}>
                  <Grid item xs={3.2}>
                    <StyledAddTeamFormTypography>
                      {
                        messages?.plan?.budgetAndCapacity?.feeBudgetTab
                          ?.cpiFreeIncrease
                      }
                    </StyledAddTeamFormTypography>
                  </Grid>
                  <Grid item xs={3}>
                    <StyledAddTeamSubTextBoldTypography>
                      {
                        messages?.plan?.budgetAndCapacity?.feeBudgetTab
                          ?.cpiFreeIncreaseTaxDivision
                      }
                    </StyledAddTeamSubTextBoldTypography>
                    <StyledEntityTypography>
                      {formatCurrency(
                        feeBudgetEntity?.divisionsBudgets[0]?.feeIncreasedByCpi,
                        false
                      )}
                    </StyledEntityTypography>
                  </Grid>
                  <Grid item xs={2.6}>
                    <StyledAddTeamSubTextBoldTypography>
                      {
                        messages?.plan?.budgetAndCapacity?.feeBudgetTab
                          ?.cpiBookkeepingDivision
                      }
                    </StyledAddTeamSubTextBoldTypography>
                    <StyledEntityTypography>
                      {formatCurrency(
                        feeBudgetEntity?.divisionsBudgets[1]?.feeIncreasedByCpi,
                        false
                      )}
                    </StyledEntityTypography>
                  </Grid>
                  <Grid item xs={2}>
                    <StyledAddTeamSubTextBoldTypography>
                      {messages?.plan?.budgetAndCapacity?.feeBudgetTab?.total}
                    </StyledAddTeamSubTextBoldTypography>
                    <StyledEntityTypography>
                      {formatCurrency(
                        twoSumFunction(
                          feeBudgetEntity?.divisionsBudgets[0]
                            ?.feeIncreasedByCpi,
                          feeBudgetEntity?.divisionsBudgets[1]
                            ?.feeIncreasedByCpi
                        ),
                        false
                      )}
                    </StyledEntityTypography>
                  </Grid>
                </Grid>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <Grid item xs={12}>
                  <Divider sx={{ width: "100%", marginTop: "16px" }} />
                </Grid>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <Grid container columnSpacing={2} rowGap={2}>
                  <Grid item xs={3.2}>
                    <StyledAddTeamFormTypography>
                      {messages?.plan?.budgetAndCapacity?.feeBudgetTab?.feesWon.replace(
                        ":currentYear",
                        currentYear
                      )}
                    </StyledAddTeamFormTypography>
                  </Grid>
                  <Grid item xs={3}>
                    <StyledAddTeamSubTextBoldTypography>
                      {
                        messages?.plan?.budgetAndCapacity?.feeBudgetTab
                          ?.taxAccountingDivision
                      }
                    </StyledAddTeamSubTextBoldTypography>
                    <StyledEntityTypography>
                      {formatCurrency(
                        feeBudgetEntity?.divisionsBudgets[0]?.feeWon,
                        false
                      )}
                    </StyledEntityTypography>
                  </Grid>
                  <Grid item xs={2.6}>
                    <StyledAddTeamSubTextBoldTypography>
                      {
                        messages?.plan?.budgetAndCapacity?.feeBudgetTab
                          ?.bookkeepingDivision
                      }
                    </StyledAddTeamSubTextBoldTypography>
                    <StyledEntityTypography>
                      {formatCurrency(
                        feeBudgetEntity?.divisionsBudgets[1]?.feeWon,
                        false
                      )}
                    </StyledEntityTypography>
                  </Grid>
                  <Grid item xs={2}>
                    <StyledAddTeamSubTextBoldTypography>
                      {messages?.plan?.budgetAndCapacity?.feeBudgetTab?.total}
                    </StyledAddTeamSubTextBoldTypography>
                    <StyledEntityTypography>
                      {formatCurrency(
                        twoSumFunction(
                          feeBudgetEntity?.divisionsBudgets[0]?.feeWon,
                          feeBudgetEntity?.divisionsBudgets[1]?.feeWon
                        ),
                        false
                      )}
                    </StyledEntityTypography>
                  </Grid>
                </Grid>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <Grid item xs={12}>
                  <Divider sx={{ width: "100%", marginTop: "16px" }} />
                </Grid>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <Grid container columnSpacing={2} rowGap={2}>
                  <Grid item xs={3.2}>
                    <StyledAddTeamFormTypography>
                      {messages?.plan?.budgetAndCapacity?.feeBudgetTab?.newFeesWon.replace(
                        ":currentYear",
                        currentYear
                      )}
                    </StyledAddTeamFormTypography>
                  </Grid>
                  <Grid container item xs={3} rowGap={2}>
                    <Grid item xs={12}>
                      <StyledAddTeamSubTextBoldTypography>
                        {
                          messages?.plan?.budgetAndCapacity?.feeBudgetTab
                            ?.growthRate
                        }
                      </StyledAddTeamSubTextBoldTypography>
                      <StyledEntityTypography>
                        {formatCurrency(
                          feeBudgetEntity?.divisionsBudgets[0]
                            ?.newFeeWonGrowthRate,
                          false
                        )}
                      </StyledEntityTypography>
                    </Grid>
                    <Grid item xs={12}>
                      <StyledAddTeamSubTextBoldTypography>
                        {
                          messages?.plan?.budgetAndCapacity?.feeBudgetTab
                            ?.feesToBeWON
                        }
                      </StyledAddTeamSubTextBoldTypography>
                      <StyledEntityTypography>
                        {formatCurrency(
                          feeBudgetEntity?.divisionsBudgets[0]?.newFeeToBeWon,
                          false
                        )}
                      </StyledEntityTypography>
                    </Grid>
                    <Grid item xs={12}>
                      <StyledAddTeamSubTextBoldTypography>
                        {
                          messages?.plan?.budgetAndCapacity?.feeBudgetTab
                            ?.forecastYearGrowth
                        }
                      </StyledAddTeamSubTextBoldTypography>
                      <StyledEntityTypography>
                        {nullablePlaceHolder(
                          percentageCalculatorFunction(
                            twoSumFunction(
                              feeBudgetEntity?.divisionsBudgets[1]
                                ?.newFeeToBeWon,
                              feeBudgetEntity?.divisionsBudgets[0]
                                ?.newFeeToBeWon
                            ),
                            twoSumFunction(
                              feeBudgetEntity?.divisionsBudgets[0]?.subtotalTax,
                              feeBudgetEntity?.divisionsBudgets[1]?.subtotalTax
                            )
                          )
                        )}
                      </StyledEntityTypography>
                    </Grid>
                  </Grid>
                  <Grid container item xs={2.7} rowGap={2} height="fit-content">
                    <Grid item xs={12} height="fit-content">
                      <StyledAddTeamSubTextBoldTypography>
                        {
                          messages?.plan?.budgetAndCapacity?.feeBudgetTab
                            ?.growthRatebookkeepingDivision
                        }
                      </StyledAddTeamSubTextBoldTypography>
                      <StyledEntityTypography>
                        {formatCurrency(
                          feeBudgetEntity?.divisionsBudgets[1]
                            ?.newFeeWonGrowthRate,
                          false
                        )}
                      </StyledEntityTypography>
                    </Grid>
                    <Grid item xs={12} height="fit-content">
                      <StyledAddTeamSubTextBoldTypography>
                        {
                          messages?.plan?.budgetAndCapacity?.feeBudgetTab
                            ?.feesToBeWONBookkeepingDivision
                        }
                      </StyledAddTeamSubTextBoldTypography>
                      <StyledEntityTypography>
                        {formatCurrency(
                          feeBudgetEntity?.divisionsBudgets[1]?.newFeeToBeWon,
                          false
                        )}
                      </StyledEntityTypography>
                    </Grid>
                  </Grid>
                  <Grid container item xs={2} rowGap={2} height="fit-content">
                    <Grid item xs={12} height="fit-content">
                      <StyledAddTeamSubTextBoldTypography>
                        {
                          messages?.plan?.budgetAndCapacity?.feeBudgetTab
                            ?.forecastYear
                        }
                      </StyledAddTeamSubTextBoldTypography>
                      <StyledEntityTypography>
                        {nullablePlaceHolder(
                          feeBudgetEntity?.forecastYearGrowthKpi
                        )}
                      </StyledEntityTypography>
                    </Grid>
                    <Grid item xs={12} height="fit-content">
                      <StyledAddTeamSubTextBoldTypography>
                        {messages?.plan?.budgetAndCapacity?.feeBudgetTab?.total}
                      </StyledAddTeamSubTextBoldTypography>
                      <StyledEntityTypography>
                        {formatCurrency(
                          twoSumFunction(
                            feeBudgetEntity?.divisionsBudgets[1]?.newFeeToBeWon,
                            feeBudgetEntity?.divisionsBudgets[0]?.newFeeToBeWon
                          ),
                          false
                        )}
                      </StyledEntityTypography>
                    </Grid>
                  </Grid>
                </Grid>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <Grid item xs={12}>
                  <Divider sx={{ width: "100%", marginTop: "16px" }} />
                </Grid>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <Grid container columnSpacing={2} rowGap={2}>
                  <Grid item xs={3.2}>
                    <StyledAddTeamFormTypography>
                      {
                        messages?.plan?.budgetAndCapacity?.feeBudgetTab
                          ?.overheadAllocation
                      }
                    </StyledAddTeamFormTypography>
                  </Grid>
                  <Grid item xs={3}>
                    <StyledAddTeamSubTextBoldTypography>
                      {
                        messages?.plan?.budgetAndCapacity?.feeBudgetTab
                          ?.administrationSalaries
                      }
                    </StyledAddTeamSubTextBoldTypography>
                    <StyledEntityTypography>
                      {formatCurrency(
                        feeBudgetEntity?.administrationSalaries,
                        false
                      )}
                    </StyledEntityTypography>
                  </Grid>
                  <Grid item xs={2.6}>
                    <StyledAddTeamSubTextBoldTypography>
                      {
                        messages?.plan?.budgetAndCapacity?.feeBudgetTab
                          ?.businessOverhead
                      }
                    </StyledAddTeamSubTextBoldTypography>
                    <StyledEntityTypography>
                      {formatCurrency(feeBudgetEntity?.businessOverhead, false)}
                    </StyledEntityTypography>
                  </Grid>
                  <Grid item xs={2.6}>
                    <StyledAddTeamSubTextBoldTypography>
                      {messages?.plan?.budgetAndCapacity?.feeBudgetTab?.total}
                    </StyledAddTeamSubTextBoldTypography>
                    <StyledEntityTypography>
                      {`${formatCurrency(
                        twoSumFunction(
                          feeBudgetEntity?.administrationSalaries,
                          feeBudgetEntity?.businessOverhead
                        ),
                        false
                      )} (${percentageCalculatorFunction(
                        twoSumFunction(
                          feeBudgetEntity?.administrationSalaries,
                          feeBudgetEntity?.businessOverhead
                        ),
                        twoSumFunction(
                          feeBudgetEntity?.finalAccountingBudget,
                          feeBudgetEntity?.finalBookkeepingBudget
                        )
                      )})%`}
                    </StyledEntityTypography>
                  </Grid>
                </Grid>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <Grid item xs={12}>
                  <Divider sx={{ width: "100%", marginTop: "16px" }} />
                </Grid>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <Grid container columnSpacing={2} rowGap={2}>
                  <Grid item xs={3.2}>
                    <StyledAddTeamFormTypography>
                      {messages?.plan?.budgetAndCapacity?.feeBudgetTab?.financialBudget.replace(
                        ":currentYear",
                        currentYear
                      )}
                    </StyledAddTeamFormTypography>
                  </Grid>
                  <Grid container item xs={3} rowGap={2}>
                    <Grid item xs={12}>
                      <StyledAddTeamSubTextBoldTypography>
                        {
                          messages?.plan?.budgetAndCapacity?.feeBudgetTab
                            ?.taxAccountingDivisions
                        }
                      </StyledAddTeamSubTextBoldTypography>
                      <StyledEntityTypography>
                        {formatCurrency(
                          feeBudgetEntity?.finalAccountingBudget,
                          false
                        )}
                      </StyledEntityTypography>
                    </Grid>
                    <Grid item xs={12}>
                      <StyledAddTeamSubTextBoldTypography>
                        {
                          messages?.plan?.budgetAndCapacity?.feeBudgetTab
                            ?.teamWages
                        }
                      </StyledAddTeamSubTextBoldTypography>
                      <StyledEntityTypography>
                        {" "}
                        {`${formatCurrency(
                          twoSumFunction(
                            feeBudgetEntity?.teamAccountingWages,
                            feeBudgetEntity?.teamBookkeepingWages
                          ),
                          false
                        )} (${nullablePlaceHolder(
                          percentageCalculatorFunction(
                            twoSumFunction(
                              feeBudgetEntity?.teamAccountingWages,
                              feeBudgetEntity?.teamBookkeepingWages
                            ),
                            twoSumFunction(
                              feeBudgetEntity?.finalAccountingBudget,
                              feeBudgetEntity?.finalBookkeepingBudget
                            )
                          )
                        )}%)`}
                      </StyledEntityTypography>
                    </Grid>
                    <Grid item xs={12}>
                      <StyledAddTeamSubTextBoldTypography>
                        {
                          messages?.plan?.budgetAndCapacity?.feeBudgetTab
                            ?.teamGrossProfit
                        }
                      </StyledAddTeamSubTextBoldTypography>
                      <StyledEntityTypography>
                        {`${formatCurrency(
                          feeBudgetEntity?.scmGrossProfit,
                          false
                        )} (${nullablePlaceHolder(
                          percentageCalculatorFunction(
                            feeBudgetEntity?.scmGrossProfit,
                            twoSumFunction(
                              feeBudgetEntity?.finalAccountingBudget,
                              feeBudgetEntity?.finalBookkeepingBudget
                            )
                          )
                        )}%)`}
                      </StyledEntityTypography>
                    </Grid>
                    <Grid item xs={12}>
                      <StyledAddTeamSubTextBoldTypography>
                        {
                          messages?.plan?.budgetAndCapacity?.feeBudgetTab
                            ?.forecastebidta
                        }
                      </StyledAddTeamSubTextBoldTypography>
                      <StyledEntityTypography>
                        {`${formatCurrency(
                          feeBudgetEntity?.forecastEbita,
                          false
                        )} (${nullablePlaceHolder(
                          percentageCalculatorFunction(
                            feeBudgetEntity?.forecastEbita,
                            twoSumFunction(
                              feeBudgetEntity?.finalAccountingBudget,
                              feeBudgetEntity?.finalBookkeepingBudget
                            )
                          )
                        )}%)`}
                      </StyledEntityTypography>
                    </Grid>
                  </Grid>
                  <Grid container item xs={2.6} rowGap={1}>
                    <Grid item xs={12}>
                      <StyledAddTeamSubTextBoldTypography>
                        {
                          messages?.plan?.budgetAndCapacity?.feeBudgetTab
                            ?.bookkeepingDivision
                        }
                      </StyledAddTeamSubTextBoldTypography>
                      <StyledEntityTypography>
                        {formatCurrency(
                          feeBudgetEntity?.finalBookkeepingBudget,
                          false
                        )}
                      </StyledEntityTypography>
                    </Grid>
                  </Grid>
                  <Grid container item xs={2}>
                    <Grid item xs={12}>
                      <StyledAddTeamSubTextBoldTypography>
                        {messages?.plan?.budgetAndCapacity?.feeBudgetTab?.total}
                      </StyledAddTeamSubTextBoldTypography>
                      <StyledEntityTypography>
                        {formatCurrency(
                          twoSumFunction(
                            feeBudgetEntity?.finalAccountingBudget,
                            feeBudgetEntity?.finalBookkeepingBudget
                          ),
                          false
                        )}
                      </StyledEntityTypography>
                    </Grid>
                  </Grid>
                </Grid>
              ),
              gridWidth: 12,
            },
          ]}
          detailedGridGap={1}
        />
      ) : (
        <StyledNoDataInfoContainer>
          <StyledNoDataInfo>
            {messages?.plan?.budgetAndCapacity?.nofeeBudget}
          </StyledNoDataInfo>
        </StyledNoDataInfoContainer>
      )}
    </Grid>
  );
};

export default FeeBudget;
