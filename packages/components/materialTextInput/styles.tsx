import { InputLabel, TextField, Typography } from '@mui/material';
import styled, { css } from 'styled-components';
import { greyScaleColour, otherColour } from '@wizehub/common/theme/style.palette';
import { fontSize } from '@wizehub/common/theme/style.typography';

export const StyledInputContainer = styled.div<{ minWidth?: string, maxWidth?: string }>`
  width: 100%;
  min-width: ${(props) => props.minWidth};
   ${({ maxWidth }) => maxWidth
    && css`
      & .MuiFormControl-root {
        width: 100%;

        & .MuiInputLabel-root {
          max-width: ${maxWidth} !important;          
        };
        & .MuiInputLabel-shrink {
          max-width: 100% !important;
        }
      }
    `}
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

export const StyledError = styled(Typography)`
  color: ${otherColour.errorDefault};
  margin-top: 8px !important;
`;

export const StyledLabel = styled(InputLabel)`
    font-size: ${fontSize.h5} !important;
    color: ${greyScaleColour.secondaryMain} !important;
    white-space: normal !important;
`;

export const StyledSubLabel = styled(InputLabel)`
    color: ${greyScaleColour.grey100} !important;
    overflow: visible !important;
    text-overflow: unset !important;
`;

export const StyledErrorContainer = styled.div`
  height: 12px;
`;
