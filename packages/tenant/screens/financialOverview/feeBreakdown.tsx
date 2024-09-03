import { Divider, Grid } from "@mui/material";
import { Button, Card, Modal } from "@wizehub/components";
import React, { useEffect, useState } from "react";
import messages from "../../messages";
import { ResponsiveEditIcon } from "../systemPreferences/launchPadSetup/launchPadSetupDetail";
import { greyScaleColour } from "@wizehub/common/theme/style.palette";
import {
  StyledFeeCardContainer,
  StyledFeeCardHeading,
  StyledFeeContainerFooterTotalTypography,
  StyledFeeContainerFooterTypography,
} from "./styles";
import {
  StyledAddTeamSubTextTypography,
  StyledBracketValueTypography,
  StyledValueTypography,
} from "../plan/budgetAndCapacity/styles";
import {
  financialYearStartMonth,
  formatCurrency,
  nullablePlaceHolder,
  totalValueMethod,
} from "@wizehub/common/utils";
import { useEntity, usePopupReducer } from "@wizehub/common/hooks";
import EditFeeBreakdownForm from "./editFeeBreakdownForm";
import { FEE_TYPE } from "@wizehub/common/models/modules";
import {
  FeeBreakdownEntity,
  FeeBreakdownFirmWideEntity,
} from "@wizehub/common/models/genericEntities";
import { FEE_TEAM_BY_ID, GET_FIRM_WIDE_FEES } from "../../api";
import { useSelector } from "react-redux";
import { ReduxState } from "../../redux/reducers";
import { Id } from "@wizehub/common/models";
import { percentageCalculatorFunction } from "../plan/budgetAndCapacity/budgetAndCapacityFormula";
import { useDispatch } from "react-redux";
import { apiCall } from "@wizehub/common/redux/actions";

interface Props {
  feeId: Id;
  feeTeamId: Id;
  currentYear: number;
}

// const totalValueMethod = (
//   feeBreakdownEntity: Array<FeeBreakdownEntity>,
//   key: keyof FeeBreakdownEntity
// ) => {
//   const currentYearTotal = feeBreakdownEntity?.reduce((acc, curr) => {
//     if (curr[key] === null) {
//       return acc;
//     }
//     return acc + (curr[key] as number);
//   }, 0);

//   const isAllNull = feeBreakdownEntity?.every(
//     (item) => item.currentMonthFee === null
//   );
//   return isAllNull ? null : currentYearTotal;
// };

