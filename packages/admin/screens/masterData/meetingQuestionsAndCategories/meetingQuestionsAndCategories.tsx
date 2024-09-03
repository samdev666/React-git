import React, { useState } from 'react';
import { Button, CustomTabs, Stepper } from '@wizehub/components';
import { usePopupReducer } from '@wizehub/common/hooks';
import { Option } from '@wizehub/common/models';
import { Container } from '../../../components';
import {
  StyledMasterDataHeadingContainer,
  StyledMasterDataLeftHeadingContainer,
} from '../styles';
import messages from '../../../messages';
import MeetingQuestions from './meetingQuestions';
import Category from './category';
import { StyledHeadingTypography } from '../../userManagement/styles';
import { ResponsiveAddIcon } from '../../productManagement/productManagement';

interface Props { }

const meetingQuestionCategoryTabs: Option[] = [
  {
    id: 'question',
    label: messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
      .subItems.meetingQuestionsAndCategories.meetingQuestions,
  },
  {
    id: 'category',
    label: messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
      .subItems.meetingQuestionsAndCategories.category,
  },
];

const MeetingQuestionsAndCategories: React.FC<Props> = () => {
  const [activeTab, setActiveTab] = useState<'question' | 'category'>('question');

  const {
    visibility: questionFormVisibility,
    showPopup: showQuestionForm,
    hidePopup: hideQuestionForm,
  } = usePopupReducer();

  const {
    visibility: categoryFormVisibility,
    showPopup: showCategoryForm,
    hidePopup: hideCategoryForm,
  } = usePopupReducer();

  return (
    <Container noPadding>
      <StyledMasterDataHeadingContainer>
        <StyledMasterDataLeftHeadingContainer>
          <Stepper />
          <StyledHeadingTypography>
            {messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
              .subItems.meetingQuestionsAndCategories.heading}
          </StyledHeadingTypography>
        </StyledMasterDataLeftHeadingContainer>
        <Button
          startIcon={<ResponsiveAddIcon />}
          variant="contained"
          color="primary"
          label={activeTab === 'question'
            ? messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
              .subItems.meetingQuestionsAndCategories.questionButtonText
            : messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
              .subItems.meetingQuestionsAndCategories.categoryButtonText}
          onClick={() => (activeTab === 'question' ? showQuestionForm() : showCategoryForm())}
        />
      </StyledMasterDataHeadingContainer>

      <CustomTabs
        tabs={meetingQuestionCategoryTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === 'question'
        ? (
          <MeetingQuestions
            formVisibility={questionFormVisibility}
            hideForm={hideQuestionForm}
          />
        )
        : (
          <Category
            formVisibility={categoryFormVisibility}
            hideForm={hideCategoryForm}
          />
        )}
    </Container>
  );
};

export default MeetingQuestionsAndCategories;
