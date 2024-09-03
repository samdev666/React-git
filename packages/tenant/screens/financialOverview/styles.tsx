import { Grid, Typography } from "@mui/material";
import { StaticDatePicker } from "@mui/x-date-pickers";
import {
  brandColour,
  greyScaleColour,
} from "@wizehub/common/theme/style.palette";
import {
  baseFontSize,
  fontSize,
  fontWeight,
} from "@wizehub/common/theme/style.typography";
import styled, { css } from "styled-components";

export const StyledFeeCardHeading = styled(Typography)`
  font-size: ${fontSize.h5} !important;
  font-weight: ${fontWeight.medium} !important;
  color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledFeeCardContainer = styled(Grid)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  border-bottom: 1px dashed ${greyScaleColour?.grey80};
`;

export const StyledFeeContainerFooterTypography = styled(Typography)`
  font-size: ${baseFontSize} !important;
  font-weight: ${fontWeight.medium} !important;
  color: ${greyScaleColour.grey100} !important;
`;

export const StyledFeeContainerFooterTotalTypography = styled(Typography)`
  font-size: ${baseFontSize} !important;
  font-weight: ${fontWeight.medium} !important;
  color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledFormPercentageTypography = styled(Typography)<{
  color?: string;
  fontSize?: string;
  fontWeight?: number;
}>`
  font-size: ${(prop) =>
    prop?.fontSize ? prop?.fontSize : fontSize.b1} !important;
  font-weight: ${(prop) =>
    prop?.fontWeight ? prop?.fontWeight : fontWeight.regular} !important;
  color: ${(prop) =>
    prop?.color ? prop?.color : greyScaleColour.secondaryMain} !important;
`;

export const StyledFormPercentageGreyTypography = styled(Typography)`
  font-size: ${fontSize.b1} !important;
  font-weight: ${fontWeight.regular} !important;
  color: ${greyScaleColour.grey100} !important;
`;

export const StyledNameAndIconContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

export const StyledEditIconContainer = styled.div`
  height: 28px;
  width: 28px;
  border-radius: 28px;
  display: flex;
  background-color: ${brandColour.primary70};
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const StyledMainHeadingEbitdaButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const StyledPeriodTypography = styled(Typography)`
  font-size: ${fontSize.h5} !important;
  font-weight: ${fontWeight.semiBold} !important;
  color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledEbitdaGridTableContainer = styled(Grid)<{
  hasPadding?: boolean;
}>`
  padding: ${(prop) => !prop.hasPadding && "12px 20px"};
`;

export const StyledGridTableContainer = styled(Grid)`
  border: 1px solid ${greyScaleColour.grey80};
  border-radius: 10px;
  overflow: hidden;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const StyledInnerGridTableContainer = styled(Grid)<{
  hasMoreColumn?: boolean;
  paddingValue?: string;
}>`
  padding: ${(prop) => (prop?.paddingValue ? prop.paddingValue : "14px 20px")};
  background-color: ${greyScaleColour.grey60};
  border-bottom: 1px solid ${greyScaleColour.grey80};
  ${({ hasMoreColumn }) =>
    hasMoreColumn &&
    css`
      gap: 10px;
      flex-direction: row !important;
      padding: 10.5px 20px;
      align-items: center;
    `};
`;

