import styled from 'styled-components';
import {
  brandColour,
  greyScaleColour,
} from '@wizehub/common/theme/style.palette';
import { fontSize } from '@wizehub/common/theme/style.typography';
import { Box, Grid } from '@mui/material';
import { respondTo } from '@wizehub/common/theme/style.layout';

export const StyledContainer = styled.div``;
export const StyledTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;
export const Container = styled.div`
  background-color: #f7f7f7;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

export const TitleContainer = styled.div`
  margin-bottom: 20px;
`;

export const StyledHeading = styled.div`
  font-size: 32px;
  margin-bottom: 10px;
  color: ${brandColour.primaryMain};
`;

export const StyledSubHeading = styled.div`
  font-size: 16px;
  color: ${greyScaleColour.grey100};
`;

export const StepInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 50px;
`;

export const StyledProgressBarWrapper = styled.div`
  padding: 0 50px;
`;

export const StyledFormTitle = styled.div<{
  color?: string;
  fontSize?: string;
}>`
  font-size: ${(props) => (props.fontSize ? props.fontSize : fontSize.h4)};
  color: ${(props) => (props.color ? props.color : brandColour.primaryMain)};
`;

export const StyledFormContainer = styled.div`  
`;

export const StyledButtonGroup = styled.div`
  padding: 0 50px;
`;

export const StyledFormStepsContainer = styled(Box)`
  height: calc(100vh - 200px);
  display: flex !important;
  gap: 30px;
  ${respondTo.mdDown} {
    gap: 14px;
  }
`;

export const StyledFormBoxContainer = styled(Box)`
  width: -webkit-fill-available;
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    display: none !important;
  }
`;

export const StyledStepsBoxContainer = styled(Box)`
  width: min-content;
  gap: 24px;
  display: flex;
  flex-direction: column;
  padding: 10px 24px 0px 24px;
`;