import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { capitalizeLegend } from "@wizehub/common/utils/commonFunctions";
import { Grid } from "@mui/material";
import {
  StyledHeader,
  StyledAvatar,
  StyledAdminName,
  StyledInnerLeftContainer,
  StyledMenuOpenIcon,
  StyledInnerRightContainer,
  StyledInnerLeftContainerText,
  StyledRoleText,
  StyledAdminContainer,
  StyledExpandMoreIcon,
  StyledExpandLessIcon,
  StyledActionMenu,
  StyledActionMenuItem,
  StyledActionMenuText,
  StyledMenuCloseIcon,
} from "./styles";
import messages from "../messages";
import SearchInput from "../searchInput";

interface HeaderCustomProps {
  userProfile: any;
  toggleSidebar: () => void;
  actions: {
    id: string;
    text: string;
    onClick: () => void;
    icon: React.JSX.Element;
  }[];
  baseImageUrl?: string;
  sidebarOpen?: boolean;
  isSearch?: boolean;
}

const Header = (props: HeaderCustomProps) => {
  const { pathname } = useLocation();
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const {
    userProfile,
    actions,
    toggleSidebar,
    baseImageUrl,
    isSearch,
    sidebarOpen,
  } = props;

  const openActionMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const closeActionMenu = (menuItemClick?: any) => {
    setMenuAnchorEl(null);
    if (menuItemClick) menuItemClick();
  };
  const name = `${userProfile?.firstName} ${userProfile?.lastName}`;

  return (
    <StyledHeader>
      <StyledInnerLeftContainer container xs={7}>
        <Grid item>
          {sidebarOpen ? (
            <StyledMenuCloseIcon onClick={toggleSidebar} />
          ) : (
            <StyledMenuOpenIcon onClick={toggleSidebar} />
          )}
        </Grid>
        {isSearch && (
          <Grid item xs={4}>
            <SearchInput label="Search here to find what you need" />
          </Grid>
        )}
      </StyledInnerLeftContainer>
      <StyledInnerRightContainer onClick={openActionMenu}>
        <StyledAvatar
          src={userProfile && `${baseImageUrl}/${userProfile.profileUrl}`}
          cursor={pathname === "/profile" ? "default" : "pointer"}
        />
        <StyledAdminContainer>
          <StyledAdminName
            cursor={pathname === "/profile" ? "default" : "pointer"}
          >
            {userProfile?.firstName && userProfile?.lastName ? name : "-"}
          </StyledAdminName>
          <StyledRoleText>
            {userProfile?.role?.name
              ? capitalizeLegend(userProfile?.role?.name)
              : "-"}
          </StyledRoleText>
        </StyledAdminContainer>
        {!menuAnchorEl ? <StyledExpandMoreIcon /> : <StyledExpandLessIcon />}
      </StyledInnerRightContainer>
      <StyledActionMenu
        disableAutoFocusItem
        anchorEl={menuAnchorEl}
        open={!!menuAnchorEl}
        onClose={() => closeActionMenu()}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        {actions.map((action) => (
          <StyledActionMenuItem
            key={action?.id}
            onClick={() => closeActionMenu(action?.onClick)}
            noBorder={
              actions?.[actions.length - 1]?.id === "switchTenant"
                ? action?.text === "Switch tenant"
                : action?.text === "Log out"
            }
          >
            {action?.icon}
            <StyledActionMenuText>{action?.text}</StyledActionMenuText>
          </StyledActionMenuItem>
        ))}
      </StyledActionMenu>
    </StyledHeader>
  );
};

export default Header;
