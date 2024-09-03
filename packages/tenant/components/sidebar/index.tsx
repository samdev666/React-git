import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  StyledSidebarContainer,
  StyledIcon,
  StyledSidebarInnerContainer,
  StyledHeadingIconContainer,
  StyledMenuItemContainer,
  StyledMenuItemBoxContainer,
  StyledSidebarIcon,
  StyledSubMenuItemBoxContainer,
  StyledSubMenuItemText,
  StyledSecondarySubMenuContainer,
  StyledSecondaryMenuSubMenuContainer,
  StyledSubMenuSecondaryContainer,
  StyledIconContainer,
  StyledSecondaryMenuSubMenuItemText,
} from "./styles";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { apiCall } from "../../redux/actions";
import { GET_TENANT_FORMS } from "../../api";
import { TenantFormsCode } from "../../utils/constant";
import { HttpMethods } from "@wizehub/common/utils";
import { useDispatch } from "react-redux";
import { TenantFormData } from "@wizehub/common/models/genericEntities";
import { useSelector } from "react-redux";
import { ReduxState } from "../../redux/reducers";
import { routes } from "../../utils";
import { AuthenticationStatus, Right } from "../../redux/reducers/auth";

interface SubMenuItem {
  key: string;
  label: string;
  path: string;
  icon: React.JSX.Element;
  isEncapsulated?: boolean;
  right?: Right | Right[];
}

interface MainMenuItem {
  key: string;
  label: string;
  path?: string;
  icon: React.JSX.Element;
  subMenuItem?: SubMenuItem[];
  right?: Right | Right[];
}

interface Props {
  onClose?: () => void;
  isOpen?: boolean;
  activeButton?: string;
  image: string;
  smallLogoImage: string;
  sidebarOpen: boolean;
  menuItems: {
    key: string;
    label: any;
    mainMenuItems: MainMenuItem[];
  }[];
}

