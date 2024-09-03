import React, { useEffect, useState } from "react";
import { Container } from "../../components";
import { routes } from "../../utils";
import {
    StyledHeadingTypography,
    StyledMainHeadingContainer,
    StyledMainLeftHeadingContainer
} from "@wizehub/components/detailPageWrapper/styles";
import { Button, Modal, MultiTabComponent, Toast } from "@wizehub/components";
import { ResponsiveAddIcon } from "../systemPreferences/launchPadSetup/launchPadSetup";
import { StyledMultiTabContainer } from "../firmProfile/styles";
import { push } from "connected-react-router";
import { useActiveTabLocation, useEntity, usePopupReducer } from "@wizehub/common/hooks";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import AnalysisScreen from "./analysisScreen";
import { MarketingResultsEnum, UserActionConfig } from "@wizehub/common/models";
import AddYearForm from "./addYearForm";
import { apiCall } from "../../redux/actions";
import { FIRM_DETAIL_BY_ID, MARKETING_RESULTS_API, MARKETING_RESULTS_LISTING_API } from "../../api";
import { financialYearStartMonth, HttpMethods } from "@wizehub/common/utils";
import { useSelector } from "react-redux";
import { ReduxState } from "../../redux/reducers";
import { FirmProfileEntity, MarketingResultsEntity } from "@wizehub/common/models/genericEntities";
import DeleteCTAForm from "../systemPreferences/launchPadSetup/deleteCTAForm";
import { toast } from "react-toastify";
import messages from "../../messages";

export interface MonthEntity {
    monthNumber: number;
    monthName: string
}

const marketingResultsTabs = [
    {
        id: 'lead-data',
        label: messages?.marketingResults?.tabHeadings?.monthlyLeadData,
        route: routes.marketingResults.leadData,
    },
    {
        id: 'website-traffic',
        label: messages?.marketingResults?.tabHeadings?.websiteTraffic,
        route: routes.marketingResults.websiteTraffic,
    },
    {
        id: 'newsletter-open-rate',
        label: messages?.marketingResults?.tabHeadings?.newsLetterOpenRate,
        route: routes.marketingResults.newsletterOpenRate,
    },
    {
        id: 'click-through-rate',
        label: messages?.marketingResults?.tabHeadings?.clickThroughRate,
        route: routes.marketingResults.clickThroughRate,
    },
    {
        id: 'database-growth',
        label: messages?.marketingResults?.tabHeadings?.databaseGrowth,
        route: routes.marketingResults.databaseGrowth,
    },
];

export const getMarketingType = (path: string): string => {
    switch (path) {
        case routes.marketingResults.websiteTraffic:
            return MarketingResultsEnum.WEBSITE_TRAFFIC;
        case routes.marketingResults.newsletterOpenRate:
            return MarketingResultsEnum.NEWSLETTER_OPEN_RATE;
        case routes.marketingResults.clickThroughRate:
            return MarketingResultsEnum.CLICK_THROUGH_RATE;
        case routes.marketingResults.databaseGrowth:
            return MarketingResultsEnum.DATABASE_GROWTH;
        default:
            return MarketingResultsEnum.LEAD_DATA;
    }
};

