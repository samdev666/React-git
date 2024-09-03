import { Grid, Typography } from "@mui/material";
import { brandColour, greyScaleColour } from "@wizehub/common/theme/style.palette";
import { fontSize, fontWeight } from "@wizehub/common/theme/style.typography";
import styled from "styled-components";
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';

export const StyledTabsContainer = styled.div`
  display: flex;
`;

export const StyledActiveTab = styled.div<{ active?: boolean }>`
  background-color: ${({ active }) => (active ? brandColour.primary100 : greyScaleColour.grey60)};
  border-radius: 4px;
  padding: 8px 16px;
  color: ${({ active }) => (active ? greyScaleColour.white100 : greyScaleColour.secondaryMain)};
  cursor: pointer;
`;

export const StyledActiveTabText = styled(Typography)`
  font-size: ${fontSize.h5} !important;
  font-weight: ${fontWeight.medium} !important;
  line-height: 24px !important;
`;

export const StyledSwitchIcon1 = styled(Grid) <{ isTableView: boolean }>`
  width: 34px;
  height: 34px;
  padding: 8px;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  background-color: ${({ isTableView }) => isTableView ? greyScaleColour.grey70 : greyScaleColour.secondaryMain};
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const StyledSwitchIcon2 = styled(Grid) <{ isTableView: boolean }>`
  width: 34px;
  height: 34px;
  padding: 8px;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  background-color: ${({ isTableView }) => isTableView ? greyScaleColour.secondaryMain : greyScaleColour.grey70};
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const StyledTableChartOutlinedIcon = styled(TableChartOutlinedIcon) <{ color?: string }>`
  width: 17px !important;
  height: 17px !important;
  color:${(props) => props.color} !important;
`;
