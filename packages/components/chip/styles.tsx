import styled from 'styled-components';
import { Chip } from '@mui/material';

/* eslint-disable import/prefer-default-export */
export const StyledChip = styled(Chip)<{width?: string, fontSize?: string, fontWeight?: number}>`
    width: ${(props) => props.width} !important;
    .MuiChip-label{
        font-size: ${(props) => props.fontSize} !important;
        font-weight: ${(props) => props.fontWeight} !important
    }
`;
