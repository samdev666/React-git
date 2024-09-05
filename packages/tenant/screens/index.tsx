import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { AuthenticationStatus, Right } from "../redux/reducers/auth";
import OnlyWith from "@wizehub/common/onlyWith";
import { routes } from "../utils";
import { config, FeatureLevel, isApplicableFeatureLevel } from "../config";
import {
  ForgotPassword,
  Login,
  NoAccessComponent,
  ResetPassword,
  SignUp,
  TenantAccess,
  TwoFactorAuthentication,
} from "./auth";
import LaunchPadComponent from "./systemPreferences/launchPadSetup";
import LeadProgressSetup from "./systemPreferences/leadProgressSetup";
import FeeLostReasonSetup from "./systemPreferences/feeLostReasonSetup";
import LeadSourceSetup from "./systemPreferences/leadSourceSetup";
import LeadIndustrySetup from "./systemPreferences/leadIndustrySetup";
import MeetingMaster from "./systemPreferences/meetingMasterSetup";
import WizeGapForms from "./wizegapForms";
import FileUploadComponent from "./onboarding/fileUpload";
import SuccessComponent from "./onboarding/success";
import TrialPageComponent from "./onboarding/trialPage";
import OnboardingPage from "./onboarding/onboardingPage";
import Overview from "./overview/index";
import TeamPositions from "./systemPreferences/teamPositions";
import BusinessAssessmentForms from "./businessScorecards";
import DiscoveryDashboard from "./businessScorecards";
import AccountManagement from "./accountManagement";
import BudgetAndCapacity from "./plan/budgetAndCapacity";
import IdealIncome from "./plan/objectives/idealIncome";
import IdealLifestyle from "./plan/objectives/idealLifeStyle";
import profile from "./profile";
import MarketingResults from "./marketingResults";
import Fab5 from "./fab5";
import LeadManagement from "./leadManagement";
import FreedomScorecardComponent from "./onboarding/freedomScorecard";
import MeetingCategory from "./systemPreferences/meetingCategory";
import TaskStatus from "./systemPreferences/taskStatus";
import { useSelector } from "react-redux";
import { ReduxState } from "../redux/reducers";
import FirmDetails from "./firmProfile";
import MissionVisionValue from "./firmProfile";
import TeamStructure from "./firmProfile";
import People from "./firmProfile";
import OrganisationChart from "./firmProfile";
import Fees from "./financialOverview";
import Lockup from "./financialOverview";
import Ebidta from "./financialOverview";
import EbitdaBonus from "./financialOverview";
import FeeWonAndLost from "./financialOverview";
import Team from "./netPromoterScore";
import Client from "./netPromoterScore";
import ClientPortfolio from "./clientPortfolio.tsx";
import PoliciesAndProcedures from "./policiesAndProcedures";
import idealIncome from "./plan/objectives/idealIncome";

