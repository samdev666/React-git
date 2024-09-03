import React, { useState } from "react";
import { Header, Sidebar } from "@wizehub/components";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDispatch, useSelector } from "react-redux";
import { goBack, push } from "connected-react-router";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import SupervisedUserCircleOutlinedIcon from "@mui/icons-material/SupervisedUserCircleOutlined";
import DataThresholdingOutlinedIcon from "@mui/icons-material/DataThresholdingOutlined";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import AppsOutlinedIcon from "@mui/icons-material/AppsOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import WorkspacesOutlinedIcon from "@mui/icons-material/WorkspacesOutlined";
import TopicOutlinedIcon from "@mui/icons-material/TopicOutlined";
import DonutSmallOutlinedIcon from "@mui/icons-material/DonutSmallOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import FactoryOutlinedIcon from "@mui/icons-material/FactoryOutlined";
import DatasetOutlinedIcon from "@mui/icons-material/DatasetOutlined";
import { AuthenticationStatus } from "@wizehub/common/redux/reducers/auth";
import WizeHubSidebarLogo from "../assets/images/wizehubSidebarLogo.svg";
import WizeHubSidebarSmallLogo from "../assets/images/wizehubSidebarSmallLogo.svg";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { config } from "../config";
import { Right } from "../redux/reducers/auth";
import messages from "../messages";
import { ReduxState } from "../redux/reducers";
import { logout } from "../redux/actions";
import { routes } from "../utils";
import {
  StyledChildrenContainer,
  StyledContainer,
  StyledContentContainer,
  StyledIconHeadingContainer,
  StyledProfileMenuIcon,
  StyledLogoutMenuIcon,
} from "./styles";

interface Props {
  children?: JSX.Element | JSX.Element[];
  hideSidebar?: boolean;
  showGoBack?: boolean;
  hasHeader?: boolean;
  noPadding?: boolean;
  noMargin?: boolean;
  cardCss?: any;
  contentCss?: any;
}

