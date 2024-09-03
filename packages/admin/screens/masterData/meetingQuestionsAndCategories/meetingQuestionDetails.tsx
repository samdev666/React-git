import React from 'react';
import { useEntity, usePopupReducer } from '@wizehub/common/hooks';
import {
  Button, Card, Modal, Stepper, Toast,
} from '@wizehub/components';
import { Grid } from '@mui/material';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { formatStatus } from '@wizehub/components/table';
import { HttpMethods } from '@wizehub/common/utils';
import { Status } from '@wizehub/common/models/modules';
import { MeetingQuestionEntity } from '@wizehub/common/models/genericEntities';
import DeleteCTAForm from '../../tenantManagement/deleteCTAForm';
import MeetingQuestionForm from './meetingQuestionForm';
import {
  StyledDetailChildren,
  StyledDetailFooter,
  StyledDetailHeading,
  StyledDetailHeadingContainer,
  StyledDetailTableContent,
  StyledDetailTableHeading,
  StyledHeadingTypography,
} from '../../userManagement/styles';
import {
  StyledMasterDataDetailButtonContainer,
  StyledMasterDataHeadingContainer,
  StyledMasterDataLeftHeadingContainer,
} from '../styles';
import messages from '../../../messages';
import { MEETING_QUESTION } from '../../../api';
import { Container } from '../../../components';
import { ResponsiveDeleteIcon, ResponsiveEditIcon } from '../../productManagement/productManagementDetails';

interface Props { }

const MeetingQuestionDetails: React.FC<Props> = () => {
  const { id: questionId } = useParams<{id?: string}>();

  const { entity: meetingQuestion, refreshEntity } = useEntity<MeetingQuestionEntity>(
    MEETING_QUESTION,
    questionId,
  );

  const {
    visibility: formVisibility,
    showPopup: showForm,
    hidePopup: hideForm,
  } = usePopupReducer();

  const {
    visibility: deleteQuestionformVisibility,
    showPopup: showDeleteQuestionForm,
    hidePopup: hideDeleteQuestionForm,
  } = usePopupReducer();

  return (
    <Container noPadding>
      <StyledMasterDataHeadingContainer>
        <StyledMasterDataLeftHeadingContainer>
          <Stepper />
          <StyledHeadingTypography>
            {messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
              .subItems.meetingQuestionsAndCategories.meetingQuestionDetails.heading}
          </StyledHeadingTypography>
        </StyledMasterDataLeftHeadingContainer>
        <StyledMasterDataDetailButtonContainer>
          <Button
            startIcon={<ResponsiveEditIcon />}
            variant="outlined"
            color="secondary"
            label={messages.userManagement.userProfile.editDetails}
            onClick={showForm}
          />
        </StyledMasterDataDetailButtonContainer>
      </StyledMasterDataHeadingContainer>

      <Card noHeader cardCss={{ margin: '0 20px' }}>
        <Grid container gap="24px">
          <StyledDetailHeadingContainer
            container
            item
            alignItems="center"
            justifyContent="space-between"
          >
            <StyledDetailHeading>
              {messages.userManagement.userProfile.generalInformation}
            </StyledDetailHeading>
          </StyledDetailHeadingContainer>
          <StyledDetailChildren
            container
            item
          >
            <Grid container item xs={12} gap="32px">
              <Grid item xs={4}>
                <StyledDetailTableHeading>
                  {messages.sidebar.menuItems.secondaryMenu.subMenuItems
                    .masterData.subItems.meetingQuestionsAndCategories.category}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {meetingQuestion?.category?.name}
                </StyledDetailTableContent>
              </Grid>
              <Grid item xs={4}>
                <StyledDetailTableHeading>
                  {messages.sidebar.menuItems.secondaryMenu.subMenuItems
                    .masterData.subItems.teamPosition.division}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {meetingQuestion?.divisions?.map((item) => `${item.name}`).join(', ')}
                </StyledDetailTableContent>
              </Grid>
              <Grid item xs={3}>
                <StyledDetailTableHeading>
                  {messages.userManagement.userProfile.status}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {formatStatus(meetingQuestion?.status)}
                </StyledDetailTableContent>
              </Grid>
              <Grid item>
                <StyledDetailTableHeading>
                  {messages.sidebar.menuItems.secondaryMenu.subMenuItems
                    .leadDataManagement.subItems.leadSource.form.questions}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {meetingQuestion?.question}
                </StyledDetailTableContent>
              </Grid>
            </Grid>
          </StyledDetailChildren>
          <StyledDetailFooter
            justifyContent="flex-end"
            container
            item
          >
            <Button
              startIcon={<ResponsiveDeleteIcon />}
              variant="contained"
              color="error"
              label={messages.sidebar.menuItems.secondaryMenu.subMenuItems
                .masterData.subItems.meetingQuestionsAndCategories.form.deleteQuestion}
              disabled={meetingQuestion?.status === Status.inactive}
              onClick={showDeleteQuestionForm}
            />
          </StyledDetailFooter>
        </Grid>
      </Card>

      <Modal
        show={formVisibility}
        heading={messages.sidebar.menuItems.secondaryMenu.subMenuItems
          .masterData.subItems.meetingQuestionsAndCategories.form.editQuestion}
        onClose={hideForm}
        fitContent
      >
        <MeetingQuestionForm
          onCancel={hideForm}
          onSuccess={() => {
            hideForm();
            toast(<Toast
              text={
                                  messages.sidebar.menuItems.secondaryMenu.subMenuItems
                                    .masterData.subItems.meetingQuestionsAndCategories.form.success?.questionUpdated
                              }
            />);
            refreshEntity();
          }}
          endpoint={`${MEETING_QUESTION}/${meetingQuestion?.id}`}
          isUpdate
          meetingQuestionData={meetingQuestion}
        />
      </Modal>

      <Modal
        show={deleteQuestionformVisibility}
        heading={messages.sidebar.menuItems.secondaryMenu.subMenuItems
          .masterData.subItems.meetingQuestionsAndCategories.form.deactivateQuestion}
        onClose={hideDeleteQuestionForm}
        fitContent
      >
        <DeleteCTAForm
          onCancel={hideDeleteQuestionForm}
          onSuccess={() => {
            hideDeleteQuestionForm();
            toast(<Toast
              text={
                                  messages.sidebar.menuItems.secondaryMenu.subMenuItems
                                    .masterData.subItems.meetingQuestionsAndCategories
                                    .form.success?.questionDeleted
                              }
            />);
            refreshEntity();
          }}
          api={`${MEETING_QUESTION}/${meetingQuestion?.id}`}
          bodyText={messages.sidebar.menuItems.secondaryMenu.subMenuItems
            .masterData.subItems.meetingQuestionsAndCategories.form.deactivateQuestionText}
          cancelButton={messages?.general?.cancel}
          confirmButton={
                        messages.sidebar.menuItems.secondaryMenu.subMenuItems
                          .masterData.subItems.meetingQuestionsAndCategories.form.deactivateQuestion
                    }
          apiMethod={HttpMethods.PATCH}
          deleteBody={
                        {
                          status: Status.inactive,
                        }
                    }
        />
      </Modal>
    </Container>
  );
};

export default MeetingQuestionDetails;
