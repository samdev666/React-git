import { Box, Divider, Grid, Link, Typography } from "@mui/material";
import { brand, brandColour, greyScaleColour, otherColour } from "@wizehub/common/theme/style.palette";
import { fontSize, fontWeight } from "@wizehub/common/theme/style.typography";
import styled from "styled-components";
import CheckIcon from '@mui/icons-material/Check';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { respondTo } from "@wizehub/common/theme/style.layout";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const StyledOnboardingContainer = styled(Grid)`
    display: flex;
    flex-direction: column !important;
    gap: 12px;
    ${respondTo.mdDown} {
        gap: 8px;
    }
    
`;

export const StyledOnboardingHeading = styled(Typography)`
    font-size: ${fontSize.h1} !important;
    font-weight: ${fontWeight.semiBold} !important;
    color: ${greyScaleColour.secondaryMain} !important;
    ${respondTo.mdDown} {
        font-size: ${fontSize.h2} !important;
    }
`;

export const StyledOnboardingSubHeading = styled(Typography)`
    font-size: ${fontSize.h5} !important;
    font-weight: ${fontWeight.medium} !important;
    color: ${greyScaleColour.grey100} !important;
`;

export const StyledOnboardingContentContainer = styled(Grid)`
    padding: 30px;
    border-radius: 12px;
    background-color: ${greyScaleColour.grey60};
    display: flex;
    height: 100%;
    ${respondTo.mdDown} {
        padding: 20px;
    }
`;

export const StyledOnboardingChartContainer = styled(Grid)`
    padding: 40px 0px;
    gap: 63px;
    height: 100%;
`;

export const StyledCheckIcon = styled(CheckIcon)`
    color: ${brand.white} !important;
    width: 15px !important;
    height: 15px !important;
`;

export const StyledOnboardingPhaseRowContainer = styled(Grid)`
    display: flex;
    justify-content: space-between;
`;

export const StyledPhaseHeading = styled(Typography)`
    font-size: ${fontSize.h4} !important;
    font-weight: ${fontWeight.medium} !important;
    color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledPhaseSubHeading = styled(Typography)`
    font-size: ${fontSize.h5} !important;
    color: ${greyScaleColour.grey100} !important;
`;

export const StyledImageContainer = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    width: 70px;
    height: 16px;
    transform: translate(-50%, -50%);
`;

export const AvatarContainer = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  width: 41px !important;
  height: 41px !important;
`;

export const StyledAvatarDiv = styled.div`
    border-radius: 50%;
    width: 41px !important;
    height: 41px !important;
    background-color: #5088FF38;
`;

export const StyledAccountHeading = styled(Typography)`
    font-weight: ${fontWeight.semiBold} !important;
    font-size: ${fontSize.h1} !important;
    color: ${brandColour.primaryMain} !important;
    ${respondTo.mdDown} {
        font-weight: ${fontWeight.medium} !important;
        font-size: ${fontSize.h2} !important;
    }
`;

export const StyledAccountSubHeading = styled(Typography)`
    font-weight: ${fontWeight.medium} !important;
    font-size: 18px !important;
    color: ${greyScaleColour.grey100} !important;
    width: 70%;
    ${respondTo.mdDown} {
        font-size: ${fontSize.h5} !important;
        width: 75%;
    }
`;

export const StyledWelcomText = styled(Typography)`
    font-weight: ${fontWeight.medium} !important;
    font-size: ${fontSize.h4} !important;
    color: ${greyScaleColour.secondaryMain} !important;
    width: 53%;
`;

export const StyledNumberContainer = styled.div`
    padding: 10px;
    border-radius: 4px;
    border: 1px solid ${greyScaleColour.grey80};
    display: inline-block !important;
`;

export const StyledNumberText = styled.div`
    font-weight: ${fontWeight.medium} !important;
    font-size: ${fontSize.h5} !important;
    color: ${greyScaleColour.grey100} !important;
`;

export const StyledBoxHeading = styled(Typography)`
    font-weight: ${fontWeight.medium} !important;
    font-size: ${fontSize.h4} !important;
    color: ${greyScaleColour.secondaryMain} !important;
    ${respondTo.mdDown} {
        font-size: 18px !important;
    }
`;

export const StyledBoxSubHeading = styled(Typography)`
    color: ${greyScaleColour.grey100} !important;
`;

export const StyledRightContainerHeading = styled(Typography)`
    font-weight: ${fontWeight.medium} !important;
    font-size: ${fontSize.h3} !important;
    color: ${greyScaleColour.secondaryMain} !important;
    ${respondTo.mdDown} {
        font-size: ${fontSize.h4} !important;
    }
`;

// export const StyledChartContainer = styled(Grid)`
//     padding: 28px 20px;
//     border-radius: 24px;
//     border: 1px solid ${brandColour.primary90};
//     display: flex !important;
//     flex-direction: column !important;
//     ${respondTo.mdDown} {
//         padding: 10px 20px;
//     }
// `;

