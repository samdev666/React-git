import React, { useReducer } from 'react';

export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';
export const RESET_MODAL = 'RESET_MODAL';

interface ModalState<T> {
  visibility: boolean;
  metaData?: T;
}

interface ModalAction<T> {
  type: string;
  payload?: { metaData?: Partial<T> };
}

type ModalReducer<T> = (
  state: ModalState<T>,
  action: ModalAction<T>
) => ModalState<T>;

interface ModalHook<T> extends ModalState<T> {
  reset: () => void;
  showPopup: (metaData?: Partial<T>) => void;
  hidePopup: () => void;
}

export const createModalReducer = <T, >(
  defaultModalState?: Partial<ModalState<T>>,
): {
  reducer: ModalReducer<T>;
  initialState: ModalState<T>;
} => {
  const initialState: ModalState<T> = {
    visibility: false,
    ...defaultModalState,
  };

  const reducer = (
    state: ModalState<T> = initialState,
    action: ModalAction<T>,
  ): ModalState<T> => {
    switch (action.type) {
      case SHOW_MODAL: {
        return {
          ...state,
          visibility: true,
          metaData: {
            ...(state?.metaData || {}),
            ...(action.payload?.metaData || {}),
          } as T,
        };
      }
      case HIDE_MODAL: {
        return {
          ...state,
          visibility: false,
          metaData: defaultModalState?.metaData,
        };
      }
      case RESET_MODAL:
        return initialState;
      default:
        return state;
    }
  };
  return { reducer, initialState };
};

export const usePopupReducer = <T, >(
  defaultModalState?: Partial<ModalState<T>>,
): ModalHook<T> => {
  const { reducer, initialState } = createModalReducer(defaultModalState);

  const [state, dispatch] = useReducer(reducer, initialState);

  const reset = () => {
    dispatch({ type: RESET_MODAL });
  };

  const showPopup = (metaData?: Partial<T>) => {
    dispatch({ type: SHOW_MODAL, payload: { metaData } });
  };

  const hidePopup = () => {
    dispatch({ type: HIDE_MODAL });
  };

  return {
    ...state,
    reset,
    showPopup,
    hidePopup,
  };
};
