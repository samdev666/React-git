import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MaterialTextInput from '.';
import { StyledInputContainer } from './styles';

describe('Material Text Input Component', () => {
  it('renders without crashing', () => {
    render(<MaterialTextInput />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('applies value sent through props', () => {
    const tempText = 'sometestvalue';
    render(<MaterialTextInput value={tempText} />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toHaveValue(tempText);
  });

  it('runs onChange provided through props', () => {
    const tempFunction = jest.fn();
    render(<MaterialTextInput onChange={tempFunction} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'testingtext' } });
    expect(tempFunction).toHaveBeenCalled();
  });

  it('hides error when disableErrorMode is true', () => {
    render(<MaterialTextInput disableErrorMode />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).not.toHaveAttribute('aria-invalid', 'true');
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it('renders StyledAdminName correctly', () => {
    const wrapper = render(<StyledInputContainer />);
    expect(wrapper).toMatchSnapshot();
  });
});
