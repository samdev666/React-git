import {Grid, Typography} from "@mui/material";
import styled from "styled-components";
import {fontSize,fontWeight} from "@wizehub/common/theme/style.typography";
import { respondTo } from "@wizehub/common/theme/style.layout";
import { brandColour, greyScaleColour, } from "@wizehub/common/theme/style.palette";

export const StyledIdealIncomeContainer = styled(Grid)`
  /* justify-content: space-between; */
  gap: 13px;
  align-items: center;
`;
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
`
export const StyledFormMessages = styled(Typography)`
  font-weight: ${fontWeight.medium} !important;
`;

export const StyledFormHeading = styled(Typography)`
  font-weight: ${fontWeight.medium} !important;
  color: ${brandColour.primaryMain};
`;

export const StyledGridContainer = styled(Grid)`
    padding: 16px;
    background-color:  ${greyScaleColour.grey60};
`

export const StyledIdealIncomeFormLabels = styled(Typography)`
  color: ${greyScaleColour?.secondaryMain} !important;
  font-weight: ${fontWeight?.semiBold} !important;
  font-size: ${fontSize?.h5} !important;
`;

export const StyledFormSeparator = styled.div`
    border: 1px dashed ${greyScaleColour.grey80};
`;