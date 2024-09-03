import React from 'react';
import { render } from '@testing-library/react';
import CustomBarChart from '.';

describe('CustomBarChart component', () => {
  const data = [
    { name: 'A', value: 10 },
    { name: 'B', value: 20 },
    { name: 'C', value: 30 },
  ];

  describe('Rendering with different widths', () => {
    test('renders with default width', () => {
      const { container } = render(
        <CustomBarChart
          data={data}
          width={600}
          height={400}
          margin={{
            top: 20, right: 30, bottom: 20, left: 30,
          }}
          xAxisDataKey="name"
          yAxisDataKeys={['value']}
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    test('renders with narrow width', () => {
      const { container } = render(
        <CustomBarChart
          data={data}
          width={100}
          height={400}
          margin={{
            top: 20, right: 30, bottom: 20, left: 30,
          }}
          xAxisDataKey="name"
          yAxisDataKeys={['value']}
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    test('renders CustomBarChart component with narrow tick width', () => {
      const { container } = render(
        <CustomBarChart
          data={data}
          width={100}
          height={400}
          margin={{
            top: 20, right: 30, bottom: 20, left: 30,
          }}
          xAxisDataKey="name"
          yAxisDataKeys={['value']}
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Rendering with different color arrays', () => {
    test('renders with colors.length < 3', () => {
      const { container } = render(
        <CustomBarChart
          data={data}
          width={600}
          height={400}
          margin={{
            top: 20, right: 30, bottom: 20, left: 30,
          }}
          xAxisDataKey="name"
          yAxisDataKeys={['value']}
          colors={['#FF5733', '#33FF57']}
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    test('renders with colors.length >= 3', () => {
      const { container } = render(
        <CustomBarChart
          data={data}
          width={600}
          height={400}
          margin={{
            top: 20, right: 30, bottom: 20, left: 30,
          }}
          xAxisDataKey="name"
          yAxisDataKeys={['value']}
          colors={['#FF5733', '#33FF57', '#3357FF', '#FFFF33']}
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
