import { Typography } from '@mui/material';
import { brandColour, greyScaleColour } from '@wizehub/common/theme/style.palette';
import { fontSize, fontWeight } from '@wizehub/common/theme/style.typography';
import styled from 'styled-components';

export const StyledLeadDataManagementHeadingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 20px 0 20px;
`;

export const StyledLeadDataManagementLeftHeadingContainer = styled.div``;

export const StyledDeleteFormTypography = styled(Typography)`
  font-size: ${fontSize.h5} !important;
`;

export const StyledLeadDataManagementTabsContainer = styled.div`
  margin: 8px 20px 0 20px;
  display: flex;
`;

export const StyledLeadDataManagementActiveTab = styled.div<{ active?: boolean }>`
  background-color: ${({ active }) => (active ? brandColour.primary100 : greyScaleColour.grey60)};
  border-radius: 4px;
  padding: 8px 16px;
  color: ${({ active }) => (active ? greyScaleColour.white100 : greyScaleColour.secondaryMain)};
  cursor: pointer;
`;

export const StyledLeadDataManagementActiveTabText = styled(Typography)`
  font-size: ${fontSize.h5} !important;
  font-weight: ${fontWeight.medium} !important;
  line-height: 24px !important;
`;
