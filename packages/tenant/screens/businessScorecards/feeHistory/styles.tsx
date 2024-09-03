import { Typography } from "@mui/material";
import { greyScaleColour } from "@wizehub/common/theme/style.palette";
import { fontSize, fontWeight } from "@wizehub/common/theme/style.typography";
import styled from "styled-components";

export const StyledFeeHistoryHeading = styled(Typography)`
    font-size: ${fontSize.h3} !important;
    font-weight: ${fontWeight.medium} !important;
    color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledEbitdaPercentText = styled(Typography)`
    font-size: ${fontSize.h5} !important;
    font-weight: ${fontWeight.medium} !important;
    color: ${greyScaleColour.secondaryMain} !important;  
`;