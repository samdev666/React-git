import { Box, Grid, Typography } from "@mui/material";
import { greyScaleColour } from "@wizehub/common/theme/style.palette";
import { fontSize, fontWeight } from "@wizehub/common/theme/style.typography";
import styled from "styled-components";

export const StyledMainContainer = styled(Box) <{ gap?: string }>`
    display: flex;
    flex-direction: column;
    gap: ${(props) => props?.gap || '30px'};
    padding: 0px 0px 20px 0px;
`;

export const StyledBoxContainer = styled(Box) <{ gap?: string }>`
    display: flex;
    gap: ${(props) => props?.gap || '16px'};
`;

export const StyledSubBoxContainer = styled(Box)`
    flex: 1;
    border: 1px solid ${greyScaleColour.grey80};
    border-radius: 10px;
    padding: 20px 0px;
`;

export const StyledItemContainer = styled(Grid)`
    display: flex;
    flex-direction: column !important;
    gap: 20px;
`;

export const StyledHeadingItem = styled(Grid)`
    padding: 0px 20px;
`;

export const StyledHeadingText = styled(Typography)`
    font-size: ${fontSize.h5} !important;
    font-weight: ${fontWeight.semiBold} !important;
    color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledChartItem = styled(Grid)`
    display: flex;
    justify-content: center;
    padding: 0px 30px;
`;

export const StyledNoFeeHistoryContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 311px;
`;

export const StyledNoFeeHistoryText = styled(Typography)`
    font-weight: ${fontWeight.medium} !important;
    color: ${greyScaleColour.grey100} !important;
`;