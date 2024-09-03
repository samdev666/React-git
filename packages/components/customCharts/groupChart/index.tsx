import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { ChartContainer, TooltipContainer, TooltipText,RenderText } from "./style";
import { greyScaleColour } from "@wizehub/common/theme/style.palette";
import { fontSize, fontWeight } from "@wizehub/common/theme/style.typography";
import { Payload } from "recharts/types/component/DefaultLegendContent";

interface Rechart {
  name: string;
  [key: string]: number | string;
}

interface GroupChartProps {
  data: Rechart[];
  barConfig: Array<{
    name: string;
    color: string;
  }>;
  xAxisDataKey?: string;
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const renderTooltipContent = (data: Payload) => {
  const entries = Object.entries(data);
  return entries.map(([key, value]) => (
    <RenderText key={key}>
      <strong>{`${key.charAt(0).toUpperCase() + key.slice(1)}:`}</strong> {value}
    </RenderText>
  ));
};

export const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload; 
    return (
      <TooltipContainer>
        {renderTooltipContent(data)}
      </TooltipContainer>
    );
  }
  return null;
};

const CustomGroupChart: React.FC<GroupChartProps> = ({
  data,
  barConfig,
  xAxisDataKey = "name",
  margin = {
    top: 20,
    right: 20,
    left: 20,
    bottom: 10,
  },
}) => {
  const [tooltipActive, setTooltipActive] = useState<boolean>(false);

  const handleTooltipEnter = () => {
    setTooltipActive(true);
  };

  const handleTooltipLeave = () => {
    setTooltipActive(false);
  };
  return (
    <ChartContainer>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={margin}>
          <CartesianGrid vertical={false} stroke={greyScaleColour.grey60} />
          <XAxis
            dataKey={xAxisDataKey}
            tick={{
              style: {
                fontSize: fontSize.b2,
                fontWeight: fontWeight.medium,
                fill: greyScaleColour.grey90,
              },
            }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{
              style: {
                fontSize: fontSize.b2,
                fontWeight: fontWeight.medium,
                fill: greyScaleColour.grey90,
              },
            }}
            axisLine={false}
            tickLine={false}
          />
          <ReferenceLine y={0} stroke={greyScaleColour.grey90} />
          <Tooltip
            content={<CustomTooltip payload={data} />}
            active={tooltipActive}
            cursor={false}
            // position={{ y: 0 }}
            // wrapperStyle={{ top: -40 }}
          />
          {barConfig?.map((config) => {
            return (
              <Bar
                dataKey={config?.name}
                key={config?.name}
                fill={config?.color}
                radius={[25, 25, 0, 0]}
                onMouseEnter={handleTooltipEnter}
                onMouseLeave={handleTooltipLeave}
              />
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default CustomGroupChart;
