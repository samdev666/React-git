import { Grid, Typography } from "@mui/material";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import {
  brandColour,
  greyScaleColour,
} from "@wizehub/common/theme/style.palette";
import { fontSize, fontWeight } from "@wizehub/common/theme/style.typography";
import styled from "styled-components";

export const StyledDragDropFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const StyledDragDropForm = styled.div<{
  isDragActive?: boolean;
  padding?: string;
  isHidden?: boolean;
}>`
  border: 1px dashed ${greyScaleColour.grey80};
  padding: ${(props) => props.padding};
  border-radius: 10px;
  width: 100%;
  background-color: ${(props) => props.isDragActive && "16px 0px"};
  display: ${(props) => props.isHidden && "none"};
`;

export const StyledInputFile = styled.input`
  display: none;
`;

export const StyledDragActiveText = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 1rem;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
`;

export const StyledAttachmentContainer = styled(Grid)`
  margin-top: 16px;
`;

export const StyledFileUploadOutlinedIcon = styled(FileUploadOutlinedIcon)`
  color: ${brandColour.primaryMain};
  width: 32px !important;
  height: 32px !important;
`;

export const StyledDragDropText = styled(Typography)`
  font-weight: ${fontWeight.medium} !important;
`;

export const StyledDragDropSubText = styled(Typography)`
  font-weight: ${fontWeight.medium} !important;
  font-size: ${fontSize.b2} !important;
  color: ${greyScaleColour.grey90} !important;
`;

export const StyledFileName = styled(Typography)`
  font-weight: ${fontWeight.medium} !important;
  font-size: ${fontSize.b2} !important;
  color: ${greyScaleColour.secondaryMain} !important;
  word-break: break-all;
`;

export const StyledFileSizeText = styled(Typography)`
  font-size: ${fontSize.b3} !important;
  color: ${greyScaleColour.grey90} !important;
`;

export const StyledImageOutlinedIcon = styled(ImageOutlinedIcon)`
  color: ${brandColour.primaryMain};
  width: 24px !important;
  height: 24px !important;
`;

export const StyledInsertDriveFileOutlinedIcon = styled(
  InsertDriveFileOutlinedIcon
)`
  color: ${brandColour.primaryMain};
  width: 24px !important;
  height: 24px !important;
`;

export const StyledPendingOutlinedIcon = styled(PendingOutlinedIcon)`
  color: ${brandColour.primaryMain};
  width: 10px !important;
  height: 10px !important;
`;

export const StyledUploadText = styled(Typography)`
  font-size: ${fontSize.b3} !important;
  color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledCancelOutlinedIcon = styled(CancelOutlinedIcon)<{
  cursor?: string;
}>`
  color: ${brandColour.primaryMain};
  width: 16px !important;
  height: 16px !important;
  cursor: ${(props) => props?.cursor || "pointer"};
`;

export const StyledProgressBarContainer = styled.div`
  border-radius: 6px;
  background-color: ${brandColour.primary80};
  height: 10px;
  width: 100%;
`;

export const StyledProgressBar = styled.div<{ width: string }>`
  border-radius: 6px;
  background-color: ${brandColour.primaryMain};
  height: 9px;
  width: ${(props) => props.width}%;
`;

export const StyledFilesContainer = styled(Grid)`
  flex-wrap: nowrap !important;
  background-color: ${greyScaleColour.grey60};
  border-radius: 10px;
`;
