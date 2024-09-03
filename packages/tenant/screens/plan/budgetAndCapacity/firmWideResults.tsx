import React, { useEffect, useState } from "react";
import { Container } from "../../../components";
import { DetailPageWrapper, Toast } from "@wizehub/components";
import messages from "../../../messages";
import {
  StyledFirmWideResultsSecondaryContainerNoteTypography,
  StyledFirmWideResultsSecondaryContainerTypography,
  StyledSumaryResultsWarningTypography,
  StyledSummaryResultInnerSecondaryContainer,
  StyledSummaryResultInnerSecondaryTypography,
  StyledSummaryResultSecondaryContainer,
} from "./styles";
import { Divider, Grid } from "@mui/material";
import {
  StyledFormPercentageGreyTypography,
  StyledFormPercentageTypography,
} from "../../financialOverview/styles";
import { useLocation } from "react-router-dom";
import { Id } from "@wizehub/common/models";
import { useDispatch } from "react-redux";
import { apiCall } from "../../../redux/actions";
import { FIRM_WIDE_RESULTS_API } from "../../../api";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import { toast } from "react-toastify";
import { FirmWideResultEntity } from "@wizehub/common/models/genericEntities";
import { formatCurrency, nullablePlaceHolder } from "@wizehub/common/utils";
import {
  percentageCalculatorFunction,
  twoSubtractFunction,
  twoSumFunction,
} from "./budgetAndCapacityFormula";

