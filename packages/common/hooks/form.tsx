import React, { useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const UPDATE_FORM = 'UPDATE_FORM';
export const VALIDATE_FORM = 'VALIDATE_FORM';
export const RESET_FORM = 'RESET_FORM';
export const REMOVE_PRISTINE = 'REMOVE_PRISTINE';
export const START_SUBMITTING = 'START_SUBMITTING';
export const STOP_SUBMITTING = 'STOP_SUBMITTING';
export const UPDATE_SUBMIT_ERROR = 'UPDATE_SUBMIT_ERROR';

export const ADD_GROUP_PRISTINE = 'ADD_GROUP_PRISTINE';
export const ADD_ITEM_TO_GROUP = 'ADD_ITEM_TO_GROUP';
export const CHECK_ERRORS = 'CHECK_ERRORS';
export const DELETE_ITEM_FROM_GROUP = 'DELETE_ITEM_FROM_GROUP';
export const EMPTY_GROUP = 'EMPTY_GROUP';
export const UPDATE_RECURSIVE_GROUP = 'UPDATE_RECURSIVE_GROUP';

export type ErrorMessage = string | undefined;
export type Validator = (value: any, formValues?: any) => ErrorMessage;

interface FormState {
  pristine: boolean;
  submitting: boolean;
  hasError: boolean;
  submitError?: string;
  formValues: Record<string, any>;
}

interface FormPayload {
  key: string;
  value?: any;
  _uid?: string;
  field?: string;
  error?: string;
  onChange?: any;
}

interface FormAction {
  type: string;
  payload?: FormPayload;
}

type FormReducer = (state: FormState, action: FormAction) => FormState;
type FormSubmitCallBack = (formValues: Record<string, any>) => Promise<any>;

interface FormHook extends FormState {
  change: (key: string, value: any, error?: any) => void;
  handleRecursiveChange: (key: string, value: any) => void;
  arrayList: (name: string) => any[];
  reset: () => void;
  dirty: () => void;
  emptyGroup: (name: string) => void;
  setSubmitError: (error?: string) => void;
  handleSubmit: (callback?: FormSubmitCallBack) => any;
  connectField: (
    name: string,
    extraProps?: Record<any, any>
  ) => (Field: any) => any;
  connectFieldReplicate: (
    name: string,
    extraProps?: Record<any, any>
  ) => (FieldArray: any) => any;
}

export const hasErrorFunction = (values: any): boolean => {
  if (values === undefined || values === null) {
    return false;
  }

  const keys = Object.keys(values);

  return keys.some((key) => {
    const value = values[key];
    if (value?.error) {
      return true;
    }
    if (Array.isArray(value)) {
      return value.some((item) => hasErrorFunction(item));
    }
    if (typeof value === 'object') {
      return hasErrorFunction(value);
    }
    return false;
  });
};

export const validateValue = (
  key: string,
  value: any,
  formValues: any,
  validators: any = []
): string | undefined => {
  if (validators.length > 0) {
    const errors: string[] = [];
    validators.forEach((validator: any) => {
      const error = validator(value, { ...formValues });
      if (error) {
        errors.push(error);
      }
    });
    if (errors.length > 0) {
      return errors[0];
    }
    return undefined;
  }
  return undefined;
};

export const createFormReducer = (
  validators: Record<string, any> = {},
  initialValues: Record<string, any> = {}
): {
  reducer: FormReducer;
  initialState: FormState;
} => {
  let formValues: Record<string, any> = {};

  Object.keys(initialValues).forEach((key) => {
    if (typeof initialValues?.[key] !== 'object') {
      formValues = { ...formValues, [key]: { value: initialValues[key] } };
    } else {
      const grpArray = initialValues?.[key];
      const updatedGrpArray = grpArray?.map((obj: any) => {
        const newObj: any = { _uid: uuidv4() };
        Object.keys(obj).forEach((objKey) => {
          newObj[objKey] = { value: obj[objKey] };
        });
        return newObj;
      });
      formValues = { ...formValues, [key]: updatedGrpArray };
    }
  });

  Object.keys(validators).forEach((key) => {
    if (typeof validators?.[key][0] === 'function') {
      const error = validateValue(
        key,
        formValues?.[key],
        { ...formValues },
        validators?.[key]
      );
      formValues = {
        ...formValues,
        [key]: { value: formValues?.[key]?.value, error },
      };
    } else if (
      Object.keys(initialValues).length > 0 ||
      typeof validators?.[key][0] === 'undefined'
    ) {
      const nestedValidators = validators?.[key];
      let grpObj: any = {};
      let grpObjArray: any = [];

      Object.keys(nestedValidators).forEach((nestedKey) => {
        let hasError: boolean = false;

        const error = validateValue(
          nestedKey,
          formValues?.[key]?.[nestedKey],
          { ...formValues?.[key] },
          validators?.[key]?.[nestedKey]
        );

        if (error !== '') {
          hasError = true;
        }

        grpObj = {
          ...grpObj,
          [nestedKey]: { value: formValues?.[key]?.[nestedKey]?.value, error },
          _uid: uuidv4(),
          _pristine: true,
          _hasError: hasError,
        };
      });
      grpObjArray = [...grpObjArray, grpObj];

      formValues = {
        ...formValues,
        [key]: grpObjArray,
      };
    }
  });

  const initialState: FormState = {
    pristine: true,
    submitting: false,
    formValues: { ...formValues },
    hasError: hasErrorFunction(formValues),
  };

  const getObjByUID = (_uid: string, field: any, arrayValues: any[] = []) => {
    const foundValue = arrayValues.find((value) => value._uid === _uid);
    return foundValue ? foundValue[field] : null;
  };

  const updateForm = (state: FormState = initialState, action: FormAction) => {
    if (!action?.payload) return state;
    const { key, value, error: customError } = action.payload;
    let field: any;
    let _uid: string;
    let group: any;
    if (typeof key === 'number') {
      field = key;
    } else {
      [field, _uid, group] = key?.split('_');
    }
    const newValue = value === '' ? null : value;
    let error: any;

    if (!_uid && !group) {
      // Normal connectFields
      error = validateValue(
        key,
        newValue,
        { ...state?.formValues },
        validators?.[field]
      );
    } else {
      // Recursive nested field
      const obj = getObjByUID(_uid, field, state?.formValues?.[key]);

      error = validateValue(
        key,
        newValue,
        { ...obj },
        validators?.[group]?.[field]
      );
    }

    if (customError) {
      error = customError;
    }

    let newFormValues: Record<string, any> = { ...state?.formValues };

    if (!_uid && !group) {
      newFormValues = {
        ...newFormValues,
        [key]: { value: newValue, error },
      };
    } else {
      newFormValues[group] = newFormValues[group].map((obj: any) => {
        if (obj._uid === _uid) {
          return {
            ...obj,
            [field]: { value: newValue, error },
            _hasError: error !== '',
            _pristine: obj._pristine,
          };
        }
        return obj;
      });
    }
    const hasError: boolean = hasErrorFunction(newFormValues);

    return {
      ...state,
      formValues: { ...newFormValues },
      hasError,
      submitError: undefined,
    };
  };

  const validateForm = (state: FormState = initialState) => {
    const newFormValues: any = { ...state?.formValues };
    let error: string;

    Object.keys(validators).forEach((key) => {
      if (typeof validators[key][0] === 'function') {
        error = validateValue(
          key,
          newFormValues[key]?.value,
          { ...newFormValues },
          validators[key]
        );

        newFormValues[key] = { ...newFormValues[key], error };
      } else if (typeof validators[key][0] === 'undefined') {
        newFormValues[key] = newFormValues[key]?.map((obj: any) => {
          const newObj: any = { _uid: obj._uid };
          Object.keys(obj).forEach((nestedKey) => {
            if (
              nestedKey === '_uid' ||
              nestedKey === '_hasError' ||
              nestedKey === '_pristine'
            )
              return;

            error = validateValue(
              `${key}_${obj._uid}_${nestedKey}`,
              obj?.[nestedKey]?.value,
              obj,
              validators?.[key]?.[nestedKey]
            );
            newObj[nestedKey] = { value: obj[nestedKey]?.value, error };
          });

          const hasError = hasErrorFunction(obj);

          return {
            ...newObj,
            _hasError: hasError,
            _pristine: obj._pristine,
          };
        });
      }
    });

    const hasError: boolean = hasErrorFunction(newFormValues);

    return {
      ...state,
      formValues: newFormValues,
      hasError,
    };
  };

  const addItemToGroup = (
    state: FormState = initialState,
    action: FormAction
  ) => {
    const { key } = action.payload;

    let newFormValues: Record<string, any> = { ...state?.formValues };

    let grpArray = newFormValues?.[key];

    if (grpArray && grpArray.length > 0) {
      const group = grpArray?.[0];
      let copyGrp: any;

      Object.keys(group).forEach((nestedKey) => {
        if (
          nestedKey !== '_uid' &&
          nestedKey !== '_pristine' &&
          nestedKey !== '_hasError'
        ) {
          const error = validateValue(
            '',
            '',
            group?.[nestedKey]?.value,
            validators?.[key]?.[nestedKey]
          );
          copyGrp = {
            ...copyGrp,
            [nestedKey]: { value: undefined, error },
          };
        }
      });
      copyGrp = {
        ...copyGrp,
        _uid: uuidv4(),
        _pristine: true,
        _hasError: true,
      };

      grpArray = [...grpArray, copyGrp];
      newFormValues = { ...newFormValues, [key]: grpArray };
    } else {
      const nestedValidators = validators?.[key];
      let grpObj: any = {};
      let grpObjArray: any = [];

      Object?.keys(nestedValidators)?.forEach((nestedKey) => {
        const error = validateValue(
          '',
          '',
          newFormValues?.[key]?.[nestedKey],
          validators?.[key]?.[nestedKey]
        );
        grpObj = {
          ...grpObj,
          [nestedKey]: {
            value: '',
            error,
          },
          _uid: uuidv4(),
          _pristine: true,
          _hasError: true,
        };
      });
      grpObjArray = [...grpObjArray, grpObj];

      newFormValues = {
        ...newFormValues,
        [key]: grpObjArray,
      };
    }

    return {
      ...state,
      formValues: { ...newFormValues },
    };
  };

  const deleteItemFromGroup = (
    state: FormState = initialState,
    action: FormAction
  ) => {
    const { key, _uid } = action.payload;

    const newFormValues: Record<string, any> = { ...state?.formValues };

    let groupArray = newFormValues?.[key];

    if (groupArray) {
      groupArray = groupArray.filter((group: any) => group._uid !== _uid);

      newFormValues[key] = groupArray;
    }

    const hasError = hasErrorFunction(newFormValues);

    return {
      ...state,
      formValues: { ...newFormValues },
      hasError,
    };
  };

  const updateRecursiveGroup = (
    state: FormState = initialState,
    action: FormAction
  ) => {
    const { key, value } = action.payload;
    const groupName = key;
    const grpListValues = value;
    let error: string;
    const newFormValues: Record<string, any> = { ...state?.formValues };

    if (newFormValues?.[groupName]) {
      newFormValues[groupName] = grpListValues.map((obj: any) => {
        const newObj: any = { _uid: uuidv4() };
        Object.keys(obj).forEach((nestedKey) => {
          error = validateValue(
            '',
            obj?.[nestedKey],
            obj,
            validators?.[key]?.[nestedKey]
          );
          newObj[nestedKey] = { value: obj[nestedKey], error };
        });
        return { ...newObj, _pristine: true, _hasError: error !== '' };
      });
    }

    return {
      ...state,
      formValues: { ...newFormValues },
    };
  };

  const reducer = (state: FormState = initialState, action: FormAction) => {
    switch (action.type) {
      case UPDATE_FORM:
        return updateForm(state, action);

      case VALIDATE_FORM:
        return validateForm(state);

      case ADD_ITEM_TO_GROUP:
        return addItemToGroup(state, action);

      case DELETE_ITEM_FROM_GROUP:
        return deleteItemFromGroup(state, action);

      case UPDATE_RECURSIVE_GROUP:
        return updateRecursiveGroup(state, action);

      case EMPTY_GROUP: {
        if (state?.hasError) return null;
        const { key } = action.payload;
        const newFormValues: any = {
          ...state?.formValues,
          [key]: [],
        };

        return {
          ...state,
          formValues: newFormValues,
          pristine: true,
          hasError: false,
          submitting: false,
          submitError: undefined,
        };
      }

      case CHECK_ERRORS: {
        const { key } = action.payload;

        let hasError: boolean;

        if (key) {
          hasError = hasErrorFunction(formValues?.[key]);
        } else {
          hasError = hasErrorFunction(formValues);
        }

        return {
          ...state,
          hasError,
        };
      }

      case UPDATE_SUBMIT_ERROR: {
        if (!action?.payload) return state;
        const { error: submitError } = action.payload;
        return { ...state, submitError };
      }

      case ADD_GROUP_PRISTINE: {
        const { key } = action.payload;

        const updatedFormValues = { ...state.formValues };

        updatedFormValues[key] = updatedFormValues[key].map((group: any) => ({
          ...group,
          _pristine: !group._hasError,
        }));

        return {
          ...state,
          formValues: updatedFormValues,
        };
      }

      case REMOVE_PRISTINE: {
        const newFormValues: any = { ...state?.formValues };

        Object.keys(newFormValues).forEach((key) => {
          if (typeof newFormValues?.[key]?.[0] !== 'undefined') {
            newFormValues?.[key].forEach((obj: any, index: number) => {
              newFormValues[key][index] = { ...obj, _pristine: false };
            });
          }
        });

        return { ...state, formValues: newFormValues, pristine: false };
      }

      case START_SUBMITTING:
        return { ...state, submitting: true };

      case STOP_SUBMITTING:
        return { ...state, submitting: false };

      case RESET_FORM:
        return initialState;

      default:
        return state;
    }
  };
  return { reducer, initialState };
};

export const useFormReducer = (
  validators: Record<string, any> = {},
  initialValues: Record<string, any> = {},
  onChange?: (changed: Record<string, any>, extraParams: any) => void
): FormHook => {
  const { reducer, initialState } = createFormReducer(
    validators,
    initialValues
  );

  const [state, dispatch] = useReducer(reducer, initialState);

  const prepareEntryData = (obj: any) => {
    const entryData: any = {};
    Object.keys(obj).forEach((field) => {
      if (field !== '_uid' && field !== '_hasError' && field !== '_pristine') {
        entryData[field] = obj[field].value;
      }
    });
    return entryData;
  };

  const validateForm = () => {
    dispatch({ type: VALIDATE_FORM });
  };

  const change = (key: string, value: any, error?: any) => {
    dispatch({ type: UPDATE_FORM, payload: { key, value, error } });
    setTimeout(() => {
      validateForm();
    }, 7);
  };

  const reset = () => {
    dispatch({ type: RESET_FORM });
  };

  const dirty = () => {
    dispatch({ type: REMOVE_PRISTINE });
  };

  const startSubmitting = () => {
    dispatch({ type: START_SUBMITTING });
  };

  // Empties the group after submitting the form
  const emptyGroup = (name: string) => {
    dispatch({ type: EMPTY_GROUP, payload: { key: name.toLowerCase() } });
  };

  const stopSubmitting = () => {
    dispatch({ type: STOP_SUBMITTING });
  };

  const setSubmitError = (error?: string) => {
    dispatch({
      type: UPDATE_SUBMIT_ERROR,
      payload: { key: 'submitError', error },
    });
  };

  // Sends error in the nested field
  // (in recursive group) accordint to the group's _pristine and _hasError
  const sendNestedError = (name: string) => {
    const [, _uid, group] = name.split('_');
    let sendError: boolean = false;

    state?.formValues?.[group].forEach((obj: any) => {
      if (obj._uid === _uid) {
        sendError = !obj._pristine && obj._hasError;
      }
    });

    return sendError;
  };

  const handleSubmit = (callback: FormSubmitCallBack) => async (event: any) => {
    /* eslint-disable no-unused-expressions */
    event?.preventDefault();
    dirty();
    if (callback && !state.hasError && !state.submitting) {
      startSubmitting();
      const formData: any = {};
      Object.keys(state?.formValues).forEach((key) => {
        if (Array.isArray(state?.formValues[key])) {
          formData[key] = state?.formValues[key]?.map((obj: any) =>
            prepareEntryData(obj)
          );
        } else {
          formData[key] = state?.formValues[key]?.value;
        }
      });

      await callback(formData);
      stopSubmitting();
    }
  };

  const handleChange = (value: any) => {
    if (onChange) {
      const data = Object.keys(state.formValues).reduce(
        (acc, key) => ({ ...acc, [key]: state.formValues[key].value }),
        {}
      );
      onChange(value, {
        change,
        values: { ...data, ...value },
      });
    }
  };

  // Handles change for a field inside recursive group i.e (connectNestedField)
  const handleNestedFieldChange = (value: any) => {
    if (onChange) {
      const updatedValues: any = {};

      Object.keys(state?.formValues).forEach((key) => {
        if (Array.isArray(state?.formValues[key])) {
          updatedValues[key] = state?.formValues[key].map((obj: any) => ({
            ...obj,
            value: value?.[key]?.[obj._uid]?.value ?? obj.value,
          }));
        } else {
          updatedValues[key] = {
            ...state?.formValues[key],
            value: value?.[key]?.value ?? state?.formValues[key].value,
          };
        }
      });

      onChange(value, {
        change,
        values: { ...updatedValues, ...value },
      });
    }
  };
  // Updates values in the recursive group (from API calls etc.)
  const handleRecursiveChange = (name: string, listValues: []) => {
    dispatch({
      type: UPDATE_RECURSIVE_GROUP,
      payload: { key: name, value: listValues },
    });
  };

  // Returns Value for a specific field by UID
  const getValueByUID = (name: string) => {
    const [fieldName, _uid, group] = name.split('_');

    const groupArray = state?.formValues?.[group] || [];

    const foundItem = groupArray.find(
      (groupItem: any) => groupItem._uid === _uid
    );

    if (foundItem) {
      return foundItem?.[fieldName]?.value;
    }

    return null;
  };

  // Returns Error for a specific field by UID
  const getErrorByUID = (name: string) => {
    const [fieldName, _uid, group] = name.split('_');

    const groupArray = state?.formValues?.[group] || [];

    const foundItem = groupArray.find(
      (groupItem: any) => groupItem._uid === _uid
    );

    if (foundItem) {
      return foundItem?.[fieldName]?.error;
    }

    return null;
  };

  // Returns length of a specific recursive group
  const arrayList = (name: string): any[] =>
    state?.formValues?.[name.toLowerCase()] || [];

  // Normal input field with name as key
  const connectField =
    (name: string, extraProps: Record<any, any> = {}) =>
    (Field: any) =>
      (
        <Field
          {...extraProps}
          key={name}
          value={state?.formValues?.[name]?.value}
          error={!state?.pristine && state?.formValues?.[name]?.error}
          onChange={(value: any) => {
            change(name, value);
            handleChange({ [name]: value });
          }}
        />
      );

  // Field inside Recursive Group with name as key (name = fieldName_uid_group)
  const connectNestedField =
    (name: string, extraProps: Record<any, any> = {}) =>
    (NestedField: any) =>
      (
        <NestedField
          {...extraProps}
          key={name}
          onNestedFieldChange={(value: any) => {
            change(name, value);
            handleNestedFieldChange({ [name]: value });
          }}
          value={getValueByUID(name)}
          error={sendNestedError(name) && getErrorByUID(name)}
        />
      );
  // Recursive Group that contains the nestedFields with name a key(or Group name)
  const connectFieldReplicate =
    (name: string, extraProps: Record<any, any> = {}) =>
    (FieldArray: any) =>
      (
        <FieldArray
          {...extraProps}
          key={name}
          arrayList={arrayList(name)}
          connectNestedField={connectNestedField}
          addItemToGroup={(key: string, value?: Record<any, any>) => {
            if (!hasErrorFunction(state?.formValues?.[name])) {
              dispatch({ type: ADD_ITEM_TO_GROUP, payload: { key, value } });
              validateForm();
            } else {
              dispatch({ type: ADD_GROUP_PRISTINE, payload: { key } });
            }
          }}
          deleteItemFromGroup={(key: string, _uid: string) => {
            dispatch({ type: DELETE_ITEM_FROM_GROUP, payload: { key, _uid } });
          }}
          group={name}
        />
      );

  return {
    ...state,
    change,
    arrayList,
    handleRecursiveChange,
    reset,
    dirty,
    handleSubmit,
    setSubmitError,
    connectField,
    emptyGroup,
    connectFieldReplicate,
  };
};
