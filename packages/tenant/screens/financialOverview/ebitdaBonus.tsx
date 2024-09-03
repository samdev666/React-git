import React, { useEffect, useState } from "react";
import { Container } from "../../components";
import {
  StyledDetailTableContent,
  StyledDetailTableHeading,
  StyledMainHeadingContainer,
} from "@wizehub/components/detailPageWrapper/styles";
import { StyledBudgestAndCapacityLeftHeadingContainer } from "../plan/budgetAndCapacity/styles";
import { StyledHeadingTypography } from "../profile/styles";
import messages from "../../messages";
import { Chip, Divider, Grid, Typography } from "@mui/material";
import {
  Button,
  MaterialAutocompleteInput,
  MaterialTextInput,
  Modal,
  Toast,
} from "@wizehub/components";
import { ResponsiveDayViewIcon } from "../plan/budgetAndCapacity/budgetAndCapacity";
import {
  useEntity,
  useFormReducer,
  useOptions,
  usePagination,
  usePopupReducer,
} from "@wizehub/common/hooks";
import {
  StyledNoDataInfo,
  StyledResponsiveIcon,
} from "@wizehub/components/table/styles";
import {
  StyledEbitdaGridTableContainer,
  StyledEntityPercentageTableTextTypography,
  StyledEntityTableTextTypography,
  StyledGridTableContainer,
  StyledInnerGridDashedTableContainer,
  StyledInnerGridTableBoldTypography,
  StyledInnerGridTableContainer,
  StyledInnerGridTableHeadingTypography,
  StyledInnerGridTableNormalTypography,
  StyledMainHeadingEbitdaButtonContainer,
  StyledPeriodTypography,
  StyledStaticDatePicker,
} from "./styles";
import { Id, UserActionConfig } from "@wizehub/common/models";
import EbitdaPlanForm from "./ebitdaPlanForm";
import {
  EbitdaBonusEntity,
  EbitdaEntity,
  EbitdaThresholdEntity,
  LockupPlanEntity,
  PlanEntity,
} from "@wizehub/common/models/genericEntities";
import {
  ADD_PLAN,
  EBIDTA_RESYNC_TEAM,
  EBITDA_LISTING_API,
  EBITDA_PLAN_LISTING_API,
  EBITDA_THRESHOLD_LISTING_API,
  GET_EBITDA_BONUS,
} from "../../api";
import { useSelector } from "react-redux";
import { ReduxState } from "../../redux/reducers";
import {
  addAnyNumberOfValues,
  capitalizeLegend,
  formatCurrency,
  getDiscountPercentage,
  HttpMethods,
  mapIdNameToOptionWithTitleWithoutCaptializing,
  nullablePlaceHolder,
  totalValueMethod,
} from "@wizehub/common/utils";
import {
  calculatePercentageOf,
  percentageCalculatorFunction,
  twoSubtractFunction,
  twoSumFunction,
} from "../plan/budgetAndCapacity/budgetAndCapacityFormula";
import { apiCall } from "../../redux/actions";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Months } from "@wizehub/common/models/modules";
import moment, { Moment } from "moment";
import { hideLoader, showLoader } from "@wizehub/common/redux/actions";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { push } from "connected-react-router";
import { routes } from "../../utils";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import BonusSystemNotes from "./bonusSystemNotes";
import EbitdaThresholdForm, {
  getDefaultPlanFilter,
  paginatedEbitdaThreshold,
} from "./ebitdaThresholdForm";
import LegendToggleIcon from "@mui/icons-material/LegendToggle";
import { otherColour } from "@wizehub/common/theme/style.palette";
import {
  StyledNoMVVInfo,
  StyledNoMVVInfoContainer,
} from "../firmProfile/styles";

const ResponsiveEbitdaIcon = StyledResponsiveIcon(LegendToggleIcon);

export const ResponsiveThresholdIcon = StyledResponsiveIcon(
  TableChartOutlinedIcon
);

