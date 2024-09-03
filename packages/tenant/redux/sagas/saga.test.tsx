import { runSaga } from 'redux-saga';
import { act } from 'react-dom/test-utils';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import * as saga from '.';
import { HttpStatus, routes } from '../../../common/utils';
import {
  updateToken, logout,
  removeToken,
  fetchBaseData,
} from '../actions';
import {  apiCall, login } from '../../api';
import { defaultAuthState } from '../reducers/auth';
import { doLogin } from '.';
import { push } from 'connected-react-router';

jest.mock('../../api', () => ({
  apiCall: jest.fn(),
  login: jest.fn(),
  ping: jest.fn(),
  handleResponse: jest.fn(),
}));

jest.mock('../reducers/auth');

describe('handleResponse', () => {
  it('should handle successful response and update token', async () => {
    const response: any = {
      status: HttpStatus.Ok,
      json: jest.fn().mockResolvedValue({ data: 'some data' }),
      headers: {
        get: jest.fn().mockReturnValue('Bearer newToken'),
      },
    };

    const callback = jest.fn().mockImplementation(() => {
    });

    const dispatched: any = [];

    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
      },
      saga.handleResponse,
      response,
      callback,
    ).toPromise();

    expect(callback).toHaveBeenCalledWith({ data: 'some data' });
    expect(response.headers.get).toHaveBeenCalledWith('Authorization');
    expect(dispatched).toEqual([updateToken('newToken')]);
  });
  it('logs out successfully', async () => {
    const generator = saga.doLogout();

    await act(async () => {
      expect(generator.next().value).toEqual(put(removeToken()));
    });
  });
  it('should handle unauthorized response and dispatch logout', async () => {
    const response: any = {
      status: HttpStatus.Unauthorized,
    };

    const dispatched: any = [];

    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
      },
      saga.handleResponse,
      response,
      jest.fn(),
    ).toPromise();

    expect(dispatched).toEqual([logout()]);
  });
  it('should handle error response and call error callback', async () => {
    const response: any = {
      status: HttpStatus.BadRequest,
      json: jest.fn().mockResolvedValue({ error: 'some error' }),
    };

    const error = jest.fn().mockImplementation(() => {
    });

    const dispatched = [];

    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
      },
      saga.handleResponse,
      response,
      jest.fn(),
      error,
    ).toPromise();

    expect(error).toHaveBeenCalledWith({ error: 'some error' }, response);
  });
  it('should handle unauthorized response', async () => {
    const mockResponse: any = {
      status: 401,
      json: jest.fn(() => Promise.resolve({ error: 'Unauthorized' })),
    };

    const callback = jest.fn();

    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
      },
      saga.handleResponse,
      mockResponse,
      callback,
    ).toPromise();

    expect(dispatched).toContainEqual({
      type: 'LOGOUT',
    });
  });
  it('should handle successful response', async () => {
    const mockResponse: any = {
      status: 200,
      json: jest.fn(() => Promise.resolve({ data: 'mockData' })),
      headers: {
        get: jest.fn(() => 'Bearer mockToken'),
      },
    };

    const callback = jest.fn((body) => ({
      type: 'SUCCESS_ACTION',
      payload: body,
    }));

    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
      },
      saga.handleResponse,
      mockResponse,
      callback,
    ).toPromise();

    expect(dispatched).toEqual([
      {
        type: 'TOKEN_UPDATE',
        payload: 'mockToken',
      },
    ]);
  });
  it('handles fetch base data when token is absent', async () => {
    const generator = saga.doFetchBaseData();
    expect(generator.next().value).toEqual(put(logout()));
  });
  it('should handle unauthorized response', async () => {
    const mockResponse : any = {
      status: 401,
      json: jest.fn(() => Promise.resolve({ error: 'Unauthorized' })),
    };

    const callback = jest.fn();

    const dispatched : any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
      },
      saga.handleResponse,
      mockResponse,
      callback,
    ).toPromise();

    expect(dispatched).toContainEqual({
      type: 'LOGOUT',
    });
  });
  it('should handle error response', async () => {
    const mockResponse :any = {
      status: 500,
      json: jest.fn(() => Promise.resolve({ error: 'Internal Server Error' })),
    };

    const callback = jest.fn((body) => ({
      type: 'ERROR_ACTION',
      payload: body,
    }));

    const dispatched : any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
      },
      saga.handleResponse,
      mockResponse,
      callback,
    ).toPromise();

    expect(dispatched).toEqual([]);
  });
  it('should convert a single value to an array', () => {
    const result = saga.toArray('value');
    expect(result).toEqual(['value']);
  });
  it('should convert an array of values to the same array', () => {
    const result = saga.toArray(['value1', 'value2']);
    expect(result).toEqual(['value1', 'value2']);
  });
  it('should handle void input and return an empty array', () => {
    const result = saga.toArray(undefined);
    expect(result).toEqual([]);
  });
  it('should filter out falsy values from the array', () => {
    const result = saga.toArray(['value1', null, 'value2', undefined, '', 'value3']);
    expect(result).toEqual(['value1', 'value2', 'value3']);
  });
  it('should handle a single falsy value and filter it out', () => {
    const result = saga.toArray(null);
    expect(result).toEqual([]);
  });
  it('should handle a single truthy value and return it in an array', () => {
    const result = saga.toArray('value');
    expect(result).toEqual(['value']);
  });
  });
  it('takes every APICALL action', () => {
    const generator = saga.rootSaga();

    const actual = generator.next().value;
    // const expected = takeEvery(APICALL, saga.doApiCall);

    // expect(actual).toEqual(expected);
  });
  it('should handle successful API call', async () => {
    const filter : any = {
      order: 'name',
      direction: 'asc',
      page: 1,
      limit: 10,
      filters: {},
    };

    const loadMoreAction :any = {
      action: 'LOAD_MORE_ACTION',
    };

    const updateAction = {
      action: 'UPDATE_ACTION',
    };

    const endpoint = '/api/endpoint';
    const mockSuccessBody = { };

    const dispatched:any = [];

    (jest.spyOn(saga, 'handleResponse') as any).mockImplementation((handleSuccess : any) => {
      handleSuccess(mockSuccessBody);
    });

    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
      },
      saga.doPaginatedApiCall,
      {
        payload: {
          request: {
            endpoint,
            filter,
            loadMore: loadMoreAction,
            key: '',
          },
          update: updateAction,
          loadMore: {
            action: '',
          },
          reset: {
            action: '',
          },
        },
      },
    ).toPromise();
  });
  it('should return correct query string with all parameters', () => {
    const filter : any = {
      order: 'name',
      page: 1,
      limit: 10,
      filters: {
        category: 'technology',
        keyword: 'react',
      },
    };

    const queryString = saga.getPaginationParameters(filter);

    expect(queryString).toBe('order=name&page=1&limit=10&filter[category]=technology&filter[keyword]=react');
  });