const modules = [
  {
    key: "overview",
    right: [Right.DASHBOARD_MANAGEMENT, Right.DASHBOARD_READ_ONLY],
    route: routes.overview,
    component: Overview,
  },
  {
    key: "businessAssessment",
    right: [Right.BUSINESS_ASSESSMENT],
    route: routes.businessScoreccards.businessAssessment,
    component: BusinessAssessmentForms,
  },
  {
    key: "wizeGap",
    right: [Right.WIZE_GAP],
    route: routes.wizegapForms,
    component: WizeGapForms,
  },
  {
    key: "firmDetails",
    right: [Right.TENANT_FIRM_DETAILS_MANAGEMENT],
    route: routes.firmProfile.firmDetails,
    component: FirmDetails,
  },
  {
    key: "missionVisionValue",
    right: [
      Right.TENANT_MISSION_VISION_VALUES_MANAGEMENT,
      Right.TENANT_MISSION_VISION_VALUES_MANAGEMENT_READ_ONLY,
    ],
    route: routes.firmProfile.missionVisionValues,
    component: MissionVisionValue,
  },
  {
    key: "people",
    right: [
      Right.TENANT_EMPLOYEE_MANAGEMENT_BASIC,
      Right.TENANT_EMPLOYEE_MANAGEMENT_SENSITIVE,
    ],
    route: routes.firmProfile.people,
    component: People,
  },
  {
    key: "teamStructure",
    right: [Right.TENANT_TEAM_STRUCTURE],
    route: routes.firmProfile.teamStructure,
    component: TeamStructure,
  },
  {
    key: "organisationChart",
    right: [
      Right.TENANT_ORGANIZATION_STRUCTURE,
      Right.TENANT_ORGANIZATION_STRUCTURE_READ_ONLY,
    ],
    route: routes.firmProfile.organizationChart,
    component: OrganisationChart,
  },
  {
    key: "budgetAndCapacity",
    right: [Right.BUDGET_AND_CAPACITY_MANAGEMENT],
    route: routes.budgetAndCapacity.root,
    component: BudgetAndCapacity,
  },
  {
    key: "idealLifestyle",
    right: [Right.IDEAL_LIFESTYLE_MANAGEMENT],
    route: routes.idealLifestyle.root,
    component: IdealLifestyle,
  },
  {
    key: "idealIncome",
    right: [Right.IDEAL_INCOME_MANAGEMENT],
    route: routes.idealIncome.root,
    component: IdealIncome,
  },
  {
    key: "policiesAndProcedures",
    right: [Right.POLICY_PROCEDURE_MANAGEMENT],
    route: routes.policiesAndProcedures?.root,
    component: PoliciesAndProcedures,
  },
  {
    key: "launchPad",
    right: [
      Right.TENANT_LAUNCH_PAD_APP_MANAGEMENT,
      Right.TENANT_LAUNCH_PAD_APP_MANAGEMENT_READ_ONLY,
    ],
    route: routes.launchPadSetup,
    component: LaunchPadComponent,
  },
  {
    key: "leadProgress",
    right: [
      Right.TENANT_LEAD_PROGRESS_MANAGEMENT,
      Right.TENANT_LEAD_PROGRESS_MANAGEMENT_READ_ONLY,
    ],
    route: routes.practiceLeadProgressSetup.root,
    component: LeadProgressSetup,
  },
  {
    key: "feeLostReason",
    right: [
      Right.TENANT_FEE_LOST_REASON_MANAGEMENT,
      Right.TENANT_FEE_LOST_REASON_MANAGEMENT_READ_ONLY,
    ],
    route: routes.feeLostReasonSetup.root,
    component: FeeLostReasonSetup,
  },
  {
    key: "leadIndustry",
    right: [
      Right.TENANT_LEAD_SOURCE_INDUSTRY_MANAGEMENT,
      Right.TENANT_LEAD_SOURCE_INDUSTRY_MANAGEMENT_READ_ONLY,
    ],
    route: routes.leadIndustrySetup.root,
    component: LeadIndustrySetup,
  },
  {
    key: "leadSource",
    right: [
      Right.TENANT_LEAD_SOURCE_INDUSTRY_MANAGEMENT,
      Right.TENANT_LEAD_SOURCE_INDUSTRY_MANAGEMENT_READ_ONLY,
    ],
    route: routes.leadSourceSetup.root,
    component: LeadSourceSetup,
  },
  {
    key: "meetingMaster",
    right: [
      Right.TENANT_MEETING_MASTER_MANAGEMENT,
      Right.TENANT_MEETING_MASTER_MANAGEMENT_READ_ONLY,
    ],
    route: routes.meetingMasterSetup.root,
    component: MeetingMaster,
  },
  {
    key: "teamPositions",
    right: [
      Right.TENANT_TEAM_POSITION_MANAGEMENT,
      Right.TENANT_TEAM_POSITION_MANAGEMENT_READ_ONLY,
    ],
    route: routes.teamPositions.root,
    component: TeamPositions,
  },
  {
    key: "accountManagement",
    right: [
      Right.TENANT_ACCOUNT_MANAGEMENT,
      Right.TENANT_ACCOUNT_MANAGEMENT_READ_ONLY,
    ],
    route: routes.accountManagement,
    component: AccountManagement,
  },
  {
    key: "leadManagement",
    right: [Right.LEAD_MANAGEMENT],
    route: routes.leadManagement.root,
    component: LeadManagement,
  },
  {
    key: "clientPortfolio",
    right: [Right.CLIENT_PORTFOLIO_MANAGEMENT],
    route: routes.clientPortfolio,
    component: ClientPortfolio,
  },
  {
    key: "marketingResults",
    right: [
      Right.MARKETING_RESULTS_MANAGEMENT,
      Right.MARKETING_RESULTS_MANAGEMENT_READ_ONLY,
    ],
    route: routes.marketingResults.root,
    component: MarketingResults,
  },
  {
    key: "fab5",
    right: [Right.FAB5_MANAGEMENT],
    route: routes.fab5.root,
    component: Fab5,
  },
  {
    key: "fees",
    right: [Right.FEE_MANAGEMENT],
    route: routes.financialOverview.fees,
    component: Fees,
  },
  {
    key: "lockup",
    right: [Right.LOCKUP_MANAGEMENT],
    route: routes.financialOverview.lockups,
    component: Lockup,
  },
  {
    key: "ebitda",
    right: [Right.EBITA_MANAGEMENT],
    route: routes.financialOverview.ebitda,
    component: Ebidta,
  },
  {
    key: "ebitdaBonus",
    right: [Right.EBITA_MANAGEMENT],
    route: routes.financialOverview.ebitdaBonus,
    component: EbitdaBonus,
  },
  {
    key: "feeWonAndLast",
    right: [Right.FEE_WON_LOST_MANAGEMENT],
    route: routes.financialOverview.feeWonAndLast,
    component: FeeWonAndLost,
  },
  {
    key: "team",
    right: [Right.TEAM_NPS_MANAGEMENT],
    route: routes.netPromoterScore.team,
    component: Team,
  },
  {
    key: "client",
    right: [Right.CLIENT_NPS_MANAGEMENT],
    route: routes.netPromoterScore.client,
    component: Client,
  },
  {
    key: "meetingCategory",
    right: [Right.TENANT_MEETING_CATEGORY_MANAGEMENT],
    route: routes.meetingCategory.root,
    component: MeetingCategory,
  },
  {
    key: "taskStatus",
    right: [Right.TENANT_TASK_STATUS_MANAGEMENT],
    route: routes.taskStatus.root,
    component: TaskStatus,
  },
  {
    key: "profile",
    right: [Right.PROFILE_MANAGEMENT],
    route: routes.profile,
    component: profile,
  },
];

