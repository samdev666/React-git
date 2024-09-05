import { Grid, Typography } from "@mui/material";
import styled from "styled-components";
import { fontSize, fontWeight } from "@wizehub/common/theme/style.typography";
import { respondTo } from "@wizehub/common/theme/style.layout";
import AddIcon from "@mui/icons-material/Add";
import { brandColour, greyScaleColour } from "@wizehub/common/theme/style.palette";

export const StyledIdealIncomeContainer = styled(Grid)`
  gap: 13px;
  align-items: center;
`;

export const StyledFormMessages = styled(Typography)`
  font-weight: ${fontWeight.medium} !important;
`;

export const StyledGridContainer = styled(Grid)`
  padding: 16px;
  background-color: ${greyScaleColour.grey60};
`;

export const StyledFormHeading = styled(Typography)`
  font-weight: ${fontWeight.medium} !important;
  font-size: ${fontSize.h5} !important;
  color: ${brandColour.primaryMain};
`;

export const StyledFormSeparator = styled.div`
  border: 1px dashed ${greyScaleColour.grey80};
`;

export const StyledIdealIncomeAddMoreText = styled(Typography)`
  color: ${brandColour.primary100} !important;
`;

export const StyledDesiredIncomeHeading = styled(Typography)`
  font-size: ${fontSize.h5} !important;
  color: white;
`;

export const StyledDesiredIncomeHeadingValue = styled(Typography)`
  font-size: ${fontSize.h5} !important;
  color: white;
`;

export const StyledDesiredIncomeCommonText = styled(Typography)`
  font-size: ${fontSize.h5} !important;
  font-weight: ${fontWeight.regular} !important;
`;

export const StyledDesiredIdealIncomeStatus = styled(Typography)`
  font-size: ${fontSize.b2} !important;
  font-weight: ${fontWeight.regular} !important;
  color: ${brandColour.primary100} !important;
  background-color: ${brandColour.primary70} !important;
  border-radius: 4px;
  padding: 4px;
`;

export const StyledFormAddMoreIcon = styled(AddIcon)`
  width: 10.5px !important;
  height: 10.5px !important;
  color: ${brandColour.primary100} !important;
  margin-top: 5px;
`;

export const StyledFormAddMoreIconContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer !important;
  &:hover {
    & .MuiTypography-root,
    & .MuiSvgIcon-root {
      color: ${brandColour.primaryDark} !important;
    }
  }
`;

export const StyledCapitalValueHeading = styled(Typography)`
  font-size: ${fontSize.h5} !important;
  font-weight: ${fontWeight.medium} !important;
  color: ${brandColour.primary100} !important;
`;

export const StyledCommonCapitalValue = styled(Typography)`
  font-size: ${fontSize.h5} !important;
  font-weight: ${fontWeight.medium} !important;
`;

export const StyledCommonCapitalValueMessage = styled(Typography)`
  font-weight: ${fontWeight.medium} !important;
  color: ${greyScaleColour.grey90};
`;

export const StyledCapitalValueGridWapper = styled(Grid)`
  padding: 12px 0px;
  border-bottom: 1px dashed ${greyScaleColour.grey80};
  display: flex;
  justify-content: space-between;
`;

export const StyledDesiredIncomeGridWapper = styled(Grid)`
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
`;

export const StyledDesiredIncomeInnerGridWapper = styled(Grid)`
  padding: 12px 0px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px dashed ${greyScaleColour.grey80};
`;
