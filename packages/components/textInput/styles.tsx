import { TextField, Typography } from '@mui/material';
import styled, { css } from 'styled-components';
import { otherColour } from '@wizehub/common/theme/style.palette';
import { respondTo } from '@wizehub/common/theme/style.layout';

export const StyledInputContainer = styled.div<{
  maxWidth?: string;
  isHeader?: boolean;
}>`
  width: ${(prop) => !prop.isHeader && '100%'};
  ${({ maxWidth }) => maxWidth
    && css`
      max-width: ${maxWidth} !important;
      & .MuiFormControl-root {
        width: 100%;

        & .MuiInputBase-root {
          max-width: ${maxWidth} !important;
          height: 48px !important;
        }

        ${respondTo.mdDown} {
          width: 100%;
          max-width: 340px !important;
        }
      }
    `}
`;

export const StyledError = styled(Typography)`
  text-align: left;
  color: ${otherColour.errorDefault};
  margin-top: 8px !important;
`;

export const StyledTextField = styled(TextField)`
  input {
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      display: none;
      margin: 0;
    }
  }
`;
