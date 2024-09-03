import { Alert, Grid } from '@mui/material';
import { css, styled } from 'styled-components';

export const StyledForm = styled.form<{ hasPadding?: boolean }>`
  ${({ hasPadding }) => !hasPadding
    && css`
      margin: 24px;
    `}
  display: grid;
`;

export const StyledFormRow = styled(Grid)`
  gap: 16px;
  margin-bottom: 16px;
`;
export const StyledFormRowItem = styled(Grid)`
  display: flex;
  flex: 1;
`;

export const StyledFormError = styled(Alert)`
  width: 100% !important;
`;
