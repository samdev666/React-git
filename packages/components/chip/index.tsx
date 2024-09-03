import { ChipProps } from '@mui/material';
import React from 'react';
import { StyledChip } from './styles';

type CustomChipProps = ChipProps & {
    width?: string,
    fontSize?: string,
    fontWeight?: number
};

const CustomChip = ({
  width, fontSize, fontWeight, label, ...props
}: CustomChipProps) => <StyledChip width={width} label={label} fontSize={fontSize} fontWeight={fontWeight} {...props} />;

export default CustomChip;
