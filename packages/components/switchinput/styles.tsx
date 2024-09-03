import styled from "styled-components";
import {
  greyScaleColour,
  otherColour,
} from "@wizehub/common/theme/style.palette";
import { FormControlLabel, Typography } from "@mui/material";
import {
  fontSize,
  fontWeight,
  baseFontFamily,
} from "@wizehub/common/theme/style.typography";

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledError = styled(Typography)`
  color: ${otherColour.errorDefault};
`;

export const StyledFormControlLabel = styled(FormControlLabel)<{
  fontWeight?: string | number;
}>`
  margin-left: 0px !important;
  .MuiFormControlLabel-label {
    font-size: ${fontSize.b1};
    font-weight: ${(props) => props?.fontWeight || fontWeight.medium};
    font-family: ${baseFontFamily};
    color: ${greyScaleColour.secondaryMain};
    cursor: pointer;
  }
`;
