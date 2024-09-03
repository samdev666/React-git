import { Typography } from "@mui/material";
import { fontSize, fontWeight } from "@wizehub/common/theme/style.typography";
import styled from "styled-components";
import { StyledResponsiveIcon } from "../table/styles";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { greyScaleColour } from "@wizehub/common/theme/style.palette";

export const StyledEntitySubTextTypography = styled(Typography)`
  font-size: ${fontSize.b2} !important;
  font-weight: ${fontWeight.medium} !important;
`;

const StyledInfoIcon = styled(InfoOutlinedIcon)`
  color: ${greyScaleColour.grey90} !important;
`;

export const StyledResponsiveInfoIcon = StyledResponsiveIcon(StyledInfoIcon);
