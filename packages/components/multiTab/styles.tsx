import { Typography } from "@mui/material";
import {
  brandColour,
  greyScaleColour,
} from "@wizehub/common/theme/style.palette";
import { fontSize, fontWeight } from "@wizehub/common/theme/style.typography";
import styled, { css } from "styled-components";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export const StyledMultiTabMainContainer = styled.div<{
  orientation?: "horizontal" | "vertical";
  noBackgroundColor?: boolean;
}>`
  background-color: ${(prop) =>
    !prop?.noBackgroundColor && greyScaleColour.grey60};
  width: 100%;
  padding: 0 20px;
  gap: 12px;
  display: flex;
  ${({ orientation }) =>
    orientation === "vertical" &&
    css`
      padding: 0px;
      /* height: 100%; */
      flex-direction: column;
    `};
`;

export const StyledMultiTabButton = styled(Typography)<{
  active?: boolean;
  orientation?: "horizontal" | "vertical";
}>`
  padding: 12px 20px;
  font-size: ${fontSize.b1} !important;
  font-weight: ${fontWeight.regular} !important;
  color: ${greyScaleColour.grey100} !important;
  cursor: pointer;
  word-break: break-all !important;
  ${({ active }) =>
    active &&
    css`
      color: ${brandColour.primary100} !important;
      border-bottom: 2px solid ${brandColour.primary100};
      font-weight: ${fontWeight.bold} !important;
    `};

  ${({ orientation, active }) =>
    orientation === "vertical" &&
    active &&
    css`
      color: ${brandColour.primary100} !important;
      border-bottom: 1px solid ${brandColour.primary100};
      font-weight: ${fontWeight.medium} !important;
      display: flex;
      align-items: center;
      justify-content: space-between;
      overflow-y: scroll;
    `};
`;

export const StyledChevronRightIcon = styled(ChevronRightIcon)`
  color: ${brandColour.primary100} !important;
`;
