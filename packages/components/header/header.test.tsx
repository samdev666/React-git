import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './index';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

describe('Header Component', () => {
  it('renders without crashing', () => {
    render(
      <Router>
        <Header />
      </Router>,
    );
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  const userProfile = {
    name: 'John Doe',
    profilePhoto: 'avatar.jpg',
  };

  beforeEach(() => {
    require('react-redux').useSelector.mockImplementation((selectorFn: any) => selectorFn({
      profile: userProfile,
    }));
    require('react-router-dom').useLocation.mockImplementation(() => ({ pathname: '/' }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders user profile name', () => {
    render(
      <Router>
        <Header />
      </Router>,
    );
    expect(screen.getByText(userProfile.name)).toBeInTheDocument();
  });
});