const FirmWideResults = () => {
  const { state } = useLocation<{ budgetId?: Id }>();
  const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
  const [firmWideResults, setFirmWideResults] =
    useState<FirmWideResultEntity>();
  const reduxDispatch = useDispatch();

  const forecastedCogsPercentage = percentageCalculatorFunction(
    firmWideResults?.totalSalary,
    firmWideResults?.totalForecastAnnualFee
  );

  const forecastedFeeGrossProfit = twoSubtractFunction(
    firmWideResults?.totalForecastAnnualFee,
    firmWideResults?.totalSalary
  );

  const forecastedFeeGrossProfitPercentage = percentageCalculatorFunction(
    forecastedFeeGrossProfit,
    firmWideResults?.totalForecastAnnualFee
  );

  const totalFirmCapacity = firmWideResults?.totalCapacityFee;

  const spareCapacity = twoSubtractFunction(
    firmWideResults?.totalCapacityFee,
    firmWideResults?.totalForecastAnnualFee
  );

  const spareCapacityPercentage = percentageCalculatorFunction(
    spareCapacity,
    firmWideResults?.totalCapacityFee
  );

  useEffect(() => {
    if (state?.budgetId) {
      reduxDispatch(
        apiCall(
          FIRM_WIDE_RESULTS_API.replace(":tenantId", tenantId).replace(
            ":budgetId",
            state?.budgetId?.toString()
          ),
          (resolve) => {
            setFirmWideResults(resolve);
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
  }, [state?.budgetId]);

  return (
    <Container noPadding>
      <DetailPageWrapper
        heading={messages?.plan?.budgetAndCapacity?.firmWideCapacity?.heading}
        cardContent={[
          {
            value: (
              <StyledSummaryResultSecondaryContainer
                noMargin={true}
                display="flex"
                flexDirection="column"
                gap={2}
              >
                <StyledSummaryResultInnerSecondaryContainer
                  container
                  item
                  xs={12}
                >
                  <StyledSummaryResultInnerSecondaryTypography>
                    {
                      messages?.plan?.budgetAndCapacity?.firmWideCapacity
                        ?.forecastTradingStatement
                    }
                  </StyledSummaryResultInnerSecondaryTypography>
                  <Divider sx={{ width: "100%" }} />
                  <Grid container item xs={12}>
                    <Grid item xs={6}>
                      <StyledFormPercentageTypography textAlign="initial">
                        {
                          messages?.plan?.budgetAndCapacity?.firmWideCapacity
                            ?.forecastCostofGoldSold
                        }
                      </StyledFormPercentageTypography>
                    </Grid>
                    <Grid item xs={3}>
                      <StyledFormPercentageGreyTypography textAlign="end">
                        {formatCurrency(firmWideResults?.totalSalary, false)}
                      </StyledFormPercentageGreyTypography>
                    </Grid>
                    <Grid item xs={3}>
                      <StyledFormPercentageGreyTypography textAlign="end">
                        {`${nullablePlaceHolder(forecastedCogsPercentage)}%`}
                      </StyledFormPercentageGreyTypography>
                    </Grid>
                  </Grid>
                  <Grid container item xs={12}>
                    <Grid item xs={6}>
                      <StyledFormPercentageTypography textAlign="initial">
                        {
                          messages?.plan?.budgetAndCapacity?.firmWideCapacity
                            ?.forecastFeesGrossProfit
                        }
                      </StyledFormPercentageTypography>
                    </Grid>
                    <Grid item xs={3}>
                      <StyledFormPercentageGreyTypography textAlign="end">
                        {formatCurrency(forecastedFeeGrossProfit, false)}
                      </StyledFormPercentageGreyTypography>
                    </Grid>
                    <Grid item xs={3}>
                      <StyledFormPercentageGreyTypography textAlign="end">
                        {`${nullablePlaceHolder(
                          forecastedFeeGrossProfitPercentage
                        )}%`}
                      </StyledFormPercentageGreyTypography>
                    </Grid>
                  </Grid>
                  <Divider sx={{ width: "100%", borderStyle: "dashed" }} />
                  <Grid container item xs={12}>
                    <Grid item xs={12}>
                      <StyledSumaryResultsWarningTypography textAlign="end">
                        {
                          messages?.plan?.budgetAndCapacity?.firmWideCapacity
                            ?.note
                        }
                      </StyledSumaryResultsWarningTypography>
                    </Grid>
                  </Grid>
                </StyledSummaryResultInnerSecondaryContainer>
                <StyledSummaryResultInnerSecondaryContainer
                  container
                  item
                  xs={12}
                >
                  <StyledSummaryResultInnerSecondaryTypography>
                    {
                      messages?.plan?.budgetAndCapacity?.firmWideCapacity
                        ?.capacityResultsFirmWide
                    }
                  </StyledSummaryResultInnerSecondaryTypography>
                  <Divider sx={{ width: "100%" }} />
                  <Grid container item xs={12}>
                    <Grid item xs={6}>
                      <StyledFormPercentageTypography textAlign="initial">
                        {
                          messages?.plan?.budgetAndCapacity?.firmWideCapacity
                            ?.totalFirmCapacity
                        }
                      </StyledFormPercentageTypography>
                    </Grid>
                    <Grid item xs={6}>
                      <StyledFormPercentageGreyTypography textAlign="end">
                        {formatCurrency(totalFirmCapacity, false)}
                      </StyledFormPercentageGreyTypography>
                    </Grid>
                  </Grid>
                  <Grid container item xs={12}>
                    <Grid item xs={6}>
                      <StyledFormPercentageTypography textAlign="initial">
                        {
                          messages?.plan?.budgetAndCapacity?.firmWideCapacity
                            ?.forecastFeesNextYear
                        }
                      </StyledFormPercentageTypography>
                    </Grid>
                    <Grid item xs={6}>
                      <StyledFormPercentageGreyTypography textAlign="end">
                        {formatCurrency(
                          firmWideResults?.totalForecastAnnualFee,
                          false
                        )}
                      </StyledFormPercentageGreyTypography>
                    </Grid>
                  </Grid>
                  <Grid container item xs={12}>
                    <Grid item xs={6}>
                      <StyledFormPercentageTypography textAlign="initial">
                        {
                          messages?.plan?.budgetAndCapacity?.firmWideCapacity
                            ?.overOrSpareCapacity
                        }
                      </StyledFormPercentageTypography>
                    </Grid>
                    <Grid item xs={6}>
                      <StyledFormPercentageGreyTypography textAlign="end">
                        {formatCurrency(spareCapacity, false)}
                      </StyledFormPercentageGreyTypography>
                    </Grid>
                  </Grid>
                  <Divider sx={{ width: "100%", borderStyle: "dashed" }} />
                  <Grid container item xs={12}>
                    <Grid item xs={12}>
                      <StyledFormPercentageGreyTypography textAlign="end">
                        {`${nullablePlaceHolder(spareCapacityPercentage)}%`}
                      </StyledFormPercentageGreyTypography>
                    </Grid>
                  </Grid>
                </StyledSummaryResultInnerSecondaryContainer>
              </StyledSummaryResultSecondaryContainer>
            ),
            gridWidth: 9,
            isTypography: false,
          },
          {
            value: (
              <StyledSummaryResultSecondaryContainer
                noMargin={true}
                display="flex"
                flexDirection="column"
                gap={2}
              >
                <StyledSummaryResultInnerSecondaryContainer
                  container
                  item
                  xs={12}
                >
                  <StyledFirmWideResultsSecondaryContainerTypography>
                    {
                      messages?.plan?.budgetAndCapacity?.firmWideCapacity
                        ?.resourceMix
                    }
                  </StyledFirmWideResultsSecondaryContainerTypography>
                  <Divider sx={{ width: "100%" }} />
                  <Grid container item xs={12}>
                    <StyledFormPercentageTypography textAlign="initial">
                      {
                        messages?.plan?.budgetAndCapacity?.firmWideCapacity
                          ?.resourceMixNote
                      }
                    </StyledFormPercentageTypography>
                  </Grid>
                  <Divider sx={{ width: "100%", borderStyle: "dashed" }} />
                </StyledSummaryResultInnerSecondaryContainer>
                <StyledSummaryResultInnerSecondaryContainer
                  container
                  item
                  xs={12}
                >
                  <StyledFirmWideResultsSecondaryContainerNoteTypography>
                    {
                      messages?.plan?.budgetAndCapacity?.firmWideCapacity
                        ?.pleaseNote
                    }
                  </StyledFirmWideResultsSecondaryContainerNoteTypography>
                  <Divider sx={{ width: "100%" }} />
                  <Grid container item xs={12}>
                    <StyledFormPercentageTypography textAlign="initial">
                      {
                        messages?.plan?.budgetAndCapacity?.firmWideCapacity
                          ?.pleaseNoteText
                      }
                    </StyledFormPercentageTypography>
                  </Grid>
                  <Divider sx={{ width: "100%", borderStyle: "dashed" }} />
                </StyledSummaryResultInnerSecondaryContainer>
              </StyledSummaryResultSecondaryContainer>
            ),
            gridWidth: 3,
            isTypography: false,
          },
        ]}
        hasGoBackIcon={true}
        detailedGridGap={2}
      />
    </Container>
  );
};

export default FirmWideResults;
