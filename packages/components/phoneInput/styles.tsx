import styled from 'styled-components';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import {
  baseFontFamily,
  fontSize,
  fontWeight,
} from '@wizehub/common/theme/style.typography';
import {
  brandColour,
  greyScaleColour,
  otherColour,
} from '@wizehub/common/theme/style.palette';

export const StyledPhoneInput = styled(PhoneInput) <{ hasError?: boolean, position?: string }>`
  &.react-tel-input .form-control {
    width: 100%;
    font-family: ${baseFontFamily};
    font-size: ${fontSize.b2};
    padding: 15.5px 14px 15.5px 58px;
    border-color: ${({ hasError }) => hasError && otherColour.errorDefault};
    &:focus {
      border-color: ${greyScaleColour.secondaryMain} !important;
      box-shadow: none !important;
    }
  }
  &.react-tel-input .special-label {
    font-family: ${baseFontFamily};
    font-size: ${fontSize.b3};
    left: 10px;
    color: ${greyScaleColour.grey100};
  }
  &.react-tel-input .country-list {
    position: ${(prop) => prop?.position ? prop.position: 'fixed'};
    &::-webkit-scrollbar {
      display: none;
    }
    @media (max-height: 600px) {
      position: absolute;
    }
  }
  &.react-tel-input .country-list .country.highlight {
    background-color: ${brandColour.primary100};
    color: ${greyScaleColour.white100};
  }
  &.react-tel-input .country-list .country .dial-code {
    color: inherit;
  }
  &.react-tel-input {
    font-family: ${baseFontFamily};
    font-size: ${fontSize.b2};
  }
  &.react-tel-input .country-list .search-box {
    font-size: ${fontSize.b1};
    font-weight: ${fontWeight.regular};
    color: ${greyScaleColour.grey100};
    padding: 10px 8px 10px;
    width: 100%;
    margin-left: 0;
    border-color: ${greyScaleColour.secondaryMain};
  }
  &.react-tel-input .country-list .flag {
    margin-top: 0;
  }

  &.react-tel-input .country-list .search {
    padding: 10px 4px 6px 10px;
  }
  &.react-tel-input .country-list .no-entries-message {
    display: flex;
    justify-content: center;
  }
`;

export const StyledPhoneInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
