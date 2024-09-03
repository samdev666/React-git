import {
  defaultAuthState, AuthenticationStatus, Role, AuthState, Right, getToken, getRightsForRole, getStateFromToken,
} from './auth';

describe('getToken', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('returns the token from localStorage', () => {
    const testToken = 'testToken';
    localStorage.setItem('token', testToken);
    const retrievedToken = getToken();
    expect(retrievedToken).toEqual(undefined);
  });

  it('returns undefined if token is not found in localStorage', () => {
    localStorage.removeItem('token');
    expect(getToken()).toBeUndefined();
  });
});

describe('Auth State', () => {
  let state: AuthState;

  beforeEach(() => {
    state = { ...defaultAuthState };
  });

  it('returns true if right is not provided and status matches', () => {
    state.status = AuthenticationStatus.AUTHENTICATED;
    const result = state.hasStatusAndRight();
    expect(result).toBeTruthy();
  });

  it('returns true if status matches this.status', () => {
    state.status = AuthenticationStatus.AUTHENTICATED;
    const result = state.hasStatusAndRight(undefined);
    expect(result).toBeTruthy();
  });

  it('returns true if right exists in rights array', () => {
    state.rights = [Right.DASHBOARD];
    const result = state.hasStatusAndRight(undefined);
    expect(result).toBeTruthy();
  });

  it('returns false if status does not match this.status', () => {
    state.status = AuthenticationStatus.NOT_AUTHENTICATED;
    const result = state.hasStatusAndRight(
      AuthenticationStatus.AUTHENTICATED,
    );
    expect(result).toBeFalsy();
  });

  it('returns true if the provided role matches this.role', () => {
    const state = { ...defaultAuthState, role: Role.ADMINISTRATOR };
    expect(state.hasRole(Role.ADMINISTRATOR)).toBeTruthy();
  });

  it('returns false if the provided role does not match this.role', () => {
    const state = { ...defaultAuthState, role: Role.ADMINISTRATOR };
    expect(state.hasRole(Role.INVALID)).toBeFalsy();
  });

  it('returns the correct rights for Role.ADMINISTRATOR', () => {
    const rights = getRightsForRole(Role.ADMINISTRATOR);
    expect(rights).toContain(Right.DASHBOARD);
    expect(rights.length).toBe(1);
  });

  it('returns an empty array for an invalid role', () => {
    const rights = getRightsForRole(Role.INVALID);
    expect(rights).toEqual([]);
  });
});

describe('getStateFromToken', () => {
  it('should set role, rights, and status based on tokenData type', () => {
    const initialState = defaultAuthState;
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoxLCJpYXQiOjE2NjE5NjIzNjIsImV4cCI6MTY2MjA0ODY4NiwiaXNzIjoiYXV0aGVudGljYXRlZCIsInN1YiI6IjIiLCJyb2xlIjoxfQ.OUgucRf2i99RI32m7xM3cW0VeWBmTL6SmzD5BGnyQKs';
    const tokenData = {
      type: Role.ADMINISTRATOR,
    };

    jest.spyOn(window, 'atob').mockImplementation(() => JSON.stringify(tokenData));

    const newState = getStateFromToken(initialState, token);

    expect(newState.role).toEqual(Role.ADMINISTRATOR);
    expect(newState.rights).toEqual([Right.DASHBOARD]);
    expect(newState.status).toEqual(AuthenticationStatus.AUTHENTICATED);
  });
});

describe('getStateFromToken', () => {
  it('should set default values when token is not defined', () => {
    const initialState = defaultAuthState;

    const newState = getStateFromToken(initialState, undefined);
    expect(newState.rights).toEqual([]);
    expect(newState.role).toEqual(Role.INVALID);
    expect(newState.status).toEqual(AuthenticationStatus.NOT_AUTHENTICATED);
  });
});

describe('getStateFromToken', () => {
  it('should set default values when token data is invalid', () => {
    const initialState = defaultAuthState;

    const newState = getStateFromToken(initialState, undefined);

    expect(newState.rights).toEqual([]);
    expect(newState.role).toEqual(Role.INVALID);
    expect(newState.status).toEqual(AuthenticationStatus.NOT_AUTHENTICATED);
  });
});

describe('getStateFromToken', () => {
  it('should set role, rights, and status based on tokenData type', () => {
    const initialState = defaultAuthState;
    const token = 'mockToken';
    const tokenData = { type: Role.ADMINISTRATOR };

    const mockAtob = jest.spyOn(window, 'atob').mockReturnValueOnce(JSON.stringify(tokenData));

    const newState = getStateFromToken(initialState, token);

    expect(newState.role).toEqual(Role.ADMINISTRATOR);
    expect(newState.rights).toEqual([Right.DASHBOARD]);
    expect(newState.status).toEqual(AuthenticationStatus.AUTHENTICATED);

    mockAtob.mockRestore();
  });
});
