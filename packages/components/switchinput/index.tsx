import { Switch, SwitchProps, styled } from '@mui/material';
import React from 'react';
import {
  brandColour,
  colors,
  greyScaleColour,
} from '@wizehub/common/theme/style.palette';
import { StyledContainer, StyledError, StyledFormControlLabel } from './styles';

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 44,
  height: 20,
  padding: 0,
  marginLeft: 12,
  '& .MuiSwitch-switchBase': {
    padding: 1,
    margin: 1,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(23px)',
      color: colors.white,
      '& + .MuiSwitch-track': {
        backgroundColor: brandColour.primaryMain,
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: brandColour.primaryMain,
      border: `6px solid ${greyScaleColour.white100}`,
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.grey[100],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.7,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 16,
    height: 16,
  },
  '& .MuiSwitch-track': {
    borderRadius: 20 / 2,
    backgroundColor: '#E9E9EA',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

interface Props {
  label?: string;
  value?: string;
  onChange?: (value?: boolean) => void;
  error?: string;
  disableErrorMode?: boolean;
  required?: boolean;
  readOnly?: boolean;
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
  fontWeight?: string | number;
}

const SwitchInput: React.FC<Props> = ({
  label,
  error,
  value,
  onChange,
  disableErrorMode,
  readOnly,
  labelPlacement,
  fontWeight,
  ...props
}) => (
  <StyledContainer>
    <StyledFormControlLabel
      {...props}
      control={<IOSSwitch checked={!!value} />}
      label={label}
      labelPlacement={labelPlacement || 'start'}
      onChange={() => {
        if (onChange && !readOnly) {
          onChange(!value);
        }
      }}
      fontWeight={fontWeight}
    />
    {!disableErrorMode && (
      <StyledError variant="body2">{error || ''}</StyledError>
    )}
  </StyledContainer>
);

export default SwitchInput;
