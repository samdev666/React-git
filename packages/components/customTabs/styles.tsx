import { Typography } from "@mui/material";
import {
  brandColour,
  greyScaleColour,
} from "@wizehub/common/theme/style.palette";
import { fontSize, fontWeight } from "@wizehub/common/theme/style.typography";
import styled, { css } from "styled-components";

export const StyledTabsContainer = styled.div<{
  noMargingLeft?: boolean;
  noMarginRight?: boolean;
}>`
  margin: 8px 20px 0 20px;
  display: flex;
  border-radius: 4px;
  overflow: hidden;
  width: fit-content;
  margin-left: ${(props) => props.noMargingLeft && "0px"};
  margin-right: ${(props) => props?.noMarginRight && "0px"};
  margin-top: ${(props) => props.noMargingLeft && "0px"};
`;

export const StyledActiveTab = styled.div<{
  active?: boolean;
  isIconTab?: boolean;
}>`
  background-color: ${({ active }) =>
    active ? brandColour.primary100 : greyScaleColour.grey60};
  padding: 8px 16px;
  color: ${({ active }) =>
    active ? greyScaleColour.white100 : greyScaleColour.secondaryMain};
  cursor: pointer;
  ${({ isIconTab, active }) =>
    isIconTab &&
    css`
      display: flex;
      align-items: center;
      background-color: ${active
        ? greyScaleColour.secondaryMain
        : greyScaleColour.grey60};
      color: ${active
        ? greyScaleColour.white100
        : greyScaleColour.secondaryMain};
    `}
`;

export const StyledActiveTabText = styled(Typography)`
  font-size: ${fontSize.h5} !important;
  font-weight: ${fontWeight.medium} !important;
  line-height: 24px !important;
`;
