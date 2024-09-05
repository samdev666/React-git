import React, { useEffect, useState } from "react";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import SupervisedUserCircleOutlinedIcon from "@mui/icons-material/SupervisedUserCircleOutlined";
import DataThresholdingOutlinedIcon from "@mui/icons-material/DataThresholdingOutlined";
import WysiwygOutlinedIcon from "@mui/icons-material/WysiwygOutlined";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import OutboundOutlinedIcon from "@mui/icons-material/OutboundOutlined";
import DatasetOutlinedIcon from "@mui/icons-material/DatasetOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import MovingOutlinedIcon from "@mui/icons-material/MovingOutlined";
import WifiProtectedSetupOutlinedIcon from "@mui/icons-material/WifiProtectedSetupOutlined";
import ManageSearchRoundedIcon from "@mui/icons-material/ManageSearchRounded";
import Man3RoundedIcon from "@mui/icons-material/Man3Rounded";
import PieChartOutlineIcon from "@mui/icons-material/PieChartOutline";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import StickyNote2OutlinedIcon from "@mui/icons-material/StickyNote2Outlined";
import FolderSpecialOutlinedIcon from "@mui/icons-material/FolderSpecialOutlined";
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import WorkspacesOutlinedIcon from "@mui/icons-material/WorkspacesOutlined";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import CorporateFareOutlinedIcon from "@mui/icons-material/CorporateFareOutlined";
import MoneyOutlinedIcon from "@mui/icons-material/MoneyOutlined";
import NightlifeOutlinedIcon from "@mui/icons-material/NightlifeOutlined";
import CallMadeOutlinedIcon from "@mui/icons-material/CallMadeOutlined";
import MergeTypeOutlinedIcon from "@mui/icons-material/MergeTypeOutlined";
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";
import SsidChartOutlinedIcon from "@mui/icons-material/SsidChartOutlined";
import PublishedWithChangesOutlinedIcon from "@mui/icons-material/PublishedWithChangesOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import CurtainsClosedOutlinedIcon from "@mui/icons-material/CurtainsClosedOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import LocalAtmOutlinedIcon from "@mui/icons-material/LocalAtmOutlined";
import HailOutlinedIcon from "@mui/icons-material/HailOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WizeHubSidebarLogo from "../../assets/images/wizehubSidebarLogo.svg";
import TopicOutlinedIcon from "@mui/icons-material/TopicOutlined";
import WizeHubSidebarSmallLogo from "../../assets/images/wizehubSidebarSmallLogo.svg";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import LegendToggleIcon from "@mui/icons-material/LegendToggle";
import {
  StyledIconHeadingContainer,
  StyledLogoutMenuIcon,
  StyledProfileMenuIcon,
  StyledSupervisedUserCircleOutlinedIcon,
  StyledTenantChildrenContainer,
  StyledTenantContainer,
  StyledTenantContentContainer,
} from "./styles";
import { Sidebar } from "../sidebar/index";
import { Header, Modal } from "@wizehub/components";
import { goBack, push } from "connected-react-router";
import { useDispatch } from "react-redux";
import { apiCall, logout } from "../../redux/actions";
import { useSelector } from "react-redux";
import { ReduxState } from "../../redux/reducers";
import { routes } from "../../utils";
import messages from "../../messages";
import { GET_USER_LINKED_TENANTS } from "../../api";
import { TenantData } from "@wizehub/common/models/genericEntities";
import { HttpMethods } from "@wizehub/common/utils";
import { setCurrentStep } from "@wizehub/common/redux/actions";
import SpeedIcon from "@mui/icons-material/Speed";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { config } from "../../config";
import { Right } from "../../redux/reducers/auth";
import TenantAccessPopup from "../../screens/auth/tenantAccessPopup";
import { AuthenticationStatus } from "@wizehub/common/redux/reducers/auth";
import { usePopupReducer } from "@wizehub/common/hooks";
import { UserActionConfig } from "@wizehub/common/models";

