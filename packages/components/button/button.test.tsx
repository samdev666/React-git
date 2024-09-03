import React from 'react';
import {
  render, screen,
} from '@testing-library/react';
import Button from './index';
import { StyledButton } from './styles';

describe('Button Component', () => {
  it('renders without crashing', () => {
    render(<Button />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});

describe('Styled Components', () => {
  it('renders StyledButton correctly', () => {
    const wrapper = render(<StyledButton />);
    expect(wrapper).toMatchSnapshot();
  });
});
