import React, { ComponentType, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import StepNavigation from './stepNavigation';
import {
  StyledContainer,
  StyledFormBoxContainer,
  StyledFormContainer,
  StyledFormStepsContainer,
  StyledStepsBoxContainer,
} from './styles';
import { Section } from '@wizehub/common/models/genericEntities';
import { hideLoader, showLoader } from '@wizehub/tenant/redux/actions';
import { useDispatch } from 'react-redux';

interface FormDataProps {
  heading?: string;
  component: ComponentType<unknown>; // Specify the type of component as ComponentType<{}>
  navIcon?: ComponentType<unknown>;
}

interface StepFormProps {
  forms: FormDataProps[];
  traversedPages?: number[];
  setTraversedPages?: React.Dispatch<React.SetStateAction<number[]>>;
  sections?: Section[];
  formCompletionComponent?: ComponentType<unknown>;
}

const StepForm: React.FC<StepFormProps> = ({
  forms,
  traversedPages,
  setTraversedPages,
  sections,
  formCompletionComponent: FormCompletionComponent
}) => {
  const reduxDispatch = useDispatch();
  const currentFormIndex = useSelector((state: any) => state.stepForm.currentPage);
  const formContainerRef = useRef<HTMLDivElement>(null);

  const renderComponent = () => {
    const CurrentFormComponent = forms?.[currentFormIndex]?.component;
    return CurrentFormComponent ? <CurrentFormComponent /> : traversedPages?.length === forms?.length
      ? <FormCompletionComponent /> : null;
  };

  useEffect(() => {
    if(forms){
      reduxDispatch(hideLoader());
    }
  }, [forms?.length])

  useEffect(() => {
    if (formContainerRef.current) {
      formContainerRef.current.scrollTop = 0;
    }
  }, [currentFormIndex]);

  return (
    <StyledContainer>< StyledFormStepsContainer >
      {forms?.length
        ? <>
          <StyledFormBoxContainer ref={formContainerRef}>
            <StyledFormContainer>{renderComponent()}</StyledFormContainer>
          </StyledFormBoxContainer>
          <StyledStepsBoxContainer>
            <StepNavigation
              forms={forms}
              currentFormIndex={currentFormIndex}
              traversedPages={traversedPages}
              sections={sections}
            />
          </StyledStepsBoxContainer>
        </>
        : <></>}
    </StyledFormStepsContainer>
    </StyledContainer >
  );
};

export default StepForm;
