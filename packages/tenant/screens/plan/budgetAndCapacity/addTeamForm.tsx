import React, { useEffect } from "react";
import { Container } from "../../../components";
import {
  Button,
  DetailPageWrapper,
  Form,
  MaterialAutocompleteInput,
  MaterialDateInput,
  MaterialTextInput,
  Toast,
} from "@wizehub/components";
import messages from "../../../messages";
import { useLocation, useParams } from "react-router-dom";
import { Id, TeamStructureEnum } from "@wizehub/common/models";
import {
  useEntity,
  useFormReducer,
  useOptions,
  usePagination,
} from "@wizehub/common/hooks";
import { Divider, Grid, Tooltip } from "@mui/material";
import {
  StyledAddTeamFormTypography,
  StyledAddTeamSubTextBoldTypography,
  StyledAddTeamSubTextTypography,
  StyledBracketValueTypography,
  StyledEntitySubTextTypography,
  StyledPlanTextTypography,
  StyledTextAndTooltipContainer,
  StyledValueContainer,
  StyledValueTypography,
} from "./styles";
import { goBack, push } from "connected-react-router";
import { useDispatch } from "react-redux";
import {
  formatCurrency,
  HttpMethods,
  mapIdNameToOptionWithoutCaptializing,
  maxMinNumberValidator,
  nullablePlaceHolder,
  numberValidator,
  required,
} from "@wizehub/common/utils";
import {
  BudgetTeamEntity,
  Division,
  DivisionTeamEntity,
  FeeBudgetEntity,
} from "@wizehub/common/models/genericEntities";
import {
  BUDGET_TEAM_LISTING_API,
  BUDGET_TEAMS,
  DIVISION_LISTING_API,
  DIVISION_TEAM_LISTING_API,
} from "../../../api";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import {
  cummulativeTotalFunction,
  calculatePercentageOf,
  percentageCalculatorFunction,
  twoSubtractFunction,
  twoSumFunction,
} from "./budgetAndCapacityFormula";
import { apiCall } from "@wizehub/common/redux/actions";
import { toast } from "react-toastify";
import { routes } from "../../../utils";
import {
  getDefaultBudgetTeamFilter,
  paginatedBudgetTeam,
} from "./budgetAndCapacity";
import { MAX_NUMBER } from "../../../utils/constant";
import { StyledResponsiveInfoIcon } from "./feeBudget";

interface FormData {
  team: {
    id: Id;
    label: string;
  };
  cpi: number;
  feeFromPreviousYearTaxAndAccountingFees: number;
  feeFromPreviousYearBookkeepingFees: number;
  feeLostTaxAndAccountingFees: number;
  feeLostBookkeepingFees: number;
  feeWonTaxAndAccountingFees: number;
  feeWonBookkeepingAndBas: number;
  growthRateTaxAndAccounting: number;
  growthRateBookkeeping: number;
  growthRateKPI: number;
  administrationSalaries: number;
  businessOverhead: number;
}

