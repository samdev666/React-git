import { Box, Typography } from '@mui/material';
import { brand, brandColour, greyScaleColour } from '@wizehub/common/theme/style.palette';
import { fontSize, fontWeight } from '@wizehub/common/theme/style.typography';
import styled from 'styled-components';

export const StyledCardContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20%;
`;

export const StyledIconContainer = styled.div`
    border-radius: 50%;
    background-color: #33C0FF;
    color: ${brand.white};
    position: absolute;
    width: 34px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    top: -15px;
`;

export const StyledIconText = styled(Typography)`
    color: ${brand.white}
    font-weight: ${fontWeight.medium};
`;

export const StyledInfoContainer = styled(Box)`
    display: grid;
    grip-template-rows: 1fr 1fr;
    gap: 1;
    overflow: hidden;
    box-sizing: border-box;
    padding: 16px;
    text-align: center;
    border: 2px solid ${brandColour.primary80};
    border-radius: 6px;
`;

export const StyledSubInfoItem = styled(Box)`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const StyledName = styled(Typography)`
    color: ${brandColour.primaryMain};
    font-weight: ${fontWeight.medium} !important;
    font-size: ${fontSize.h5} !important;
`;

export const StyledSubInfo = styled(Typography)`
    color: ${greyScaleColour.grey90};
    font-weight: ${fontWeight.light} !important;
    font-size: ${fontSize.b2} !important;
`;

export const StyledPersonCountContainer = styled.div`
    border-radius: 3px;
    border: 1px solid ${brandColour.primary90};
    background-color: ${brandColour.primary70};
    color: ${brand.white};
    position: absolute;
    width: 32px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    bottom: -12px;
`;

export const StyledPersonCountText = styled(Typography)`
    color: ${brandColour.primary90};
    font-weight: ${fontWeight.medium};
    font-size: ${fontSize.b2};
`;