export const Sidebar: React.FC<Props> = ({
  menuItems,
  smallLogoImage,
  image,
  sidebarOpen,
}) => {
  const location = useLocation();
  const reduxDispatch = useDispatch();
  const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
  const auth = useSelector((state: ReduxState) => state.auth);
  const scrollToRef = useRef(null);

  const [businessAssessmentCompleted, setBusinessAssessmentCompleted] =
    useState<string>("");

  const [mainMenuOpen, setMainMenuOpen] = useState<{
    firmProfile: boolean;
    objectives: boolean;
    wizeMAndA: boolean;
    financialOverview: boolean;
    systemPreferences: boolean;
    netPromoterScore: boolean;
  }>({
    // need to change paths
    firmProfile:
      /^(\/firm-profile\/(firm-details|organization-chart|mission-vision-values|team-structure|people|meeting-questions-and-categories|meeting-agenda-and-status))(\/|$)/.test(
        location.pathname
      ),
    objectives: /^(\/objectives|\/ideal-income|\/ideal-lifestyle)(\/|$)/.test(
      location.pathname
    ),
    netPromoterScore: /^(\/net-promoter-score\/(team|client))(\/|$)/.test(
      location.pathname
    ),
    wizeMAndA:
      /^(\/lead-progress-stages|\/lead-source|\/lead-industry)(\/|$)/.test(
        location.pathname
      ),
    financialOverview:
      /^(\/financial-overview\/(fees|ebitda|lockups|feeWonAndLast|ebitda-bonus))(\/|$)/.test(
        location.pathname
      ),
    systemPreferences:
      /^(\/launchpad-setup|\/team-positions|\/meeting-category|\/practice-lead-progress-setup|\/task-status|\/lead-source-setup|\/lead-industry-setup|\/meeting-master-setup|\/fee-lost-reason-setup)(\/|$)/.test(
        location.pathname
      ),
  });

  const handleSubMenuItemKeys = (key: string) => {
    switch (key) {
      case "objectives":
        return mainMenuOpen.objectives;
      case "wizeMAndA":
        return mainMenuOpen.wizeMAndA;
      case "financialOverview":
        return mainMenuOpen.financialOverview;
      case "systemPreferences":
        return mainMenuOpen.systemPreferences;
      case "netPromoterScore":
        return mainMenuOpen.netPromoterScore;
      default:
        return mainMenuOpen.firmProfile;
    }
  };

  const getTenantForms = async () => {
    return new Promise((resolve, reject) => {
      reduxDispatch(
        apiCall(
          GET_TENANT_FORMS.replace(":tenantId", tenantId).replace(
            ":code",
            TenantFormsCode.businessAssessment
          ),
          resolve,
          reject,
          HttpMethods.GET
        )
      );
    })
      .then((res: TenantFormData) => {
        setBusinessAssessmentCompleted(res?.completionStatus);
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };

  const finalItems = menuItems
    .map((ele) => {
      const filteredItems = ele?.mainMenuItems
        .map((item: any) => {
          // Check rights for the main menu item
          const rights =
            item.right &&
            (Array.isArray(item.right) ? item.right : [item.right]);
          const hasRight = rights?.some(
            (right: any) =>
              auth.hasStatusAndRight(
                AuthenticationStatus.AUTHENTICATED,
                right
              ) ||
              auth.hasStatusAndRight(
                AuthenticationStatus.INCOMPLETE_BUSINESS_ASSESSMENT,
                right
              )
          );

          // Filter subMenuItems based on rights
          const filteredSubMenuItems =
            item.subMenuItem
              ?.map((subItem: any) => {
                const subRights =
                  subItem.right &&
                  (Array.isArray(subItem.right)
                    ? subItem.right
                    : [subItem.right]);
                const hasSubRight = subRights?.some((right: any) =>
                  auth.hasStatusAndRight(
                    AuthenticationStatus.AUTHENTICATED,
                    right
                  )
                );
                return hasSubRight ? subItem : null;
              })
              .filter(Boolean) || [];

          // Include item if it has rights or if it has subMenuItems with rights
          if (hasRight || filteredSubMenuItems.length > 0) {
            return {
              ...item,
              subMenuItem:
                filteredSubMenuItems.length > 0
                  ? filteredSubMenuItems
                  : item.subMenuItem,
            };
          } else {
            return null;
          }
        })
        .filter(Boolean);

      return filteredItems.length > 0
        ? { key: ele.key, label: ele.label, mainMenuItems: filteredItems }
        : null;
    })
    .filter(Boolean);

  useEffect(() => {
    if (tenantId) getTenantForms();
  }, [tenantId]);

  useEffect(() => {
    if (scrollToRef.current) {
      const element = scrollToRef.current;
      const rect = element.getBoundingClientRect();
      const isInView =
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth);

      if (!isInView) {
        element.scrollIntoView({
          behavior: "smooth",
        });
      }
    }
  }, []);

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
          {finalItems?.map(({ key, label, mainMenuItems }) => {
            return (
              <>
                <StyledMenuItemBoxContainer sidebarOpen={sidebarOpen}>
                  {label}
                </StyledMenuItemBoxContainer>
                <StyledSubMenuItemBoxContainer>
                  {mainMenuItems?.map(
                    ({ key: mainItemKey, label, path, icon, subMenuItem }) => {
                      const active = subMenuItem
                        ? handleSubMenuItemKeys(mainItemKey)
                        : location.pathname.startsWith(
                            `/${path.split("/")[1]}`
                          );
                      return (
                        <>
                          <StyledSecondarySubMenuContainer
                            key={key}
                            href={
                              !subMenuItem &&
                              (businessAssessmentCompleted !== "INPROGRESS"
                                ? path ===
                                  routes.businessScoreccards.businessAssessment
                                  ? routes.businessScoreccards.summary
                                  : path
                                : path ===
                                    routes.businessScoreccards
                                      .businessAssessment && path)
                            }
                            onClick={() => {
                              if (subMenuItem) {
                                setMainMenuOpen((prevState: any) => ({
                                  ...prevState,
                                  [mainItemKey]: !prevState[mainItemKey],
                                }));
                              }
                            }}
                            active={active}
                            sidebarOpen={sidebarOpen}
                            hasSubMenuItem={!!subMenuItem}
                            ref={
                              !subMenuItem && location.pathname.includes(path)
                                ? scrollToRef
                                : null
                            }
                          >
                            {icon}
                            {!sidebarOpen && (
                              <>
                                <StyledSubMenuItemText>
                                  {label}
                                </StyledSubMenuItemText>
                                {active &&
                                  (subMenuItem ? (
                                    <ExpandMoreIcon
                                      style={{ marginLeft: "auto" }}
                                    />
                                  ) : (
                                    <ChevronRightIcon
                                      style={{ marginLeft: "auto" }}
                                    />
                                  ))}
                              </>
                            )}
                          </StyledSecondarySubMenuContainer>
                          {subMenuItem && active && (
                            <StyledSecondaryMenuSubMenuContainer>
                              {subMenuItem?.map(
                                ({
                                  key: subkey,
                                  label,
                                  path,
                                  icon,
                                  isEncapsulated,
                                }: {
                                  key: string;
                                  label: string;
                                  path: string;
                                  icon: string;
                                  isEncapsulated: boolean;
                                }) => {
                                  const active = isEncapsulated
                                    ? location.pathname.startsWith(path)
                                    : location.pathname.startsWith(
                                        `/${path.split("/")[1]}`
                                      );

                                  return (
                                    <StyledSubMenuSecondaryContainer
                                      draggable={false}
                                      href={
                                        businessAssessmentCompleted !==
                                          "INPROGRESS" && path
                                      }
                                      active={active}
                                      key={subkey}
                                      sidebarOpen={sidebarOpen}
                                      ref={
                                        location.pathname.includes(path)
                                          ? scrollToRef
                                          : null
                                      }
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
                    }
                  )}
                </StyledSubMenuItemBoxContainer>
              </>
            );
          })}
        </StyledMenuItemContainer>
      </StyledSidebarInnerContainer>
    </StyledSidebarContainer>
  );
};

export default Sidebar;
