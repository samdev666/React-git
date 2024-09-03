import React from 'react';
import { render, screen } from '@testing-library/react';
import ToastComponent from './index';
import {
  StyledToastContainer,
  StyledToastIcon,
  StyledToastInfoContainer,
  StyledToastInfoText,
  StyledToastInfoSubText,
} from './styles';

describe('Toast Component', () => {
  beforeEach(() => {
    render(
      <ToastComponent
        text="Toast Heading"
        subText="Toast SubText"
        type="success"
      />,
    );
  });

  it('renders success icon correctly', () => {
    const imageElement = screen.getByRole('img');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', '/assets/images/success.svg');
  });
});

describe('Styled Components', () => {
  it('renders StyledToastContainer correctly', () => {
    const wrapper = render(<StyledToastContainer />);
    expect(wrapper).toMatchSnapshot();
  });
  it('renders StyledToastIcon correctly', () => {
    const wrapper = render(<StyledToastIcon />);
    expect(wrapper).toMatchSnapshot();
  });
  it('renders StyledToastInfoContainer correctly', () => {
    const wrapper = render(<StyledToastInfoContainer />);
    expect(wrapper).toMatchSnapshot();
  });
  it('renders StyledToastInfoText correctly', () => {
    const wrapper = render(<StyledToastInfoText />);
    expect(wrapper).toMatchSnapshot();
  });
  it('renders StyledToastInfoSubText correctly', () => {
    const wrapper = render(<StyledToastInfoSubText />);
    expect(wrapper).toMatchSnapshot();
  });
});
