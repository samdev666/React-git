import { Box, Typography } from "@mui/material";
import { brandColour, greyScaleColour } from "@wizehub/common/theme/style.palette";
import styled, { css } from "styled-components";
import FormatQuoteOutlinedIcon from '@mui/icons-material/FormatQuoteOutlined';
import { fontWeight } from "@wizehub/common/theme/style.typography";

export const StyledContainer = styled(Box) <{ isCompleted?: boolean, cursor?: string }>`
    border: 1px solid ${brandColour.primaryDark} !important;
    display: flex;
    flex-direction: column;
    flex: 1;
    border-radius: 10px;
    padding: 14px;
    background-color: ${brandColour.primaryDark};
    gap: 12px;
    max-width: ${(props) => props?.isCompleted && '50%'};
    cursor: pointer !important;
`;

export const StyledIconContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 38px;
    height: 38px;
    border-radius: 9.5px;
    background-color: ${greyScaleColour.white100} !important;
`;


export const StyledFormatQuoteOutlinedIcon = styled(FormatQuoteOutlinedIcon)`
    width: 20px !important;
    height: 20px !important;
    color: ${brandColour.primaryDark} !important;
`;

export const StyledIconHeading = styled(Typography)`
    font-weight: ${fontWeight.bold} !important;
    color: ${greyScaleColour.white100} !important;
`;

export const StyledContainerText = styled(Typography)`
    color: ${greyScaleColour.white100} !important;
`;

export const StyledWizeGapLink = styled.a`
    text-decoration: none;
`;