import { Avatar, Chip, Grid, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";
import AddIcon from "@mui/icons-material/Add";
import {
  brandColour,
  greyScaleColour,
  otherColour,
} from "@wizehub/common/theme/style.palette";
import { fontSize, fontWeight } from "@wizehub/common/theme/style.typography";
import styled from "styled-components";
import { FormRowItem } from "@wizehub/components";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

export const StyledMasterDataHeadingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 20px 0 20px;
`;

export const StyledMasterDataLeftHeadingContainer = styled.div``;

export const StyledMasterDataDetailButtonContainer = styled.div`
  display: flex;
  gap: 16px;
`;

export const StyledApplciationProfileContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledApplicationProfileAvatar = styled(Avatar)<{
  width: string;
  height: string;
  marginRight?: string;
}>`
  width: ${({ width }) => width} !important;
  height: ${({ height }) => height} !important;
  margin-right: ${({ marginRight }) => marginRight || "8px"} !important;
  font-size: 21px !important;
  font-weight: ${fontWeight.regular};
`;

export const StyledAvatarText = styled(Typography)`
  font-weight: ${fontWeight.medium} !important;
  color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledApplicationAnchorTag = styled.a`
  color: ${brandColour.primaryMain};
  cursor: pointer;
  border-width: 2px;
  &:hover {
    color: ${brandColour.primaryDark};
  }
`;

export const StyledMeetingAgendaHeading = styled(Typography)`
  font-weight: ${fontWeight.medium} !important;
`;

export const StyledMeetinAgendaAddMoreContainer = styled(FormRowItem)`
  cursor: pointer !important;
  &:hover {
    & .MuiTypography-root,
    & .MuiSvgIcon-root {
      color: ${brandColour.primaryDark} !important;
    }
  }
`;

export const StyledMeetingAgendaAddMoreIcon = styled(AddIcon)`
  width: 10.5px !important;
  height: 10.5px !important;
  color: ${brandColour?.primary100} !important;
`;

export const StyledMeetingAgendaAddMoreText = styled(Typography)`
  color: ${brandColour?.primary100} !important;
`;

export const StyledFileInput = styled.input`
  display: none;
`;

export const StyledApplicationImageContainer = styled(Grid)`
  border: 1px dashed ${greyScaleColour.secondaryMain};
  border-color: ${greyScaleColour.grey80} !important;
`;

export const StyledApplicationImage = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

export const StyledApplicationCloseIconContainer = styled.div`
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

export const StyledApplicationCloseIcon = styled(CloseIcon)`
  width: 10px !important;
  height: 10px !important;
  cursor: pointer;
`;

export const StyledApplicationPhotoIcon = styled(InsertPhotoOutlinedIcon)`
  width: 18px !important;
  height: 18px !important;
`;

export const StyledApplicationChip = styled(Chip)`
  background-color: ${greyScaleColour.grey60} !important;
  border-radius: 4px !important;
  padding: 4px 8px;
  color: ${brandColour.primary100} !important;
`;

export const StyledApplicationChipLabel = styled(Typography)`
  font-weight: ${fontWeight.semiBold} !important;
`;

export const StyledApplicationTypographyText = styled(Typography)`
  color: ${brandColour.primaryMain};
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

export const StyledRemoveText = styled(Typography)`
  color: ${otherColour.errorDefault} !important;
  cursor: pointer;
`;

export const StyledDeleteIcon = styled(DeleteOutlineOutlinedIcon)<{
  active?: boolean;
}>`
  color: ${({ active }) =>
    !active ? greyScaleColour.grey80 : otherColour.errorDefault};
`;

export const StyledApplicationFormTypographyText = styled(Typography)`
  color: ${greyScaleColour.grey100} !important;
`;

export const StyledProjectManagementHeadingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 20px 0 20px;
`;

export const StyledProjectManagementLeftHeadingContainer = styled.div``;

export const StyledProjectAttachmentName = styled(Typography)`
  font-size: ${fontSize.b2} !important;
  font-weight: ${fontWeight.medium} !important;
  color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledProjectAttachmentSize = styled(Typography)`
  font-size: ${fontSize.b3} !important;
  font-weight: ${fontWeight.regular} !important;
  color: ${greyScaleColour.grey90} !important;
`;

export const StyledProjectAttachmentContainer = styled(Grid)`
  border-radius: 11px;
  background-color: ${greyScaleColour.grey60};
  padding: 14px;
`;

export const StyledProjectAttachmentImage = styled.img`
  height: 32px;
  width: 32px;
`;
