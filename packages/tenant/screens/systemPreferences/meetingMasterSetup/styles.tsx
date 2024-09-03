import { brandColour } from '@wizehub/common/theme/style.palette';
import { FormRowItem } from '@wizehub/components';
import styled from 'styled-components';
import AddIcon from '@mui/icons-material/Add';
import { Typography } from '@mui/material';
import { fontWeight } from '@wizehub/common/theme/style.typography';

export const StyledMeetingMasterSetupHeadingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 20px 0 20px;
`;

export const StyledMeetingMasterSetupLeftHeadingContainer = styled.div``;

export const StyledMeetingMasterSetupRightHeadingContainer = styled.div`
  display: flex;
  gap: 16px;
`;

export const StyledApplicationAnchorTag = styled.a`
  color: ${brandColour.primaryMain};
  cursor: pointer;
  border-width: 2px;
  &:hover {
    color: ${brandColour.primaryDark};
  }
`;

export const StyledMeetingCategoryLeftHeadingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;
`;

export const StyledMeetinAgendaAddMoreContainer = styled(FormRowItem)`
  cursor: pointer !important;
  &:hover {
    & .MuiTypography-root,
    & .MuiSvgIcon-root {
      color: ${brandColour.primaryDark} !important;
    }
  }
`;

export const StyledMeetingAgendaAddMoreIcon = styled(AddIcon)`
  width: 10.5px !important;
  height: 10.5px !important;
  color: ${brandColour?.primary100} !important;
`;

export const StyledMeetingAgendaAddMoreText = styled(Typography)`
  color: ${brandColour?.primary100} !important;
`;

export const StyledMeetingAgendaHeading = styled(Typography)`
  font-weight: ${fontWeight.medium} !important;
`;
