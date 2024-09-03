import { Typography } from '@mui/material';
import { styled } from 'styled-components';
import { fontSize, fontWeight } from '@wizehub/common/theme/style.typography';
import {
  greyScaleColour,
  otherColour,
} from '@wizehub/common/theme/style.palette';

export const StyledToastContainer = styled.div<{ type?: string }>`
  display: flex;
  gap: 16px;
  align-items: center;
  /* justify-content: center; */
  padding-left: 18px;
  border: 1px solid
    ${(props) => (props.type === 'error'
    ? otherColour.errorDefault
    : otherColour.successDefault)};
  border-radius: 6px;
  flex: 1;
`;

export const StyledToastIcon = styled.img`
  width: 27px;
  height: 27px;
`;

export const StyledToastInfoContainer = styled.div`
  border-radius: 14px;
  display: flex;
  flex-direction: column;
`;

export const StyledToastInfoText = styled(Typography)`
  font-weight: ${fontWeight.semiBold} !important;
  font-size: ${fontSize.h5} !important;
  color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledToastInfoSubText = styled(Typography)`
  font-size: ${fontSize.b1} !important;
  color: ${greyScaleColour.secondaryMain} !important;
  font-weight: ${fontWeight.semiBold} !important;
`;
