import { decodeBase64 } from "@wizehub/common/utils";
import { Action, RIGHT_UPDATE, TOKEN_REMOVE, TOKEN_UPDATE } from "../actions";

export enum Right {
  PRODUCT_MANAGEMENT = "PRODUCT_MANAGEMENT",
  FORM_MANAGEMENT = "FORM_MANAGEMENT",
  LEAD_SOURCES = "LEAD_SOURCES",
  FEE_LOST_REASON = "FEE_LOST_REASON",
  PROJECTS = "PROJECTS",
  MEETING_AGENDA_TEMPLATES = "MEETING_AGENDA_TEMPLATES",
  TENANT_MANAGEMENT = "TENANT_MANAGEMENT",
  DASHBOARD = "DASHBOARD",
  PROJECT_MANAGEMENT = "PROJECT_MANAGEMENT",
  DASHBOARD_READ_ONLY = "DASHBOARD_READ_ONLY",
  GROUP_MANAGEMENT = "GROUP_MANAGEMENT",
  LEAD_PROGRESS_STAGES = "LEAD_PROGRESS_STAGES",
  TEAM_POSITION = "TEAM_POSITION",
  MEETING_QUESTIONS_AND_CATEGORIES = "MEETING_QUESTIONS_AND_CATEGORIES",
  DIVISION_MANAGEMENT = "DIVISION_MANAGEMENT",
  LEAD_INDUSTRY = "LEAD_INDUSTRY",
  GENERAL = "GENERAL",
  USER_MANAGEMENT = "USER_MANAGEMENT",
  APPLICATION_MANAGEMENT = "APPLICATION_MANAGEMENT",
  TWO_FA = "TWO_FA",
  PRODUCT_MANAGEMENT_READ_ONLY = "PRODUCT_MANAGEMENT_READ_ONLY",
  TENANT_MANAGEMENT_READ_ONLY = "TENANT_MANAGEMENT_READ_ONLY",
  TENANT_TEAM_POSITION_MANAGEMENT_READ_ONLY = "TENANT_TEAM_POSITION_MANAGEMENT_READ_ONLY",
  TENANT_FEE_LOST_REASON_MANAGEMENT_READ_ONLY = "TENANT_FEE_LOST_REASON_MANAGEMENT_READ_ONLY",
  TENANT_LEAD_SOURCE_INDUSTRY_MANAGEMENT_READ_ONLY = "TENANT_LEAD_SOURCE_INDUSTRY_MANAGEMENT_READ_ONLY",
  TENANT_LAUNCH_PAD_APP_MANAGEMENT_READ_ONLY = "TENANT_LAUNCH_PAD_APP_MANAGEMENT_READ_ONLY",
  TENANT_MEETING_MASTER_MANAGEMENT_READ_ONLY = "TENANT_MEETING_MASTER_MANAGEMENT_READ_ONLY",
  TENANT_LEAD_PROGRESS_MANAGEMENT_READ_ONLY = "TENANT_LEAD_PROGRESS_MANAGEMENT_READ_ONLY",
  PROFILE_MANAGEMENT = "PROFILE_MANAGEMENT",
  GROUP_MANAGEMENT_READ_ONLY = "GROUP_MANAGEMENT_READ_ONLY",
  MEETING_CATEGORY_MANAGEMENT = "MEETING_CATEGORY_MANAGEMENT",
  TASK_STATUS_MANAGEMENT = "TASK_STATUS_MANAGEMENT",
}

export enum AuthenticationStatus {
  AUTHENTICATED = "AUTHENTICATED",
  NOT_AUTHENTICATED = "NOT_AUTHENTICATED",
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
  hasStatusAndRight(status?: AuthenticationStatus, right?: Right): boolean;
  hasRole(role?: Role): boolean;
}

export const defaultUserRights: Right[] = [
  Right.DASHBOARD,
  Right.APPLICATION_MANAGEMENT,
  Right.DIVISION_MANAGEMENT,
  Right.FEE_LOST_REASON,
  Right.FORM_MANAGEMENT,
  Right.GENERAL,
  Right.GROUP_MANAGEMENT,
  Right.LEAD_INDUSTRY,
  Right.LEAD_PROGRESS_STAGES,
  Right.LEAD_SOURCES,
  Right.MEETING_AGENDA_TEMPLATES,
  Right.MEETING_QUESTIONS_AND_CATEGORIES,
  Right.PRODUCT_MANAGEMENT,
  Right.PROJECTS,
  Right.PROJECT_MANAGEMENT,
  Right.TEAM_POSITION,
  Right.TENANT_MANAGEMENT,
  Right.TWO_FA,
  Right.USER_MANAGEMENT,
];

export const defaultAuthState: AuthState = {
  rights: [],
  status: AuthenticationStatus.NOT_AUTHENTICATED,
  role: Role.INVALID,
  token: undefined,
  hasStatusAndRight(status?: AuthenticationStatus, right?: Right): boolean {
    if (!right || this.rights.indexOf(right) >= 0) {
      if (!status || status === this.status) {
        return true;
      }
    }

    return false;
  },
  hasRole(role?: Role): boolean {
    if (role === this.role) {
      return true;
    }

    return false;
  },
};

export const getRightsForRole = (role: Role): Right[] => {
  switch (role) {
    case Role.ADMINISTRATOR:
      return [Right.DASHBOARD];
    default:
      return [];
  }
};

export function getStateFromToken(
  state: AuthState,
  token: string | undefined
): AuthState {
  let rights: Right[] | undefined;
  let role: Role;
  let status: AuthenticationStatus;
  if (token) {
    try {
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      rights = decodeBase64(localStorage.getItem("rights"));
      role = Role.INVALID;
      status = AuthenticationStatus.AUTHENTICATED;
    } catch (e) {
      // This is fine, parsing failed because eg. token is invalid
      rights = undefined;
      role = Role.INVALID;
      status = AuthenticationStatus.AUTHENTICATED;
    }
  } else {
    rights = undefined;
    role = Role.INVALID;
    status = AuthenticationStatus.AUTHENTICATED;
  }

  if (rights) {
    return {
      ...state,
      rights,
      role,
      token,
      status,
    };
  }

  return defaultAuthState;
}

let token: string | undefined;
export default (
  state: AuthState = defaultAuthState,
  action: Action<string>
): AuthState => {
  token = localStorage.getItem("token") || undefined;

  switch (action.type) {
    case TOKEN_UPDATE:
      token = action.payload;
      localStorage.setItem("token", token);
      return { ...getStateFromToken(state, token) };
    case TOKEN_REMOVE:
      localStorage.removeItem("token");
      token = undefined;
      return { ...getStateFromToken(state, undefined) };
    case RIGHT_UPDATE:
      const userRights = decodeBase64(localStorage.getItem("rights"));
      return {
        ...state,
        ...(userRights && { rights: userRights }),
      };
    default:
      return { ...getStateFromToken(state, token) };
  }
};

export const getToken = (): string | undefined => token;
