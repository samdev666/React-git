import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Divider, Grid } from '@mui/material';
import {
    StyledAmountText,
    StyledApartmentOutlinedIcon,
    StyledBottomCardContainer,
    StyledCardContainer,
    StyledCardHeading,
    StyledCardSubHeading,
    StyledCardSubHeadingContainer,
    StyledCardSubHeadingText,
    StyledClientTypeContainer,
    StyledClientTypeSubContainer,
    StyledClientTypeText,
    StyledDiversity3OutlinedIcon,
    StyledUpperCardContainer
} from './styles';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { routes } from '../../../utils';
import messages from '../../../messages';
import { ClientEntity } from '@wizehub/common/models/genericEntities';
import { formatCurrency, stringTrimWithNumberOfCharacters } from '@wizehub/common/utils';

interface DragCardProps {
    card: ClientEntity;
    index: number;
    listId: number | string;
    moveCard: (dragIndex: number, hoverIndex: number) => void;
    removeCardFromSource: (index: number) => void;
}

export const clientTypeFormat = (source: string, industry: string) => (
    (source && industry) && <StyledClientTypeContainer container>
        <StyledClientTypeSubContainer item>
            <StyledDiversity3OutlinedIcon />
            <StyledClientTypeText>
                {stringTrimWithNumberOfCharacters(source, 13)}
            </StyledClientTypeText>
        </StyledClientTypeSubContainer>

        <StyledClientTypeSubContainer item>
            <StyledApartmentOutlinedIcon />
            <StyledClientTypeText>
                {stringTrimWithNumberOfCharacters(industry, 13)}
            </StyledClientTypeText>
        </StyledClientTypeSubContainer>
    </StyledClientTypeContainer>
)

const DragCard: React.FC<DragCardProps> = ({ card, index, listId, moveCard, removeCardFromSource }) => {
    const ref = useRef<HTMLDivElement>(null);

    const reduxDispatch = useDispatch();

    const [{ isDragging }, drag] = useDrag({
        type: 'CARD',
        item: { card, index, listId },
        end: (item, monitor) => {
            const dropResult: any = monitor.getDropResult();
            if (dropResult && dropResult?.listId !== listId) {
                removeCardFromSource(index);
            }
        },
        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    });

    const [, drop] = useDrop({
        accept: 'CARD',
        hover: (draggedItem: any, monitor) => {
            const dragIndex = draggedItem.index;
            const hoverIndex = index;
            const sourceListId = draggedItem.listId;

            if (dragIndex === hoverIndex) {
                return;
            }

            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            if (!hoverBoundingRect) return;

            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = (clientOffset?.y ?? 0) - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            // for maintaining sorting within a list

            // if (listId === sourceListId) {
            //     moveCard(dragIndex, hoverIndex);
            //     draggedItem.index = hoverIndex;
            // }
        }
    });

    drag(drop(ref));

    return (
        <StyledCardContainer ref={ref} isDragging={isDragging} onClick={() => {
            reduxDispatch(push({
                pathname: routes.leadManagement.clientDetail.replace(':id', card?.id?.toString()),
                state: { showLeadData: true }
            }))
        }}>
            <StyledUpperCardContainer container>
                <Grid item>
                    <StyledCardHeading>
                        {card?.businessName}
                    </StyledCardHeading>
                </Grid>
                <Grid item>
                    <StyledCardSubHeadingContainer container columnGap={3}>
                        <Grid item>
                            <StyledCardSubHeading>
                                {messages?.leadManagement?.labels?.contactName}
                            </StyledCardSubHeading>
                            <StyledCardSubHeadingText>
                                {card?.contactName}
                            </StyledCardSubHeadingText>
                        </Grid>
                        <Grid item>
                            <StyledCardSubHeading>
                                {messages?.leadManagement?.labels?.allocatedClientManager}
                            </StyledCardSubHeading>
                            <StyledCardSubHeadingText>
                                {(card?.clientManager?.firstName && card?.clientManager?.lastName)
                                    ? `${card?.clientManager?.firstName} ${card?.clientManager?.lastName}`
                                    : '-'}
                            </StyledCardSubHeadingText>
                        </Grid>
                    </StyledCardSubHeadingContainer>
                </Grid>
            </StyledUpperCardContainer>

            <Divider />

            <StyledBottomCardContainer container>
                <Grid item>
                    {clientTypeFormat(card?.leadSource?.name, card?.leadIndustry?.name)}
                </Grid>
                <Grid item>
                    <StyledAmountText>
                        {`${formatCurrency(card?.annualFee)}`}
                    </StyledAmountText>
                </Grid>
            </StyledBottomCardContainer>
        </StyledCardContainer>
    );
};

export default DragCard;