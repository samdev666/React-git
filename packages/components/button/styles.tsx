import Button from '@mui/material/Button';
import { respondTo } from '@wizehub/common/theme/style.layout';
import { fontSize } from '@wizehub/common/theme/style.typography';
import styled from 'styled-components';

/* eslint-disable import/prefer-default-export */
export const StyledButton = styled(Button)<{
  backgroundColor?: string;
}>`
  white-space: nowrap;
  background-color: ${(props) => props.backgroundColor} !important;
  ${respondTo.mdOnly} {
    padding: 11px 12px !important;
    font-size: ${fontSize.b1} !important;
    line-height: 20px !important;
  }
  ${respondTo.smOnly} {
    padding: 11px 12px !important;
    font-size: ${fontSize.b1} !important;
    line-height: 20px !important;
  }
`;
