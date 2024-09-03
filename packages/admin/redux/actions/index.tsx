import { MetaData } from "@wizehub/common/models";
import { LoaderState } from "@wizehub/common/models/genericEntities";
import { HttpMethods } from "@wizehub/common/utils";

export const APICALL = "APICALL";
export const PAGINATED_APICALL = "PAGINATED_APICALL";
export const PING = "PING";

export const TOKEN_UPDATE = "TOKEN_UPDATE";
export const TOKEN_REMOVE = "TOKEN_REMOVE";

export const RIGHT_UPDATE = "RIGHT_UPDATE";

export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";

export const POST_LOGIN = "POST_LOGIN";

export const FETCH_BASE_DATA = "FETCH_BASE_DATA";
export const FETCH_USER_RIGHT = "FETCH_USER_RIGHT";

export const USER_PROFILE = "USER_PROFILE";
export const SYSTEM_LOADER = "SYSTEM_LOADER";

export const STEP_FORM_DATA_SET = "STEP_FORM_DATA_SET";
export const STEP_FORM_VALIDATION_ERROR_SET = "STEP_FORM_VALIDATION_ERROR_SET";
export const STEP_FORM_VALIDATION_ERRORS_CLEAR =
  "STEP_FORM_VALIDATION_ERRORS_CLEAR";
export const SET_STEP_NUMBER = "SET_STEP_NUMBER";
export const STEP_FORM = "STEP_FORM";

export const USERMANAGEMENTLISTING = "USERMANAGEMENTLISTING";
export const TENANT_MANAGEMENT_LISTING = "TENANT_MANAGEMENT_LISTING";
export const TENANT_GROUP_USER_MANAGEMENT = "TENANT_GROUP_USER_MANAGEMENT";
export const TENANT_GROUP_TENANT_MANAGEMENT = "TENANT_GROUP_TENANT_MANAGEMENT";
export const TENANT_USER_MANAGEMENT_LISTING = "TENANT_USER_MANAGEMENT_LISTING";
export const PRODUCTMANAGEMENTLISTING = "PRODUCTMANAGEMENTLISTING";
export const PROJECT_MANAGEMENT_LISTING_ACTION =
  "PROJECT_MANAGEMENT_LISTING_ACTION";
export const LEADSOURCELISTING = "LEADSOURCELISTING";
export const LEADINDUSTRYLISTING = "LEADINDUSTRYLISTING";
export const LEADSTAGELISTING = "LEADSTAGELISTING";
export const STAGESTATUSLISTING = "STAGESTATUSLISTING";
export const APPLICATIONLISTING = "APPLICATIONLISTING";
export const FEELOSTREASONLISTING = "FEELOSTREASONLISTING";
export const TEAMPOSITIONLISTING = "TEAMPOSITIONLISTING";
export const MEETINGQUESTIONLISTING = "MEETINGQUESTIONLISTING";
export const MEETINGCATEGORYLISTING = "MEETINGCATEGORYLISTING";
export const MEETINGAGENDALISTING = "MEETINGAGENDALISTING";
export const MEETINGSTATUSLISTING = "MEETINGSTATUSLISTING";
export const CATEGORY_LISTING = "CATEGORY_LISTING";
export const TASK_STATUS_LISTING = "TASK_STATUS_LISTING";

export interface AnyAction {
  type: string;
}

export type EmptyAction = AnyAction;

export const emptyAction = (type: string): EmptyAction => ({ type });

// Add Actions Here
export const fetchUserProfile = (): EmptyAction => emptyAction(USER_PROFILE);
/** @Note Action types for pages entities */

export interface Action<T> extends AnyAction {
  type: string;
  payload: T;
}

type PromiseActions = Action<any> | Action<any>[] | void;

export interface RequestOptions {
  isFormData?: boolean;
  ignoreStatus?: boolean;
}
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

export const action = <T,>(type: string, payload: T): Action<T> => ({
  type,
  payload,
});

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

export const makePaginatedApiCall = <T,>(
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

export const paginatedApiCall = <T,>(
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

export const createBasicActions = <T,>(key: string) => ({
  update: (payload: T) => action(`${key}_UPDATE`, payload),
  reset: () => emptyAction(`${key}_RESET`),
});

export const profileModuleActions = createBasicActions<any>(USER_PROFILE);
export const updateToken = (token: string) => action(TOKEN_UPDATE, token);
export const removeToken = (): EmptyAction => emptyAction(TOKEN_REMOVE);

export const login = (
  formData: { email: string; password: string },
  resolve: any,
  reject: any
) => action(LOGIN, { formData, resolve, reject });
export const logout = (): EmptyAction => emptyAction(LOGOUT);
export const postLogin = (token: string): EmptyAction =>
  action(POST_LOGIN, { token });

export const fetchBaseData = (): EmptyAction => emptyAction(FETCH_BASE_DATA);

const loaderActions = createBasicActions<LoaderState>(SYSTEM_LOADER);
export const showLoader = () => loaderActions.update({ visibility: true });
export const hideLoader = () => loaderActions.update({ visibility: false });

export const updateRights = (rights: string[]) =>
  action(RIGHT_UPDATE, { rights });

export const fetchUserAccess = (): EmptyAction => emptyAction(FETCH_USER_RIGHT);

// STEP FORM
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
