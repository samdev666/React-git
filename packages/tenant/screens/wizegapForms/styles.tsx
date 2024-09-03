import { Grid, Typography } from "@mui/material";
import { respondTo } from "@wizehub/common/theme/style.layout";
import { brandColour, greyScaleColour } from "@wizehub/common/theme/style.palette";
import { fontSize, fontWeight } from "@wizehub/common/theme/style.typography";
import { Card } from "@wizehub/components";
import styled from "styled-components";

export const StyledWizeGapFormHeadingContainer = styled(Grid)`
    display: flex;
    flex-direction: column !important;
    gap: 12px;
    ${respondTo.mdDown} {
        gap: 8px
      }
`;

export const StyledBottomContainer = styled(Grid)`
    display: flex;
    flex-direction: column !important;
    gap: 31px;
    padding: 40px 20px;
    justify-content: center;
    align-items: center;
    border-radius: 24px;
    border: 1px solid ${brandColour.primary90};
    width: 685px !important;
    background-color: ${brandColour.primary70};
    ${respondTo.mdDown} {
        gap: 24px;
        padding: 32px 20px;
      }
`;

export const StyledBottomContainerHeading = styled(Typography)`
    font-size: ${fontSize.h1} !important;
    font-weight: ${fontWeight.semiBold} !important;
    color: ${greyScaleColour.secondaryMain} !important;
     ${respondTo.mdDown} {
        font-size: ${fontSize.h3} !important;
      }
`;

export const StyledBottomContainerSubHeading = styled(Typography)`
    font-size: 18px !important;
    font-weight: ${fontWeight.medium} !important;
    color: ${greyScaleColour.grey100} !important;
    ${respondTo.mdDown} {
        font-size: ${fontSize.h5} !important;
      }
`;

export const StyledBottomSubContainer = styled(Grid)`
    display: flex;
    flex-direction: column !important;
    gap: 30px;
    justify-content: center;
    align-items: center;
    background-color: ${brandColour.primary70};
    ${respondTo.mdDown} {
        gap: 16px;
      }
`;

export const StyledFormCompletionContainer = styled(Grid)`
    display: flex;
    flex-direction: column !important;
    gap: 40px;
    justify-content: center;
    align-items: center;
    ${respondTo.mdDown} {
        gap: 32px;
      }
`;

export const StyledWizegapSuccessIconContainer = styled.div`
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 1px 0px ${greyScaleColour.grey70};
   ${respondTo.mdDown} {
        height: 80px;
      }
`;

export const StyledUpperContainer = styled(Grid)`
    display: flex;
    flex-direction: column !important;
    gap: 10px;
    justify-content: center;
    align-items: center;
`;

export const StyledUpperContainerHeading = styled(Typography)`
    font-size: 55px !important;
    font-weight: ${fontWeight.semiBold} !important;
    color: ${brandColour.primaryMain} !important;
    ${respondTo.mdDown} {
        font-size: 40px !important;
      }
`;

export const StyledWizeGapCard = styled(Card)`
    border: none !important;
    padding: 0px 20px 10px 20px;
    & .MuiCardContent-root {
        padding: 10px 0px;        
    }
    ${respondTo.mdDown} {
        padding: 0px 20px 4px 20px;
        & .MuiCardContent-root {
            padding: 0px;
        }
      }
`;

export const StyleBottomSubContainer = styled(Grid)`
    display: flex;
    flex-direction: column !important;
    padding-bottom: 10px;
    gap: 22px;
`;

export const StyleBottomSubContentContainer = styled(Grid)`
    display: flex;
    flex-direction: column !important;
    gap: 6px;
`;

export const StyleBottomSubContainerHeading = styled(Typography)`
    font-weight: ${fontWeight.medium} !important;
    color: ${brandColour.primaryMain} !important;
    cursor: pointer;
`;

export const StyleBottomSubContainerSubHeading = styled(Typography)`
    color: ${greyScaleColour.grey100} !important;
`;
