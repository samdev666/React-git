import { act, renderHook } from '@testing-library/react';
import { usePopupReducer } from './popup';

describe('usePopupReducer', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => usePopupReducer());

    expect(result.current.visibility).toBe(false);
    expect(result.current.metaData).toBeUndefined();
  });

  it('should show the popup', () => {
    const { result } = renderHook(() => usePopupReducer());

    act(() => {
      result.current.showPopup({ additionalData: 'value' });
    });

    expect(result.current.visibility).toBe(true);
    expect(result.current.metaData).toEqual({ additionalData: 'value' });
  });

  it('should hide the popup', () => {
    const { result } = renderHook(() => usePopupReducer());
    act(() => {
      result.current.showPopup();
    });
    act(() => {
      result.current.hidePopup();
    });

    expect(result.current.visibility).toBe(false);
    expect(result.current.metaData).toBeUndefined();
  });

  it('should reset the state', () => {
    const { result } = renderHook(() => usePopupReducer());
    act(() => {
      result.current.showPopup();
    });
    act(() => {
      result.current.reset();
    });

    expect(result.current.visibility).toBe(false);
    expect(result.current.metaData).toBeUndefined();
  });
});
