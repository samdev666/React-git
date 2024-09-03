import { MetaData } from "../../../../packages/common/models";
import {
  GroupState,
  LoaderState,
  OrganisationStructureEntity,
  TenantState,
} from "../../../../packages/common/models/genericEntities";
import { HttpMethods } from "@wizehub/common/utils";
import { AuthenticationStatus } from "../reducers/auth";
export const APICALL = "APICALL";
export const PAGINATED_APICALL = "PAGINATED_APICALL";
export const PING = "PING";

export const TOKEN_UPDATE = "TOKEN_UPDATE";
export const TOKEN_REMOVE = "TOKEN_REMOVE";
export const UPDATE_AUTHENTICATION_STATUS = "UPDATE_AUTHENTICATION_STATUS";

export const RIGHT_UPDATE = "RIGHT_UPDATE";
export const TENANT_GROUP = "TENANT_GROUP";

export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";

export const POST_LOGIN = "POST_LOGIN";

export const FETCH_BASE_DATA = "FETCH_BASE_DATA";
export const FETCH_USER_RIGHT = "FETCH_USER_RIGHT";

export const USER_PROFILE = "USER_PROFILE";
export const SYSTEM_LOADER = "SYSTEM_LOADER";
export const TENANT = "TENANT";

export const STEP_FORM_DATA_SET = "STEP_FORM_DATA_SET";
export const STEP_FORM_VALIDATION_ERROR_SET = "STEP_FORM_VALIDATION_ERROR_SET";
export const STEP_FORM_VALIDATION_ERRORS_CLEAR =
  "STEP_FORM_VALIDATION_ERRORS_CLEAR";
export const SET_STEP_NUMBER = "SET_STEP_NUMBER";
export const STEP_FORM = "STEP_FORM";
export const LAUNCH_PAD_ACTION = "LAUNCH_PAD_ACTION";
export const LEAD_STAGE_ACTION = "LEAD_STAGE_ACTION";
export const LEAD_STAGE_STATUS_ACTION = "LEAD_STAGE_STATUS_ACTION";
export const FEE_LOST_REASON_ACTION = "FEE_LOST_REASON_ACTION";
export const LEAD_SOURCE_ACTION = "LEAD_SOURCE_ACTION";
export const LEAD_INDUSTRY_ACTION = "LEAD_INDUSTRY_ACTION";
export const MEETING_QUESTION_ACTION = "MEETING_QUESTION_ACTION";
export const MEETING_AGENDA_ACTION = "MEETING_AGENDA_ACTION";
export const MEETING_CATEGORY_ACTION = "MEETING_CATEGORY_ACTION";
export const PROGRESS_ENTITY_ACTION = "PROGRESS_ENTITY_ACTION";
export const MISSION_VISION_VALUE_ACTION = "MISSION_VISION_VALUE_ACTION";

export const FEE_HISTORY = "FEE_HISTORY";
export const PEOPLE_ACTION = "PEOPLE_ACTION";
export const TEAM_POSITION_ACTION = "TEAM_POSITION_ACTION";
export const DIVISION_EMPLOYEE_ACTION = "DIVISION_EMPLOYEE_ACTION";
export const TEAM_EMPLOYEE_ACTION = "TEAM_EMPLOYEE_ACTION";
export const DIVISION_TEAM_ACTION = "DIVISION_TEAM_ACTION";
export const ACCOUNT_MANAGEMENT_ACTION = "ACCOUNT_MANAGEMENT_ACTION";
export const PLAN_ACTION = "PLAN_ACTION";
export const LOCKUP_PLAN_ACTION = "LOCKUP_PLAN_ACTION";
export const BUDGET_TEAM_ACTION = "BUDGET_TEAM_ACTION";
export const BUDGET_DIVISION_TEAM_ACTION = "BUDGET_DIVISION_TEAM_ACTION";
export const FEE_TEAM_ACTION = "FEE_TEAM_ACTION";

export const FIRM_PROFILE_ACTION = "FIRM_PROFILE_ACTION";
export const SET_FIRM_PROFILE_ACTION = "SET_FIRM_PROFILE_ACTION";
export const SET_BUDGET_AND_CAPACITY_PLAN_ACTION =
  "SET_BUDGET_AND_CAPACITY_PLAN_ACTION";

