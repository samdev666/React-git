import { Avatar, FormControlLabel, Grid, Typography } from "@mui/material";
import { respondTo } from "@wizehub/common/theme/style.layout";
import { brand, greyScaleColour, otherColour } from "@wizehub/common/theme/style.palette";
import { fontSize, fontWeight } from "@wizehub/common/theme/style.typography";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import styled from "styled-components";

export const StyledProfileHeadingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 20px 0 20px;
`;

export const StyledProfileLeftHeadingContainer = styled.div``;

export const StyledHeadingTypography = styled(Typography)`
  font-size: ${fontSize.h1} !important;
  font-weight: ${fontWeight.semiBold} !important;
  margin: 0px !important;
  line-height: 42px !important;
  ${respondTo.mdDown} {
    font-size: ${fontSize.h2} !important;
    font-weight: ${fontWeight.medium} !important;
    line-height: 37px !important;
  }
`;

export const StyledProfileDetailChildren = styled(Grid)`
  display: flex;
  gap: 32px !important;
  padding: 24px !important;
  ${respondTo.mdDown} {
    padding: 14px !important;
  }
`;

export const StyledProfileAvatar = styled(Avatar)`
  height: 80px !important;
  width: 80px !important;
`;

export const StyledProfileDetailTableLinkContent = styled(Typography) <{
  color?: string;
}>`
    font-size: ${fontSize.h5} !important;
    font-weight: ${fontWeight.medium} !important;
    color: ${(props) => props.color} !important;
    line-height: normal !important;
    cursor: pointer !important;
    ${respondTo.mdDown}{
      font-size: ${fontSize.b1} !important;
    }
  `;

export const StyledEditProfileAvatarContainer = styled(Avatar)`
  height: 120px !important;
  width: 120px !important;
  font-size: 60px !important;
  cursor: pointer !important;
`;

export const StyledEditProfileText = styled(Typography)`
  font-weight: ${fontWeight.regular} !important;
  font-size: ${fontSize.b1} !important;
  color: ${greyScaleColour.grey100} !important;
  line-height: 20px !important;
`;

export const StyledFileInput = styled.input`
  display: none;
`;

export const StyledPhotoContent = styled(Typography)`
  font-size: ${fontSize.b1} !important;
  font-weight: ${fontWeight.regular} !important;
  color: ${brand.primaryMain} !important;
  cursor: pointer;
`;

export const StyledProfileImageAndTextContainer = styled.div`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  display: flex;
`;

export const StyledSeparator = styled.hr`
  border: 1px dashed #b6b6b6;
  width: 100%;
`;

export const StyledUpdateMultiFactorAuthenticationNote = styled(Typography)`
  font-size: ${fontSize.h5} !important;
  font-weight: ${fontWeight.regular} !important;
  line-height: 24px !important;
`;

export const StyledCautionTextContainer = styled.div`
  width: 100%;
  background-color: ${otherColour.warningBg};
  display: flex;
  padding: 6px 16px;
  gap: 14px;
  border-radius: 4px;
`;

export const StyledCautionIcon = styled(WarningAmberIcon)`
  color: ${otherColour.warning} !important;
`;

export const StyledCautionText = styled(Typography)`
  font-size: ${fontSize.h5} !important;
  font-weight: ${fontWeight.medium} !important;
  line-height: 24px !important;
  color: ${otherColour.warning} !important;
`;

export const StyledRecoverCodeText = styled(Typography)`
  font-size: ${fontSize.h2} !important;
  font-weight: ${fontWeight.medium} !important;
  line-height: 37px !important;
  color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledFormControlLabel = styled(FormControlLabel)`
  margin-left: 0px !important;
  color: ${greyScaleColour.grey100} !important;
  cursor: pointer !important;
`;

