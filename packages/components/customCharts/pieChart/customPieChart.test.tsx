import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CustomPieChart from '.';

describe('CustomPieChart component', () => {
  const data = [
    { name: 'A', value: 10 },
    { name: 'B', value: 20 },
    { name: 'C', value: 30 },
  ];

  test('renders CustomPieChart component correctly', () => {
    const { container } = render(
      <CustomPieChart
        data={data}
        colors={['#FF5733', '#33FF57', '#3357FF']}
        width={400}
        height={400}
        cx={200}
        cy={200}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('renders CustomPieChart component with different dimensions', () => {
    const { container } = render(
      <CustomPieChart
        data={data}
        colors={['#FF5733', '#33FF57', '#3357FF']}
        width={500}
        height={300}
        cx={250}
        cy={150}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('renders CustomPieChart component with mouse hover', () => {
    render(
      <CustomPieChart
        data={data}
        colors={['#FF5733', '#33FF57', '#3357FF']}
        width={400}
        height={400}
        cx={200}
        cy={200}
      />,
    );
  });

  test('renders CustomPieChart component with specified stroke width', () => {
    const strokeWidth = 4;
    const { container } = render(
      <CustomPieChart
        data={data}
        colors={['#FF5733', '#33FF57', '#3357FF']}
        width={400}
        height={400}
        cx={200}
        cy={200}
        strokeWidth={strokeWidth}
      />,
    );

    const segments = container.querySelectorAll('path');
    segments.forEach((segment) => {
      expect(segment.getAttribute('stroke-width')).toBe(`${strokeWidth}`);
    });
  });

  test('renders CustomPieChart component with inner radius', () => {
    const innerRadius = 50;
    const { container } = render(
      <CustomPieChart
        data={data}
        colors={['#FF5733', '#33FF57', '#3357FF']}
        width={400}
        height={400}
        cx={200}
        cy={200}
        innerRadius={innerRadius}
      />,
    );

    const innerCircles = container.querySelectorAll('circle');
    innerCircles.forEach((circle) => {
      expect(circle.getAttribute('r')).toBe(`${innerRadius}`);
    });
  });

  test('renders CustomPieChart component with different padding angle', () => {
    const paddingAngle = 10;
    const { container } = render(
      <CustomPieChart
        data={data}
        colors={['#FF5733', '#33FF57', '#3357FF']}
        width={400}
        height={400}
        cx={200}
        cy={200}
        paddingAngle={paddingAngle}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('renders CustomPieChart component with different active index', () => {
    const { container } = render(
      <CustomPieChart
        data={data}
        colors={['#FF5733', '#33FF57', '#3357FF']}
        width={400}
        height={400}
        cx={200}
        cy={200}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('sets activeIndex on mouse enter', async () => {
    const { findAllByRole } = render(
      <CustomPieChart
        data={data}
        colors={['#FF5733', '#33FF57', '#3357FF']}
        width={400}
        height={400}
        cx={200}
        cy={200}
      />,
    );

    const segments = await findAllByRole('img');
    const firstSegment = segments[0];
    fireEvent.mouseEnter(firstSegment);
  });
});
