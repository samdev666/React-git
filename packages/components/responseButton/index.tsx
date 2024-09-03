import React from 'react';
import {
  StyledContainer,
  StyledResponseButtonContainer,
  StyledResponseButtonText,
  StyledResponseButtonTextContainer,
  StyledResponseButton,
  StyledSubTitle,
  StyledTitle,
  StyledTypographyText,
  StyledTypographyTextContainer,
  StyledSubContainer,
} from './styles';
import { Grid } from '@mui/material';
import { StyledError } from '../textInput/styles';

export interface ResponseButtonOption {
  id: number | string;
  label: string;
  subText?: string;
}

interface Props {
  options?: ResponseButtonOption[];
  value?: any;
  onChange?: any;
  error?: any;
  disableErrorMode?: boolean;
  title?: string;
  subTitle?: string;
  required?: boolean;
}

const ResponseButtonComponent: React.FC<Props> = ({
  options,
  value,
  onChange,
  disableErrorMode,
  error,
  title,
  subTitle,
  required
}) => {
  const handleClick = (e: any) => {
    const value = e?.target?.innerText;
    if (onChange) {
      const data = options?.find((item: ResponseButtonOption) => item.label === value)
      onChange(data);
    }
  };

  const renderResponseButton = () => (
    <StyledResponseButton>
      {
        options?.map((option: ResponseButtonOption) => {
          const selectedValue: boolean = option.label === value?.label;
          return (
            <StyledResponseButtonContainer
              isSelected={selectedValue}
              onClick={handleClick}
            >
              <StyledResponseButtonTextContainer
                isSelected={selectedValue}
              >
                <StyledResponseButtonText
                  isSelected={selectedValue}
                >
                  {option.label}
                </StyledResponseButtonText>
              </StyledResponseButtonTextContainer>
            </StyledResponseButtonContainer>
          )
        })
      }
    </StyledResponseButton>
  )

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <StyledContainer>
        {(title || subTitle)
          && <Grid container gap="16px">
            <Grid item xs={12}>
              <StyledTitle required={required}>
                {title}
              </StyledTitle>
            </Grid>
            {subTitle &&
              <Grid item xs={12}>
                <StyledSubTitle>
                  {subTitle}
                </StyledSubTitle>
              </Grid>}
          </Grid>}
        <StyledSubContainer>
          {renderResponseButton()}
          <StyledTypographyTextContainer>
            <StyledTypographyText>
              {options?.[0]?.subText}
            </StyledTypographyText>
            <StyledTypographyText>
              {options?.[options?.length - 1]?.subText}
            </StyledTypographyText>
          </StyledTypographyTextContainer>
        </StyledSubContainer>
      </StyledContainer>
      {!disableErrorMode && error && <StyledError variant="body2">{error}</StyledError>}
    </div>
  );
};

export default ResponseButtonComponent;
