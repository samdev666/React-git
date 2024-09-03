import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('../../../assets/images/arrowIcon.svg', () => 'arrow.svg');
jest.mock('../../../assets/images/sidenavlogo.svg', () => 'sidenavlogo.svg');
jest.mock('../../../assets/images/logout.svg', () => 'logout.svg');
jest.mock('../../../assets/images/smallLogo.svg', () => 'smallLogo.svg');
jest.mock('../../../assets/images/arrowOpenIcon.svg', () => 'arrowOpenIcon.svg');

const mockStore = configureStore([]);

describe('Sidebar Component', () => {
  it('toggles sidebar when sidebar toggle icon is clicked', () => {
    render(
      <Provider store={mockStore({})}>
        <Router />
      </Provider>,
    );

    const toggleIcon = screen.getByAltText(/arrow/i);
    fireEvent.click(toggleIcon);

    const menuItems = screen.queryAllByRole('menuitem');
    expect(menuItems).toHaveLength(0);
  });
});
