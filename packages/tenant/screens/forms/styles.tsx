import { Box, Grid, InputLabel, Typography } from "@mui/material";
import { respondTo } from "@wizehub/common/theme/style.layout";
import { brandColour, greyScaleColour } from "@wizehub/common/theme/style.palette";
import { fontSize, fontWeight } from "@wizehub/common/theme/style.typography";
import { Card, Form, FormRow } from "@wizehub/components";
import styled from "styled-components";

export const StyledFormSectionHeadingContainer = styled(Grid)`
    display: flex;
    flex-direction: column !important;
    padding: 0px 24px;
    gap: 4px;
    ${respondTo.mdDown} {
        padding: 0px 14px;
      }
`;

export const StyledFormSectionTitle = styled(Typography)`
    font-size: ${fontSize.h2} !important;
    font-weight: ${fontWeight.medium} !important;
    color: ${greyScaleColour.secondaryMain} !important;
    ${respondTo.mdDown} {
        font-size: ${fontSize.h3} !important;
      }
`;

export const StyledFormSubSectionTitle = styled(Typography)`
    color: ${greyScaleColour.grey100} !important;
`;

export const StyledHeadingsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
`;

export const StyledFormSectionRowTitle = styled(InputLabel)`
    font-size: ${fontSize.h5} !important;
    color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledFormSectionRowSubTitle = styled(InputLabel)`
    color: ${greyScaleColour.grey100} !important;
`;

export const StyledSeparator = styled.div<{ marginTop?: string }>`
    border: 1px dashed ${greyScaleColour.grey80};
    width: 100%;
    margin-top: ${(props) => props.marginTop};
`;

export const StyledQuestionTitle = styled(Typography)`
    font-size: ${fontSize.h5} !important;
    color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledWizeGapForm = styled(Form)`
    gap: 30px;
    ${respondTo.mdDown} {
        gap: 16px;
    }
`;

export const StyledWizeGapFormCard = styled(Card)`
    & .MuiCardContent-root {
        padding: 24px !important;
        gap: 32px;
        width: calc(100% - 48px);
        max-height: none !important;
        min-height: 100% !important;
        ${respondTo.mdDown} {
            padding: 14px !important;
            gap: 16px;
            width: calc(100% - 24px);
        }
    }
`;

export const StyledCalculationContainer = styled(Box)`
    padding: 24px;
    background-color: ${greyScaleColour.grey60};
    border-radius: 10px;
`;

export const StyledCalculationItemContainer = styled(Grid)`
    display: flex;
    flex-direction: column !important;
    gap: 8px;
`;

export const StyledCalculationHeading = styled(Typography)`
    font-weight: ${fontWeight.medium} !important;
    color: ${greyScaleColour.grey100} !important;
`;

export const StyledCalculationAmount = styled(Typography)`
    font-weight: ${fontWeight.medium} !important;
    font-size: 18px !important;
    color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledFeeHistoryContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 30px;   
    ${respondTo.mdDown} {
       gap: 16px;
    }
`;

export const StyledFeeHistoryButtonContainer = styled(Grid)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
`;

export const StyledSubSectionHeading = styled(Typography)`
    font-size: 18px !important;
    font-weight: ${fontWeight.medium} !important;
    color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledScoreText = styled(Typography)`
    font-size: ${fontSize.h5} !important;
    font-weight: ${fontWeight.medium} !important;
    color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledScoreContainer = styled.div`
    padding: 4px 10px;
    border-radius: 4px;
    border: 1px solid ${greyScaleColour.grey90};
`;

export const StyledTotalScoreContainer = styled.div`
    width: 100%;
`;

export const StyledTotalScoreText = styled(Typography)`
    font-size: 18px !important;
    font-weight: ${fontWeight.medium} !important;
    color: ${brandColour.primaryMain} !important;
`;

export const StyledButtonFormRow = styled(FormRow)`
    margin-bottom: 14px !important;
`;