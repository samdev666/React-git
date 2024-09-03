import { decodeBase64 } from "@wizehub/common/utils";
import { Action, RIGHT_UPDATE, TOKEN_REMOVE, TOKEN_UPDATE, UPDATE_AUTHENTICATION_STATUS } from "../actions";

export enum Right {
  TENANT_EMPLOYEE_MANAGEMENT_SENSITIVE = "TENANT_EMPLOYEE_MANAGEMENT_SENSITIVE",
  TENANT_LEAD_PROGRESS_MANAGEMENT = "TENANT_LEAD_PROGRESS_MANAGEMENT",
  TENANT_MEETING_MASTER_MANAGEMENT = "TENANT_MEETING_MASTER_MANAGEMENT",
  FEE_WON_LOST_MANAGEMENT = "FEE_WON_LOST_MANAGEMENT",
  CLIENT_PORTFOLIO_MANAGEMENT = "CLIENT_PORTFOLIO_MANAGEMENT",
  FEE_HISTORY_MANAGEMENT = "FEE_HISTORY_MANAGEMENT",
  TENANT_ACCOUNT_MANAGEMENT = "TENANT_ACCOUNT_MANAGEMENT",
  BUSINESS_ASSESSMENT = "BUSINESS_ASSESSMENT",
  FAB5_MANAGEMENT = "FAB5_MANAGEMENT",
  MARKETING_RESULTS_MANAGEMENT = "MARKETING_RESULTS_MANAGEMENT",
  POLICY_PROCEDURE_MANAGEMENT = "POLICY_PROCEDURE_MANAGEMENT",
  TENANT_MEETING_CATEGORY_MANAGEMENT = "TENANT_MEETING_CATEGORY_MANAGEMENT",
  TENANT_MEETING_CATEGORY_MANAGEMENT_READ_ONLY = "TENANT_MEETING_CATEGORY_MANAGEMENT_READ_ONLY",
  TEAM_NPS_MANAGEMENT = "TEAM_NPS_MANAGEMENT",
  TENANT_ORGANIZATION_STRUCTURE = "TENANT_ORGANIZATION_STRUCTURE",
  TENANT_ORGANIZATION_STRUCTURE_READ_ONLY = "TENANT_ORGANIZATION_STRUCTURE_READ_ONLY",
  TENANT_MISSION_VISION_VALUES_MANAGEMENT = "TENANT_MISSION_VISION_VALUES_MANAGEMENT",
  TENANT_LAUNCH_PAD_APP_MANAGEMENT = "TENANT_LAUNCH_PAD_APP_MANAGEMENT",
  TENANT_TEAM_POSITION_MANAGEMENT = "TENANT_TEAM_POSITION_MANAGEMENT",
  BOOKKEEPING_QUOTE_MANAGEMENT = "BOOKKEEPING_QUOTE_MANAGEMENT",
  DELEGATION_MANAGEMENT = "DELEGATION_MANAGEMENT",
  TENANT_MEETING_MANAGEMENT = "TENANT_MEETING_MANAGEMENT",
  TENANT_PROFILE_MANAGEMENT = "TENANT_PROFILE_MANAGEMENT",
  LOCKUP_MANAGEMENT = "LOCKUP_MANAGEMENT",
  TENANT_TASK_MANAGEMENT = "TENANT_TASK_MANAGEMENT",
  TENANT_TASK_MANAGEMENT_READ_ONLY = "TENANT_TASK_MANAGEMENT_READ_ONLY",
  EBITA_MANAGEMENT = "EBITA_MANAGEMENT",
  TENANT_LEAD_SOURCE_INDUSTRY_MANAGEMENT = "TENANT_LEAD_SOURCE_INDUSTRY_MANAGEMENT",
  TENANT_TASK_STATUS_MANAGEMENT = "TENANT_TASK_STATUS_MANAGEMENT",
  TENANT_FEE_LOST_REASON_MANAGEMENT = "TENANT_FEE_LOST_REASON_MANAGEMENT",
  CLIENT_NPS_MANAGEMENT = "CLIENT_NPS_MANAGEMENT",
  TENANT_TEAM_STRUCTURE = "TENANT_TEAM_STRUCTURE",
  BUDGET_AND_CAPACITY_MANAGEMENT = "BUDGET_AND_CAPACITY_MANAGEMENT",
  LEAD_MANAGEMENT = "LEAD_MANAGEMENT",
  TENANT_FORM_MANAGEMENT = "TENANT_FORM_MANAGEMENT",
  GENERAL = "GENERAL",
  LEAD_CALCULATOR_MANAGEMENT = "LEAD_CALCULATOR_MANAGEMENT",
  WIZE_GAP = "WIZE_GAP",
  TENANT_EMPLOYEE_MANAGEMENT_BASIC = "TENANT_EMPLOYEE_MANAGEMENT_BASIC",
  TENANT_FIRM_DETAILS_MANAGEMENT = "TENANT_FIRM_DETAILS_MANAGEMENT",
  TWO_FA = "TWO_FA",
  TENANT_TASK_PRIORITY_MANAGEMENT = "TENANT_TASK_PRIORITY_MANAGEMENT",
  PROFILE_MANAGEMENT = "PROFILE_MANAGEMENT",
  FEE_MANAGEMENT = "FEE_MANAGEMENT",
  DASHBOARD_MANAGEMENT = "DASHBOARD_MANAGEMENT",
  TENANT_TEAM_POSITION_MANAGEMENT_READ_ONLY = "TENANT_TEAM_POSITION_MANAGEMENT_READ_ONLY",
  TENANT_LEAD_PROGRESS_MANAGEMENT_READ_ONLY = "TENANT_LEAD_PROGRESS_MANAGEMENT_READ_ONLY",
  TENANT_FIRM_DETAILS_MANAGEMENT_READ_ONLY = "TENANT_FIRM_DETAILS_MANAGEMENT_READ_ONLY",
  TENANT_ACCOUNT_MANAGEMENT_READ_ONLY = "TENANT_ACCOUNT_MANAGEMENT_READ_ONLY",
  GROUP_MANAGEMENT_READ_ONLY = "GROUP_MANAGEMENT_READ_ONLY",
  TENANT_MANAGEMENT_READ_ONLY = "TENANT_MANAGEMENT_READ_ONLY",
  MARKETING_RESULTS_MANAGEMENT_READ_ONLY = "MARKETING_RESULTS_MANAGEMENT_READ_ONLY",
  DASHBOARD_READ_ONLY = "DASHBOARD_READ_ONLY",
  TENANT_LAUNCH_PAD_APP_MANAGEMENT_READ_ONLY = "TENANT_LAUNCH_PAD_APP_MANAGEMENT_READ_ONLY",
  TENANT_FEE_LOST_REASON_MANAGEMENT_READ_ONLY = "TENANT_FEE_LOST_REASON_MANAGEMENT_READ_ONLY",
  TENANT_LEAD_SOURCE_INDUSTRY_MANAGEMENT_READ_ONLY = "TENANT_LEAD_SOURCE_INDUSTRY_MANAGEMENT_READ_ONLY",
  TENANT_MEETING_MASTER_MANAGEMENT_READ_ONLY = "TENANT_MEETING_MASTER_MANAGEMENT_READ_ONLY",
  TENANT_MISSION_VISION_VALUES_MANAGEMENT_READ_ONLY = "TENANT_MISSION_VISION_VALUES_MANAGEMENT_READ_ONLY",
}

