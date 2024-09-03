import { Chip, Typography } from "@mui/material";
import { brandColour, greyScaleColour } from "@wizehub/common/theme/style.palette";
import { fontSize, fontWeight } from "@wizehub/common/theme/style.typography";
import styled from "styled-components";
import AddIcon from '@mui/icons-material/Add';

export const StyledPolicyNameContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

export const StyledPolicyName = styled(Typography)`
    font-weight: ${fontWeight.medium} !important;
    color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledPolicyNameChip = styled(Chip)`
    background-color: ${brandColour.primary70} !important;
    color: ${brandColour.primaryMain} !important;
    border-radius: 4px;
    padding: 4px;
`;

export const StyledPolicyNameChipText = styled(Typography)`
    font-size: ${fontSize.b2} !important;
`;

export const StyledPolicyAddMoreContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    cursor: pointer;
    &:hover {
        & .MuiTypography-root,
        & .MuiSvgIcon-root {
        color: ${brandColour.primaryDark} !important;
        }
    }
`;

export const StyledPolicyAddMoreIcon = styled(AddIcon)`
  width: 10.5px !important;
  height: 10.5px !important;
  color: ${brandColour?.primaryMain} !important;
`;

export const StyledPolicyAddMoreText = styled(Typography)`
  color: ${brandColour?.primaryMain} !important;
  font-weight: ${fontWeight?.medium} !important;
`;

export const StyledPolicyAnchorTag = styled.a`
  color: ${brandColour.primaryMain};
  cursor: pointer;
  border-width: 2px;
`;

export const StyledPolicyFormLabels = styled(Typography)`
  color: ${greyScaleColour?.secondaryMain} !important;
  font-weight: ${fontWeight?.semiBold} !important;
  font-size: ${fontSize?.h5} !important;
`;