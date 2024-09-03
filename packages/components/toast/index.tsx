import React from 'react';
import {
  StyledToastContainer,
  StyledToastIcon,
  StyledToastInfoContainer,
  StyledToastInfoSubText,
  StyledToastInfoText,
} from './styles';

interface Props {
  text?: string;
  subText?: string;
  type?: string;
}

const Toast: React.FC<Props> = ({ text, subText, type }) => (
  <StyledToastContainer type={type}>
    <StyledToastIcon
      src={
        type === 'error'
          ? '/assets/images/notAllowed.svg'
          : '/assets/images/success.svg'
      }
    />
    <StyledToastInfoContainer>
      {text && <StyledToastInfoText>{text}</StyledToastInfoText>}
      {subText && <StyledToastInfoSubText>{subText}</StyledToastInfoSubText>}
    </StyledToastInfoContainer>
  </StyledToastContainer>
);

export default Toast;
