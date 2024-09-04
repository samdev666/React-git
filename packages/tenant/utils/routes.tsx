export const createResourceRoutes = (resource: string) => ({
  root: `/${resource}`,
  create: `/${resource}/create`,
  view: `/${resource}/view/:id`,
});

export const routes = {
  root: "/",
  login: "/login",
  twoFaAuth: "/two-factor-authentication",
  tenantAccess: "/tenant-access",
  noAccess: "/no-access",
  logout: "/logout",
  signup: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password/:token",
  fileUpload: "/file-upload",
  success: "/success",
  onboarding: "/onboarding",
  freedomScorecardStep: "/freedom-scorecard-steps",
  growthPhases: "/growth-phases",
  dashboard: createResourceRoutes(`dashboard`),
  profile: "/profile",
  test: createResourceRoutes("test"),
  wizegapForms: "/wizegap-forms",
  overview: "/overview",
  wizeBlueprint: "/wize-blueprint",
  businessScoreccards: {
    businessAssessment: "/business-scorecards/business-assessment",
    summary: "/business-scorecards/summary",
  },
  firmProfile: {
    root: "/firm-profile",
    firmDetails: "/firm-profile/firm-details",
    missionVisionValues: "/firm-profile/mission-vision-values",
    addNewMissionVisionValues:
      "/firm-profile/mission-vision-values/add-new-mission-vision-values",
    people: "/firm-profile/people",
    peopleDetail: "/firm-profile/people/people-detail/:id",
    peopleForm: "/firm-profile/people/people-form",
    editPeopleForm: "/firm-profile/people/people-form/:id",
    teamStructure: "/firm-profile/team-structure",
    divisionEmployee: "/firm-profile/team-structure/:id",
    teamNPS: "/team-nps",
    organizationChart: "/firm-profile/organization-chart",
  },
  objectives: {
    idealIncome: "/objectives/ideal-income",
    idealLifestyle: "/objectives/ideal-lifestyle",
  },
  launchPadSetup: "/launchpad-setup",
  practiceLeadProgressSetup: {
    root: "/practice-lead-progress-setup/stage-status",
  },
  feeLostReasonSetup: {
    root: "/fee-lost-reason-setup",
  },
  meetingCategory: {
    root: "/meeting-category",
  },
  taskStatus: {
    root: "/task-status",
  },
  meetingMasterSetup: {
    root: "/meeting-master-setup",
    agenda: "/meeting-master-setup/agenda",
    meetingQuestionDetail: "/meeting-master-setup/meeting-question-detail/:id",
    meetingAgendaDetail: "/meeting-master-setup/meeting-agenda-detail/:id",
    category: "/meeting-master-setup/category",
    progressStatus: "/meeting-master-setup/progress-status",
  },
  leadSourceSetup: {
    root: "/lead-source-setup",
  },
  leadIndustrySetup: {
    root: "/lead-industry-setup",
  },
  teamPositions: {
    root: "/team-positions",
    teamPositionDetail: "/team-positions/team-positions-details/:id",
  },
  growthPlan: "/growth-plan",
  wizeMAndA: {
    potentialAcquisitions: "/potential-acquisitions",
    businessBrokers: "/business-brokers",
    riskAssessment: "/risk-assessment",
    borrowingCalculator: "/borrowing-calculator",
  },
  budgetAndCapacity: {
    root: "/budget-and-capacity",
    addTeam: "/budget-and-capacity/:currentYear/add-team/budget/:budgetId",
    editTeam: '/budget-and-capacity/:currentYear/edit-team/budget/:budgetId/team-budget/:activeTeamId',
    firmWideResults: "/budget-and-capacity/firm-wide-results",
    feeBudget: "/budget-and-capacity/fee-budget",
    teamCapacity: "/budget-and-capacity/team-capacity",
    teamBudget: "/budget-and-capacity/team-budget",
    summaryResults: "/budget-and-capacity/summary-results",
  },
  idealIncome: {
    root: "/ideal-income"
  },
  taskManagement: "/task-management",
  delegationAndScheduling: "/delegation-scheduling",
  meeting: "/other-route",
  policiesAndProcedures: {
    root: "/policies-and-procedures",
    policiesAndProceduresDetail: "/policies-and-procedures/policies-and-procedures-detail/:id"
  },
  financialOverview: {
    root: "/financial-overview",
    fees: "/financial-overview/fees",
    feeBreakdown: "/financial-overview/fees/fee-breakdown",
    varianceAnalysis: "/financial-overview/fees/variance-analysis",
    ebitda: "/financial-overview/ebitda",
    ebitdaBonus: "/financial-overview/ebitda-bonus",
    lockups: "/financial-overview/lockups",
    feeWonAndLast: "/financial-overview/fee-won-and-lost",
  },
  fab5: {
    root: "/fab5",
    preview: "/fab5/preview",
  },
  netPromoterScore: {
    root: "/net-promoter-score",
    team: "/net-promoter-score/team",
    client: "/net-promoter-score/client",
  },
  leadManagement: {
    root: "/lead-management",
    lead: "/lead-management/lead",
    prospect: "/lead-management/prospect",
    client: "/lead-management/client",
    clientDetail: "/lead-management/client-detail/:id",
    editClientDetail: "/lead-management/client-detail/:id/edit",
  },
  clientPortfolio: "/client-portfolio",
  marketingResults: {
    root: "/marketing-results",
    leadData: "/marketing-results/lead-data",
    websiteTraffic: "/marketing-results/website-traffic",
    newsletterOpenRate: "/marketing-results/newsletter-open-rate",
    clickThroughRate: "/marketing-results/click-through-rate",
    databaseGrowth: "/marketing-results/database-growth",
  },
  leadCalcualteor: "/lead-calculator",
  clientNPS: "/client-nps",
  bookkeepingQuote: "/bookkeeping-quote",
  accountManagement: "/account-management",
  helpDesk: "/help-desk",
  contactFeedback: "/contact-feedback",
  tutorialsAndGuides: "/tutorials-and-guides",
};

export default routes;
