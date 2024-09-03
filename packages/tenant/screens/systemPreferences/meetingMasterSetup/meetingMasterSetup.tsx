import React from "react";
import { Container } from "../../../components";
import {
  StyledMeetingMasterSetupHeadingContainer,
  StyledMeetingMasterSetupLeftHeadingContainer,
  StyledMeetingMasterSetupRightHeadingContainer,
} from "./styles";
import { StyledHeadingTypography } from "../launchPadSetup/styles";
import messages from "../../../messages";
import { Right } from "../../../redux/reducers/auth";
import {
  TabsInterface,
  UserActionConfig,
  UserActionType,
} from "@wizehub/common/models";
import { routes } from "../../../utils";
import { useActiveTabLocation, usePopupReducer } from "@wizehub/common/hooks";
import { ResponsiveAddIcon } from "../launchPadSetup/launchPadSetup";
import { Button, CustomTabs } from "@wizehub/components";
import { push } from "connected-react-router";
import Questions from "./questions";
import Agenda from "./agenda";
import {
  MeetingAgendaFormEntity,
  MeetingQuestionFormEntity,
} from "@wizehub/common/models/genericEntities";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";

interface RightBasedTabsInterface extends TabsInterface {
  right: Right[];
}

const meetingMasterSetupTabs: RightBasedTabsInterface[] = [
  {
    id: "question",
    label:
      messages?.settings?.systemPreferences?.meetingMasterSetup?.questions
        ?.heading,
    route: routes.meetingMasterSetup.root,
    right: [],
  },
  {
    id: "agenda",
    label:
      messages?.settings?.systemPreferences?.meetingMasterSetup?.agenda
        ?.heading,
    route: routes.meetingMasterSetup.agenda,
    right: [],
  },
];

const MeetingMasterSetup = () => {
  const { activeTabName, pathname } = useActiveTabLocation(
    meetingMasterSetupTabs
  );
  const { auth } = useSelector((state: ReduxState) => state);
  const disabledItems = auth?.rights?.some(
    (item) => item === Right.TENANT_MEETING_MASTER_MANAGEMENT_READ_ONLY
  );
  const reduxDispatch = useDispatch();
  const {
    visibility: addMeetingQuestionformVisibility,
    showPopup: showAddMeetingQuestionForm,
    hidePopup: hideAddMeetingQuestionForm,
    metaData: addConfig,
  } = usePopupReducer<MeetingQuestionFormEntity>();

  const {
    visibility: addMeetingAgendaformVisibility,
    showPopup: showAddMeetingAgendaStatusForm,
    hidePopup: hideAddMeetingAgendaStatusForm,
    metaData: addMeetingAgendaConfig,
  } = usePopupReducer<MeetingAgendaFormEntity>();
  return (
    <Container noPadding>
      <StyledMeetingMasterSetupHeadingContainer>
        <StyledMeetingMasterSetupLeftHeadingContainer>
          <StyledHeadingTypography>
            {messages?.settings?.systemPreferences?.meetingMasterSetup?.heading}
          </StyledHeadingTypography>
        </StyledMeetingMasterSetupLeftHeadingContainer>
        <StyledMeetingMasterSetupRightHeadingContainer>
          {pathname === routes.meetingMasterSetup.root && !disabledItems ? (
            <>
              <Button
                variant="outlined"
                color="secondary"
                label={
                  messages?.settings?.systemPreferences?.meetingMasterSetup
                    ?.viewCategory
                }
                onClick={() => {
                  reduxDispatch(push(routes.meetingMasterSetup.category));
                }}
              />
              <Button
                startIcon={<ResponsiveAddIcon />}
                variant="contained"
                color="primary"
                label={
                  messages?.settings?.systemPreferences?.meetingMasterSetup
                    ?.newQuestion
                }
                onClick={() =>
                  showAddMeetingQuestionForm({
                    actionConfig: {
                      type: UserActionType.CREATE,
                    },
                  })
                }
              />
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                color="secondary"
                label={
                  messages?.settings?.systemPreferences?.meetingMasterSetup
                    ?.progressStatus
                }
                onClick={() => {
                  reduxDispatch(push(routes.meetingMasterSetup.progressStatus));
                }}
              />
              <Button
                startIcon={<ResponsiveAddIcon />}
                variant="contained"
                color="primary"
                label={
                  messages?.settings?.systemPreferences?.meetingMasterSetup
                    ?.newAgenda
                }
                onClick={() =>
                  showAddMeetingAgendaStatusForm({
                    actionConfig: {
                      type: UserActionType.CREATE,
                    },
                  })
                }
              />
            </>
          )}
        </StyledMeetingMasterSetupRightHeadingContainer>
      </StyledMeetingMasterSetupHeadingContainer>
      <CustomTabs
        tabs={meetingMasterSetupTabs}
        push={push}
        activeTabName={activeTabName}
      />
      {pathname === routes.meetingMasterSetup.root ? (
        <Questions
          showAddMeetingQuestionForm={showAddMeetingQuestionForm}
          addMeetingQuestionformVisibility={addMeetingQuestionformVisibility}
          hideAddMeetingQuestionForm={hideAddMeetingQuestionForm}
          addConfig={addConfig}
        />
      ) : (
        <Agenda
          showAddMeetingAgendaStatusForm={showAddMeetingAgendaStatusForm}
          addMeetingAgendaformVisibility={addMeetingAgendaformVisibility}
          hideAddMeetingAgendaStatusForm={hideAddMeetingAgendaStatusForm}
          addMeetingAgendaConfig={addMeetingAgendaConfig}
        />
      )}
    </Container>
  );
};

export default MeetingMasterSetup;
