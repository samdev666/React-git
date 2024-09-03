import styled, { css } from 'styled-components';
import { FormControlLabel, Typography } from '@mui/material';
import {
  fontSize,
  fontWeight,
  baseFontFamily,
} from '@wizehub/common/theme/style.typography';
import {
  brandColour,
  greyScaleColour,
  otherColour,
} from '@wizehub/common/theme/style.palette';
import { respondTo } from '@wizehub/common/theme/style.layout';

export const StyledSidebarContainer = styled.div<{ sidebarOpen?: boolean }>`
  display: flex;
  transition: all 0.2s ease-in-out;
  background-color: ${otherColour.sidebar};
  position: relative;
  padding: 30px 10px 30px 10px;
  overflow-y: auto;
  overflow-x:hidden;
  width: 60px;
  ${({ sidebarOpen }) => !sidebarOpen
    && css`
      padding: 30px 20px 0px 20px;
      max-width: 290px;
      min-width: 290px;

      ${respondTo.mdDown} {
        max-width: 260px;
        min-width: 260px;
      }
    `}
`;

export const StyledSidebarInnerContainer = styled.div<{
  sidebarOpen?: boolean;
}>`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  ${({ sidebarOpen }) => !sidebarOpen
    && css`
      max-width: 290px;
      min-width: 290px;
      ${respondTo.mdDown} {
        max-width: 260px;
        min-width: 260px;
      }
    `}
`;

export const StyledHeadingIconContainer = styled.div<{
  sidebarOpen?: boolean;
}>`
  display: flex;
  height: 30px;
  justify-content: ${(props) => props.sidebarOpen && 'center'};
`;

export const StyledSidebarIcon = styled.img`
  max-width: 100%;
  max-height: 100%;
  cursor: pointer;
`;

export const StyledMenuItemContainer = styled.div`
  display: flex;
  margin-top: 60px;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
`;

export const StyledMenuItemBoxContainer = styled.div<{
  sidebarOpen?: boolean;
}>`
  font-weight: ${fontWeight.semiBold};
  font-size: ${(props) => (!props.sidebarOpen ? fontSize.b2 : fontSize.b3)};
  line-height: ${(props) => (!props.sidebarOpen ? '20px' : '14px')};
  letter-spacing: 2px;
  display: ${(props) => (props.sidebarOpen ? 'none' : 'flex')};
  justify-content: ${(props) => props.sidebarOpen && 'center'};
  text-align: ${(props) => props.sidebarOpen && 'center'};
`;

export const StyledSubMenuItemBoxContainer = styled.div``;

export const StyledSubMenuItemContainer = styled.a<{
  active?: boolean;
  sidebarOpen?: boolean;
}>`
  padding: 11px 16px;
  display: flex;
  gap: 20px;
  cursor: pointer;
  text-decoration: none;
  align-items: center;
  background-color: ${(props) => props.active && brandColour.primary70};
  border-width: ${(props) => !props.sidebarOpen && props.active && '0px 0px 0px 3px'};
  border-radius: ${(props) => (!props.sidebarOpen ? '0px 6px 6px 0px' : '6px')};
  border-style: ${(props) => !props.sidebarOpen && props.active && 'solid'};
  border-color: ${(props) => !props.sidebarOpen && props.active && brandColour.primaryMain};
  color: ${(props) => (props.active ? brandColour.primaryMain : greyScaleColour.secondaryMain)};
  justify-content: ${(props) => props.sidebarOpen && 'center'};
`;

export const StyledSubMenuSecondaryContainer = styled.a<{
  active?: boolean;
  sidebarOpen?: boolean;
}>`
  display: flex;
  gap: ${({ sidebarOpen }) => !sidebarOpen && '20px'};
  align-items: ${({ sidebarOpen }) => sidebarOpen && 'center'};
  justify-content: ${({ sidebarOpen }) => sidebarOpen && 'center'};
  cursor: pointer;
  text-decoration: none;
  align-items: center;
  border-width: ${(props) => props.active && '0px 0px 0px 3px'};
  border-radius: ${(props) => props.active && '0px 6px 6px 0px'};
  border-color: ${(props) => props.active && brandColour.primaryMain};
  color: ${(props) => (props.active ? brandColour.primaryMain : greyScaleColour.secondaryMain)};
`;

