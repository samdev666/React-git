import { brandColour, greyScaleColour, otherColour } from '@wizehub/common/theme/style.palette';
import { fontSize, fontWeight } from '@wizehub/common/theme/style.typography';
import React, { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Dot,
  ResponsiveContainer,
  Text,
  TextProps,
} from 'recharts';

interface TickItem {
  value: string | number;
  coordinate: number;
}

type DomainMaxType = number | string;

interface PolarGridProps {
  /** A boolean value indicating whether to display radial lines */
  radialLines?: boolean;

  /** Additional props for configuring the radial lines */
  radialLinesProps?: object;

  /** The type of grid to be displayed */
  gridType?: 'polygon' | 'circle';

  /** The angle of the grid lines in degrees */
  gridAngle?: number;

  /** Additional props for configuring the grid lines */
  gridProps?: object;
}

interface PolarAngleAxisProps {
  /** The data key corresponding to the angle axis */
  dataKey?: string;

  /** The type of scale for the angle axis */
  scale?: 'auto' | 'linear' | 'pow' | 'sqrt' | 'log' | 'identity' | 'band' | 'point' | 'ordinal' | 'quantile' | 'quantize' | 'utc' | 'time' | 'sequential' | 'threshold';

  /** The minimum value of the axis domain */
  domainMin?: DomainMaxType;

  /** The maximum value of the axis domain */
  domainMax?: DomainMaxType;

  /** The ticks on the axis */
  ticks?: TickItem[];

  /** The size of the tick marks */
  tickSize?: number;

  /** The padding between the ticks and the axis */
  tickPadding?: number;

  /** The format of the tick values */
  tickFormatter?: (value: any, index: number) => string;

  /** The angle at which the axis is rotated in degrees */
  angle?: number;

  /** Additional props for configuring the axis line */
  axisLineProps?: object;

  /** Additional props for configuring the tick lines */
  tickLineProps?: object;

  /** Additional props for configuring the tick text */
  tickTextProps?: object;
}

interface PolarRadiusAxisProps {
  /** The data key corresponding to the radius axis */
  dataKey?: string;

  /** The type of scale for the radius axis */
  scale?: 'auto' | 'linear' | 'pow' | 'sqrt' | 'log' | 'identity';

  /** The minimum value of the axis domain */
  domainMin?: DomainMaxType;

  /** The maximum value of the axis domain */
  domainMax?: DomainMaxType;

  /** The ticks on the axis */
  ticks?: TickItem[];

  /** The size of the tick marks */
  tickSize?: number;

  /** The padding between the ticks and the axis */
  tickPadding?: number;

  /** The format of the tick values */
  tickFormatter?: (value: any, index: number) => string;

  /** The orientation of the axis */
  orientation?: 'left' | 'right' | 'middle';

  /** Additional props for configuring the axis line */
  axisLineProps?: object;

  /** Additional props for configuring the tick lines */
  tickLineProps?: object;

  /** Additional props for configuring the tick text */
  tickTextProps?: object;

  axisLine?: boolean

  tickLine?: boolean
  tick?: object
  stroke?: string
  tickMargin?: number
  angle?: number
  dx?: number
  dy?: number
}

interface DotProps {
  className?: string;
  cx?: number;
  cy?: number;
  r?: number;
  clipDot?: boolean;
}

/**
 * Props for CustomRadarChart component
 */
interface RadarChartProps {
  /** Data for rendering the radar chart */
  data: any;
  /** Width of the radar chart */
  width?: number;
  /** Height of the radar chart */
  height?: number;
  /** Outer radius of the radar chart */
  outerRadius?: number;
  /** X-coordinate of the center of the radar chart */
  cx?: number;
  /** Y-coordinate of the center of the radar chart */
  cy?: number;
  /** Data keys for rendering multiple radar components */
  dataKeys: string[];
  /** Fill opacity of the radar chart */
  fillOpacity?: number;
  /** Name of the radar component */
  name?: string;
  /** Stroke color of the radar component */
  stroke?: string;
  /** Stroke width of the radar component */
  strokeWidth?: number;
  /** Fill color of the radar component */
  fill?: string;
  /** Props for configuring the radius axis */
  radiusAxisProps?: PolarRadiusAxisProps;
  /** Props for configuring the angle axis */
  angleAxisProps?: PolarAngleAxisProps;
  /** Props for configuring the polar grid */
  polarGridProps?: PolarGridProps;
  dotProps?: DotProps;

