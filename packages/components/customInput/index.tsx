import React from "react";
import { StyledTeamScoreInputContainer } from "./styles";

interface Props {
  value?: string;
  onChange?: any;
}

const CustomInputComponent: React.FC<Props> = ({
  onChange,
  value,
  ...props
}) => {
  return (
    <StyledTeamScoreInputContainer
      value={value}
      onChange={(e) => {
        const { value } = e.target;
        if (onChange) {
          onChange(value);
        }
      }}
      {...props}
    />
  );
};

export default CustomInputComponent;
