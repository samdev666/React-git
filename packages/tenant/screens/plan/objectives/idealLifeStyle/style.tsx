import { Grid, IconButton, Typography } from "@mui/material";
import styled, { css } from "styled-components";
import { fontSize, fontWeight } from "@wizehub/common/theme/style.typography";
import { greyScaleColour } from "@wizehub/common/theme/style.palette";
import { respondTo } from "@wizehub/common/theme/style.layout";

export const StyledMainHeadingContainer = styled(Grid)`
  display: flex;
  justify-content: space-between;
  padding: 8px 20px 0 20px;
`;

export const StyledIdealContainer = styled(Grid)`
  gap: 13px;
  align-items: center;
`;

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

export const StyledMultiTabContainer = styled.div`
  display: flex;
  margin: 8px 20px 0 20px;
`;