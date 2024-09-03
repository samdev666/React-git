import { Id, MetaData, Option, PaginatedEntity, getDefaultMetaData } from "@wizehub/common/models";
import React, { useEffect } from "react";
import { POLICIES_AND_PROCEDURES } from "../../redux/actions";
import { POLICIES_AND_PROCEDURES_LISTING_API } from "../../api";
import { PoliciesAndProceduresEntity } from "@wizehub/common/models/genericEntities";
import { usePagination } from "@wizehub/common/hooks";
import { Card, CheckboxComponent, MaterialAutocompleteInput, SearchInput } from "@wizehub/components";
import Table from "@wizehub/components/table";
import { Chip, Grid } from "@mui/material";
import messages from "../../messages";
import { capitalizeEntireString, capitalizeLegend, dateFormatterFunction } from "@wizehub/common/utils";
import { StyledVisibilityIcon } from "@wizehub/components/table/styles";
import { useSelector } from "react-redux";
import { ReduxState } from "../../redux/reducers";
import { PolicyProcedureStatus } from "@wizehub/common/models/modules";
import { greyScaleColour, otherColour } from "@wizehub/common/theme/style.palette";
import { StyledPolicyName, StyledPolicyNameChip, StyledPolicyNameChipText, StyledPolicyNameContainer } from "./styles";
import { push } from "connected-react-router";
import { routes } from "../../utils";
import { useDispatch } from "react-redux";
import { PolicyStatusOptions } from "../../utils/constant";

interface Props {
    divisionId: Id;
}

const paginatedPoliciesAndProcedures: PaginatedEntity = {
    key: 'policiesAndProcedures',
    name: POLICIES_AND_PROCEDURES,
    api: POLICIES_AND_PROCEDURES_LISTING_API,
};

const getDefaultPoliciesAndProceduresFilter = (
    divisionId?: string,
    status?: string,
    isRecentPolicy?: boolean,
): MetaData<PoliciesAndProceduresEntity> => ({
    ...getDefaultMetaData<PoliciesAndProceduresEntity>(),
    order: 'name',
    filters: {
        divisionId,
        status,
        isRecentPolicy
    }
});

const getStatusColor = (status: PolicyProcedureStatus | string) => {
    switch (status) {
        case PolicyProcedureStatus.approved:
            return {
                backgroundColor: otherColour.successBg,
                color: otherColour.successDefault
            }
        case PolicyProcedureStatus.inReview:
            return {
                backgroundColor: otherColour.warningBg,
                color: otherColour.warning
            }
        case PolicyProcedureStatus.archived:
            return {
                backgroundColor: otherColour.informationBg,
                color: otherColour.information
            }
        default:
            return {
                backgroundColor: greyScaleColour.grey60,
                color: greyScaleColour.grey100
            }
    }
}

export const formatPolicyProcedureStatus = (status: PolicyProcedureStatus | string) =>
    status ? (
        <Chip
            label={capitalizeLegend(status)}
            sx={{
                backgroundColor: getStatusColor(status)?.backgroundColor,
                borderRadius: "4px",
                padding: "4px 8px",
                color: getStatusColor(status)?.color,
            }}
        />
    ) : (
        "-"
    );

const formatPolicyName = (row: PoliciesAndProceduresEntity) => (
    <StyledPolicyNameContainer>
        <StyledPolicyName>{row?.name}</StyledPolicyName>
        <StyledPolicyNameChip
            label={<StyledPolicyNameChipText>
                {messages?.execute?.policiesAndProcedures?.newText}
            </StyledPolicyNameChipText>}
        />
    </StyledPolicyNameContainer>
);