export const StyledIconContainer = styled.div`
  display: flex;
  align-items: center;
  /* padding-left: 7px; */
`;

export const StyledSecondarySubMenuContainer = styled.a<{
  active?: boolean;
  sidebarOpen?: boolean;
}>`
  padding: 11px 16px;
  display: flex;
  gap: 17px;
  cursor: pointer;
  text-decoration: none;
  color: ${greyScaleColour.secondaryMain};
  user-select: none;
  justify-content: ${(props) => props.sidebarOpen && 'center'};
`;

export const StyledSecondaryMenuSubMenuContainer = styled.div`
  padding: 16px 16px;
  gap: 10px;
  border: 1px solid ${brandColour.primary100};
  border-radius: 10px;
  margin: 6px 0px;
  display: flex;
  flex-direction: column;
  background-color: ${greyScaleColour.white100};
`;

export const StyledSubMenuItemText = styled(Typography)`
  font-size: ${fontSize.h5} !important;
  font-weight: ${fontWeight.regular} !important;
  line-height: 24px !important;
  ${respondTo.mdDown} {
    font-size: ${fontSize.b1} !important;
  }
`;

export const StyledSecondaryMenuSubMenuItemText = styled(Typography)`
  font-size: ${fontSize.b1} !important;
  font-weight: ${fontWeight.regular} !important;
  line-height: 20px !important;
`;

export const StyledSubMenuSecondaryItemText = styled(Typography)`
  font-size: ${fontSize.b1} !important;
  font-weight: ${fontWeight.regular} !important;
  line-height: 20px !important;
`;

export const StyledMenuItem = styled.a<{ active?: boolean }>`
  padding: 12px 24px;
  display: flex;
  width: auto;
  gap: 10px;
  text-decoration: none;
  align-items: center;
  ${({ active }) => (active
    ? css`
          background: ${brandColour.primaryMain};
          color: ${greyScaleColour.grey100};
          font-weight: ${fontWeight.bold};
          border-radius: 6px;
        `
    : css`
          /* min-width: 191px; */
        `)}
`;

export const StyledIcon = styled.img<{
  position?: string;
  right?: string;
  top?: string;
  padding?: string;
  cursor?: string;
  height?: string;
  width?: string;
}>`
  position: ${(props) => props.position};
  right: ${(props) => props.right};
  top: ${(props) => props.top};
  padding: ${(props) => props.padding};
  cursor: ${(props) => props.cursor || 'pointer'};
  height: ${(props) => props.height};
  width: ${(props) => props.width};
  max-width: 100%;
  max-height: 100%;
`;

export const StyledSidebarToggleIcon = styled.img<{
  position?: string;
  right?: string;
  top?: string;
  padding?: string;
  cursor?: string;
  height?: string;
  width?: string;
}>`
  position: ${(props) => props.position};
  right: ${(props) => props.right};
  top: ${(props) => props.top};
  padding: ${(props) => props.padding};
  cursor: ${(props) => props.cursor || 'pointer'};
  height: ${(props) => props.height};
  width: ${(props) => props.width};
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.3);
  background: linear-gradient(to bottom, #fff, #eee);
  border-radius: 50%;
`;

export const StyledFormControlLabel = styled(FormControlLabel)`
  margin-left: 0px !important;
  .MuiFormControlLabel-label {
    font-size: ${fontSize.b1};
    font-weight: ${fontWeight.medium};
    font-family: ${baseFontFamily};
    color: ${greyScaleColour.secondaryMain};
  }
`;

export const StyledText = styled.p<{
  fontSize?: string;
  color?: string;
  margin?: string;
  fontWeight?: string;
}>`
  font-size: ${(props) => props.fontSize};
  color: ${(props) => props.color};
  margin: ${(props) => props.margin};
  font-weight: ${(props) => props.fontWeight};
`;

export const StyledMenuItemText = styled(Typography)<{ active?: boolean }>`
  color: ${greyScaleColour.white100} !important;
  font-size: ${fontSize.b1} !important;
  margin: 0 !important;
  ${({ active }) => active
    && css`
      font-weight: ${fontWeight.medium} !important;
    `}
`;
