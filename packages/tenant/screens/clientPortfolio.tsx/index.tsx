import React, { useEffect, useState } from "react";
import { Container } from "../../components";
import { Button } from "@wizehub/components";
import {
    StyledMainHeadingButtonContainer,
    StyledMainHeadingContainer,
    StyledMainLeftHeadingContainer
} from "@wizehub/components/detailPageWrapper/styles";
import { StyledHeadingTypography } from "../profile/styles";
import { ResponsiveAddIcon } from "../systemPreferences/launchPadSetup/launchPadSetup";
import { StyledActiveTab, StyledActiveTabText, StyledTabsContainer } from "../leadManagement/styles";
import messages from "../../messages";
import { useOptions } from "@wizehub/common/hooks";
import { ClientClassEntity, ClientPortfolioEntity } from "@wizehub/common/models/genericEntities";
import { CLIENT_CLASS_LISTING_API, GET_CLIENT_PORTFOLIO_DATA } from "../../api";
import { useSelector } from "react-redux";
import { ReduxState } from "../../redux/reducers";
import { useDispatch } from "react-redux";
import { HttpMethods } from "@wizehub/common/utils";
import { StyledClientDataContainer } from "./styles";
import { apiCall } from "../../redux/actions";
import TabularView from "./tabularView";
import ChartView from "./chartView";
import { push } from "connected-react-router";
import { routes } from "../../utils";

interface Props {

}

const ClientPortfolio: React.FC<Props> = () => {
    const [activeTab, setActiveTab] = useState<'table' | 'chart'>('table');
    const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
    const [clientPortfolioData, setClientPortfolioData] = useState<ClientPortfolioEntity[]>(null);

    const reduxDispatch = useDispatch();

    const {
        options: clientClassOptions,
    } = useOptions<ClientClassEntity>(
        CLIENT_CLASS_LISTING_API,
        true
    );

    const getClientPortfolioData = async () => {
        return new Promise((resolve, reject) => {
            reduxDispatch(
                apiCall(
                    `${GET_CLIENT_PORTFOLIO_DATA.replace(':tenantId', tenantId)}`,
                    resolve,
                    reject,
                    HttpMethods.GET
                )
            );
        })
            .then((res: ClientPortfolioEntity[]) => {
                const dataArray = res?.filter((item: ClientPortfolioEntity) => typeof item === 'object' && item.id !== undefined);
                const mergedData = clientClassOptions?.map(cls => {
                    const feeData = dataArray?.find((fee: ClientPortfolioEntity) => fee.id === cls.id) || { clientCount: 0, totalAnnualFee: 0 };
                    return { id: cls.id, name: cls.name, clientCount: feeData.clientCount, totalAnnualFee: feeData.totalAnnualFee };
                });

                setClientPortfolioData(mergedData);
            })
            .catch((error) => {
                console.log(error, "error");
            });
    }


    const calculateFeesCount = (isCAndD?: boolean) => {
        const { A, B, C, D }: { A?: number; B?: number; C?: number; D?: number } =
            clientPortfolioData?.reduce((acc, item) => ({ ...acc, [item.name]: item.totalAnnualFee }), {}) || {};

        const total = isCAndD
            ? ((C + D) / (A + B + C + D)) * 100
            : ((A + B) / (A + B + C + D)) * 100;
        return total;
    }

    const calculateClassCount = (isCAndD?: boolean) => {
        const { A, B, C, D }: { A?: number; B?: number; C?: number; D?: number } =
            clientPortfolioData?.reduce((acc, item) => ({ ...acc, [item.name]: item.clientCount }), {}) || {};

        const total = isCAndD
            ? ((C + D) / (A + B + C + D)) * 100
            : ((A + B) / (A + B + C + D)) * 100;
        return total;
    }

    useEffect(() => {
        getClientPortfolioData();
    }, [clientClassOptions]);

    return (
        <Container noPadding>
            <StyledMainHeadingContainer>
                <StyledMainLeftHeadingContainer>
                    <StyledHeadingTypography>
                        {messages?.clientPortfolio?.heading}
                    </StyledHeadingTypography>
                </StyledMainLeftHeadingContainer>
                <StyledMainHeadingButtonContainer>
                    <Button
                        startIcon={<ResponsiveAddIcon />}
                        variant="contained"
                        color="primary"
                        label={messages?.settings?.accountManagement?.form?.createNew}
                        onClick={() => reduxDispatch(push({
                            pathname: `${routes.leadManagement.root}/add`,
                            state: { type: 'Client', goBackRoute: routes.clientPortfolio }
                        }))}
                    />
                </StyledMainHeadingButtonContainer>
            </StyledMainHeadingContainer>
            <StyledClientDataContainer>
                <StyledTabsContainer>
                    <StyledActiveTab
                        active={activeTab === 'table'}
                        onClick={() => setActiveTab('table')}
                    >
                        <StyledActiveTabText>
                            {messages?.clientPortfolio?.tabularView}
                        </StyledActiveTabText>
                    </StyledActiveTab>
                    <StyledActiveTab
                        active={activeTab === 'chart'}
                        onClick={() => setActiveTab('chart')}
                    >
                        <StyledActiveTabText>
                            {messages?.clientPortfolio?.chartView}
                        </StyledActiveTabText>
                    </StyledActiveTab>
                </StyledTabsContainer>

                {
                    activeTab === 'table'
                        ? <TabularView
                            clientClassOptions={clientClassOptions}
                            clientPortfolioData={clientPortfolioData}
                            calculateFeesCount={calculateFeesCount}
                            calculateClassCount={calculateClassCount}
                        />
                        : <ChartView
                            clientPortfolioData={clientPortfolioData}
                            calculateFeesCount={calculateFeesCount}
                            calculateClassCount={calculateClassCount}
                        />
                }
            </StyledClientDataContainer>
        </Container>
    )
};

export default ClientPortfolio;