export enum AuthenticationStatus {
  AUTHENTICATED = "AUTHENTICATED",
  NOT_AUTHENTICATED = "NOT_AUTHENTICATED",
  ONBOARDING = "ONBOARDING",
  INCOMPLETE_BUSINESS_ASSESSMENT = "INCOMPLETE_BUSINESS_ASSESSMENT",
  SET_TENANT = "SET_TENANT"
}

export enum Role {
  ADMINISTRATOR = "ADMINISTRATOR",
  INVALID = "INVALID",
}

export const RolePrioriry: any = {
  ADMINISTRATOR: 1,
};

export interface AuthState {
  rights: Right[];
  status: AuthenticationStatus;
  role: Role;
  token?: string;
  authenticationStatus?: AuthenticationStatus;
  hasStatusAndRight(status?: AuthenticationStatus, right?: Right): boolean;
  hasRole(role?: Role): boolean;
}

export const defaultUserRights: Right[] = [
  Right.BOOKKEEPING_QUOTE_MANAGEMENT,
  Right.BUDGET_AND_CAPACITY_MANAGEMENT,
  Right.BUSINESS_ASSESSMENT,
  Right.CLIENT_NPS_MANAGEMENT,
  Right.CLIENT_PORTFOLIO_MANAGEMENT,
  Right.DASHBOARD_MANAGEMENT,
  Right.DELEGATION_MANAGEMENT,
  Right.EBITA_MANAGEMENT,
  Right.FAB5_MANAGEMENT,
  Right.FEE_HISTORY_MANAGEMENT,
  Right.FEE_MANAGEMENT,
  Right.FEE_WON_LOST_MANAGEMENT,
  Right.GENERAL,
  Right.LEAD_CALCULATOR_MANAGEMENT,
  Right.LEAD_MANAGEMENT,
  Right.LOCKUP_MANAGEMENT,
  Right.MARKETING_RESULTS_MANAGEMENT,
  Right.POLICY_PROCEDURE_MANAGEMENT,
  Right.PROFILE_MANAGEMENT,
  Right.TEAM_NPS_MANAGEMENT,
  Right.TENANT_ACCOUNT_MANAGEMENT,
  Right.TENANT_EMPLOYEE_MANAGEMENT_BASIC,
  Right.TENANT_EMPLOYEE_MANAGEMENT_SENSITIVE,
  Right.TENANT_FEE_LOST_REASON_MANAGEMENT,
  Right.TENANT_FIRM_DETAILS_MANAGEMENT,
  Right.TENANT_FORM_MANAGEMENT,
  Right.TENANT_LAUNCH_PAD_APP_MANAGEMENT,
  Right.TENANT_LEAD_PROGRESS_MANAGEMENT,
  Right.TENANT_LEAD_SOURCE_INDUSTRY_MANAGEMENT,
  Right.TENANT_MEETING_CATEGORY_MANAGEMENT,
  Right.TENANT_MEETING_MANAGEMENT,
  Right.TENANT_MEETING_MASTER_MANAGEMENT,
  Right.TENANT_MISSION_VISION_VALUES_MANAGEMENT,
  Right.TENANT_ORGANIZATION_STRUCTURE,
  Right.TENANT_PROFILE_MANAGEMENT,
  Right.TENANT_TASK_MANAGEMENT,
  Right.TENANT_TASK_PRIORITY_MANAGEMENT,
  Right.TENANT_TASK_STATUS_MANAGEMENT,
  Right.TENANT_TEAM_POSITION_MANAGEMENT,
  Right.TENANT_TEAM_STRUCTURE,
  Right.TWO_FA,
  Right.WIZE_GAP,
  Right.TENANT_TEAM_POSITION_MANAGEMENT_READ_ONLY,
  Right.TENANT_LEAD_PROGRESS_MANAGEMENT_READ_ONLY,
  Right.TENANT_FIRM_DETAILS_MANAGEMENT_READ_ONLY,
  Right.TENANT_ACCOUNT_MANAGEMENT_READ_ONLY,
  Right.GROUP_MANAGEMENT_READ_ONLY,
  Right.TENANT_MANAGEMENT_READ_ONLY,
  Right.MARKETING_RESULTS_MANAGEMENT_READ_ONLY,
  Right.DASHBOARD_READ_ONLY,
  Right.TENANT_LAUNCH_PAD_APP_MANAGEMENT_READ_ONLY,
  Right.TENANT_FEE_LOST_REASON_MANAGEMENT_READ_ONLY,
  Right.TENANT_LEAD_SOURCE_INDUSTRY_MANAGEMENT_READ_ONLY,
  Right.TENANT_MEETING_MASTER_MANAGEMENT_READ_ONLY,
  Right.TENANT_MISSION_VISION_VALUES_MANAGEMENT_READ_ONLY,
  Right.TENANT_ORGANIZATION_STRUCTURE_READ_ONLY,
  Right.TENANT_TASK_MANAGEMENT_READ_ONLY,
];

