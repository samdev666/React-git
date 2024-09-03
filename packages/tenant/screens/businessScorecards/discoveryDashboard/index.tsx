import React, { useEffect, useState } from "react";
import {
    StyledBoxContainer,
    StyledChartItem,
    StyledHeadingItem,
    StyledHeadingText,
    StyledItemContainer,
    StyledMainContainer,
    StyledNoFeeHistoryContainer,
    StyledNoFeeHistoryText,
    StyledSubBoxContainer
} from "./styles";
import { Divider, Grid } from "@mui/material";
import messages from "../../../messages";
import { Button, Card, CustomBarChart, CustomPieChart, CustomRadarChart, Modal } from "@wizehub/components";
import { otherColour } from "@wizehub/common/theme/style.palette";
import { FeeHistoryEntity, Section, TenantFormData } from "@wizehub/common/models/genericEntities";
import { apiCall, hideLoader, showLoader } from "../../../redux/actions";
import { HttpMethods, trimWordWrapper } from "@wizehub/common/utils";
import { useDispatch } from "react-redux";
import { GET_FEE_HISTORY_LISTING, GET_TENANT_FORMS } from "../../../api";
import { StyledWizeGapFormHeadingContainer } from "../../wizegapForms/styles";
import { StyledOnboardingHeading } from "../../onboarding/styles";
import { ResponsiveEditIcon } from "../../systemPreferences/launchPadSetup/launchPadSetupDetail";
import { StyledResponsiveIcon } from "@wizehub/components/table/styles";
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import { ReduxState } from "../../../redux/reducers";
import { useSelector } from "react-redux";
import { TenantFormsCode } from "../../../utils/constant";
import { Container } from "../../../components";
import { push } from "connected-react-router";
import { routes } from "../../../utils";
import { usePopupReducer } from "@wizehub/common/hooks";
import WizegapQuestionnaireModal from "../../wizegapForms/wizeGapQuestionnaireModal";
import { useLocation } from "react-router-dom";

interface Props { }

export const ResponsivePDFIcon = StyledResponsiveIcon(PictureAsPdfOutlinedIcon);

const lifeScorecardLabels = [
    messages?.businessAssessment?.discoveryDashboard?.lifeScorecard?.labels?.careerBusiness,
    messages?.businessAssessment?.discoveryDashboard?.lifeScorecard?.labels?.moneyWealth,
    messages?.businessAssessment?.discoveryDashboard?.lifeScorecard?.labels?.healthFitness,
    messages?.businessAssessment?.discoveryDashboard?.lifeScorecard?.labels?.friendsFamily,
    messages?.businessAssessment?.discoveryDashboard?.lifeScorecard?.labels?.romancePartner,
    messages?.businessAssessment?.discoveryDashboard?.lifeScorecard?.labels?.comfortZoneGrowth,
    messages?.businessAssessment?.discoveryDashboard?.lifeScorecard?.labels?.funRecreation,
    messages?.businessAssessment?.discoveryDashboard?.lifeScorecard?.labels?.materialSurroundings
];

const freedomScorecardLabels = [
    messages?.businessAssessment?.discoveryDashboard?.freedomScorecard?.labels?.accounts,
    messages?.businessAssessment?.discoveryDashboard?.freedomScorecard?.labels?.administration,
    messages?.businessAssessment?.discoveryDashboard?.freedomScorecard?.labels?.quality,
    messages?.businessAssessment?.discoveryDashboard?.freedomScorecard?.labels?.production,
    messages?.businessAssessment?.discoveryDashboard?.freedomScorecard?.labels?.sales,
    messages?.businessAssessment?.discoveryDashboard?.freedomScorecard?.labels?.marketing,
    messages?.businessAssessment?.discoveryDashboard?.freedomScorecard?.labels?.board,
    messages?.businessAssessment?.discoveryDashboard?.freedomScorecard?.labels?.overallStatusReliance
];

const businessScorecardLabels = [
    messages?.businessAssessment?.discoveryDashboard?.businessScorecard?.labels?.runBusiness,
    messages?.businessAssessment?.discoveryDashboard?.businessScorecard?.labels?.workOnBusiness,
    messages?.businessAssessment?.discoveryDashboard?.businessScorecard?.labels?.earningPassive,
    messages?.businessAssessment?.discoveryDashboard?.businessScorecard?.labels?.livingIdealLifestyle,
    messages?.businessAssessment?.discoveryDashboard?.businessScorecard?.labels?.completingMeetingRythms,
    messages?.businessAssessment?.discoveryDashboard?.businessScorecard?.labels?.marketingPlan,
    messages?.businessAssessment?.discoveryDashboard?.businessScorecard?.labels?.trackClientNPS,
    messages?.businessAssessment?.discoveryDashboard?.businessScorecard?.labels?.trackTeamNPS
];

