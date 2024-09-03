import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  StyledStepperContainer,
  StyledStepperIcon,
  StyledStepperText,
} from './styles';

interface Props {}

const Stepper: React.FC<Props> = () => {
  const location = useLocation();
  const pathArray = location?.pathname
    .split('/')
    .slice(1)
    .filter((path) => path !== 'undefined' && !Number(path));
  return (
    <StyledStepperContainer>
      <StyledStepperText
        onClick={() => {
          window.location.href = '/dashboard';
        }}
        active={false}
      >
        Home
      </StyledStepperText>
      {pathArray.map((path, index) => {
        const transformedPath = path.split('-');
        const capitalWord = transformedPath
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        return (
          <>
            <StyledStepperIcon />
            <StyledStepperText
              active={index === pathArray.length - 1}
              onClick={() => {
                if (index !== pathArray.length - 1) {
                  window.location.href = `/${pathArray
                    .slice(0, index + 1)
                    .join('/')}`;
                }
              }}
            >
              {capitalWord}
            </StyledStepperText>
          </>
        );
      })}
    </StyledStepperContainer>
  );
};

export default Stepper;
