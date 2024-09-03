import { styled } from 'styled-components';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import {
  brandColour,
  greyScaleColour,
} from '@wizehub/common/theme/style.palette';
import { fontSize, fontWeight } from '@wizehub/common/theme/style.typography';

export const StyledChipContainer = styled.div`
  display: flex;
  padding: 2px 5px 2px 10px;
  justify-content: center;
  align-items: center;
  gap: 5px;
  border-radius: 60px;
  background: ${brandColour.primaryMain};
  margin-right: 5px;
  margin-bottom: 5px;
`;

export const StyledChipLabel = styled.span`
  color: ${greyScaleColour.white100};
  font-size: ${fontSize.b2};
  font-weight: ${fontWeight.medium};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 72px;
`;

export const StyledChipCloseContainer = styled.div`
  cursor: pointer;
  display: flex;
`;

export const StyledCanceledIcon = styled(CancelOutlinedIcon)`
  width: 18px;
  color: ${greyScaleColour.white100};
`;
