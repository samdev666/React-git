import { Grid, Typography } from "@mui/material";
import { respondTo } from "@wizehub/common/theme/style.layout";
import { brandColour, greyScaleColour } from "@wizehub/common/theme/style.palette";
import { fontSize, fontWeight } from "@wizehub/common/theme/style.typography";
import styled from "styled-components";

export const StyledBusinessUpperContainerHeading = styled(Typography)`
    font-size: ${fontSize.h1} !important;
    font-weight: ${fontWeight.semiBold} !important;
    color: ${brandColour.primaryMain} !important;
`;

export const StyledBusinessBottomContainer = styled(Grid)`
    display: flex;
    flex-direction: column !important;
    gap: 31px;
    padding: 30px 20px;
    justify-content: center;
    align-items: center;
    border-radius: 24px;
    border: 1px solid ${brandColour.primary90};
    width: 525px !important;
    background-color: ${brandColour.primary70};
    ${respondTo.mdDown} {
        gap: 24px;
      }
`;

export const StyledBusinessBottomContainerHeading = styled(Typography)`
    font-size: ${fontSize.h2} !important;
    font-weight: ${fontWeight.medium} !important;
    color: ${greyScaleColour.secondaryMain} !important;
    text-align: center;
    ${respondTo.mdDown} {
        font-size: ${fontSize.h3} !important;
    }
`;

export const StyledModalContainer = styled(Grid)`
    padding: 50px 40px;
    gap: 40px;
    justify-content: center;
    width: 605px !important;
`;