import { Typography } from "@mui/material";
import { greyScaleColour } from "@wizehub/common/theme/style.palette";
import { fontSize, fontWeight } from "@wizehub/common/theme/style.typography";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import styled from "styled-components";

export const StyledCustomChartLegend = styled(Typography)`
  font-size: ${fontSize.b2} !important;
  font-weight: ${fontWeight.medium} !important;
  color: ${greyScaleColour.grey90} !important;
`;

export const StyledCustomChartHeading = styled(Typography)`
  font-size: ${fontSize.h5} !important;
  font-weight: ${fontWeight.semiBold} !important;
  color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledFiberManualRecordOutlinedIcon = styled(
  FiberManualRecordIcon
)<{ color: string }>`
  width: 13px !important;
  height: 13px !important;
  color: ${({ color }) => color} !important;
`;
