
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import FiberManualRecordOutlinedIcon from '@mui/icons-material/FiberManualRecordOutlined';
import { greyScaleColour, otherColour } from "@wizehub/common/theme/style.palette";
import styled from "styled-components";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Box, Divider, Typography } from "@mui/material";
import { fontSize, fontWeight } from "@wizehub/common/theme/style.typography";

export const StyledDeleteIcon = styled(DeleteOutlineOutlinedIcon)`
    color: ${otherColour.errorDefault};
  `;

export const StyledMarketingHeading = styled(Typography)`
  font-size: ${fontSize.h5} !important;
  font-weight: ${fontWeight.semiBold} !important;
  color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledMarketingChartContainer = styled.div`
  padding: 30px 30px 20px 0px;
  text-align: center !important;
`;

export const StyledTotalText = styled(Typography)`
  font-weight: ${fontWeight.bold} !important;
  color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledMarketingEditIcon = styled(EditOutlinedIcon)`
  color: ${greyScaleColour.secondaryMain} !important;
  margin-right: 15px !important;
`;

export const StyledDivider = styled(Divider)`
  margin-bottom: 16px !important;
  border: 1px dashed ${greyScaleColour.grey80} !important;
`;

export const StyledFormTotalText = styled(Typography)`
  color: ${greyScaleColour.grey100} !important;
`;

export const StyledFormTotalSubtext = styled(Typography)`
  color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledLegendContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StyledLegendSubContainer = styled(Box)`
  display: flex;
  align-items: center;
`;

export const StyledFiberManualRecordOutlinedIcon = styled(FiberManualRecordOutlinedIcon) <{ color: string }>`
  width: 13px !important;
  height: 13px !important;
  color: ${({ color }) => color} !important;
`;

export const StyledLegend = styled(Typography)`
  font-size: ${fontSize.b2} !important;
  font-weight: ${fontWeight.medium} !important;
  color: ${greyScaleColour.grey90} !important;
`;
