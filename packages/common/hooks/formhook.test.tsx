import { act, renderHook } from '@testing-library/react';
import { useFormReducer } from './form';

describe('useFormReducer', () => {
  it('should update form values on change', () => {
    const { result } = renderHook(() => useFormReducer());

    act(() => {
      result.current.change('fieldName', 'Test Value');
    });

    expect(result.current.formValues.fieldName.value).toBe('Test Value');
  });

  it('should set submit error', () => {
    const { result } = renderHook(() => useFormReducer());

    act(() => {
      result.current.setSubmitError('Submit Error');
    });

    expect(result.current.submitError).toBe('Submit Error');
  });

  it('should handle form submission', async () => {
    const callbackMock = jest.fn();
    const { result } = renderHook(() => useFormReducer({}, { fieldName: 'Initial Value' }, callbackMock));

    act(() => {
      result.current.change('fieldName', 'Test Value');
    });

    await act(async () => {
      await result.current.handleSubmit(callbackMock)({
        preventDefault: jest.fn(),
      });
    });

    expect(callbackMock).toHaveBeenCalledWith({ fieldName: 'Test Value' });
  });

  it('should handle form submission with validation error', async () => {
    const callbackMock = jest.fn();
    const validators = {
      fieldName: [
        (value: string) => (value === 'Invalid' ? 'Invalid Value' : undefined),
      ],
    };
    const { result } = renderHook(() => useFormReducer(validators, { fieldName: 'Initial Value' }, callbackMock));

    act(() => {
      result.current.change('fieldName', 'Invalid');
    });

    await act(async () => {
      await result.current.handleSubmit(callbackMock)({
        preventDefault: jest.fn(),
      });
    });

    expect(callbackMock).not.toHaveBeenCalled();
    expect(result.current.formValues.fieldName.error).toBe('Invalid Value');
  });

  it('should reset the form state', () => {
    const { result } = renderHook(() => useFormReducer());

    act(() => {
      result.current.change('fieldName', 'Test Value');
    });

    act(() => {
      result.current.reset();
    });
    const { fieldName } = result.current.formValues;
    expect(fieldName).toBeUndefined();

    if (fieldName) {
      expect(fieldName.value).toBeUndefined();
      expect(fieldName.error).toBeUndefined();
    }

    expect(result.current.pristine).toBe(true);
    expect(result.current.submitting).toBe(false);
    expect(result.current.hasError).toBe(false);
    expect(result.current.submitError).toBeUndefined();
  });

  it('should mark the form as dirty', () => {
    const { result } = renderHook(() => useFormReducer());

    act(() => {
      result.current.dirty();
    });

    expect(result.current.pristine).toBe(false);
  });
});
