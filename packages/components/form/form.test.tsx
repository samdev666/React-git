import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Form, FormRow, FormRowItem, FormError,
} from './index';

describe('Form Components', () => {
  it('renders Form without crashing', () => {
    render(<Form />);
    expect(<Form />).toMatchSnapshot();
  });

  it('renders FormRow Component', () => {
    render(<FormRow />);
    expect(<FormRow />).toMatchSnapshot();
  });

  it('renders FormRowItem Component', () => {
    render(<FormRowItem />);
    expect(<FormRowItem />).toMatchSnapshot();
  });
});

it('renders FormError Component', () => {
  render(<FormError />);
  expect(screen.getByRole('alert')).toBeInTheDocument(); // Assuming FormError renders an alert element
});

it('renders FormError with a custom message', () => {
  const customMessage = 'This is a custom error message';
  render(<FormError message={customMessage} />);
  expect(screen.getByText(customMessage)).toBeInTheDocument();
});

it('matches snapshot for Form component', () => {
  const { asFragment } = render(<Form />);
  expect(asFragment()).toMatchSnapshot();
});
