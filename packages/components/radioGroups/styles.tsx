import { FormControlLabel } from '@mui/material';
import { greyScaleColour } from '@wizehub/common/theme/style.palette';
import styled from 'styled-components';

/* eslint-disable import/prefer-default-export */
export const StyledFormControlLabel = styled(FormControlLabel)<{disabled?: boolean}>`
  margin-left: 0px !important;
  color: ${greyScaleColour.grey100} !important;
  cursor: ${(prop) => prop?.disabled ? 'not-allowed' : 'pointer'} !important;
`;

export const StyledOptionContainer = styled.div`
  width: 100%;
`;
