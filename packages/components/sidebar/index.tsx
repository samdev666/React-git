import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  StyledSidebarContainer,
  StyledSidebarInnerContainer,
  StyledHeadingIconContainer,
  StyledMenuItemContainer,
  StyledMenuItemBoxContainer,
  StyledSidebarIcon,
  StyledSubMenuItemBoxContainer,
  StyledSubMenuItemContainer,
  StyledSubMenuItemText,
  StyledSecondarySubMenuContainer,
  StyledSecondaryMenuSubMenuContainer,
  StyledSubMenuSecondaryContainer,
  StyledIconContainer,
  StyledSecondaryMenuSubMenuItemText,
} from "./styles";
import messages from "../messages";

interface Props {
  image: string;
  smallLogoImage: string;
  sidebarOpen: boolean;
  mainMenuItems: {
    key: string;
    label: any;
    path: string;
    icon: React.JSX.Element;
  }[];
  secondaryMenuItems: {
    key: string;
    label: any;
    icon: React.JSX.Element;
    subMenuItem: {
      key: string;
      label: any;
      path: string;
      icon: React.JSX.Element;
    }[];
  }[];
}

export const Sidebar: React.FC<Props> = ({
  mainMenuItems,
  secondaryMenuItems,
  smallLogoImage,
  image,
  sidebarOpen,
}) => {
  const location = useLocation();
  const [secondaryMenuOpen, setSecondaryMenuOpen] = useState<{
    masterData: boolean;
    leadDataManagement: boolean;
  }>({
    masterData:
      /^(\/application|\/fee-lost-reason|\/team-positions|\/meeting-category|\/task-status|\/meeting-questions-and-categories|\/project|\/meeting-agenda-and-status)(\/|$)/.test(
        location.pathname
      ),
    leadDataManagement:
      /^(\/lead-progress-status|\/lead-source|\/lead-industry)(\/|$)/.test(
        location.pathname
      ),
  });
  return (
    <StyledSidebarContainer sidebarOpen={sidebarOpen}>
      <StyledSidebarInnerContainer sidebarOpen={sidebarOpen}>
        <StyledHeadingIconContainer sidebarOpen={sidebarOpen}>
          {sidebarOpen ? (
            <StyledSidebarIcon src={smallLogoImage} alt="logoicon" />
          ) : (
            <StyledSidebarIcon src={image} alt="logoicon" />
          )}
        </StyledHeadingIconContainer>
        <StyledMenuItemContainer>
          <StyledMenuItemBoxContainer sidebarOpen={sidebarOpen}>
            {messages.sidebar.menuItems.mainMenu.heading}
          </StyledMenuItemBoxContainer>
          <StyledSubMenuItemBoxContainer>
            {mainMenuItems.map(({ key, label, path, icon }) => {
              const active = location.pathname.startsWith(
                `/${path?.split("/")[1]}`
              );
              return (
                <StyledSubMenuItemContainer
                  draggable={false}
                  href={path}
                  active={active}
                  key={key}
                  sidebarOpen={sidebarOpen}
                >
                  {icon}
                  {!sidebarOpen && (
                    <>
                      <StyledSubMenuItemText>{label}</StyledSubMenuItemText>
                      {active && (
                        <ChevronRightIcon style={{ marginLeft: "auto" }} />
                      )}
                    </>
                  )}
                </StyledSubMenuItemContainer>
              );
            })}
          </StyledSubMenuItemBoxContainer>
        </StyledMenuItemContainer>
        {secondaryMenuItems?.length ? (
          <StyledMenuItemContainer>
            <StyledMenuItemBoxContainer sidebarOpen={sidebarOpen}>
              {messages.sidebar.menuItems.secondaryMenu.heading}
            </StyledMenuItemBoxContainer>
            <StyledSubMenuItemBoxContainer>
              {secondaryMenuItems.map(({ key, label, subMenuItem, icon }) => {
                const active =
                  key === "masterData"
                    ? secondaryMenuOpen.masterData
                    : secondaryMenuOpen.leadDataManagement;
                return (
                  <>
                    <StyledSecondarySubMenuContainer
                      key={key}
                      onClick={() => {
                        setSecondaryMenuOpen((prevState: any) => ({
                          ...prevState,
                          [key]: !prevState[key],
                        }));
                      }}
                      active={active}
                      sidebarOpen={sidebarOpen}
                    >
                      {icon}
                      {!sidebarOpen && (
                        <>
                          <StyledSubMenuItemText>{label}</StyledSubMenuItemText>
                          {active && (
                            <ExpandMoreIcon style={{ marginLeft: "auto" }} />
                          )}
                        </>
                      )}
                    </StyledSecondarySubMenuContainer>
                    {active && (
                      <StyledSecondaryMenuSubMenuContainer>
                        {subMenuItem?.map(
                          ({ key: subkey, label, path, icon }) => {
                            const active = location.pathname.startsWith(
                              `/${path.split("/")[1]}`
                            );
                            return (
                              <StyledSubMenuSecondaryContainer
                                draggable={false}
                                href={path}
                                active={active}
                                key={subkey}
                                sidebarOpen={sidebarOpen}
                              >
                                <StyledIconContainer>
                                  {icon}
                                </StyledIconContainer>
                                {!sidebarOpen && (
                                  <>
                                    <StyledSecondaryMenuSubMenuItemText>
                                      {label}
                                    </StyledSecondaryMenuSubMenuItemText>
                                    {active && (
                                      <ChevronRightIcon
                                        style={{ marginLeft: "auto" }}
                                      />
                                    )}
                                  </>
                                )}
                              </StyledSubMenuSecondaryContainer>
                            );
                          }
                        )}
                      </StyledSecondaryMenuSubMenuContainer>
                    )}
                  </>
                );
              })}
            </StyledSubMenuItemBoxContainer>
          </StyledMenuItemContainer>
        ) : null}
      </StyledSidebarInnerContainer>
    </StyledSidebarContainer>
  );
};

export default Sidebar;
