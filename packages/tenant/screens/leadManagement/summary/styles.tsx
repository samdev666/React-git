import { Grid, Typography } from "@mui/material";
import { brandColour, greyScaleColour } from "@wizehub/common/theme/style.palette";
import { fontSize, fontWeight } from "@wizehub/common/theme/style.typography";
import FiberManualRecordOutlinedIcon from '@mui/icons-material/FiberManualRecordOutlined';
import styled from "styled-components";

export const StyledLegendMainContainer = styled(Grid)`
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
`;

export const StyledLegendSubContainer = styled(Grid)`
    display: flex;
    gap: 8px;
    align-items: center;
`;

export const StyledLegendDot = styled.div`
    border-radius: 50%;
    background-color: ${greyScaleColour.grey80};
    width: 8px;
    height: 8px;
`;

export const StyledLegentContent = styled(Typography)`
    font-size: ${fontSize.b2} !important;
    font-weight: ${fontWeight.medium} !important;
    color: ${greyScaleColour.grey100} !important;
`;

export const StyledFiberManualRecordOutlinedIcon = styled(FiberManualRecordOutlinedIcon)`
    color: ${brandColour.primaryMain} !important;
    width: 16px !important;
    height: 16px !important;
`;

export const StyledSubHeadingText = styled(Typography)`
    font-size: ${fontSize.b2} !important;
    font-weight: ${fontWeight.medium} !important;
    color: ${greyScaleColour.grey90} !important;
`;