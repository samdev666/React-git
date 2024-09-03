import React, { useEffect, useState } from "react";
import moment, { Moment } from "moment";
import { Container } from "../../components";
import {
  StyledHeadingTypography,
  StyledMainHeadingButtonContainer,
  StyledMainHeadingContainer,
} from "@wizehub/components/detailPageWrapper/styles";
import { StyledBudgestAndCapacityLeftHeadingContainer } from "../plan/budgetAndCapacity/styles";
import { Grid } from "@mui/material";
import {
  Button,
  CustomTabs,
  MaterialAutocompleteInput,
  Modal,
} from "@wizehub/components";
import messages from "../../messages";
import { useFormReducer, useOptions } from "@wizehub/common/hooks";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { StyledResponsiveIcon } from "@wizehub/components/table/styles";
import {
  Fab5LockupEntity,
  Fab5NpsEntity,
  Fab5ProfitabilityEntity,
  Fab5RevnueEntity,
  Fab5SalesEntity,
  PlanEntity,
} from "@wizehub/common/models/genericEntities";
import {
  FAB5_LOCKUP_LISTING_API,
  FAB5_NPS_LISTING_API,
  FAB5_PROFITABILITY_LISTING_API,
  FAB5_REVENUE_LISTING_API,
  FAB5_SALES_LISTING_API,
  PLAN_LISTING_API,
} from "../../api";
import { useSelector } from "react-redux";
import { ReduxState } from "../../redux/reducers";
import HorizontalSplitOutlinedIcon from "@mui/icons-material/HorizontalSplitOutlined";
import VerticalSplitOutlinedIcon from "@mui/icons-material/VerticalSplitOutlined";
import HorizontalView from "./horizontalView";
import { apiCall } from "../../redux/actions";
import { useDispatch } from "react-redux";
import VerticalView from "./verticalView";
import { push } from "connected-react-router";
import { routes } from "../../utils";
import Matrix from "./matrix";
import {
  StyledPeriodTypography,
  StyledStaticDatePicker,
} from "../financialOverview/styles";
import { Months } from "@wizehub/common/models/modules";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useHistory } from "react-router-dom";

export const ResponsiveViewIcon = StyledResponsiveIcon(
  RemoveRedEyeOutlinedIcon
);

const fab5ModuleTabs = [
  {
    id: "fab5",
    label: messages?.measure?.fab5?.heading,
  },
  {
    id: "matrix",
    label: messages?.measure?.fab5?.matrix,
  },
];

const fab5ModuleIconTabs = [
  {
    id: "horizontal",
    label: <HorizontalSplitOutlinedIcon />,
  },
  {
    id: "vertical",
    label: <VerticalSplitOutlinedIcon />,
  },
];

