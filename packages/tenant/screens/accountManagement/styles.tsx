import { FormControlLabel } from '@mui/material';
import { greyScaleColour } from '@wizehub/common/theme/style.palette';
import {
  baseFontFamily,
  fontSize,
  fontWeight,
} from '@wizehub/common/theme/style.typography';
import styled from 'styled-components';

export const StyledUserLoginFormControlLabel = styled(FormControlLabel)<{
  fontWeight?: string | number;
}>`
  margin-right: auto !important;
  .MuiFormControlLabel-label {
    font-size: ${fontSize.b1};
    font-weight: ${(props) => props?.fontWeight || fontWeight.medium};
    font-family: ${baseFontFamily};
    /* color: ${greyScaleColour.grey90}; */
    cursor: pointer;
  }
`;
