export const createResourceRoutes = (resource: string) => ({
  root: `/${resource}`,
  create: `/${resource}/create`,
  view: `/${resource}/view/:id`,
});

export const routes = {
  productmanagement: {
    root: "/product-management",
    productDetail: "/product-management/product-detail/:id",
  },
  tenantmanagement: {
    root: "/tenant-management",
    tenantManagementGroup: "/tenant-management/tenant-groups",
    tenantDetail: "/tenant-management/tenant-detail/:id",
    tenantGroupDetail: "/tenant-management/tenant-group-detail/:id",
  },
  usermanagement: {
    root: "/user-management",
    userProfile: "/user-management/user-profile/:id",
  },
  root: "/",
  login: "/login",
  twoFaAuth: "/two-factor-authentication",
  activeTwoFactorAuthentication: "/active-two-factor-authentication",
  logout: "/logout",
  signup: "/signup",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password/:token",
  dashboard: createResourceRoutes("dashboard"),
  profile: "/profile",
  masterData: {
    application: "/application",
    applicationDetail: "/application/application-detail/:id",
    feeLostReason: "/fee-lost-reason",
    teamPosition: "/team-positions",
    teamPositionDetails: "/team-positions/team-positions-details/:id",
    meetingQuestionsAndCategories: "/meeting-questions-and-categories",
    meetingQuestionDetails:
      "/meeting-questions-and-categories/meeting-questions-and-categories-detail/:id",
    meetingAgendaAndStatus: "/meeting-agenda-and-status",
    meetingAgendaDetails:
      "/meeting-agenda-and-status/meeting-agenda-and-status-detail/:id",
    project: "/project",
    projectDetails: "/project/project-detail/:id",
    meetingCategories: "/meeting-category",
    taskStatus: "/task-status",
  },
  leadData: {
    leadProgressStages: "/lead-progress-status",
    leadSources: "/lead-source",
    leadIndustry: "/lead-industry",
  },
  test: createResourceRoutes("test"),
};

export default routes;
