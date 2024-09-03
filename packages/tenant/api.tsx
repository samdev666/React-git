/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { HttpMethods } from "../common/utils";
import { config } from "./config";
import { getToken } from "./redux/reducers/auth";

const PING = "/api/ping";
export const LOGIN = "/api/login";
export const TWO_FACTOR_AUTHENTICATION = "/api/verify-token";
export const SIGNUP = "/api/register";
export const FILE_UPLOAD = "/api/tenants/upload";
export const FILE_REMOVAL = "/api/tenants/upload/remove/:id";
export const GET_COUNTRIES = "/api/countries/filter";
export const RESET_PASSWORD = "/api/reset-password";
export const RESET_PASSWORD_REQUEST_LINK = "/api/tenants/forgot-password";
export const TWO_FA_AUTHENTICATION_METHOD =
  "/api/two-factor-authentication-methods";
export const USER_TWO_FA_AUTENTICATION = "/api/user/two-factor-authentication";
export const VERIFY_USER_TWO_FA_AUTHENTICATION =
  "/api/user/two-factor-authentication/verify";
export const CHANGE_PASSWORD = "/api/change-password";
export const PROFILE = "/api/profile";
export const EDIT_PROFILE = "/api/update-profile";
export const UPLOAD_PROFILE_IMAGE = "/api/profile/upload";
export const REMOVE_PROFILE_IMAGE = "/api/profile/remove";
export const FETCH_USER_ACCESS = "/api/rights";

export const LAUNCH_PAD_LISTING_API = "/api/tenants/:id/launch-pads/filter";
export const LAUNCH_PAD_BY_ID = "/api/tenants/launch-pads";
export const UPLOAD_LAUNCH_PAD_ICON = "/api/tenants/launch-pads/upload";
export const DELETE_LAUNCH_PAD_ICON =
  "/api/tenants/launch-pads/upload/remove/:id";

export const LEAD_STAGE_LISTING_API =
  "/api/tenants/:id/lead-progress-stages/filter";
export const LEAD_STAGE_BY_ID = "/api/tenants/lead-progress-stages";

export const LEAD_STAGE_STATUS_LISTING_API =
  "/api/tenants/:id/lead-progress-statuses/filter";
export const LEAD_STAGE_STATUS_BY_ID = "/api/tenants/lead-progress-statuses";
export const FEE_LOST_REASON_LISTING_API =
  "/api/tenants/:id/fee-lost-reasons/filter";
export const FEE_LOST_REASON_BY_ID = "/api/tenants/fee-lost-reasons";

export const MEETING_QUESTION_LISTING_API =
  "/api/tenants/:id/meeting-questions/filter";
export const MEETING_QUESTION_BY_ID = "/api/tenants/meeting-questions";

export const MEETING_AGENDA_LISTING_API =
  "/api/tenants/:id/meeting-agendas/filter";
export const MEETING_AGENDA_BY_ID = "/api/tenants/meeting-agendas";

export const MEETING_PROGRESS_LISTING_API =
  "/api/tenants/:id/meeting-agenda-progress-statuses/filter";
export const MEETING_PROGRESS_BY_ID =
  "/api/tenants/meeting-agenda-progress-statuses";

export const MEETING_CATEGORY_LISTING_API =
  "/api/tenants/:id/meeting-question-categories/filter";
export const MEETING_CATEGORY_BY_ID =
  "/api/tenants/meeting-question-categories";

export const GET_TENANT_FORMS = "/api/tenant-forms/:tenantId/form/:code";
export const UPDATE_TENANT_FORMS_SECTION = "/api/tenant-form-sections/:id";
export const GET_USER_LINKED_GROUPS = "/api/linked-groups";
export const GET_USER_LINKED_TENANTS = "/api/linked-tenants";

export const LEAD_SOURCE_LISTING_API = "/api/tenants/:id/lead-sources/filter";
export const LEAD_SOURCE_BY_ID = "/api/tenants/lead-sources";
export const DIVISION_LISTING_API = "/api/divisions";

export const PROJECT_LISTING_API = "/api/tenants/:id/projects/filter";

export const LEAD_INDUSTRY_LISTING_API =
  "/api/tenants/:id/lead-industries/filter";
export const LEAD_INDUSTRY_BY_ID = "/api/tenants/lead-industries";

export const FIRM_DETAIL_BY_ID = "/api/tenants/firm-details";
export const COUNTRIES_API = "/api/countries/filter";

export const MISSION_VISION_VALUE_LISTING_API =
  "/api/tenants/:tenantId/mission-vision-values/filter";

export const MISSION_VISION_VALUE_BY_ID = "/api/tenants/mission-vision-values";

export const MISSION_VISION_VALUE_UPLOAD_IMAGE =
  "/api/tenants/mission-vision-values/upload";

