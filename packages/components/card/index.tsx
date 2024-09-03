import React, { JSX } from 'react';
import { SxProps, Theme, Grid } from '@mui/material';
import {
  CardTitle,
  StyledCard,
  StyledCardContent,
  StyledCardHeader,
} from './styles';

interface Props {
  children?: JSX.Element | JSX.Element[];
  cardCss?: SxProps<Theme>;
  contentCss?: SxProps<Theme>;
  header?: JSX.Element | JSX.Element[];
  headerCss?: React.CSSProperties;
  noHeader?: boolean;
  title?: string;
  noHeaderPadding?: boolean;
  index?: number;
  value?: number;
  // tabContent?: { heading: string; subHeading?: string; buttonComponent?: any };
  orientation?: 'vertical' | 'horizontal';
}

const Card: React.FC<Props> = ({
  children,
  cardCss,
  header,
  contentCss,
  headerCss,
  noHeader,
  title,
  index,
  value,
  noHeaderPadding,
  ...other
}) => (
  <StyledCard sx={cardCss} hidden={value !== index} {...other}>
    {!noHeader && (
      <StyledCardHeader style={headerCss} noHeaderPadding={noHeaderPadding}>
        {header}
        {title && (
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <CardTitle variant="subtitle1">{title}</CardTitle>
            </Grid>
          </Grid>
        )}
      </StyledCardHeader>
    )}
    <StyledCardContent sx={contentCss}>{children}</StyledCardContent>
  </StyledCard>
);

export default Card;
