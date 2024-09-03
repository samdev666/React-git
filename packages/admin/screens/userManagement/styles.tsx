import { Grid, Typography } from '@mui/material';
import styled from 'styled-components';
import { fontSize, fontWeight } from '@wizehub/common/theme/style.typography';
import {
  greyScaleColour,
} from '@wizehub/common/theme/style.palette';
import { respondTo } from '@wizehub/common/theme/style.layout';

export const StyledHeadingTypography = styled(Typography)`
  font-size: ${fontSize.h1} !important;
  font-weight: ${fontWeight.semiBold} !important;
  margin: 0px !important;
  line-height: 42px !important;
  ${respondTo.mdDown} {
    font-size: ${fontSize.h2} !important;
    font-weight: ${fontWeight.medium} !important;
    line-height: 37px !important;
  }
`;

export const StyledUserManagementHeadingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 20px 0 20px;
`;

export const StyledUserManagementLeftHeadingContainer = styled.div``;

export const StyledUserManagementDetailButtonContainer = styled.div`
  display: flex;
  gap: 16px;
`;

export const StyledDetailHeading = styled(Typography)`
  line-height: 26px !important;
  font-size: ${fontSize.h4} !important;
  font-weight: ${fontWeight.medium} !important;
  color: ${greyScaleColour.grey100} !important;
  ${respondTo.mdDown} {
    font-size: ${fontSize.h5} !important;
    font-weight: ${fontWeight.semiBold} !important;
    line-height: 20px !important;
  }
`;

export const StyledDetailHeadingContainer = styled(Grid)`
  padding: 14px 24px !important;
  background-color: ${greyScaleColour.grey60} !important;
  border-bottom: 1px solid ${greyScaleColour.grey80};
  ${respondTo.mdDown} {
    padding: 14px 14px !important;
  }
`;

export const StyledUserManagementNamecolumn = styled(Typography)`
  font-size: ${fontSize.b1} !important;
  font-weight: ${fontWeight.medium} !important;
`;

export const StyledUserManagementEmailcolumn = styled(Typography)`
  font-size: ${fontSize.b2} !important;
  font-weight: ${fontWeight.medium} !important;
  line-height: 18x !important;
  color: ${greyScaleColour.grey100} !important;
`;

export const StyledDetailChildren = styled(Grid)`
  display: flex;
  flex-direction: column !important;
  gap: 32px !important;
  padding: 24px !important;
  ${respondTo.mdDown} {
    padding: 14px !important;
  }
`;

export const StyledDetailTableHeading = styled(Typography)`
  font-size: ${fontSize.b1} !important;
  font-weight: ${fontWeight.regular} !important;
  color: ${greyScaleColour.grey100} !important;
  margin-bottom: 8px !important;
  line-height: normal !important;
  ${respondTo.mdDown} {
    font-size: ${fontSize.b2} !important;
    font-weight: ${fontWeight.medium} !important;
    line-height: 18px !important;
  }
`;

export const StyledDetailTableContent = styled(Typography)`
  font-size: ${fontSize.h5} !important;
  font-weight: ${fontWeight.medium} !important;
  color: ${greyScaleColour.secondaryMain} !important;
  line-height: normal !important;
  word-break: break-all !important;
  white-space: pre-wrap !important;
  ${respondTo.mdDown} {
    font-size: ${fontSize.b1} !important;
    font-weight: ${fontWeight.medium} !important;
    line-height: 20px !important;
  }
`;

export const StyledDetailFooter = styled(Grid)`
  border-top: 1px solid ${greyScaleColour.grey80};
  padding: 14px 24px;
  ${respondTo.mdDown} {
    padding: 14px;
  }
`;

export const StyledDeactivateUserText = styled(Typography)`
  font-size: ${fontSize.h5} !important;
  font-weight: ${fontWeight.regular} !important;
  color: ${greyScaleColour.secondaryMain} !important;
`;