export const MISSION_VISION_VALUE_REMOVE_IMAGE =
  "/api/tenants/mission-vision-values/upload/remove/:id";

export const PEOPLE_LISTING_API = "/api/tenants/:tenantId/employees/filter";

export const TEAM_POSITION_LISTING_API =
  "/api/tenants/:tenantId/team-positions/filter";

export const TEAM_POSITION_BY_ID = "/api/tenants/team-positions";

export const BASIC_EMPLOYEE_DETAIL = "/api/tenants/basic/employees";
export const SENSITIVE_EMPLOYEE_DETAIL = "/api/tenants/sensitive/employees";

export const EMPLOYEE_UPLOAD_API = "/api/tenants/basic/employees/upload";
export const EMPLOYEE_IMAGE_REMOVE_API =
  "/api/tenants/basic/employees/remove/:id";
export const GET_FEE_HISTORY_LISTING =
  "/api/tenants/:tenantId/fee-histories/filter";
export const FEE_HISTORY_API = "/api/tenants/fee-histories";

export const UPDATE_TENANT_FORMS = "/api/tenant-forms/:id";

export const DIVISION_EMPLOYEE_LISTING_API =
  "/api/tenants/:tenantId/divisions/:divisionId/employees/filter";

export const ADD_TEAM_MEMBER_API = "/api/tenants/divisions/employees";

export const ADD_TEAM_API = "/api/tenants/teams";
export const TEAM_EMPLOYEE_LISTING_API =
  "/api/tenants/:tenantId/teams/:teamId/employees/filter";

export const DIVISION_TEAM_LISTING_API =
  "/api/tenants/:tenantId/divisions/:divisionId/teams/filter";

export const TEAM_EMPLOYEE_API = "/api/tenants/teams/employees";

export const ORGANISATION_STRUCTURE_LISTING_API =
  "/api/tenants/:tenantId/organizations/structures";

export const ACCOUNT_MANAGEMENT_LISTING_API =
  "/api/tenants/:tenantId/accounts/filter";

export const ROLE_LISTING_API = "/api/roles/filter";

export const ACCOUNT_MANAGEMENT_API = "/api/tenants/accounts";
export const PLAN_LISTING_API = "/api/tenants/:tenantId/plans/filter";

export const ADD_PLAN = "/api/tenants/plans";

export const BUDGET_TEAM_LISTING_API =
  "/api/tenants/:tenantId/budgets/:budgetId/budget-teams/filter";

export const BUDGET_TEAMS = "/api/tenants/budget-teams";

export const BUDGET_TEAM_DIVISION =
  "/api/tenants/:tenantId/budgets/:budgetId/budget-teams/:budgetTeamId/divisions";

export const BUDGET_TEAM_DIVISION_BY_ID =
  "/api/tenants/:tenantId/team-divisions/:divisionTeamId/employees/filter";

export const BUDGET_TEAM_METADATA =
  "/api/tenants/:tenantId/budget-teams/:teamId/metadata";
export const ATTACH_TEAM_EMPLOYEE = "/api/tenants/team-divisions/employees";
export const ALLOCATE_BUDGET = "/api/tenants/team-divisions/allocate-budget";

export const FEE_PLAN_LISTING_API = "/api/tenants/:tenantId/fee-plans/filter";
export const LOCKUP_PLAN_FILTER_LISTING_API =
  "/api/tenants/:tenantId/lockup-plans/filter";

export const TENANT_LOCKUP = "/api/tenants/lockups";

export const FEE_TEAM_LISTING_API =
  "/api/tenants/:tenantId/fees/:feeId/fee-teams/filter";

export const MARKETING_RESULTS_LISTING_API =
  "/api/tenants/:tenantId/marketing-results/filter";
export const MARKETING_RESULTS_API = "/api/tenants/marketing-results";
export const LOCKUP_LISTING_API = "/api/tenants/:tenantId/lockups";
export const LOCKUP_PLAN = "/api/tenants/lockup-plans";

export const LOCKUP_TEAM_BY_ID =
  "/api/tenants/:tenantId/lockups/:lockupId/lockup-teams";

export const ADD_FEE_PLAN = "/api/tenants/fees";

export const FEE_PLAN = "/api/tenants/fee-plans";
export const FEE_TEAM_BY_ID = "/api/tenants/:tenantId/fees/:feeId/fee-teams";

export const RESYNC_FEE_TEAM = "/api/tenants/fees/fee-teams/resync";

export const EBITDA_PLAN_LISTING_API =
  "/api/tenants/:tenantId/ebita-plans/filter";
export const EBITDA_PLAN = "/api/tenants/ebitas";

export const EBITDA_PLAN_BY_ID = "/api/tenants/ebita-plans";

