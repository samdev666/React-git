import styled from 'styled-components';
import { Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { greyScaleColour } from '@wizehub/common/theme/style.palette';
import { fontSize, fontWeight } from '@wizehub/common/theme/style.typography';
import { respondTo } from '@wizehub/common/theme/style.layout';

export const StyledStepperContainer = styled.div`
  display: flex;
  gap: 2px;
  align-items: center;
`;

export const StyledStepperText = styled(Typography)<{ active?: boolean }>`
  font-size: ${fontSize.h5} !important;
  font-weight: ${fontWeight.regular} !important;
  line-height: 24px !important;
  color: ${(prop) => (!prop.active
    ? greyScaleColour.grey100
    : greyScaleColour.secondaryMain)} !important;
  cursor: ${(prop) => (!prop.active ? 'pointer' : 'inherit')} !important;
  ${respondTo.mdDown} {
    font-size: ${fontSize.b1} !important;
  }
`;

export const StyledStepperIcon = styled(ChevronRightIcon)`
  color: ${greyScaleColour.grey100} !important;
`;
