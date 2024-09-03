import { InputLabel, Typography } from '@mui/material';
import { respondTo } from '@wizehub/common/theme/style.layout';
import { brand, brandColour, greyScaleColour } from '@wizehub/common/theme/style.palette';
import { fontSize, fontWeight } from '@wizehub/common/theme/style.typography';
import styled from 'styled-components';

export const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px
`;

export const StyledTitle = styled(InputLabel)`
    font-size: 18px !important;
    font-weight: ${fontWeight.medium} !important;
    color: ${greyScaleColour.secondaryMain} !important;
    ${respondTo.mdDown} {
        font-size: ${fontSize.h5} !important;
    }
`;

export const StyledSubTitle = styled(Typography)`
    font-size: ${fontSize.h5} !important;
    color: ${greyScaleColour.secondaryMain} !important;
    ${respondTo.mdDown} {
        font-size: ${fontSize.b1} !important;
    }
`;

export const StyledSubContainer = styled.div`
    display: flex;
    flex-direction: column !important;
    width: fit-content;
    gap: 16px;
`;

export const StyledResponseButton = styled.div`
    display: flex;
    gap: 14px;
`;

export const StyledTypographyTextContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const StyledTypographyText = styled(Typography)`
   font-size: ${fontSize.b2} !important;
   color: ${brandColour.primaryMain} !important;
`;

export const StyledResponseButtonContainer = styled.div<{ isSelected: boolean }>`
    border-radius: 6px;
    background-color: ${(props) => (props.isSelected ? brandColour.primary70 : greyScaleColour.grey60)} !important;
    width: 38px !important;
    height: 38px !important;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
`;

export const StyledResponseButtonTextContainer = styled.div<{ isSelected: boolean }>`
    border-radius: 50%;
    background-color: ${(props) => (props.isSelected ? brandColour.primaryMain : greyScaleColour.grey60)};
    border: 2px solid ${(props) => (props.isSelected ? brandColour.primaryMain : greyScaleColour.grey90)};
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const StyledResponseButtonText = styled(Typography) <{ isSelected: boolean }>`
    font-weight: ${fontWeight.medium} !important;
    color: ${(props) => (props.isSelected ? brand.white : greyScaleColour.grey90)};

`;