export const StyledChartHeading = styled(Typography)`
    font-weight: ${fontWeight.semiBold} !important;
    font-size: 55px !important;
    color: ${brandColour.primaryMain} !important;
    margin-bottom: 31px;
    ${respondTo.mdDown} {
        font-size: ${fontSize.h1} !important;
        margin-bottom: 10px;
    }
`;

export const StyledChartSubHeading = styled(Typography)`
    font-weight: ${fontWeight.medium} !important;
    font-size: ${fontSize.h4} !important;
    color: ${greyScaleColour.grey100} !important;
    ${respondTo.mdDown} {
        font-size: ${fontSize.h5} !important;
        font-weight: ${fontWeight.regular} !important;
    }
`;

export const StyledAccoundReadyText = styled(Typography) <{ isDisable: boolean }>`
    font-weight: ${fontWeight.medium} !important;
    font-size: ${fontSize.h3} !important;
    color: ${(props) => props.isDisable ? greyScaleColour.grey70 : greyScaleColour.secondaryMain} !important;
    ${respondTo.mdDown} {
        font-size: ${fontSize.h4} !important;
    }
`;

export const StyleArrowForwardIcon = styled(ArrowForwardIcon) <{ isDisable: boolean }>`
    color: ${(props) => props.isDisable ? "##00000061" : brand.white} !important;
`;

export const StyledWizehubCommunityImageContainer = styled(Grid)`
    width: 415px;
    height: 379px;
    ${respondTo.mdDown} {
        width: 373px;
        height: 341px;
    }
`;

export const StyledWizehubCommunityImage = styled.img`
  width: 100%;
  height: 100%;
`;

export const StyledLeftBoxContainer = styled(Box)`
    flex: 3;
    max-height: 100vh;
    min-height: 100vh;
    padding: 0px 94px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // height: 100%; if not give max and min 100vh
    ${respondTo.mdDown} {
        padding: 0px 60px;
    }
`;

export const StyledAccountContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 26px;
    padding-top: 147px;
    ${respondTo.mdDown} {
        padding-top: 100px;
        gap: 18px;
    }
    ${respondTo.smDown} {
        padding-top: 60px;
        gap: 18px;
    }
`;

export const StyledWelcomBoxContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 22px;
    padding-bottom: 147px;
    ${respondTo.mdDown} {
        padding-bottom: 100px;  
    }
    ${respondTo.smDown} {
        padding-bottom: 60px;  
    }
`;

export const StyledPlanContainer = styled(Box)`
    display: flex;
    gap: 20px;
    ${respondTo.mdDown} {
        gap: 14px;
    }
`;

export const StyledPlanContentContainer = styled(Box)`
    flex: 1;
    border-radius: 6px;
    background-color: ${greyScaleColour.grey60};
    padding: 24px;
    gap: 26px;
    display: flex;
    flex-direction: column;
`;

export const StyledPlanText = styled(Box)`
    gap: 12px;
    display: flex;
    flex-direction: column;
`;

export const StyledRightBoxContainer = styled(Box)`
    flex: 1;
    max-height: 100vh;
    min-height: 100vh;
    padding: 0px 44px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: ${greyScaleColour.grey60};
    // height: 100%; if not give max and min 100vh
    ${respondTo.mdDown} {
        padding: 0px 24px;  
    }
`;

export const StyledToolContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-top: 66px;
    ${respondTo.mdDown} {
        padding-top: 30px;  
    }
`;

export const StyledChartContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    padding: 28px 20px;
    gap: 31px;
    border: 1px solid ${brandColour.primary90};
    border-radius: 24px;
    ${respondTo.mdDown} {
        padding: 10px 20px;  
    }
`;

export const StyledChartIconContainer = styled(Box)`
    text-align: center;
`;

export const StyledAccountReadyContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 24px;
    text-align: center;
    padding-bottom: 66px;
    ${respondTo.mdDown} {
        padding-bottom: 30px;
    }
`;

export const StyledSkipLink = styled(Link)`
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    gap: 2px;
    font-weight: ${fontWeight.medium} !important;
    font-size: ${fontSize.b1} !important;
    color: ${brandColour.primaryMain} !important;
`;

export const StyledSkipLinkText = styled(Typography)`
    display: inline-block !important;
    font-weight: ${fontWeight.medium} !important;
`;

export const StyledSkipArrowForwardIcon = styled(ArrowForwardIcon)`
    width: 18px !important;
    height: 18px !important;
`;

export const StyledFreedomStepsContainer = styled(Box)`
    display: flex;
    height: calc(100vh - 220px);
    padding: 110px 94px;
    gap: 100px;
     // height: '100vh',
    // padding: '0px 94px',
    ${respondTo.mdDown} {
        padding: 80px 60px;
    }
`;

export const StyledLeftStepsContainer = styled(Grid)`
    display: flex;
    flex-direction: column !important;
    gap: 32px;
    flex-wrap: nowrap !important;
`;

export const StyledLeftStepsHeadingContainer = styled(Grid)`
    display: flex;
    flex-direction: column !important;
    gap: 6px;
