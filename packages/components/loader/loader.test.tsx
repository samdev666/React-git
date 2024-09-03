import React from 'react';
import { render } from '@testing-library/react';
import Loader from './index';
import { StyledContainer } from './styles';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest
    .fn()
    .mockReturnValue({ loaderState: { visibility: false } }),
}));

describe('Loader Component', () => {
  it('renders without crashing', () => {
    render(<Loader />);
    expect(<Loader />).toMatchSnapshot();
  });

  it('renders the StyledContainer', () => {
    render(<StyledContainer />);
    expect(<StyledContainer />).toMatchSnapshot();
  });
});