//TODO: this needs to be removed after delivery of first milestone*/
const stagingModules = [
  {
    key: "overview",
    right: [Right.DASHBOARD_MANAGEMENT, Right.DASHBOARD_READ_ONLY],
    route: routes.overview,
    component: Overview,
  },
  {
    key: "businessAssessment",
    right: [Right.BUSINESS_ASSESSMENT],
    route: routes.businessScoreccards.businessAssessment,
    component: BusinessAssessmentForms,
  },
  {
    key: "wizeGap",
    right: [Right.WIZE_GAP],
    route: routes.wizegapForms,
    component: WizeGapForms,
  },
  {
    key: "firmDetails",
    right: [Right.TENANT_FIRM_DETAILS_MANAGEMENT],
    route: routes.firmProfile.firmDetails,
    component: FirmDetails,
  },
  {
    key: "missionVisionValue",
    right: [
      Right.TENANT_MISSION_VISION_VALUES_MANAGEMENT,
      Right.TENANT_MISSION_VISION_VALUES_MANAGEMENT_READ_ONLY,
    ],
    route: routes.firmProfile.missionVisionValues,
    component: MissionVisionValue,
  },
  {
    key: "launchPad",
    right: [
      Right.TENANT_LAUNCH_PAD_APP_MANAGEMENT,
      Right.TENANT_LAUNCH_PAD_APP_MANAGEMENT_READ_ONLY,
    ],
    route: routes.launchPadSetup,
    component: LaunchPadComponent,
  },
  {
    key: "leadProgress",
    right: [
      Right.TENANT_LEAD_PROGRESS_MANAGEMENT,
      Right.TENANT_LEAD_PROGRESS_MANAGEMENT_READ_ONLY,
    ],
    route: routes.practiceLeadProgressSetup.root,
    component: LeadProgressSetup,
  },
  {
    key: "feeLostReason",
    right: [
      Right.TENANT_FEE_LOST_REASON_MANAGEMENT,
      Right.TENANT_FEE_LOST_REASON_MANAGEMENT_READ_ONLY,
    ],
    route: routes.feeLostReasonSetup.root,
    component: FeeLostReasonSetup,
  },
  {
    key: "leadIndustry",
    right: [
      Right.TENANT_LEAD_SOURCE_INDUSTRY_MANAGEMENT,
      Right.TENANT_LEAD_SOURCE_INDUSTRY_MANAGEMENT_READ_ONLY,
    ],
    route: routes.leadIndustrySetup.root,
    component: LeadIndustrySetup,
  },
  {
    key: "leadSource",
    right: [
      Right.TENANT_LEAD_SOURCE_INDUSTRY_MANAGEMENT,
      Right.TENANT_LEAD_SOURCE_INDUSTRY_MANAGEMENT_READ_ONLY,
    ],
    route: routes.leadSourceSetup.root,
    component: LeadSourceSetup,
  },
  {
    key: "meetingMaster",
    right: [
      Right.TENANT_MEETING_MASTER_MANAGEMENT,
      Right.TENANT_MEETING_MASTER_MANAGEMENT_READ_ONLY,
    ],
    route: routes.meetingMasterSetup.root,
    component: MeetingMaster,
  },
  {
    key: "teamPositions",
    right: [
      Right.TENANT_TEAM_POSITION_MANAGEMENT,
      Right.TENANT_TEAM_POSITION_MANAGEMENT_READ_ONLY,
    ],
    route: routes.teamPositions.root,
    component: TeamPositions,
  },
  {
    key: "leadManagement",
    right: [Right.LEAD_MANAGEMENT],
    route: routes.leadManagement.root,
    component: LeadManagement,
  },
  {
    key: "marketingResults",
    right: [
      Right.MARKETING_RESULTS_MANAGEMENT,
      Right.MARKETING_RESULTS_MANAGEMENT_READ_ONLY,
    ],
    route: routes.marketingResults.root,
    component: MarketingResults,
  },
  {
    key: "meetingCategory",
    right: [Right.TENANT_MEETING_CATEGORY_MANAGEMENT],
    route: routes.meetingCategory.root,
    component: MeetingCategory,
  },
  {
    key: "taskStatus",
    right: [Right.TENANT_TASK_STATUS_MANAGEMENT],
    route: routes.taskStatus.root,
    component: TaskStatus,
  },
  {
    key: "profile",
    right: [Right.PROFILE_MANAGEMENT],
    route: routes.profile,
    component: profile,
  },
  {
    key: "people",
    right: [
      Right.TENANT_EMPLOYEE_MANAGEMENT_BASIC,
      Right.TENANT_EMPLOYEE_MANAGEMENT_SENSITIVE,
    ],
    route: routes.firmProfile.people,
    component: People,
  },
  {
    key: "teamStructure",
    right: [Right.TENANT_TEAM_STRUCTURE],
    route: routes.firmProfile.teamStructure,
    component: TeamStructure,
  },
  {
    key: "organisationChart",
    right: [
      Right.TENANT_ORGANIZATION_STRUCTURE,
      Right.TENANT_ORGANIZATION_STRUCTURE_READ_ONLY,
    ],
    route: routes.firmProfile.organizationChart,
    component: OrganisationChart,
  },
  {
    key: "budgetAndCapacity",
    right: [Right.BUDGET_AND_CAPACITY_MANAGEMENT],
    route: routes.budgetAndCapacity.root,
    component: BudgetAndCapacity,
  },
  {
    key: "fees",
    right: [Right.FEE_MANAGEMENT],
    route: routes.financialOverview.fees,
    component: Fees,
  },
  {
    key: "lockup",
    right: [Right.LOCKUP_MANAGEMENT],
    route: routes.financialOverview.lockups,
    component: Lockup,
  },
  {
    key: "ebitda",
    right: [Right.EBITA_MANAGEMENT],
    route: routes.financialOverview.ebitda,
    component: Ebidta,
  },
  {
    key: "ebitdaBonus",
    right: [Right.EBITA_MANAGEMENT],
    route: routes.financialOverview.ebitdaBonus,
    component: EbitdaBonus,
  },
  {
    key: "accountManagement",
    right: [
      Right.TENANT_ACCOUNT_MANAGEMENT,
      Right.TENANT_ACCOUNT_MANAGEMENT_READ_ONLY,
    ],
    route: routes.accountManagement,
    component: AccountManagement,
  },
  {
    key: "team",
    right: [Right.TEAM_NPS_MANAGEMENT],
    route: routes.netPromoterScore.team,
    component: Team,
  },
  {
    key: "client",
    right: [Right.CLIENT_NPS_MANAGEMENT],
    route: routes.netPromoterScore.client,
    component: Client,
  },
];

