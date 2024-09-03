import { Grid } from "@mui/material";
import { Option, UserActionConfig } from "@wizehub/common/models";
import { Card, CustomLineChart, Table } from "@wizehub/components";
import React, { useCallback, useEffect, useState } from "react";
import { MarketingResultsEntity } from "@wizehub/common/models/genericEntities";
import {
    StyledDeleteIcon,
    StyledFiberManualRecordOutlinedIcon,
    StyledLegend,
    StyledLegendContainer,
    StyledLegendSubContainer,
    StyledMarketingChartContainer,
    StyledMarketingEditIcon,
    StyledMarketingHeading,
    StyledTotalText
} from "./styles";
import { useLocation } from "react-router-dom";
import { routes } from "../../utils";
import { Months } from "@wizehub/common/models/modules";
import { StyledNoFeeHistoryText } from "../businessScorecards/discoveryDashboard/styles";
import messages from "../../messages";
import { brandColour, greyScaleColour } from "@wizehub/common/theme/style.palette";
import { MonthEntity } from ".";

interface Props {
    heading: string;
    analysisData: MarketingResultsEntity[];
    monthsArray: MonthEntity[];
    showEditForm: (metaData?: Partial<UserActionConfig>) => void;
    showDeleteForm: (metaData?: Partial<UserActionConfig>) => void;
}

interface AnalysisEntity {
    name: string;
    [key: number | string]: number | string;
};

const AnalysisScreen: React.FC<Props> = ({
    heading, analysisData, monthsArray, showEditForm, showDeleteForm
}) => {
    const location = useLocation();
    const [marketingDataAnalysis, setMarketingDataAnalysis] = useState<AnalysisEntity[]>([]);
    const [legendItems, setLegendItems] = useState([]);

    const getMonthlyResultsArray = (year?: number) => analysisData?.filter((val: MarketingResultsEntity) => val?.year === year)
        ?.flatMap((val) => val.data.monthlyResults);


    const generateMarketingResultsAnalysis = () => {
        const uniqueYears = Array.from(new Set(analysisData.map((item: MarketingResultsEntity) => item.year)));

        const marketingResultsAnalysisData: AnalysisEntity[] = Months.map((month: Option) => {
            const entry: AnalysisEntity = { name: month?.label };
            uniqueYears.forEach(year => entry[year] = 0);
            return entry;
        });

        analysisData.forEach((item: MarketingResultsEntity) => {
            item.data.monthlyResults.forEach(result => {
                const monthIndex = result.month - 1;
                marketingResultsAnalysisData[monthIndex][item.year] = result.value;
            });
        });

        return { uniqueYears, marketingResultsAnalysisData };
    }

    useEffect(() => {
        if (analysisData?.length) {
            const data = generateMarketingResultsAnalysis()?.marketingResultsAnalysisData;
            setMarketingDataAnalysis(data);
        } else {
            setMarketingDataAnalysis([]);
        }
    }, [analysisData]);


    const getNoChartDataContent = (): string => {
        switch (location?.pathname) {
            case routes.marketingResults.websiteTraffic:
                return messages?.marketingResults?.form?.websiteTraffic?.noContent;
            case routes.marketingResults.newsletterOpenRate:
                return messages?.marketingResults?.form?.newsLetterOpenRate?.noContent;
            case routes.marketingResults.clickThroughRate:
                return messages?.marketingResults?.form?.clickThroughRate?.noContent;
            case routes.marketingResults.databaseGrowth:
                return messages?.marketingResults?.form?.databaseGrowth?.noContent;
            default:
                return messages?.marketingResults?.form?.monthlyLeadData?.noContent;
        }
    };

    const updateLegend = useCallback((legend: React.SetStateAction<any[]>) => {
        setLegendItems(legend);
    }, []);

    return (
        <>
            <Card
                headerCss={{
                    borderBottom: `1px solid ${greyScaleColour.grey80}`
                }}
                header={
                    <Grid container display={"flex"} justifyContent={"space-between"} alignItems={"center"} padding={"0px 20px"}>
                        <Grid item>
                            <StyledMarketingHeading>
                                {heading}
                            </StyledMarketingHeading>
                        </Grid>
                        <Grid item display={"flex"} gap="8px">
                            {legendItems.map((entry) => (
                                <StyledLegendContainer>
                                    <StyledLegendSubContainer>
                                        <StyledFiberManualRecordOutlinedIcon color={entry?.color} />
                                    </StyledLegendSubContainer>
                                    <StyledLegendSubContainer>
                                        <StyledLegend>
                                            {entry?.value}
                                        </StyledLegend>
                                    </StyledLegendSubContainer>
                                </StyledLegendContainer>
                            ))}
                        </Grid>
                    </Grid>
                }
                cardCss={{ margin: '0 20px' }}
            >
                <StyledMarketingChartContainer>
                    {
                        marketingDataAnalysis?.length
                            ? <CustomLineChart
                                data={marketingDataAnalysis}
                                height={318}
                                xAxisDataKey="name"
                                yAxisDataKeys={generateMarketingResultsAnalysis()?.uniqueYears}
                                xAxisPadding={{ left: 50, right: 30 }}
                                margin={{
                                    left: 20,
                                    right: 30
                                }}
                                colors={[
                                    brandColour.primaryMain,
                                    '#C686F8',
                                    '#45D0EE'
                                ]}
                                tickCount={7}
                                updateLegend={updateLegend}
                            />
                            : <StyledNoFeeHistoryText>
                                {getNoChartDataContent()}
                            </StyledNoFeeHistoryText>
                    }
                </StyledMarketingChartContainer>
            </Card >

            <Card
                cardCss={{ margin: '0px 20px 20px 20px' }}
                noHeader
            >
                <Table
                    data={analysisData}
                    actions={[
                        {
                            id: 'edit',
                            component: <StyledMarketingEditIcon />,
                            onClick: (row: MarketingResultsEntity) => {
                                showEditForm({
                                    id: row?.id
                                });
                            },
                        },
                        {
                            id: 'delete',
                            component: <StyledDeleteIcon />,
                            onClick: (row: MarketingResultsEntity) => {
                                showDeleteForm({
                                    id: row?.id
                                });
                            },
                        },
                    ]}
                    specs={[
                        {
                            id: 'year',
                            label: "Fin Year",
                        },
                        ...monthsArray
                            ?.filter(val => !isNaN(val?.monthNumber))
                            ?.map((val) => {
                                const obj = {
                                    id: val?.monthNumber?.toString(),
                                    label: val?.monthName,
                                    getValue: (row: any) => getMonthlyResultsArray(row?.year)
                                        ?.find((item) => item?.month === val?.monthNumber)?.value || '-'
                                };
                                return obj;
                            }),
                        {
                            id: 'total',
                            label: "Total",
                            getValue: (row) => <StyledTotalText>
                                {getMonthlyResultsArray(row?.year)
                                    ?.reduce((sum, result) => sum + result.value, 0)}
                            </StyledTotalText>
                        }
                    ]}
                />
            </Card >
        </>
    )
};

export default AnalysisScreen;