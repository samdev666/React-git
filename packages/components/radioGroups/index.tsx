import React, { useEffect, useState } from "react";
import { Grid, Radio, RadioGroup } from "@mui/material";
import { StyledFormControlLabel, StyledOptionContainer } from "./styles";
import { StyledError } from "../textInput/styles";
import { StyledCheckboxContainer } from "../checkbox/styles";
import { StyledLabel } from "../materialTextInput/styles";

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface Props {
  options: RadioOption[];
  value?: string;
  onChange: (value: string, name?: string) => void;
  error?: string;
  disableErrorMode?: boolean;
  required?: boolean;
  label?: string;
  subLabel?: string;
  isInitialValue?: boolean;
}

const CustomRadioGroup: React.FC<Props> = ({
  options,
  value,
  onChange,
  error,
  disableErrorMode,
  required,
  label,
  subLabel,
  isInitialValue = true,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>("");

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const renderRadioGroup = () => (
    <RadioGroup
      row
      value={selectedValue || (isInitialValue && options[0]?.value)}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        onChange((e.target as HTMLInputElement).value);
      }}
    >
      {options.map((option: RadioOption | RadioOption[]) => {
        return Array.isArray(option) ? (
          <StyledOptionContainer>
            {option?.map((item: RadioOption) => (
              <StyledFormControlLabel
                key={item.value}
                value={item.value}
                control={<Radio />}
                label={item.label}
                disabled={item?.disabled}
              />
            ))}
          </StyledOptionContainer>
        ) : (
          <StyledFormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
            disabled={option?.disabled}
          />
        );
      })}
    </RadioGroup>
  );

  return (
    <StyledCheckboxContainer>
      {label ? (
        <Grid container gap="6px">
          <Grid item xs={12}>
            <StyledLabel required={required}>{label}</StyledLabel>
          </Grid>
          <Grid item xs={12}>
            <Grid container display="flex" alignItems={"center"}>
              {subLabel && (
                <Grid item marginRight={"16px"}>
                  <StyledLabel>{subLabel}</StyledLabel>
                </Grid>
              )}
              <Grid item>{renderRadioGroup()}</Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        renderRadioGroup()
      )}
      {!disableErrorMode && error && (
        <StyledError variant="body2">{error}</StyledError>
      )}
    </StyledCheckboxContainer>
  );
};

export default CustomRadioGroup;
