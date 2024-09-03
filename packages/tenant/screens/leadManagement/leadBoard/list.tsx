import React, { useState, useCallback, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import update from 'immutability-helper';
import DragCard from './dragCard';
import { Divider, Grid } from '@mui/material';
import {
    StyledAddCircleOutlinedIcon,
    StyledListContainer,
    StyledListItemsContainer,
    StyledListItemsCount,
    StyledListItemsCountContainer,
    StyledListTitle
} from './styles';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { routes } from '../../../utils';
import { apiCall } from '../../../redux/actions';
import { HttpMethods } from '@wizehub/common/utils';
import { FEE_WONS_API, TENANT_CLIENT } from '../../../api';
import { useSelector } from 'react-redux';
import { ReduxState } from '../../../redux/reducers';
import { ClientEntity } from '@wizehub/common/models/genericEntities';
import { usePopupReducer } from '@wizehub/common/hooks';
import { Modal } from '@wizehub/components';
import ClientDetailsModal from './clientDetailsModal';

interface ListProps {
    id: string;
    list: ClientEntity[];
    title: string;
    applyFilters: (loadMore?: boolean) => void;
}

const List: React.FC<ListProps> = ({ id, list, title, applyFilters }) => {
    const reduxDispatch = useDispatch();
    const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
    const [cards, setCards] = useState<ClientEntity[]>(list);
    const [draggedCard, setDraggedCard] = useState<ClientEntity>(null);

    const {
        visibility: formVisibility,
        showPopup: showForm,
        hidePopup: hideForm,
        metaData: config,
    } = usePopupReducer();

    const updateClientType = async (card: ClientEntity, type: string) => {
        return new Promise<void>((resolve, reject) => {
            reduxDispatch(
                apiCall(
                    `${TENANT_CLIENT}/${card?.id}`,
                    resolve,
                    reject,
                    HttpMethods.PATCH,
                    {
                        ...card,
                        tenantId,
                        clientType: type?.toUpperCase()
                    }
                )
            );
        })
            .then(() => {
                applyFilters();
                if (id === "Client") {
                    setDraggedCard(card);
                    if(card?.clientManager?.id){
                        showForm();
                    }
                }
            })
            .catch(() => { });
    }

    const pushCard = useCallback(async (card: ClientEntity, id: string) => {
        setCards(prevCards => update(prevCards, {
            $push: [card]
        }));
        await updateClientType(card, id);
    }, []);

    const removeCard = useCallback((index: number) => {
        setCards(prevCards => update(prevCards, {
            $splice: [
                [index, 1]
            ]
        }));
    }, []);

    const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
        const dragCard = cards[dragIndex];
        setCards(prevCards => update(prevCards, {
            $splice: [
                [dragIndex, 1],
                [hoverIndex, 0, dragCard]
            ]
        }));
    }, [cards]);

    const [{ isOver, canDrop }, drop] = useDrop({
        accept: 'CARD',
        drop: (item: any) => {
            if (id !== item.listId) {
                pushCard(item.card, id);
            }
            return { listId: id };
        },
        collect: monitor => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        })
    });

    useEffect(() => {
        setCards(list);
    }, [list])

    return (
        <>
            <StyledListContainer ref={drop}>
                <Grid container display='flex' alignItems='center' justifyContent='space-between'>
                    <Grid item>
                        <Grid container display={"flex"} gap="10px" alignItems={"center"}>
                            <Grid item>
                                <StyledListTitle>
                                    {title}
                                </StyledListTitle>
                            </Grid>
                            <StyledListItemsCountContainer item>
                                <StyledListItemsCount>
                                    {cards.length}
                                </StyledListItemsCount>
                            </StyledListItemsCountContainer>
                        </Grid>
                    </Grid>
                    {id !== 'Prospect' &&
                        <Grid item display={"flex"} alignItems="center">
                            <StyledAddCircleOutlinedIcon onClick={() => {
                                reduxDispatch(push({
                                    pathname: `${routes.leadManagement.root}/add`,
                                    state: { type: id === "Lead" ? 'Lead' : 'Client' }
                                }))
                            }} />
                        </Grid>}
                </Grid>
                <Divider />
                <StyledListItemsContainer>
                    {cards.map((card: ClientEntity, i: number) => (
                        <DragCard
                            key={card.id}
                            index={i}
                            listId={id}
                            card={card}
                            moveCard={moveCard}
                            removeCardFromSource={removeCard}
                        />
                    ))}
                </StyledListItemsContainer>
            </StyledListContainer>

            <Modal
                show={formVisibility}
                heading={"Client details"}
                onClose={hideForm}
                fitContent
            >
                <ClientDetailsModal
                    onCancel={hideForm}
                    onSuccess={hideForm}
                    card={draggedCard}
                    endpoint={FEE_WONS_API}
                />
            </Modal>
        </>
    );
};

export default List;