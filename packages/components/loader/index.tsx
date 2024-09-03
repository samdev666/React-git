import React from 'react';
import { useSelector } from 'react-redux';
import { ReduxState } from '@wizehub/common/redux/reducers';
import WizehubLoader from '@wizehub/tenant/assets/images/Wizehub-loader.gif';
import { StyledContainer, StyledLoader } from './styles';

const Loader = () => {
  const loaderState = useSelector((state: ReduxState) => state.loader);
  return (
    loaderState.visibility && (
      <StyledContainer>
        <StyledLoader src={WizehubLoader} />
      </StyledContainer>
    )
  );
};

export default Loader;