export const defaultAuthState: AuthState = {
  rights: [],
  status: AuthenticationStatus.NOT_AUTHENTICATED,
  role: Role.INVALID,
  token: undefined,
  hasStatusAndRight(status?: AuthenticationStatus, right?: Right): boolean {
    if (!right || this.rights.indexOf(right) >= 0) {
      if (!status || status === this?.status) {
        return true;
      }
    }

    return false;
  },
  hasRole(role?: Role): boolean {
    if (role === this?.role) {
      return true;
    }

    return false;
  },
};

export const getRightsForRole = (role: Role): Right[] => {
  switch (role) {
    case Role.ADMINISTRATOR:
      return [Right.DASHBOARD_MANAGEMENT];
    default:
      return [];
  }
};

export function getStateFromToken(
  state: AuthState,
  token: string | undefined,
  authenticationStatus?: AuthenticationStatus,
): AuthState {
  let rights: Right[] | undefined;
  let role: Role;
  let status: AuthenticationStatus;
  if (token) {
    try {
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      rights = decodeBase64(localStorage.getItem("rights"));
      role = Role.INVALID;
      status = authenticationStatus || AuthenticationStatus.AUTHENTICATED;
    } catch (e) {
      // This is fine, parsing failed because eg. token is invalid
      rights = undefined;
      role = Role.INVALID;
      status = authenticationStatus || AuthenticationStatus.AUTHENTICATED;
    }
  } else {
    rights = undefined;
    role = Role.INVALID;
    status = AuthenticationStatus.NOT_AUTHENTICATED;
  }
  if (rights) {
    return {
      ...state,
      rights,
      role,
      token,
      status
    };
  }

  return defaultAuthState;
}

