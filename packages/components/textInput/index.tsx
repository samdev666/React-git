import React from 'react';
import { TextFieldProps } from '@mui/material';
import { StyledError, StyledInputContainer, StyledTextField } from './styles';

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disableErrorMode?: boolean;
  maxWidth?: string;
  isHeader?: boolean;
}

const TextInput: React.FC<Props & TextFieldProps> = ({
  value,
  onChange,
  error,
  disableErrorMode,
  maxWidth,
  isHeader,
  ...props
}) => (
  <StyledInputContainer isHeader={isHeader} maxWidth={maxWidth}>
    <StyledTextField
      {...props}
      value={value || ''}
      error={disableErrorMode ? undefined : !!error}
      onChange={(event) => {
        if (onChange) {
          onChange(event?.currentTarget?.value);
        }
      }}
    />
    {!disableErrorMode && error && (
      <StyledError variant="body2">{error}</StyledError>
    )}
  </StyledInputContainer>
);

export default TextInput;
