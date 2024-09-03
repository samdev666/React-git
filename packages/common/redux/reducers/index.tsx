import { combineReducers, Reducer } from 'redux';
import { connectRouter, RouterState } from 'connected-react-router';
import { History } from 'history';
import {
  PagedEntity,
} from '@wizehub/common/models';
import {
  LoaderState,
  StepFormState,
} from '@wizehub/common/models/genericEntities';
import auth, { AuthState } from './auth';
import {
  createBasicReducer,
  createPagedReducer,
  createStepFormReducer,
} from './utils';
import {
  SYSTEM_LOADER,
  USER_PROFILE,
  STEP_FORM,
  USERMANAGEMENTLISTING,
  TENANTMANAGEMENTLISTING,
  PRODUCTMANAGEMENTLISTING,
  // Add more Action types here
} from '../actions';

export interface ReduxState {
  router: RouterState;
  auth: AuthState;
  profile: any;
  loader: LoaderState;
  stepForm?: StepFormState;
  usermanagement: PagedEntity<any>;
  tenantmanagement: PagedEntity<any>;
  productmanagement: PagedEntity<any>;
  // Add more State here
}

const createRootReducer = (history: History): Reducer => combineReducers<ReduxState>({
  /* Start Third party reducers */
  router: connectRouter(history),
  /* End Third party reducers */
  auth,
  profile: createBasicReducer<any>(USER_PROFILE, {
    id: 0,
    name: '',
    email: '',
    phoneNumber: '',
    dialCode: '',
    role: {
      id: '',
    },
    profilePhoto: '',
  }),
  loader: createBasicReducer<LoaderState>(SYSTEM_LOADER, {
    visibility: false,
  }),
  stepForm: createStepFormReducer(STEP_FORM, {
    currentPage: 0,
    forms: {},
    validationErrors: {},
  }),
  usermanagement: createPagedReducer<any>(USERMANAGEMENTLISTING, []),
  tenantmanagement: createPagedReducer<any>(TENANTMANAGEMENTLISTING, []),
  productmanagement: createPagedReducer<any>(PRODUCTMANAGEMENTLISTING, []),
  // Add more Reducers here
});
export default createRootReducer;
