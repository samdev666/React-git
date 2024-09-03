import styled from 'styled-components';
import { fontSize, fontWeight } from '@wizehub/common/theme/style.typography';
import {
  greyScaleColour,
} from '@wizehub/common/theme/style.palette';
import { respondTo } from '@wizehub/common/theme/style.layout';

export const StyledSearchInput = styled.input`
  padding: 14px 0px 14px 16px;
  width: 100%;
  border: none;
  outline: none;
  font-size: ${fontSize.b1};
  font-weight: ${fontWeight.regular};
  line-height: 20px;
  border-radius: 10px;
  color: ${greyScaleColour.secondaryMain};
  &::placeholder {
    color: ${greyScaleColour.grey100};
  }
  ${respondTo.mdDown} {
    padding: 11px 0px 11px 16px;
  }
`;

export const StyledActionItem = styled.div<{ lastItem?: boolean }>`
  display: flex;
  white-space: nowrap;
  width: 100%;
`;

export const SearchInputContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  border: 1px solid ${greyScaleColour.grey80};
  border-radius: 4px;
  &:focus-within {
    border-color: ${greyScaleColour.secondaryMain};
  }
`;
