import React from 'react';
import { render, screen } from '@testing-library/react';
import TextInput from './index';
import { StyledTextField, StyledError, StyledInputContainer } from './styles';

describe('TextInput Component', () => {
  it('renders without crashing', () => {
    render(<TextInput />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders with the provided value', () => {
    const value = 'Test Value';
    render(<TextInput value={value} />);
    expect(screen.getByRole('textbox')).toHaveValue(value);
  });
});

describe('Styled Components', () => {
  it('renders StyledInputContainer correctly', () => {
    const { container } = render(<StyledInputContainer />);
    expect(container).toMatchSnapshot();
  });
  it('renders StyledTextField correctly', () => {
    const { container } = render(<StyledTextField />);
    expect(container).toMatchSnapshot();
  });
  it('renders StyledError correctly', () => {
    const { container } = render(<StyledError />);
    expect(container).toMatchSnapshot();
  });
});