  colors?: string[]
  strokeColors?: string[];
}

interface RenderPolarAngleAxisProps extends TextProps {
  payload: { value: string, index: number };
  x: number;
  y: number;
  cx: number;
  cy: number;
}

/**
 * Custom Radar Chart component
 * @param props Props for CustomRadarChart component
 */
const CustomRadarChart: React.FC<RadarChartProps> = ({
  data,
  width,
  height,
  outerRadius = 130,
  dataKeys,
  fillOpacity = 0.6,
  name = 'Data',
  stroke,
  strokeWidth = 2,
  radiusAxisProps,
  angleAxisProps,
  polarGridProps,
  dotProps,
  colors = [],
  fill,
  strokeColors = []
}) => {
  const [hoveredValueInfo, sethoveredValueInfo] = useState(null);

  const checkWidth = () => window.innerWidth <= 1700;

  const handleTruncateText = (text: string, length: number): string => {
    if (text && text.length > length) return `${text.substring(0, length)}...`;
    return text;
  };

  const onMouseEnter = (value: string, isSmall?: boolean): void => {
    if (value && value.length > (isSmall ? 3 : 15)) sethoveredValueInfo(value);
  };

  const onMouseLeave = () => sethoveredValueInfo(null);

  const renderPolarAngleAxis = ({ payload, x, y, cx, cy, ...rest }: RenderPolarAngleAxisProps) => {
    const angle = Math.atan2(y - cy, x - cx);
    const newX = cx + (x - cx) + 10 * Math.cos(angle);
    const newY = cy + (y - cy) + 10 * Math.sin(angle);
    const isHovered = hoveredValueInfo === payload.value;
    const isSmall = window.innerWidth <= 1499;
    const labelWidth = hoveredValueInfo?.length * (isSmall ? 5.6 : 8);
    const top = (payload.value === data?.[0]?.entity) ? newY + 20 : newY - 35;

    const left = x < cx ? newX : newX - labelWidth / 2;

    return (
      <>
        <Text
          {...rest}
          verticalAnchor="middle"
          y={newY}
          x={newX}
          style={{
            fill: greyScaleColour.grey100,
            fontSize: fontSize.b2,
            fontWeight: fontWeight.medium,
            cursor: hoveredValueInfo && 'pointer'
          }}
          onMouseEnter={() => checkWidth() && onMouseEnter(payload.value, isSmall)}
          onMouseLeave={() => checkWidth() && onMouseLeave()}
        >
          {checkWidth()
            ? handleTruncateText(payload.value, isSmall ? 3 : 15)
            : payload.value}
        </Text>
        {(isHovered) && <g>
          <rect
            x={left - 10}
            y={top}
            width={labelWidth}
            height={isSmall ? 18 : 24}
            rx={5}
            ry={5}
            visibility="visible"
            fill={greyScaleColour.secondaryMain}
          />
          <text
            x={left - 10 + labelWidth / 2}
            y={isSmall ? (top + 12) : (top + 17)}
            textAnchor="middle"
            fill={greyScaleColour.grey90}
            fontSize={isSmall ? "10" : "12"}
            visibility="visible"
          >
            {hoveredValueInfo}
          </text>
        </g>}
      </>
    );
  }

  const maxValue = Math.max(...data.map(item => item.totalScore));
  const tickCount = Math.ceil(maxValue / 2) + 1;

  return (
    <ResponsiveContainer width={width || "100%"} height={height}>
      <RadarChart
        cx={width / 2}
        cy={height / 2}
        outerRadius={outerRadius}
        width={width}
        height={height}
        data={data}
      >
        <PolarGrid {...polarGridProps} stroke={brandColour.primary70} />

        <PolarRadiusAxis
          {...radiusAxisProps}
          domain={[0, maxValue]}
          tickCount={tickCount}
          axisLine={false}
          tick={false}
        />

        {dataKeys
          ? dataKeys.map((key, index) => (
            <Radar
              key={key}
              name={key}
              dataKey={key}
              stroke={strokeColors.length > 0 ? strokeColors[index] : stroke}
              strokeWidth={strokeWidth}
              fill={colors.length > 0 ? colors[index] : fill}
              fillOpacity={fillOpacity}
              dot={<Dot {...dotProps} stroke={otherColour.turquoise} fill={otherColour.turquoise} />}
            />
          )) : null}
        <PolarAngleAxis
          {...angleAxisProps}
          tick={props => renderPolarAngleAxis(props)}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export default CustomRadarChart;
