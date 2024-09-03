import React from "react";
import { Grid, IconButton } from "@mui/material";
import {
  StyledDetailChildren,
  StyledDetailFooter,
  StyledDetailHeading,
  StyledDetailHeadingContainer,
  StyledDetailTableContent,
  StyledDetailTableHeading,
  StyledHeadingTypography,
  StyledIconButton,
  StyledMainHeadingButtonContainer,
  StyledMainHeadingContainer,
  StyledMainLeftHeadingContainer,
} from "./styles";
import Stepper from "../stepper";
import Button from "../button";
import Card from "../card";
import { ButtonProps } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDispatch } from "react-redux";
import { goBack } from "connected-react-router";

interface CustomButtonProps extends ButtonProps {
  label: string;
  onClick: React.MouseEventHandler<HTMLButtonElement> & (() => void);
  disabled?: boolean;
}

interface Props {
  heading?: string;
  headingActionButtons?: Array<CustomButtonProps>;
  cardHeading?: string;
  cardContent: Array<{
    heading?: string;
    value: string | React.ReactNode | React.JSX.Element;
    gridWidth?: number;
    isTypography?: boolean;
  }>;
  footerActionButton?: Array<CustomButtonProps>;
  disabledActionButtons?: boolean;
  hasGoBackIcon?: boolean;
  detailedGridGap?: number;
  columnSpacing?: number;
  hasNoHeader?: boolean;
  containsPhoneNumber?: boolean;
}

const DetailPageWrapper: React.FC<Props> = ({
  heading,
  headingActionButtons,
  cardHeading,
  cardContent,
  footerActionButton,
  hasNoHeader = true,
  disabledActionButtons = true,
  hasGoBackIcon = false,
  detailedGridGap = 4,
  columnSpacing,
  containsPhoneNumber,
}) => {
  const reduxDispatch = useDispatch();
  return (
    <>
      <StyledMainHeadingContainer>
        <StyledMainLeftHeadingContainer hasGoBackIcon={hasGoBackIcon}>
          {hasNoHeader &&
            (hasGoBackIcon ? (
              <StyledIconButton onClick={() => reduxDispatch(goBack())}>
                <ArrowBackIcon />
              </StyledIconButton>
            ) : (
              <Stepper />
            ))}
          <StyledHeadingTypography>{heading}</StyledHeadingTypography>
        </StyledMainLeftHeadingContainer>
        {disabledActionButtons && (
          <StyledMainHeadingButtonContainer>
            {headingActionButtons?.map(
              ({ variant, color, label, onClick, startIcon, disabled }) => (
                <Button
                  key={label}
                  startIcon={startIcon}
                  variant={variant}
                  color={color}
                  label={label}
                  onClick={onClick}
                  disabled={disabled}
                />
              )
            )}
          </StyledMainHeadingButtonContainer>
        )}
      </StyledMainHeadingContainer>
      <Card
        noHeader
        cardCss={{
          margin: "0 20px",
          overflowY: !containsPhoneNumber && "auto",
          position: containsPhoneNumber && "relative",
          overflow: containsPhoneNumber && "visible",
        }}
      >
        <Grid container>
          {cardHeading && (
            <StyledDetailHeadingContainer
              container
              item
              alignItems="center"
              justifyContent="space-between"
            >
              <StyledDetailHeading>{cardHeading}</StyledDetailHeading>
            </StyledDetailHeadingContainer>
          )}
          <StyledDetailChildren container item>
            <Grid
              container
              item
              columnSpacing={columnSpacing || detailedGridGap}
              rowGap={detailedGridGap}
            >
              {cardContent?.map(
                ({ value, heading, isTypography, gridWidth = 2 }) => (
                  <Grid item xs={gridWidth}>
                    {heading && (
                      <StyledDetailTableHeading>
                        {heading}
                      </StyledDetailTableHeading>
                    )}
                    {isTypography ? (
                      <StyledDetailTableContent>
                        {value || "-"}
                      </StyledDetailTableContent>
                    ) : (
                      value
                    )}
                  </Grid>
                )
              )}
            </Grid>
          </StyledDetailChildren>
          {disabledActionButtons && footerActionButton && (
            <StyledDetailFooter justifyContent="flex-end" container item>
              {footerActionButton?.map(
                ({ variant, color, label, onClick, startIcon, disabled }) => (
                  <Button
                    key={label}
                    startIcon={startIcon}
                    variant={variant}
                    color={color}
                    label={label}
                    onClick={onClick}
                    disabled={disabled}
                  />
                )
              )}
            </StyledDetailFooter>
          )}
        </Grid>
      </Card>
    </>
  );
};

export default DetailPageWrapper;
