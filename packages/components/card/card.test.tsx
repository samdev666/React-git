import React from 'react';
import {
  render, screen,
} from '@testing-library/react';
import Card from './index';
import {
  StyledCard,
  StyledCardContent,
  StyledCardHeader,
  CardTitle,
} from './styles';

describe('Card Component', () => {
  it('renders without crashing', () => {
    render(<Card />);
  });

  it('renders the header and title when provided', () => {
    const headerText = 'Test Header';
    const titleText = 'Test Title';
    render(<Card header={<div>{headerText}</div>} title={titleText} />);

    expect(screen.getByText(headerText)).toBeInTheDocument();
    expect(screen.getByText(titleText)).toBeInTheDocument();
  });
});

describe('Styled Components', () => {
  it('renders StyledCard correctly', () => {
    const wrapper = render(<StyledCard />);
    expect(wrapper).toMatchSnapshot();
  });
  it('renders StyledCardContent correctly', () => {
    const wrapper = render(<StyledCardContent />);
    expect(wrapper).toMatchSnapshot();
  });
  it('renders StyledCardHeader correctly', () => {
    const wrapper = render(<StyledCardHeader />);
    expect(wrapper).toMatchSnapshot();
  });
  it('renders CardTitle correctly', () => {
    const wrapper = render(<CardTitle />);
    expect(wrapper).toMatchSnapshot();
  });
});
