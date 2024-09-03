import { Typography } from "@mui/material";
import { css, styled } from "styled-components";
import {
  brandColour,
  greyScaleColour,
  otherColour,
} from "@wizehub/common/theme/style.palette";
import { fontWeight } from "@wizehub/common/theme/style.typography";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

export const StyledContainer = styled.div<{
  fitContent?: boolean;
  maxWidth?: string;
}>`
  width: ${({ fitContent }) => (fitContent ? "fit-content" : "25%")};
  min-width: 374px;
  margin: 70px auto;
  ${({ fitContent }) =>
    fitContent &&
    css`
      max-width: 760px;
    `};

  ${({ maxWidth }) =>
    maxWidth &&
    css`
      max-width: ${maxWidth};
    `};
`;

export const StyledHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background-color: ${brandColour.primary100};
  color: ${greyScaleColour.white100};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

export const StyledHeading = styled(Typography)`
  color: ${greyScaleColour.secondaryMain};
  line-height: normal !important;
  color: ${greyScaleColour.white100};
`;

export const StyledSubHeading = styled(Typography)`
  color: ${greyScaleColour.grey100};
  font-weight: ${fontWeight.medium} !important;
`;

export const StyledCloseContainer = styled.div`
  cursor: pointer;
  margin-left: 16px;
  margin-top: 5px;
`;

export const StyledHeadingImgContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledHeadingImg = styled.img`
  width: 72px;
`;

export const StyledButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledCloseButton = styled(CloseOutlinedIcon)``;
