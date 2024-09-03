import React from "react";
import { Container } from "../../../components";
import {
  StyledPracticeLeadStageSetupHeadingContainer,
  StyledPracticeLeadStageSetupLeftHeadingContainer,
} from "./styles";
import { StyledHeadingTypography } from "../launchPadSetup/styles";
import messages from "../../../messages";
import { UserActionType } from "@wizehub/common/models";
import { usePopupReducer } from "@wizehub/common/hooks";
import { ResponsiveAddIcon } from "../launchPadSetup/launchPadSetup";
import { Button, CustomTabs } from "@wizehub/components";
import StageStatus from "./stageStatus";
import { LeadStageStatusFormEntity } from "@wizehub/common/models/genericEntities";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import { Right } from "../../../redux/reducers/auth";

const PracticeLeadStageSetup = () => {
  const { auth } = useSelector((state: ReduxState) => state);
  const disabledItems = auth?.rights?.some(
    (item) => item === Right.TENANT_LEAD_PROGRESS_MANAGEMENT_READ_ONLY
  );

  const {
    visibility: addLeadStageStatusformVisibility,
    showPopup: showAddLeadStageStatusForm,
    hidePopup: hideAddLeadStageStatusForm,
    metaData: addLeadStageStatusConfig,
  } = usePopupReducer<LeadStageStatusFormEntity>();
  return (
    <Container noPadding>
      <StyledPracticeLeadStageSetupHeadingContainer>
        <StyledPracticeLeadStageSetupLeftHeadingContainer>
          <StyledHeadingTypography>
            {
              messages?.settings?.systemPreferences?.practiceLeadStageSetup
                ?.heading
            }
          </StyledHeadingTypography>
        </StyledPracticeLeadStageSetupLeftHeadingContainer>
        {!disabledItems && (
          <Button
            startIcon={<ResponsiveAddIcon />}
            variant="contained"
            color="primary"
            label={
              messages?.settings?.systemPreferences?.practiceLeadStageSetup
                ?.stageStatus?.button
            }
            onClick={() =>
              showAddLeadStageStatusForm({
                actionConfig: {
                  type: UserActionType.CREATE,
                },
              })
            }
          />
        )}
      </StyledPracticeLeadStageSetupHeadingContainer>
      <StageStatus
        showAddLeadStageStatusForm={showAddLeadStageStatusForm}
        addLeadStageStatusformVisibility={addLeadStageStatusformVisibility}
        hideAddLeadStageStatusForm={hideAddLeadStageStatusForm}
        addLeadStageStatusConfig={addLeadStageStatusConfig}
      />
    </Container>
  );
};

export default PracticeLeadStageSetup;
