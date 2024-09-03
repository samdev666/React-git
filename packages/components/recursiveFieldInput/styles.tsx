import styled from 'styled-components';
import { Typography } from '@mui/material';
import { greyScaleColour, otherColour } from '@wizehub/common/theme/style.palette';

export const StyledDynamicFieldContainer = styled.div`
  width: 100%;
  margin-top: 9px;
`;

export const StyledFieldList = styled.div<{ idx?: number, lengthOfList?: number, marginBottom?: string }>`
  display: flex;
  flex-direction: column;
  margin-bottom: ${(props) => props?.marginBottom || '16px'};
  border-bottom: ${({ lengthOfList, idx }) => (lengthOfList > 1 && idx !== lengthOfList - 1) && `1px dashed ${greyScaleColour.grey70}`};
`;

export const StyledFieldItem = styled.div<{ idx?: number }>`
`;

export const StyledCrossButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
`;

export const StyledRemoveText = styled(Typography)`
  color: ${otherColour.errorDefault} !important;
  cursor: pointer;
`;

export const StyledDivider = styled.div`
  margin-bottom: 16px;
`;