`;

export const StyledLeftStepsHeading1 = styled(Typography)`
    font-weight: ${fontWeight.medium} !important;
    font-size: 18px !important;
    color: ${greyScaleColour.grey100} !important;
`;

export const StyledLeftStepsHeading2 = styled(Typography)`
    font-weight: ${fontWeight.semiBold} !important;
    font-size: 55px !important;
    color: ${brandColour.primaryMain} !important;
    line-height: normal !important;
    ${respondTo.mdDown} {
        font-size: 40px !important;
    }
`;

export const StyledLeftStepsContentContainer = styled(Grid)`
    display: flex;
    flex-direction: column !important;
    gap: 14px;
    ${respondTo.mdDown} {
        gap: 10px;
    }
`;

export const StyledLeftStepsContentImageContainer = styled.div`
    width: 100%;
    max-width: 100%;
    height: 445px;
    ${respondTo.mdDown} {
        height: 360px;
    }
`;

export const StyledLeftStepsContentImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

export const StyledLeftStepsContentValue = styled(Typography)`
    font-size: ${fontSize.h5} !important;
    color: ${greyScaleColour.grey100} !important;
    font-style: italic !important;
`;

export const StyledLeftStepsContentName = styled.span`
    font-size: ${fontSize.h5} !important;
    font-weight: ${fontWeight.medium} !important;
    color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledRightStepsContainer = styled(Grid)`
    display: flex;
    flex-direction: column !important;
    gap: 90px;
    flex-wrap: nowrap !important;
    ${respondTo.mdDown} {
        gap: 50px;
    }
`;

export const StyledRightStepsFirstContainer = styled(Grid)`
    display: flex;
    gap: 26px;
    flex-wrap: nowrap !important;
`;

export const StyledRightStepsFirstSubContainer = styled(Grid)`
    display: flex;
    flex-direction: column !important;
    gap: 12px;
    padding: 28px 20px;
    border-radius: 6px;
    border: 1px solid ${brandColour.primary90};
    background-color: #5088ff0a;
    min-width: 250px;
    height: 100%;
    ${respondTo.mdDown} {
        padding: 24px 16px;
        gap: 10px;
    }
`;

export const StyledRightStepsFirstSubContainerHeading = styled(Typography)`
    font-size: ${fontSize.h5} !important;
    font-weight: ${fontWeight.medium} !important;
    color: ${greyScaleColour.grey100} !important;    
`;

export const StyledRightStepsFirstSubContainerSubHeading = styled(Typography)`
    font-size: ${fontSize.h3} !important;
    font-weight: ${fontWeight.medium} !important;
    color: ${greyScaleColour.secondaryMain} !important; 
    ${respondTo.mdDown} {
        font-size: ${fontSize.h4} !important;
     } 
`;

export const StyledDivider = styled(Divider)`
    color: ${greyScaleColour.grey80} !important;
`;

export const StyledRightStepsSecondContainer = styled(Grid)`
    display: flex;
    flex-direction: column !important;
    gap: 50px;
    flex-wrap: nowrap !important;
`;

export const StyledRightStepsSecondSubContainer = styled(Grid)`
    display: flex;
    flex-direction: column !important;
    gap: 40px;
    flex-wrap: nowrap !important;
     ${respondTo.mdDown} {
        gap: 30px;
     } 
`;

export const StyledRightStepsSecondSubContainerContent = styled(Grid)`
    display: flex;
    flex-direction: column !important;
    gap: 4px;
    flex-wrap: nowrap !important;
`;

export const StyledRightStepsSecondSubContainerHeading = styled(Typography)`
    font-size: ${fontSize.h1} !important;
    font-weight: ${fontWeight.semiBold} !important;
    color: ${brandColour.primaryMain} !important;
    line-height: normal !important;
    ${respondTo.mdDown} {
        font-size: ${fontSize.h2} !important;
     }
`;

export const StyledRightStepsSecondSubContainerSubHeading = styled(Typography)`
    font-size: ${fontSize.h4} !important;
    font-weight: ${fontWeight.medium} !important;
    color: ${greyScaleColour.grey100} !important; 
    line-height: normal !important;
    ${respondTo.mdDown} {
        font-size: 18px !important;
     }
`;

export const StyledStepsInfoContainer = styled(Grid)`
    display: flex;
    gap: 54px;
    flex-wrap: nowrap !important;
`;

export const StyledStepsInfoSubContainer = styled(Grid)`
    display: flex;
    flex-direction: column !important;
    gap: 54px;
    flex-wrap: nowrap !important;
`;

export const StyledStepsHeadingContainer = styled(Grid)`
    display: flex;
    gap: 16px;
`;

export const StyledCheckCircleIcon = styled(CheckCircleIcon)`
    width: 32px !important;
    height: 32px !important;
    color: ${otherColour.successLight} !important;
    ${respondTo.mdDown} {
        width: 26px !important;
        height: 26px !important;
     }
`;