export const StyledInnerGridDashedTableContainer = styled(Grid)<{
  noBackgroundColor?: boolean;
  noBorderBottom?: boolean;
  hasMoreColumn?: boolean;
  isBottomColumn?: boolean;
  paddingValue?: string;
  borderType?: string;
  height?: string;
  isClickable?: boolean;
  isSelected?: boolean;
}>`
  padding: ${(prop) => (prop?.paddingValue ? prop.paddingValue : "14px 20px")};
  background-color: ${greyScaleColour.grey60};
  border-bottom: ${(prop) =>
    prop?.borderType === "solid"
      ? `1px solid ${greyScaleColour.grey80}`
      : `1px dashed ${greyScaleColour.grey80}`};
  display: flex;
  flex-direction: column !important;
  gap: 20px;
  ${({ noBackgroundColor, height }) =>
    noBackgroundColor &&
    css`
      padding: 0px;
      height: ${height || "14px"};
      background-color: ${greyScaleColour.white100};
    `};
  ${({ noBorderBottom }) =>
    noBorderBottom &&
    css`
      border-bottom: none;
    `};
  ${({ hasMoreColumn }) =>
    hasMoreColumn &&
    css`
      gap: 0px;
      flex-direction: row !important;
    `};
  ${({ isBottomColumn }) =>
    isBottomColumn &&
    css`
      gap: 10px;
      flex-direction: row !important;
      padding: 10.5px 20px;
      align-items: center;
    `};
  ${({ isClickable }) =>
    isClickable &&
    css`
      cursor: pointer !important;
    `};
  ${({ isSelected }) =>
    isSelected &&
    css`
      background-color: ${brandColour?.primary70};
    `};
`;

export const StyledInnerGridDashedColouredTableContainer = styled(Grid)<{
  noBackgroundColor?: boolean;
}>`
  padding: 14px 20px;
  background-color: ${brandColour.primary70};
  border-bottom: 1px dashed ${greyScaleColour.grey80};
`;

export const StyledInnerGridTableHeadingTypography = styled(Typography)<{
  inputColor?: string;
}>`
  font-size: ${fontSize.b1} !important;
  font-weight: ${fontWeight.bold} !important;
  color: ${(prop) =>
    prop?.inputColor ? prop?.inputColor : brandColour.primaryDark} !important;
`;

export const StyledInnerGridTableNormalTypography = styled(Typography)<{
  hasMarginLeft?: boolean;
}>`
  font-size: ${fontSize.b1} !important;
  font-weight: ${fontWeight.regular} !important;
  color: ${greyScaleColour.secondaryMain} !important;
  ${({ hasMarginLeft }) =>
    hasMarginLeft &&
    css`
      margin-left: 28px !important;
    `};
`;

export const StyledInnerGridTableBoldTypography = styled(Typography)<{
  noHeight?: boolean;
}>`
  font-size: ${fontSize.b1} !important;
  font-weight: ${fontWeight.bold} !important;
  color: ${greyScaleColour.secondaryMain} !important;
  ${({ noHeight }) =>
    !noHeight &&
    css`
      height: 21px !important;
    `};
`;

export const StyledEntityTableTextTypography = styled(Typography)<{
  hasMarginLeft?: boolean;
}>`
  font-size: ${fontSize.b1} !important;
  font-weight: ${fontWeight.medium} !important;
  color: ${greyScaleColour.secondaryMain} !important;
  ${({ hasMarginLeft }) =>
    hasMarginLeft &&
    css`
      margin-left: 28px !important;
    `};
`;

export const StyledEntityPercentageTableTextTypography = styled(Typography)`
  font-size: ${fontSize.b1} !important;
  font-weight: ${fontWeight.medium} !important;
  color: ${greyScaleColour.grey100} !important;
`;

export const StyledTeamBudgetScrollableContainer = styled(Grid)`
  gap: 16px;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const StyledTeamBudgetMonthNameTypography = styled(Typography)`
  font-size: ${fontSize.b1} !important;
  font-weight: ${fontWeight.medium} !important;
  color: ${greyScaleColour.secondaryMain} !important;
  text-align: center !important;
`;

export const StyledStaticDatePicker = styled(StaticDatePicker)({
  ".MuiMonthCalendar-root": {
    color: greyScaleColour.secondaryMain,
    borderRadius: "6px",
    border: `1px solid ${greyScaleColour.grey80}`,
    backgroundColor: greyScaleColour.white100,
  },
  ".MuiDateCalendar-root": {
    height: "210px",
  },
  ".MuiPickersLayout-contentWrapper": {
    position: "absolute",
    top: "30px",
    zIndex: "1000",
  },
  ".MuiPickersMonth-monthButton.Mui-disabled ": {
    color: greyScaleColour.grey80,
  },
});

export const StyledUnorderedItems = styled.ul`
  margin: 0;
`;