const validators = {
  team: [
    required(
      messages?.plan?.budgetAndCapacity?.addTeam?.validators?.selectTeam
    ),
  ],
  cpi: [
    required(messages?.plan?.budgetAndCapacity?.addTeam?.validators?.cpi),
    numberValidator(
      messages?.plan?.budgetAndCapacity?.addTeam?.validators?.cpiNumber
    ),
    maxMinNumberValidator(
      MAX_NUMBER,
      -MAX_NUMBER,
      messages?.plan?.budgetAndCapacity?.addTeam?.validators?.maxNumber
    ),
  ],
  feeFromPreviousYearTaxAndAccountingFees: [
    required(
      messages?.plan?.budgetAndCapacity?.addTeam?.validators?.taxAndAccounting
    ),
    numberValidator(
      messages?.plan?.budgetAndCapacity?.addTeam?.validators
        ?.taxAndAccountingNumber
    ),
    maxMinNumberValidator(
      MAX_NUMBER,
      -MAX_NUMBER,
      messages?.plan?.budgetAndCapacity?.addTeam?.validators?.maxNumber
    ),
  ],
  feeFromPreviousYearBookkeepingFees: [
    required(
      messages?.plan?.budgetAndCapacity?.addTeam?.validators?.bookkeepingFees
    ),
    numberValidator(
      messages?.plan?.budgetAndCapacity?.addTeam?.validators
        ?.bookkeepingFeesNumber
    ),
    maxMinNumberValidator(
      MAX_NUMBER,
      -MAX_NUMBER,
      messages?.plan?.budgetAndCapacity?.addTeam?.validators?.maxNumber
    ),
  ],
  feeLostTaxAndAccountingFees: [
    required(
      messages?.plan?.budgetAndCapacity?.addTeam?.validators?.taxAndAccounting
    ),
    numberValidator(
      messages?.plan?.budgetAndCapacity?.addTeam?.validators
        ?.taxAndAccountingNumber
    ),
    maxMinNumberValidator(
      MAX_NUMBER,
      -MAX_NUMBER,
      messages?.plan?.budgetAndCapacity?.addTeam?.validators?.maxNumber
    ),
  ],
  feeLostBookkeepingFees: [
    required(
      messages?.plan?.budgetAndCapacity?.addTeam?.validators?.bookkeepingFees
    ),
    numberValidator(
      messages?.plan?.budgetAndCapacity?.addTeam?.validators
        ?.bookkeepingFeesNumber
    ),
    maxMinNumberValidator(
      MAX_NUMBER,
      -MAX_NUMBER,
      messages?.plan?.budgetAndCapacity?.addTeam?.validators?.maxNumber
    ),
  ],
  feeWonTaxAndAccountingFees: [
    required(
      messages?.plan?.budgetAndCapacity?.addTeam?.validators?.taxAndAccounting
    ),
    numberValidator(
      messages?.plan?.budgetAndCapacity?.addTeam?.validators
        ?.taxAndAccountingNumber
    ),
    maxMinNumberValidator(
      MAX_NUMBER,
      -MAX_NUMBER,
      messages?.plan?.budgetAndCapacity?.addTeam?.validators?.maxNumber
    ),
  ],
  feeWonBookkeepingAndBas: [
    required(
      messages?.plan?.budgetAndCapacity?.addTeam?.validators
        ?.bookkeepingAndBASFees
    ),
    numberValidator(
      messages?.plan?.budgetAndCapacity?.addTeam?.validators
        ?.bookkeepingAndBASFeesNumber
    ),
    maxMinNumberValidator(
      MAX_NUMBER,
      -MAX_NUMBER,
      messages?.plan?.budgetAndCapacity?.addTeam?.validators?.maxNumber
    ),
  ],
  growthRateTaxAndAccounting: [
    required(
      messages?.plan?.budgetAndCapacity?.addTeam?.validators
        ?.growthRateTaxAndAccouting
    ),
    numberValidator(
      messages?.plan?.budgetAndCapacity?.addTeam?.validators
        ?.growthRateTaxAndAccoutingNumber
    ),
    maxMinNumberValidator(
      MAX_NUMBER,
      -MAX_NUMBER,
      messages?.plan?.budgetAndCapacity?.addTeam?.validators?.maxNumber
    ),
  ],
  growthRateBookkeeping: [
    required(
      messages?.plan?.budgetAndCapacity?.addTeam?.validators
        ?.growthRateBookkeeping
    ),
    numberValidator(
      messages?.plan?.budgetAndCapacity?.addTeam?.validators
        ?.growthRateBookkeepingNumber
    ),
    maxMinNumberValidator(
      MAX_NUMBER,
      -MAX_NUMBER,
      messages?.plan?.budgetAndCapacity?.addTeam?.validators?.maxNumber
    ),
  ],
  growthRateKPI: [
    required(
      messages?.plan?.budgetAndCapacity?.addTeam?.validators
        ?.forecastYearGrowthKPI
    ),
    numberValidator(
      messages?.plan?.budgetAndCapacity?.addTeam?.validators
        ?.forecastYearGrowthKPINumber
    ),
    maxMinNumberValidator(
      MAX_NUMBER,
      -MAX_NUMBER,
      messages?.plan?.budgetAndCapacity?.addTeam?.validators?.maxNumber
    ),
  ],
  businessOverhead: [
    required(
      messages?.plan?.budgetAndCapacity?.addTeam?.validators?.businessOverhead
    ),
    numberValidator(
      messages?.plan?.budgetAndCapacity?.addTeam?.validators
        ?.businessOverheadNumber
    ),
    maxMinNumberValidator(
      MAX_NUMBER,
      -MAX_NUMBER,
      messages?.plan?.budgetAndCapacity?.addTeam?.validators?.maxNumber
    ),
  ],
  administrationSalaries: [
    required(
      messages?.plan?.budgetAndCapacity?.addTeam?.validators
        ?.administrationSalaries
    ),
    numberValidator(
      messages?.plan?.budgetAndCapacity?.addTeam?.validators
        ?.administrationSalariesNumber
    ),
    maxMinNumberValidator(
      MAX_NUMBER,
      -MAX_NUMBER,
      messages?.plan?.budgetAndCapacity?.addTeam?.validators?.maxNumber
    ),
  ],
};

