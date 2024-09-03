import { Grid, Typography } from "@mui/material";
import { greyScaleColour } from "@wizehub/common/theme/style.palette";
import { fontWeight } from "@wizehub/common/theme/style.typography";
import styled from "styled-components";

export const StyledLegendContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

export const StyledContentContainer = styled(Grid)`
    gap: 16px;
    display: flex;
    align-items: center;
`;

export const StyledDot = styled.div<{ backgroundColor: string }>`
    border-radius: 50%;
    background-color: ${({ backgroundColor }) => backgroundColor};
    width: 11px;
    height: 11px;
`;

export const StyledLegendText = styled(Typography)`
    font-weight: ${fontWeight.medium} !important;
    color: ${greyScaleColour.grey90} !important;
`;

export const StyledTooltipContainer = styled.div`
    display: flex;
    gap: 16px;
    padding: 10px 16px;
    border-radius: 4px;
    background: #fff;
    box-shadow: 0 1px 2px rgba(0,0,0,0.15);
`;

export const StyledTooltipText = styled(Typography)`
    font-weight: ${fontWeight.bold} !important;
    color: ${greyScaleColour.secondaryMain} !important;
`;