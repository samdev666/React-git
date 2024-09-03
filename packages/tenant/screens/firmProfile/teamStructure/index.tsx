import React, { useEffect } from "react";
import { Container } from "../../../components";
import {
  StyledHeadingTypography,
  StyledMainHeadingContainer,
  StyledMainLeftHeadingContainer,
} from "@wizehub/components/detailPageWrapper/styles";
import messages from "../../../messages";
import {
  useActiveTabLocation,
  useOptions,
  usePopupReducer,
} from "@wizehub/common/hooks";
import { Division } from "@wizehub/common/models/genericEntities";
import { DIVISION_LISTING_API } from "../../../api";
import { Button, MultiTabComponent } from "@wizehub/components";
import { StyledMultiTabContainer } from "../styles";
import { push } from "connected-react-router";
import { routes } from "../../../utils";
import CommonScreen from "./commonScreen";
import { ResponsiveAddIcon } from "../../systemPreferences/launchPadSetup/launchPadSetup";
import {
  TeamStructureEnum,
  UserActionConfig,
  UserActionType,
} from "@wizehub/common/models";
import ProductionScreen from "./productionScreen";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  StyledNoDataInfo,
  StyledNoDataInfoContainer,
} from "@wizehub/components/table/styles";
import { hideLoader, showLoader } from "@wizehub/common/redux/actions";
import { Id } from "react-toastify";

const TeamStructure = () => {
  const { options: divisionOptions } =
    useOptions<Division>(DIVISION_LISTING_API);
  const location = useLocation();
  const reduxDispatch = useDispatch();
  const teamStructureTabs = divisionOptions.map((division) => {
    const divisionPlaceHolder = division?.name.toLowerCase();
    const divisionRoute = divisionPlaceHolder?.replace(" ", "-");
    return {
      id: division?.id,
      label: division?.name,
      route: routes.firmProfile.divisionEmployee.replace(":id", divisionRoute),
    };
  });

  const { activeTabName, pathname } = useActiveTabLocation(teamStructureTabs);
  const {
    visibility: createFormVisibility,
    showPopup: showCreateForm,
    hidePopup: hideCreateForm,
  } = usePopupReducer<UserActionConfig>();
  const {
    visibility: createTeamFormVisibility,
    showPopup: showCreateTeamForm,
    hidePopup: hideCreateTeamForm,
    metaData: teamFormConfig,
  } = usePopupReducer<{
    team: {
      id: Id;
      name: string;
    };
    type: UserActionType;
  }>();

  useEffect(() => {
    if (
      teamStructureTabs &&
      location?.pathname === routes.firmProfile.teamStructure
    ) {
      reduxDispatch(push(teamStructureTabs[0]?.route));
    }
  }, [teamStructureTabs?.length]);

  return (
    <Container noPadding>
      {location?.pathname !== routes.firmProfile.teamStructure && (
        <>
          <StyledMainHeadingContainer>
            <StyledMainLeftHeadingContainer>
              <StyledHeadingTypography>
                {messages?.firmProfile?.teamStructure?.heading}
              </StyledHeadingTypography>
            </StyledMainLeftHeadingContainer>
            {pathname ===
            teamStructureTabs?.filter(
              (tab) => tab.label === TeamStructureEnum.PRODUCTION
            )[0]?.route ? (
              <Button
                startIcon={<ResponsiveAddIcon />}
                label={messages?.firmProfile?.teamStructure?.addTeam}
                variant="contained"
                color="primary"
                onClick={() => showCreateTeamForm()}
              />
            ) : (
              <Button
                startIcon={<ResponsiveAddIcon />}
                label={messages?.firmProfile?.teamStructure?.addTeamMember}
                variant="contained"
                color="primary"
                onClick={() => showCreateForm()}
              />
            )}
          </StyledMainHeadingContainer>
          <StyledMultiTabContainer>
            <MultiTabComponent
              push={push}
              tabs={teamStructureTabs}
              activeTabName={activeTabName}
            />
          </StyledMultiTabContainer>
          {activeTabName === TeamStructureEnum.PRODUCTION ? (
            <ProductionScreen
              divisionId={
                divisionOptions?.filter(
                  (division) => division?.name === activeTabName
                )[0]?.id
              }
              createTeamFormVisibility={createTeamFormVisibility}
              hideCreateTeamForm={hideCreateTeamForm}
              teamFormConfig={teamFormConfig}
              showCreateTeamForm={showCreateTeamForm}
            />
          ) : (
            <CommonScreen
              divisionId={
                divisionOptions?.filter(
                  (division) => division?.name === activeTabName
                )[0]?.id
              }
              createFormVisibility={createFormVisibility}
              hideCreateForm={hideCreateForm}
            />
          )}
        </>
      )}
    </Container>
  );
};

export default TeamStructure;