let token: string | undefined;
interface AuthPayload {
  token?: string;
  status?: AuthenticationStatus;
}

export default (
  state: AuthState = defaultAuthState,
  action: Action<AuthPayload>
): AuthState => {
  token = localStorage.getItem("token") || undefined;
  let authenticationStatus = localStorage.getItem('status') as AuthenticationStatus || AuthenticationStatus.NOT_AUTHENTICATED;

  switch (action.type) {
    case TOKEN_UPDATE:
      token = action.payload.token;
      authenticationStatus = action.payload.status as AuthenticationStatus || authenticationStatus;
      localStorage.setItem("token", token);
      localStorage.setItem("status", authenticationStatus);
      return { ...getStateFromToken(state, token, authenticationStatus) };
    case TOKEN_REMOVE:
      localStorage.removeItem("token");
      token = undefined;
      return { ...getStateFromToken(state, undefined, undefined) };
    case RIGHT_UPDATE:
      const userRights = decodeBase64(localStorage.getItem("rights"));
      return {
        ...state,
        ...(userRights && { rights: userRights }),
      };
    case UPDATE_AUTHENTICATION_STATUS:
      authenticationStatus = action.payload.status;
      localStorage.setItem("status", authenticationStatus);
      return {
        ...state,
        status: authenticationStatus
      };
    default:
      if (authenticationStatus) {
        return { ...getStateFromToken(state, token, authenticationStatus) };
      }
  }
};

export const getToken = (): string | undefined => token;