interface Props {
  children?: JSX.Element | JSX.Element[];
  hideSidebar?: boolean;
  cardCss?: any;
  contentCss?: any;
  heading?: string;
  showGoBack?: boolean;
  hasHeader?: boolean;
  iconSource?: string;
  goBackIcon?: { isBack: boolean; path: string };
  noPadding?: boolean;
  noMargin?: boolean;
}
const Container: React.FC<Props> = ({
  children,
  hideSidebar,
  heading,
  showGoBack,
  hasHeader = true,
  iconSource,
  goBackIcon,
  noPadding,
  noMargin = false,
  ...styleProps
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(
    window.innerWidth <= 1499
      ? window.innerWidth && !(localStorage.getItem("sidebarOpen") === "Open")
      : !(localStorage.getItem("sidebarOpen") === "Open")
  );
  const [actions, setActions] = useState([]);
  const auth = useSelector((state: ReduxState) => state.auth);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
    localStorage.setItem("sidebarOpen", sidebarOpen ? "Open" : "Close");
  };

  const {
    visibility: formVisibility,
    showPopup: showForm,
    hidePopup: hideForm,
  } = usePopupReducer<UserActionConfig>();

  const reduxDispatch = useDispatch();
  const getLinkedTenantsData = async () => {
    return new Promise((resolve, reject) => {
      reduxDispatch(
        apiCall(GET_USER_LINKED_TENANTS, resolve, reject, HttpMethods.GET)
      );
    })
      .then((response: TenantData[]) => {
        if (response?.length > 1) {
          setActions((prevState) => {
            const actionExists = prevState.some(
              (action) => action.id === "switchTenant"
            );
            if (!actionExists) {
              return [
                ...prevState,
                {
                  id: "switchTenant",
                  text: "Switch tenant",
                  onClick: () => {
                    showForm();
                  },
                  icon: <StyledSupervisedUserCircleOutlinedIcon />,
                },
              ];
            }
            return prevState;
          });
        }
      })
      .catch(() => {
        reduxDispatch(push(routes.noAccess));
      });
  };
  const { profile: userProfile, tenantData } = useSelector(
    (state: ReduxState) => state
  );
  useEffect(() => {
    if (auth.status === AuthenticationStatus.AUTHENTICATED) {
      setActions([
        {
          id: "viewProfile",
          text: "Edit profile",
          onClick: () => {
            reduxDispatch(push(routes.profile));
          },
          icon: <StyledProfileMenuIcon />,
        },
        {
          id: "logout",
          text: "Log out",
          onClick: () => {
            reduxDispatch(setCurrentStep(0));
            reduxDispatch(logout());
          },
          icon: <StyledLogoutMenuIcon />,
        },
      ]);
      getLinkedTenantsData();
    } else {
      setActions([
        {
          id: "logout",
          text: "Log out",
          onClick: () => {
            reduxDispatch(setCurrentStep(0));
            reduxDispatch(logout());
          },
          icon: <StyledLogoutMenuIcon />,
        },
      ]);
      getLinkedTenantsData();
    }
  }, []);

  const menuItems = [
    {
      key: "dashboard",
      label: messages?.sidebar?.menuItems?.dashboard,
      mainMenuItems: [
        {
          key: "overview",
          label: messages?.sidebar?.menuItems?.mainMenuItems?.overview,
          path: routes.overview,
          icon: <DashboardOutlinedIcon />,
          right: [Right.DASHBOARD_MANAGEMENT, Right.DASHBOARD_READ_ONLY],
        },
        {
          key: "wizeBlueprint",
          label: messages?.sidebar?.menuItems?.mainMenuItems?.wizeBlueprint,
          path: routes.wizeBlueprint,
          icon: <SupervisedUserCircleOutlinedIcon />,
        },
      ],
    },
    {
      key: "discovery",
      label: messages?.sidebar?.menuItems?.discovery,
      mainMenuItems: [
        {
          key: "businessScorecards",
          label:
            messages?.sidebar?.menuItems?.mainMenuItems?.businessScorecards,
          path: routes.businessScoreccards.businessAssessment,
          icon: <DataThresholdingOutlinedIcon />,
          right: Right.BUSINESS_ASSESSMENT,
        },
        {
          key: "firmProfile",
          label: messages?.sidebar?.menuItems?.mainMenuItems?.firmProfile,
          icon: <WysiwygOutlinedIcon />,
          subMenuItem: [
            {
              key: "firmDetails",
              label:
                messages?.sidebar?.menuItems?.mainMenuItems?.subMenuItems
                  ?.firmDetails,
              path: routes.firmProfile.firmDetails,
              icon: <InfoOutlinedIcon />,
              isEncapsulated: true,
              right: Right.TENANT_FIRM_DETAILS_MANAGEMENT,
            },
            {
              key: "missionVisionValues",
              label:
                messages?.sidebar?.menuItems?.mainMenuItems?.subMenuItems
                  ?.missionVisionValues,
              path: routes.firmProfile.missionVisionValues,
              icon: <OutlinedFlagIcon />,
              isEncapsulated: true,
              right: [
                Right.TENANT_MISSION_VISION_VALUES_MANAGEMENT,
                Right.TENANT_MISSION_VISION_VALUES_MANAGEMENT_READ_ONLY,
              ],
            },
            {
              key: "people",
              label:
                messages?.sidebar?.menuItems?.mainMenuItems?.subMenuItems
                  ?.people,
              path: routes.firmProfile.people,
              icon: <Groups2OutlinedIcon />,
              isEncapsulated: true,
              right: [
                Right.TENANT_EMPLOYEE_MANAGEMENT_BASIC,
                Right.TENANT_EMPLOYEE_MANAGEMENT_SENSITIVE,
              ],
            },
            {
              key: "teamStructure",
              label:
                messages?.sidebar?.menuItems?.mainMenuItems?.subMenuItems
                  ?.teamStructure,
              path: routes.firmProfile.teamStructure,
              icon: <WorkspacesOutlinedIcon />,
              isEncapsulated: true,
              right: Right.TENANT_TEAM_STRUCTURE,
            },
            {
              key: "organizationChart",
              label:
                messages?.sidebar?.menuItems?.mainMenuItems?.subMenuItems
                  ?.organizationChart,
              path: routes.firmProfile.organizationChart,
              icon: <CorporateFareOutlinedIcon />,
              isEncapsulated: true,
              right: [
                Right.TENANT_ORGANIZATION_STRUCTURE,
                Right.TENANT_ORGANIZATION_STRUCTURE_READ_ONLY,
              ],
            },
          ],
        },
      ],
    },
    {
      key: "plan",
      label: messages?.sidebar?.menuItems?.plan,
      mainMenuItems: [
        {
          key: "objectives",
          label: messages?.sidebar?.menuItems?.mainMenuItems?.objectives,
          icon: <LeaderboardOutlinedIcon />,
          subMenuItem: [
            {
              key: "idealIncome",
              label:
                messages?.sidebar?.menuItems?.mainMenuItems?.subMenuItems
                  ?.idealIncome,
              path: routes.idealIncome.root,
              icon: <MoneyOutlinedIcon />,
              right: Right.IDEAL_INCOME_MANAGEMENT,
            },
            {
              key: "idealLifestyle",
              label:
                messages?.sidebar?.menuItems?.mainMenuItems?.subMenuItems
                  ?.idealLifestyle,
              path: routes.idealLifestyle.root,
              icon: <NightlifeOutlinedIcon />,
              right: Right.IDEAL_LIFESTYLE_MANAGEMENT,

            },
          ],
        },
        {
          key: "growthPlan",
          label: messages?.sidebar?.menuItems?.mainMenuItems?.growthPlan,
          path: routes.growthPlan,
          icon: <OutlinedFlagIcon />,
        },
        {
          key: "wizeMAndA",
          label: messages?.sidebar?.menuItems?.mainMenuItems?.wizeMAndA,
          icon: <MergeTypeOutlinedIcon />,
          subMenuItem: [
            {
              key: "potentialAcquisitions",
              label:
                messages?.sidebar?.menuItems?.mainMenuItems?.subMenuItems
                  ?.potentialAcquisitions,
              path: routes.wizeMAndA.potentialAcquisitions,
              icon: <HandshakeOutlinedIcon />,
            },
            {
              key: "businessBrokers",
              label:
                messages?.sidebar?.menuItems?.mainMenuItems?.subMenuItems
                  ?.businessBrokers,
              path: routes.wizeMAndA.businessBrokers,
              icon: <HailOutlinedIcon />,
            },
            {
              key: "riskAssessment",
              label:
                messages?.sidebar?.menuItems?.mainMenuItems?.subMenuItems
                  ?.riskAssessment,
              path: routes.wizeMAndA.riskAssessment,
              icon: <AnalyticsOutlinedIcon />,
            },
            {
              key: "borrowingCalculator",
              label:
                messages?.sidebar?.menuItems?.mainMenuItems?.subMenuItems
                  ?.borrowingCalculator,
              path: routes.wizeMAndA.borrowingCalculator,
              icon: <LocalAtmOutlinedIcon />,
            },
          ],
        },
        {
          key: "budgetAndCapacity",
          label: messages?.sidebar?.menuItems?.mainMenuItems?.budgetAndCapacity,
          path: routes.budgetAndCapacity.root,
          icon: <OutboundOutlinedIcon />,
          right: Right.BUDGET_AND_CAPACITY_MANAGEMENT,
        },
      ],
    },
    {
      key: "execute",
      label: messages?.sidebar?.menuItems?.execute,
      mainMenuItems: [
        {
          key: "taskManagement",
          label: messages?.sidebar?.menuItems?.mainMenuItems?.taskManagement,
          path: routes.taskManagement,
          icon: <DatasetOutlinedIcon />,
          right: [
            Right.TENANT_TASK_MANAGEMENT,
            Right.TENANT_TASK_MANAGEMENT_READ_ONLY,
          ],
        },
        {
          key: "delegationAndScheduling",
          label:
            messages?.sidebar?.menuItems?.mainMenuItems
              ?.delegationAndScheduling,
          path: routes.delegationAndScheduling,
          icon: <PendingActionsOutlinedIcon />,
          right: Right.DELEGATION_MANAGEMENT,
        },
        {
          key: "meeting",
          label: messages?.sidebar?.menuItems?.mainMenuItems?.meeting,
          path: routes.meeting,
          icon: <GroupsOutlinedIcon />,
          right: Right.TENANT_MEETING_MANAGEMENT,
        },
        {
          key: "policiesAndProcedures",
          label:
            messages?.sidebar?.menuItems?.mainMenuItems?.policiesAndProcedures,
          path: routes.policiesAndProcedures?.root,
          icon: <SummarizeOutlinedIcon />,
          right: Right.POLICY_PROCEDURE_MANAGEMENT,
        },
      ],
    },
    {
      key: "measure",
      label: messages?.sidebar?.menuItems?.measure,
      mainMenuItems: [
        {
          key: "financialOverview",
          label: messages?.sidebar?.menuItems?.mainMenuItems?.financialOverview,
          icon: <AccountBalanceWalletOutlinedIcon />,
          subMenuItem: [
            {
              key: "fees",
              label:
                messages?.sidebar?.menuItems?.mainMenuItems?.subMenuItems?.fees,
              path: routes.financialOverview.fees,
              icon: <MoneyOutlinedIcon />,
              isEncapsulated: true,
              right: Right.FEE_MANAGEMENT,
            },
            {
              key: "ebitda",
              label:
                messages?.sidebar?.menuItems?.mainMenuItems?.subMenuItems
                  ?.ebitda,
              path: routes.financialOverview.ebitda,
              icon: <LegendToggleIcon />,
              isEncapsulated: true,
              right: Right.EBITA_MANAGEMENT,
            },
            {
              key: "lockups",
              label:
                messages?.sidebar?.menuItems?.mainMenuItems?.subMenuItems
                  ?.lockups,
              path: routes.financialOverview.lockups,
              icon: <LaunchOutlinedIcon />,
              isEncapsulated: true,
              right: Right.LOCKUP_MANAGEMENT,
            },
            {
              key: "feesWonAndLost",
              label:
                messages?.sidebar?.menuItems?.mainMenuItems?.subMenuItems
                  ?.feesWonAndLost,
              path: routes.financialOverview.feeWonAndLast,
              icon: <SsidChartOutlinedIcon />,
              isEncapsulated: true,
              right: Right.FEE_WON_LOST_MANAGEMENT,
            },
          ],
        },
        {
          key: "fab5",
          label: messages?.sidebar?.menuItems?.mainMenuItems?.fab5,
          path: routes.fab5.root,
          icon: <MovingOutlinedIcon />,
          right: Right.FAB5_MANAGEMENT,
        },
        {
          key: "netPromoterScore",
          label: messages?.sidebar?.menuItems?.mainMenuItems?.netPromoterScore,
          icon: <SpeedIcon />,
          subMenuItem: [
            {
              key: "client",
              label:
                messages?.sidebar?.menuItems?.mainMenuItems?.subMenuItems
                  ?.client,
              path: routes.netPromoterScore.client,
              icon: <AccountCircleOutlinedIcon />,
              isEncapsulated: true,
              right: Right.CLIENT_NPS_MANAGEMENT,
            },
            {
              key: "team",
              label:
                messages?.sidebar?.menuItems?.mainMenuItems?.subMenuItems?.team,
              path: routes.netPromoterScore.team,
              icon: <GroupOutlinedIcon />,
              isEncapsulated: true,
              right: Right.TEAM_NPS_MANAGEMENT,
            },
          ],
        },
      ],
    },
    {
      key: "crm",
      label: messages?.sidebar?.menuItems?.crm,
      mainMenuItems: [
        {
          key: "leadManagement",
          label: messages?.sidebar?.menuItems?.mainMenuItems?.leadManagement,
          path: routes.leadManagement?.root,
          icon: <ManageSearchRoundedIcon />,
          right: Right.LEAD_MANAGEMENT,
        },
        {
          key: "clientPortfolio",
          label: messages?.sidebar?.menuItems?.mainMenuItems?.clientPortfolio,
          path: routes.clientPortfolio,
          icon: <PieChartOutlineIcon />,
          right: Right.CLIENT_PORTFOLIO_MANAGEMENT,
        },
        {
          key: "marketingResults",
          label: messages?.sidebar?.menuItems?.mainMenuItems?.marketingResults,
          path: routes.marketingResults.root,
          icon: <QueryStatsRoundedIcon />,
          right: [
            Right.MARKETING_RESULTS_MANAGEMENT,
            Right.MARKETING_RESULTS_MANAGEMENT_READ_ONLY,
          ],
        },
        {
          key: "leadCalculator",
          label: messages?.sidebar?.menuItems?.mainMenuItems?.leadCalculator,
          path: routes.leadCalcualteor,
          icon: <CalculateOutlinedIcon />,
          right: Right.LEAD_CALCULATOR_MANAGEMENT,
        },
        {
          key: "bookkeepingQuote",
          label: messages?.sidebar?.menuItems?.mainMenuItems?.bookkeepingQuote,
          path: routes.bookkeepingQuote,
          icon: <FolderSpecialOutlinedIcon />,
          right: Right.BOOKKEEPING_QUOTE_MANAGEMENT,
        },
      ],
    },
    {
      key: "settings",
      label: messages?.sidebar?.menuItems?.settings,
      mainMenuItems: [
        {
          key: "accountManagement",
          label: messages?.sidebar?.menuItems?.mainMenuItems?.accountManagement,
          path: routes.accountManagement,
          icon: <TextSnippetOutlinedIcon />,
          right: [
            Right.TENANT_ACCOUNT_MANAGEMENT,
            Right.TENANT_ACCOUNT_MANAGEMENT_READ_ONLY,
          ],
        },
        {
          key: "systemPreferences",
          label: messages?.sidebar?.menuItems?.mainMenuItems?.systemPreferences,
          path: "",
          icon: <TuneOutlinedIcon />,
          subMenuItem: [
            {
              key: "launchPadSetup",
              path: routes.launchPadSetup,
              label:
                messages?.sidebar?.menuItems?.mainMenuItems?.subMenuItems
                  ?.launchPadSetup,
              icon: <LaunchOutlinedIcon />,
              right: [
                Right.TENANT_LAUNCH_PAD_APP_MANAGEMENT,
                Right.TENANT_LAUNCH_PAD_APP_MANAGEMENT_READ_ONLY,
              ],
            },
            {
              key: "practiceLeadProgressSetup",
              path: routes.practiceLeadProgressSetup.root,
              label:
                messages?.sidebar?.menuItems?.mainMenuItems?.subMenuItems
                  ?.practiceLeadProgressSetup,
              icon: <PublishedWithChangesOutlinedIcon />,
              right: [
                Right.TENANT_LEAD_PROGRESS_MANAGEMENT,
                Right.TENANT_LEAD_PROGRESS_MANAGEMENT_READ_ONLY,
              ],
            },
            {
              key: "feeLostReasonSetup",
              path: routes.feeLostReasonSetup.root,
              label:
                messages?.sidebar?.menuItems?.mainMenuItems?.subMenuItems
                  ?.feeLostReasonSetup,
              icon: <FilterListOutlinedIcon />,
              right: [
                Right.TENANT_FEE_LOST_REASON_MANAGEMENT,
                Right.TENANT_FEE_LOST_REASON_MANAGEMENT_READ_ONLY,
              ],
            },
            {
              key: "meetingMasterSetup",
              path: routes.meetingMasterSetup.root,
              label:
                messages?.sidebar?.menuItems?.mainMenuItems?.subMenuItems
                  ?.meetingMasterSetup,
              icon: <MeetingRoomOutlinedIcon />,
              right: [
                Right.TENANT_MEETING_MASTER_MANAGEMENT,
                Right.TENANT_MEETING_MASTER_MANAGEMENT_READ_ONLY,
              ],
            },
            {
              key: "leadSourceSetup",
              path: routes.leadSourceSetup.root,
              label:
                messages?.sidebar?.menuItems?.mainMenuItems?.subMenuItems
                  ?.leadSourceSetup,
              icon: <EventNoteOutlinedIcon />,
              right: [
                Right.TENANT_LEAD_SOURCE_INDUSTRY_MANAGEMENT,
                Right.TENANT_LEAD_SOURCE_INDUSTRY_MANAGEMENT_READ_ONLY,
              ],
            },
            {
              key: "leadIndustrySetup",
              path: routes.leadIndustrySetup.root,
              label:
                messages?.sidebar?.menuItems?.mainMenuItems?.subMenuItems
                  ?.leadIndustrySetup,
              icon: <CurtainsClosedOutlinedIcon />,
              right: [
                Right.TENANT_LEAD_SOURCE_INDUSTRY_MANAGEMENT,
                Right.TENANT_LEAD_SOURCE_INDUSTRY_MANAGEMENT_READ_ONLY,
              ],
            },
            {
              key: "taskStatus",
              path: routes.taskStatus.root,
              label:
                messages?.sidebar?.menuItems?.mainMenuItems?.subMenuItems
                  ?.taskStatus,
              icon: <TaskAltIcon />,
              right: Right.TENANT_TASK_STATUS_MANAGEMENT,
            },
            {
              key: "teamPositions",
              path: routes.teamPositions.root,
              label:
                messages?.sidebar?.menuItems?.mainMenuItems?.subMenuItems
                  ?.teamPositions,
              icon: <WorkspacesOutlinedIcon />,
              right: [
                Right.TENANT_TEAM_POSITION_MANAGEMENT,
                Right.TENANT_TEAM_POSITION_MANAGEMENT_READ_ONLY,
              ],
            },
            {
              key: "meetingCategory",
              path: routes.meetingCategory.root,
              label:
                messages?.sidebar?.menuItems?.mainMenuItems?.subMenuItems
                  ?.meetingCategory,
              icon: <TopicOutlinedIcon />,
              right: Right.TENANT_MEETING_CATEGORY_MANAGEMENT,
            },
          ],
        },
      ],
    },
    {
      key: "supportCenter",
      label: messages?.sidebar?.menuItems?.supportCenter,
      mainMenuItems: [
        // {
        //   key: 'helpDesk',
        //   label: messages?.sidebar?.menuItems?.mainMenuItems?.helpDesk,
        //   path: routes.helpDesk,
        //   icon: <SupportAgentOutlinedIcon />,
        // },
        {
          key: "contactAndFeedback",
          label:
            messages?.sidebar?.menuItems?.mainMenuItems?.contactAndFeedback,
          path: routes.contactFeedback,
          icon: <HelpOutlineOutlinedIcon />,
        },
      ],
    },
    {
      key: "knowledgeBase",
      label: messages?.sidebar?.menuItems?.knowledgeBase,
      mainMenuItems: [
        {
          key: "tutorialsAndGuides",
          label:
            messages?.sidebar?.menuItems?.mainMenuItems?.tutorialsAndGuides,
          path: routes.tutorialsAndGuides,
          icon: <FolderOutlinedIcon />,
        },
      ],
    },
  ];
  return (
    <>
      <StyledTenantContainer noPadding={noPadding} {...styleProps}>
        {!hideSidebar && (
          <Sidebar
            menuItems={menuItems}
            image={WizeHubSidebarLogo}
            smallLogoImage={WizeHubSidebarSmallLogo}
            sidebarOpen={sidebarOpen}
          />
        )}
        <StyledTenantContentContainer noMargin={noMargin}>
          {hasHeader && (
            <Header
              toggleSidebar={toggleSidebar}
              actions={actions}
              userProfile={userProfile}
              baseImageUrl={config?.baseImageUrl}
              sidebarOpen={sidebarOpen}
              isSearch
            />
          )}
          <StyledTenantChildrenContainer
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
          </StyledTenantChildrenContainer>
        </StyledTenantContentContainer>
      </StyledTenantContainer>

      <Modal
        show={formVisibility}
        heading={"Switch Tenant"}
        onClose={hideForm}
        fitContent
      >
        <TenantAccessPopup onCancel={hideForm} onSuccess={hideForm} />
      </Modal>
    </>
  );
};
export default Container;
