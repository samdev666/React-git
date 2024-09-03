import React, { useMemo } from "react";
import { StyledJoditEditor, StyledJoditEditorContainer } from "./styles";
import { StyledError } from "../textInput/styles";
import undoIcon from "../assets/joditEditorUndoIcon.svg";
import redoIcon from "../assets/joditEditorRedoIcon.svg";
import fontIcon from "../assets/joditEditorFontIcon.svg";
import alignIcon from "../assets/joditEditorAlignIcon.svg";
import boldIcon from "../assets/joditEditorBoldIcon.svg";
import italicIcon from "../assets/joditEditorItalicIcon.svg";
import underlineIcon from "../assets/joditEditorUnderlineIcon.svg";
import strikeThroughIcon from "../assets/joditEditorStrikethroughIcon.svg";
import sourceIcon from "../assets/joditEditorSourceIcon.svg";
import eraserIcon from "../assets/joditEditorEraseIcon.svg";
import ulIcon from "../assets/joditEditorULIcon.svg";
import olIcon from "../assets/joditEditorOLIcon.svg";
import linkIcon from "../assets/joditEditorLinkIcon.svg";
import imageIcon from "../assets/joditEditorImageIcon.svg";
import hrIcon from "../assets/joditEditorHRIcon.svg";

interface Props {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disableErrorMode?: boolean;
}

const JoditEditorComponent: React.FC<Props> = ({
  value,
  onChange,
  error,
  disableErrorMode,
}) => {
  const config = useMemo(
    () => ({
      readonly: false,
      toolbarSticky: false,
      toolbarAdaptive: false,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      controls: {
        undo: {
          iconURL: `${undoIcon}`,
        },
        redo: {
          iconURL: `${redoIcon}`,
        },
        font: {
          iconURL: `${fontIcon}`,
        },
        align: {
          iconURL: `${alignIcon}`,
        },
        bold: {
          iconURL: `${boldIcon}`,
        },
        italic: {
          iconURL: `${italicIcon}`,
        },
        underline: {
          iconURL: `${underlineIcon}`,
        },
        strikethrough: {
          iconURL: `${strikeThroughIcon}`,
        },
        source: {
          iconURL: `${sourceIcon}`,
        },
        eraser: {
          iconURL: `${eraserIcon}`,
        },
        ul: {
          iconURL: `${ulIcon}`,
        },
        ol: {
          iconURL: `${olIcon}`,
        },
        link: {
          iconURL: `${linkIcon}`,
        },
        hr: {
          iconURL: `${hrIcon}`,
        },
      },
      addNewLine: false,
      buttons: [
        "undo",
        "redo",
        "font",
        "align",
        "brush",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "source",
        "eraser",
        "ul",
        "ol",
        "link",
        "hr",
      ],
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
      height: 400,
      placeholder: "",
      style: {
        font: "14px",
      },
      // safeMode: true,
    }),
    []
  );

  return (
    <StyledJoditEditorContainer disableErrorMode={!!error}>
      <StyledJoditEditor
        value={value}
        config={config}
        onBlur={(newContent) => onChange(newContent)}
        onChange={(newContent) => {
          if (!value) {
            onChange(newContent);
          }
        }}
      />

      {error && <StyledError variant="body2">{error}</StyledError>}
    </StyledJoditEditorContainer>
  );
};

export default JoditEditorComponent;
