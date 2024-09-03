import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import OnlyWith from "@wizehub/common/onlyWith";
import { useSelector } from "react-redux";
import { AuthenticationStatus, Right } from "../redux/reducers/auth";
import {
  ForgotPassword,
  Login,
  ResetPassword,
  TwoFactorAuthentication,
} from "./auth";
import { routes } from "../utils";
import Profile from "./profile";
import Dashboard from "./dashboard";
import ProductManagement from "./productManagement";
import TenantManagement from "./tenantManagement";
import UserManagement from "./userManagement";
import { isApplicableFeatureLevel } from "../config";
import LeadProgressStages from "./leadDataManagement";
import LeadSource from "./leadDataManagement";
import LeadIndustry from "./leadDataManagement";
import ApplicationComponent from "./masterData";
import FeeLostReason from "./masterData";
import TeamPosition from "./masterData";
import MeetingQuestionsAndCategories from "./masterData";
import MeetingAgendaAndStatus from "./masterData";
import ProjectManagement from "./masterData";
import MeetingCategory from "./masterData";
import TaskStatus from "./masterData";
import { ReduxState } from "../redux/reducers";

const redirectToRoot = () => <Redirect to={routes.dashboard.root} />;
const redirectToLogin = () => <Redirect to={routes.login} />;

const modules = [
  {
    key: "dashboard",
    right: [Right.DASHBOARD, Right.DASHBOARD_READ_ONLY],
    route: routes.dashboard.root,
    component: Dashboard,
  },
  {
    key: "productManagement",
    right: [Right.PRODUCT_MANAGEMENT, Right.PRODUCT_MANAGEMENT_READ_ONLY],
    route: routes.productmanagement.root,
    component: ProductManagement,
  },
  {
    key: "tenantManagement",
    right: [
      Right.TENANT_MANAGEMENT,
      Right.TENANT_MANAGEMENT_READ_ONLY,
      Right.GROUP_MANAGEMENT,
    ],
    route: routes.tenantmanagement.root,
    component: TenantManagement,
  },
  {
    key: "userManagement",
    right: [Right.USER_MANAGEMENT],
    route: routes.usermanagement.root,
    component: UserManagement,
  },
  {
    key: "application",
    right: [Right.APPLICATION_MANAGEMENT],
    route: routes.masterData.application,
    component: ApplicationComponent,
  },
  {
    key: "feeLostReason",
    right: [
      Right.FEE_LOST_REASON,
      Right.TENANT_FEE_LOST_REASON_MANAGEMENT_READ_ONLY,
    ],
    route: routes.masterData.feeLostReason,
    component: FeeLostReason,
  },
  {
    key: "teamPosition",
    right: [
      Right.TEAM_POSITION,
      Right.TENANT_TEAM_POSITION_MANAGEMENT_READ_ONLY,
    ],
    route: routes.masterData.teamPosition,
    component: TeamPosition,
  },
  {
    key: "meetingQuestionsAndCategories",
    right: [Right.MEETING_QUESTIONS_AND_CATEGORIES],
    route: routes.masterData.meetingQuestionsAndCategories,
    component: MeetingQuestionsAndCategories,
  },
  {
    key: "meetingAgendaAndStatus",
    right: [Right.MEETING_AGENDA_TEMPLATES],
    route: routes.masterData.meetingAgendaAndStatus,
    component: MeetingAgendaAndStatus,
  },
  {
    key: "leadProgressStages",
    right: [
      Right.LEAD_PROGRESS_STAGES,
      Right.TENANT_LEAD_PROGRESS_MANAGEMENT_READ_ONLY,
    ],
    route: routes.leadData.leadProgressStages,
    component: LeadProgressStages,
  },
  {
    key: "leadSources",
    right: [Right.LEAD_SOURCES],
    route: routes.leadData.leadSources,
    component: LeadSource,
  },
  {
    key: "leadIndustry",
    right: [
      Right.LEAD_INDUSTRY,
      Right.TENANT_LEAD_SOURCE_INDUSTRY_MANAGEMENT_READ_ONLY,
    ],
    route: routes.leadData.leadIndustry,
    component: LeadIndustry,
  },
  {
    key: "project",
    right: [Right.PROJECTS],
    route: routes.masterData.project,
    component: ProjectManagement,
  },
  {
    key: "meetingCateogies",
    right: [Right.MEETING_CATEGORY_MANAGEMENT],
    route: routes.masterData.meetingCategories,
    component: MeetingCategory,
  },
  {
    key: "taskStatus",
    right: [Right.TASK_STATUS_MANAGEMENT],
    route: routes.masterData.taskStatus,
    component: TaskStatus,
  },
];

const Screens: React.FC = () => {
  const auth = useSelector((state: ReduxState) => state.auth);
  const finalModuleArray = modules.filter((module) =>
    module.right.some((right) => auth?.rights.includes(right))
  );
  return (
    <>
      <OnlyWith
        status={AuthenticationStatus.AUTHENTICATED}
        isApplicableFeatureLevel={isApplicableFeatureLevel}
      >
        <Switch>
          {finalModuleArray.map((module) =>
            module.right.some((right) =>
              auth.hasStatusAndRight(AuthenticationStatus.AUTHENTICATED, right)
            ) ? (
              <Route
                key={module.key}
                path={module.route}
                component={module.component}
              />
            ) : null
          )}
          <Route path={routes.profile} component={Profile} />
          <Route component={redirectToRoot} />
        </Switch>
      </OnlyWith>
      <OnlyWith status={AuthenticationStatus.NOT_AUTHENTICATED}>
        <Switch>
          <Route path={routes.login} component={Login} />
          <Route path={routes.forgotPassword} component={ForgotPassword} />
          <Route path={routes.resetPassword} component={ResetPassword} />
          <Route path={routes.twoFaAuth} component={TwoFactorAuthentication} />

          <Route component={redirectToLogin} />
        </Switch>
      </OnlyWith>
    </>
  );
};

export default Screens;
