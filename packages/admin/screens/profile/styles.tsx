import { Grid, Typography } from '@mui/material';
import styled from 'styled-components';
import { fontSize, fontWeight } from '@wizehub/common/theme/style.typography';
import {
  brand,
  colors,
  greyScaleColour,
  otherColour,
} from '@wizehub/common/theme/style.palette';
import Avatar from '@mui/material/Avatar';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { respondTo } from '@wizehub/common/theme/style.layout';

export const DetailCardHeading = styled(Typography)``;

export const StyledImageContainer = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 6px;
  padding: 8px;
  border: 1px solid ${colors.grey30};
  cursor: pointer;
`;

export const StyledImage = styled.img`
  width: 100%;
`;

export const StyledChildren = styled(Grid)<{ gap: any }>`
  display: flex;
  flex-direction: column !important;
  gap: ${({ gap }) => gap};
`;

export const StyledCardContent = styled(Typography)`
  font-size: ${fontSize.b1};
  font-weight: ${fontWeight.regular};
  color: ${colors.grey100};
  line-height: normal !important;
`;

export const StyledLink = styled(Typography)`
  font-size: ${fontSize.b1};
  font-weight: ${fontWeight.medium} !important;
  color: ${brand.primaryMain};
  text-decoration: underline;
  cursor: pointer;
`;

export const StyledTableHeading = styled(Typography)`
  font-size: ${fontSize.b1} !important;
  font-weight: ${fontWeight.regular} !important;
  color: ${colors.grey100};
  margin-bottom: 8px !important;
  line-height: normal !important;
  min-width: 300px;
`;

export const StyledTableContent = styled(Typography)`
  font-size: ${fontSize.b1} !important;
  font-weight: ${fontWeight.medium} !important;
  color: ${colors.black};
  line-height: normal !important;
  min-width: 300px;
`;

export const StyledPhotoContainer = styled.div`
  width: 100px;
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 11px 0px;
  border-radius: 9999px;
  background-color: ${brand.primaryMain};
`;

export const StyledPhoto = styled(Typography)`
  font-size: 52px !important;
  font-weight: ${fontWeight.regular} !important;
  cursor: pointer;
`;

export const StyledProfileContainer = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 9999px;
`;

export const StyledProfile = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
  border-radius: 9999px;
`;

export const StyledPhotoContent = styled(Typography)`
  font-size: ${fontSize.b1} !important;
  font-weight: ${fontWeight.regular} !important;
  color: ${brand.primaryMain} !important;
  cursor: pointer;
`;

export const StyledFileInput = styled.input`
  display: none;
`;

export const StyledProfileHeadingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 20px 0 20px;
`;

export const StyledProfileLeftHeadingContainer = styled.div``;

export const StyledProfileDetailChildren = styled(Grid)`
  display: flex;
  gap: 32px !important;
  padding: 24px !important;
  ${respondTo.mdDown} {
    padding: 14px !important;
  }
`;

export const StyledProfileDetailTableLinkContent = styled(Typography)<{
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

export const StyledProfileAvatar = styled(Avatar)`
  height: 80px !important;
  width: 80px !important;
`;

export const StyledProfileInfoIcon = styled(InfoOutlinedIcon)`
  height: 12px !important;
  width: 12px !important;
  color: ${greyScaleColour.grey100} !important;
  margin-bottom: 8px !important;
`;

export const StyledEditProfileText = styled(Typography)`
  font-weight: ${fontWeight.regular} !important;
  font-size: ${fontSize.b1} !important;
  color: ${greyScaleColour.grey100} !important;
  line-height: 20px !important;
`;

export const StyledProfileImageAndTextContainer = styled.div`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  display: flex;
`;

export const StyledEditProfileAvatarContainer = styled(Avatar)`
  height: 120px !important;
  width: 120px !important;
  font-size: 60px !important;
  cursor: pointer !important;
`;

export const StyledUpdateMultiFactorAuthenticationNote = styled(Typography)`
  font-size: ${fontSize.h5} !important;
  font-weight: ${fontWeight.regular} !important;
  line-height: 24px !important;
`;

export const StyledSeparator = styled.hr`
  border: 1px dashed #b6b6b6;
  width: 100%;
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