export const ResponsiveInfoOutlinedIcon =
  StyledResponsiveIcon(InfoOutlinedIcon);

const EbitdaBonus = () => {
  const { tenantData, firmProfile } = useSelector((state: ReduxState) => state);
  const [openDatePicker, setOpenDatePicker] = useState<boolean>(false);
  const { tenantId } = tenantData;
  const [ebitdaEntity, setEbitdaEntity] = useState<Array<EbitdaEntity>>([]);
  const [endMonth, setEndMonth] = useState<number>(
    moment().subtract(1, "months").month() + 1
  );
  const previousMonth = moment().subtract(1, "months").month();
  const reduxDispatch = useDispatch();
  const { connectField, formValues, change, submitting, handleSubmit } =
    useFormReducer();
  const {
    visibility: createPlanFormVisibility,
    showPopup: showCreatePlanForm,
    hidePopup: hideCreatePlanForm,
  } = usePopupReducer<UserActionConfig>();

  const { options: planOptions, refreshOptions } = useOptions<LockupPlanEntity>(
    EBITDA_PLAN_LISTING_API.replace(":tenantId", tenantId),
    true
  );

  const {
    visibility: bonusSystemNotesVisibility,
    showPopup: bonusSystemNotesShowPopup,
    hidePopup: bonusSystemNotesHidePopup,
  } = usePopupReducer();

  const {
    visibility: ebitdaThresholdPlanFormVisibility,
    showPopup: showEbitdaThresholdPlanForm,
    hidePopup: hideEbitdaThresholdPlanForm,
  } = usePopupReducer<UserActionConfig>();

  const { entity: planEntity, refreshEntity: refreshPlanEntity } =
    useEntity<PlanEntity>(
      ADD_PLAN,
      planOptions.filter(
        (planId) => planId?.id === formValues?.plan?.value?.id
      )[0]?.plan?.id
    );

  const { entity: ebitdaBonusEntity, refreshEntity: refreshEbitdaBonusEntity } =
    useEntity<EbitdaBonusEntity>(
      GET_EBITDA_BONUS,
      planEntity?.planEbitaId.toString()
    );

  const { entity: ebitdaThresholdEntity, applyFilters } =
    usePagination<EbitdaThresholdEntity>(
      {
        ...paginatedEbitdaThreshold,
        api: EBITDA_THRESHOLD_LISTING_API.replace(
          ":tenantId",
          tenantId
        ).replace(":ebitaId", planEntity?.planEbitaId?.toString()),
      },
      getDefaultPlanFilter()
    );

  useEffect(() => {
    if (planEntity) {
      reduxDispatch(showLoader());
      const filterMonths = Array.from(
        { length: endMonth - firmProfile?.financialYearStartMonth + 1 },
        (_, i) => firmProfile?.financialYearStartMonth + i
      ).join(",");
      refreshEbitdaBonusEntity();
      applyFilters();
      reduxDispatch(
        apiCall(
          `${EBITDA_LISTING_API.replace(":tenantId", tenantId).replace(
            ":ebitaId",
            planEntity?.planEbitaId.toString()
          )}?filter[months]=${filterMonths}`,
          (resolve) => {
            setEbitdaEntity(
              resolve?.filter((res: any) => typeof res === "object")
            );
            reduxDispatch(hideLoader());
          },
          (reject) => {
            reduxDispatch(hideLoader());
          }
        )
      );
    }
  }, [planEntity, endMonth]);

  useEffect(() => {
    if (!formValues?.plan?.value?.id && planOptions.length > 0) {
      change("plan", {
        id: planOptions[0]?.id,
        label: planOptions[0]?.title,
      });
      refreshPlanEntity();
    }
  }, [planOptions]);

  useEffect(() => {
    if (formValues?.plan?.value?.id) {
      refreshPlanEntity();
    }
  }, [formValues?.plan?.value?.id]);

  const totalRevenue = totalValueMethod(ebitdaEntity, "revenue");

  const totalWages = totalValueMethod(ebitdaEntity, "wages");

  const totalDirectExpenses = totalValueMethod(ebitdaEntity, "directExpenses");

  const totalIndirectExpenses = totalValueMethod(
    ebitdaEntity,
    "otherDirectExpenses"
  );

  const totalOwnerMarketSalary = totalValueMethod(
    ebitdaEntity,
    "ownerMarketSalary"
  );
  const totalOwnerWithdrawalSalary = totalValueMethod(
    ebitdaEntity,
    "ownerWithdrawalSalary"
  );

  const totalSalary = twoSumFunction(
    totalWages,
    twoSubtractFunction(totalOwnerMarketSalary, totalOwnerWithdrawalSalary)
  );

  const totalCostOfGoodsSold = addAnyNumberOfValues(
    Number(totalSalary),
    totalDirectExpenses,
    totalIndirectExpenses
  );

  const totalGrossProfit = twoSubtractFunction(
    totalRevenue,
    totalCostOfGoodsSold
  );

  const totalOverhead = totalValueMethod(ebitdaEntity, "overhead");

  const totalEbitda = twoSubtractFunction(totalGrossProfit, totalOverhead);

  const totalEbitdaPercentage = percentageCalculatorFunction(
    totalEbitda,
    totalRevenue
  );

  const totalEbitdaHurdle = calculatePercentageOf(
    totalRevenue,
    Number(formValues?.ebitdaPerTeam?.value)
  );

  const totalBonusPoolAvailable = twoSubtractFunction(
    totalEbitda,
    totalEbitdaHurdle
  );

  const totalBonusAchieved = calculatePercentageOf(
    totalBonusPoolAvailable,
    getDiscountPercentage(
      ebitdaThresholdEntity?.records,
      ebitdaBonusEntity?.teamEbitaThresholdPercentage
    )
  );

  const totalScmBonus = calculatePercentageOf(
    totalBonusAchieved,
    ebitdaBonusEntity?.scmBonusPercentage
  );

  const totalProductionBonus = calculatePercentageOf(
    totalBonusAchieved,
    ebitdaBonusEntity?.productionTeamBonusPercentage
  );

  const totalAdminTeamBonus = calculatePercentageOf(
    totalBonusAchieved,
    ebitdaBonusEntity?.adminTeamBonusPercentage
  );

  const isAchieved =
    ebitdaBonusEntity?.firmEbitaThresholdPercentage && totalEbitdaPercentage
      ? ebitdaBonusEntity?.firmEbitaThresholdPercentage <=
        Number(totalEbitdaPercentage)
      : false;

  useEffect(() => {
    if (formValues?.datePicker?.value) {
      setEndMonth(
        Number(
          Months?.filter(
            (month) =>
              month?.label ===
              moment(formValues?.datePicker?.value).format("MMM")
          )[0]?.id
        )
      );
      setOpenDatePicker(false);
    }
  }, [formValues?.datePicker?.value]);

  const bonusSystemAchieved = async () => {
    return new Promise((res, rej) => {
      const sanitizedBody = {
        tenantId: tenantId,
        ebitaId: planEntity?.planEbitaId,
        firmEbitaThresholdPercentage: formValues?.firmsOverall?.value,
        teamEbitaThresholdPercentage: formValues?.ebitdaPerTeam?.value,
        scmBonusPercentage: formValues?.seniorClientManager?.value,
        productionTeamBonusPercentage: formValues?.productionTeam?.value,
        adminTeamBonusPercentage: formValues?.adminTeam?.value,
        status: "ACTIVE",
      };
      reduxDispatch(
        apiCall(
          `${GET_EBITDA_BONUS}/${ebitdaBonusEntity?.id}`,
          res,
          rej,
          HttpMethods.PATCH,
          sanitizedBody
        )
      );
    })
      .then(() => {
        refreshEbitdaBonusEntity();
        toast(
          <Toast
            text={
              messages?.measure?.financialOverview?.ebidta
                ?.ebitdaThresholdSuccess
            }
          />
        );
      })
      .catch((err) => {
        toast(
          <Toast
            text={
              messages?.measure?.financialOverview?.ebidta?.error
                ?.serverError?.[err?.message]
            }
            type="error"
          />
        );
      });
  };

  useEffect(() => {
    if (ebitdaBonusEntity) {
      change("firmsOverall", ebitdaBonusEntity?.firmEbitaThresholdPercentage);
      change("ebitdaPerTeam", ebitdaBonusEntity?.teamEbitaThresholdPercentage);
      change("seniorClientManager", ebitdaBonusEntity?.scmBonusPercentage);
      change(
        "productionTeam",
        ebitdaBonusEntity?.productionTeamBonusPercentage
      );
      change("adminTeam", ebitdaBonusEntity?.adminTeamBonusPercentage);
    }
  }, [ebitdaBonusEntity]);

  return (
    <Container noPadding>
      <StyledMainHeadingContainer>
        <StyledBudgestAndCapacityLeftHeadingContainer container xs={6}>
          <StyledHeadingTypography>
            {messages?.measure?.financialOverview?.ebidta?.heading}
          </StyledHeadingTypography>
          <Grid container item xs={4} gap={2}>
            <Grid item xs={7}>
              {connectField("plan", {
                label: messages?.measure?.financialOverview?.ebidta?.plan,
                options: planOptions?.map(
                  mapIdNameToOptionWithTitleWithoutCaptializing
                ),
              })(MaterialAutocompleteInput)}
            </Grid>
            <Grid item xs={3}>
              <Button
                startIcon={<ResponsiveDayViewIcon />}
                variant="text"
                color="primary"
                label={messages?.measure?.financialOverview?.ebidta?.plan}
                onClick={() => {
                  showCreatePlanForm();
                }}
              />
            </Grid>
          </Grid>
          <Grid container item xs={4} position="relative">
            <StyledPeriodTypography>
              {messages?.measure?.financialOverview?.ebidta?.period}{" "}
              {`${
                Months[
                  firmProfile?.financialYearStartMonth
                    ? firmProfile?.financialYearStartMonth - 1
                    : 0
                ]?.label
              }`}{" "}
              to{" "}
              {`${
                formValues?.datePicker
                  ? moment(formValues?.datePicker?.value).format("MMM")
                  : Months[previousMonth]?.label
              }`}
            </StyledPeriodTypography>
            {openDatePicker ? (
              <KeyboardArrowUpIcon
                onClick={() => setOpenDatePicker((prev) => !prev)}
              />
            ) : (
              <KeyboardArrowDownIcon
                onClick={() => setOpenDatePicker((prev) => !prev)}
              />
            )}
            {openDatePicker &&
              connectField("datePicker", {
                views: ["month"],
                slots: {
                  toolbar: () => null as any,
                  actionBar: () => null as any,
                  calendarHeader: () => null as any,
                },
                shouldDisableMonth: (month: Moment) =>
                  month.month() < firmProfile?.financialYearStartMonth - 1 ||
                  month.month() > previousMonth,
                defaultCalendarMonth: moment().month(previousMonth),
              })(StyledStaticDatePicker)}
          </Grid>
        </StyledBudgestAndCapacityLeftHeadingContainer>
        <StyledMainHeadingEbitdaButtonContainer>
          <Button
            startIcon={<ResponsiveEbitdaIcon />}
            variant="outlined"
            color="secondary"
            label={messages?.measure?.financialOverview?.ebidta?.backToEbitda}
            onClick={() => reduxDispatch(push(routes.financialOverview.ebitda))}
          />
          <Button
            startIcon={<ResponsiveInfoOutlinedIcon />}
            variant="outlined"
            color="secondary"
            label={
              messages?.measure?.financialOverview?.ebidta?.bonusSystemNotes
            }
            onClick={() => bonusSystemNotesShowPopup()}
          />
          <Button
            startIcon={<ResponsiveThresholdIcon />}
            variant="contained"
            color="primary"
            label={
              messages?.measure?.financialOverview?.ebidta?.ebitdaThreshold
            }
            onClick={() => showEbitdaThresholdPlanForm()}
          />
        </StyledMainHeadingEbitdaButtonContainer>
      </StyledMainHeadingContainer>
      {ebitdaEntity?.length ? (
        <>
          <Grid container item xs={12} padding="8px 20px 0 20px" gap={2}>
            <Grid item xs={12}>
              <StyledPeriodTypography>
                {
                  messages?.measure?.financialOverview?.ebidta
                    ?.ebitdaCalculation
                }
              </StyledPeriodTypography>
            </Grid>
            <Grid container item xs={12} gap={1}>
              <Grid item xs={3}>
                {connectField("firmsOverall", {
                  label:
                    messages?.measure?.financialOverview?.ebidta?.firmsOverall,
                })(MaterialTextInput)}
              </Grid>
              <Grid item xs={3}>
                {connectField("ebitdaPerTeam", {
                  label:
                    messages?.measure?.financialOverview?.ebidta?.ebitdaPerTeam,
                })(MaterialTextInput)}
              </Grid>
              <Button
                variant="contained"
                color="primary"
                label={messages?.measure?.financialOverview?.ebidta?.calculate}
                onClick={handleSubmit(bonusSystemAchieved)}
                disabled={submitting}
              />
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={2}>
                <StyledDetailTableHeading>
                  {messages?.measure?.financialOverview?.ebidta?.ebitdaAchieved}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {totalEbitdaPercentage ? totalEbitdaPercentage : "-"}
                </StyledDetailTableContent>
              </Grid>
              <Grid item xs={2}>
                <StyledDetailTableHeading>
                  {messages?.measure?.financialOverview?.ebidta?.bonusSystem}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {ebitdaBonusEntity?.firmEbitaThresholdPercentage && (
                    <Chip
                      label={capitalizeLegend(
                        isAchieved
                          ? messages?.measure?.financialOverview?.ebidta
                              ?.achieved
                          : messages?.measure?.financialOverview?.ebidta
                              ?.unachieved
                      )}
                      sx={{
                        backgroundColor: isAchieved
                          ? otherColour.successBg
                          : otherColour.errorBg,
                        borderRadius: "4px",
                        padding: "4px 8px",
                        color: isAchieved
                          ? otherColour.successDefault
                          : otherColour.errorDefault,
                      }}
                    />
                  )}
                </StyledDetailTableContent>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ width: "100%", borderStyle: "dashed" }} />
            </Grid>
            <Grid item xs={12}>
              <StyledPeriodTypography>
                {
                  messages?.measure?.financialOverview?.ebidta
                    ?.distributeBonusAmongTeam
                }
              </StyledPeriodTypography>
            </Grid>
            <Grid container item xs={12} gap={1}>
              <Grid item xs={3}>
                {connectField("seniorClientManager", {
                  label:
                    messages?.measure?.financialOverview?.ebidta
                      ?.seniorClientManager,
                })(MaterialTextInput)}
              </Grid>
              <Grid item xs={3}>
                {connectField("productionTeam", {
                  label:
                    messages?.measure?.financialOverview?.ebidta
                      ?.productionTeam,
                })(MaterialTextInput)}
              </Grid>
              <Grid item xs={3}>
                {connectField("adminTeam", {
                  label:
                    messages?.measure?.financialOverview?.ebidta?.adminTeam,
                })(MaterialTextInput)}
              </Grid>
              <Button
                variant="contained"
                color="primary"
                label={messages?.measure?.financialOverview?.ebidta?.distribute}
                disabled={submitting}
                onClick={handleSubmit(bonusSystemAchieved)}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ width: "100%", borderStyle: "dashed" }} />
            </Grid>
          </Grid>
          <StyledEbitdaGridTableContainer container xs={12} gap={1}>
            <StyledGridTableContainer container item xs={3}>
              <StyledInnerGridTableContainer item xs={12}>
                <StyledInnerGridTableHeadingTypography>
                  {messages?.measure?.financialOverview?.ebidta?.title}
                </StyledInnerGridTableHeadingTypography>
              </StyledInnerGridTableContainer>
              <StyledInnerGridDashedTableContainer item xs={12}>
                <StyledInnerGridTableBoldTypography>
                  {messages?.measure?.financialOverview?.ebidta?.ebitda}
                </StyledInnerGridTableBoldTypography>
                <StyledInnerGridTableBoldTypography>
                  {
                    messages?.measure?.financialOverview?.ebidta
                      ?.ebitdaPercentage
                  }
                </StyledInnerGridTableBoldTypography>
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={12}
                noBackgroundColor={true}
              ></StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer item xs={12}>
                <StyledInnerGridTableBoldTypography>
                  {
                    messages?.measure?.financialOverview?.ebidta
                      ?.teamEbitdaAtHurdle
                  }
                </StyledInnerGridTableBoldTypography>
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={12}
                noBackgroundColor={true}
              ></StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer item xs={12}>
                <StyledInnerGridTableBoldTypography>
                  {
                    messages?.measure?.financialOverview?.ebidta
                      ?.bonusPoolAvailable
                  }
                </StyledInnerGridTableBoldTypography>
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={12}
                noBackgroundColor={true}
              ></StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer item xs={12}>
                <StyledInnerGridTableBoldTypography>
                  {
                    messages?.measure?.financialOverview?.ebidta
                      ?.teamBonusAchieved
                  }
                </StyledInnerGridTableBoldTypography>
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
                  {messages?.measure?.financialOverview?.ebidta?.distribution}
                </StyledInnerGridTableBoldTypography>
                <StyledInnerGridTableNormalTypography hasMarginLeft={true}>
                  {messages?.measure?.financialOverview?.ebidta?.seniorClient}
                </StyledInnerGridTableNormalTypography>
                <StyledInnerGridTableNormalTypography hasMarginLeft={true}>
                  {messages?.measure?.financialOverview?.ebidta?.production}
                </StyledInnerGridTableNormalTypography>
                <StyledInnerGridTableNormalTypography hasMarginLeft={true}>
                  {messages?.measure?.financialOverview?.ebidta?.admin}
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
                <StyledInnerGridTableBoldTypography>
                  {formatCurrency(totalEbitda)}
                </StyledInnerGridTableBoldTypography>
                <StyledInnerGridTableBoldTypography>
                  {totalEbitdaPercentage ? totalEbitdaPercentage : "-"}
                </StyledInnerGridTableBoldTypography>
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={12}
                noBackgroundColor={true}
              ></StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer item xs={12}>
                <StyledInnerGridTableBoldTypography>
                  {totalEbitdaHurdle && isAchieved
                    ? formatCurrency(totalEbitdaHurdle)
                    : "-"}
                </StyledInnerGridTableBoldTypography>
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={12}
                noBackgroundColor={true}
              ></StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer item xs={12}>
                <StyledInnerGridTableBoldTypography>
                  {totalBonusPoolAvailable && isAchieved
                    ? formatCurrency(totalBonusPoolAvailable)
                    : "-"}
                </StyledInnerGridTableBoldTypography>
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={12}
                noBackgroundColor={true}
              ></StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer item xs={12}>
                <StyledInnerGridTableBoldTypography>
                  {totalBonusAchieved && totalBonusAchieved !== "-"
                    ? formatCurrency(totalBonusAchieved)
                    : "-"}
                </StyledInnerGridTableBoldTypography>
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
                  {totalScmBonus && totalScmBonus !== "-" && isAchieved
                    ? formatCurrency(totalScmBonus)
                    : "-"}
                </StyledInnerGridTableNormalTypography>
                <StyledInnerGridTableNormalTypography>
                  {totalProductionBonus &&
                  totalProductionBonus !== "-" &&
                  isAchieved
                    ? formatCurrency(totalProductionBonus)
                    : "-"}
                </StyledInnerGridTableNormalTypography>
                <StyledInnerGridTableNormalTypography>
                  {totalAdminTeamBonus &&
                  totalAdminTeamBonus !== "-" &&
                  isAchieved
                    ? formatCurrency(totalAdminTeamBonus)
                    : "-"}
                </StyledInnerGridTableNormalTypography>
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
              {ebitdaEntity?.map((entity) => {
                const salary = twoSumFunction(
                  entity?.wages,
                  twoSubtractFunction(
                    entity?.ownerMarketSalary,
                    entity?.ownerWithdrawalSalary
                  )
                );
                const totalCogs = addAnyNumberOfValues(
                  Number(salary),
                  entity?.directExpenses,
                  entity?.otherDirectExpenses
                );
                const grossProfit = twoSubtractFunction(
                  entity?.revenue,
                  totalCogs
                );

                const ebitda = twoSubtractFunction(
                  grossProfit,
                  entity?.overhead
                );
                const ebitdaPercentage = nullablePlaceHolder(
                  percentageCalculatorFunction(ebitda, entity?.revenue)
                );
                let ebitdaHurdle: string | number;
                let bonusAchieved: string | number;
                let scmBonus: string | number;
                let productionBonus: string | number;
                let adminBonus: string | number;
                let bonusPoolAvailable: string | number;
                if (isAchieved) {
                  ebitdaHurdle = nullablePlaceHolder(
                    calculatePercentageOf(
                      entity?.revenue,
                      Number(formValues?.ebitdaPerTeam?.value)
                    )
                  );
                  bonusPoolAvailable = twoSubtractFunction(
                    ebitda,
                    ebitdaHurdle
                  );
                  bonusAchieved = calculatePercentageOf(
                    bonusPoolAvailable,
                    getDiscountPercentage(
                      ebitdaThresholdEntity?.records,
                      ebitdaBonusEntity?.teamEbitaThresholdPercentage
                    )
                  );
                  if (ebitdaBonusEntity?.scmBonusPercentage) {
                    scmBonus = calculatePercentageOf(
                      bonusAchieved,
                      ebitdaBonusEntity?.scmBonusPercentage
                    );
                  }
                  if (ebitdaBonusEntity?.productionTeamBonusPercentage) {
                    productionBonus = calculatePercentageOf(
                      bonusAchieved,
                      ebitdaBonusEntity?.productionTeamBonusPercentage
                    );
                  }
                  if (ebitdaBonusEntity?.adminTeamBonusPercentage) {
                    adminBonus = calculatePercentageOf(
                      bonusAchieved,
                      ebitdaBonusEntity?.adminTeamBonusPercentage
                    );
                  }
                }
                return (
                  <Grid
                    container
                    item
                    xs
                    minWidth="210px"
                    flexGrow={1}
                    key={entity?.id}
                  >
                    <StyledInnerGridTableContainer container item xs={12}>
                      <StyledInnerGridTableHeadingTypography>
                        {entity?.teamName}
                      </StyledInnerGridTableHeadingTypography>
                    </StyledInnerGridTableContainer>
                    <StyledInnerGridDashedTableContainer container item xs={12}>
                      <StyledEntityTableTextTypography>
                        {formatCurrency(ebitda)}
                      </StyledEntityTableTextTypography>
                      <StyledEntityTableTextTypography>
                        {nullablePlaceHolder(ebitdaPercentage)}
                      </StyledEntityTableTextTypography>
                    </StyledInnerGridDashedTableContainer>
                    <StyledInnerGridDashedTableContainer
                      item
                      xs={12}
                      noBackgroundColor={true}
                    ></StyledInnerGridDashedTableContainer>
                    <StyledInnerGridDashedTableContainer
                      container
                      item
                      xs={12}
                      gap={1}
                    >
                      <StyledEntityTableTextTypography>
                        {ebitdaHurdle !== "-" && ebitdaHurdle
                          ? formatCurrency(ebitdaHurdle)
                          : "-"}
                      </StyledEntityTableTextTypography>
                    </StyledInnerGridDashedTableContainer>
                    <StyledInnerGridDashedTableContainer
                      item
                      xs={12}
                      noBackgroundColor={true}
                    ></StyledInnerGridDashedTableContainer>
                    <StyledInnerGridDashedTableContainer
                      container
                      item
                      xs={12}
                      gap={1}
                    >
                      <StyledEntityTableTextTypography>
                        {formatCurrency(bonusPoolAvailable)}
                      </StyledEntityTableTextTypography>
                    </StyledInnerGridDashedTableContainer>
                    <StyledInnerGridDashedTableContainer
                      item
                      xs={12}
                      noBackgroundColor={true}
                    ></StyledInnerGridDashedTableContainer>
                    <StyledInnerGridDashedTableContainer
                      container
                      item
                      xs={12}
                      gap={1}
                    >
                      <StyledEntityTableTextTypography>
                        {formatCurrency(bonusAchieved)}
                      </StyledEntityTableTextTypography>
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
                      <StyledEntityTableTextTypography>
                        {formatCurrency(scmBonus)}
                      </StyledEntityTableTextTypography>
                      <StyledEntityTableTextTypography>
                        {formatCurrency(productionBonus)}
                      </StyledEntityTableTextTypography>
                      <StyledEntityTableTextTypography>
                        {formatCurrency(adminBonus)}
                      </StyledEntityTableTextTypography>
                    </StyledInnerGridDashedTableContainer>
                  </Grid>
                );
              })}
            </StyledGridTableContainer>
          </StyledEbitdaGridTableContainer>
        </>
      ) : (
        <StyledNoMVVInfoContainer>
          <StyledNoDataInfo>
            {messages?.measure?.financialOverview?.ebidta?.noPlanHeading}
          </StyledNoDataInfo>
        </StyledNoMVVInfoContainer>
      )}
      <Modal
        show={createPlanFormVisibility}
        heading={
          messages?.measure?.financialOverview?.ebidta?.planForm?.heading
        }
        onClose={() => {
          refreshOptions();
          hideCreatePlanForm();
        }}
        fitContent
      >
        <EbitdaPlanForm
          onCancel={hideCreatePlanForm}
          onSuccess={() => {
            hideCreatePlanForm();
          }}
        />
      </Modal>
      <Modal
        show={ebitdaThresholdPlanFormVisibility}
        heading={
          messages?.measure?.financialOverview?.ebidta?.ebitdaThresholdForm
            ?.heading
        }
        onClose={() => {
          hideEbitdaThresholdPlanForm();
          applyFilters();
        }}
        fitContent
      >
        <EbitdaThresholdForm
          onCancel={hideEbitdaThresholdPlanForm}
          onSuccess={() => {
            hideEbitdaThresholdPlanForm();
          }}
          ebidtaId={planEntity?.planEbitaId}
        />
      </Modal>
      <Modal
        show={bonusSystemNotesVisibility}
        heading={
          messages?.measure?.financialOverview?.ebidta?.bonusSystemNotesForm
            ?.heading
        }
        fitContent
        onClose={bonusSystemNotesHidePopup}
        maxWidth="1000px"
      >
        <BonusSystemNotes />
      </Modal>
    </Container>
  );
};

export default EbitdaBonus;
