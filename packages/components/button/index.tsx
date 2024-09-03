import { ButtonProps } from '@mui/material';
import React from 'react';
import { StyledButton } from './styles';

type ButtonCustomProps = ButtonProps & {
  onClick?: () => void;
  label?: string;
  backgroundColor?: string;
};

const Button = ({ label, ...props }: ButtonCustomProps) => <StyledButton {...props}>{label}</StyledButton>;

export default Button;