const Screens: React.FC = () => {
  const auth = useSelector((state: ReduxState) => state.auth);
  const finalModuleArray = modules.filter((module) =>
    module.right.some((right) => auth?.rights.includes(right))
  );

  //TODO: this needs to be removed after delivery of first milestone
  const finalStagingModuleArray = stagingModules.filter((module) =>
    module.right.some((right) => auth?.rights?.includes(right))
  );

  return (
    <>
      <OnlyWith
        status={AuthenticationStatus.AUTHENTICATED}
        isApplicableFeatureLevel={isApplicableFeatureLevel}
        featureLevel={FeatureLevel.development}
      >
        <Switch>
          <Route
            path={routes.businessScoreccards.summary}
            component={DiscoveryDashboard}
          />
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
          <Route component={() => <Redirect to={routes.overview} />} />
        </Switch>
      </OnlyWith>
      {/* //TODO: this needs to be removed after delivery of first milestone*/}
      {config.featureLevel === FeatureLevel.staging && (
        <OnlyWith
          status={AuthenticationStatus.AUTHENTICATED}
          isApplicableFeatureLevel={isApplicableFeatureLevel}
          featureLevel={FeatureLevel.staging}
        >
          <Switch>
            <Route
              path={routes.businessScoreccards.summary}
              component={DiscoveryDashboard}
            />
            {finalStagingModuleArray.map((module) =>
              module.right.some((right) =>
                auth.hasStatusAndRight(
                  AuthenticationStatus.AUTHENTICATED,
                  right
                )
              ) ? (
                <Route
                  key={module.key}
                  path={module.route}
                  component={module.component}
                />
              ) : null
            )}
            <Route component={() => <Redirect to={routes.overview} />} />
          </Switch>
        </OnlyWith>
      )}
      <OnlyWith status={AuthenticationStatus.ONBOARDING}>
        <Switch>
          <Route path={routes.fileUpload} component={FileUploadComponent} />
          <Route path={routes.success} component={SuccessComponent} />
          <Route path={routes.onboarding} component={TrialPageComponent} />
          <Route component={() => <Redirect to={routes.fileUpload} />} />
        </Switch>
      </OnlyWith>
      <OnlyWith status={AuthenticationStatus.SET_TENANT}>
        <Switch>
          <Route path={routes.tenantAccess} component={TenantAccess} />
          <Route component={() => <Redirect to={routes.tenantAccess} />} />
        </Switch>
      </OnlyWith>
      <OnlyWith status={AuthenticationStatus.INCOMPLETE_BUSINESS_ASSESSMENT}>
        <Switch>
          <Route
            path={routes.freedomScorecardStep}
            component={FreedomScorecardComponent}
          />
          <Route
            path={routes.businessScoreccards.businessAssessment}
            component={BusinessAssessmentForms}
          />
          <Route
            component={() => <Redirect to={routes.freedomScorecardStep} />}
          />
        </Switch>
      </OnlyWith>
      <OnlyWith status={AuthenticationStatus.NOT_AUTHENTICATED}>
        <Switch>
          <Route path={routes.signup} component={SignUp} />
          <Route path={routes.login} component={Login} />
          <Route path={routes.resetPassword} component={ResetPassword} />
          <Route path={routes.forgotPassword} component={ForgotPassword} />
          <Route path={routes.twoFaAuth} component={TwoFactorAuthentication} />
          <Route path={routes.noAccess} component={NoAccessComponent} />

          <Route component={() => <Redirect to={routes.login} />} />
        </Switch>
      </OnlyWith>
    </>
  );
};

export default Screens;