export const LEAD_MANAGEMENT = "LEAD_MANAGEMENT";
export const TENANT_MEETING_CATEGORY_ACTION = "TENANT_MEETING_CATEGORY_ACTION";
export const TASK_STATUS_ACTION = "TASK_STATUS_ACTION";
export const EBITDA_THRESHOLD_ACTION = "EBITDA_THRESHOLD_ACTION";
export const POLICIES_AND_PROCEDURES = "POLICIES_AND_PROCEDURES";
// Add Actions Here
export const fetchUserProfile = (): EmptyAction => emptyAction(USER_PROFILE);
export const fetchFirmProfile = (): EmptyAction =>
  emptyAction(FIRM_PROFILE_ACTION);
/** @Note Action types for pages entities */

export interface AnyAction {
  type: string;
}

export type EmptyAction = AnyAction;

export interface Action<T> extends AnyAction {
  type: string;
  payload: T;
}
export interface RequestOptions {
  isFormData?: boolean;
  ignoreStatus?: boolean;
}

type PromiseActions = Action<any> | Action<any>[] | void;
export interface RequestProps<R> {
  endpoint: string;
  method: HttpMethods;
  payload?: R;
  options?: RequestOptions;
}

export interface ApiCall<R = void, T = void, V = void> {
  request: { key: string; requestProps: RequestProps<R> };
  success: { resolve?(payload: T): PromiseActions };
  failure: { reject?(payload: V): PromiseActions };
}

export interface PagedApiCall<T> {
  request: {
    key: string;
    endpoint: string;
    filter: MetaData<T>;
    loadMore: boolean;
  };
  update: { action: string };
  loadMore: { action: string };
  reset: { action: string };
}
export interface DefaultErrorType {
  message: string;
}

export interface PaginatedCRUDApi<R, P> {
  create: ApiCall<R, P>;
  read: ApiCall<any, any, R[]>;
  update: ApiCall<Partial<R>, P>;
  remove: ApiCall<R, void, DefaultErrorType>;
}

export const emptyAction = (type: string): EmptyAction => ({ type });

export const action = <T extends unknown>(
  type: string,
  payload: T
): Action<T> => ({ type, payload });

export const makeApiRequestObject = <T, P>(
  endpoint: string,
  method = HttpMethods.GET,
  payload?: T,
  options?: RequestOptions
): RequestProps<T> => ({
  endpoint,
  method,
  payload,
  options,
});

export const setResolveFunction = <R, P, S, F>(
  api: ApiCall<R, S, F>,
  resolve: (param: S) => PromiseActions
): ApiCall<R, S, F> => ({
  ...api,
  success: {
    ...api.success,
    resolve,
  },
});

export const setRejectFunction = <R, S, F>(
  api: ApiCall<R, S, F>,
  reject: (error: F) => PromiseActions
): ApiCall<R, S, F> => ({
  ...api,
  failure: {
    ...api.failure,
    reject,
  },
});

export function apiRequest<R, T, V>(
  api: ApiCall<R, T, V>,
  payload?: R,
  options?: RequestOptions
): Action<ApiCall<R, T, V>> {
  const upadtedApi: ApiCall<R, T, V> = {
    ...api,
    request: {
      ...api.request,
      requestProps: {
        ...api.request.requestProps,
        payload: payload ?? api.request.requestProps.payload,
        options: options ?? api.request.requestProps.options,
      },
    },
  };
  return action(APICALL, upadtedApi);
}

export const makeApiCall = <R, T, V>(
  name: string,
  requestProps: RequestProps<R>,
  resolve?: (payload: T) => PromiseActions,
  reject?: (payload: V) => PromiseActions
): ApiCall<R, T, V> => ({
  request: {
    key: `${name}_REQUEST`,
    requestProps,
  },
  success: { resolve },
  failure: { reject },
});

export const apiCall = (
  endPoint: string,
  resolve: (param: any) => PromiseActions,
  reject: (param: any) => PromiseActions,
  method = HttpMethods.GET,
  data?: any,
  options?: RequestOptions
) => {
  const api = makeApiCall<any, any, any>(
    `APICALL_${endPoint}`,
    makeApiRequestObject<any, any>(endPoint, method)
  );

  return apiRequest(
    setRejectFunction(setResolveFunction(api, resolve), reject),
    data,
    options
  );
};

