import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  StyledBarChartTooltipArrow,
  StyledBarChartTooltipContainer,
  StyledBarChartTooltipContent,
  StyledBarChartTooltipContentContainer,
  StyledXAxisText,
} from "./styles";
import {
  brandColour,
  greyScaleColour,
  otherColour,
} from "@wizehub/common/theme/style.palette";
import { fontSize, fontWeight } from "@wizehub/common/theme/style.typography";
import React, { useRef, useState } from "react";

/**
 * Props for CustomBarChart component
 */
interface BarChartProps {
  /** Data for rendering the chart */
  data: {
    name: string;
    [key: string]: number | string;
  }[];
  /** Width of the chart */
  width?: number;
  /** Height of the chart */
  height?: number;
  /** Margin of the chart */
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  /** Size of each bar in the chart */
  barSize?: number;
  /** Data key for X-axis */
  xAxisDataKey: string;
  /** Data keys for Y-axis */
  yAxisDataKeys: string[];
  /** Scale for X-axis */
  xAxisScale?: any;
  /** Padding for X-axis */
  xAxisPadding?: { left?: number; right?: number };
  /** Padding for Y-axis */
  yAxisPadding?: { top?: number; bottom?: number };
  /** Stroke dash array for grid lines */
  gridStrokeDasharray?: string;
  /** Enable tooltip */
  tooltip?: boolean;
  /** Enable legend */
  legend?: boolean;
  /** Colors for bars */
  colors?: string[];
  /** Array for stacking bars */
  stackArray?: string[];
  barRadius?: number | [number, number, number, number];
  hoverColor?: string;
  customTooltip?: (props: any) => React.JSX.Element;
  xAxisTickMargin?: number;
  yAxisTickMargin?: number;
  xAxisTickCount?: number;
  yAxisTickCount?: number;
  legendAlignment?: "top" | "bottom" | "middle";
  customLegend?: (props: any) => React.JSX.Element;
  /** Labels for special ticks */
  specialTicks?: string[];
  /** Colors for special ticks */
  specialTickColors?: string[];
  domain?: number[];
}

/**
 * Custom Bar Chart component
 * @param props Props for CustomBarChart component
 */
