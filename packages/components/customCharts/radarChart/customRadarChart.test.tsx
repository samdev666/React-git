import React from 'react';
import { render } from '@testing-library/react';
import CustomRadarChart from '.';

describe('CustomRadarChart component', () => {
  const data = [
    {
      subject: 'Math', A: 120, B: 110, fullMark: 150,
    },
    {
      subject: 'Chinese', A: 98, B: 130, fullMark: 150,
    },
    {
      subject: 'English', A: 86, B: 130, fullMark: 150,
    },
    {
      subject: 'Geography', A: 99, B: 100, fullMark: 150,
    },
    {
      subject: 'Physics', A: 85, B: 90, fullMark: 150,
    },
    {
      subject: 'History', A: 65, B: 85, fullMark: 150,
    },
  ];

  test('renders CustomRadarChart component correctly', () => {
    const { container } = render(
      <CustomRadarChart
        data={data}
        width={400}
        height={400}
        outerRadius={150}
        cx={200}
        cy={200}
        dataKeys={['A', 'B']}
        fillOpacity={0.6}
        name="Data"
        stroke="red"
        strokeWidth={2}
        colors={['blue', 'green']}
        strokeColors={['orange', 'purple']}
        radiusAxisProps={{
          dataKey: 'fullMark',
          scale: 'linear',
          domainMin: 0,
          domainMax: 150,
          orientation: 'middle',
          axisLine: true,
          tickLine: true,
          tickMargin: 10,
          stroke: 'black',
        }}
        angleAxisProps={{
          dataKey: 'subject',
          scale: 'auto',
          domainMin: 'auto',
          domainMax: 'auto',
          tickSize: 20,
          tickPadding: 5,
          angle: 30,
        }}
        polarGridProps={{
          radialLines: true,
          radialLinesProps: { stroke: 'gray', strokeWidth: 1, strokeDasharray: '4 4' },
          gridType: 'circle',
          gridAngle: 30,
          gridProps: { stroke: 'lightgray', strokeWidth: 1 },
        }}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
