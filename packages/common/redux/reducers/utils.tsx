import { Reducer } from 'redux';
import { PagedEntity, getDefaultMetaData } from '@wizehub/common/models';
import { StepFormState } from '@wizehub/common/models/genericEntities';
import { Action, SET_STEP_NUMBER, STEP_FORM_DATA_SET } from '../actions';

export const createBasicReducer = <T, >(
  key: string, initialState: T,
) => (state: T = initialState, action: Action<T>): T => {
    switch (action.type) {
      case `${key}_UPDATE`: {
        const { payload } = action;
        if (typeof payload === 'object') {
          if (Array.isArray(payload)) {
            return [...payload as any] as T;
          }
          return { ...payload as any };
        }
        return payload;
      }
      case `${key}_RESET`:
        return initialState;
      default:
        return state;
    }
  };

export const createPagedReducer = <T, >(
  key: string, initialEntity: T[],
): any => {
  const initialState: PagedEntity<T> = {
    metadata: getDefaultMetaData<T>(),
    records: initialEntity,
  };
  return (
    state: PagedEntity<T> = initialState,
    action: Action<PagedEntity<T>>,
  ): PagedEntity<T> => {
    switch (action.type) {
      case `${key}_PAGINATION_UPDATE`: {
        const { payload } = action;
        return {
          metadata: { ...payload.metadata },
          records: [...payload.records],
          requestDate: new Date(),
        };
      }
      case `${key}_PAGINATION_LOAD_MORE`: {
        const { payload } = action;
        return {
          metadata: { ...payload.metadata },
          records: [...state.records, ...payload.records],
          requestDate: new Date(),
        };
      }
      case `${key}_PAGINATION_RESET`:
        return initialState;
      default:
        return state;
    }
  };
};
export const createStepFormReducer = (
  key: string,
  initialState: StepFormState,
): Reducer<StepFormState> => (state: StepFormState = initialState, action: any): StepFormState => {
  switch (action.type) {
    case SET_STEP_NUMBER:
      return {
        ...state,
        currentPage: action.payload.stepNumber,
      };
    case STEP_FORM_DATA_SET:
      const { stepNumber, data } = action.payload;
      return {
        ...state,
        forms: {
          ...state.forms,
          [stepNumber]: data,
        },
      };
    default:
      return state;
  }
};