export function paginatedApiRequest<T>(
  paginatedApi: PagedApiCall<T>
): Action<PagedApiCall<T>> {
  return action(PAGINATED_APICALL, { ...paginatedApi });
}

export const makePaginatedApiCall = <T extends unknown>(
  name: string,
  endpoint: string,
  filter: MetaData<T>,
  loadMore?: boolean
): PagedApiCall<T> => ({
  request: {
    key: `${name}_PAGINATED_REQUEST`,
    endpoint,
    filter,
    loadMore: loadMore ?? false,
  },
  update: { action: `${name}_PAGINATION_UPDATE` },
  loadMore: { action: `${name}_PAGINATION_LOAD_MORE` },
  reset: { action: `${name}_PAGINATION_RESET` },
});

export const paginatedApiCall = <T extends unknown>(
  name: string,
  endPoint: string,
  filter: MetaData<T>,
  loadMore?: boolean
) => {
  const paginatedApi = makePaginatedApiCall<T>(
    name,
    endPoint,
    filter,
    loadMore
  );
  return paginatedApiRequest(paginatedApi);
};

export const createBasicActions = <T extends unknown>(key: string) => ({
  update: (payload: T) => action(`${key}_UPDATE`, payload),
  reset: () => emptyAction(`${key}_RESET`),
});

export const profileModuleActions = createBasicActions<any>(USER_PROFILE);
export const updateToken = (token: string, status?: AuthenticationStatus) =>
  action(TOKEN_UPDATE, { token, status });
export const removeToken = (): EmptyAction => emptyAction(TOKEN_REMOVE);

export const updateAuthenticationStatus = (status: AuthenticationStatus) =>
  action(UPDATE_AUTHENTICATION_STATUS, { status });

export const firmProfileAction = createBasicActions<any>(
  SET_FIRM_PROFILE_ACTION
);

export const login = (
  formData: { email: string; password: string },
  resolve: any,
  reject: any
) => action(LOGIN, { formData, resolve, reject });
export const logout = (): EmptyAction => emptyAction(LOGOUT);

export const postLogin = (token: string): EmptyAction =>
  action(POST_LOGIN, { token });

export const fetchBaseData = (): EmptyAction => emptyAction(FETCH_BASE_DATA);

export const setBudgetPlan = createBasicActions<any>(
  SET_BUDGET_AND_CAPACITY_PLAN_ACTION
);

const loaderActions = createBasicActions<LoaderState>(SYSTEM_LOADER);
export const showLoader = () => loaderActions.update({ visibility: true });
export const hideLoader = () => loaderActions.update({ visibility: false });

export const ORGANIZATION_STRUCTURE_ACTION = "ORGANIZATION_STRUCTURE_ACTION";
const organizationAction = createBasicActions<
  Array<OrganisationStructureEntity>
>(ORGANIZATION_STRUCTURE_ACTION);
export const updateOrganizationData = (
  value: Array<OrganisationStructureEntity>
) => organizationAction.update(value);

const tenantAction = createBasicActions<TenantState>(TENANT);
export const updateTenantId = (value: string) =>
  tenantAction.update({ tenantId: value });

export const updateRights = (rights: string[]) =>
  action(RIGHT_UPDATE, { rights });

export const fetchUserAccess = (): EmptyAction => emptyAction(FETCH_USER_RIGHT);

//STEP FORM
export const setStepFormData = (stepNumber: number, data: any) => ({
  type: STEP_FORM_DATA_SET,
  payload: { stepNumber, data },
});
export const setStepValidationError = (
  stepNumber: number,
  errors: Record<string, string>
) => ({
  type: STEP_FORM_VALIDATION_ERROR_SET,
  payload: { stepNumber, errors },
});
export const clearStepValidationErrors = (stepNumber: number) => ({
  type: STEP_FORM_VALIDATION_ERRORS_CLEAR,
  payload: stepNumber,
});
export const setCurrentStep = (stepNumber: number) => ({
  type: SET_STEP_NUMBER,
  payload: { stepNumber },
});

const groupActions = createBasicActions<GroupState>(TENANT_GROUP);
export const updateTenantGroup = (value: boolean) => groupActions.update({ hasGroup: value });
