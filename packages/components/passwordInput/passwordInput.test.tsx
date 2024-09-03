import React from 'react';
import {
  render, screen, fireEvent,
} from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@wizehub/common/theme';
import PasswordInput from './index';

describe('PasswordInput Component', () => {
  it('renders without crashing', () => {
    render(<PasswordInput />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders a TextField', () => {
    render(<PasswordInput />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('displays an error message when there is an error', () => {
    const error = 'Password is required';
    render(<PasswordInput error={error} />);
    const errorText = screen.getByText(error);
    expect(errorText).toBeInTheDocument();
  });

  it('does not display error when disableErrorMode is true', () => {
    const error = 'Password is required';
    render(<PasswordInput error={error} disableErrorMode />);
    const errorText = screen.queryByText(error);
    expect(errorText).not.toBeInTheDocument();
  });

  it('renders with value', () => {
    const { asFragment } = render(
      <ThemeProvider theme={theme}>
        <PasswordInput label="Password" value="test" />
      </ThemeProvider>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with maxWidth', () => {
    const { asFragment } = render(
      <ThemeProvider theme={theme}>
        <PasswordInput label="Password" maxWidth="200px" />
      </ThemeProvider>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with disableErrorMode', () => {
    const { asFragment } = render(
      <ThemeProvider theme={theme}>
        <PasswordInput label="Password" error="Error message" disableErrorMode />
      </ThemeProvider>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  describe('PasswordInput', () => {
    it('toggles password visibility', () => {
      const { getByRole, getByLabelText } = render(<PasswordInput label="Password" />);

      const passwordInput = getByLabelText('Password');
      const toggleButton = getByRole('button');

      expect(passwordInput).toHaveAttribute('type', 'password');
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('PasswordInput mouseEvent', () => {
    it('prevents default on mouse down event', () => {
      const { getByRole } = render(<PasswordInput label="Password" />);

      const toggleButton = getByRole('button');

      const preventDefault = jest.fn();
      toggleButton.onmousedown = preventDefault;

      fireEvent.mouseDown(toggleButton);

      expect(preventDefault).toHaveBeenCalled();
    });
  });
});
