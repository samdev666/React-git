import React from "react";
import { Card, MaterialAutocompleteInput, SearchInput, Table } from "@wizehub/components";
import { Box, Divider, Grid, Typography } from "@mui/material";
import messages from "../../messages";
import { useOptions, usePagination } from "@wizehub/common/hooks";
import {
    ClientClassEntity,
    ClientEntity,
    ClientPortfolioEntity,
    PersonBasicDetailEntity
} from "@wizehub/common/models/genericEntities";
import { paginatedLeadManagement } from "../leadManagement/leadManagement";
import { GET_TENANT_CLIENTS, PEOPLE_LISTING_API } from "../../api";
import { useSelector } from "react-redux";
import { ReduxState } from "../../redux/reducers";
import { MetaData, Option, getDefaultMetaData } from "@wizehub/common/models";
import { StyledVisibilityIcon } from "@wizehub/components/table/styles";
import { push } from "connected-react-router";
import { routes } from "../../utils";
import { useDispatch } from "react-redux";
import { formatCurrency, mapIdFullNameToOption, mapIdNameToOptionWithoutCaptializing } from "@wizehub/common/utils";
import {
    StyledFooter,
    StyledFooterContent,
    StyledFooterHeading,
    StyledFooterText,
    StyledHeadingText,
    StyledMiddleContainer,
    StyledMiddleSubContainer,
    StyledTableRowFooter
} from "./styles";
import { brandColour, greyScaleColour } from "@wizehub/common/theme/style.palette";

interface Props {
    clientClassOptions: ClientClassEntity[];
    clientPortfolioData: ClientPortfolioEntity[];
    calculateFeesCount: (isCAndD?: boolean) => number;
    calculateClassCount: (isCAndD?: boolean) => number;
}
export const getDefaultClientPortfolioFilter = (
    isClient: boolean,
    clientManagerId?: string,
    classId?: string
): MetaData<ClientEntity> => ({
    ...getDefaultMetaData<ClientEntity>(),
    order: "businessName",
    filters: {
        isClient: isClient,
        clientManagerId: clientManagerId,
        classId: classId,
    },
});

