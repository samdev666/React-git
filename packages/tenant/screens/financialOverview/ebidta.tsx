import React, { useEffect, useState } from "react";
import { Container } from "../../components";
import { StyledMainHeadingContainer } from "@wizehub/components/detailPageWrapper/styles";
import { StyledBudgestAndCapacityLeftHeadingContainer } from "../plan/budgetAndCapacity/styles";
import { StyledHeadingTypography } from "../profile/styles";
import messages from "../../messages";
import { Box, Grid, Typography } from "@mui/material";
import {
  Button,
  MaterialAutocompleteInput,
  Modal,
  Toast,
} from "@wizehub/components";
import { ResponsiveDayViewIcon } from "../plan/budgetAndCapacity/budgetAndCapacity";
import {
  useEntity,
  useFormReducer,
  useOptions,
  usePopupReducer,
} from "@wizehub/common/hooks";
import {
  ResponsiveEditIcon,
  ResponsiveSyncIcon,
} from "../systemPreferences/launchPadSetup/launchPadSetupDetail";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import {
  StyledNoDataInfo,
  StyledNoDataInfoContainer,
  StyledResponsiveIcon,
} from "@wizehub/components/table/styles";
import {
  StyledEbitdaGridTableContainer,
  StyledEditIconContainer,
  StyledEntityPercentageTableTextTypography,
  StyledEntityTableTextTypography,
  StyledGridTableContainer,
  StyledInnerGridDashedColouredTableContainer,
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
  EbitdaEntity,
  LockupPlanEntity,
  PlanEntity,
} from "@wizehub/common/models/genericEntities";
import {
  ADD_PLAN,
  EBIDTA_RESYNC_TEAM,
  EBITDA_LISTING_API,
  EBITDA_PLAN_LISTING_API,
} from "../../api";
import { useSelector } from "react-redux";
import { ReduxState } from "../../redux/reducers";
import {
  addAnyNumberOfValues,
  formatCurrency,
  HttpMethods,
  mapIdNameToOptionWithTitleWithoutCaptializing,
  nullablePlaceHolder,
  totalValueMethod,
} from "@wizehub/common/utils";
import {
  percentageCalculatorFunction,
  twoSubtractFunction,
  twoSumFunction,
} from "../plan/budgetAndCapacity/budgetAndCapacityFormula";
import WriteUpForm from "./writeUpForm";
import OverheadAllocationForm from "./overheadAllocationForm";
import EditTeamDetailsForm from "./editTeamDetailsForm";
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
import {
  StyledNoMVVInfo,
  StyledNoMVVInfoContainer,
} from "../firmProfile/styles";

export const ResponsiveCurrencyExchangeIcon =
  StyledResponsiveIcon(CurrencyExchangeIcon);

export const ResponsiveDollarIcon = StyledResponsiveIcon(AttachMoneyIcon);