const Container: React.FC<Props> = ({
  children,
  hideSidebar,
  showGoBack,
  hasHeader = true,
  noPadding,
  noMargin = false,
  ...styleProps
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth <= 1499);
  const userProfile = useSelector((state: ReduxState) => state.profile);
  const auth = useSelector((state: ReduxState) => state.auth);
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };
  const reduxDispatch = useDispatch();
  const actions = [
    {
      id: "viewProfile",
      text: "Profile",
      onClick: () => {
        reduxDispatch(push(routes.profile));
      },
      icon: <StyledProfileMenuIcon />,
    },
    {
      id: "logout",
      text: "Sign out",
      onClick: () => {
        reduxDispatch(logout());
      },
      icon: <StyledLogoutMenuIcon />,
    },
  ];

  const mainMenuItems = [
    {
      key: "dashboard",
      label: messages.sidebar.menuItems.mainMenu.subMenuItems.dashboard,
      path: routes.dashboard.root,
      icon: <DashboardOutlinedIcon />,
      right: [Right.DASHBOARD, Right.DASHBOARD_READ_ONLY],
    },
    {
      key: "userManagement",
      label: messages.sidebar.menuItems.mainMenu.subMenuItems.userManagement,
      path: routes.usermanagement.root,
      icon: <PermIdentityOutlinedIcon />,
      right: Right.USER_MANAGEMENT,
    },
    {
      key: "tenantManagement",
      label: messages.sidebar.menuItems.mainMenu.subMenuItems.tenantManagement,
      path: routes.tenantmanagement.root,
      icon: <SupervisedUserCircleOutlinedIcon />,
      right: [Right.TENANT_MANAGEMENT, Right.TENANT_MANAGEMENT_READ_ONLY],
    },
    {
      key: "productManagement",
      label: messages.sidebar.menuItems.mainMenu.subMenuItems.productManagement,
      path: routes.productmanagement.root,
      icon: <CategoryOutlinedIcon />,
      right: [Right.PRODUCT_MANAGEMENT, Right.PRODUCT_MANAGEMENT_READ_ONLY],
    },
  ];

  const secondaryMenuItems = [
    {
      key: "masterData",
      label:
        messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
          .heading,
      icon: <DataThresholdingOutlinedIcon />,
      subMenuItem: [
        {
          key: "application",
          label:
            messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
              .subItems.application.heading,
          path: routes.masterData.application,
          icon: <AppsOutlinedIcon />,
          right: Right.APPLICATION_MANAGEMENT,
        },
        {
          key: "feeLostReason",
          label:
            messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
              .subItems.feeLostReason.heading,
          path: routes.masterData.feeLostReason,
          icon: <FilterListOutlinedIcon />,
          right: Right.FEE_LOST_REASON,
        },
        {
          key: "teamPosition",
          label:
            messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
              .subItems.teamPosition.heading,
          path: routes.masterData.teamPosition,
          icon: <WorkspacesOutlinedIcon />,
          right: Right.TEAM_POSITION,
        },
        {
          key: "project",
          label:
            messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
              .subItems.project.heading,
          path: routes.masterData.project,
          icon: <DatasetOutlinedIcon />,
          right: Right.PROJECTS,
        },
        {
          key: "meetingQuestionsAndCategories",
          label:
            messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
              .subItems.meetingQuestionsAndCategories.heading,
          path: routes.masterData.meetingQuestionsAndCategories,
          icon: <TopicOutlinedIcon />,
          right: Right.MEETING_QUESTIONS_AND_CATEGORIES,
        },
        {
          key: "meetingAgendaAndStatus",
          label:
            messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
              .subItems.meetingAgendaAndStatus.heading,
          path: routes.masterData.meetingAgendaAndStatus,
          icon: <TopicOutlinedIcon />,
          right: Right.MEETING_AGENDA_TEMPLATES,
        },
        {
          key: "meetingCategory",
          label:
            messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
              .subItems.meetingCategory.heading,
          path: routes.masterData.meetingCategories,
          icon: <TopicOutlinedIcon />,
          right: Right.MEETING_CATEGORY_MANAGEMENT,
        },
        {
          key: "taskStatus",
          label:
            messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
              .subItems.taskStatus.heading,
          path: routes.masterData.taskStatus,
          icon: <TaskAltIcon />,
          right: Right.TASK_STATUS_MANAGEMENT,
        },
      ],
    },
    {
      key: "leadDataManagement",
      label:
        messages.sidebar.menuItems.secondaryMenu.subMenuItems.leadDataManagement
          .heading,
      icon: <LeaderboardOutlinedIcon />,
      subMenuItem: [
        {
          key: "leadProgressStages",
          label:
            messages.sidebar.menuItems.secondaryMenu.subMenuItems
              .leadDataManagement.subItems.leadProgressStages.heading,
          path: routes.leadData.leadProgressStages,
          icon: <DonutSmallOutlinedIcon />,
          right: Right.LEAD_PROGRESS_STAGES,
        },
        {
          key: "leadSource",
          label:
            messages.sidebar.menuItems.secondaryMenu.subMenuItems
              .leadDataManagement.subItems.leadSource.heading,
          path: routes.leadData.leadSources,
          icon: <EventNoteOutlinedIcon />,
          right: Right.LEAD_SOURCES,
        },
        {
          key: "leadIndustry",
          label:
            messages.sidebar.menuItems.secondaryMenu.subMenuItems
              .leadDataManagement.subItems.leadIndustry.heading,
          path: routes.leadData.leadIndustry,
          icon: <FactoryOutlinedIcon />,
          right: Right.LEAD_INDUSTRY,
        },
      ],
    },
  ];

  const mainMenuFinalItems = mainMenuItems
    .map((item) => {
      const rights = Array.isArray(item.right) ? item.right : [item.right];
      const hasRight = rights.some((right) =>
        auth.hasStatusAndRight(AuthenticationStatus.AUTHENTICATED, right)
      );
      return hasRight ? item : null;
    })
    .filter(Boolean);

  const secondaryMenuFinalItems = secondaryMenuItems
    .map((item) => {
      const filteredSubMenuItems = item.subMenuItem.filter(
        (subItem) =>
          !subItem.right ||
          auth.hasStatusAndRight(
            AuthenticationStatus.AUTHENTICATED,
            subItem.right
          )
      );
      if (filteredSubMenuItems.length > 0) {
        return {
          ...item,
          subMenuItem: filteredSubMenuItems,
        };
      }

      return null;
    })
    .filter(Boolean);

  return (
    <StyledContainer noPadding={noPadding} {...styleProps}>
      {!hideSidebar && (
        <Sidebar
          mainMenuItems={mainMenuFinalItems}
          secondaryMenuItems={secondaryMenuFinalItems}
          image={WizeHubSidebarLogo}
          smallLogoImage={WizeHubSidebarSmallLogo}
          sidebarOpen={sidebarOpen}
        />
      )}
      <StyledContentContainer noMargin={noMargin}>
        {hasHeader && (
          <Header
            toggleSidebar={toggleSidebar}
            actions={actions}
            userProfile={userProfile}
            baseImageUrl={config.baseImageUrl}
            sidebarOpen={sidebarOpen}
          />
        )}
        <StyledChildrenContainer
          noPadding={noPadding}
          noMargin={noMargin}
          hasHeader={hasHeader}
        >
          {showGoBack && (
            <StyledIconHeadingContainer>
              <ArrowBackIcon
                onClick={() => {
                  reduxDispatch(goBack());
                }}
              />
            </StyledIconHeadingContainer>
          )}
          {children}
        </StyledChildrenContainer>
      </StyledContentContainer>
    </StyledContainer>
  );
};

export default Container;
