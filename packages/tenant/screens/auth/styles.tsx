import { respondTo } from "@wizehub/common/theme/style.layout";
import styled from "styled-components";
import { Link, Typography } from "@mui/material";
import { fontSize, fontWeight } from "@wizehub/common/theme/style.typography";
import { brand, brandColour, greyScaleColour, otherColour } from "@wizehub/common/theme/style.palette";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DoDisturbOutlinedIcon from '@mui/icons-material/DoDisturbOutlined';

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

export const StyledRegisterInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
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

export const StyledAccountText = styled(Typography)`
  font-weight: ${fontWeight.regular} !important;
  font-size: ${fontSize.b1} !important;
  color: ${greyScaleColour.grey100};
`;

export const StyledLinkText = styled(Link)`
  font-weight: ${fontWeight.medium} !important;
  font-size: ${fontSize.b1} !important;
  color: ${brandColour.primaryMain} !important;
`;

// export const StyledForgotLink = styled(Link)`
//   font-size: ${fontSize.b2} !important;
//   font-weight: ${fontWeight.regular} !important;
// `;

export const StyledSuccessIconContainer = styled.div<{ width?: string }>`
  width: ${(props) => props.width && props.width};
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 1px 0px ${greyScaleColour.grey70};
`;

export const StyledSuccessLoaderImage = styled.img`
  width: 100%;
  height: 100%;
`;

export const StyledSuccessHeading = styled(Typography)`
  font-size: ${fontSize.h3} !important;
  font-weight: ${fontWeight.medium} !important;
`;

export const StyledSuccessSubHeading = styled(Typography)`
  color: ${greyScaleColour.grey100} !important;
`;

export const StyledArrowForwardIcon = styled(ArrowForwardIcon)`
  color: ${brand.white} !important;
`;

export const StyledGradientDiv = styled.div`
    background: linear-gradient(180deg, #4064FF, transparent);
    border-radius: 50%;
    width: 18px;
    height: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const StyledNoAccessSubHeading = styled(Typography)`
  font-size: ${fontSize.h5} !important;
  font-weight: ${fontWeight.medium} !important;
  color: ${greyScaleColour.grey100} !important;
`;

export const StyledDoDisturbOutlinedIcon = styled(DoDisturbOutlinedIcon)`
  width: 42px !important;
  height: 42px !important;
  color: ${otherColour.errorDefault} !important;
`;

export const StyledForgotPasswordLink = styled(Link)`
  font-size: ${fontSize.b2} !important;
  font-weight: ${fontWeight.medium} !important;
`;

export const StyledForgotPasswordLoginLink = styled(Link)`
  font-size: ${fontSize.b1} !important;
  font-weight: ${fontWeight.medium} !important;
`;

export const StyledTermsAndConditionsText = styled(Typography)`
  font-weight: ${fontWeight.medium} !important;
  color: ${greyScaleColour.grey100} !important;
  display: inline-block !important;
  margin: 0;
`;

export const StyledDot = styled(Typography)`
  color: ${greyScaleColour.grey100} !important;
  display: inline-block !important;
  margin: 0;
`;

export const StyledArrowBackIcon = styled(ArrowBackIcon)`
  color: ${greyScaleColour.grey100} !important;
  height: ${fontSize.h5} !important;
  width: ${fontSize.h5} !important;
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

export const StyledResentOtpText = styled(Typography)`
  color: ${greyScaleColour.grey100} !important;
  font-size: ${fontSize.b1} !important;
  font-weight: ${fontWeight.medium} !important;
  cursor: pointer;  
  &:hover {
    color: ${brand.primaryMain} !important;
  }
`;

export const StyledHeadingText = styled(Typography)`
  color: ${greyScaleColour.secondaryMain} !important;
  font-size: ${fontSize.h4} !important;
  font-weight: ${fontWeight.medium} !important;
  padding: 24px !important;
`;