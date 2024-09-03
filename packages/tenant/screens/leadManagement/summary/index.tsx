import { Card, CustomBarChart, CustomPieChart } from "@wizehub/components";
import React, { useEffect, useState } from "react";
import {
    StyledBoxContainer,
    StyledChartItem,
    StyledHeadingItem,
    StyledHeadingText,
    StyledItemContainer,
    StyledMainContainer,
    StyledSubBoxContainer
} from "../../businessScorecards/discoveryDashboard/styles";
import { Divider, Grid } from "@mui/material";
import { apiCall, hideLoader, showLoader } from "../../../redux/actions";
import { useDispatch } from "react-redux";
import { formatCurrency, HttpMethods } from "@wizehub/common/utils";
import {
    LEAD_INDUSTRIES_DATA,
    LEAD_PROSPECT_CONVERSION_DATA,
    LEAD_SOURCES_DATA,
    PROSPECT_CLIENT_CONVERSION_DATA
} from "../../../api";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import {
    StyledBarChartTooltipArrow,
    StyledBarChartTooltipContainer,
    StyledBarChartTooltipContent,
    StyledBarChartTooltipContentContainer
} from "@wizehub/components/customCharts/barChart/styles";
import {
    StyledContentContainer,
    StyledDot,
    StyledTooltipContainer,
    StyledTooltipText
} from "@wizehub/components/customCharts/pieChart/styles";
import messages from "../../../messages";
import {
    StyledFiberManualRecordOutlinedIcon,
    StyledLegendDot,
    StyledLegendMainContainer,
    StyledLegendSubContainer,
    StyledLegentContent,
    StyledSubHeadingText
} from "./styles";

interface Props {

}

export const BarTooltipComponent = ({ value }: { value: number }) => (
    <StyledBarChartTooltipContainer>
        <StyledBarChartTooltipContentContainer>
            <StyledBarChartTooltipContent>
                {`${value?.toFixed(2)}%`}
            </StyledBarChartTooltipContent>
        </StyledBarChartTooltipContentContainer>
        <StyledBarChartTooltipArrow />
    </StyledBarChartTooltipContainer>
);

export const PieTooltipComponent = (data: any) => {
    const dataValue = data?.payload?.[0];
    return (
        <StyledTooltipContainer>
            <StyledContentContainer container>
                <Grid item>
                    <StyledDot
                        backgroundColor={dataValue?.payload?.fill}
                    />
                </Grid>
                <Grid item>
                    <Grid container display={"flex"} flexDirection={"column"}>
                        <Grid item>
                            <StyledTooltipText>
                                {dataValue?.name}
                            </StyledTooltipText>
                        </Grid>
                        <Grid item>
                            <StyledTooltipText>
                                {`${formatCurrency(dataValue?.value, data?.currency)} (${(dataValue?.value / data?.total * 100).toFixed(2)}%)`}
                            </StyledTooltipText>
                        </Grid>
                    </Grid>
                </Grid>
            </StyledContentContainer>
        </StyledTooltipContainer>
    )
}