const Fab5Module = () => {
  const { tenantData, firmProfile } = useSelector((state: ReduxState) => state);
  const { tenantId } = tenantData;
  const history = useHistory();
  const reduxDispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<"fab5" | "matrix">("fab5");
  const [activeFab5Tab, setActiveFab5Tab] = useState<"horizontal" | "vertical">(
    "horizontal"
  );
  const [endMonth, setEndMonth] = useState<number>(
    moment().subtract(1, "months").month() + 1
  );
  const { connectField, formValues, change, submitting, handleSubmit } =
    useFormReducer();

  const { options: planOptions, refreshOptions } = useOptions<PlanEntity>(
    PLAN_LISTING_API.replace(":tenantId", tenantId),
    true
  );

  useEffect(() => {
    if (!formValues?.plan?.value?.id && planOptions.length > 0) {
      change("plan", {
        id: planOptions[0]?.id,
        label: planOptions[0]?.name,
      });
    }
  }, [planOptions]);

  const [revenueEntity, setRevenueEntity] = useState<Array<Fab5RevnueEntity>>(
    []
  );
  const [profitabilityEntity, setProfitabilityEntity] = useState<
    Array<Fab5ProfitabilityEntity>
  >([]);
  const [lockupEntity, setLockupEntity] = useState<Array<Fab5LockupEntity>>([]);
  const [salesEntity, setSalesEntity] = useState<Array<Fab5SalesEntity>>([]);
  const [npsEntity, setNpsEntity] = useState<Array<Fab5NpsEntity>>([]);
  const [openDatePicker, setOpenDatePicker] = useState<boolean>(false);

  const previousMonth = moment().subtract(1, "months").month();

  useEffect(() => {
    if (formValues?.plan?.value?.id || firmProfile?.financialYearStartMonth) {
      const filterMonths = Array.from(
        { length: endMonth - firmProfile?.financialYearStartMonth + 1 },
        (_, i) => firmProfile?.financialYearStartMonth + i
      ).join(",");
      reduxDispatch(
        apiCall(
          `${FAB5_REVENUE_LISTING_API.replace(":tenantId", tenantId).replace(
            ":planId",
            formValues?.plan?.value?.id?.toString()
          )}?filter[months]=${filterMonths}`,
          (resolve) => {
            setRevenueEntity(resolve);
          },
          (reject) => {}
        )
      );
      reduxDispatch(
        apiCall(
          `${FAB5_PROFITABILITY_LISTING_API.replace(
            ":tenantId",
            tenantId
          ).replace(
            ":planId",
            formValues?.plan?.value?.id?.toString()
          )}?filter[months]=${filterMonths}`,
          (resolve) => {
            setProfitabilityEntity(resolve);
          },
          (reject) => {}
        )
      );
      reduxDispatch(
        apiCall(
          `${FAB5_LOCKUP_LISTING_API.replace(":tenantId", tenantId).replace(
            ":planId",
            formValues?.plan?.value?.id?.toString()
          )}?filter[months]=${filterMonths}`,
          (resolve) => {
            setLockupEntity(resolve);
          },
          (reject) => {}
        )
      );
      reduxDispatch(
        apiCall(
          `${FAB5_SALES_LISTING_API.replace(":tenantId", tenantId).replace(
            ":planId",
            formValues?.plan?.value?.id?.toString()
          )}?filter[months]=${filterMonths}`,
          (resolve) => {
            setSalesEntity(resolve);
          },
          (reject) => {}
        )
      );
      reduxDispatch(
        apiCall(
          `${FAB5_NPS_LISTING_API.replace(":tenantId", tenantId).replace(
            ":planId",
            formValues?.plan?.value?.id?.toString()
          )}?filter[months]=${filterMonths}`,
          (resolve) => {
            setNpsEntity(resolve);
          },
          (reject) => {}
        )
      );
    }
  }, [
    formValues?.plan?.value?.id,
    endMonth,
    firmProfile?.financialYearStartMonth,
  ]);

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

  return (
    <Container noPadding>
      <StyledMainHeadingContainer>
        <StyledBudgestAndCapacityLeftHeadingContainer container xs={7}>
          <StyledHeadingTypography>
            {messages?.measure?.fab5?.heading}
          </StyledHeadingTypography>
          <Grid container item xs={2}>
            {connectField("plan", {
              label: messages?.measure?.fab5?.plan,
              options: planOptions?.map((planOption) => ({
                id: planOption?.id,
                label: planOption?.name,
              })),
            })(MaterialAutocompleteInput)}
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
        <StyledMainHeadingButtonContainer>
          <Button
            startIcon={<ResponsiveViewIcon />}
            variant="outlined"
            color="secondary"
            label={messages?.measure?.fab5?.preview}
            onClick={() => {
              history.push(routes.fab5.preview, {
                revenueEntity: revenueEntity,
                profitabilityEntity: profitabilityEntity,
                lockupEntity: lockupEntity,
                salesEntity: salesEntity,
                npsEntity: npsEntity,
                currentMonth: formValues?.datePicker
                  ? moment(formValues?.datePicker?.value).format("MMM")
                  : Months[previousMonth]?.label,
              });
            }}
          />
        </StyledMainHeadingButtonContainer>
      </StyledMainHeadingContainer>
      <StyledMainHeadingContainer style={{ marginRight: "0px" }}>
        <CustomTabs
          tabs={fab5ModuleTabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          noMarginLeft={true}
        />
        {activeTab === "fab5" && (
          <CustomTabs
            tabs={fab5ModuleIconTabs}
            activeTab={activeFab5Tab}
            setActiveTab={setActiveFab5Tab}
            noMarginLeft={true}
            noMarginRight={true}
            isIconTab={true}
          />
        )}
      </StyledMainHeadingContainer>
      <Grid container xs={12} padding="10px 20px 20px 20px">
        {activeTab === "fab5" && activeFab5Tab === "horizontal" && (
          <HorizontalView
            lockupEntity={lockupEntity}
            npsEntity={npsEntity}
            profitabilityEntity={profitabilityEntity}
            revenueEntity={revenueEntity}
            salesEntity={salesEntity}
            currentMonth={
              formValues?.datePicker
                ? moment(formValues?.datePicker?.value).format("MMM")
                : Months[previousMonth]?.label
            }
          />
        )}
        {activeTab === "fab5" && activeFab5Tab === "vertical" && (
          <VerticalView
            lockupEntity={lockupEntity}
            npsEntity={npsEntity}
            profitabilityEntity={profitabilityEntity}
            revenueEntity={revenueEntity}
            salesEntity={salesEntity}
            currentMonth={
              formValues?.datePicker
                ? moment(formValues?.datePicker?.value).format("MMM")
                : Months[previousMonth]?.label
            }
          />
        )}
        {activeTab === "matrix" && (
          <Matrix
            revenueEntity={revenueEntity}
            profitabilityEntity={profitabilityEntity}
            npsEntity={npsEntity}
            lockupEntity={lockupEntity}
            salesEntity={salesEntity}
          />
        )}
      </Grid>
    </Container>
  );
};

export default Fab5Module;
