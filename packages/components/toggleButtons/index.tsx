import React from 'react';
import { greyScaleColour, otherColour } from '@wizehub/common/theme/style.palette';
import {
  StyledCancelIcon,
  StyledCheckCircleIcon,
  StyledContainer,
  StyledHiddenRadioButton,
  StyledIconWrapper,
  StyledRemoveCircleOutlinedIcon,
  StyledToggleButton,
  StyledToggleButtonGroup,
  StyledToggleButtonLabel,
} from './styles';
import { Grid } from '@mui/material';
import { StyledError } from '../textInput/styles';

export interface ToggleButtonOptions {
  id: string;
  label: string;
  positive: boolean;
  icon?: any;
}

interface Props {
  value: string;
  onChange?: (newValue: string) => void;
  label?: string;
  required?: boolean;
  options?: ToggleButtonOptions[];
  questionId?: string;
  error?: any;
  disableErrorMode?: boolean;
}

const ToggleButtonComponent: React.FC<Props> = ({
  onChange,
  label,
  required,
  value,
  options,
  questionId,
  error,
  disableErrorMode,
}) => {
  const handleChange = (newValue: string) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  const positiveOption = options?.find((val: ToggleButtonOptions) => val.positive);
  const negativeOption = options?.find((val: ToggleButtonOptions) => !val.positive);

  const activeValue = `${questionId}-${positiveOption?.label?.toLowerCase()}`;
  const inActiveValue = `${questionId}-${negativeOption?.label?.toLowerCase()}`;

  const isActive = value?.endsWith(positiveOption?.label?.toLowerCase() ?? '');
  const isInactive = value?.endsWith(negativeOption?.label?.toLowerCase() ?? '');

  const renderToggleButtons = () => (
    <StyledToggleButtonGroup value={value} backgroundColor={isInactive
      ? otherColour.errorBg
      : value === undefined ?
        greyScaleColour.grey70 : otherColour.successBg
    }>
      <StyledHiddenRadioButton
        type="radio"
        id={activeValue}
        value={activeValue}
        checked={isActive}
        onChange={() => handleChange(activeValue)}
      />
      <StyledToggleButton
        htmlFor={activeValue}
        color={isActive ? otherColour.successDefault : value === undefined ? greyScaleColour.grey100 : '#E7BDB4'}
      >
        {positiveOption?.label}
      </StyledToggleButton>

      <StyledIconWrapper value={value} color={isInactive
        ? otherColour.errorDefault
        : value === undefined ?
          greyScaleColour.grey100 : otherColour.successDefault}>
        {isActive ? <StyledCheckCircleIcon /> : value === undefined ? <StyledRemoveCircleOutlinedIcon /> : <StyledCancelIcon />}
      </StyledIconWrapper>

      <StyledHiddenRadioButton
        type="radio"
        id={inActiveValue}
        value={inActiveValue}
        checked={isInactive}
        onChange={() => handleChange(inActiveValue)}
      />
      <StyledToggleButton
        htmlFor={inActiveValue}
        color={isInactive ? otherColour.errorDefault : value === undefined ? greyScaleColour.grey100 : '#A9DFBD'}
      >
        {negativeOption?.label}
      </StyledToggleButton>
    </StyledToggleButtonGroup >
  );

  return (
    <StyledContainer>
      {label
        ? <Grid container display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
          <Grid item xs={8}>
            <StyledToggleButtonLabel required={required}>
              {label}
            </StyledToggleButtonLabel>
          </Grid>
          <Grid item xs={4} display={"flex"} justifyContent={"flex-end"}>
            {renderToggleButtons()}
          </Grid>
        </Grid>
        : renderToggleButtons()}
      {!disableErrorMode && error && <StyledError variant="body2">{error}</StyledError>}
    </StyledContainer>
  );
};

export default ToggleButtonComponent;