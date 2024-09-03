import React from 'react';
import { render, screen } from '@testing-library/react';
import Modal from './index';
import {
  StyledContainer,
  StyledHeaderContainer,
  StyledHeading,
  StyledSubHeading,
  StyledCloseContainer,
  StyledHeadingImgContainer,
  StyledHeadingImg,
  StyledButtonContainer,
} from './styles';

jest.mock('../../assets/images/crossIcon.svg', () => 'crossIcon.svg');

describe('Modal Component', () => {
  it('renders without crashing', () => {
    render(<Modal />);
    expect(<Modal />).toMatchSnapshot();
  });
  test('Renders modal with heading and subheading (without data-testid)', () => {
    const mockOnClose = jest.fn();

    const rendered = render(
      <Modal
        heading="Test Heading"
        subHeading="Test Subheading"
        show
        onClose={mockOnClose}
      />,
    );

    const heading = screen.getByText('Test Heading');
    expect(heading).toBeInTheDocument();

    const subheading = screen.getByText('Test Subheading');
    expect(subheading).toBeInTheDocument();
    expect(rendered).toMatchSnapshot();
  });

  it('renders with heading image when provided', () => {
    const headingImgSrc = 'test-image.jpg';
    const { container } = render(<Modal headingImgSrc={headingImgSrc} show />);

    expect(container).toMatchSnapshot();
  });
});

describe('Styled Components', () => {
  it('renders StyledContainer correctly', () => {
    const wrapper = render(<StyledContainer />);
    expect(wrapper).toMatchSnapshot();
  });
  it('renders StyledHeaderContainer correctly', () => {
    const wrapper = render(<StyledHeaderContainer />);
    expect(wrapper).toMatchSnapshot();
  });
  it('renders StyledHeading correctly', () => {
    const wrapper = render(<StyledHeading />);
    expect(wrapper).toMatchSnapshot();
  });
  it('renders StyledSubHeading correctly', () => {
    const wrapper = render(<StyledSubHeading />);
    expect(wrapper).toMatchSnapshot();
  });
  it('renders StyledCloseContainer correctly', () => {
    const wrapper = render(<StyledCloseContainer />);
    expect(wrapper).toMatchSnapshot();
  });
  it('renders StyledHeadingImgContainer correctly', () => {
    const wrapper = render(<StyledHeadingImgContainer />);
    expect(wrapper).toMatchSnapshot();
  });
  it('renders StyledHeadingImg correctly', () => {
    const wrapper = render(<StyledHeadingImg />);
    expect(wrapper).toMatchSnapshot();
  });
  it('renders StyledButtonContainer correctly', () => {
    const wrapper = render(<StyledButtonContainer />);
    expect(wrapper).toMatchSnapshot();
  });
});
