import styled from 'styled-components';
import { greyScaleColour } from '@wizehub/common/theme/style.palette';
import { fontSize, fontWeight } from '@wizehub/common/theme/style.typography';

export const StyledOTPInputBox = styled.div`
  display: flex;
  gap: 10px;
`;

export const StyledOTPInput = styled.input`
  width: 50px;
  font-size: ${fontSize.b1};
  font-weight: ${fontWeight.regular};
  color: ${greyScaleColour.secondaryMain};
  text-align: center;
  border: 1px solid ${greyScaleColour.grey80};
  border-radius: 4px;
  height: 48px;
  &::placeholder {
    color: ${greyScaleColour.grey80};
  }
  &:focus {
    border-color: ${greyScaleColour.secondaryMain};
    &::placeholder {
      color: transparent;
    }
  }

`;
