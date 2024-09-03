import { Typography } from "@mui/material";
import { brandColour, greyScaleColour, otherColour } from "@wizehub/common/theme/style.palette";
import { fontSize, fontWeight } from "@wizehub/common/theme/style.typography";
import styled from "styled-components";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Button } from "@wizehub/components";

export const StyledLostClientFormFooterContainer = styled.div`
    display: flex;
    gap: 11px;
    flex-direction: column;
    margin-top: 16px;
`;

export const StyledLostClientFormFooterSubContainer = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
`;

export const StyledLostClientFormFooterHeading = styled(Typography)`
    font-size: ${fontSize.h4} !important;
    font-weight: ${fontWeight.medium} !important;
    color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledLostClientFormFooterSubHeading = styled(Typography)`
    color: ${greyScaleColour.grey100} !important;
`;

export const StyledTotalTypography = styled(Typography)`
  font-size: ${fontSize.b2} !important;
  font-weight: ${fontWeight.bold} !important;
  color: ${greyScaleColour.secondaryMain} !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
`;

export const StyledNoTeamPopupContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 24px;
`;

export const StyledNoTeamPopupBody = styled(Typography)`
  font-size: 18px !important;
  font-weight: ${fontWeight.medium} !important;
  color: ${greyScaleColour.secondaryMain} !important;
  text-align: center !important;
`;

export const StyledNoTeamPopupButtonContainer = styled.div`
    text-align: center;
`;

export const StyledEditIcon = styled(EditOutlinedIcon)`
  color: ${greyScaleColour.secondaryMain} !important;
  cursor: pointer;
`;

export const StyledDeleteIcon = styled(DeleteOutlineOutlinedIcon)`
    color: ${otherColour.errorDefault};
    cursor: pointer;
`;

export const StyledFeeWonAndLostButton = styled(Button)`
    border: 1px solid ${brandColour.primary90} !important;
    color: ${greyScaleColour.secondaryMain} !important;
    background-color: #5088ff0a !important;
`;

export const StyledTextContainer = styled.div`
    width: 100%;
    height: 118px;
`;