const AddTeamForm = () => {
  const { budgetId, currentYear, activeTeamId } = useParams<{
    currentYear: string;
    budgetId: string;
    activeTeamId?: string;
  }>();
  const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
  const currentFinancialYear = currentYear;
  const reduxDispatch = useDispatch();
  const { submitting, handleSubmit, connectField, change, formValues } =
    useFormReducer(validators);

  const { options: divisionOptions } =
    useOptions<Division>(DIVISION_LISTING_API);

  const { entity: budgetTeam, applyFilters } = usePagination<BudgetTeamEntity>(
    {
      ...paginatedBudgetTeam,
      api: BUDGET_TEAM_LISTING_API.replace(":tenantId", tenantId).replace(
        ":budgetId",
        budgetId
      ),
    },
    getDefaultBudgetTeamFilter()
  );

  useEffect(() => {
    if (budgetId) {
      applyFilters();
    }
  }, [budgetId]);

  const teamId = budgetTeam?.records?.filter(
    (team) => team?.id?.toString() === activeTeamId
  )[0]?.team?.id;

  const productionDivisionId = divisionOptions?.filter(
    (division) => division?.name === TeamStructureEnum.PRODUCTION
  )[0]?.id;

  const { entity: teamBudgetEntity } = useEntity<FeeBudgetEntity>(
    BUDGET_TEAMS,
    activeTeamId
  );

  const {
    options: teamOptions,
    searchOptions: searchTeamOptions,
    refreshOptions,
  } = useOptions<DivisionTeamEntity>(
    DIVISION_TEAM_LISTING_API.replace(":tenantId", tenantId).replace(
      ":divisionId",
      productionDivisionId?.toString()
    ),
    true
  );

  useEffect(() => {
    if (productionDivisionId) {
      refreshOptions();
    }
  }, [productionDivisionId]);

  const actualFeeFromPreviousYearTotal = twoSumFunction(
    formValues?.feeFromPreviousYearTaxAndAccountingFees?.value,
    formValues?.feeFromPreviousYearBookkeepingFees?.value
  );

  const feeLostNotInvoiced = twoSumFunction(
    formValues?.feeLostTaxAndAccountingFees?.value,
    formValues?.feeLostBookkeepingFees?.value
  );

  const subTotalForTaxAndAccounting = twoSubtractFunction(
    formValues?.feeFromPreviousYearTaxAndAccountingFees?.value,
    formValues?.feeLostTaxAndAccountingFees?.value
  );

  const subTotalForBookkeeping = twoSubtractFunction(
    formValues?.feeFromPreviousYearBookkeepingFees?.value,
    formValues?.feeLostBookkeepingFees?.value
  );

  const subTotalForTaxAndAccountingAndBookkeeping = twoSumFunction(
    subTotalForTaxAndAccounting,
    subTotalForBookkeeping
  );

  const cpiIncreaseTaxAndAccounting = calculatePercentageOf(
    subTotalForTaxAndAccounting,
    formValues?.cpi?.value
  );

  const cpiIncreaseBookkeeping = calculatePercentageOf(
    subTotalForBookkeeping,
    formValues?.cpi?.value
  );

  const cpiIncreaseTotal = twoSumFunction(
    cpiIncreaseTaxAndAccounting,
    cpiIncreaseBookkeeping
  );

  const feeWonInvoiced = twoSumFunction(
    formValues?.feeWonTaxAndAccountingFees?.value,
    formValues?.feeWonBookkeepingAndBas?.value
  );

  const newFeeToBeWonTaxAndAccounting = calculatePercentageOf(
    subTotalForTaxAndAccounting,
    formValues?.growthRateTaxAndAccounting?.value
  );

  const newFeeToBeWonBookkeeping = calculatePercentageOf(
    subTotalForBookkeeping,
    formValues?.growthRateBookkeeping?.value
  );

  const newFeeToBeWonTotal = twoSumFunction(
    newFeeToBeWonTaxAndAccounting,
    newFeeToBeWonBookkeeping
  );

  const forecastYearGrowthPercentage = percentageCalculatorFunction(
    newFeeToBeWonTotal,
    subTotalForTaxAndAccountingAndBookkeeping
  );

  const overheadAllocationTotal = twoSumFunction(
    formValues?.businessOverhead?.value,
    formValues?.administrationSalaries?.value
  );

  const cummulativeTaxAndAccountingTotal = cummulativeTotalFunction(
    subTotalForTaxAndAccounting,
    cpiIncreaseTaxAndAccounting,
    formValues?.feeWonTaxAndAccountingFees?.value,
    newFeeToBeWonTaxAndAccounting
  );

  const cummulativeBookkeepingTotal = cummulativeTotalFunction(
    subTotalForBookkeeping,
    cpiIncreaseBookkeeping,
    formValues?.feeWonBookkeepingAndBas?.value,
    newFeeToBeWonBookkeeping
  );

  const overheadAllocationTotalPercentage = percentageCalculatorFunction(
    overheadAllocationTotal,
    twoSumFunction(
      cummulativeTaxAndAccountingTotal,
      cummulativeBookkeepingTotal
    )
  );

  const finalisedBudgetTaxAndAccounting = cummulativeTaxAndAccountingTotal;

  const finalisedBudgetBookkeeping = cummulativeBookkeepingTotal;

  const finalisedBudgetTaxAndAccountingAndBookkeeping = twoSumFunction(
    finalisedBudgetTaxAndAccounting,
    finalisedBudgetBookkeeping
  );

  const teamWages = twoSumFunction(
    teamBudgetEntity?.teamAccountingWages,
    teamBudgetEntity?.teamBookkeepingWages
  );

  const teamWagesPercentage = percentageCalculatorFunction(
    teamWages,
    finalisedBudgetTaxAndAccountingAndBookkeeping
  );

  const scmGrossProfitTotal = twoSubtractFunction(
    finalisedBudgetTaxAndAccountingAndBookkeeping,
    teamWages
  );

  const scmGrossProfitPercentage = percentageCalculatorFunction(
    scmGrossProfitTotal,
    finalisedBudgetTaxAndAccountingAndBookkeeping
  );

  const forecastEbidta = twoSubtractFunction(
    scmGrossProfitTotal,
    overheadAllocationTotal
  );

  const forecastEbidtaPercentage = percentageCalculatorFunction(
    forecastEbidta,
    finalisedBudgetTaxAndAccountingAndBookkeeping
  );

  const onSubmit = async (data: FormData) => {
    const sanitizedBody = {
      tenantId: tenantId,
      teamId: data?.team?.id,
      cpi: data?.cpi,
      budgetId: budgetId,
      feePreviousYear: {
        taxAndAccountingFee: data?.feeFromPreviousYearTaxAndAccountingFees,
        bookKeepingFee: data?.feeFromPreviousYearBookkeepingFees,
        total: actualFeeFromPreviousYearTotal,
      },
      nonInvoicedFeeLostForecast: {
        taxAndAccountingFee: data?.feeLostTaxAndAccountingFees,
        bookKeepingFee: data?.feeLostBookkeepingFees,
        total: feeLostNotInvoiced,
      },
      subTotal: {
        taxAndAccountingFee: subTotalForTaxAndAccounting,
        bookKeepingFee: subTotalForBookkeeping,
        total: subTotalForTaxAndAccountingAndBookkeeping,
      },
      feeIncreaseWithCPI: {
        taxAndAccountingFee: cpiIncreaseTaxAndAccounting,
        bookKeepingFee: cpiIncreaseBookkeeping,
        total: cpiIncreaseTotal,
      },
      nonInvoicedFeeWonForecast: {
        taxAndAccountingFee: data?.feeWonTaxAndAccountingFees,
        bookKeepingFee: data?.feeWonBookkeepingAndBas,
        total: feeWonInvoiced,
      },
      newFeeWonForecast: {
        taxAndAccountingFee: newFeeToBeWonTaxAndAccounting,
        taxAndAccountingFeeGrowthRate: data?.growthRateTaxAndAccounting,
        bookKeepingFee: newFeeToBeWonBookkeeping,
        bookKeepingFeeGrowthRate: data?.growthRateBookkeeping,
        total: newFeeToBeWonTotal,
        growthKPI: data?.growthRateKPI,
        yearGrowthRate: forecastYearGrowthPercentage,
      },
      overheadAllocation: {
        administrationSalaries: data?.administrationSalaries,
        businessOverhead: data?.businessOverhead,
        total: overheadAllocationTotal,
        totalPercentage: overheadAllocationTotalPercentage,
      },
      finalizedBudget: {
        taxAndAccountingBudget: finalisedBudgetTaxAndAccounting,
        bookKeepingBudget: finalisedBudgetBookkeeping,
        total: finalisedBudgetTaxAndAccountingAndBookkeeping,
        scmGrossProfit: scmGrossProfitTotal,
        scmGrossProfitPercentage: scmGrossProfitPercentage,
        forecastEbita: forecastEbidta,
        forecastEbitaPercentage: forecastEbidtaPercentage,
      },
    };
    return new Promise<void>((resolve, reject) => {
      reduxDispatch(
        apiCall(
          teamId ? `${BUDGET_TEAMS}/${activeTeamId}` : BUDGET_TEAMS,
          resolve,
          reject,
          teamId ? HttpMethods.PATCH : HttpMethods.POST,
          sanitizedBody
        )
      );
    })
      .then(() => {
        toast(() => (
          <Toast
            text={
              messages?.plan?.budgetAndCapacity?.addTeam?.success?.[
                teamId ? "updated" : "created"
              ]
            }
          />
        ));
        reduxDispatch(push(routes.budgetAndCapacity.root));
      })
      .catch((error) => {
        toast(() => (
          <Toast
            text={
              messages?.plan?.budgetAndCapacity?.addTeam?.error?.serverError?.[
                error?.message
              ]
            }
            type="error"
          />
        ));
      });
  };

  useEffect(() => {
    if (teamOptions && teamBudgetEntity) {
      change("team", {
        id: teamOptions?.filter((team) => team?.id === teamId)[0]?.id,
        label: teamOptions?.filter((team) => team?.id === teamId)[0]?.name,
      });
    }
  }, [teamOptions]);

  useEffect(() => {
    if (teamBudgetEntity) {
      change("cpi", teamBudgetEntity?.cpi);
      change(
        "feeFromPreviousYearTaxAndAccountingFees",
        teamBudgetEntity?.divisionsBudgets[0]?.previous_year_fee
      );
      change(
        "feeFromPreviousYearBookkeepingFees",
        teamBudgetEntity?.divisionsBudgets[1]?.previous_year_fee
      );
      change(
        "feeLostTaxAndAccountingFees",
        teamBudgetEntity?.divisionsBudgets[0]?.uninvoicedFeeLost
      );
      change(
        "feeLostBookkeepingFees",
        teamBudgetEntity?.divisionsBudgets[1]?.uninvoicedFeeLost
      );
      change(
        "feeWonTaxAndAccountingFees",
        teamBudgetEntity?.divisionsBudgets[0]?.feeWon
      );
      change(
        "feeWonBookkeepingAndBas",
        teamBudgetEntity?.divisionsBudgets[1]?.feeWon
      );
      change(
        "growthRateTaxAndAccounting",
        teamBudgetEntity?.divisionsBudgets[0]?.newFeeWonGrowthRate
      );
      change(
        "growthRateBookkeeping",
        teamBudgetEntity?.divisionsBudgets[1]?.newFeeWonGrowthRate
      );
      change("growthRateKPI", teamBudgetEntity?.forecastYearGrowthKpi);
      change("businessOverhead", teamBudgetEntity?.businessOverhead);
      change(
        "administrationSalaries",
        teamBudgetEntity?.administrationSalaries
      );
    }
  }, [teamBudgetEntity]);

  return (
    <Container noPadding>
      <Form
        onSubmit={handleSubmit(onSubmit)}
        style={{ margin: "0px", gap: "8px" }}
      >
        <DetailPageWrapper
          heading={
            messages?.plan?.budgetAndCapacity?.addTeam?.[
              teamId ? "editTeam" : "heading"
            ]
          }
          cardContent={[
            {
              value: (
                <Grid container columnSpacing={2} rowGap={2}>
                  <Grid item xs={4}>
                    {connectField("team", {
                      label:
                        messages?.plan?.budgetAndCapacity?.addTeam?.selectTeam,
                      options: teamOptions?.map(
                        mapIdNameToOptionWithoutCaptializing
                      ),
                      searchOptions: searchTeamOptions,
                      enableClearable: true,
                      disabled: teamId,
                      required: true,
                    })(MaterialAutocompleteInput)}
                  </Grid>
                  <Grid item xs={4}>
                    {connectField("cpi", {
                      label:
                        messages?.plan?.budgetAndCapacity?.addTeam
                          ?.consumerPriceIndex,
                      type: "number",
                      required: true,
                    })(MaterialTextInput)}
                    <MaterialTextInput label={messages?.plan?.budgetAndCapacity?.addTeam
                          ?.consumerPriceIndex} type="number" />
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
                <StyledAddTeamFormTypography>
                  {`${
                    messages?.plan?.budgetAndCapacity?.addTeam
                      ?.actualFeesFromPreviousYear
                  } ${Number(currentFinancialYear) - 1}`}
                </StyledAddTeamFormTypography>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <Grid container columnSpacing={2} rowGap={2}>
                  <Grid item xs={4}>
                    {connectField("feeFromPreviousYearTaxAndAccountingFees", {
                      label:
                        messages?.plan?.budgetAndCapacity?.addTeam
                          ?.taxAndAccountingDivision,
                      type: "number",
                      required: true,
                    })(MaterialTextInput)}
                  </Grid>
                  <Grid item xs={4}>
                    {connectField("feeFromPreviousYearBookkeepingFees", {
                      label:
                        messages?.plan?.budgetAndCapacity?.addTeam
                          ?.bookkeepingDivision,
                      type: "number",
                      required: true,
                    })(MaterialTextInput)}
                  </Grid>
                </Grid>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <StyledValueContainer>
                  <StyledAddTeamSubTextTypography>
                    {messages?.plan?.budgetAndCapacity?.addTeam?.total}
                  </StyledAddTeamSubTextTypography>
                  <StyledValueTypography>
                    {formatCurrency(actualFeeFromPreviousYearTotal, false)}
                  </StyledValueTypography>
                </StyledValueContainer>
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
                <StyledTextAndTooltipContainer>
                  <StyledAddTeamFormTypography>
                    {messages?.plan?.budgetAndCapacity?.addTeam?.feelLost
                      ?.replace(
                        "previousYear",
                        Number(currentFinancialYear) - 1
                      )
                      ?.replace("nextYear", currentFinancialYear)}
                  </StyledAddTeamFormTypography>
                  <Tooltip
                    title={
                      <>
                        <StyledEntitySubTextTypography>
                          {
                            messages?.plan?.budgetAndCapacity?.addTeam
                              ?.feeLostTooltipText
                          }
                        </StyledEntitySubTextTypography>
                      </>
                    }
                    arrow
                    placement="right"
                  >
                    <StyledResponsiveInfoIcon />
                  </Tooltip>
                </StyledTextAndTooltipContainer>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <Grid container columnSpacing={2} rowGap={2}>
                  <Grid item xs={4}>
                    {connectField("feeLostTaxAndAccountingFees", {
                      label:
                        messages?.plan?.budgetAndCapacity?.addTeam
                          ?.taxAndAccountingDivision,
                      type: "number",
                      required: true,
                    })(MaterialTextInput)}
                  </Grid>
                  <Grid item xs={4}>
                    {connectField("feeLostBookkeepingFees", {
                      label:
                        messages?.plan?.budgetAndCapacity?.addTeam
                          ?.bookkeepingDivision,
                      type: "number",
                      required: true,
                    })(MaterialTextInput)}
                  </Grid>
                </Grid>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <StyledValueContainer>
                  <StyledAddTeamSubTextTypography>
                    {messages?.plan?.budgetAndCapacity?.addTeam?.total}
                  </StyledAddTeamSubTextTypography>
                  <StyledValueTypography>
                    {formatCurrency(feeLostNotInvoiced, false)}
                  </StyledValueTypography>
                </StyledValueContainer>
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
                <StyledAddTeamFormTypography>
                  {messages?.plan?.budgetAndCapacity?.addTeam?.subtotal}
                </StyledAddTeamFormTypography>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <StyledValueContainer container xs={12}>
                  <Grid item xs={3.8}>
                    <StyledAddTeamSubTextTypography>
                      {messages?.plan?.budgetAndCapacity?.addTeam?.subtotalTax}
                    </StyledAddTeamSubTextTypography>
                  </Grid>
                  <StyledValueTypography>
                    {formatCurrency(subTotalForTaxAndAccounting, false)}
                  </StyledValueTypography>
                </StyledValueContainer>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <StyledValueContainer container xs={12}>
                  <Grid item xs={3.8}>
                    <StyledAddTeamSubTextTypography>
                      {
                        messages?.plan?.budgetAndCapacity?.addTeam
                          ?.subtotalBookkeepingFees
                      }
                    </StyledAddTeamSubTextTypography>
                  </Grid>
                  <StyledValueTypography>
                    {formatCurrency(subTotalForBookkeeping, false)}
                  </StyledValueTypography>
                </StyledValueContainer>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <StyledValueContainer container xs={12}>
                  <Grid item xs={3.8}>
                    <StyledAddTeamSubTextTypography>
                      {messages?.plan?.budgetAndCapacity?.addTeam?.total}
                    </StyledAddTeamSubTextTypography>
                  </Grid>
                  <StyledValueTypography>
                    {formatCurrency(
                      subTotalForTaxAndAccountingAndBookkeeping,
                      false
                    )}
                  </StyledValueTypography>
                </StyledValueContainer>
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
                <StyledAddTeamFormTypography>
                  {messages?.plan?.budgetAndCapacity?.addTeam?.feeIncreased}
                </StyledAddTeamFormTypography>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <StyledValueContainer container xs={12}>
                  <Grid item xs={3.8}>
                    <StyledAddTeamSubTextTypography>
                      {
                        messages?.plan?.budgetAndCapacity?.addTeam
                          ?.feeIncreasedCPI
                      }
                    </StyledAddTeamSubTextTypography>
                  </Grid>
                  <StyledValueTypography>
                    {formatCurrency(cpiIncreaseTaxAndAccounting, false)}
                  </StyledValueTypography>
                </StyledValueContainer>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <StyledValueContainer container xs={12}>
                  <Grid item xs={3.8}>
                    <StyledAddTeamSubTextTypography>
                      {
                        messages?.plan?.budgetAndCapacity?.addTeam
                          ?.feeIncreasedBookkeeping
                      }
                    </StyledAddTeamSubTextTypography>
                  </Grid>
                  <StyledValueTypography>
                    {formatCurrency(cpiIncreaseBookkeeping, false)}
                  </StyledValueTypography>
                </StyledValueContainer>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <StyledValueContainer container xs={12}>
                  <Grid item xs={3.8}>
                    <StyledAddTeamSubTextTypography>
                      {messages?.plan?.budgetAndCapacity?.addTeam?.total}
                    </StyledAddTeamSubTextTypography>
                  </Grid>
                  <StyledValueTypography>
                    {formatCurrency(cpiIncreaseTotal, false)}
                  </StyledValueTypography>
                </StyledValueContainer>
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
                <StyledAddTeamFormTypography>
                  {messages?.plan?.budgetAndCapacity?.addTeam?.feesWon?.replace(
                    "currentYear",
                    currentFinancialYear
                  )}
                </StyledAddTeamFormTypography>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <Grid container columnSpacing={2} rowGap={2}>
                  <Grid item xs={4}>
                    {connectField("feeWonTaxAndAccountingFees", {
                      label:
                        messages?.plan?.budgetAndCapacity?.addTeam
                          ?.taxAndAccountingDivision,
                      type: "number",
                      required: true,
                    })(MaterialTextInput)}
                  </Grid>
                  <Grid item xs={4}>
                    {connectField("feeWonBookkeepingAndBas", {
                      label:
                        messages?.plan?.budgetAndCapacity?.addTeam
                          ?.bookkeepingDivision,
                      type: "number",
                      required: true,
                    })(MaterialTextInput)}
                  </Grid>
                </Grid>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <StyledValueContainer>
                  <StyledAddTeamSubTextTypography>
                    {messages?.plan?.budgetAndCapacity?.addTeam?.total}
                  </StyledAddTeamSubTextTypography>
                  <StyledValueTypography>
                    {formatCurrency(feeWonInvoiced, false)}
                  </StyledValueTypography>
                </StyledValueContainer>
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
                <StyledAddTeamFormTypography>
                  {messages?.plan?.budgetAndCapacity?.addTeam?.newFeesWon?.replace(
                    "currentYear",
                    currentFinancialYear
                  )}
                </StyledAddTeamFormTypography>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <Grid container columnSpacing={2} rowGap={2}>
                  <Grid item xs={4}>
                    {connectField("growthRateTaxAndAccounting", {
                      label:
                        messages?.plan?.budgetAndCapacity?.addTeam?.growthRate,
                      type: "number",
                      required: true,
                    })(MaterialTextInput)}
                  </Grid>
                  <Grid item xs={4}>
                    {connectField("growthRateBookkeeping", {
                      label:
                        messages?.plan?.budgetAndCapacity?.addTeam
                          ?.growthRateBookkeeping,
                      type: "number",
                      required: true,
                    })(MaterialTextInput)}
                  </Grid>
                  <Grid item xs={4}>
                    {connectField("growthRateKPI", {
                      label:
                        messages?.plan?.budgetAndCapacity?.addTeam
                          ?.forecastYear,
                      required: true,
                    })(MaterialTextInput)}
                  </Grid>
                </Grid>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <StyledValueContainer container xs={12}>
                  <Grid item xs={3.8}>
                    <StyledAddTeamSubTextTypography>
                      {messages?.plan?.budgetAndCapacity?.addTeam?.feesToBeWON}
                    </StyledAddTeamSubTextTypography>
                  </Grid>
                  <StyledValueTypography>
                    {formatCurrency(newFeeToBeWonTaxAndAccounting, false)}
                  </StyledValueTypography>
                </StyledValueContainer>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <StyledValueContainer container xs={12}>
                  <Grid item xs={3.8}>
                    <StyledAddTeamSubTextTypography>
                      {
                        messages?.plan?.budgetAndCapacity?.addTeam
                          ?.feesToBeWONBookkeeping
                      }
                    </StyledAddTeamSubTextTypography>
                  </Grid>
                  <StyledValueTypography>
                    {formatCurrency(newFeeToBeWonBookkeeping, false)}
                  </StyledValueTypography>
                </StyledValueContainer>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <StyledValueContainer container xs={12}>
                  <Grid item xs={3.8}>
                    <StyledAddTeamSubTextTypography>
                      {messages?.plan?.budgetAndCapacity?.addTeam?.total}
                    </StyledAddTeamSubTextTypography>
                  </Grid>
                  <StyledValueTypography>
                    {formatCurrency(newFeeToBeWonTotal, false)}
                  </StyledValueTypography>
                </StyledValueContainer>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <StyledValueContainer container xs={12}>
                  <Grid item xs={3.8}>
                    <StyledAddTeamSubTextTypography>
                      {
                        messages?.plan?.budgetAndCapacity?.addTeam
                          ?.forecastYearGrowth
                      }
                    </StyledAddTeamSubTextTypography>
                  </Grid>
                  <StyledValueTypography>
                    {nullablePlaceHolder(forecastYearGrowthPercentage)}
                  </StyledValueTypography>
                </StyledValueContainer>
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
                <StyledAddTeamFormTypography>
                  {
                    messages?.plan?.budgetAndCapacity?.addTeam
                      ?.overheadAllocation
                  }
                </StyledAddTeamFormTypography>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <Grid container columnSpacing={2} rowGap={2}>
                  <Grid item xs={4}>
                    {connectField("businessOverhead", {
                      label:
                        messages?.plan?.budgetAndCapacity?.addTeam
                          ?.businessOverhead,
                      type: "number",
                      required: true,
                    })(MaterialTextInput)}
                  </Grid>
                  <Grid item xs={4}>
                    {connectField("administrationSalaries", {
                      label:
                        messages?.plan?.budgetAndCapacity?.addTeam
                          ?.administrationSalaries,
                      type: "number",
                      required: true,
                    })(MaterialTextInput)}
                  </Grid>
                </Grid>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <StyledValueContainer>
                  <StyledAddTeamSubTextTypography>
                    {messages?.plan?.budgetAndCapacity?.addTeam?.total}
                  </StyledAddTeamSubTextTypography>
                  <StyledValueTypography>
                    {formatCurrency(overheadAllocationTotal, false)}
                  </StyledValueTypography>
                  <StyledBracketValueTypography>
                    {`(${nullablePlaceHolder(
                      overheadAllocationTotalPercentage
                    )} %)`}
                  </StyledBracketValueTypography>
                </StyledValueContainer>
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
                <StyledAddTeamFormTypography>
                  {`${messages?.plan?.budgetAndCapacity?.addTeam?.finalisedBudget} ${currentFinancialYear}`}
                </StyledAddTeamFormTypography>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <Grid container xs={12}>
                  <Grid container item columnSpacing={2} rowGap={2} xs={5}>
                    <Grid container item xs={12}>
                      <StyledValueContainer container item xs={12}>
                        <Grid item xs={9}>
                          <StyledAddTeamSubTextTypography>
                            {
                              messages?.plan?.budgetAndCapacity?.addTeam
                                ?.taxAndAccountingDivision
                            }
                          </StyledAddTeamSubTextTypography>
                        </Grid>
                        <StyledValueTypography>
                          {formatCurrency(
                            finalisedBudgetTaxAndAccounting,
                            false
                          )}
                        </StyledValueTypography>
                      </StyledValueContainer>
                    </Grid>
                    <Grid container item xs={12}>
                      <StyledValueContainer container item xs={12}>
                        <Grid item xs={9}>
                          <StyledAddTeamSubTextTypography>
                            {
                              messages?.plan?.budgetAndCapacity?.addTeam
                                ?.bookkeepingDivision
                            }
                          </StyledAddTeamSubTextTypography>
                        </Grid>
                        <StyledValueTypography>
                          {formatCurrency(finalisedBudgetBookkeeping, false)}
                        </StyledValueTypography>
                      </StyledValueContainer>
                    </Grid>
                    <Grid item xs={12}>
                      <StyledValueContainer container item xs={12}>
                        <Grid item xs={9}>
                          <StyledAddTeamSubTextTypography>
                            {messages?.plan?.budgetAndCapacity?.addTeam?.total}
                          </StyledAddTeamSubTextTypography>
                        </Grid>
                        <StyledValueTypography>
                          {formatCurrency(
                            finalisedBudgetTaxAndAccountingAndBookkeeping,
                            false
                          )}
                        </StyledValueTypography>
                      </StyledValueContainer>
                    </Grid>
                  </Grid>
                  <Grid container item xs={0.5}>
                    <Divider
                      sx={{ height: "100px" }}
                      orientation="vertical"
                      variant="middle"
                    />
                  </Grid>
                  <Grid container item columnSpacing={2} rowGap={2} xs={6}>
                    <Grid container item xs={12}>
                      <StyledValueContainer container item xs={12}>
                        <Grid item xs={5}>
                          <StyledAddTeamSubTextTypography>
                            {
                              messages?.plan?.budgetAndCapacity?.addTeam
                                ?.teamWages
                            }
                          </StyledAddTeamSubTextTypography>
                        </Grid>
                        <StyledValueTypography>
                          {formatCurrency(teamWages, false)}
                        </StyledValueTypography>
                        <StyledBracketValueTypography>
                          {`(${nullablePlaceHolder(teamWagesPercentage)} %)`}
                        </StyledBracketValueTypography>
                      </StyledValueContainer>
                    </Grid>
                    <Grid container item xs={12}>
                      <StyledValueContainer container item xs={12}>
                        <Grid item xs={5}>
                          <StyledAddTeamSubTextTypography>
                            {
                              messages?.plan?.budgetAndCapacity?.addTeam
                                ?.scmGrossProfit
                            }
                          </StyledAddTeamSubTextTypography>
                        </Grid>
                        <StyledValueTypography>
                          {formatCurrency(scmGrossProfitTotal, false)}
                        </StyledValueTypography>
                        <StyledBracketValueTypography>
                          {`(${nullablePlaceHolder(
                            scmGrossProfitPercentage
                          )} %)`}
                        </StyledBracketValueTypography>
                      </StyledValueContainer>
                    </Grid>
                    <Grid item xs={12}>
                      <StyledValueContainer container item xs={12}>
                        <Grid item xs={5}>
                          <StyledAddTeamSubTextTypography>
                            {
                              messages?.plan?.budgetAndCapacity?.addTeam
                                ?.forecast
                            }
                          </StyledAddTeamSubTextTypography>
                        </Grid>
                        <StyledValueTypography>
                          {formatCurrency(forecastEbidta, false)}
                        </StyledValueTypography>
                        <StyledBracketValueTypography>
                          {`(${nullablePlaceHolder(
                            forecastEbidtaPercentage
                          )} %)`}
                        </StyledBracketValueTypography>
                      </StyledValueContainer>
                    </Grid>
                  </Grid>
                </Grid>
              ),
              gridWidth: 12,
            },
          ]}
          hasGoBackIcon={true}
          detailedGridGap={1}
        />
        <Grid
          container
          padding="14px 24px"
          gap="15px"
          justifyContent="flex-end"
        >
          <Button
            label={messages?.plan?.budgetAndCapacity?.addTeam?.cancel}
            variant="outlined"
            color="secondary"
            onClick={() => reduxDispatch(goBack())}
          />
          <Button
            label={
              messages?.plan?.budgetAndCapacity?.addTeam?.[
                teamId ? "update" : "add"
              ]
            }
            variant="contained"
            color="primary"
            type="submit"
            disabled={submitting}
          />
        </Grid>
      </Form>
    </Container>
  );
};

export default AddTeamForm;
