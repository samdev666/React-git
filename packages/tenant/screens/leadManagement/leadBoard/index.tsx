import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import List from "./list";
import { Card } from "@wizehub/components";
import { DragDropContainer } from "./styles";
import messages from "../../../messages";
import { ClientEntity } from "@wizehub/common/models/genericEntities";

interface Props {
    leadData: ClientEntity[];
    applyFilters: (loadMore?: boolean) => void;
}

export const ItemTypes = {
    CARD: 'card',
};

export interface listEntity {
    id: string;
    title: string,
    items: ClientEntity[];
}

const initialList: listEntity[] = [
    {
        id: 'Lead',
        title: messages?.leadManagement?.labels?.leads,
        items: []
    },
    {
        id: 'Prospect',
        title: messages?.leadManagement?.labels?.prospects,
        items: []
    },
    {
        id: 'Client',
        title: messages?.leadManagement?.labels?.clients,
        items: []
    }
];

const LeadBoard: React.FC<Props> = ({ leadData, applyFilters }) => {
    const [list, setList] = useState<listEntity[]>(initialList);

    useEffect(() => {
        const updatedList = initialList.map((listItem: listEntity) => ({
            ...listItem,
            items: leadData?.filter((ele: ClientEntity) => ele?.leadStage?.name === listItem.id && !listItem.items.some((item: any) => item.id === ele.id))
        }));

        setList(updatedList);
    }, [leadData]);

    return (
        <Card
            cardCss={{
                margin: '0 20px',
                border: 'none',
                overflow: 'visible !important'
            }}
            noHeaderPadding
        >
            <DndProvider backend={HTML5Backend}>
                <DragDropContainer>
                    {list?.map((list: listEntity) => (
                        <List key={list.id} id={list.id} list={list.items} title={list.title} applyFilters={applyFilters} />
                    ))}
                </DragDropContainer>
            </DndProvider>
        </Card>
    );
};

export default LeadBoard;