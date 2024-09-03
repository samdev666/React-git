import { Typography } from "@mui/material";
import {
  greyScaleColour,
  otherColour,
} from "@wizehub/common/theme/style.palette";
import { fontSize, fontWeight } from "@wizehub/common/theme/style.typography";
import styled from "styled-components";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export const StyledTeamScoreMonthTypography = styled(Typography)`
  font-size: ${fontSize.b1} !important;
  font-weight: ${fontWeight.medium} !important;
  color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledTeamScoreYtdAverageTypography = styled(Typography)`
  font-size: ${fontSize.b1} !important;
  font-weight: ${fontWeight.bold} !important;
  color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledDeleteTeamDataIcon = styled(DeleteOutlineIcon)`
  font-size: 21px !important;
  color: ${otherColour.errorDefault} !important;
  cursor: pointer;
`;
