import { MetaData } from "@wizehub/common/models";
import { Card, MultiTabComponent, Table } from "@wizehub/components";
import React, { useEffect, useState } from "react";
import { clientTypeFormat } from "./dragCard";
import messages from "../../../messages";
import { StyledMultiTabContainer } from "../../firmProfile/styles";
import { ClientEntity } from "@wizehub/common/models/genericEntities";
import { dateFormatterFunction } from "@wizehub/common/utils";

interface Props {
    leadData: any;
    updateFilters: (filter: Partial<MetaData<any>>) => void;
    applyFilters: (loadMore?: boolean) => void;
    fetchPage: (page?: number) => void;
    updateLimit: (limit?: number) => void;
}

const leadBoardTabs = [
    {
        id: 'lead',
        label: "Lead"
    },
    {
        id: 'prospect',
        label: "Prospect"
    },
    {
        id: 'client',
        label: "Client"
    }
];


const LeadBoardTable: React.FC<Props> = ({
    leadData, updateFilters, applyFilters, fetchPage, updateLimit
}) => {
    const [activeTab, setActiveTab] = useState<string>(leadBoardTabs[0]?.id);
    const [clientData, setClientData] = useState<{
        lead: ClientEntity[] | [],
        prospect: ClientEntity[] | [],
        client: ClientEntity[] | [],
    }>({
        lead: [],
        prospect: [],
        client: []
    });

    const getClientFitleredData = (type: string) => leadData?.records?.filter((item: any) => item?.leadStage?.name === type);

    useEffect(() => {
        const leadRecords = getClientFitleredData("Lead");
        const prospectRecords = getClientFitleredData("Prospect");
        const clientRecords = getClientFitleredData("Client");

        setClientData((prevState) => ({
            ...prevState,
            lead: leadRecords,
            prospect: prospectRecords,
            client: clientRecords
        }))
    }, [leadData])

    return (
        <>
            <StyledMultiTabContainer>
                <MultiTabComponent
                    tabs={leadBoardTabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            </StyledMultiTabContainer>
            <Card
                noHeader
                cardCss={{ margin: "0 20px" }}
            >
                <Table
                    specs={[
                        {
                            id: "contactName",
                            label: messages?.leadManagement?.labels?.builderName,
                        },
                        {
                            id: "businessName",
                            label: messages?.leadManagement?.labels?.contactName,
                        },
                        {
                            id: "clientManager",
                            label: messages?.leadManagement?.labels?.clientManager,
                            getValue: (row) => (row.clientManager?.firstName && row?.clientManager?.lastName)
                                ? `${row?.clientManager?.firstName} ${row?.clientManager?.lastName}`
                                : '-',
                        },
                        {
                            id: "updatedOn",
                            label: messages?.leadManagement?.labels?.dateUpdated,
                            getValue: (row: any) => row?.updatedOn,
                            format: (row: any) => dateFormatterFunction(row, "DD MMMM YYYY")
                        },
                        {
                            id: "leadIndustry",
                            label: messages?.leadManagement?.labels?.industry,
                            getValue: (row: any) => row?.leadIndustry?.name || '-'
                        },
                        {
                            id: "leadSource",
                            label: messages?.leadManagement?.labels?.source,
                            getValue: (row: any) => row.leadSource?.name || '-'
                        },
                        {
                            id: "annualFee",
                            label: messages?.leadManagement?.labels?.amount,
                            getValue: (row: any) => row?.annualFee,
                            format: (row: any) => `$${row}`
                        },
                    ]}
                    data={activeTab === leadBoardTabs?.[2]?.id
                        ? clientData?.client
                        : activeTab === leadBoardTabs?.[1]?.id
                            ? clientData?.prospect
                            : clientData?.lead
                    }
                    metadata={leadData?.metadata}
                    fetchPage={fetchPage}
                    updateLimit={updateLimit}
                    disableSorting={["type", "clientManager", "dateUpdated", "clientType", "amount"]}
                    updateFilters={(filterParams: any) => {
                        updateFilters(filterParams);
                        applyFilters();
                    }}
                />
            </Card>
        </>
    )
};

export default LeadBoardTable;