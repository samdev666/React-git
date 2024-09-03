import { Typography } from "@mui/material";
import { respondTo } from "@wizehub/common/theme/style.layout";
import { greyScaleColour } from "@wizehub/common/theme/style.palette";
import { fontSize, fontWeight } from "@wizehub/common/theme/style.typography";
import styled from "styled-components";

export const StyledBarChartTooltipContainer = styled.div``;

export const StyledBarChartTooltipContentContainer = styled.div`
  background-color: ${greyScaleColour.secondaryMain};
  padding: 10px 10px;
  border-radius: 4px;
  text-align: center;
  min-width: 76px;
`;
export const StyledBarChartTooltipContent = styled(Typography)`
  color: ${greyScaleColour.grey90};
  font-size: ${fontSize.b2};
  font-weight: ${fontWeight.medium} !important;
  margin: 0 !important;
`;

export const StyledBarChartTooltipArrow = styled.div`
  position: absolute;
  width: 15px;
  height: 15px;
  background-color: ${greyScaleColour.secondaryMain};
  left: 40% !important;
  bottom: -6px;
  transform: rotate(45deg) !important;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  z-index: 0;
`;

export const StyledXAxisText = styled.text`
  font-size: ${fontSize.b2};
  font-weight: ${fontWeight.medium} !important;
  text-anchor: middle !important;
  fill: ${greyScaleColour.grey90} !important;
  ${respondTo.smDown} {
    text-anchor: end !important;
    /* transform: rotate(-45deg) !important; */
  }
`;
