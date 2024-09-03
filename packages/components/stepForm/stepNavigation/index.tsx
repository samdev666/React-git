import React, { ComponentType } from 'react';
import { Grid } from '@mui/material';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import HourglassTopOutlinedIcon from '@mui/icons-material/HourglassTopOutlined';
import {
  StyledIcon,
  StyledIconContainer,
  StyledIndex,
  StyledStepLine,
  StyledSteps,
  StyledStepsBox,
  StyledStepsChip,
  StyledStepsChipContainer,
  StyledStepsContainer,
  StyledStepsDescription,
  StyledStepsTitle,
} from './styles';
import { Section } from '@wizehub/common/models/genericEntities';
import { brandColour, greyScaleColour, otherColour } from '@wizehub/common/theme/style.palette';
import { setCurrentStep } from '@wizehub/tenant/redux/actions';
import { useDispatch } from 'react-redux';

interface FormDataProps {
  heading?: string;
  component: ComponentType<unknown>; // Specify the type of component as ComponentType<{}>
  navIcon?: ComponentType<unknown>;
}

interface StepNavigationProps {
  forms: FormDataProps[];
  currentFormIndex: number;
  traversedPages: number[];
  sections?: Section[];
}

const getColour = (traversedPages: number[], i: number) => {
  if (!traversedPages?.includes(i)) {
    return greyScaleColour.grey90;
  }
  return greyScaleColour.secondaryMain;
}

const currentFormIndexColour = (currentFormIndex: number, i: number, firstColour: string, secondColour: string) => {
  if (currentFormIndex === i) {
    return firstColour;
  }
  return secondColour;
};

const StepNavigation: React.FC<StepNavigationProps> = ({
  forms,
  currentFormIndex,
  traversedPages,
  sections
}) => {
  const stepsCount = forms?.length;
  const reduxDispatch = useDispatch();

  // Function to generate step lines and circles
  const generateSteps = () => {
    const steps: any = [];
    for (let i: number = 0; i < stepsCount; i += 1) {
      const title: string = sections?.[i]?.presentationData?.title;
      const subTitle: string = sections?.[i]?.presentationData?.subTitle;

      const Icon: ComponentType<unknown> = forms[i]?.navIcon;
      const getIcon = (currentFormIndex: number, i: number, traversedPages?: number[]) => {
        if (currentFormIndex !== i && traversedPages?.includes(i)) {
          return <CheckOutlinedIcon sx={{ width: '24px', height: '24px' }} />;
        }
        if (currentFormIndex === i) {
          return <HourglassTopOutlinedIcon />;
        }
        return <Icon />;
      };
      steps.push(
        <StyledStepsContainer container key={i}
          isStepCompleted={traversedPages?.includes(i)}
          onClick={() => traversedPages?.includes(i) && reduxDispatch(setCurrentStep(i))}
        >
          <Grid item>
            <Grid container display="flex" flexDirection="column" height="100%">
              <Grid item height={currentFormIndex === i ? "25%" : "35%"}>
                <StyledIconContainer
                  active={currentFormIndex === i}
                  completed={currentFormIndex !== i && traversedPages?.includes(i)}
                >
                  {Icon ? (
                    <StyledIcon>
                      {getIcon(currentFormIndex, i, traversedPages)}
                    </StyledIcon>
                  ) : (
                    <StyledIndex>{i + 1}</StyledIndex>
                  )}
                </StyledIconContainer>
              </Grid>
              <Grid item display="flex" alignItems="center" justifyContent="center" height={currentFormIndex === i ? "75%" : "65%"}>
                {i !== stepsCount - 1 && (
                  <StyledStepLine
                    active={currentFormIndex === i}
                    completed={currentFormIndex !== i && traversedPages?.includes(i)}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item width="100%" paddingBottom="16px">
            <Grid container display="flex" flexDirection="column" gap="4px">
              <Grid item>
                <Grid container gap="6px" sx={{ flexWrap: 'nowrap' }} xs={12}>
                  <Grid item display="flex" flexDirection="column" gap="7px" xs={7}>
                    <StyledSteps>
                      STEP
                      {' '}
                      {i + 1}
                    </StyledSteps>
                    <StyledStepsTitle
                      color={getColour(traversedPages, i)}
                    >
                      {title}
                    </StyledStepsTitle>
                  </Grid>
                  {(traversedPages?.includes(i) || currentFormIndex === i)
                    && (
                      <Grid item display="flex" justifyContent="center" alignItems="center" xs={5}>
                        <StyledStepsChipContainer
                          backgroundColor={currentFormIndexColour(currentFormIndex, i, brandColour.primary70, otherColour.successBg)}
                        >
                          <StyledStepsChip
                            color={currentFormIndexColour(currentFormIndex, i, brandColour.primaryMain, otherColour.successDefault)}
                          >
                            {currentFormIndexColour(currentFormIndex, i, 'In progress', 'Completed')}
                          </StyledStepsChip>
                        </StyledStepsChipContainer>
                      </Grid>
                    )}
                </Grid>
              </Grid>
              {currentFormIndex === i
                && (
                  <Grid item>
                    <StyledStepsDescription>
                      {subTitle}
                    </StyledStepsDescription>
                  </Grid>
                )}
            </Grid>
          </Grid>
        </StyledStepsContainer>
      );
    }
    return steps;
  };

  return (
    <>
      <StyledStepsBox>
        {generateSteps()}
      </StyledStepsBox>
      {/* <Box>
        <StyledContactUsContainer item>
          <StyledContactUsSubContainer container >
            <Grid item>
              <StyledQuestionMarkIconContainer>
                <StyledQuestionMarkIcon />
              </StyledQuestionMarkIconContainer>
            </Grid>
            <Grid item>
              <StyledHeadText>
                {messages?.wizeGapForms?.steps?.havingTrouble}
              </StyledHeadText>
            </Grid>
            <Grid item>
              <StyledContactUsText>
                {messages?.wizeGapForms?.steps?.contactUs}
              </StyledContactUsText>
            </Grid>
          </StyledContactUsSubContainer>
        </StyledContactUsContainer>
      </Box> */}
    </>
  );
};

export default StepNavigation;
