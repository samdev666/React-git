import React, { useState } from "react";
import {
  StyledHeadingTypography,
  StyledIconButton,
  StyledMainHeadingContainer,
  StyledMainLeftHeadingContainer,
} from "@wizehub/components/detailPageWrapper/styles";
import { Grid } from "@mui/material";
import { CustomTabs } from "@wizehub/components";
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
} from "@wizehub/common/models/genericEntities";
import HorizontalSplitOutlinedIcon from "@mui/icons-material/HorizontalSplitOutlined";
import VerticalSplitOutlinedIcon from "@mui/icons-material/VerticalSplitOutlined";
import HorizontalView from "./horizontalView";
import { useDispatch } from "react-redux";
import VerticalView from "./verticalView";
import { goBack } from "connected-react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Matrix from "./matrix";
import { useLocation } from "react-router-dom";

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

const Fab5Preview = () => {
  const reduxDispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<"fab5" | "matrix">("fab5");
  const [activeFab5Tab, setActiveFab5Tab] = useState<"horizontal" | "vertical">(
    "horizontal"
  );

  const { state } = useLocation<{
    revenueEntity: Fab5RevnueEntity[];
    profitabilityEntity: Fab5ProfitabilityEntity[];
    lockupEntity: Fab5LockupEntity[];
    salesEntity: Fab5SalesEntity[];
    npsEntity: Fab5NpsEntity[];
    currentMonth: string;
  }>();

  return (
    <>
      <StyledMainHeadingContainer style={{ marginTop: "35px" }}>
        <StyledMainLeftHeadingContainer hasGoBackIcon={true}>
          <StyledIconButton onClick={() => reduxDispatch(goBack())}>
            <ArrowBackIcon />
          </StyledIconButton>
          <StyledHeadingTypography>
            {messages?.measure?.fab5?.previewFab5}
          </StyledHeadingTypography>
        </StyledMainLeftHeadingContainer>
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
            isIconTab={true}
          />
        )}
      </StyledMainHeadingContainer>
      <Grid container xs={12} padding="10px 20px 20px 20px">
        {activeTab === "fab5" && activeFab5Tab === "horizontal" && (
          <HorizontalView
            lockupEntity={state?.lockupEntity}
            npsEntity={state?.npsEntity}
            profitabilityEntity={state?.profitabilityEntity}
            revenueEntity={state?.revenueEntity}
            salesEntity={state?.salesEntity}
            currentMonth={state?.currentMonth}
          />
        )}
        {activeTab === "fab5" && activeFab5Tab === "vertical" && (
          <VerticalView
            lockupEntity={state?.lockupEntity}
            npsEntity={state?.npsEntity}
            profitabilityEntity={state?.profitabilityEntity}
            revenueEntity={state?.revenueEntity}
            salesEntity={state?.salesEntity}
            currentMonth={state?.currentMonth}
          />
        )}
        {activeTab === "matrix" && (
          <Matrix
            revenueEntity={state?.revenueEntity}
            profitabilityEntity={state?.profitabilityEntity}
            npsEntity={state?.npsEntity}
            lockupEntity={state?.lockupEntity}
            salesEntity={state?.salesEntity}
          />
        )}
      </Grid>
    </>
  );
};

export default Fab5Preview;