const COLORS = ['#C686F8', '#6AD9F1'];

const DiscoveryDashboard: React.FC<Props> = () => {
    const reduxDispatch = useDispatch();
    const location = useLocation();
    const { tenantId } = useSelector((state: ReduxState) => state.tenantData);

    const [formData, setFormData] = useState<TenantFormData>(null);
    const [totalPotential, setTotalPotential] = useState<number>(0);
    const [usedPotential, setUsedPotential] = useState<number>(0);
    const [feeHistoryData, setFeeHistoryData] = useState<FeeHistoryEntity[]>([]);
    const [feeHistoryBarData, setFeeHistoryBarData] = useState([]);
    const [ebitdaBarData, setEbitdaBarData] = useState([]);

    const {
        visibility: formVisibility,
        showPopup: showForm,
        hidePopup: hideForm,
    } = usePopupReducer();

    const getTenantForms = async () => {
        return (
            new Promise((resolve, reject) => {
                reduxDispatch(
                    apiCall(
                        GET_TENANT_FORMS.replace(':tenantId', tenantId).replace(':code', TenantFormsCode.businessAssessment),
                        resolve,
                        reject,
                        HttpMethods.GET
                    )
                );
            })
                .then((res: TenantFormData) => {
                    setFormData(res);
                })
                .catch((error) => {
                    console.log(error, "error");
                })
        )
    }

    const getChartData = (code: string, labelsArr: Array<string>) => formData?.sections
        ?.filter((val: Section) => val?.code === code)
        .flatMap((val: Section) => {
            const data = val?.questions?.map((item: any, index: number) => {
                const resultValue = code === "FREEDOM_SCORECARD" && item?.presentationData?.title?.split('-');
                return ({
                    entity: resultValue?.length > 1 ? trimWordWrapper(resultValue?.[1]) : labelsArr[index],
                    score: Number(item?.answer?.label),
                    totalScore: item?.configurationData?.options?.length,
                })
            })
            const sortedDataArr = data.sort((a, b) =>
                labelsArr.indexOf(a.entity) - labelsArr.indexOf(b.entity)
            );
            return sortedDataArr;
        }
        ) ?? [];

    const pieData = [
        { name: 'Used', value: usedPotential },
        { name: 'Unused', value: totalPotential - usedPotential }
    ];

    const calculatedPieData = () => {
        let total = 0;
        let used = 0;

        formData?.sections
            ?.filter((val: Section) => val?.code === "OWNERS_SCORECARD")
            ?.forEach((val: any) => val?.subSections?.forEach((ele: any) => {
                const questionCount = ele?.questions?.length || 0;
                total = total > 0 ? total * questionCount * 2 : questionCount * 2;

                const usedValue = ele?.questions?.reduce((sum: number, item: any) => {
                    return sum + (item?.answer === "yes" ? 2 : 0);
                }, 0);

                used = used > 0 ? (usedValue > 0 ? used * usedValue : used) : usedValue;
            }));

        setTotalPotential(total);
        setUsedPotential(used);
    }

    const getFeeHistory = async () => {
        return new Promise<void>((resolve, reject) => {
            reduxDispatch(
                apiCall(
                    GET_FEE_HISTORY_LISTING.replace(':tenantId', tenantId),
                    resolve,
                    reject,
                    HttpMethods.GET
                ),
            );
        })
            .then((res: any) => {
                setFeeHistoryData(res?.records);
            })
            .catch((error) => {
                console.log(error?.message, "error")
            });
    };

    const getFeeHistoryGrowth = () => {
        const resultedValue = feeHistoryData?.map((item: any) => {
            return {
                year: item.year,
                annualRevenue: item.annualFee
            }
        });
        setFeeHistoryBarData(resultedValue);
    }

    const getEbitdaGrowth = () => {
        const resultedEbitdaValue = feeHistoryData?.map((item: any) => {
            return {
                year: item.year,
                annualRevenue: item.ebita
            }
        });
        setEbitdaBarData(resultedEbitdaValue);
    }

    useEffect(() => {
        if (tenantId) {
            reduxDispatch(showLoader());
            getTenantForms();
            getFeeHistory();
            setTimeout(() => {
                reduxDispatch(hideLoader());
            }, 2000);
        }
        setTimeout(() => {
            if (location?.state) {
                showForm();
            }
        }, 5000);
    }, [tenantId])

    useEffect(() => {
        getFeeHistoryGrowth();
        getEbitdaGrowth();
    }, [feeHistoryData])

    useEffect(() => {
        calculatedPieData();
    }, [formData])

    return (
        <Container noPadding>
            <Card
                cardCss={{
                    border: 'none',
                    padding: '0px 20px 10px 20px',
                    overflow: 'visible'
                }}
                header={
                    <StyledWizeGapFormHeadingContainer container>
                        <Grid item>
                            <Grid container display={"flex"} justifyContent={"space-between"}>
                                <Grid item>
                                    <StyledOnboardingHeading>
                                        {messages?.businessAssessment?.discoveryDashboard?.heading}
                                    </StyledOnboardingHeading>
                                </Grid>
                                <Grid item>
                                    <div style={{ display: "flex", gap: "16px" }}>
                                        <Button
                                            startIcon={<ResponsiveEditIcon />}
                                            variant="outlined"
                                            color="secondary"
                                            label={messages.profile.editButton}
                                            onClick={() => {
                                                reduxDispatch(push(routes.businessScoreccards.businessAssessment));
                                            }}
                                        />
                                        {/* <Button
                                            startIcon={<ResponsivePDFIcon />}
                                            variant="contained"
                                            color="primary"
                                            label={messages?.businessAssessment?.discoveryDashboard?.pdfBtn}
                                            onClick={() => { }}
                                        /> */}
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Divider />
                        </Grid>
                    </StyledWizeGapFormHeadingContainer>
                }
                contentCss={{
                    padding: '10px 0px'
                }}
            >
                <StyledMainContainer>
                    <StyledBoxContainer>
                        <StyledSubBoxContainer>
                            <StyledItemContainer container>
                                <StyledHeadingItem item>
                                    <StyledHeadingText>
                                        {messages?.businessAssessment?.discoveryDashboard?.lifeScorecard?.heading}
                                    </StyledHeadingText>
                                </StyledHeadingItem>
                                <Grid item>
                                    <Divider />
                                </Grid>
                                <StyledChartItem item>
                                    <CustomRadarChart
                                        data={getChartData("LIFE_SCORECARD", lifeScorecardLabels)}
                                        dataKeys={['score']}
                                        fillOpacity={0.4}
                                        strokeWidth={2}
                                        colors={[otherColour.turquoise]}
                                        strokeColors={['#c5d6f9']}
                                        polarGridProps={{
                                            gridType: "polygon",
                                        }}
                                        angleAxisProps={{ dataKey: 'entity' }}
                                        dotProps={{ r: 3 }}
                                        height={311}
                                    />
                                </StyledChartItem>
                            </StyledItemContainer>
                        </StyledSubBoxContainer>

                        <StyledSubBoxContainer>
                            <StyledItemContainer container>
                                <StyledHeadingItem item>
                                    <StyledHeadingText>
                                        {messages?.businessAssessment?.discoveryDashboard?.freedomScorecard?.heading}
                                    </StyledHeadingText>
                                </StyledHeadingItem>
                                <Grid item>
                                    <Divider />
                                </Grid>
                                <StyledChartItem item>
                                    <CustomRadarChart
                                        data={getChartData("FREEDOM_SCORECARD", freedomScorecardLabels)}
                                        dataKeys={['score']}
                                        fillOpacity={0.4}
                                        strokeWidth={2}
                                        colors={[otherColour.turquoise]}
                                        strokeColors={['#c5d6f9']}
                                        polarGridProps={{
                                            gridType: "polygon",
                                        }}
                                        angleAxisProps={{ dataKey: 'entity' }}
                                        dotProps={{ r: 3 }}
                                        height={311}
                                    />
                                </StyledChartItem>
                            </StyledItemContainer>
                        </StyledSubBoxContainer>
                    </StyledBoxContainer>

                    <StyledBoxContainer>
                        <StyledSubBoxContainer>
                            <StyledItemContainer container>
                                <StyledHeadingItem item>
                                    <StyledHeadingText>
                                        {messages?.businessAssessment?.discoveryDashboard?.businessScorecard?.heading}
                                    </StyledHeadingText>
                                </StyledHeadingItem>
                                <Grid item>
                                    <Divider />
                                </Grid>
                                <StyledChartItem item>
                                    <CustomRadarChart
                                        data={getChartData("BUSINESS_SCORECARD", businessScorecardLabels)}
                                        dataKeys={['score']}
                                        fillOpacity={0.4}
                                        strokeWidth={2}
                                        colors={[otherColour.turquoise]}
                                        strokeColors={['#c5d6f9']}
                                        polarGridProps={{
                                            gridType: "polygon",
                                        }}
                                        angleAxisProps={{ dataKey: 'entity' }}
                                        dotProps={{ r: 3 }}
                                        height={311}
                                    />
                                </StyledChartItem>
                            </StyledItemContainer>
                        </StyledSubBoxContainer>

                        <StyledSubBoxContainer>
                            <StyledItemContainer container>
                                <StyledHeadingItem item>
                                    <StyledHeadingText>
                                        {messages?.businessAssessment?.discoveryDashboard?.scoresPotential}
                                    </StyledHeadingText>
                                </StyledHeadingItem>
                                <Grid item>
                                    <Divider />
                                </Grid>
                                <StyledChartItem item>
                                    <CustomPieChart
                                        data={pieData}
                                        colors={COLORS}
                                        height={311}
                                        totalValue={totalPotential}
                                        cornerRadius={10}
                                    />
                                </StyledChartItem>
                            </StyledItemContainer>
                        </StyledSubBoxContainer>
                    </StyledBoxContainer>

                    <StyledBoxContainer>
                        <StyledSubBoxContainer>
                            <StyledItemContainer container>
                                <StyledHeadingItem item>
                                    <StyledHeadingText>
                                        {messages?.businessAssessment?.discoveryDashboard?.feeHistoryGrowth}
                                    </StyledHeadingText>
                                </StyledHeadingItem>
                                <Grid item>
                                    <Divider />
                                </Grid>
                                <StyledChartItem item>
                                    {feeHistoryBarData?.length
                                        ? <CustomBarChart
                                            data={feeHistoryBarData.sort((a: any, b: any) => a.year - b.year)}
                                            xAxisDataKey='year'
                                            yAxisDataKeys={['annualRevenue']}
                                            tooltip={true}
                                            barSize={6}
                                            colors={['#0088FE']}
                                            xAxisPadding={{ left: 30 }}
                                            yAxisPadding={{ top: 20 }}
                                            margin={{
                                                top: 0,
                                                right: 30,
                                                left: 0,
                                                bottom: 0,
                                            }}
                                            height={311}
                                            hoverColor={otherColour.turquoise}
                                        />
                                        : <StyledNoFeeHistoryContainer>
                                            <StyledNoFeeHistoryText>
                                                {messages?.businessAssessment?.discoveryDashboard?.noFeeHistory}
                                            </StyledNoFeeHistoryText>
                                        </StyledNoFeeHistoryContainer>
                                    }
                                </StyledChartItem>
                            </StyledItemContainer>
                        </StyledSubBoxContainer>

                        <StyledSubBoxContainer>
                            <StyledItemContainer container>
                                <StyledHeadingItem item>
                                    <StyledHeadingText>
                                        {messages?.businessAssessment?.discoveryDashboard?.ebitdaHistoryGrowth}
                                    </StyledHeadingText>
                                </StyledHeadingItem>
                                <Grid item>
                                    <Divider />
                                </Grid>
                                <StyledChartItem item>
                                    {ebitdaBarData?.length
                                        ? <CustomBarChart
                                            data={ebitdaBarData.sort((a: any, b: any) => a.year - b.year)}
                                            xAxisDataKey='year'
                                            yAxisDataKeys={['annualRevenue']}
                                            tooltip={true}
                                            barSize={6}
                                            colors={['#0088FE']}
                                            xAxisPadding={{ left: 30 }}
                                            yAxisPadding={{ top: 20 }}
                                            margin={{
                                                top: 0,
                                                right: 30,
                                                left: 0,
                                                bottom: 0,
                                            }}
                                            height={311}
                                            hoverColor={otherColour.turquoise}
                                        />
                                        : <StyledNoFeeHistoryContainer>
                                            <StyledNoFeeHistoryText>
                                                {messages?.businessAssessment?.discoveryDashboard?.noFeeHistory}
                                            </StyledNoFeeHistoryText>
                                        </StyledNoFeeHistoryContainer>
                                    }
                                </StyledChartItem>
                            </StyledItemContainer>
                        </StyledSubBoxContainer>
                    </StyledBoxContainer>
                </StyledMainContainer>
            </Card>

            <Modal
                show={formVisibility}
                onClose={hideForm}
                fitContent
            >
                <WizegapQuestionnaireModal onClose={hideForm} />
            </Modal>
        </Container>
    )
}

export default DiscoveryDashboard;