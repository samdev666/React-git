import styled from 'styled-components';
import {
  brandColour,
  greyScaleColour,
} from '@wizehub/common/theme/style.palette';
import { lightenColor } from '@wizehub/common/utils/constants';

export const StyledContainer = styled.div`
  border-radius: 5px;
  background: ${greyScaleColour.grey60};
  height: 30px;
  margin: 25px 0;
  box-shadow: inset 0px 5px 5px -5px rgba(0, 0, 0, 0.3);
`;
export const StyledBarWrapper = styled.div`
  background: ${greyScaleColour.grey100};
`;
export const StyledProgressBar = styled.div<{ width?: number }>`
  width: ${(props) => (props.width ? props.width : 0)}%;
  height: 100%;
  border-radius: 5px;
  background: repeating-linear-gradient(
    45deg,
    ${brandColour.primaryMain},
    ${brandColour.primaryMain} 20px,
    /* Width of each block */ ${lightenColor(brandColour.primaryMain, 15)} 20px,
    /* Width of each block */ ${lightenColor(brandColour.primaryMain, 15)} 40px
      /* Sum of widths of two blocks */
  );
`;
