import React, { useState, useCallback } from 'react';
import {
  PieChart, Pie, Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { Grid, Typography } from '@mui/material';
import { StyledDot, StyledLegendContainer, StyledContentContainer, StyledLegendText, StyledTooltipContainer, StyledTooltipText } from './styles';
import { stringTrimWithNumberOfCharacters } from '@wizehub/common/utils';

interface ChartEntry {
  name: string;
  value: number;
}

interface PieChartProps {
  /** Data for the pie chart */
  data: ChartEntry[];
  /** Colors for each segment of the pie chart */
  colors: string[];
  /** Width of the pie chart */
  width?: number;
  /** Height of the pie chart */
  height?: number;
  /** X-coordinate of the center of the pie chart */
  cx?: number;
  /** Y-coordinate of the center of the pie chart */
  cy?: number;
  /** Inner radius of the pie chart */
  innerRadius?: number;
  /** Outer radius of the pie chart */
  outerRadius?: number;
  /** Angle between sectors in degrees */
  paddingAngle?: number;
  /** Stroke width of the pie chart */
  strokeWidth?: number;
  totalValue?: number;
  cornerRadius?: number;
  customTooltip?: (props: any) => React.JSX.Element;
  customLegend?: (props: any) => React.JSX.Element;
}

const CustomPieChart: React.FC<PieChartProps> = ({
  data,
  colors: COLORS,
  width,
  height,
  cx = width / 2,
  cy = height / 2,
  innerRadius = 70,
  outerRadius = 130,
  paddingAngle = 4,
  strokeWidth = 2,
  cornerRadius,
  totalValue,
  customTooltip: CustomTooltipComponent,
  customLegend: CustomLegendComponent,
}) => {
  const [activeIndex, setActiveIndex] = useState(-1);

  const onPieEnter = useCallback((_: any, index: number) => {
    setActiveIndex(index);
  }, []);

  const onPieLeave = useCallback(() => {
    setActiveIndex(-1);
  }, []);

  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.35;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#fff"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="10px"
        data-testID={`text-${index}`}
      >
        {radius > 30 && `${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  const CustomizedLegend = (props: any) => {
    const { payload } = props;
    return (
      <StyledLegendContainer>
        {
          payload.map((entry: any, index: number) => (
            <StyledContentContainer container>
              <Grid item>
                <StyledDot
                  backgroundColor={COLORS[index % COLORS.length]}
                />
              </Grid>
              <Grid item>
                <StyledLegendText>
                  {stringTrimWithNumberOfCharacters(entry.value, 13)}
                </StyledLegendText>
              </Grid>
            </StyledContentContainer>
          ))
        }
      </StyledLegendContainer>
    );
  };

  const total = totalValue || data.reduce((acc, entry) => acc + entry.value, 0);

  const CustomizedTooltip = (props: any) => {
    const { payload, active } = props;
    if (active && payload && payload.length) {
      return (
        <foreignObject>
          <StyledTooltipContainer>
            <StyledContentContainer container>
              <Grid item>
                <StyledDot
                  backgroundColor={payload[0].payload.fill}
                />
              </Grid>
              <Grid item>
                <StyledTooltipText>
                  {`${(payload[0].value / total * 100).toFixed(0)}%`}
                </StyledTooltipText>
              </Grid>
            </StyledContentContainer>
          </StyledTooltipContainer>
        </foreignObject>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width={width || "100%"} height={height}>
      <PieChart>
        <Pie
          labelLine={false}
          // label={renderCustomizedLabel}
          activeIndex={activeIndex}
          data={data}
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={paddingAngle}
          dataKey="value"
          cornerRadius={cornerRadius}
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieLeave}
          style={{ cursor: 'pointer' }}
        >
          {data.map((entry, index) => (
            <Cell
              // eslint-disable-next-line react/no-array-index-key
              key={`cell-${entry?.name}`}
              fill={COLORS[index % COLORS.length]}
              strokeWidth={strokeWidth}
            />
          ))}
        </Pie>
        <Tooltip
          content={CustomTooltipComponent ? <CustomTooltipComponent total={total} /> : <CustomizedTooltip />}
        />
        <Legend layout="vertical" verticalAlign='middle' align='right'
          content={CustomLegendComponent ? <CustomLegendComponent /> : <CustomizedLegend />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
