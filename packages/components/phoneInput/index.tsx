import React from "react";
import { PhoneInputProps } from "react-phone-input-2";
import { StyledPhoneInput, StyledPhoneInputContainer } from "./styles";
import { StyledError } from "../textInput/styles";

interface Props {
  error?: string;
  disableErrorMode?: boolean;
  onChange?: any;
  position?: string;
  required?: boolean;
}

const CustomPhoneInput: React.FC<Props & PhoneInputProps> = ({
  error,
  disableErrorMode,
  onChange,
  position,
  required,
  ...props
}) => {
  const handleChange = (value: string, data: any) => {
    if (onChange) {
      onChange(`${data?.dialCode}-${value?.slice(data?.dialCode.length)}`);
    }
  };

  return (
    <StyledPhoneInputContainer>
      <StyledPhoneInput
        specialLabel={`${required ? "Phone *" : "Phone"}`}
        position={position}
        {...props}
        country="au"
        searchPlaceholder="Search"
        hasError={!!error}
        onChange={handleChange}
        inputClass="phone-input-field"
      />
      {!disableErrorMode && error && (
        <StyledError variant="body2">{error}</StyledError>
      )}
    </StyledPhoneInputContainer>
  );
};

export default CustomPhoneInput;
