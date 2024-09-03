import { Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { fontWeight } from '@wizehub/common/theme/style.typography';
import { styled } from 'styled-components';

/* eslint-disable import/prefer-default-export */
export const StyledDatePicker = styled(DatePicker) <{ fullWidth?: boolean }>`
  .MuiInputBase-input {
    width: 100%;
    /* min-width: 344px; */
  }
`;

export const StyledMonthContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 8px;
  padding-left: 24px;
  padding-right: 12px;
  max-height: 30px;
  min-height: 30px;
`;

export const StyledMonthText = styled(Typography)`
  display: flex;
  font-weight: ${fontWeight.medium} !important;
  align-items: center;
  margin-right: auto !important;
  overflow: hidden !important;
`;
