import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SwitchInput from './index';

describe('SwitchInput Component', () => {
  it('renders without crashing', () => {
    render(<SwitchInput />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders label', () => {
    const label = 'Test Label';
    render(<SwitchInput label={label} />);
    expect(screen.getByLabelText(label)).toBeInTheDocument();
  });

  it('calls onChange when the switch is toggled and it is not read-only', () => {
    const onChangeMock = jest.fn();
    render(<SwitchInput value="string" onChange={onChangeMock} />);

    const switchElement = screen.getByRole('checkbox');
    fireEvent.click(switchElement);

    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledWith(false);
  });
});
