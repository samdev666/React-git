import { Tooltip } from "@mui/material";
import React from "react";
import {
  StyledEntitySubTextTypography,
  StyledResponsiveInfoIcon,
} from "./styles";
import { Id } from "@wizehub/common/models";

interface Props {
  textComponent: React.ReactElement;
  text: string | Id;
}

const TooltipComponent: React.FC<Props> = ({ text, textComponent }) => {
  return text !== "-" ? (
    <Tooltip
      title={
        <StyledEntitySubTextTypography>{text}</StyledEntitySubTextTypography>
      }
      arrow
      placement="right"
    >
      {textComponent}
    </Tooltip>
  ) : (
    textComponent
  );
};

export default TooltipComponent;
