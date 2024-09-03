import { OrganisationStructureEntity } from "@wizehub/common/models/genericEntities";
import React from "react";
import {
  StyledNameCardRoleText,
  StyledNameCardText,
  StyledOrganisationChartStructureCard,
  StyledOrganisationTeamAvatar,
  StyledProductionAccordionDetails,
} from "./styles";
import { config } from "../../config";
import { routes } from "../../utils";
import { Grid } from "@mui/material";

interface Props {
  members: Array<OrganisationStructureEntity>;
}

const OrganisationChartProductionAccordianSummary: React.FC<Props> = ({
  members,
}) => {
  return (
    <StyledProductionAccordionDetails>
      <Grid container item xs={12} gap={1} rowGap={4} justifyContent="center">
        {members?.length
          ? members?.map((teamEmployee) => (
              <StyledOrganisationChartStructureCard
                onClick={() =>
                  window.open(
                    routes.firmProfile.peopleDetail.replace(
                      ":id",
                      teamEmployee?.id.toString()
                    ),
                    "_blank"
                  )
                }
                item
                xs={5.5}
              >
                <StyledNameCardText>
                  {teamEmployee?.firstName ? teamEmployee?.firstName : "-"}{" "}
                  {teamEmployee?.lastName ? teamEmployee?.lastName : "-"}
                </StyledNameCardText>
                <StyledNameCardRoleText>
                  {teamEmployee?.role?.name ? teamEmployee?.role?.name : "-"}
                </StyledNameCardRoleText>
                <StyledOrganisationTeamAvatar
                  src={`${config?.baseImageUrl}/${teamEmployee?.imageUrl}`}
                />
              </StyledOrganisationChartStructureCard>
            ))
          : null}
      </Grid>
    </StyledProductionAccordionDetails>
  );
};

export default OrganisationChartProductionAccordianSummary;
