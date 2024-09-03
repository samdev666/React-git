import React, { useState } from "react";
import { Button, Stepper } from "@wizehub/components";
import { usePopupReducer } from "@wizehub/common/hooks";
import { Container } from "../../../components";
import messages from "../../../messages";
import LeadStage from "./leadStage";
import StageStatus from "./stageStatus";
import {
  StyledLeadDataManagementActiveTab,
  StyledLeadDataManagementActiveTabText,
  StyledLeadDataManagementHeadingContainer,
  StyledLeadDataManagementLeftHeadingContainer,
  StyledLeadDataManagementTabsContainer,
} from "../styles";
import { StyledHeadingTypography } from "../../userManagement/styles";
import { ResponsiveAddIcon } from "../../productManagement/productManagement";

interface Props {}

const LeadProgressStages: React.FC<Props> = () => {
  const {
    visibility: formVisibility,
    showPopup: showForm,
    hidePopup: hideForm,
  } = usePopupReducer<any>();

  return (
    <Container noPadding cardCss={{ marginTop: "10px" }}>
      <StyledLeadDataManagementHeadingContainer>
        <StyledLeadDataManagementLeftHeadingContainer>
          <Stepper />
          <StyledHeadingTypography>
            {
              messages.sidebar.menuItems.secondaryMenu.subMenuItems
                .leadDataManagement.subItems.leadProgressStages.heading
            }
          </StyledHeadingTypography>
        </StyledLeadDataManagementLeftHeadingContainer>
        <Button
          startIcon={<ResponsiveAddIcon />}
          variant="contained"
          color="primary"
          label={
            messages.sidebar.menuItems.secondaryMenu.subMenuItems
              .leadDataManagement.subItems.leadProgressStages?.statusButtonText
          }
          onClick={showForm}
        />
      </StyledLeadDataManagementHeadingContainer>
      <StageStatus formVisibility={formVisibility} hideForm={hideForm} />
    </Container>
  );
};

export default LeadProgressStages;
