import {
  AppBar,
  Avatar,
  Grid,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import styled from 'styled-components';
import {
  brandColour,
  greyScaleColour,
  otherColour,
} from '@wizehub/common/theme/style.palette';
import {
  baseFontSize,
  fontSize,
  fontWeight,
} from '@wizehub/common/theme/style.typography';
import MenuOpenOutlinedIcon from '@mui/icons-material/MenuOpenOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';

export const StyledHeader = styled.div`
  background: ${greyScaleColour.white100};
  position: sticky;
  z-index: 100;
  box-shadow: 0px 0px 20px 10px #00000008;
  top: 0;
  display: flex;
  padding: 16px 20px;
  justify-content: space-between;
  align-items: center;
`;

export const StyledInnerLeftContainer = styled(Grid)`
  display: flex;
  align-items: center;
  gap: 20px;
  align-items: center;
`;

export const StyledInnerRightContainer = styled.div`
  height: 44px;
  display: flex;
  gap: 14px;
  align-items: center;
  position: relative;
`;

export const StyledActionMenu = styled(Menu)`
  & .MuiPaper-root {
    margin-top: 5px !important;
    border-radius: 16px !important;
    width: 198px;
    right: 20px !important;
    left: unset !important;
    box-shadow: 0px 30px 40px 0px #0000001a !important;
    border: 1px solid ${greyScaleColour.grey70} !important;
  }
  & .MuiList-root {
    padding-top: 0px !important;
    padding-bottom: 0px !important;
  }

  & .MuiMenuItem-root {
    min-width: unset !important;
    padding: 16px !important;
    gap: 12px !important;
  }
`;

export const StyledProfileMenuIcon = styled(PersonOutlineIcon)`
  color: ${brandColour.primary100} !important;
`;

export const StyledLogoutMenuIcon = styled(LogoutIcon)`
  color: ${otherColour.errorDefault} !important;
`;

export const StyledActionMenuText = styled(Typography)`
  font-weight: ${fontWeight.medium} !important;
  font-size: ${fontSize.b1} !important;
  line-height: 20px !important;
  color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledActionMenuItem = styled(MenuItem) <{ noBorder?: boolean }>`
  border-bottom: ${({ noBorder }) => (noBorder ? 'none' : `0.5px solid ${greyScaleColour.grey70}`)}!important;
  padding: 12px 16px !important;
  min-width: 320px !important;
`;

export const StyledRoleText = styled(Typography)`
  font-size: ${fontSize.b2} !important;
  font-weight: ${fontWeight.regular} !important;
  line-height: 18px !important;
  color: ${greyScaleColour.grey90} !important;
  cursor: pointer !important;
`;

export const StyledInnerLeftContainerText = styled(Typography)`
  font-size: ${baseFontSize} !important;
  font-weight: ${fontWeight.medium} !important;
  line-height: 26px !important;
  color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledMenuOpenIcon = styled(MenuOpenOutlinedIcon)`
  color: ${greyScaleColour.grey100} !important;
  cursor: pointer !important;
`;

export const StyledMenuCloseIcon = styled(MenuIcon)`
  color: ${greyScaleColour.grey100} !important;
  cursor: pointer !important;
`;

export const StyledExpandMoreIcon = styled(ExpandMoreIcon)`
  color: ${greyScaleColour.grey100} !important;
  cursor: pointer;
`;

export const StyledExpandLessIcon = styled(ExpandLessIcon)`
  color: ${greyScaleColour.grey100} !important;
  cursor: pointer;
`;

export const StyledAppBar = styled(AppBar)`
  border-radius: 10px;
  background-color: ${greyScaleColour.white100} !important;
  box-shadow: 0px 0px 10px 10px #00000003 !important;
  position: relative !important;
`;

export const StyledDropdownContainer = styled.div<{ width?: string }>`
  width: ${({ width }) => width};
  flex-grow: 1;
  display: flex;
  align-items: center;
`;

export const StyledAvatarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  text-decoration: none;
`;

export const StyledToolbar = styled(Toolbar)`
  margin: 8px 0;
  justify-content: flex-end !important;
`;

export const StyledAvatar = styled(Avatar) <{ cursor?: string }>`
  height: 44px !important;
  width: 44px !important;
  font-size: ${fontSize.h2} !important;
  cursor: ${({ cursor }) => cursor};
`;

export const StyledAdminName = styled(Typography) <{ cursor: string }>`
  font-size: ${fontSize.h5} !important;
  font-weight: ${fontWeight.medium} !important;
  color: ${greyScaleColour.secondaryMain} !important;
  line-height: 24px !important;
  cursor: ${({ cursor }) => cursor};
`;

export const StyledAdminContainer = styled.div``;

export const StyledAnchorContainer = styled.a`
  margin-top: 5px;
  text-decoration: none;
`;

export const StyledDropdownInnerContainer = styled.div`
  width: 172px;
  height: 55px;
`;
