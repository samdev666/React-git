import { call, put, takeEvery } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import { HttpStatus, encodeBase64 } from "@wizehub/common/utils";
import { MetaData } from "@wizehub/common/models";
import {
  APICALL,
  ApiCall,
  FETCH_BASE_DATA,
  FETCH_USER_RIGHT,
  LOGIN,
  LOGOUT,
  PAGINATED_APICALL,
  POST_LOGIN,
  PagedApiCall,
  USER_PROFILE,
  action,
  fetchBaseData,
  fetchUserAccess,
  fetchUserProfile,
  logout,
  profileModuleActions,
  removeToken,
  updateRights,
  updateToken,
} from "../actions";
import {
  PROFILE,
  apiCall,
  fetchUserAccessRights,
  login,
  ping,
} from "../../api";
import { defaultUserRights, getToken } from "../reducers/auth";

declare type callback = (body: any) => any;
declare type errorHandler = (body: any, response: Response) => any;

function* handleSuccessfulResponse(
  response: Response,
  callback: callback
): any {
  const body = yield response.json();
  const authToken = response?.headers
    ?.get("Authorization")
    ?.split("Bearer ")[1];
  if (authToken) {
    yield put(updateToken(authToken));
  }
  const callbackResult = callback(body);
  if (callbackResult) {
    yield* callbackResult;
  }
}

export function* handleResponse(
  response: Response,
  callback: callback,
  error?: errorHandler,
  ignoreStatus = false
): any {
  try {
    if (response.status === HttpStatus.Ok) {
      yield* handleSuccessfulResponse(response, callback);
    } else if (
      !ignoreStatus &&
      response.status === HttpStatus.Unauthorized
      // || response.status === HttpStatus.Forbidden
    ) {
      /** @Note
       * Logout user ,Usually we take this path,
       * but sometimes we want to ignore 403's,
       * especially when logging in
       * */
      yield put(logout());
    } else if (error) {
      const body = yield response.json();
      const callbackResult = error(body, response);
      if (callbackResult) {
        yield* callbackResult;
      }
    }
  } catch (e) {
    if (error) {
      const callbackResult = error(e, response);
      if (callbackResult) {
        yield* callbackResult;
      }
    }
  }
}

export function toArray<T>(param: T | T[] | void) {
  if (param) {
    return param instanceof Array ? param.filter((p) => !!p) : [param];
  }

  return [];
}

function* doApiCall<
  RequestProps,
  SuccessProps extends { _requestDate: Date },
  FailureProps extends Response
>(event: {
  payload: ApiCall<RequestProps, SuccessProps, FailureProps>;
}): Generator<any> {
  const {
    request: {
      requestProps: { payload, method, options },
    },
    success,
    failure,
  } = event.payload;

  const { isFormData, ignoreStatus } = options || {};

  const {
    request: {
      requestProps: { endpoint },
    },
  } = event.payload;
  const date = new Date();

  try {
    const result: any = yield call(
      apiCall,
      endpoint,
      method,
      payload,
      isFormData
    );
    yield* handleResponse(
      result,
      function* (body: SuccessProps) {
        const newBody = body;
        if (typeof body === "object") {
          newBody._requestDate = date;
        }
        if (success.resolve) {
          const actions = toArray(success.resolve(newBody));
          yield* actions.map((act) => put(act));
        }
      },
      function* (body: FailureProps): any {
        if (failure.reject) {
          const actions = toArray(failure.reject(body));
          yield* actions.map((act) => put(act));
        }
      },
      ignoreStatus
    );
  } catch (e) {
    console.log(e); // eslint-disable-line no-console
  }
}