const Ebidta = () => {
  const { tenantData, firmProfile } = useSelector((state: ReduxState) => state);
  const [openDatePicker, setOpenDatePicker] = useState<boolean>(false);
  const { tenantId } = tenantData;
  const [ebitdaEntity, setEbitdaEntity] = useState<Array<EbitdaEntity>>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [endMonth, setEndMonth] = useState<number>(
    moment().subtract(1, "months").month() + 1
  );
  const previousMonth = moment().subtract(1, "months").month();
  const reduxDispatch = useDispatch();
  const { connectField, formValues, change } = useFormReducer();
  const {
    visibility: createPlanFormVisibility,
    showPopup: showCreatePlanForm,
    hidePopup: hideCreatePlanForm,
  } = usePopupReducer<UserActionConfig>();

  const {
    visibility: editWriteUpFormVisibility,
    showPopup: showWriteUpForm,
    hidePopup: hideWriteUpForm,
    metaData: writeUpFormConfig,
  } = usePopupReducer<{
    ebidtaTeamId: Id;
  }>();

  const {
    visibility: editOverheadAllocationFormVisibility,
    showPopup: showEditOverheadAllocationForm,
    hidePopup: hideEditOverheadAllocationForm,
  } = usePopupReducer<UserActionConfig>();

  const {
    visibility: editTeamDetailsFormVisibility,
    showPopup: showEditTeamDetailForm,
    hidePopup: hideEditTeamDetailsForm,
    metaData: teamDetailsFormConfig,
  } = usePopupReducer<{
    ebitdaId: Id;
    ebitaTeamId: Id;
  }>();

  const { options: planOptions, refreshOptions } = useOptions<LockupPlanEntity>(
    EBITDA_PLAN_LISTING_API.replace(":tenantId", tenantId),
    true
  );

  const { entity: planEntity, refreshEntity: refreshPlanEntity } =
    useEntity<PlanEntity>(
      ADD_PLAN,
      planOptions.filter(
        (planId) => planId?.id === formValues?.plan?.value?.id
      )[0]?.plan?.id
    );

  useEffect(() => {
    if (planEntity) {
      reduxDispatch(showLoader());
      const filterMonths = Array.from(
        { length: endMonth - firmProfile?.financialYearStartMonth + 1 },
        (_, i) => firmProfile?.financialYearStartMonth + i
      ).join(",");
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
  }, [planEntity, refresh, endMonth]);

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

  const handleResyncEbidtaTeam = async () => {
    const sanitizedBody = {
      tenantId: tenantId,
      ebitaId: planEntity?.planEbitaId,
    };
    return new Promise((resolve, reject) => {
      reduxDispatch(
        apiCall(
          EBIDTA_RESYNC_TEAM,
          resolve,
          reject,
          HttpMethods.POST,
          sanitizedBody
        )
      );
    })
      .then(() => {
        setRefresh((prev) => !prev);
        toast(
          <Toast text={messages?.measure?.financialOverview?.ebidta?.success} />
        );
      })
      .catch((error) => {
        toast(
          <Toast
            text={
              messages?.measure?.financialOverview?.ebidta?.error
                ?.serverError?.[error?.message]
            }
          />
        );
      });
  };

  const totalRevenue = totalValueMethod(ebitdaEntity, "revenue");

  const totalWages = totalValueMethod(ebitdaEntity, "wages");
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

  const totalDirectExpenses = totalValueMethod(ebitdaEntity, "directExpenses");

  const totalIndirectExpenses = totalValueMethod(
    ebitdaEntity,
    "otherDirectExpenses"
  );

  const totalCostOfGoodsSold = addAnyNumberOfValues(
    Number(totalSalary),
    totalDirectExpenses,
    totalIndirectExpenses
  );

  const totalWriteOnAndOff = totalValueMethod(ebitdaEntity, "writeOnOff");

  const salaryPercentage = percentageCalculatorFunction(
    totalSalary,
    totalRevenue
  );

  const totalCostOfGoodsSoldPercentage = percentageCalculatorFunction(
    totalCostOfGoodsSold,
    totalRevenue
  );

  const totalGrossProfit = twoSubtractFunction(
    totalRevenue,
    totalCostOfGoodsSold
  );

  const totalOverhead = totalValueMethod(ebitdaEntity, "overhead");

  const totalEbitda = twoSubtractFunction(totalGrossProfit, totalOverhead);

  const handleOverheadAllocation = () => {
    return ebitdaEntity
      ?.map((entity) => {
        // if (entity?.revenue === null) {
        //   return;
        // }
        return {
          teamId: entity?.id,
          totalRevenue: totalRevenue,
          teamRevenue: entity?.revenue,
          teamMembers: entity?.employees,
        };
      })
      // .filter((entity) => entity); //This check is for removing teams with null revenue
  };

  const handleTeam = () => {
    return ebitdaEntity?.map((entity) => {
      return {
        id: entity?.id,
        label: entity?.teamName,
      };
    });
  };

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
            startIcon={<ResponsiveDollarIcon />}
            variant="outlined"
            color="secondary"
            label={
              messages?.measure?.financialOverview?.ebidta?.distributeBonus
            }
            onClick={() =>
              reduxDispatch(push(routes.financialOverview.ebitdaBonus))
            }
          />
          <Button
            startIcon={<ResponsiveSyncIcon />}
            variant="outlined"
            color="secondary"
            label={messages?.measure?.financialOverview?.ebidta?.resyncTeam}
            onClick={() => handleResyncEbidtaTeam()}
          />
          <Button
            startIcon={<ResponsiveCurrencyExchangeIcon />}
            variant="contained"
            color="primary"
            label={
              messages?.measure?.financialOverview?.ebidta?.overheadAllocation
            }
            onClick={() => showEditOverheadAllocationForm()}
          />
        </StyledMainHeadingEbitdaButtonContainer>
      </StyledMainHeadingContainer>
      {ebitdaEntity?.length ? (
        <StyledEbitdaGridTableContainer container xs={12} gap={1}>
          <StyledGridTableContainer container item xs={3}>
            <StyledInnerGridTableContainer item xs={12}>
              <StyledInnerGridTableHeadingTypography>
                {messages?.measure?.financialOverview?.ebidta?.title}
              </StyledInnerGridTableHeadingTypography>
            </StyledInnerGridTableContainer>
            <StyledInnerGridDashedTableContainer item xs={12}>
              <StyledInnerGridTableBoldTypography>
                {messages?.measure?.financialOverview?.ebidta?.revenue}
              </StyledInnerGridTableBoldTypography>
            </StyledInnerGridDashedTableContainer>
            <StyledInnerGridDashedTableContainer
              item
              xs={12}
              noBackgroundColor={true}
            ></StyledInnerGridDashedTableContainer>
            <StyledInnerGridDashedTableContainer item xs={12}>
              <StyledInnerGridTableBoldTypography>
                {messages?.measure?.financialOverview?.ebidta?.costOfGoodsSold}
              </StyledInnerGridTableBoldTypography>
              <StyledInnerGridTableNormalTypography hasMarginLeft={true}>
                {messages?.measure?.financialOverview?.ebidta?.salaries}
              </StyledInnerGridTableNormalTypography>
              <StyledInnerGridTableNormalTypography hasMarginLeft={true}>
                {messages?.measure?.financialOverview?.ebidta?.directExpenses}
              </StyledInnerGridTableNormalTypography>
              <StyledInnerGridTableNormalTypography hasMarginLeft={true}>
                {
                  messages?.measure?.financialOverview?.ebidta
                    ?.otherDirectExpenses
                }
              </StyledInnerGridTableNormalTypography>
            </StyledInnerGridDashedTableContainer>
            <StyledInnerGridDashedColouredTableContainer item xs={12}>
              <StyledInnerGridTableBoldTypography>
                {
                  messages?.measure?.financialOverview?.ebidta
                    ?.totalCostOfGoodsSold
                }
              </StyledInnerGridTableBoldTypography>
            </StyledInnerGridDashedColouredTableContainer>
            <StyledInnerGridDashedTableContainer
              item
              xs={12}
              noBackgroundColor={true}
            ></StyledInnerGridDashedTableContainer>
            <StyledInnerGridDashedTableContainer item xs={12}>
              <StyledInnerGridTableBoldTypography>
                {
                  messages?.measure?.financialOverview?.ebidta
                    ?.salariesPercentage
                }
              </StyledInnerGridTableBoldTypography>
              <StyledInnerGridTableBoldTypography>
                {`${messages?.measure?.financialOverview?.ebidta?.totalCostOfGoodsSold} %`}
              </StyledInnerGridTableBoldTypography>
            </StyledInnerGridDashedTableContainer>
            <StyledInnerGridDashedTableContainer
              item
              xs={12}
              noBackgroundColor={true}
            ></StyledInnerGridDashedTableContainer>
            <StyledInnerGridDashedTableContainer item xs={12}>
              <StyledInnerGridTableBoldTypography>
                {messages?.measure?.financialOverview?.ebidta?.grossProfit}
              </StyledInnerGridTableBoldTypography>
            </StyledInnerGridDashedTableContainer>
            <StyledInnerGridDashedTableContainer
              item
              xs={12}
              noBackgroundColor={true}
            ></StyledInnerGridDashedTableContainer>
            <StyledInnerGridDashedTableContainer item xs={12}>
              <StyledInnerGridTableBoldTypography>
                {messages?.measure?.financialOverview?.ebidta?.ytdOverhead}
              </StyledInnerGridTableBoldTypography>
            </StyledInnerGridDashedTableContainer>
            <StyledInnerGridDashedTableContainer
              item
              xs={12}
              noBackgroundColor={true}
            ></StyledInnerGridDashedTableContainer>
            <StyledInnerGridDashedTableContainer item xs={12}>
              <StyledInnerGridTableBoldTypography>
                {messages?.measure?.financialOverview?.ebidta?.ebitda}
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
                {messages?.measure?.financialOverview?.ebidta?.writeOns}
              </StyledInnerGridTableBoldTypography>
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
                {formatCurrency(totalRevenue)}
              </StyledInnerGridTableBoldTypography>
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
                {formatCurrency(totalSalary)}
              </StyledInnerGridTableNormalTypography>
              <StyledInnerGridTableNormalTypography>
                {formatCurrency(totalDirectExpenses)}
              </StyledInnerGridTableNormalTypography>
              <StyledInnerGridTableNormalTypography>
                {formatCurrency(totalIndirectExpenses)}
              </StyledInnerGridTableNormalTypography>
            </StyledInnerGridDashedTableContainer>
            <StyledInnerGridDashedColouredTableContainer item xs={12}>
              <StyledInnerGridTableBoldTypography>
                {formatCurrency(totalCostOfGoodsSold)}
              </StyledInnerGridTableBoldTypography>
            </StyledInnerGridDashedColouredTableContainer>
            <StyledInnerGridDashedTableContainer
              item
              xs={12}
              noBackgroundColor={true}
            ></StyledInnerGridDashedTableContainer>
            <StyledInnerGridDashedTableContainer item xs={12}>
              <StyledInnerGridTableBoldTypography>
                {salaryPercentage !== "-" ? `(${salaryPercentage}%)` : "-"}
              </StyledInnerGridTableBoldTypography>
              <StyledInnerGridTableBoldTypography>
                {totalCostOfGoodsSoldPercentage !== "-"
                  ? `(${totalCostOfGoodsSoldPercentage}%)`
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
                {formatCurrency(totalGrossProfit)}
              </StyledInnerGridTableBoldTypography>
            </StyledInnerGridDashedTableContainer>
            <StyledInnerGridDashedTableContainer
              item
              xs={12}
              noBackgroundColor={true}
            ></StyledInnerGridDashedTableContainer>
            <StyledInnerGridDashedTableContainer item xs={12}>
              <StyledInnerGridTableBoldTypography>
                {formatCurrency(totalOverhead)}
              </StyledInnerGridTableBoldTypography>
            </StyledInnerGridDashedTableContainer>
            <StyledInnerGridDashedTableContainer
              item
              xs={12}
              noBackgroundColor={true}
            ></StyledInnerGridDashedTableContainer>
            <StyledInnerGridDashedTableContainer item xs={12}>
              <StyledInnerGridTableBoldTypography>
                {formatCurrency(totalEbitda)}
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
                {formatCurrency(totalWriteOnAndOff, false)}
              </StyledInnerGridTableBoldTypography>
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
              const teamSalaryPercentage = percentageCalculatorFunction(
                Number(salary),
                entity?.revenue
              );
              const totalCogsPercentage = percentageCalculatorFunction(
                totalCogs,
                entity?.revenue
              );
              const grossProfit = twoSubtractFunction(
                entity?.revenue,
                totalCogs
              );
              const grossProfitPercentage = nullablePlaceHolder(
                percentageCalculatorFunction(grossProfit,totalGrossProfit)
              );
              const overheadPercentage = "-";

              const ebitda = nullablePlaceHolder(
                twoSubtractFunction(grossProfit, entity?.overhead)
              );
              const ebitdaPercentage = nullablePlaceHolder(
                percentageCalculatorFunction(ebitda, totalEbitda)
              );
              return (
                <Grid
                  container
                  item
                  xs
                  minWidth="210px"
                  flexGrow={1}
                  key={entity?.id}
                >
                  <StyledInnerGridTableContainer
                    container
                    item
                    xs={12}
                    hasMoreColumn={true}
                  >
                    <StyledInnerGridTableHeadingTypography>
                      {entity?.teamName}
                    </StyledInnerGridTableHeadingTypography>
                    <StyledEditIconContainer
                      onClick={() =>
                        showEditTeamDetailForm({
                          ebitdaId: planEntity?.planEbitaId,
                          ebitaTeamId: entity?.id,
                        })
                      }
                    >
                      <ResponsiveEditIcon />
                    </StyledEditIconContainer>
                  </StyledInnerGridTableContainer>
                  <StyledInnerGridDashedTableContainer
                    container
                    item
                    xs={12}
                    hasMoreColumn={true}
                  >
                    <Grid item xs>
                      <StyledEntityTableTextTypography>
                        {formatCurrency(entity?.revenue)}
                      </StyledEntityTableTextTypography>
                    </Grid>
                    <Grid item xs={6}>
                      <StyledEntityPercentageTableTextTypography>
                        {entity?.revenue
                          ? `(${percentageCalculatorFunction(
                              entity?.revenue,
                              totalRevenue
                            )}%)`
                          : ""}
                      </StyledEntityPercentageTableTextTypography>
                    </Grid>
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
                    <StyledEntityTableTextTypography>
                      {formatCurrency(salary)}
                    </StyledEntityTableTextTypography>
                    <StyledEntityTableTextTypography>
                      {formatCurrency(entity?.directExpenses)}
                    </StyledEntityTableTextTypography>
                    <StyledEntityTableTextTypography>
                      {formatCurrency(entity?.otherDirectExpenses)}
                    </StyledEntityTableTextTypography>
                  </StyledInnerGridDashedTableContainer>
                  <StyledInnerGridDashedColouredTableContainer item xs={12}>
                    <StyledEntityTableTextTypography>
                      {formatCurrency(totalCogs)}
                    </StyledEntityTableTextTypography>
                  </StyledInnerGridDashedColouredTableContainer>
                  <StyledInnerGridDashedTableContainer
                    item
                    xs={12}
                    noBackgroundColor={true}
                  ></StyledInnerGridDashedTableContainer>
                  <StyledInnerGridDashedTableContainer item xs={12}>
                    <StyledEntityTableTextTypography>
                      {teamSalaryPercentage !== "-"
                        ? `(${teamSalaryPercentage}%)`
                        : "-"}
                    </StyledEntityTableTextTypography>
                    <StyledEntityTableTextTypography>
                      {totalCogsPercentage !== "-"
                        ? `(${totalCogsPercentage}%)`
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
                    hasMoreColumn={true}
                  >
                    <Grid item xs={6}>
                      <StyledEntityTableTextTypography>
                        {formatCurrency(grossProfit)}
                      </StyledEntityTableTextTypography>
                    </Grid>
                    <Grid item xs={6}>
                      <StyledEntityPercentageTableTextTypography>
                        {grossProfitPercentage !== "-"
                          ? `(${grossProfitPercentage}%)`
                          : ""}
                      </StyledEntityPercentageTableTextTypography>
                    </Grid>
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
                    hasMoreColumn={true}
                    gap={1}
                  >
                    <StyledEntityTableTextTypography>
                      {formatCurrency(entity?.overhead)}
                    </StyledEntityTableTextTypography>
                    <StyledEntityPercentageTableTextTypography>
                      {overheadPercentage !== "-"
                        ? `(${overheadPercentage}%)`
                        : ""}
                    </StyledEntityPercentageTableTextTypography>
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
                    hasMoreColumn={true}
                  >
                    <Grid item xs>
                      <StyledEntityTableTextTypography>
                        {formatCurrency(ebitda)}
                      </StyledEntityTableTextTypography>
                    </Grid>
                    <Grid item xs={6}>
                      <StyledEntityPercentageTableTextTypography>
                        {ebitdaPercentage !== "-"
                          ? `(${ebitdaPercentage}%)`
                          : ""}
                      </StyledEntityPercentageTableTextTypography>
                    </Grid>
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
                    isBottomColumn={true}
                    gap={1}
                  >
                    <StyledEntityTableTextTypography>
                      {formatCurrency(entity?.writeOnOff, false)}
                    </StyledEntityTableTextTypography>
                    <StyledEditIconContainer
                      onClick={() =>
                        showWriteUpForm({
                          ebidtaTeamId: entity?.id,
                        })
                      }
                    >
                      <ResponsiveEditIcon />
                    </StyledEditIconContainer>
                  </StyledInnerGridDashedTableContainer>
                </Grid>
              );
            })}
          </StyledGridTableContainer>
        </StyledEbitdaGridTableContainer>
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
        show={editWriteUpFormVisibility}
        heading={messages?.measure?.financialOverview?.ebidta?.writeUp}
        onClose={hideWriteUpForm}
        fitContent
      >
        <WriteUpForm
          onCancel={hideWriteUpForm}
          onSuccess={() => {
            hideWriteUpForm();
            setRefresh((prev) => !prev);
          }}
          ebidtaTeamId={writeUpFormConfig?.ebidtaTeamId}
          ebitaId={planEntity?.planEbitaId}
        />
      </Modal>
      <Modal
        show={editOverheadAllocationFormVisibility}
        heading={
          messages?.measure?.financialOverview?.ebidta?.overheadAllocationForm
            ?.editOverheadAllocation
        }
        onClose={hideEditOverheadAllocationForm}
        fitContent
        maxWidth="1000px"
      >
        <OverheadAllocationForm
          onCancel={hideEditOverheadAllocationForm}
          onSuccess={() => {
            hideEditOverheadAllocationForm();
            setRefresh((prev) => !prev);
          }}
          ebidtaId={planEntity?.planEbitaId}
          teamwiseAllocation={handleOverheadAllocation()}
          teamOptions={handleTeam()}
        />
      </Modal>
      <Modal
        show={editTeamDetailsFormVisibility}
        heading={messages?.measure?.financialOverview?.ebidta?.editForm?.edit}
        onClose={hideEditTeamDetailsForm}
        fitContent
        maxWidth="1000px"
      >
        <EditTeamDetailsForm
          onCancel={hideEditTeamDetailsForm}
          onSuccess={() => {
            hideEditTeamDetailsForm();
            setRefresh((prev) => !prev);
          }}
          ebidtaId={teamDetailsFormConfig?.ebitdaId}
          ebidtaTeamId={teamDetailsFormConfig?.ebitaTeamId}
        />
      </Modal>
    </Container>
  );
};

export default Ebidta;
