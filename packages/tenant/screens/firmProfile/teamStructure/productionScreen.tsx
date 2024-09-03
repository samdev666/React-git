import React, { useEffect, useState } from "react";
import {
  Button,
  CustomTabs,
  Modal,
  MultiTabComponent,
  Toast,
} from "@wizehub/components";
import { Divider, Grid } from "@mui/material";
import {
  StyledSecondaryCardContainer,
  StyledSecondaryCardHeaderContainer,
} from "../styles";
import {
  Id,
  MetaData,
  Option,
  PaginatedEntity,
  UserActionConfig,
  UserActionType,
  getDefaultMetaData,
} from "@wizehub/common/models";
import messages from "../../../messages";
import { ResponsiveAddIcon } from "../../systemPreferences/launchPadSetup/launchPadSetup";
import {
  DivisionTeamEntity,
  TeamEmployeesEntity,
} from "@wizehub/common/models/genericEntities";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import { usePagination, usePopupReducer } from "@wizehub/common/hooks";
import {
  DIVISION_TEAM_ACTION,
  TEAM_EMPLOYEE_ACTION,
} from "../../../redux/actions";
import {
  ADD_TEAM_API,
  DIVISION_TEAM_LISTING_API,
  TEAM_EMPLOYEE_LISTING_API,
} from "../../../api";
import {
  StyledNoDataInfo,
  StyledNoDataInfoContainer,
} from "@wizehub/components/table/styles";
import AddTeamForm from "./addTeamForm";
import AllocatePeople from "./allocatePeople";
import AddProductionTeamMemberForm from "./addProductionTeamMemberForm";
import TeamChart from "./teamChart";
import { greyScaleColour } from "@wizehub/common/theme/style.palette";
import { StyledMainHeadingButtonContainer } from "@wizehub/components/detailPageWrapper/styles";
import {
  ResponsiveDeleteIcon,
  ResponsiveEditIcon,
} from "../../systemPreferences/launchPadSetup/launchPadSetupDetail";
import DeleteCTAForm from "../../systemPreferences/launchPadSetup/deleteCTAForm";
import { toast } from "react-toastify";
import { HttpMethods } from "@wizehub/common/utils";

interface Props {
  divisionId: Id;
  createTeamFormVisibility: boolean;
  hideCreateTeamForm: () => void;
  teamFormConfig: {
    team: {
      id: Id;
      name: string;
    };
    type: UserActionType;
  };
  showCreateTeamForm: (
    metaData?: Partial<{
      team: {
        id: Id;
        name: string;
      };
      type: UserActionType;
    }>
  ) => void;
}

const productionTabs: Option[] = [
  {
    id: "allocatePeople",
    label: messages?.firmProfile?.teamStructure?.allocatePeople,
  },
  {
    id: "teamChart",
    label: messages?.firmProfile?.teamStructure?.teamChart,
  },
];

const paginatedDivisionTeam: PaginatedEntity = {
  key: "divisionTeam",
  name: DIVISION_TEAM_ACTION,
  api: DIVISION_TEAM_LISTING_API,
};

const paginatedTeamEmployee: PaginatedEntity = {
  key: "teamEmployee",
  name: TEAM_EMPLOYEE_ACTION,
  api: TEAM_EMPLOYEE_LISTING_API,
};

const getDefaultTeamEmployeeFilter = (): MetaData<TeamEmployeesEntity> => ({
  ...getDefaultMetaData<TeamEmployeesEntity>(),
  order: "name",
});

const getDefaultDivisionTeamFilter = (): MetaData<DivisionTeamEntity> => ({
  ...getDefaultMetaData<DivisionTeamEntity>(),
  allResults: true,
});

