import { greyScaleColour, otherColour } from '@wizehub/common/theme/style.palette';
import React, { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { fontSize, fontWeight } from '@wizehub/common/theme/style.typography';

interface LineChartProps {
    data: {
        name: string;
        [key: string | number]: number | string;
    }[];
    width?: number;
    height?: number;
    margin?: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };
    xAxisDataKey: string;
    yAxisDataKeys: string[] | number[];
    xAxisScale?: 'linear' | 'category' | 'log' | 'pow' | 'sqrt' | 'time' | 'band' | 'point' | 'identity' | 'ordinal' | 'quantile' | 'quantize' | 'utcTime' | 'sequential' | 'threshold';
    xAxisPadding?: { left?: number; right?: number };
    yAxisPadding?: { top?: number; bottom?: number };
    gridStrokeDasharray?: string;
    tooltip?: boolean;
    legend?: boolean;
    colors?: string[];
    tickCount?: number;
    updateLegend?: (legend: React.SetStateAction<any[]>) => void
}

const CustomLineChart: React.FC<LineChartProps> = ({
    data,
    width,
    height,
    margin = { top: 0, right: 0, left: 0, bottom: 0 },
    xAxisDataKey = 'name',
    yAxisDataKeys = [],
    xAxisScale = 'point',
    xAxisPadding = {},
    yAxisPadding = { top: 10, bottom: 20 },
    gridStrokeDasharray = '3 3',
    tooltip = false,
    legend = false,
    colors = [],
    tickCount = 5,
    updateLegend
}) => {
    const [legendData, setLegendData] = useState([]);

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

    const customAxis = (
        x: number,
        y: number,
        payload: any) => (
        <g transform={`translate(${x},${y})`}>
            <text
                x={0}
                y={0}
                textAnchor='middle'
                // dy={calculateDy(payload.index)}
                style={{
                    fontSize: fontSize.b2,
                    fontWeight: fontWeight.medium,
                    fill: greyScaleColour.grey90,
                }}
            >
                {payload.value}
            </text>
        </g>
    );

    // Customized axis tick component
    const CustomizedAxisTick = (props: { x: number; y: number; payload: any; }) => {
        const { x, y, payload } = props;
        return (
            customAxis(x, y, payload)
        );
    };


    useEffect(() => {
        if (legendData.length > 0) {
            updateLegend(legendData);
        }
    }, [legendData, updateLegend]);

    const renderCustomLegend = (props: { payload: any; }): null => {
        const { payload } = props;
        const newLegendData = payload.map((entry: any) => ({
            value: entry.value,
            color: entry.color,
        }));

        if (JSON.stringify(newLegendData) !== JSON.stringify(legendData)) {
            setLegendData(newLegendData);
        }

        return null;
    };

    return (
        <ResponsiveContainer width={width || '100%'} height={height}>
            <LineChart
                width={width}
                height={height}
                data={data}
                margin={margin}
                barCategoryGap={10}
            >
                <CartesianGrid stroke={otherColour.sidebar} vertical={false} />
                <XAxis
                    dataKey={xAxisDataKey}
                    scale={'point'}
                    padding={xAxisPadding}
                    tick={(props) => <CustomizedAxisTick {...props} />}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                />
                <YAxis
                    padding={yAxisPadding}
                    axisLine={false}
                    tick={{
                        style: {
                            fontSize: fontSize.b2,
                            fontWeight: fontWeight.medium,
                            fill: greyScaleColour.grey90
                        }
                    }}
                    tickLine={false}
                    tickMargin={20}
                    tickCount={tickCount}
                />
                {tooltip && <Tooltip />}
                <Legend content={renderCustomLegend} />
                {yAxisDataKeys.map((key, index) => (
                    <Line
                        key={key}
                        type="linear"
                        dataKey={key}
                        stroke={colors[index % colors.length]}
                        strokeWidth={2}
                        dot={false}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};

export default CustomLineChart;