import React, { useEffect, useState } from 'react';
import {
  Checkbox, CheckboxProps, FormControlLabel, FormControlLabelProps, FormGroup,
  Grid,
} from '@mui/material';
import { Option } from '@wizehub/common/models';
import { StyledError } from '../textInput/styles';
import { StyledCheckboxContainer, StyledFormControlLabel } from './styles';
import { StyledLabel } from '../materialTextInput/styles';

interface Props {
  options?: Option[];
  value?: any;
  onChange?: any;
  label?: string;
  error?: any;
  disableErrorMode?: boolean;
  size?: CheckboxProps['size'];
  labelPlacement?: FormControlLabelProps['labelPlacement'];
  required?: boolean;
  heading?: string
}

const CheckboxComponent: React.FC<Props> = ({
  options,
  value,
  onChange,
  disableErrorMode,
  error,
  label,
  size,
  labelPlacement,
  required,
  heading
}) => {
  const [checkedIds, setCheckedIds] = useState<any>([]);

  useEffect(() => {
    if (Array.isArray(value)) {
      setCheckedIds(value);
    }
  }, [value]);

  const handleChange = (optionId: any, isChecked: boolean) => {
    let updatedIds = [...checkedIds];
    if (isChecked) {
      updatedIds.push(optionId);
    } else {
      updatedIds = updatedIds.filter((id) => id !== optionId);
    }
    setCheckedIds(updatedIds);
    if (onChange) {
      onChange(updatedIds);
    }
  };

  const renderCheckbox = () => (
    options
      ? (
        <FormGroup>
          {options?.map((option) => (
            <StyledFormControlLabel
              key={option.id}
              control={(
                <Checkbox
                  size={size}
                  checked={checkedIds.includes(option.id)}
                  onChange={(e) => handleChange(option.id, e.target.checked)}
                />
              )}
              label={option?.label}
              labelPlacement={labelPlacement}
            />
          ))}
        </FormGroup >
      )
      : (
        <FormGroup>
          <StyledFormControlLabel
            control={(
              <Checkbox
                size={size}
                onChange={() => {
                  if (onChange) {
                    onChange(!value);
                  }
                }}
              />
            )}
            label={label}
            labelPlacement={labelPlacement}
          />
        </FormGroup>
      )
  )

  return (
    <StyledCheckboxContainer>
      {heading
        ? <Grid container gap="6px">
          <Grid item xs={12}>
            <StyledLabel required={required}>
              {heading}
            </StyledLabel>
          </Grid>
          <Grid item xs={12}>
            {renderCheckbox()}
          </Grid>
        </Grid>
        : renderCheckbox()}
      {!disableErrorMode && error && (
        <StyledError variant="body2">{error}</StyledError>
      )}
    </StyledCheckboxContainer>
  );
}

export default CheckboxComponent;
