import { greyScaleColour } from '@wizehub/common/theme/style.palette';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import styled from 'styled-components';
import { InputLabel } from '@mui/material';
import { fontSize } from '@wizehub/common/theme/style.typography';
import RemoveCircleOutlinedIcon from '@mui/icons-material/RemoveCircleOutlined';

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100% !important;
`;

export const StyledToggleButtonGroupContainer = styled.div`
  position: relative;
`;

export const StyledToggleButtonGroup = styled.div<{ value: string, backgroundColor: string }>`
  display: flex;
  background: ${({ backgroundColor }) => backgroundColor};
  transition: all 1s ease;
  border-radius: 4px;
  height: 40px;
  width: fit-content;
`;

export const StyledHiddenRadioButton = styled.input`
  display: none;
`;

export const StyledToggleButton = styled.label<{ color: string }>`
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(props) => props.color};
    font-weight: 400;
    cursor: pointer;
    user-select: none;
    transition: all 1s ease;
    padding: 8px 16px 8px 16px !important;
    font-size: 16px !important;
`;

export const StyledIconWrapper = styled.div<{ value: string, color?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ color }) => color};
  pointer-events: none;
  transition: all 1s ease;
`;

export const StyledCheckCircleIcon = styled(CheckCircleIcon)`
    width: 22px;
    height: 22px;
    transition: all 0.2s ease;
`;

export const StyledRemoveCircleOutlinedIcon = styled(RemoveCircleOutlinedIcon)`
    width: 22px;
    height: 22px;
    transition: all 0.2s ease;
`;

export const StyledCancelIcon = styled(CancelIcon)`
    width: 22px;
    height: 22px;
    transition: all 0.2s ease;
`;

export const StyledToggleButtonLabel = styled(InputLabel)`
    font-size: ${fontSize.h5} !important;
    color: ${greyScaleColour.secondaryMain} !important;
    white-space: wrap !important;
`;
