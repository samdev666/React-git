import { greyScaleColour } from "@wizehub/common/theme/style.palette";
import styled from "styled-components";

export const StyledTeamScoreInputContainer = styled.input`
  /* height: 15px; */
  height: 100%;
  padding: 6px 4px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid ${greyScaleColour.grey80};
  text-align: center;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
