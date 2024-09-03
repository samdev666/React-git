import { Box, Grid, Typography } from "@mui/material";
import { brandColour, greyScaleColour } from "@wizehub/common/theme/style.palette";
import styled from "styled-components";
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import { fontSize, fontWeight } from "@wizehub/common/theme/style.typography";
import AddIcon from '@mui/icons-material/Add';
import { respondTo } from "@wizehub/common/theme/style.layout";
import { Button, Form, FormRow } from "@wizehub/components";

export const DragDropContainer = styled(Box)`
    display: flex;
    // overflow-x: auto; add if extra column gets added
    white-space: nowrap;
    gap: 16px;
    // &::-webkit-scrollbar {
    //     display: none
    // }
`;

export const StyledListContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    border-radius: 6px;
    padding: 16px;
    // min-width: 405px; add if extra column gets added
    flex: 1;
    // height: fit-content;
    height: calc(100vh - 200px);
    background-color: ${greyScaleColour.grey60};
`;

export const StyledListTitle = styled(Typography)`
    font-size: ${fontSize.h4} !important;
    font-weight: ${fontWeight.medium} !important;
    color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledListItemsCountContainer = styled(Grid)`
    width: 24px;
    height: 24px;
    border-radius: 3px;
    border: 1px solid ${brandColour.primary90};
    padding: 4px 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${brandColour.primary70}
`;

export const StyledListItemsCount = styled(Typography)`
    font-size: ${fontSize.b2} !important;
    font-weight: ${fontWeight.bold} !important;
    color: ${brandColour.primaryMain} !important;
`;

export const StyledAddCircleOutlinedIcon = styled(AddCircleOutlinedIcon)`
    width: 28px !important;
    height: 28px !important;
    color: ${brandColour.primaryMain} !important;
    cursor: pointer;
`;

export const StyledListItemsContainer = styled.div`
    display: flex;
    gap: 12px;
    flex-direction: column !important;
    height: calc(100vh - 260px);
    overflow: auto;
    &::-webkit-scrollbar {
        display: none
    }
`;

export const StyledCardContainer = styled.div<{ isDragging: boolean }>`
    display: flex;
    flex-direction: column;
    padding: 12px;
    gap: 12px;
    border-radius: 12px;
    background-color: #fff;
    cursor: pointer;
    opacity: ${({ isDragging }) => isDragging ? 0 : 1}
`;

export const StyledUpperCardContainer = styled(Grid)`
    display: flex;
    flex-direction: column !important;
    gap: 10px;
    padding: 0px 4px;
`;

export const StyledCardHeading = styled(Typography)`
    font-size: 18px !important;
    font-weight: ${fontWeight.medium} !important;
    color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledCardSubHeadingContainer = styled(Grid)`
    display: flex;
    align-items: center;
`;

export const StyledCardSubHeading = styled(Typography)`
    font-size: ${fontSize.b3} !important;
    font-weight: ${fontWeight.semiBold} !important;
    color: ${greyScaleColour.grey100} !important;
`;

export const StyledCardSubHeadingText = styled(Typography)`
    font-size: ${fontSize.b2} !important;
    font-weight: ${fontWeight.medium} !important;
    color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledBottomCardContainer = styled(Grid)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 4px;
`;

export const StyledClientTypeContainer = styled(Grid)`
    display: flex;
    gap: 8px;
    align-item: center;
`;

export const StyledClientTypeSubContainer = styled(Grid)`
    border-radius: 6px;
    border: 1px solid ${brandColour.primaryMain};
    padding: 4px 10px;
    display: flex;
    gap: 8px;
    align-items: center;
`;

export const StyledDiversity3OutlinedIcon = styled(Diversity3OutlinedIcon)`
    width: 14px !important;
    height: 14px !important;
    color: ${brandColour.primaryMain} !important;
`;

export const StyledApartmentOutlinedIcon = styled(ApartmentOutlinedIcon)`
    width: 14px !important;
    height: 14px !important;
    color: ${brandColour.primaryMain} !important;
`;

export const StyledClientTypeText = styled(Typography)`
    font-size: ${fontSize.b2} !important;
    font-weight: ${fontWeight.bold} !important;
    color:${brandColour.primaryMain} !important;
`;

export const StyledAmountText = styled(Typography)`
    font-weight: ${fontWeight.semiBold} !important;
    color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledClientDetailContainer = styled(Grid)`
    display: flex;
    flex-direction: column !important;
    gap: 8px;
`;

export const StyledClientDetailHeading = styled(Typography)`
    color:${greyScaleColour.grey100} !important;
`;

export const StyledClientDetailSubHeading = styled(Typography)`
    font-size: ${fontSize.h5} !important;
    font-weight: ${fontWeight.medium} !important;
    color: ${greyScaleColour.secondaryMain} !important;
    word-break: break-all !important;
`;

export const StyledFilesContainer = styled(Grid)`
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap !important;
    background-color: ${greyScaleColour.grey60} !important;
    padding: 14px !important;
    border-radius: 11px;
    width: 263px;
`;

export const StyledFilesIconTextContainer = styled(Grid)`
    display: flex;
    gap: 14px;
    flexwrap: nowrap;
`;

export const StyledIconContainer = styled(Grid)`
    // width: 32px;
    // height: 32px;
`;

export const StyledFileTextContainer = styled(Grid)`
    display: flex;
    flex-direction: column !important;
    gap: 4px;
`;

export const StyledSeparator = styled.div`
    border: 1px dashed ${greyScaleColour.grey80};
`;

export const StyledFormActionButtonContainer = styled.div`
    display: flex;
    justify-content: end;
    margin: 20px 20px 20px 20px;
    gap: 16px
`;

export const StyledMeetingAgendaAddMoreIcon = styled(AddIcon)`
  width: 18px !important;
  height: 18px !important;
  color: ${brandColour?.primary100} !important;
`;

export const StyledAddText = styled(Typography)`
  font-weight: ${fontWeight.medium} !important;
  color: ${brandColour?.primary100} !important;
`;

export const StyledDetailTable = styled(Grid)`
  display: flex;
  flex-direction: column !important;
  gap: 20px !important;
  padding: 24px !important;
  ${respondTo.mdDown} {
    padding: 14px !important;
  }
`;

export const StyledNotesHeading = styled(Typography)`
    color: ${greyScaleColour.grey100} !important;
`;

export const StyledClientDetailsModalForm = styled(Form)`
    width: 562px;
`;

export const StyledClientDetailsModalFormRow = styled(FormRow)`
    margin-bottom: 16px;
`;

export const StyledClientDetailsModalHeading = styled(Typography)`
    color: ${greyScaleColour.grey100} !important;
`;

export const StyledClientDetailsModalText = styled(Typography)`
    font-size: ${fontSize.h5} !important;
    font-weight: ${fontWeight.medium} !important;
    color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledClientDetailsModalInfoHeading = styled(Typography)`
    font-weight: ${fontWeight.medium} !important;
    color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledClientDetailsModalSeparator = styled.div<{ borderColor: string, borderStyle?: string }>`
    border: ${(props) => `1px ${props.borderStyle || 'solid'} ${props.borderColor}`};
`;

export const StyledNoteDate = styled(Typography)`
    font-style: italic !important;
`;

export const StyledButton = styled(Button)`
    padding-right: 0px !important;
`;