const Summary: React.FC<Props> = () => {
    const reduxDispatch = useDispatch();
    const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
    const [dataCount, setDataCount] = useState({
        leadsCount: 0,
        prospectsCount: 0,
        clientCount: 0,
    })
    const [chartData, setChartData] = useState({
        leadToProspectConversionData: [],
        prospectToClientConversionData: [],
        leadIndustriesDataByValue: [],
        leadIndustriesDataByQuantity: [],
        leadSourcesDataByValue: [],
        leadSourcesDataByQuantity: []
    })


    const getLeadProspectConversionData = async () => {
        return (
            new Promise((resolve, reject) => {
                reduxDispatch(
                    apiCall(
                        LEAD_PROSPECT_CONVERSION_DATA.replace(':tenantId', tenantId),
                        resolve,
                        reject,
                        HttpMethods.GET
                    )
                );
            })
                .then((res: any) => {
                    const filteredData = res?.filter((ele: any) => ele?.clientMangerDetails?.id !== null);
                    setDataCount(prevState => ({
                        ...prevState,
                        leadsCount: filteredData?.reduce(
                            (sum: number, item: any) => {
                                return sum + (item.leadCount || 0);
                            }, 0),
                        prospectsCount: filteredData?.reduce(
                            (sum: number, item: any) => {
                                return sum + (item.prospectCount || 0);
                            }, 0),
                    }))
                    const data = filteredData?.map((ele: any) => {
                        return {
                            name: `${ele?.clientMangerDetails?.firstName} ${ele?.clientMangerDetails?.lastName}`,
                            value: (ele?.prospectCount / ele?.leadCount) * 100
                        }
                    });

                    setChartData((prevState: any) => ({
                        ...prevState,
                        leadToProspectConversionData: data,
                    }))
                })
                .catch((error) => {
                    console.log(error, "error");
                })
        )
    }

    const getProspectClientConversionData = async () => {
        return (
            new Promise((resolve, reject) => {
                reduxDispatch(
                    apiCall(
                        PROSPECT_CLIENT_CONVERSION_DATA.replace(':tenantId', tenantId),
                        resolve,
                        reject,
                        HttpMethods.GET
                    )
                );
            })
                .then((res: any) => {
                    const filteredData = res?.filter((ele: any) => ele?.clientMangerDetails?.id !== null);
                    setDataCount(prevState => ({
                        ...prevState,
                        prospectsCount: filteredData?.reduce(
                            (sum: number, item: any) => {
                                return sum + (item.prospectCount || 0);
                            }, 0),
                        clientCount: filteredData?.reduce(
                            (sum: number, item: any) => {
                                return sum + (item.clientCount || 0);
                            }, 0),
                    }))
                    const data = res
                        ?.filter((ele: any) => ele?.clientMangerDetails?.id !== null)
                        ?.map((ele: any) => {
                            return {
                                name: `${ele?.clientMangerDetails?.firstName} ${ele?.clientMangerDetails?.lastName}`,
                                value: (ele?.clientCount / ele?.prospectCount) * 100
                            }
                        });

                    setChartData((prevState: any) => ({
                        ...prevState,
                        prospectToClientConversionData: data,
                    }))
                })
                .catch((error) => {
                    console.log(error, "error");
                })
        )
    }

    const getLeadIndustriesData = async () => {
        return (
            new Promise((resolve, reject) => {
                reduxDispatch(
                    apiCall(
                        LEAD_INDUSTRIES_DATA.replace(':tenantId', tenantId),
                        resolve,
                        reject,
                        HttpMethods.GET
                    )
                );
            })
                .then((res: any) => {
                    const valueData = res
                        ?.filter((ele: any) => ele?.leadIndustry?.id !== null)
                        ?.map((ele: any) => {
                            return {
                                name: ele?.leadIndustry?.name,
                                value: ele?.totalAnnualFee
                            }
                        });

                    const quantityData = res
                        ?.filter((ele: any) => ele?.leadIndustry?.id !== null)
                        ?.map((ele: any) => {
                            return {
                                name: ele?.leadIndustry?.name,
                                value: ele?.clientCount
                            }
                        });

                    setChartData((prevState: any) => ({
                        ...prevState,
                        leadIndustriesDataByValue: valueData,
                        leadIndustriesDataByQuantity: quantityData,
                    }))
                })
                .catch((error) => {
                    console.log(error, "error");
                })
        )
    }

    const getLeadSourcesData = async () => {
        return (
            new Promise((resolve, reject) => {
                reduxDispatch(
                    apiCall(
                        LEAD_SOURCES_DATA.replace(':tenantId', tenantId),
                        resolve,
                        reject,
                        HttpMethods.GET
                    )
                );
            })
                .then((res: any) => {
                    const valueData = res
                        ?.filter((ele: any) => ele?.leadSource?.id !== null)
                        ?.map((ele: any) => {
                            return {
                                name: ele?.leadSource?.name,
                                value: ele?.totalAnnualFee
                            }
                        });

                    const quantityData = res
                        ?.filter((ele: any) => ele?.leadSource?.id !== null)
                        ?.map((ele: any) => {
                            return {
                                name: ele?.leadSource?.name,
                                value: ele?.clientCount
                            }
                        });

                    setChartData((prevState: any) => ({
                        ...prevState,
                        leadSourcesDataByValue: valueData,
                        leadSourcesDataByQuantity: quantityData,
                    }))
                })
                .catch((error) => {
                    console.log(error, "error");
                })
        )
    }

    useEffect(() => {
        reduxDispatch(showLoader());
        setTimeout(() => {
            reduxDispatch(hideLoader());
        }, 800);
        getLeadProspectConversionData();
        getProspectClientConversionData();
        getLeadIndustriesData();
        getLeadSourcesData();
    }, []);

    const COLORS1 = ['#C686F8', '#45D0EE', '#E8F886', '#8571F4'];

    const COLORS2 = ['#C686F8', '#45D0EE', '#86F898', '#8571F4', '#EFF886', '#F88686'];

    const BarLegendComponent = (data: { text: string, total: number, converted: number }) => {
        const { text, total, converted } = data;
        return (
            <StyledLegendMainContainer container>
                <Grid item>
                    <StyledLegendSubContainer container>
                        <Grid item>
                            <StyledLegendDot />
                        </Grid>
                        <Grid item>
                            <StyledLegentContent>
                                {`${text} (${total})`}
                            </StyledLegentContent>
                        </Grid>
                    </StyledLegendSubContainer>
                </Grid>
                <Grid item>
                    <StyledLegendSubContainer container>
                        <Grid item>
                            <StyledLegendDot />
                        </Grid>
                        <Grid item>
                            <StyledLegentContent>
                                {`${messages?.leadManagement?.summary?.totalConverted} ${converted} (${converted || total ? ((converted / total) * 100).toFixed(2) : '0'}%)`}
                            </StyledLegentContent>
                        </Grid>
                    </StyledLegendSubContainer>
                </Grid>
            </StyledLegendMainContainer>
        )
    };

    return (
        <Card
            noHeader
            cardCss={{
                margin: '0 20px',
                border: 'none',
                overflow: 'visible !important'
            }}
        >
            <StyledMainContainer gap="10px">
                <StyledBoxContainer gap={'10px'}>
                    <StyledSubBoxContainer>
                        <StyledItemContainer container>
                            <StyledHeadingItem item>
                                <Grid container display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                                    <Grid item>
                                        <StyledHeadingText>
                                            {messages?.leadManagement?.summary?.leadProspectConversion}
                                        </StyledHeadingText>
                                    </Grid>
                                    <Grid item>
                                        <Grid container display={"flex"} gap="6px" alignItems={"center"}>
                                            <Grid item display={"flex"} alignItems={"center"}>
                                                <StyledFiberManualRecordOutlinedIcon />
                                            </Grid>
                                            <Grid item display={"flex"} alignItems={"center"}>
                                                <StyledSubHeadingText>
                                                    {messages?.leadManagement?.summary?.conversionLevel}
                                                </StyledSubHeadingText>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </StyledHeadingItem>
                            <Grid item>
                                <Divider />
                            </Grid>
                            <StyledChartItem item>
                                <CustomBarChart
                                    data={chartData.leadToProspectConversionData}
                                    xAxisDataKey='name'
                                    yAxisDataKeys={['value']}
                                    tooltip={true}
                                    barSize={60}
                                    colors={['#0088FE']}
                                    xAxisPadding={{ left: 40, right: 40 }}
                                    yAxisPadding={{ top: 20 }}
                                    height={400}
                                    barRadius={[20, 20, 0, 0]}
                                    xAxisTickMargin={10}
                                    yAxisTickMargin={50}
                                    yAxisTickCount={11}
                                    domain={[0,100]}
                                    xAxisScale={'auto'}
                                    customTooltip={(props) => {
                                        const { active, payload } = props;
                                        if (active && payload?.length) {
                                            return <BarTooltipComponent value={payload[0].value} />;
                                        }
                                    }}
                                    legend={true}
                                    legendAlignment="bottom"
                                    customLegend={() => {
                                        return <BarLegendComponent text={messages?.leadManagement?.summary?.totalLeads} total={dataCount.leadsCount} converted={dataCount.prospectsCount} />
                                    }}
                                />
                            </StyledChartItem>
                        </StyledItemContainer>
                    </StyledSubBoxContainer>

                    <StyledSubBoxContainer>
                        <StyledItemContainer container>
                            <StyledHeadingItem item>
                                <Grid container display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                                    <Grid item>
                                        <StyledHeadingText>
                                            {messages?.leadManagement?.summary?.prospectClientConversion}
                                        </StyledHeadingText>
                                    </Grid>
                                    <Grid item>
                                        <Grid container display={"flex"} gap="6px" alignItems={"center"}>
                                            <Grid item display={"flex"} alignItems={"center"}>
                                                <StyledFiberManualRecordOutlinedIcon />
                                            </Grid>
                                            <Grid item display={"flex"} alignItems={"center"}>
                                                <StyledSubHeadingText>
                                                    {messages?.leadManagement?.summary?.conversionLevel}
                                                </StyledSubHeadingText>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </StyledHeadingItem>
                            <Grid item>
                                <Divider />
                            </Grid>
                            <StyledChartItem item>
                                <CustomBarChart
                                    data={chartData.prospectToClientConversionData}
                                    xAxisDataKey='name'
                                    yAxisDataKeys={['value']}
                                    tooltip={true}
                                    barSize={60}
                                    colors={['#0088FE']}
                                    xAxisPadding={{ left: 40, right: 40 }}
                                    yAxisPadding={{ top: 20 }}
                                    height={400}
                                    barRadius={[20, 20, 0, 0]}
                                    xAxisTickMargin={10}
                                    yAxisTickMargin={30}
                                    xAxisScale={'auto'}
                                    yAxisTickCount={11}
                                    domain={[0,100]}
                                    customTooltip={(props) => {
                                        const { active, payload } = props;
                                        if (active && payload?.length) {
                                            return <BarTooltipComponent value={payload[0].value} />;
                                        }
                                    }}
                                    legend={true}
                                    legendAlignment="bottom"
                                    customLegend={() => {
                                        return <BarLegendComponent text={messages?.leadManagement?.summary?.totalProspects} total={dataCount.prospectsCount} converted={dataCount.clientCount} />
                                    }}
                                />
                            </StyledChartItem>
                        </StyledItemContainer>
                    </StyledSubBoxContainer>
                </StyledBoxContainer>

                <StyledBoxContainer gap={'10px'}>
                    <StyledSubBoxContainer>
                        <StyledItemContainer container>
                            <StyledHeadingItem item>
                                <StyledHeadingText>
                                    {messages?.leadManagement?.summary?.leadIndustryByValue}
                                </StyledHeadingText>
                            </StyledHeadingItem>
                            <Grid item>
                                <Divider />
                            </Grid>
                            <StyledChartItem item>
                                <CustomPieChart
                                    data={chartData?.leadIndustriesDataByValue}
                                    colors={COLORS1}
                                    height={311}
                                    paddingAngle={0}
                                    strokeWidth={0}
                                    customTooltip={(props) => {
                                        const { active, payload, total } = props;
                                        if (active && payload?.length) {
                                            return <PieTooltipComponent payload={payload} total={total} />

                                        }
                                    }}
                                />
                            </StyledChartItem>
                        </StyledItemContainer>
                    </StyledSubBoxContainer>

                    <StyledSubBoxContainer>
                        <StyledItemContainer container>
                            <StyledHeadingItem item>
                                <StyledHeadingText>
                                    {messages?.leadManagement?.summary?.leadIndustryByQuantity}
                                </StyledHeadingText>
                            </StyledHeadingItem>
                            <Grid item>
                                <Divider />
                            </Grid>
                            <StyledChartItem item>
                                <CustomPieChart
                                    data={chartData?.leadIndustriesDataByQuantity}
                                    colors={COLORS1}
                                    height={311}
                                    paddingAngle={0}
                                    strokeWidth={0}
                                    customTooltip={(props) => {
                                        const { active, payload, total } = props;
                                        if (active && payload?.length) {
                                            return <PieTooltipComponent payload={payload} total={total} currency={false} />

                                        }
                                    }}
                                />
                            </StyledChartItem>
                        </StyledItemContainer>
                    </StyledSubBoxContainer>
                </StyledBoxContainer>

                <StyledBoxContainer gap={'10px'}>
                    <StyledSubBoxContainer>
                        <StyledItemContainer container>
                            <StyledHeadingItem item>
                                <StyledHeadingText>
                                    {messages?.leadManagement?.summary?.leadSourceByValue}
                                </StyledHeadingText>
                            </StyledHeadingItem>
                            <Grid item>
                                <Divider />
                            </Grid>
                            <StyledChartItem item>
                                <CustomPieChart
                                    data={chartData?.leadSourcesDataByValue}
                                    colors={COLORS2}
                                    height={311}
                                    paddingAngle={0}
                                    strokeWidth={0}
                                    customTooltip={(props) => {
                                        const { active, payload, total } = props;
                                        if (active && payload?.length) {
                                            return <PieTooltipComponent payload={payload} total={total} />

                                        }
                                    }}
                                />
                            </StyledChartItem>
                        </StyledItemContainer>
                    </StyledSubBoxContainer>

                    <StyledSubBoxContainer>
                        <StyledItemContainer container>
                            <StyledHeadingItem item>
                                <StyledHeadingText>
                                    {messages?.leadManagement?.summary?.leadSourceByQuantity}
                                </StyledHeadingText>
                            </StyledHeadingItem>
                            <Grid item>
                                <Divider />
                            </Grid>
                            <StyledChartItem item>
                                <CustomPieChart
                                    data={chartData?.leadSourcesDataByQuantity}
                                    colors={COLORS2}
                                    height={311}
                                    paddingAngle={0}
                                    strokeWidth={0}
                                    customTooltip={(props) => {
                                        const { active, payload, total } = props;
                                        if (active && payload?.length) {
                                            return <PieTooltipComponent payload={payload} total={total} currency={false} />

                                        }
                                    }}
                                />
                            </StyledChartItem>
                        </StyledItemContainer>
                    </StyledSubBoxContainer>
                </StyledBoxContainer>
            </StyledMainContainer>
        </Card>
    )
};

export default Summary;