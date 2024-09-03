import { Grid, Typography } from "@mui/material";
import {
  brandColour,
  greyScaleColour,
  otherColour,
} from "@wizehub/common/theme/style.palette";
import {
  baseFontSize,
  fontSize,
  fontWeight,
} from "@wizehub/common/theme/style.typography";
import styled, { css } from "styled-components";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export const StyledBudgestAndCapacityLeftHeadingContainer = styled(Grid)`
  /* justify-content: space-between; */
  gap: 13px;
  align-items: center;
`;

export const StyledInfoIcon = styled(InfoOutlinedIcon)`
  color: ${greyScaleColour.grey90} !important;
`;

export const StyledPlanTextTypography = styled(Typography)`
  font-size: ${fontSize.b1} !important;
  font-weight: ${fontWeight.semiBold} !important;
`;

export const StyledAddTeamFormTypography = styled(Typography)`
  font-size: ${fontSize.h5} !important;
  font-weight: ${fontWeight.semiBold} !important;
  word-break: break-word !important;
`;

export const StyledAddTeamSubTextBoldTypography = styled(Typography)`
  font-size: ${fontSize.b1} !important;
  font-weight: ${fontWeight.medium} !important;
  color: ${greyScaleColour.grey100} !important;
  word-break: break-word !important;
`;

export const StyledAddTeamSubTextTypography = styled(Typography)`
  font-size: ${fontSize.b1} !important;
  font-weight: ${fontWeight.regular} !important;
  color: ${greyScaleColour.grey100} !important;
`;

export const StyledMainCardHeaderContainer = styled.div`
  display: flex;
  margin: 12px 20px 0 20px;
`;

export const StyledEntityTypography = styled(Typography)`
  font-size: ${fontSize.h5} !important;
  font-weight: ${fontWeight.medium} !important;
`;

export const StyledEntitySubTextTypography = styled(Typography)`
  font-size: ${fontSize.b1} !important;
  font-weight: ${fontWeight.medium} !important;
`;

export const StyledPlaceholderDiv = styled.div`
  height: 20px;
`;

export const StyledTeamCapacityPrimaryCardTypography = styled(Typography)`
  font-size: ${fontSize.h5} !important;
  font-weight: ${fontWeight.semiBold} !important;
  color: ${brandColour.primary100} !important;
`;

export const StyledValueTypography = styled(Typography)<{ color?: string }>`
  font-size: ${fontSize.h5} !important;
  font-weight: ${fontWeight.medium} !important;
  color: ${(prop) =>
    prop?.color ? prop?.color : greyScaleColour.secondaryMain} !important;
  word-break: break-all !important;
`;

export const StyledBracketValueTypography = styled(Typography)`
  font-size: ${fontSize.h5} !important;
  font-weight: ${fontWeight.medium} !important;
  color: ${greyScaleColour.grey100} !important;
`;

export const StyledValueContainer = styled(Grid)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StyledTeamCapacityBottomCardTypography = styled(Typography)`
  font-size: ${fontSize.b1} !important;
  font-weight: ${fontWeight.bold} !important;
  color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledSecondaryButtonContainer = styled.div`
  display: flex;
  gap: 16px;
`;

export const StyledSummaryResultSecondaryContainer = styled(Grid)<{
  noMargin?: boolean;
}>`
  margin: 10px 0 10px 16px;
  background-color: ${greyScaleColour.grey60};
  border-radius: 6px;
  padding: 16px;
  gap: 16px;
  ${({ noMargin }) =>
    noMargin &&
    css`
      margin: 0;
    `}
`;

export const StyledSummaryResultInnerSecondaryContainer = styled(Grid)`
  background-color: ${greyScaleColour.white100};
  border-radius: 16px;
  padding: 16px;
  gap: 16px;
`;

export const StyledSummaryResultInnerSecondaryTypography = styled(Typography)`
  font-size: ${baseFontSize} !important;
  font-weight: ${fontWeight.medium} !important;
  color: ${brandColour.primaryDark} !important;
`;

export const StyledSumaryResultsWarningTypography = styled(Typography)`
  font-size: ${fontSize.b1} !important;
  font-weight: ${fontWeight.regular} !important;
  color: ${brandColour.primaryDark} !important;
  font-style: italic;
`;

export const StyledSummaryResultsNoteTypography = styled(Typography)<{
  meetsKPI?: boolean;
}>`
  font-size: ${fontSize.b1} !important;
  font-weight: ${fontWeight.regular} !important;
  color: ${(props) =>
    props?.meetsKPI
      ? otherColour.successDefault
      : otherColour.errorDefault} !important;
`;

export const StyledFirmWideResultsSecondaryContainerTypography = styled(
  Typography
)`
  font-size: ${fontSize.h5} !important;
  font-weight: ${fontWeight.bold} !important;
  color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledFirmWideResultsSecondaryContainerNoteTypography = styled(
  Typography
)`
  font-size: ${fontSize.b1} !important;
  font-weight: ${fontWeight.medium} !important;
  color: ${otherColour.errorDefault} !important;
`;

export const StyledEditEmployeeBudgetEditIcon = styled(EditOutlinedIcon)`
  font-size: 21px !important;
  cursor: pointer;
`;

export const StyledEditEmployeeBudgetTypography = styled(Typography)<{
  color?: string;
}>`
  font-size: ${baseFontSize} !important;
  font-weight: ${fontWeight.medium} !important;
  color: ${(props) => props?.color};
`;

export const StyledTeamBudgetEmployeeTypography = styled(Typography)`
  font-size: ${fontSize.b2} !important;
  font-weight: ${fontWeight.semiBold} !important;
  color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledTeamBudgetMonthTypography = styled(Typography)`
  font-size: ${fontSize.b2} !important;
  font-weight: ${fontWeight.medium} !important;
  color: ${greyScaleColour.secondaryMain} !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
`;

export const StyledTextAndTooltipContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`