import { Card, CardContent, Typography } from '@mui/material';
import styled from 'styled-components';
import { greyScaleColour } from '@wizehub/common/theme/style.palette';

export const StyledCard = styled(Card)<{ bordered?: boolean }>``;

export const StyledCardContent = styled(CardContent)`
  height: 100%;
  width: 100%;
  &::-webkit-scrollbar {
    width: 6px !important;
  }
  &::-webkit-scrollbar-track {
    background-color: #f2f2f2;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #999;
  }
`;

export const StyledCardHeader = styled.div<{ noHeaderPadding?: boolean }>`
  padding: ${({ noHeaderPadding }) => (noHeaderPadding ? '0px' : '14px 0')} !important;
  position: relative;
`;
export const CardTitle = styled(Typography)`
  color: ${greyScaleColour.secondaryMain};
`;
