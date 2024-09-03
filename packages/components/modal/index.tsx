import React from "react";
import { Modal as MuiModal } from "@mui/material";
import { greyScaleColour } from "@wizehub/common/theme/style.palette";
import Card from "../card";
import {
  StyledContainer,
  StyledHeaderContainer,
  StyledSubHeading,
  StyledHeadingImgContainer,
  StyledHeadingImg,
  StyledCloseContainer,
  StyledButtonContainer,
  StyledHeading,
  StyledCloseButton,
} from "./styles";

interface ModalCustomProps {
  children?: JSX.Element | JSX.Element[];
  show?: boolean;
  onClose?: () => void;
  heading?: string;
  headingImgSrc?: string;
  subHeading?: string;
  fitContent?: boolean;
  hasCloseIcon?: boolean;
  isCreateOrEditForm?: boolean;
  maxWidth?: string;
}

const Modal = ({
  children,
  heading,
  show,
  onClose,
  subHeading,
  fitContent,
  headingImgSrc,
  maxWidth,
  isCreateOrEditForm = true,
  hasCloseIcon = true,
}: Readonly<ModalCustomProps>) => (
  <MuiModal
    open={!!show}
    onClose={(event: React.MouseEvent<HTMLElement>, reason: string) => {
      if (
        isCreateOrEditForm &&
        (reason === "escapeKeyDown" || reason === "backdropClick")
      ) {
        event.preventDefault();
      } else {
        onClose();
      }
    }}
  >
    <StyledContainer fitContent={fitContent} maxWidth={maxWidth}>
      <Card
        cardCss={{
          border: "none",
          backgroundColor: "transparent",
          height: "calc(100vh - 70px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          borderRadius: "0",
        }}
        contentCss={{
          overflowY: "auto",
          padding: 0,
          backgroundColor: greyScaleColour.white100,
          height: "auto",
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
        }}
        noHeaderPadding
        header={
          <StyledHeaderContainer>
            <StyledHeading variant="h3">{heading}</StyledHeading>
            {subHeading && (
              <StyledSubHeading variant="body1">{subHeading}</StyledSubHeading>
            )}
            {headingImgSrc && (
              <StyledHeadingImgContainer>
                <StyledHeadingImg src={headingImgSrc} />
              </StyledHeadingImgContainer>
            )}
            <StyledButtonContainer>
              {hasCloseIcon && (
                <StyledCloseContainer onClick={onClose}>
                  <StyledCloseButton />
                </StyledCloseContainer>
              )}
            </StyledButtonContainer>
          </StyledHeaderContainer>
        }
      >
        {children}
      </Card>
    </StyledContainer>
  </MuiModal>
);

export default Modal;
