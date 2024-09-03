import React from "react";
import { Grid, InputLabel, TextField, TextFieldProps } from "@mui/material";
import {
  StyledError,
  StyledErrorContainer,
  StyledInputContainer,
  StyledLabel,
  StyledSubLabel,
  StyledTextField,
} from "./styles";

interface Props {
  value?: string;
  onChange?: any;
  error?: string;
  disableErrorMode?: boolean;
  minWidth?: string;
  onNestedFieldChange?: any;
  isIntegerType?: boolean;
  externalLabel?: boolean;
  subLabel?: string;
  negative?: boolean;
}

const temp = (str: String) => {
  let negativeCount = 0;
  for(let i = 0; i < str.length; i++){
    if(str.charAt(i) === "-"){
      negativeCount++;
    }
  }
  return negativeCount;
}

const MaterialTextInput: React.FC<Props & TextFieldProps> = ({
  value,
  onChange,
  error,
  negative = true,
  disableErrorMode,
  onNestedFieldChange,
  isIntegerType = false,
  externalLabel = false,
  ...props
}) => {
  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { value } = event.currentTarget;
    console.log(event);
    if (isIntegerType) {
      if (/^\d*$/.test(value)) {
        if (onChange) {
          onChange(value);
        }
        if (onNestedFieldChange) {
          onNestedFieldChange(value);
        }
      }
    } else {
      if (onChange) {
        onChange(value);
      }
      if (onNestedFieldChange) {
        onNestedFieldChange(value);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
    ];

    if (isIntegerType) {
      if (!/^\d$/.test(event.key) && !allowedKeys.includes(event.key)) {
        event.preventDefault();
      }
    } else {
      const inputType = (event?.target as HTMLInputElement)?.type;

      if (inputType === "number") {
        // Prevent additional negative signs
        if (negative && event.key === "-") {
          const currentValue = (event.target as HTMLInputElement).value;
          const negativeSignCount = (currentValue.match(/-/g) || [])?.length;
          // console.log(currentValue, "currentValue");
          // console.log(negativeSignCount, "negativeSignCount");
          // console.log(currentValue.match(/-/g), "currentValue.match(/-/g)");
          // console.log(negativeSignCount)

          if (negativeSignCount > 0) {
            event.preventDefault();
          }
        }

        // Prevent 'e', 'E', and '+' characters
        if (["e", "E", "+",].includes(event.key)) {
          event.preventDefault();
        }
      }
    }
  };

  const renderTextField = () => (
    <StyledTextField
      {...props}
      label={externalLabel ? "" : props?.label}
      value={value || ""}
      error={disableErrorMode ? undefined : !!error}
      onChange={(e) => {
        console.log(e)
        handleChange(e)}}
      onKeyDown={handleKeyDown}
    />
  );

  return (
    <StyledInputContainer minWidth={props?.minWidth}>
      {externalLabel ? (
        <>
          <Grid container gap="6px">
            {props?.label && (
              <Grid item xs={12}>
                <StyledLabel required={props?.required}>
                  {props?.label}
                </StyledLabel>
              </Grid>
            )}
            {props?.subLabel && (
              <Grid item xs={12}>
                <StyledSubLabel>{props?.subLabel}</StyledSubLabel>
              </Grid>
            )}
            <Grid item xs={12}>
              {renderTextField()}
            </Grid>
          </Grid>
          <StyledErrorContainer>
            {!disableErrorMode && (
              <StyledError variant="body2">{error}</StyledError>
            )}
          </StyledErrorContainer>
        </>
      ) : (
        <>
          {renderTextField()}
          {!disableErrorMode && error && (
            <StyledError variant="body2">{error}</StyledError>
          )}
        </>
      )}
    </StyledInputContainer>
  );
};

export default MaterialTextInput;
