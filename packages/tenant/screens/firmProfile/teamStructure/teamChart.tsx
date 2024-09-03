import { Grid } from "@mui/material";
import { greyScaleColour } from "@wizehub/common/theme/style.palette";
import { Card, SearchInput } from "@wizehub/components";
import React from "react";
import {
  StyledTeamChartLeftContainer,
  StyledTeamChartRightContainer,
  StyledTeamChartTeamMemberText,
  StyledTeamMemberAvatar,
  StyledTeamMemberName,
} from "../styles";
import messages from "../../../messages";
import { Id, MetaData, PagedEntity } from "@wizehub/common/models";
import { TeamEmployeesEntity } from "@wizehub/common/models/genericEntities";
import { config } from "../../../config";

interface Props {
  teamEmployeeEntity: PagedEntity<TeamEmployeesEntity>;
  teamEmployeeConnectFilter: (
    name: string,
    extraProps?: Record<any, any>
  ) => (Filter: any) => any;
}

const TeamChart: React.FC<Props> = ({
  teamEmployeeConnectFilter,
  teamEmployeeEntity,
}) => {
  return (
    <Card
      headerCss={{ display: "flex" }}
      cardCss={{
        margin: "10px 0px 20px 20px",
        overflow: "hidden",
        overflowY: "scroll",
        width: "100%",
      }}
      noHeader={true}
    >
      <Grid container >
        <StyledTeamChartLeftContainer item xs={9}>
          <StyledTeamChartTeamMemberText>
            {messages?.general?.comingSoon}
          </StyledTeamChartTeamMemberText>
        </StyledTeamChartLeftContainer>
        <StyledTeamChartRightContainer container item xs={3}>
          <StyledTeamChartTeamMemberText>
            {messages?.firmProfile?.teamStructure?.teamMembers}
          </StyledTeamChartTeamMemberText>
          <SearchInput
            connectFilter={teamEmployeeConnectFilter}
            label={messages?.firmProfile?.people?.search}
          />
          {teamEmployeeEntity?.records?.length ? (
            teamEmployeeEntity?.records?.map((teamEmployee) => {
              return (
                <Grid
                  container
                  item
                  padding="6px 12px"
                  gap="7.5px"
                  alignItems="center"
                 
                >
                  <StyledTeamMemberAvatar
                    src={`${config?.baseImageUrl}/${teamEmployee?.profileUrl}`}
                  />
                  <StyledTeamMemberName>
                    {teamEmployee?.firstName} {teamEmployee?.lastName}
                  </StyledTeamMemberName>
                </Grid>
              );
            })
          ) : (
            <Grid container item padding="6px 12px" alignItems="center">
              <StyledTeamMemberName>
                {messages?.firmProfile?.teamStructure?.noTeamMemberFound}
              </StyledTeamMemberName>
            </Grid>
          )}
        </StyledTeamChartRightContainer>
      </Grid>
    </Card>
  );
};

export default TeamChart;
