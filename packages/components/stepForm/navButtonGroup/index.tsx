import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentStep } from '@wizehub/common/redux/actions';
import { ReduxState } from '@wizehub/common/redux/reducers';
import Button from '../../button';
import { StyledContainer } from './styles';

interface NavButtonGroupProps {
  formLength: number;
}

const NavButtonGroup: React.FC<NavButtonGroupProps> = ({ formLength }) => {
  const reduxDispatch = useDispatch();
  const currentFormIndex = useSelector(
    (state: ReduxState) => state.stepForm.currentPage,
  );

  return (
    <StyledContainer>
      {currentFormIndex - 1 >= 0 && (
        <Button
          label="Back"
          variant="outlined"
          onClick={() => reduxDispatch(
            setCurrentStep(currentFormIndex - 1 >= 0 && currentFormIndex - 1),
          )}
        />
      )}
      {currentFormIndex !== formLength - 1
        && currentFormIndex + 1 < formLength && (
          <Button
            label="Next"
            variant="outlined"
            onClick={() => reduxDispatch(setCurrentStep(currentFormIndex + 1))}
            style={{ marginLeft: 'auto' }}
          />
      )}
    </StyledContainer>
  );
};

export default NavButtonGroup;
