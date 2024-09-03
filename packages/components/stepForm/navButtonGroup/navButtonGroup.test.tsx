import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import NavButtonGroup from '.';

const mockStore = configureStore([]);

describe('NavButtonGroup component', () => {
  test('renders Back button when currentFormIndex is greater than 0', () => {
    const initialState = {
      stepForm: {
        currentPage: 1,
      },
    };
    const store = mockStore(initialState);

    const { getByText } = render(
      <Provider store={store}>
        <NavButtonGroup formLength={3} />
      </Provider>,
    );

    const backButton = getByText('Back');
    expect(backButton).toBeInTheDocument();
  });

  test('renders Next button when currentFormIndex is less than formLength - 1', () => {
    const initialState = {
      stepForm: {
        currentPage: 1,
      },
    };
    const store = mockStore(initialState);

    const { getByText } = render(
      <Provider store={store}>
        <NavButtonGroup formLength={3} />
      </Provider>,
    );

    const nextButton = getByText('Next');
    expect(nextButton).toBeInTheDocument();
  });
});
