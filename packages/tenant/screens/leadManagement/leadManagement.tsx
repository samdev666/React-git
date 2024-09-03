import React, { useState } from "react";
import { Container } from "../../components";
import {
    StyledActiveTab,
    StyledActiveTabText,
    StyledSwitchIcon1,
    StyledSwitchIcon2,
    StyledTableChartOutlinedIcon,
    StyledTabsContainer
} from "./styles";
import LeadBoard from "./leadBoard";
import Summary from "./summary";
import { StyledMainHeadingContainer } from "@wizehub/components/detailPageWrapper/styles";
import { Grid } from "@mui/material";
import { MaterialAutocompleteInput, SearchInput } from "@wizehub/components";
import LeadBoardTable from "./leadBoard/leadBoardTable";
import { greyScaleColour } from "@wizehub/common/theme/style.palette";
import { useOptions, usePagination } from "@wizehub/common/hooks";
import { LEAD_MANAGEMENT } from "../../redux/actions";
import { GET_TENANT_CLIENTS, LEAD_INDUSTRY_LISTING_API, LEAD_SOURCE_LISTING_API } from "../../api";
import { MetaData, Option, PaginatedEntity, getDefaultMetaData } from "@wizehub/common/models";
import { ReduxState } from "../../redux/reducers";
import { useSelector } from "react-redux";
import { ClientEntity, LeadIndustryInterface, LeadSourceEntity } from "@wizehub/common/models/genericEntities";
import { mapIdNameToOptionWithoutCaptializing } from "@wizehub/common/utils";
import messages from "../../messages";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

interface Props {

}


export const paginatedLeadManagement: PaginatedEntity = {
    key: "leadManagement",
    name: LEAD_MANAGEMENT,
    api: GET_TENANT_CLIENTS,
};

export const getDefaultLeadManagementFilter = (sourceId?: string, industryId?: string): MetaData<ClientEntity> => ({
    ...getDefaultMetaData<ClientEntity>(),
    order: "contactName",
    filters: {
        leadSourceId: sourceId,
        leadIndustryId: industryId,
        allResults: true,
    },
});

const LeadManagement: React.FC<Props> = () => {
    const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
    const [activeTab, setActiveTab] = useState<'board' | 'summary'>('board');
    const [isTableView, setIsTableView] = useState<boolean>(false);

    const reduxDispatch = useDispatch();
    const location = useLocation();

    const {
        entity: leadManagement,
        updateFilters,
        applyFilters,
        connectFilter,
        fetchPage,
        updateLimit,
    } = usePagination<ClientEntity>(
        {
            ...paginatedLeadManagement,
            api: GET_TENANT_CLIENTS.replace(":tenantId", tenantId),
        },
        getDefaultLeadManagementFilter()
    );

    const {
        options: leadIndustryOptions,
        searchOptions: leadIndustrySearchOptions,
    } = useOptions<LeadIndustryInterface>(
        `${LEAD_INDUSTRY_LISTING_API.replace(":id", tenantId)}`,
        true
    );

    const {
        options: leadSourceOptions,
        searchOptions: leadSourceSearchOptions,
    } = useOptions<LeadSourceEntity>(
        `${LEAD_SOURCE_LISTING_API.replace(":id", tenantId)}`,
        true
    );

    return (
        <Container noPadding>
            <StyledMainHeadingContainer container>
                <Grid item xs={3}>
                    <StyledTabsContainer>
                        <StyledActiveTab
                            active={activeTab === 'board'}
                            onClick={() => setActiveTab('board')}
                        >
                            <StyledActiveTabText>
                                {messages?.leadManagement?.tabHeadings?.leadBoard}
                            </StyledActiveTabText>
                        </StyledActiveTab>
                        <StyledActiveTab
                            active={activeTab === 'summary'}
                            onClick={() => setActiveTab('summary')}
                        >
                            <StyledActiveTabText>
                                {messages?.leadManagement?.tabHeadings?.summaryOrChart}
                            </StyledActiveTabText>
                        </StyledActiveTab>
                    </StyledTabsContainer>
                </Grid>
                {activeTab === "board" &&
                    <Grid item xs={9}>
                        <Grid container gap="16px" justifyContent={"end"}>
                            <Grid item xs={3}>
                                <SearchInput
                                    connectFilter={connectFilter}
                                    label={"Search"}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                {connectFilter('leadSourceId', {
                                    label: messages?.leadManagement?.labels?.source,
                                    enableClearable: true,
                                    options: leadSourceOptions?.map(mapIdNameToOptionWithoutCaptializing),
                                    searchOptions: leadSourceSearchOptions,
                                    autoApplyFilters: true,
                                    formatValue: (value?: number | string) =>
                                        leadSourceOptions?.map(mapIdNameToOptionWithoutCaptializing)
                                            .find((opt) => opt?.id === value),
                                    formatFilterValue: (value?: Option) => value?.id,
                                })(MaterialAutocompleteInput)}
                            </Grid>
                            <Grid item xs={2}>
                                {connectFilter('leadIndustryId', {
                                    label: messages?.leadManagement?.labels?.industry,
                                    enableClearable: true,
                                    options: leadIndustryOptions?.map(mapIdNameToOptionWithoutCaptializing),
                                    serachOptions: leadIndustrySearchOptions,
                                    autoApplyFilters: true,
                                    formatValue: (value?: number | string) =>
                                        leadIndustryOptions?.map(mapIdNameToOptionWithoutCaptializing)
                                            .find((opt) => opt?.id === value),
                                    formatFilterValue: (value?: Option) => value?.id,
                                })(MaterialAutocompleteInput)}
                            </Grid>
                            <Grid item display={"flex"} alignItems={"center"}>
                                <Grid container display={"flex"}>
                                    <StyledSwitchIcon1 item
                                        isTableView={isTableView}
                                        onClick={() => setIsTableView(!isTableView)}
                                    >
                                        <StyledTableChartOutlinedIcon color={!isTableView ? '#fff' : greyScaleColour.secondaryMain} />
                                    </StyledSwitchIcon1>
                                    <StyledSwitchIcon2 item
                                        isTableView={isTableView}
                                        onClick={() => {
                                            setIsTableView(!isTableView)
                                        }}
                                    >
                                        <img
                                            src={isTableView ?
                                                '/assets/images/switch1.svg'
                                                : '/assets/images/switch2.svg'}
                                        />
                                    </StyledSwitchIcon2>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>}
            </StyledMainHeadingContainer>
            {
                activeTab === 'board'
                    ? (
                        isTableView
                            ? <>
                                <LeadBoardTable
                                    leadData={leadManagement}
                                    updateFilters={updateFilters}
                                    applyFilters={applyFilters}
                                    fetchPage={fetchPage}
                                    updateLimit={updateLimit}
                                />
                            </>
                            : <LeadBoard
                                leadData={leadManagement?.records}
                                applyFilters={applyFilters}
                            />
                    )
                    : (
                        <Summary />
                    )
            }
        </Container >
    )
};

export default LeadManagement;