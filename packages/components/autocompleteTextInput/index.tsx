import React, { useLayoutEffect, useRef, useState } from "react";
import { Autocomplete, ChipProps, Grid, TextFieldProps } from "@mui/material";
import { Option } from "@wizehub/common/models/baseEntities";
import { StyledError, StyledInputContainer } from "../textInput/styles";
import TextInput from "../textInput";
import messages from "../messages";
import {
  StyledChipCloseContainer,
  StyledChipContainer,
  StyledChipLabel,
  StyledCanceledIcon,
} from "./styles";
import { StyledErrorContainer, StyledLabel } from "../materialTextInput/styles";

interface Props {
  options: Option[];
  disabledOptions?: Option[];
  value?: Option | Option[];
  onChange?: any;
  error?: string;
  disableErrorMode?: boolean;
  enableClearable?: boolean;
  multiple?: boolean;
  searchOptions?: (value?: string) => void;
  isHeader?: boolean;
  disableUnderline?: boolean;
  onNestedFieldChange?: any;
  isLimit?: boolean;
  selectedOption?: Option;
  disabled?: boolean;
  externalLabel?: boolean;
}

const MultiSelectChip: React.FC<ChipProps> = ({ label, onDelete }) => (
  <StyledChipContainer>
    <StyledChipLabel title={typeof label === "string" ? label : undefined}>
      {label}
    </StyledChipLabel>
    <StyledChipCloseContainer onClick={onDelete}>
      <StyledCanceledIcon />
    </StyledChipCloseContainer>
  </StyledChipContainer>
);

const MaterialAutocompleteInput: React.FC<Props & TextFieldProps> = ({
  value,
  onChange,
  error,
  disableErrorMode,
  options,
  enableClearable,
  multiple,
  disabledOptions,
  searchOptions,
  isHeader,
  disableUnderline,
  onNestedFieldChange,
  selectedOption,
  disabled = false,
  isLimit = false,
  externalLabel = false,
  ...props
}) => {
  const autoCompleteRef = useRef(null);
  const [tagLimit, setTagLimit] = useState(2);
  useLayoutEffect(() => {
    if (autoCompleteRef?.current?.clientWidth) {
      setTagLimit(
        isLimit
          ? Math.floor(autoCompleteRef?.current?.clientWidth / 172)
          : Math.ceil(autoCompleteRef?.current?.clientWidth / 172)
      );
    }
  }, [autoCompleteRef]);
  let finalOptions = [...(options || [])];
  if (
    selectedOption &&
    !finalOptions?.some((item) => item.id === selectedOption?.id)
  ) {
    finalOptions.push(selectedOption);
  }
  if (multiple && Array.isArray(value)) {
    finalOptions = finalOptions?.filter(
      (opt) => !value?.some((v) => v?.id?.toString() === opt?.id?.toString())
    );
  }

  const renderAutoComplete = () => (
    <Autocomplete
      ref={autoCompleteRef}
      options={finalOptions}
      limitTags={tagLimit}
      disableClearable={!enableClearable}
      disableCloseOnSelect={multiple}
      multiple={multiple}
      noOptionsText={messages?.general?.noOptionsText}
      onInputChange={(event, value) => {
        if (searchOptions) {
          searchOptions(value);
        }
      }}
      value={value || (multiple ? [] : null)}
      onChange={(event, newValue) => {
        if (onChange) {
          onChange(newValue);
        }
        if (onNestedFieldChange) {
          onNestedFieldChange(newValue);
        }
      }}
      getOptionDisabled={(option: Option) =>
        disabledOptions?.some(
          (opt) => opt?.id?.toString() === option?.id?.toString()
        )
      }
      isOptionEqualToValue={(option: Option, value: Option) =>
        option?.id?.toString() === value?.id?.toString()
      }
      renderInput={(params: any) => (
        <TextInput
          {...props}
          {...params}
          error={disableErrorMode ? undefined : !!error}
          label={externalLabel ? "" : props?.label}
          isHeader={isHeader}
          InputProps={{
            ...params.InputProps,
            disableUnderline: { disableUnderline },
          }}
        />
      )}
      renderTags={(value, getTagProps) =>
        value.map((option: Option, index) => (
          <MultiSelectChip
            key={option.id}
            label={option.label}
            {...getTagProps({ index })}
          />
        ))
      }
      disabled={disabled}
    />
  );

  return (
    <StyledInputContainer isHeader={isHeader}>
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
            <Grid item xs={12}>
              {renderAutoComplete()}
              <StyledErrorContainer>
                {!disableErrorMode && (
                  <StyledError variant="body2">{error}</StyledError>
                )}
              </StyledErrorContainer>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          {renderAutoComplete()}
          {!disableErrorMode && error && (
            <StyledError variant="body2">{error}</StyledError>
          )}
        </>
      )}
    </StyledInputContainer>
  );
};

export default MaterialAutocompleteInput;