const ProductionScreen: React.FC<Props> = ({
  divisionId,
  createTeamFormVisibility,
  hideCreateTeamForm,
  teamFormConfig,
  showCreateTeamForm,
}) => {
  const [activeTab, setActiveTab] = useState<"allocatePeople" | "teamChart">(
    "allocatePeople"
  );
  const [activeTeam, setActiveTeam] = useState<Id>(null);
  const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
  const {
    visibility: createdTeamMemberFormVisibility,
    showPopup: showCreateTeamMemberForm,
    hidePopup: hideCreateTeamMemberForm,
  } = usePopupReducer<UserActionConfig>();

  const {
    visibility: deleteTeamFormVisibility,
    showPopup: showDeleteTeamForm,
    hidePopup: hideDeleteTeamForm,
  } = usePopupReducer();

  const { entity: divisionTeamEntity, applyFilters } =
    usePagination<DivisionTeamEntity>(
      {
        ...paginatedDivisionTeam,
        api: DIVISION_TEAM_LISTING_API.replace(":tenantId", tenantId).replace(
          ":divisionId",
          divisionId?.toString()
        ),
      },
      getDefaultDivisionTeamFilter()
    );

  const {
    entity: teamEmployeeEntity,
    updateFilters: teamEmployeeUpdateFilter,
    applyFilters: teamEmployeeApplyFilter,
    connectFilter: teamEmployeeConnectFilter,
    fetchPage: teamEmployeeFetchPage,
    updateLimit: teamEmployeeUpdateLimit,
  } = usePagination<TeamEmployeesEntity>(
    {
      ...paginatedTeamEmployee,
      api: TEAM_EMPLOYEE_LISTING_API.replace(":tenantId", tenantId).replace(
        ":teamId",
        activeTeam?.toString()
      ),
    },
    getDefaultTeamEmployeeFilter()
  );
  const teamTabs = divisionTeamEntity?.records?.map((divisionTeam) => {
    return {
      id: divisionTeam?.id,
      label: divisionTeam?.name,
    };
  });

  useEffect(() => {
    if (activeTeam || activeTab) {
      teamEmployeeApplyFilter();
    }
  }, [activeTeam, activeTab]);

  useEffect(() => {
    if (divisionTeamEntity?.records?.length) {
      setActiveTeam(divisionTeamEntity?.records[0]?.id);
      teamEmployeeApplyFilter();
    }
  }, [divisionTeamEntity]);

  return (
    <>
      {divisionTeamEntity?.metadata?.total ? (
        <StyledSecondaryCardHeaderContainer>
          <Grid
            container
            item
            xs={2.1}
            display="flex"
            flexDirection="column"
            height="70vh"
            overflow="auto"
            sx={{ backgroundColor: greyScaleColour.grey60 }}
          >
            <MultiTabComponent
              tabs={teamTabs}
              activeTab={activeTeam || teamTabs[0]?.id}
              setActiveTab={setActiveTeam}
              orientation="vertical"
              noBackgroundColor={true}
            />
          </Grid>
          <Divider sx={{ borderWidth: "1px", marginLeft: "20px" }} />
          <Grid container item xs={9.9} height="fit-content">
            <StyledSecondaryCardContainer>
              <CustomTabs
                tabs={productionTabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
              <StyledMainHeadingButtonContainer>
                <Button
                  startIcon={<ResponsiveEditIcon />}
                  variant="text"
                  color="primary"
                  label={messages?.firmProfile?.teamStructure?.editTeam}
                  onClick={() =>
                    showCreateTeamForm({
                      team: {
                        id: activeTeam,
                        name: divisionTeamEntity?.records.find(
                          (team) => team.id === activeTeam
                        )?.name,
                      },
                      type: UserActionType.EDIT,
                    })
                  }
                />
                <Button
                  startIcon={<ResponsiveDeleteIcon />}
                  variant="text"
                  color="error"
                  label={messages?.firmProfile?.teamStructure?.deleteTeam}
                  onClick={() => showDeleteTeamForm()}
                />
                <Button
                  startIcon={<ResponsiveAddIcon />}
                  variant="contained"
                  color="primary"
                  label={messages?.firmProfile?.teamStructure?.addTeamMember}
                  onClick={() => showCreateTeamMemberForm()}
                />
              </StyledMainHeadingButtonContainer>
            </StyledSecondaryCardContainer>
            {activeTab === "allocatePeople" ? (
              <AllocatePeople
                teamEmployeeEntity={teamEmployeeEntity}
                teamEmployeeApplyFilter={teamEmployeeApplyFilter}
                teamEmployeeConnectFilter={teamEmployeeConnectFilter}
                teamEmployeeFetchPage={teamEmployeeFetchPage}
                teamEmployeeUpdateFilter={teamEmployeeUpdateFilter}
                teamEmployeeUpdateLimit={teamEmployeeUpdateLimit}
                activeTeam={activeTeam}
              />
            ) : (
              <TeamChart
                teamEmployeeEntity={teamEmployeeEntity}
                teamEmployeeConnectFilter={teamEmployeeConnectFilter}
              />
            )}
          </Grid>
        </StyledSecondaryCardHeaderContainer>
      ) : (
        <StyledNoDataInfoContainer>
          <StyledNoDataInfo>
            {messages?.firmProfile?.teamStructure?.noTeamFound}
          </StyledNoDataInfo>
        </StyledNoDataInfoContainer>
      )}
      <Modal
        show={createTeamFormVisibility}
        heading={
          teamFormConfig?.type === UserActionType?.EDIT
            ? messages?.firmProfile?.teamStructure?.editTeam
            : messages?.firmProfile?.teamStructure?.addTeam
        }
        onClose={hideCreateTeamForm}
        fitContent
      >
        <AddTeamForm
          onCancel={hideCreateTeamForm}
          onSuccess={() => {
            hideCreateTeamForm();
            applyFilters();
          }}
          divisionId={divisionId}
          team={
            teamFormConfig?.type === UserActionType.EDIT && teamFormConfig?.team
          }
        />
      </Modal>
      <Modal
        show={createdTeamMemberFormVisibility}
        heading={messages?.firmProfile?.teamStructure?.addTeam}
        onClose={hideCreateTeamMemberForm}
        fitContent
      >
        <AddProductionTeamMemberForm
          onCancel={hideCreateTeamMemberForm}
          onSuccess={() => {
            hideCreateTeamMemberForm();
            teamEmployeeApplyFilter();
          }}
          divisionId={divisionId}
          productionTeamId={activeTeam}
        />
      </Modal>
      <Modal
        show={deleteTeamFormVisibility}
        heading={messages?.firmProfile?.teamStructure?.form?.deleteTeam}
        onClose={hideDeleteTeamForm}
        fitContent
      >
        <DeleteCTAForm
          onCancel={hideDeleteTeamForm}
          onSuccess={() => {
            hideDeleteTeamForm();
            toast(
              <Toast
                text={
                  messages?.firmProfile?.teamStructure?.form?.success
                    ?.teamDeleted
                }
              />
            );
            applyFilters();
          }}
          api={`${ADD_TEAM_API}/${activeTeam}`}
          bodyText={messages?.firmProfile?.teamStructure?.form?.deleteNote}
          cancelButton={messages?.firmProfile?.teamStructure?.form?.cancel}
          confirmButton={messages?.firmProfile?.teamStructure?.form?.deleteTeam}
          apiMethod={HttpMethods.DELETE}
        />
      </Modal>
    </>
  );
};

export default ProductionScreen;
