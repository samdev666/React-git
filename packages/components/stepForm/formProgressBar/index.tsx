import React from 'react';
import { useSelector } from 'react-redux';
import { StyledContainer, StyledProgressBar } from './styles';

interface Props {
  length: number;
}

const FormProgressBar: React.FC<Props> = ({ length }) => {
  const currentPage = useSelector((state: any) => state.stepForm.currentPage) + 1;

  return (
    <StyledContainer>
      <StyledProgressBar
        width={currentPage && Math.round((currentPage / length) * 100)}
      />
    </StyledContainer>
  );
};

export default FormProgressBar;
