import React from "react";
import {
  StyledAccordionDetails,
  StyledGridMvvImage,
  StyledGridMvvImageContainer,
  StyledMissionVisionValueInnerDiv,
} from "../styles";
import { CircularProgress, Grid, Typography } from "@mui/material";
import { Id } from "@wizehub/common/models";
import { useEntity } from "@wizehub/common/hooks";
import { MissionVisionValueEntityInterface } from "@wizehub/common/models/genericEntities";
import { MISSION_VISION_VALUE_BY_ID } from "../../../api";
import { StyledDetailTableHeading } from "@wizehub/components/detailPageWrapper/styles";
import messages from "../../../messages";
import { config } from "../../../config";

interface Props {
  accordianId: Id;
}

const ExpandAccordian: React.FC<Props> = ({ accordianId }) => {
  const { entity: mvvDetail } = useEntity<MissionVisionValueEntityInterface>(
    MISSION_VISION_VALUE_BY_ID,
    accordianId
  );
  return (
    <StyledAccordionDetails>
      {mvvDetail ? (
        <Grid container gap={2}>
          <Grid container item xs={mvvDetail?.imageUrl ? 9.2 : 12} gap={4}>
            <Grid item xs={12}>
              <StyledDetailTableHeading>
                {
                  messages?.firmProfile?.missionVisionValues
                    ?.addNewMissionVisionValue?.mission
                }
              </StyledDetailTableHeading>
              <StyledMissionVisionValueInnerDiv dangerouslySetInnerHTML={{ __html: mvvDetail?.mission }} />
            </Grid>
            <Grid item xs={12}>
              <StyledDetailTableHeading>
                {
                  messages?.firmProfile?.missionVisionValues
                    ?.addNewMissionVisionValue?.vision
                }
              </StyledDetailTableHeading>
              <StyledMissionVisionValueInnerDiv dangerouslySetInnerHTML={{ __html: mvvDetail?.vision }} />
            </Grid>
            <Grid item xs={12}>
              <StyledDetailTableHeading>
                {
                  messages?.firmProfile?.missionVisionValues
                    ?.addNewMissionVisionValue?.values
                }
              </StyledDetailTableHeading>
              <StyledMissionVisionValueInnerDiv dangerouslySetInnerHTML={{ __html: mvvDetail?.values }} />
            </Grid>
          </Grid>
          {mvvDetail?.imageUrl && (
            <Grid container item xs={2.5}>
              <StyledGridMvvImageContainer item xs={12}>
                {mvvDetail?.imageUrl && (
                  <StyledGridMvvImage
                    src={`${config?.baseImageUrl}/${mvvDetail?.imageUrl}`}
                    alt={mvvDetail?.imageUrl}
                  />
                )}
              </StyledGridMvvImageContainer>
            </Grid>
          )}
        </Grid>
      ) : (
        <Grid container item xs={12} justifyContent="center">
          <CircularProgress size="30px" />
        </Grid>
      )}
    </StyledAccordionDetails>
  );
};

export default ExpandAccordian;