const TabularView: React.FC<Props> = ({
    clientClassOptions, clientPortfolioData, calculateFeesCount, calculateClassCount
}) => {
    const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
    const reduxDispatch = useDispatch();
    const {
        entity: leadManagement,
        connectFilter,
        updateFilters,
        applyFilters
    } = usePagination<ClientEntity>(
        {
            ...paginatedLeadManagement,
            api: GET_TENANT_CLIENTS.replace(":tenantId", tenantId),
        },
        getDefaultClientPortfolioFilter(true)
    );

    const {
        options: peopleOptions,
        searchOptions: peopleSearchOptions,
    } = useOptions<PersonBasicDetailEntity>(
        `${PEOPLE_LISTING_API.replace(":tenantId", tenantId)}`,
        true
    );

    const renderBreakUpComponent = (heading: string, content: string) => (
        <StyledFooterContent>
            <StyledFooterHeading>{heading}</StyledFooterHeading>
            <StyledFooterText>{content}</StyledFooterText>
        </StyledFooterContent>
    );

    const ABFeePercent = calculateFeesCount();
    const ABClientPercent = calculateClassCount();
    const CDFeePercent = calculateFeesCount(true);
    const CDClientPercent = calculateClassCount(true);

    const totalClientCount = clientPortfolioData?.reduce(
        (sum: number, item: ClientPortfolioEntity) => {
            return sum + (item.clientCount || 0);
        }, 0);

    const totalFeeCount = clientPortfolioData?.reduce(
        (sum: number, item: ClientPortfolioEntity) => {
            return sum + (item.totalAnnualFee || 0);
        }, 0)

    return (
        <>
            <Card
                headerCss={{ display: "flex" }}
                header={
                    <Grid container margin="0 16px" xs={12}>
                        <Grid item xs={3}>
                            <SearchInput
                                connectFilter={connectFilter}
                                label={messages?.firmProfile?.people?.search}
                            />
                        </Grid>
                        <Grid
                            container
                            item
                            xs={7}
                            justifyContent="end"
                            marginLeft="auto"
                            gap={2}
                        >
                            <Grid xs={4} item>
                                {connectFilter("clientManagerId", {
                                    label: messages?.leadManagement?.labels?.clientManager,
                                    enableClearable: true,
                                    options: peopleOptions?.map(mapIdFullNameToOption),
                                    searchOptions: peopleSearchOptions,
                                    autoApplyFilters: true,
                                    formatValue: (value?: number | string) =>
                                        peopleOptions?.map(mapIdFullNameToOption)
                                            .find((opt) => opt?.id === value),
                                    formatFilterValue: (value?: Option) => value?.id,
                                })(MaterialAutocompleteInput)}
                            </Grid>
                            <Grid xs={3} item>
                                {connectFilter("classId", {
                                    label: messages?.clientPortfolio.class,
                                    enableClearable: true,
                                    options: clientClassOptions?.map(mapIdNameToOptionWithoutCaptializing),
                                    autoApplyFilters: true,
                                    formatValue: (value?: number | string) =>
                                        clientClassOptions?.map(mapIdNameToOptionWithoutCaptializing)
                                            .find((opt) => opt?.id === value),
                                    formatFilterValue: (value?: Option) => value?.id,
                                })(MaterialAutocompleteInput)}
                            </Grid>
                        </Grid>
                    </Grid>
                }
            >
                <Table
                    specs={[
                        {
                            id: "businessName",
                            label: messages?.clientPortfolio?.businessName,
                            hasTotal: true,
                            totalValue: <StyledTableRowFooter>
                                Total
                            </StyledTableRowFooter>
                        },
                        {
                            id: "clientManager",
                            label: messages?.leadManagement?.labels?.clientManager,
                            getValue: (row: ClientEntity) => (row.clientManager?.firstName && row?.clientManager?.lastName)
                                ? `${row?.clientManager?.firstName} ${row?.clientManager?.lastName}`
                                : '-',
                        },
                        {
                            id: "annualFee",
                            label: messages?.leadManagement?.labels?.annualFeesDollar,
                            getValue: (row: ClientEntity) => formatCurrency(row?.annualFee, false),
                            hasTotal: true,
                            totalValue: <StyledTableRowFooter>
                                {formatCurrency(leadManagement?.records?.reduce((sum: number, item: any) => {
                                    return sum + item?.annualFee;
                                }, 0), false)}
                            </StyledTableRowFooter>
                        },
                        {
                            id: "class",
                            label: messages?.clientPortfolio.class,
                            getValue: (row: ClientEntity) => row?.class?.name || '-'
                        }
                    ]}
                    data={leadManagement?.records}
                    metadata={leadManagement?.metadata}
                    disableSorting={["clientManager", "annualFee", "class"]}
                    updateFilters={(filterParams: any) => {
                        updateFilters(filterParams);
                        applyFilters();
                    }}
                    actions={[
                        {
                            id: "view",
                            component: <StyledVisibilityIcon />,
                            onClick: (row: ClientEntity) => {
                                reduxDispatch(
                                    push(`${routes.leadManagement.clientDetail.replace(':id', row?.id.toString())}`)
                                );
                            },
                        },
                    ]}
                    hasRowWithTotal={true}
                />
            </Card>

            <StyledMiddleContainer>
                <StyledMiddleSubContainer>
                    <StyledHeadingText color={greyScaleColour.secondaryMain}>
                        {messages?.clientPortfolio?.classCountPercent}
                    </StyledHeadingText>
                    <Card
                        noHeader
                        cardCss={{ margin: "10px 0px 0px 0px" }}
                    >
                        <Table
                            specs={[
                                {
                                    id: "name",
                                    label: messages?.clientPortfolio?.class,
                                    hasTotal: true,
                                    totalValue: <StyledTableRowFooter>
                                        Total
                                    </StyledTableRowFooter>
                                },
                                {
                                    id: "clientCount",
                                    label: messages?.clientPortfolio?.number,
                                    hasTotal: true,
                                    totalValue: <StyledTableRowFooter>
                                        {totalClientCount}
                                    </StyledTableRowFooter>
                                },
                                {
                                    id: "percent",
                                    label: messages?.clientPortfolio?.percent,
                                    getValue: (row: ClientPortfolioEntity) => row?.clientCount
                                        ? `${((row?.clientCount) / (totalClientCount) * 100).toFixed(2)}%` : '0%',
                                    hasTotal: true,
                                    totalValue: <StyledTableRowFooter>
                                        {totalClientCount > 0 ? '100%' : '0%'}
                                    </StyledTableRowFooter>
                                }
                            ]}
                            data={clientPortfolioData || []}
                            hasRowWithTotal={true}
                        />
                    </Card>
                </StyledMiddleSubContainer>
                <StyledMiddleSubContainer>
                    <StyledHeadingText color={greyScaleColour.secondaryMain}>
                        {messages?.clientPortfolio?.feesCountPercent}
                    </StyledHeadingText>
                    <Card
                        noHeader
                        cardCss={{ margin: "10px 0px 0px 0px" }}
                    >
                        <Table
                            specs={[
                                {
                                    id: "name",
                                    label: messages?.clientPortfolio?.class,
                                    hasTotal: true,
                                    totalValue: <StyledTableRowFooter>
                                        Total
                                    </StyledTableRowFooter>
                                },
                                {
                                    id: "totalAnnualFee",
                                    label: messages?.clientPortfolio?.feesDollar,
                                    hasTotal: true,
                                    totalValue: <StyledTableRowFooter>
                                        {totalFeeCount}
                                    </StyledTableRowFooter>
                                },
                                {
                                    id: "percent",
                                    label: messages?.clientPortfolio?.percent,
                                    getValue: (row: ClientPortfolioEntity) => row?.totalAnnualFee
                                        ? `${((row?.totalAnnualFee) / (totalFeeCount) * 100).toFixed(2)}%`
                                        : '0%',
                                    hasTotal: true,
                                    totalValue: <StyledTableRowFooter>
                                        {totalFeeCount > 0 ? '100%' : '0%'}
                                    </StyledTableRowFooter>
                                }
                            ]}
                            data={clientPortfolioData || []}
                            hasRowWithTotal={true}
                        />
                    </Card>
                </StyledMiddleSubContainer>
            </StyledMiddleContainer>

            <Card
                noHeader
                cardCss={{
                    padding: "18px 24px",
                    marginBottom: "20px",
                    background: greyScaleColour.grey60
                }}
                contentCss={{
                    gap: "10px"
                }}
            >
                <StyledHeadingText color={brandColour.primaryMain}>
                    {messages?.clientPortfolio?.clientBreakupAnalysis}
                </StyledHeadingText>
                <Divider />
                <StyledFooter>
                    <Box flex={1}>
                        {renderBreakUpComponent(
                            messages?.clientPortfolio?.aAndBDollar,
                            ABFeePercent ? `${ABFeePercent?.toFixed(2)}%` : '-'
                        )}
                    </Box>
                    <Box flex={1}>
                        {renderBreakUpComponent(
                            messages?.clientPortfolio?.numberOfClientsAandB,
                            ABClientPercent ? `${ABClientPercent?.toFixed(2)}%` : '-'
                        )}
                    </Box>
                    <Box flex={1}>
                        {renderBreakUpComponent(
                            messages?.clientPortfolio?.cAndDollar,
                            CDFeePercent ? `${CDFeePercent?.toFixed(2)}%` : '-'
                        )}
                    </Box>
                    <Box flex={1}>
                        {renderBreakUpComponent(
                            messages?.clientPortfolio?.numberOfClientsCandD,
                            CDClientPercent ? `${CDClientPercent?.toFixed(2)}%` : '-'
                        )}
                    </Box>
                </StyledFooter>
            </Card>
        </>
    );
};

export default TabularView;