import { Typography } from '@mui/material';
import styled from 'styled-components';
import { fontSize, fontWeight } from '@wizehub/common/theme/style.typography';
import {
  greyScaleColour,
} from '@wizehub/common/theme/style.palette';

export const StyledProductManagementHeadingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 20px 0 20px;
`;

export const StyledProductManagementLeftHeadingContainer = styled.div``;

export const StyledProductManagementDetailButtonContainer = styled.div`
  display: flex;
  gap: 16px;
`;

export const StyledProductManagementNamecolumn = styled(Typography)`
  font-size: ${fontSize.b1} !important;
  font-weight: ${fontWeight.medium} !important;
`;

export const StyledProductManagementEmailcolumn = styled(Typography)`
  font-size: ${fontSize.b2} !important;
  font-weight: ${fontWeight.medium} !important;
  line-height: 18x !important;
  color: ${greyScaleColour.grey100} !important;
`;

export const StyledDeactivateUserText = styled(Typography)`
  font-size: ${fontSize.h5} !important;
  font-weight: ${fontWeight.regular} !important;
  color: ${greyScaleColour.secondaryMain} !important;
`;
