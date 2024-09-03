import { Troubleshoot } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { greyScaleColour } from "@wizehub/common/theme/style.palette";
import { fontSize, fontWeight } from "@wizehub/common/theme/style.typography";
import styled from "styled-components";

export const StyledFab5TeamNameTypography = styled(Typography)`
  font-size: ${fontSize.b1} !important;
  font-weight: ${fontWeight.bold} !important;
  color: ${greyScaleColour.secondaryMain} !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: pre !important;
`;

export const StyledTeamMonthTotalTypography = styled(Typography)`
  font-size: ${fontSize.b1} !important;
  font-weight: ${fontWeight.bold} !important;
  color: ${greyScaleColour.secondaryMain} !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
`;

export const StyledBenchmarksNoteText = styled(Typography)`
  font-size: ${fontSize.h5} !important;
  font-weight: ${fontWeight.medium} !important;
  line-height: 24px !important;
`;
