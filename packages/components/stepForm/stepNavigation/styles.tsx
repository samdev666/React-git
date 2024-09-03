import styled from 'styled-components';
import {
  brand,
  brandColour,
  greyScaleColour,
  otherColour,
} from '@wizehub/common/theme/style.palette';
import { fontSize, fontWeight } from '@wizehub/common/theme/style.typography';
import { Box, Grid, Typography } from '@mui/material';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

const getBackgroundColor = (completed?: boolean, active?: boolean) => {
  if (completed) return otherColour.successLight;
  if (active) return brandColour.primaryMain;
  return greyScaleColour.grey70;
};

const getColor = (completed?: boolean, active?: boolean) => {
  if (active || completed) return brand.white;
  return greyScaleColour.grey80;
};

const getBorderStyle = (completed?: boolean, active?: boolean) => {
  if (completed) return `1px solid ${otherColour.successLight}`;
  if (active) return `1px dashed ${brandColour.primaryMain}`;
  return '1px solid #E8E8E8';
};

const getHeightStyle = (active?: boolean) => {
  if (active) return '70px';
  return '32px';
};

export const StyledIconContainer = styled.div<{ active?: boolean, completed?: boolean }>`
  background-color: ${(props) => getBackgroundColor(props.completed, props.active)};
  color: ${(props) => getColor(props.completed, props.active)};
  transition: background-color color 2s ease-in-out !important;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledStepLine = styled.div<{ active?: boolean, completed?: boolean }>`
  height: 100%;
  border: ${(props) => getBorderStyle(props.completed, props.active)};
`;

export const StyledIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`;
export const StyledIndex = styled.div`
  font-size: ${fontSize.h3};
  font-weight: ${fontWeight.medium};
`;

export const StyledSteps = styled(Typography)`
    font-size: ${fontSize.b2} !important;
    font-weight: ${fontWeight.medium} !important;
    color: ${greyScaleColour.grey90};
`;

export const StyledStepsTitle = styled(Typography) <{ color: string }>`
    font-size: ${fontSize.h5} !important;
    font-weight: ${fontWeight.semiBold} !important;
    color: ${(props) => props.color};
`;

export const StyledStepsChipContainer = styled.div<{ backgroundColor: string }>`
    background-color: ${(props) => props.backgroundColor};
    padding: 4px !important;
    border-radius: 4px;
`;

export const StyledStepsChip = styled(Typography) <{ color: string }>`
  font-size: ${fontSize.b2} !important;
  color: ${(props) => props.color};
`;

export const StyledStepsDescription = styled(Typography)`
  font-size: ${fontSize.b2} !important;
  color: ${greyScaleColour.grey100};
`;

export const StyledContactUsContainer = styled(Grid)`
  display: flex;
  justify-content: center;  
`;

export const StyledContactUsSubContainer = styled(Grid)`
  display: flex;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid ${greyScaleColour.grey80};
  border-radius: 4px;
  height: fit-content !important;
`;

export const StyledQuestionMarkIconContainer = styled.div`
  width: 18px;
  height: 18px;
  border: 1px solid ${greyScaleColour.grey80};
  border-radius: 50%;
  text-align: center;
`;

export const StyledQuestionMarkIcon = styled(QuestionMarkIcon)`
  width: 15px !important;
  height: 15px !important;
  color: ${brandColour.primaryMain} !important;
`;

export const StyledHeadText = styled(Typography)`
  font-size: ${fontSize.b2} !important;
  color: ${greyScaleColour.secondaryMain};
`;

export const StyledContactUsText = styled(Typography)`
  font-size: ${fontSize.b2} !important;
  font-weight: ${fontWeight.medium} !important;
  color: ${greyScaleColour.grey100};
`;

export const StyledStepsBox = styled(Box)`
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none !important;
  }
`;

export const StyledStepsContainer = styled(Grid) <{ isStepCompleted?: boolean }>`
  gap: 16px !important;
  min-width: 240px;
  flex-wrap: nowrap !important;
  cursor: ${(props) => props?.isStepCompleted && 'pointer'};
`;