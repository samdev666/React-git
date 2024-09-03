import React from 'react';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useOptions } from './options';
import store from '../redux/store';

const wrapper = ({ children }: { children: any }) => (
  <Provider store={store}>{children}</Provider>
);
describe('useOptions tests', () => {
  test('should accept and render the same initial count', () => {
    const { result } = renderHook(() => useOptions('test-endpoint'), {
      wrapper,
    });
    expect(result.current.options).toStrictEqual([]);
  });
});
