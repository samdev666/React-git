/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { HttpMethods } from "@wizehub/common/utils";
import { config } from "./config";
import { getToken } from "./redux/reducers/auth";

const PING = "/api/ping";
export const LOGIN = "/api/login";
export const TWO_FACTOR_AUTHENTICATION = "/api/verify-token";
export const RESET_PASSWORD = "/api/reset-password";
export const RESET_PASSWORD_REQUEST_LINK = "/api/forgot-password";
export const ROLES_FILTER = "/api/roles/filter";
export const TWO_FA_AUTHENTICATION_METHOD =
  "/api/two-factor-authentication-methods";
export const USER_TWO_FA_AUTENTICATION = "/api/user/two-factor-authentication";
export const VERIFY_USER_TWO_FA_AUTHENTICATION =
  "/api/user/two-factor-authentication/verify";
export const CHANGE_PASSWORD = "/api/change-password";
export const REMOVE_PROFILE_IMAGE = "/api/profile/remove";
export const PROFILE = "/api/profile";
export const EDIT_PROFILE = "/api/update-profile";
export const UPLOAD_PROFILE_IMAGE = "/api/profile/upload";
export const FETCH_USER_ACCESS = "/api/rights";

export const USER_MANAGEMENT_LISTING_API = "/api/users/filter";
export const USER_MANAGEMENT = "/api/users";
export const USER_MANAGEMENT_PASSWORD = "/api/modify-password";
export const TENANT_MANAGEMENT_LISTING_API = "/api/tenants/filter";
export const TENANT_MANAGEMENT_DETAIL = "/api/tenants";
export const TENANT_PRODUCT_DETAIL = "/api/tenants/subscriptions/active";
export const TENANT_PRODUCT_SUBSCRIPTION = "/api/tenants/subscriptions";
export const TENANT_SUBSCRIPTION_DETAIL = "/api/tenants/subscriptions/cancel";
export const TENANT_SUBSCRIPTION_RENEW = "/api/tenants/subscriptions/renew";
export const TENANT_USER = "/api/tenant/user";
export const TENANT_GROUP_USER = "/api/group/user";
export const TENANT_USER_LISTING = "/api/tenant/user/filter";
export const TENANT_GROUP_LISTING_API = "/api/groups/filter";
export const TENANT_GROUP_USER_LISTING = "/api/group/user/filter";
export const TENANT_GROUP_TENANT_LISTING = "/api/group/tenant/filter";
export const TENANT_GROUP = "/api/groups";
export const PRODUCT_MANAGEMENT_LISTING_API = "/api/products/filter";
export const PROJECT_MANAGEMENT_LISTING_API = "/api/projects/filter";
export const PRODUCT_MANAGEMENT = "/api/products";
export const LEAD_SOURCE_LISTING_API = "/api/lead-sources/filter";
export const LEAD_SOURCE = "/api/lead-sources";
export const LEAD_INDUSTRY_LISTING_API = "/api/lead-industries/filter";
export const LEAD_INDUSTRY = "/api/lead-industries";
export const LEAD_STAGE_LISTING_API = "/api/lead-progress-stages/filter";
export const LEAD_STAGE = "/api/lead-progress-stages";
export const STAGE_STATUS_LISTING_API = "/api/lead-progress-statuses/filter";
export const STAGE_STATUS = "/api/lead-progress-statuses";

export const APPLICATION_LISTING_API = "/api/launch-pads/filter";
export const APPLICATION = "/api/launch-pads";
export const APPLICATION_ICON_UPLOAD = "/api/launch-pads/upload";
export const APPLICATION_ICON_REMOVE = "/api/launch-pads/upload/remove/:id";
export const FEE_LOST_REASON_LISTING_API = "/api/fee-lost-reasons/filter";
export const FEE_LOST_REASON = "/api/fee-lost-reasons";
export const TEAM_POSITION_LISTING_API = "/api/team-positions/filter";
export const TEAM_POSITION = "/api/team-positions";
export const MEETING_QUESTION_LISTING_API = "/api/meeting-questions/filter";
export const MEETING_QUESTION = "/api/meeting-questions";
export const MEETING_CATEGORY_LISTING_API =
  "/api/meeting-question-categories/filter";
export const MEETING_CATEGORY = "/api/meeting-question-categories";
export const MEETING_AGENDA_LISTING_API = "/api/meeting-agendas/filter";
export const MEETING_AGENDA = "/api/meeting-agendas";
export const MEETING_STATUS_LISTING_API =
  "/api/meeting-agenda-progress-statuses/filter";
export const MEETING_STATUS = "/api/meeting-agenda-progress-statuses";
export const DIVISION_LISTING_API = "/api/divisions";
export const PROJECT_BY_ID = "/api/projects";
export const PROJECT_STAGES = "/api/project-stages/filter";
export const COUNTRIES_API = "/api/countries/filter";
export const CATEGORY_LISTING_API = "/api/meeting-categories/filter";
export const CATEGORY_BY_ID = "/api/meeting-categories";
export const TASK_STATUS_LISTING_API = "/api/task-statuses/filter";
export const TASK_STATUS_BY_ID = "/api/task-statuses";
export const UPLOAD_PROJECT_DOCUMENT = "/api/projects/documents/upload";
export const DELETE_PROJECT_DOCUMENT = "/api/projects/documents/remove";

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
