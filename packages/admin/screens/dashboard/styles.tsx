import { Box, Grid, Typography } from '@mui/material';
import { brandColour, greyScaleColour, otherColour } from '@wizehub/common/theme/style.palette';
import { fontSize, fontWeight } from '@wizehub/common/theme/style.typography';
import styled from 'styled-components';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';

export const StyledNotificationContainer = styled(Box)`
    background-color: ${brandColour.primary70};
    border-radius: 10px;
    padding: 20px;
    height: calc(100% - 40px);
`;

export const StyledTableContainer = styled(Box)`
    border: 1px solid ${greyScaleColour.grey80};
    border-radius: 10px;
`;

export const StyledServicesContainer = styled(Box) < { padding?: string }>`
    border: 1px solid ${greyScaleColour.grey80};
    border-radius: 10px;
    padding: ${({ padding }) => padding || '20px'};
    height: 99%;
`;

export const StyledCountsBox = styled(Box) < { marginBottom?: string }>`
    border: 1px solid ${greyScaleColour.grey80};
    border-radius: 10px;
    padding: 10px;
    height: calc(50% - 10px);
    margin-bottom: ${({ marginBottom }) => marginBottom || '0px'};
`;

export const StyledInfoContainer = styled.div`
    // padding: 20px;
    padding: 30px;
`;

export const StyledInfoTextDiv = styled.div< { marginBottom?: string }>`
    margin-bottom: ${({ marginBottom }) => marginBottom || '0px'};
`;

export const StyledInfoText = styled(Typography)`
    font-weight: ${fontWeight.medium} !important;
    font-size: ${fontSize.h2} !important;
    color: ${brandColour.primaryMain};
`;

export const StyledGradientDiv = styled.div`
    background: linear-gradient(180deg, #4064FF, transparent);
    border-radius: 50%;
    width: 11px;
    height: 11px;
    display: inline-block !important;
`;

export const StyledBox = styled(Box)`
    display: flex;
`;

export const StyledBoxItem = styled(Box)`
    flex: 1;
    padding-right: 20px;
`;

export const StyledCountsBoxContainer = styled(Box)`
    flex: 1;
    padding-right: 20px;
    display: flex;
    flex-direction: column;
`;

export const StyledCountsNumberText = styled(Typography)`
    font-size: ${fontSize.h1} !important;
    font-weight: ${fontWeight.medium} !important;
`;

export const StyledCountIconContainer = styled.div`
    border-radius: 10px;
    padding: 10px;
    background-color: ${brandColour.primary70};
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const StyledCorporateFareIcon = styled(CorporateFareIcon)`
    width: 20px;
    height: 20px;
    color: ${brandColour.primaryDark}
`;

export const StyledSupervisedUserCircleIcon = styled(SupervisedUserCircleIcon)`
    width: 20px;
    height: 20px;
    color: ${brandColour.primaryDark}
`;

export const StyledCountsTypographyContainer = styled(Box)`
    margin-bottom: 10px;
`;

export const StyledCountsTypography = styled(Typography)`
    font-weight: ${fontWeight.medium} !important;
`;

export const StyledCountsPercentageContainer = styled(Grid) <{ backgroundColor: string }>`
    background-color:${({ backgroundColor }) => backgroundColor};
    padding: 2px 7px 2px 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    border-radius: 10px;
`;

export const StyledArrowOutwardIcon = styled(ArrowOutwardIcon)`
    width: 15px !important;
    height: 15px !important;
    color: ${otherColour.successDefault};
`;

export const StyledArrowIconText = styled(Typography) < { color: string }>`
    color:${({ color }) => color};
`;

export const StyledCountsTimeText = styled(Typography)`
    color: #00000059;
    font-weight: ${fontWeight.medium} !important;
`;

export const StyledCallReceivedIcon = styled(CallReceivedIcon)`
    width: 15px !important;
    height: 15px !important;
    color: ${otherColour.errorDefault};
`;

export const StyledTableHeading = styled(Typography)`
    font-weight: ${fontWeight.semiBold} !important;
    font-size: ${fontSize.h5} !important;
`;

export const StyledTableViewText = styled(Typography)`
    font-weight: ${fontWeight.medium} !important;
    font-size: ${fontSize.h5} !important;
    color: ${brandColour.primaryMain};
`;