export const EBITDA_LISTING_API =
  "/api/tenants/:tenantId/ebitas/:ebitaId/filter";

export const TEAM_BUDGET_LISTING_API =
  "/api/tenants/:tenantId/budgets/:budgetId/budget-teams/:budgetTeamId/employees/budgets";

export const TEAM_SUMMARY_RESULT_API =
  "/api/tenants/:tenantId/budgets/:budgetId/budget-teams/:budgetTeamId/summary";

export const FIRM_WIDE_RESULTS_API =
  "/api/tenants/:tenantId/budgets/:budgetId/firm-wide-summary";

export const TEAM_BUDGET_ALLOCATION_API =
  "/api/tenants/budgets/teams/employees";

export const TEAM_MONTHLY_COGS =
  "/api/tenants/:tenantId/ebitas/:ebitaId/ebita-teams/:ebitaTeamId/cogs";
export const TEAM_COGS = "/api/tenants/ebitas/cogs";

export const TEAM_MONTHLY_OVERHEAD =
  "/api/tenants/:tenantId/ebitas/:ebitaId/overheads/cumulative";
export const EBIDTA_RESYNC_TEAM = "/api/tenants/ebitas/ebita-teams/resync";

export const TEAM_OVERHEAD = "/api/tenants/:tenantId/ebitas/:ebitaId/overheads";

export const ALLOCATE_OVERHEAD = "/api/tenants/ebitas/overheads";

export const WRITE_ON_AND_OFF =
  "/api/tenants/:tenantId/ebitas/:ebitaId/write-on-offs";
export const UPDATE_WRITE_ON_AND_OFF = "/api/tenants/ebitas/write-on-offs";
export const TEAM_NPS = "/api/tenants/team-nps";
export const TEAM_NPS_PLAN_LISTING_API =
  "/api/tenants/:tenantId/team-nps-plans/filter";
export const TEAM_NPS_PLAN_BY_ID = "/api/tenants/team-nps-plans";

export const TEAM_NPS_BY_ID = "/api/tenants/:tenantId/team-nps";

export const CLIENT_NPS_PLAN_LISTING_API =
  "/api/tenants/:tenantId/client-nps-plans/filter";
export const CLIENT_NPS = "/api/tenants/client-nps";
export const CLIENT_NPS_PLAN_BY_ID = "/api/tenants/client-nps-plans";
export const CLIENT_NPS_BY_ID = "/api/tenants/:tenantId/client-nps";
export const GET_TENANT_CLIENTS = "/api/tenants/:tenantId/clients/filter";
export const TENANT_CLIENT = "/api/tenants/clients";
export const UPLAOD_TENANT_CLIENT_DOCUMENT =
  "/api/tenants/clients/documents/upload";
export const REMOVE_TENANT_CLIENT_DOCUMENT =
  "/api/tenants/clients/documents/remove";
export const CLIENT_CLASS_LISTING_API = "/api/tenants/client-classes/filter";
export const LEAD_INDUSTRIES_DATA =
  "/api/tenants/:tenantId/clients/metadata/lead-industries";
export const LEAD_SOURCES_DATA =
  "/api/tenants/:tenantId/clients/metadata/lead-sources";
export const LEAD_PROSPECT_CONVERSION_DATA =
  "/api/tenants/:tenantId/clients/metadata/lead-to-prospect";
export const PROSPECT_CLIENT_CONVERSION_DATA =
  "/api/tenants/:tenantId/clients/metadata/prospect-to-client";

export const FAB5_REVENUE_LISTING_API =
  "/api/tenants/:tenantId/plans/:planId/fabs/revenues/filter";
export const FAB5_LOCKUP_LISTING_API =
  "/api/tenants/:tenantId/plans/:planId/fabs/lockups/filter";
export const FAB5_NPS_LISTING_API =
  "/api/tenants/:tenantId/plans/:planId/fabs/nps/filter";
export const FAB5_SALES_LISTING_API =
  "/api/tenants/:tenantId/plans/:planId/fabs/sales/filter";
export const FAB5_PROFITABILITY_LISTING_API =
  "/api/tenants/:tenantId/plans/:planId/fabs/profitabilities/filter";
export const FEE_FIRM_WIDE_RESULTS =
  "/api/tenants/:tenantId/fees/firm-wide-summary";
export const LEAD_PROGRESSS_LISTING_API =
  "/api/tenants/:tenantId/clients/:clientId/lead-progress/filter";
export const LEAD_PROGRESS_API = "/api/tenants/clients/lead-progress";
export const NOTES_LISTING_API =
  "/api/tenants/:tenantId/clients/:clientId/notes/filter";
export const NOTES_API = "/api/tenants/clients/notes";

export const MEETING_CATEOGRY_LISTING_API =
  "/api/tenants/:tenantId/meeting-categories/filter";