const FeeBreakdown: React.FC<Props> = ({ feeId, feeTeamId, currentYear }) => {
  const { tenantData, firmProfile } = useSelector((state: ReduxState) => state);
  const [firmWideResult, setFirmWideResult] = useState<
    Array<FeeBreakdownFirmWideEntity>
  >([]);
  const reduxDispatch = useDispatch();
  const { tenantId } = tenantData;
  const monthArray = financialYearStartMonth(
    firmProfile?.financialYearStartMonth
  );
  const {
    visibility: createEditFormVisibility,
    showPopup: showEditForm,
    hidePopup: hideEditForm,
    metaData: editFormConfig,
  } = usePopupReducer<{
    type: FEE_TYPE;
  }>();

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

  return (
    <>
      <Grid container xs={12} marginLeft="20px" columnSpacing={1} rowGap={1}>
        <Grid container item xs={6}>
          <Card
            headerCss={{
              display: "flex",
              backgroundColor: greyScaleColour.grey60,
            }}
            header={
              <StyledFeeCardContainer container xs={12}>
                <StyledFeeCardHeading>
                  {`${
                    messages?.measure?.financialOverview?.fees
                      ?.currentYearActuals
                  } (${nullablePlaceHolder(currentYear)})`}
                </StyledFeeCardHeading>
                {feeTeamId !== "firm-wide" && (
                  <Button
                    startIcon={<ResponsiveEditIcon />}
                    variant="outlined"
                    color="secondary"
                    label={
                      messages?.measure?.financialOverview?.fees?.editDetails
                    }
                    onClick={() => {
                      showEditForm({
                        type: FEE_TYPE.CURRENT,
                      });
                    }}
                  />
                )}
              </StyledFeeCardContainer>
            }
            cardCss={{
              margin: "20px 0px",
              width: "100%",
            }}
            contentCss={{
              margin: "20px 0",
              height: "fit-content",
              gap: "16px",
            }}
            noHeaderPadding={true}
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
                    <Grid item xs={2}>
                      <StyledBracketValueTypography>
                        {feeTeamId !== "firm-wide"
                          ? feeBreakdownEntity?.filter(
                              (fee) => fee?.month === monthNumber
                            )[0]?.currentMonthFee !== null
                            ? `${percentageCalculatorFunction(
                                feeBreakdownEntity?.filter(
                                  (fee) => fee?.month === monthNumber
                                )[0]?.currentMonthFee,
                                totalValueMethod(
                                  feeBreakdownEntity,
                                  "currentMonthFee"
                                )
                              )}%`
                            : "-"
                          : finalFirmWideResult?.filter(
                              (fee) => fee?.month === monthNumber
                            )[0]?.currentMonthFee !== null
                          ? `${percentageCalculatorFunction(
                              finalFirmWideResult?.filter(
                                (fee) => fee?.month === monthNumber
                              )[0]?.currentMonthFee,
                              totalValueMethod(
                                finalFirmWideResult,
                                "currentMonthFee"
                              )
                            )}%`
                          : "-"}
                      </StyledBracketValueTypography>
                    </Grid>
                    <Grid item xs={2} display="flex" justifyContent="end">
                      <StyledValueTypography>
                        {feeTeamId !== "firm-wide"
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
              <Grid item xs={10}>
                <StyledFeeContainerFooterTypography>
                  {messages?.measure?.financialOverview?.fees?.total}
                </StyledFeeContainerFooterTypography>
              </Grid>
              <Grid item xs={2} display="flex" justifyContent="end">
                <StyledFeeContainerFooterTotalTypography>
                  {feeTeamId !== "firm-wide"
                    ? formatCurrency(
                        totalValueMethod(feeBreakdownEntity, "currentMonthFee"),
                        false
                      )
                    : formatCurrency(
                        totalValueMethod(
                          finalFirmWideResult,
                          "currentMonthFee"
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
            headerCss={{
              display: "flex",
              backgroundColor: greyScaleColour.grey60,
            }}
            header={
              <StyledFeeCardContainer container xs={12}>
                <StyledFeeCardHeading>
                  {`${
                    messages?.measure?.financialOverview?.fees?.lastYearActuals
                  } (${nullablePlaceHolder(currentYear - 1)})`}
                </StyledFeeCardHeading>
                {feeTeamId !== "firm-wide" && (
                  <Button
                    startIcon={<ResponsiveEditIcon />}
                    variant="outlined"
                    color="secondary"
                    label={
                      messages?.measure?.financialOverview?.fees?.editDetails
                    }
                    onClick={() => {
                      showEditForm({
                        type: FEE_TYPE.PREVIOUS,
                      });
                    }}
                  />
                )}
              </StyledFeeCardContainer>
            }
            cardCss={{
              margin: "20px 0px",
              width: "100%",
            }}
            contentCss={{
              margin: "20px 0",
              height: "fit-content",
              gap: "16px",
            }}
            noHeaderPadding={true}
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
                    <Grid item xs={2}>
                      <StyledBracketValueTypography>
                        {feeTeamId !== "firm-wide"
                          ? feeBreakdownEntity?.filter(
                              (fee) => fee?.month === monthNumber
                            )[0]?.previousMonthFee !== null
                            ? `${percentageCalculatorFunction(
                                feeBreakdownEntity?.filter(
                                  (fee) => fee?.month === monthNumber
                                )[0]?.previousMonthFee,
                                totalValueMethod(
                                  feeBreakdownEntity,
                                  "previousMonthFee"
                                )
                              )}%`
                            : "-"
                          : finalFirmWideResult?.filter(
                              (fee) => fee?.month === monthNumber
                            )[0]?.previousMonthFee !== null
                          ? `${percentageCalculatorFunction(
                              finalFirmWideResult?.filter(
                                (fee) => fee?.month === monthNumber
                              )[0]?.previousMonthFee,
                              totalValueMethod(
                                finalFirmWideResult,
                                "previousMonthFee"
                              )
                            )}%`
                          : "-"}
                      </StyledBracketValueTypography>
                    </Grid>
                    <Grid item xs={2} display="flex" justifyContent="end">
                      <StyledValueTypography>
                        {feeTeamId !== "firm-wide"
                          ? formatCurrency(
                              feeBreakdownEntity?.filter(
                                (fee) => fee?.month === monthNumber
                              )[0]?.previousMonthFee,
                              false
                            )
                          : formatCurrency(
                              finalFirmWideResult?.filter(
                                (fee) => fee?.month === monthNumber
                              )[0]?.previousMonthFee,
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
              <Grid item xs={10}>
                <StyledFeeContainerFooterTypography>
                  {messages?.measure?.financialOverview?.fees?.total}
                </StyledFeeContainerFooterTypography>
              </Grid>
              <Grid item xs={2} display="flex" justifyContent="end">
                <StyledFeeContainerFooterTotalTypography>
                  {feeTeamId !== "firm-wide"
                    ? formatCurrency(
                        totalValueMethod(
                          feeBreakdownEntity,
                          "previousMonthFee"
                        ),
                        false
                      )
                    : formatCurrency(
                        totalValueMethod(
                          finalFirmWideResult,
                          "previousMonthFee"
                        ),
                        false
                      )}
                </StyledFeeContainerFooterTotalTypography>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
      <Modal
        show={createEditFormVisibility}
        heading={`${
          messages?.measure?.financialOverview?.fees?.[
            editFormConfig?.type === FEE_TYPE.CURRENT
              ? "currentYearActuals"
              : "lastYearActuals"
          ]
        } (${
          editFormConfig?.type === FEE_TYPE.CURRENT
            ? currentYear
            : currentYear - 1
        })`}
        onClose={hideEditForm}
        fitContent
      >
        <EditFeeBreakdownForm
          onCancel={hideEditForm}
          onSuccess={() => {
            hideEditForm();
            refreshEntity();
          }}
          feeId={feeId}
          feeEntity={editFormConfig}
          feeBreakdownEntity={feeBreakdownEntity}
          feeTeamId={feeTeamId}
        />
      </Modal>
    </>
  );
};

export default FeeBreakdown;
