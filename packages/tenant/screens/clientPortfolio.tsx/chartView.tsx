import { Card, CustomBarChart, CustomPieChart } from "@wizehub/components";
import React, { useEffect } from "react";
import {
    StyledBoxContainer,
    StyledChartItem,
    StyledHeadingItem,
    StyledHeadingText,
    StyledItemContainer,
    StyledMainContainer,
    StyledSubBoxContainer
} from "../businessScorecards/discoveryDashboard/styles";
import { Divider, Grid } from "@mui/material";
import messages from "../../messages";
import { BarTooltipComponent, PieTooltipComponent } from "../leadManagement/summary";
import { ClientPortfolioEntity } from "@wizehub/common/models/genericEntities";
import { StyledFiberManualRecordOutlinedIcon, StyledSubHeadingText } from "../leadManagement/summary/styles";
import { hideLoader, showLoader } from "../../redux/actions";
import { useDispatch } from "react-redux";

interface Props {
    clientPortfolioData: ClientPortfolioEntity[];
    calculateFeesCount: (isCAndD?: boolean) => number;
    calculateClassCount: (isCAndD?: boolean) => number;
}

const ChartView: React.FC<Props> = ({
    clientPortfolioData, calculateFeesCount, calculateClassCount
}) => {
    const reduxDispatch = useDispatch();
    const COLORS1 = ['#C686F8', '#45D0EE', '#E8F886', '#8571F4'];

    const barChartData = [
        { name: 'A & B ($)', value: calculateFeesCount() },
        { name: 'A & B (#)', value: calculateFeesCount(true) },
        { name: 'C & D ($)', value: calculateClassCount() },
        { name: 'C & D (#)', value: calculateClassCount(true) },
    ];

    const getClientNumbersData = () => {
        const data = clientPortfolioData
            ?.filter((ele: any) => ele?.clientCount !== 0)
            ?.map((ele: ClientPortfolioEntity) => {
                return {
                    name: ele?.name,
                    value: ele?.clientCount
                }
            });

        return data;
    }

    const getClientFeesData = () => {
        const data = clientPortfolioData
            ?.filter((ele: any) => ele?.totalAnnualFee !== 0)
            ?.map((ele: ClientPortfolioEntity) => {
                return {
                    name: ele?.name,
                    value: ele?.totalAnnualFee
                }
            });

        return data;
    }

    useEffect(() => {
        reduxDispatch(showLoader());
        setTimeout(() => {
            reduxDispatch(hideLoader());
        }, 800);
    }, [])

    return (
        <Card
            noHeader
            cardCss={{
                border: 'none',
                overflow: 'visible !important'
            }}
        >
            <StyledMainContainer gap="10px">
                <StyledSubBoxContainer>
                    <StyledItemContainer container>
                        <StyledHeadingItem item>
                            <Grid container display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                                <Grid item>
                                    <StyledHeadingText>
                                        {messages?.clientPortfolio?.chart?.heading1}
                                    </StyledHeadingText>
                                </Grid>
                                <Grid item>
                                    <Grid container display={"flex"} gap="6px" alignItems={"center"}>
                                        <Grid item display={"flex"} alignItems={"center"}>
                                            <StyledFiberManualRecordOutlinedIcon />
                                        </Grid>
                                        <Grid item display={"flex"} alignItems={"center"}>
                                            <StyledSubHeadingText>
                                                {messages?.clientPortfolio?.chart?.result}
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
                                data={barChartData}
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
                                xAxisScale={"auto"}
                                domain={[0, 100]}
                                customTooltip={(props) => {
                                    const { active, payload } = props;
                                    if (active && payload?.length) {
                                        return <BarTooltipComponent value={payload[0].value} />;
                                    }
                                }}
                            />
                        </StyledChartItem>
                    </StyledItemContainer>
                </StyledSubBoxContainer>

                <StyledBoxContainer gap={'10px'}>
                    <StyledSubBoxContainer>
                        <StyledItemContainer container>
                            <StyledHeadingItem item>
                                <StyledHeadingText>
                                    {messages?.clientPortfolio?.chart?.heading2}
                                </StyledHeadingText>
                            </StyledHeadingItem>
                            <Grid item>
                                <Divider />
                            </Grid>
                            <StyledChartItem item>
                                <CustomPieChart
                                    data={getClientNumbersData()}
                                    colors={COLORS1}
                                    height={311}
                                    paddingAngle={0}
                                    strokeWidth={0}
                                    customTooltip={(props) => {
                                        const { active, payload, total } = props;
                                        if (active && payload?.length) {
                                            return <PieTooltipComponent payload={payload} total={total} noDollar={true} />

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
                                    {messages?.clientPortfolio?.chart?.heading3}
                                </StyledHeadingText>
                            </StyledHeadingItem>
                            <Grid item>
                                <Divider />
                            </Grid>
                            <StyledChartItem item>
                                <CustomPieChart
                                    data={getClientFeesData()}
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
                </StyledBoxContainer>
            </StyledMainContainer>
        </Card>
    )
};

export default ChartView;