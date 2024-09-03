import React, { useState } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { colors } from '@wizehub/common/theme/style.palette';
import { StyledError, StyledInputContainer } from '../textInput/styles';

interface Props {
  value?: string;
  onChange?: any;
  error?: string;
  disableErrorMode?: boolean;
  label?: string;
  maxWidth?: string;
}

const PasswordInput: React.FC<Props> = ({
  value,
  onChange,
  error,
  disableErrorMode,
  maxWidth,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const iconStyle = {
    color: colors.grey100,
  };
  return (
    <StyledInputContainer maxWidth={maxWidth}>
      <TextField
        {...props}
        value={value || ''}
        error={disableErrorMode ? undefined : !!error}
        onChange={(event) => {
          if (onChange) {
            onChange(event?.currentTarget?.value);
          }
        }}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                onClick={togglePassword}
                onMouseDown={(event) => event.preventDefault()}
              >
                {!showPassword ? (
                  <VisibilityOutlinedIcon style={iconStyle} />
                ) : (
                  <VisibilityOffOutlinedIcon style={iconStyle} />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {!disableErrorMode && error && (
        <StyledError variant="body2">{error}</StyledError>
      )}
    </StyledInputContainer>
  );
};

export default PasswordInput;
