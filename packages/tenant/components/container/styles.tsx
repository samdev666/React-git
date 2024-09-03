import styled, { css } from 'styled-components';
import { Container } from '@mui/material';
import {
  brandColour,
  greyScaleColour,
  otherColour
} from '@wizehub/common/theme/style.palette';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SupervisedUserCircleOutlinedIcon from '@mui/icons-material/SupervisedUserCircleOutlined';
import LogoutIcon from '@mui/icons-material/Logout';

export const StyledTenantContainer = styled(Container) <{ noPadding?: boolean }>`
  display: flex !important;
  max-height: 100vh;
  min-height: 100vh;
  ${({ noPadding }) =>
    noPadding
      ? css`
          padding: 0 !important;
        `
      : css`
          padding: 24px !important;
        `};
  min-width: 100%;
  margin: auto 0 !important;
  background-color: ${greyScaleColour.white100};
  overflow: hidden;
`;

export const StyledTenantChildrenContainer = styled.div<{
  noPadding?: boolean;
  noMargin?: boolean;
  hasHeader?: boolean;
}>`
  margin: 0px !important;
  padding: 8px 20px;
  display: flex;
  gap: 8px;
  flex-direction: column;
  ${({ noPadding }) =>
    noPadding &&
    css`
      padding: 0 !important;
    `};
  ${({ noMargin }) =>
    noMargin &&
    css`
      margin: 0 !important;
    `}
`;

export const StyledTenantContentContainer = styled.div<{ noMargin?: boolean }>`
  width: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 12px;
  &::-webkit-scrollbar {
    display: none;
  }
  ${({ noMargin }) =>
    noMargin &&
    css`
      margin: 0 !important;
    `}
`;

export const StyledIconHeadingContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledLogoutMenuIcon = styled(LogoutIcon)`
  color: ${otherColour.errorDefault} !important;
`;

export const StyledSupervisedUserCircleOutlinedIcon = styled(SupervisedUserCircleOutlinedIcon)`
  color: ${otherColour.successLight} !important;
`;

export const StyledProfileMenuIcon = styled(PersonOutlineIcon)`
  color: ${brandColour.primary100} !important;
`;