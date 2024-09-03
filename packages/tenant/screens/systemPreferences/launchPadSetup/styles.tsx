import { Avatar, Grid, Typography } from '@mui/material';
import styled from 'styled-components';
import { fontSize, fontWeight } from '@wizehub/common/theme/style.typography';
import {
  brandColour,
  greyScaleColour,
} from '@wizehub/common/theme/style.palette';
import CloseIcon from '@mui/icons-material/Close';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { respondTo } from '@wizehub/common/theme/style.layout';

export const StyledLaunchPadHeadingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 20px 0 20px;
`;

export const StyledLaunchPadLeftHeadingContainer = styled.div``;

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

export const StyledLaunchPadProfileContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledLaunchPadProfileAvatar = styled(Avatar)<{
  width: string;
  height: string;
  marginRight?: string;
}>`
  width: ${({ width }) => width} !important;
  height: ${({ height }) => height} !important;
  margin-right: ${({ marginRight }) => marginRight || '8px'} !important;
  font-size: 21px !important;
  font-weight: ${fontWeight.regular};
`;

export const StyledAvatarText = styled(Typography)`
  font-weight: ${fontWeight.medium} !important;
  color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledLaunchPadAnchorTag = styled.a`
  color: ${brandColour.primaryMain};
  cursor: pointer;
  border-width: 2px;
  &:hover {
    color: ${brandColour.primaryDark};
  }
`;

export const StyledLaunchPadCloseIcon = styled(CloseIcon)`
  width: 10px !important;
  height: 10px !important;
  cursor: pointer;
`;

export const StyledLaunchPadCloseIconContainer = styled.div`
  position: absolute;
  top: -7px;
  right: -7px;
  border: 1px solid ${greyScaleColour.grey60};
  border-radius: 99px;
  width: 16px;
  height: 16px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledLaunchPadFormTypographyText = styled(Typography)`
  color: ${greyScaleColour.grey100} !important;
`;

export const StyledLaunchPadImage = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

export const StyledLaunchPadContainer = styled(Grid)`
  border: 1px dashed ${greyScaleColour.secondaryMain};
  border-color: ${greyScaleColour.grey80} !important;
`;

export const StyledLaunchPadPhotoIcon = styled(InsertPhotoOutlinedIcon)`
  width: 18px !important;
  height: 18px !important;
`;

export const StyledFileInput = styled.input`
  display: none;
`;

export const StyledFileUploadContainer = styled(Grid)`
  cursor: pointer;
  &:hover {
    & .MuiTypography-root,
    & .MuiSvgIcon-root {
      color: ${brandColour.primaryDark} !important;
    }
  }
`;

export const StyledFileUploadOutlinedIcon = styled(FileUploadOutlinedIcon)`
  color: ${brandColour.primary100};
`;

export const StyledUploadTypographyText = styled(Typography)`
  color: ${brandColour.primary100} !important;
`;

export const StyledIconTypography = styled(Typography)`
  font-weight: ${fontWeight.medium} !important;
`;

export const StyledTenantManagementNoteText = styled(Typography)`
  font-size: ${fontSize.h5} !important;
  font-weight: ${fontWeight.regular} !important;
  line-height: 24px !important;
`;