export const TENANT_MEETING_CATEGORY_BY_ID = "/api/tenants/meeting-categories";

export const TASK_STATUS_LISTING_API =
  "/api/tenants/:tenantId/task-statuses/filter";
export const TASK_STATUS_BY_ID = "/api/tenants/task-statuses";

export const EBITDA_THRESHOLD_LISTING_API =
  "/api/tenants/:tenantId/ebitas/:ebitaId/bonus-thresholds/filter";
export const EBITDA_THRESHOLD_BY_ID = "/api/tenants/ebitas/bonus-thresholds";

export const CLIENT_NPS_RESPONSE_RATE_LISTING_API =
  "/api/tenants/:tenantId/client-nps/:clientNpsId/response-rates";
export const CLIENT_NPS_RESPONSE_RATE_BY_ID =
  "/api/tenants/client-nps/response-rates";

export const DELETE_EMPLOYEE = "/api/tenants/employees";

export const RESYNC_CLIENT_NPS = "/api/tenants/client-nps/teams/resync";
export const RESYNC_TEAM_NPS = "/api/tenants/team-nps/teams/resync";

export const GET_FIRM_WIDE_FEES =
  "/api/tenants/:tenantId/fees/:feeId/firm-wide-fee";

export const FEE_WON_LOSTS_API = "/api/tenants/fee-won-losts/fee-wons";
export const GET_TEAM_MONTHLY_BUDGET =
  "/api/tenants/:tenantId/budgets/:budgetId/budget-teams/:budgetTeamId/monthly-budgets";

export const GET_EBITDA_BONUS = "/api/tenants/ebitas/bonuses";

export const GET_CLIENT_PORTFOLIO_DATA =
  "/api/tenants/:tenantId/portfolios/metadata";

export const GET_TEAM_DETAILS_FORM_PLAN =
  "/api/tenants/:tenantId/fee-won-losts/:feeWonLostId/teams/:employeeId/details";
export const FEE_WON_AND_LOST_PLAN_LISTING_API =
  "/api/tenants/:tenantId/fee-won-losts/filter";
export const FEE_WON_AND_LOST_PLAN = "/api/tenants/fee-won-losts";

export const FEE_WON_AND_LOST_TEAM_LISTING_API =
  "/api/tenants/:tenantId/fee-won-losts/:feeWonLostId/teams/filter";

export const FEE_WONS_LISTING_API =
  "/api/tenants/:tenantId/fee-won-losts/:feeWonLostId/teams/:feeWonLostTeamId/fee-wons/filter";
export const FEE_WONS_API = "/api/tenants/fee-won-losts/fee-wons";

export const FEE_LOSTS_LISTING_API =
  "/api/tenants/:tenantId/fee-won-losts/:feeWonLostId/teams/:feeWonLostTeamId/fee-losts/filter";
export const FEE_LOSTS_API = "/api/tenants/fee-won-losts/fee-losts";

export const RESYNC_FEE_WON_LOST_TEAM = "/api/tenants/fee-won-losts/resync";

export const RESYNC_LOCKUP_TEAM = "/api/tenants/lockups/lockup-teams/resync";

export const FIRM_WIDE_MONTHLY_BUDGET =
  "/api/tenants/:tenantId/budgets/:budgetId/monthly-budgets";

export const REMOVE_TEAM_MEMBER = "/api/tenants/team-divisions/employees";

export const POLICIES_AND_PROCEDURES_LISTING_API = "/api/tenants/:tenantId/policies/filter";
export const POLICIES_AND_PROCEDURES_API = "/api/tenants/policies";
export const POLICIES_AND_PROCEDURES_UPLOAD_DOCUMENT_API = "/api/tenants/policies/documents/upload"
export const POLICIES_AND_PROCEDURES_REMOVE_DOCUMENT_API = "/api/tenants/policies/documents/remove"

export const apiCall = (
  endpoint: string,
  method = HttpMethods.GET,
  body?: any,
  isFormData?: boolean
): Promise<any> => {
  const headers = new Headers({
    Accept: "application/json",
  });
  if (!isFormData) {
    headers.append("Content-Type", "application/json");
  }
  const token = getToken();

  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }
  let finalBody: string | null | undefined = body;

  if (body && !isFormData) {
    finalBody = JSON.stringify(body);
  }
  const url = config.apiHost + endpoint;

  return new Promise<any>((resolve, reject) => {
    fetch(url, { body: finalBody, headers, method })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const ping = (): Promise<string> => apiCall(PING);

export const login = (formData: any): Promise<string> =>
  apiCall(LOGIN, HttpMethods.POST, formData);

export const fetchUserAccessRights = (): Promise<string> =>
  apiCall(FETCH_USER_ACCESS, HttpMethods.GET);
