import {
  Grid, Link, Typography, Chip, FormControlLabel,
} from '@mui/material';
import styled from 'styled-components';
import { respondTo } from '@wizehub/common/theme/style.layout';
import { fontSize, fontWeight } from '@wizehub/common/theme/style.typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  brand,
  colors,
  greyScaleColour,
} from '@wizehub/common/theme/style.palette';
import LoginBanner from '../../assets/images/Fluid-right.png';

export const StyledPanel = styled.div`
  display: flex;
  /* position: relative; */
  flex-direction: column;
  justify-content: space-between;
  width: 50%;
  height: calc(100vh - 48px);
  border-radius: 22px;
  background-size: contain;
  background-position: center left;
  background-repeat: no-repeat;
  background-image: url(${LoginBanner});
`;

export const StyledSidePanelLogoImage = styled.img`
  height: 31px;
  width: 133px;
`;

export const StyledSidePanelUpperMiddleText = styled(Typography)`
  font-weight: ${fontWeight.semiBold} !important;
  line-height: 60px !important;
  font-size: 55px !important;
  margin-bottom: 8px !important;
  color: ${greyScaleColour.white100} !important;
  height: 120px;
  width: 301px;
`;
export const StyledSidePanelLowerMiddleText = styled(Typography)`
  line-height: 20px !important;
  margin-bottom: 104px !important;
  color: ${greyScaleColour.white100} !important;
  width: 383px;
`;

export const StyledSidePanelLowerText = styled(Typography)`
  line-height: 18px !important;
  color: ${greyScaleColour.grey60} !important;
  width: 383px;
`;

export const StyledGridContainer = styled(Grid)`
  padding: 40px;
  padding-bottom: 142px;
  display: flex;
  flex-direction: column;
  color: white;
`;

export const StyledScreenWrapper = styled.div`
  display: flex;
  padding: 24px 34px;
  ${respondTo.mdDown} {
    gap: 20px;
  }
`;

export const StyledFormContainer = styled.div`
  margin: 0 auto;
  align-self: center;
  ${respondTo.mdDown} {
    width: fit-content;
  }
`;

export const StyledInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 340px;
`;
export const StyledFormHeading = styled(Typography)`
  font-weight: ${fontWeight.semiBold} !important;
  font-size: ${fontSize.h1} !important;
  margin-top: 18px !important;
  line-height: 41px !important;
`;
export const StyledFormSubHeading = styled(Typography)`
  margin-top: 18px !important;
  font-weight: ${fontWeight.regular} !important;
  font-size: ${fontSize.b1} !important;
  color: ${greyScaleColour.grey100};
  line-height: 20px !important;
`;
export const StyledLink = styled(Link)`
  font-size: ${fontSize.b2} !important;
  font-weight: ${fontWeight.regular} !important;
`;

export const StyledFormControlLabel = styled(FormControlLabel)`
  margin-left: 0px !important;
  color: ${greyScaleColour.grey100} !important;
`;

export const StyledLogoContainer = styled(Grid)`
  width: 141px;
  height: 37px;
`;

export const StyledLogo = styled.img`
  width: 100%;
`;

export const StyledPanelInfo = styled(Typography)`
  color: ${colors.white};
  font-size: 56px !important;
  font-weight: ${fontWeight.semiBold} !important;
  line-height: 120% !important;
  ${respondTo.mdDown} {
    font-size: 44px !important;
  }
`;
export const StyledPanelSubInfo = styled(Typography)<{
  fontsize?: string;
  fontweight?: number;
}>`
  color: ${colors.white};
  font-size: ${({ fontsize }) => fontsize || fontSize.b1} !important;
  font-weight: ${({ fontweight }) => fontweight || fontWeight.regular} !important;
  line-height: normal !important;
  ${respondTo.mdDown} {
    font-size: ${fontSize.b2} !important;
  }
`;
export const StyledWord = styled.span`
  color: ${brand.primaryMain};
`;

export const StyledLinkContainer = styled.a`
  &:hover {
    color: ${brand.primaryMain} !important;
    & .MuiSvgIcon-root {
      color: ${brand.primaryMain} !important;
    }
    a {
      color: ${brand.primaryMain} !important;
    }
    button {
      background-color: transparent;
    }
  }
  text-decoration: none;
`;

export const StyledImageContainer = styled(Grid)`
  padding: 0 !important;
  padding-left: 1px !important;
`;

export const StyledImageContent = styled(Grid)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 113px;
  padding: 0 !important;
`;

export const StyledLoginChip = styled(Chip)`
  &&.MuiChip-root {
    height: 26px !important;
    padding: 12px 4px !important;
    font-size: ${fontSize.b2} !important;
    background-color: ${brand.primaryMain} !important;
    font-weight: ${fontWeight.medium} !important;
    color: ${brand.primaryMain} !important;
  }
`;

export const StyledSidePanelTopContainer = styled.div`
  margin-top: 71px;
  margin-left: 44px;
`;

export const StyledSidePanelBottomContainer = styled.div`
  margin-bottom: 36px;
  margin-left: 44px;
`;

export const StyledArrowBackIcon = styled(ArrowBackIcon)`
  color: ${greyScaleColour.grey100} !important;
  height: ${fontSize.h5} !important;
  width: ${fontSize.h5} !important;
`;