export function getPaginationParameters(filter: MetaData<any>): string {
  const { order, direction, page, limit, filters, allResults } = filter;
  const simpleParams = {
    order,
    direction,
    page,
    limit,
    allResults,
  };

  let filterParams: string[] = [];

  Object.keys(filters).forEach((key) => {
    filterParams = filterParams.concat(
      filters[key] ? [`filter[${key}]=${filters[key]}`] : []
    );
  });

  return Object.keys(simpleParams)
    .map((key: keyof typeof simpleParams) =>
      simpleParams[key] ? `${key}=${String(simpleParams[key])}` : ""
    )
    .concat(filterParams)
    .filter((value) => value)
    .join("&");
}

export function* doPaginatedApiCall<
  MetaDataProps,
  SuccessProps,
  FailureProps extends Response
>(event: { payload: PagedApiCall<MetaDataProps> }): Generator<any> {
  const {
    request: { endpoint, filter, loadMore: isLoadMore },
    update,
    loadMore,
  } = event.payload;
  const finalEndpoint = `${endpoint}?${getPaginationParameters(filter)}`;
  try {
    const result: any = yield call(apiCall, finalEndpoint);
    yield* handleResponse(result, function* (body: SuccessProps) {
      if (isLoadMore) {
        yield put(action(loadMore.action, body));
      } else {
        yield put(action(update.action, body));
      }
    });
  } catch (e) {
    console.log(e); // eslint-disable-line no-console
  }
}

export function* doFetchBaseData(): Generator<any> {
  if (getToken()) {
    const result: any = yield call(ping);
    yield* handleResponse(
      result,
      function* () {
        /** @Note Add actions to fetch initial data */
        yield put(fetchUserAccess());
        yield put(fetchUserProfile());
      },
      function* () {
        yield put(logout());
      },
      true
    );
  } else {
    yield put(logout());
  }
}

export function* doFetchUserAccess(): Generator<any> {
  if (getToken()) {
    const result: any = yield call(fetchUserAccessRights);
    yield* handleResponse(
      result,
      function* (body) {
        yield put(updateRights(body));
        localStorage.setItem("rights", encodeBase64(body));
      },
      function* () {
        yield put(logout());
      },
      true
    );
  } else {
    yield put(logout());
  }
}

export function* doLogin(event: any): Generator<any> {
  try {
    const result: any = yield call(login, event?.payload?.formData);
    yield* handleResponse(
      result,
      function* (body) {
        yield put(updateToken(body?.token));
        yield put(fetchBaseData());
        yield event?.payload?.resolve(body);
      },
      function* (body: any) {
        yield event?.payload?.reject(body);
      },
      true
    );
  } catch (e) {
    event?.payload?.reject(e);
  }
}

export function* doPostLogin(event: any): Generator<any> {
  const token = event?.payload?.token;
  localStorage.setItem("rights", encodeBase64(defaultUserRights));
  yield put(updateToken(token));
  yield put(fetchBaseData());
}

export function* doFetchUserProfile(): Generator<any> {
  if (getToken()) {
    const result: any = yield call(apiCall, PROFILE);
    yield* handleResponse(
      result,
      function* (body) {
        yield put(profileModuleActions.update(body || {}));
      },
      function* () {
        yield put(logout());
      },
      true
    );
  } else {
    yield put(logout());
  }
}

export function* doLogout() {
  try {
    yield put(removeToken());
    localStorage.removeItem("rights");
  } catch (error) {
    console.log(error); // eslint-disable-line no-console
  }
}

export function* rootSaga(): SagaIterator<void> {
  yield takeEvery(APICALL, doApiCall as any);
  yield takeEvery(PAGINATED_APICALL, doPaginatedApiCall as any);
  yield takeEvery(LOGIN, doLogin);
  yield takeEvery(LOGOUT, doLogout);
  yield takeEvery(FETCH_USER_RIGHT, doFetchUserAccess);
  yield takeEvery(FETCH_BASE_DATA, doFetchBaseData);
  yield takeEvery(USER_PROFILE, doFetchUserProfile);
  yield takeEvery(POST_LOGIN, doPostLogin);
}