const CustomBarChart: React.FC<BarChartProps> = ({
  data,
  width,
  height,
  margin = {
    top: 0,
    right: 30,
    left: 20,
    bottom: 10,
  },
  barSize = 40,
  xAxisDataKey = "name",
  yAxisDataKeys = [],
  xAxisScale = "point",
  xAxisPadding = {},
  yAxisPadding = {},
  gridStrokeDasharray = "3 3",
  tooltip = false,
  legend = false,
  colors = [],
  stackArray = [],
  barRadius = 5,
  hoverColor,
  customTooltip: CustomTooltipComponent,
  legendAlignment = "top",
  customLegend: CustomLegendComponent,
  specialTicks = [],
  specialTickColors = [],
  ...props
}) => {
  const [activeBarIndex, setActiveBarIndex] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Function to calculate dy for X-axis ticks
  const calculateDy = (index: number) => {
    const tickWidth = width / data.length;
    const thresholdWidthForOverlap = 50;
    const defaultDy = 10;

    if (tickWidth < thresholdWidthForOverlap) {
      return index % 2 === 0 ? 25 : 10;
    }

    return defaultDy;
  };

  const customAxis = (x: number, y: number, payload: any) => {
    const tickIndex = specialTicks.indexOf(payload.value);
    const isSpecialTick = tickIndex !== -1;
    const tickColor =
      isSpecialTick && specialTickColors[tickIndex]
        ? specialTickColors[tickIndex]
        : "black";
    const tickStyle = isSpecialTick
      ? { fill: tickColor, fontWeight: "bold" }
      : { fill: "black" };

    return (
      <g transform={`translate(${x},${y})`}>
        <StyledXAxisText
          x={0}
          y={0}
          dy={calculateDy(payload.index)}
          style={tickStyle}
        >
          {payload.value}
        </StyledXAxisText>
      </g>
    );
  };

  // Customized axis tick component
  const CustomizedAxisTick = (props: any) => {
    const { x, y, payload } = props;
    return customAxis(x, y, payload);
  };

  const secureRandomNumber = () => {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0];
  };

  const predefinedColors = [brandColour.primaryMain];

  let barColors: string[];
  if (colors.length >= 3) {
    barColors = colors.slice(0, 3);
  } else {
    barColors = Array.from({ length: yAxisDataKeys.length }, (_, index) => {
      const randomIndex = secureRandomNumber() % predefinedColors.length;
      return predefinedColors[randomIndex];
    });
  }

  const customMouseOver = (e: Record<string, any>, dataIndex: number) => {
    setActiveBarIndex(dataIndex);
    setTooltipPosition({ x: e.x - 45 + barSize / 2, y: e.y - 55 });
  };

  const customMouseLeave = () => {
    setActiveBarIndex(null);
    setTooltipPosition(null);
  };

  const CustomTooltip = (props: any) => {
    const { active, payload } = props;
    if (active && payload?.length && activeBarIndex !== null) {
      return (
        <StyledBarChartTooltipContainer>
          <StyledBarChartTooltipContentContainer>
            <StyledBarChartTooltipContent>
              {payload?.[0]?.value}
            </StyledBarChartTooltipContent>
          </StyledBarChartTooltipContentContainer>
          <StyledBarChartTooltipArrow />
        </StyledBarChartTooltipContainer>
      );
    }
  };

  return (
    <>
      <ResponsiveContainer width={width || "90%"} height={height} style={{paddingLeft: '20px', paddingRight: '20px'}}>
        <BarChart
          width={width}
          height={height}
          data={data}
          margin={margin}
          barSize={barSize}
        >
          <XAxis
            dataKey={xAxisDataKey}
            scale={xAxisScale}
            padding={xAxisPadding}
            tick={(props: any) => <CustomizedAxisTick {...props} />}
            axisLine={false}
            tickLine={false}
            interval={0}
            tickMargin={props?.xAxisTickMargin}
          />
          <YAxis
            padding={yAxisPadding}
            axisLine={false}
            tick={{
              style: {
                fontSize: fontSize.b2,
                fontWeight: fontWeight.medium,
                fill: greyScaleColour.grey90,
              },
            }}
            tickLine={false}
            tickMargin={props?.yAxisTickMargin}
            interval={0}
            tickCount={props?.yAxisTickCount}
            domain={props?.domain}
          />
          {tooltip && (
            <Tooltip
              content={
                CustomTooltipComponent && activeBarIndex != null ? (
                  <CustomTooltipComponent />
                ) : (
                  <CustomTooltip />
                )
              }
              position={{ x: tooltipPosition?.x, y: tooltipPosition?.y }}
              cursor={false}
            />
          )}
          {legend && (
            <Legend
              verticalAlign={legendAlignment}
              content={CustomLegendComponent && <CustomLegendComponent />}
            />
          )}
          <CartesianGrid stroke={otherColour.sidebar} vertical={false} />
          {yAxisDataKeys?.map((key, keysIndex) => (
            <Bar
              key={key}
              dataKey={key}
              radius={barRadius}
              stackId={
                stackArray[keysIndex] !== "" ? stackArray[keysIndex] : undefined
              }
              onMouseEnter={(data, dataIndex) => {
                customMouseOver(data, dataIndex);
              }}
              onMouseLeave={customMouseLeave}
            >
             {data?.map((entry, index) => {
                const tickIndex = specialTicks.indexOf(entry[xAxisDataKey]?.toString());
                const cellColor =
                  tickIndex !== -1 && specialTickColors[tickIndex]
                    ? specialTickColors[tickIndex]
                    : barColors[index % barColors.length];
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      (activeBarIndex !== null && activeBarIndex === index) && hoverColor
                        ? hoverColor
                        : cellColor
                    }
                    style={{
                      cursor: "pointer",
                    }}
                  />
                );
              })}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default CustomBarChart;