import {
  greyScaleColour,
  otherColour,
} from "@wizehub/common/theme/style.palette";
import JoditEditor from "jodit-react";
import styled from "styled-components";

export const StyledJoditEditor = styled(JoditEditor)`
  z-index: 1;
  & .jodit-ui-group:last-child {
    background-color: ${greyScaleColour.grey60};
  }
`;
export const StyledJoditEditorContainer = styled.div<{
  disableErrorMode?: boolean;
}>`
  position: relative;
  max-width: 100%;

  .jodit-container:not(.jodit_inline) .jodit-workplace {
    border: ${({ disableErrorMode }) =>
      disableErrorMode ? `1px solid ${otherColour.errorDefault}` : "none"};
  }

  .jodit-container:not(.jodit_inline) {
    border-width: ${({ disableErrorMode }) => (disableErrorMode ? 0 : "")};
  }

  .jodit-toolbar__box {
    border: ${({ disableErrorMode }) =>
      disableErrorMode ? `1px solid ${greyScaleColour.grey70}` : "none"};
  }
`;
