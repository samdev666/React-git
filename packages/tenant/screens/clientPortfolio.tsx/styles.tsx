import { Box, Typography } from "@mui/material";
import { greyScaleColour } from "@wizehub/common/theme/style.palette";
import { fontSize, fontWeight } from "@wizehub/common/theme/style.typography";
import styled from "styled-components";

export const StyledClientDataContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 0px 20px;
`;

export const StyledMiddleContainer = styled(Box)`
    display: flex;
    gap: 10px;
`;

export const StyledMiddleSubContainer = styled(Box)`
    flex: 1;
    padding: 10px 0px;
`;

export const StyledHeadingText = styled(Typography) <{ color: string }>`
    line-height: normal !important;
    font-size: ${fontSize.h5} !important;
    font-weight: ${fontWeight.medium} !important;
    color: ${({ color }) => color} !important;
`;

export const StyledFooter = styled(Box)`
    display: flex;
    gap: 16px;
`;

export const StyledFooterContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const StyledFooterHeading = styled(Typography)`
    line-height: normal !important;
    color: ${greyScaleColour.grey100} !important;
`;

export const StyledFooterText = styled(Typography)`
    line-height: normal !important;
    font-size: ${fontSize.h5} !important;
    font-weight: ${fontWeight.medium} !important;
    color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledTableRowFooter = styled(Typography)`
    font-weight: ${fontWeight.bold} !important;
    color: ${greyScaleColour.secondaryMain} !important;
`;