const MarketingResults = () => {
    const location = useLocation();
    const reduxDispatch = useDispatch();
    const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
    const { activeTabName } = useActiveTabLocation(marketingResultsTabs);

    const [marketingData, setMarketingData] = useState<MarketingResultsEntity[]>([]);
    const [monthsArray, setMonthsArray] = useState<MonthEntity[]>([]);

    const { entity: firmDetail } = useEntity<FirmProfileEntity>(
        FIRM_DETAIL_BY_ID,
        tenantId
    );

    useEffect(() => {
        if (location?.pathname === routes.marketingResults.root
        ) {
            reduxDispatch(push(marketingResultsTabs[0]?.route));
        }
    }, []);

    useEffect(() => {
        setMonthsArray(financialYearStartMonth(firmDetail?.financialStartMonth));
    }, [firmDetail]);

    const {
        visibility: createFormVisibility,
        showPopup: showCreateForm,
        hidePopup: hideCreateForm,
    } = usePopupReducer();

    const {
        visibility: editFormVisibility,
        showPopup: showEditForm,
        hidePopup: hideEditForm,
        metaData: editConfig
    } = usePopupReducer<UserActionConfig>();

    const {
        visibility: deleteFormVisibility,
        showPopup: showDeleteForm,
        hidePopup: hideDeleteForm,
        metaData: deleteConfig
    } = usePopupReducer<UserActionConfig>();

    const getDeleteHeading = (): string => {
        switch (location?.pathname) {
            case routes.marketingResults.websiteTraffic:
                return messages?.marketingResults?.form?.websiteTraffic?.deleteHeading;
            case routes.marketingResults.newsletterOpenRate:
                return messages?.marketingResults?.form?.newsLetterOpenRate?.deleteHeading;
            case routes.marketingResults.clickThroughRate:
                return messages?.marketingResults?.form?.clickThroughRate?.deleteHeading;
            case routes.marketingResults.databaseGrowth:
                return messages?.marketingResults?.form?.databaseGrowth?.deleteHeading;
            default:
                return messages?.marketingResults?.form?.monthlyLeadData?.deleteHeading;
        }
    };

    const getSuccessMessage = (): string => {
        switch (location?.pathname) {
            case routes.marketingResults.websiteTraffic:
                return deleteConfig?.id
                    ? messages?.marketingResults?.form?.websiteTraffic?.success?.deleted
                    : editConfig?.id
                        ? messages?.marketingResults?.form?.websiteTraffic?.success?.updated
                        : messages?.marketingResults?.form?.websiteTraffic?.success?.created;
            case routes.marketingResults.newsletterOpenRate:
                return deleteConfig?.id
                    ? messages?.marketingResults?.form?.newsLetterOpenRate?.success?.deleted
                    : editConfig?.id
                        ? messages?.marketingResults?.form?.newsLetterOpenRate?.success?.updated
                        : messages?.marketingResults?.form?.newsLetterOpenRate?.success?.created;
            case routes.marketingResults.clickThroughRate:
                return deleteConfig?.id
                    ? messages?.marketingResults?.form?.clickThroughRate?.success?.deleted
                    : editConfig?.id
                        ? messages?.marketingResults?.form?.clickThroughRate?.success?.updated
                        : messages?.marketingResults?.form?.clickThroughRate?.success?.created;
            case routes.marketingResults.databaseGrowth:
                return deleteConfig?.id
                    ? messages?.marketingResults?.form?.databaseGrowth?.success?.deleted
                    : editConfig?.id
                        ? messages?.marketingResults?.form?.databaseGrowth?.success?.updated
                        : messages?.marketingResults?.form?.databaseGrowth?.success?.created;
            default:
                return deleteConfig?.id
                    ? messages?.marketingResults?.form?.monthlyLeadData?.success?.deleted
                    : editConfig?.id
                        ? messages?.marketingResults?.form?.monthlyLeadData?.success?.updated
                        : messages?.marketingResults?.form?.monthlyLeadData?.success?.created;
        }
    };

    const getMarketingData = async () => {
        return new Promise<void>((resolve, reject) => {
            reduxDispatch(
                apiCall(
                    `${MARKETING_RESULTS_LISTING_API.replace(':tenantId', tenantId)}?order=year&direction=asc&filter[type]=${getMarketingType(location?.pathname)}`,
                    resolve,
                    reject,
                    HttpMethods.GET
                )
            );
        })
            .then((res: any) => {
                setMarketingData(res?.records)
            })
            .catch(() => { });
    };

    useEffect(() => {
        getMarketingData()
    }, [location]);

    return (
        <Container noPadding>
            <StyledMainHeadingContainer>
                <StyledMainLeftHeadingContainer>
                    <StyledHeadingTypography>
                        {messages?.marketingResults?.heading}
                    </StyledHeadingTypography>
                </StyledMainLeftHeadingContainer>
                <Button
                    startIcon={<ResponsiveAddIcon />}
                    label={messages?.marketingResults?.btnText}
                    variant="contained"
                    color="primary"
                    onClick={() => showCreateForm()}
                />
            </StyledMainHeadingContainer>
            <StyledMultiTabContainer>
                <MultiTabComponent
                    push={push}
                    tabs={marketingResultsTabs}
                    activeTabName={activeTabName}
                />
            </StyledMultiTabContainer>
            <AnalysisScreen
                heading={activeTabName}
                analysisData={marketingData}
                monthsArray={monthsArray}
                showEditForm={showEditForm}
                showDeleteForm={showDeleteForm}
            />

            <Modal
                show={editConfig?.id ? editFormVisibility : createFormVisibility}
                heading={editConfig?.id ? messages?.general?.edit : messages?.marketingResults?.btnText}
                onClose={() => {
                    if (editConfig?.id) hideEditForm();
                    else hideCreateForm();
                }}
                fitContent
            >
                <AddYearForm
                    onCancel={() => {
                        if (editConfig?.id) hideEditForm();
                        else hideCreateForm();
                    }}
                    onSuccess={() => {
                        if (editConfig?.id) hideEditForm();
                        else hideCreateForm();
                        toast(() => (
                            <Toast
                                text={getSuccessMessage()}
                            />
                        ));
                        getMarketingData();
                    }}
                    monthsArray={monthsArray}
                    isUpdate={!!editConfig?.id}
                    typeId={editConfig?.id}
                />
            </Modal>

            <Modal
                show={deleteFormVisibility}
                heading={messages?.settings?.accountManagement?.form?.deleteButton}
                onClose={hideDeleteForm}
                fitContent
            >
                <DeleteCTAForm
                    onCancel={hideDeleteForm}
                    onSuccess={() => {
                        hideDeleteForm();
                        toast(() => (
                            <Toast
                                text={getSuccessMessage()}
                            />
                        ));
                        getMarketingData();
                    }}
                    api={`${MARKETING_RESULTS_API}/${deleteConfig?.id}`}
                    bodyText={getDeleteHeading()}
                    cancelButton={messages?.general?.cancel}
                    confirmButton={messages?.settings?.accountManagement?.form?.deleteButton}
                    apiMethod={HttpMethods.DELETE}
                />
            </Modal>

        </Container>
    )
}

export default MarketingResults;