const PolicyProcedureCommonScreen: React.FC<Props> = ({
    divisionId
}) => {
    const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
    const reduxDispatch = useDispatch();
    const {
        entity: policiesAndProcedures,
        updateFilters,
        applyFilters,
        connectFilter,
        fetchPage,
        updateLimit,
    } = usePagination<PoliciesAndProceduresEntity>(
        {
            ...paginatedPoliciesAndProcedures,
            api: POLICIES_AND_PROCEDURES_LISTING_API.replace(':tenantId', tenantId)
        },
        getDefaultPoliciesAndProceduresFilter(divisionId !== 'all' && divisionId?.toString()),
    );


    useEffect(() => {
        updateFilters({ filters: { divisionId: divisionId !== 'all' ? divisionId?.toString() : '' } });
        applyFilters();
    }, [divisionId]);

    return (
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
                        xs={8}
                        justifyContent="end"
                        alignItems="center"
                        marginLeft="auto"
                        gap={1}
                    >
                        <Grid xs={2} item>
                            {connectFilter("status", {
                                label: messages?.execute?.policiesAndProcedures?.showArchived,
                                autoApplyFilters: true,
                                formatFilterValue: (value: boolean) => value && PolicyProcedureStatus.archived,
                            })(CheckboxComponent)}
                        </Grid>
                        <Grid xs={2} item>
                            {connectFilter("isRecentPolicy", {
                                label: messages?.execute?.policiesAndProcedures?.recentlyAdded,
                                autoApplyFilters: true,
                            })(CheckboxComponent)}
                        </Grid>
                        <Grid xs={2} item>
                            {connectFilter("status", {
                                label: messages?.firmProfile?.teamStructure?.status,
                                enableClearable: true,
                                options: PolicyStatusOptions,
                                autoApplyFilters: true,
                                formatValue: (value?: number | string) => PolicyStatusOptions?.find((opt) => opt?.id === value),
                                formatFilterValue: (value?: Option) => capitalizeEntireString(value?.id),
                            })(MaterialAutocompleteInput)}
                        </Grid>
                    </Grid>
                </Grid>
            }
            cardCss={{
                margin: "0 20px",
                overflow: "visible !important",
                marginBottom: "20px",
            }}
        >
            <Table
                specs={[
                    {
                        id: "policyName",
                        label: messages?.execute?.policiesAndProcedures?.policyName,
                        getValue: (row: PoliciesAndProceduresEntity) => row,
                        format: (row: PoliciesAndProceduresEntity) =>
                            row
                                ? (row?.isRecent
                                    ? formatPolicyName(row)
                                    : row?.name)
                                : "-",
                    },
                    {
                        id: "author",
                        label: messages?.execute?.policiesAndProcedures?.author,
                        getValue: (row: PoliciesAndProceduresEntity) => `${row?.author?.firstName} ${row?.author?.lastName || ''}`,
                    },
                    {
                        id: "dateUpdated",
                        label: messages?.execute?.policiesAndProcedures?.dateUpdated,
                        getValue: (row: PoliciesAndProceduresEntity) => row?.updatedOn
                            ? dateFormatterFunction(row?.updatedOn, 'DD MMMM YYYY') : "-",
                    },
                    {
                        id: "status",
                        label: messages?.firmProfile?.teamStructure?.form?.table?.status,
                        getValue: (row: PoliciesAndProceduresEntity) => row?.status,
                        format: (row: PolicyProcedureStatus) => formatPolicyProcedureStatus(row),
                    },
                ]}
                data={policiesAndProcedures?.records}
                metadata={policiesAndProcedures?.metadata}
                actions={[
                    {
                        id: "view",
                        component: <StyledVisibilityIcon />,
                        onClick: (row: PoliciesAndProceduresEntity) => {
                            reduxDispatch(
                                push(
                                    routes.policiesAndProcedures?.policiesAndProceduresDetail.replace(':id', row?.id?.toString())
                                )
                            )
                        },
                    },
                ]}
                fetchPage={fetchPage}
                updateLimit={updateLimit}
                disableSorting={["status"]}
                updateFilters={(filterParams: any) => {
                    updateFilters(filterParams);
                    applyFilters();
                }}
            />
        </Card>
    )
};

export default PolicyProcedureCommonScreen;