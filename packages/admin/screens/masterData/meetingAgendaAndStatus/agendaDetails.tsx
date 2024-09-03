import React from 'react';
import { useEntity, usePopupReducer } from '@wizehub/common/hooks';
import {
  Button, Card, Modal, Stepper, Table, Toast,
} from '@wizehub/components';
import { Grid } from '@mui/material';
import { formatStatus } from '@wizehub/components/table';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { HttpMethods } from '@wizehub/common/utils';
import { Status } from '@wizehub/common/models/modules';
import { GuideEntity, MeetingAgendaDetailEntity } from '@wizehub/common/models/genericEntities';
import AgendaForm from './agendaForm';
import DeleteCTAForm from '../../tenantManagement/deleteCTAForm';
import {
  StyledDetailChildren,
  StyledDetailFooter,
  StyledDetailHeading,
  StyledDetailHeadingContainer,
  StyledDetailTableContent,
  StyledDetailTableHeading,
  StyledHeadingTypography,
} from '../../userManagement/styles';
import messages from '../../../messages';
import {
  StyledApplicationAnchorTag,
  StyledMasterDataDetailButtonContainer,
  StyledMasterDataHeadingContainer,
  StyledMasterDataLeftHeadingContainer,
} from '../styles';
import { Container } from '../../../components';
import { MEETING_AGENDA } from '../../../api';
import { ResponsiveDeleteIcon, ResponsiveEditIcon } from '../../productManagement/productManagementDetails';

interface Props { }

const resourceUrl = (row: GuideEntity) => (
  <StyledApplicationAnchorTag
    href={
                        row?.resourceUrl?.includes('https://')
                            || row?.resourceUrl?.includes('http://')
                          ? row?.resourceUrl
                          : `https://${row?.resourceUrl}`
                    }
    target="_blank"
  >
    {row?.resourceUrl}
  </StyledApplicationAnchorTag>
);

const AgendaDetails: React.FC<Props> = () => {
  const { id: agendaId } = useParams<{id?: string}>();

  const { entity: meetingAgenda, refreshEntity } = useEntity<MeetingAgendaDetailEntity>(
    MEETING_AGENDA,
    agendaId,
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
              .subItems.meetingAgendaAndStatus.meetingAgendaDetails.heading}
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

      <Card noHeader cardCss={{ margin: '0 20px', overflowY: 'auto' }}>
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
              <Grid item xs={3}>
                <StyledDetailTableHeading>
                  {messages.sidebar.menuItems.secondaryMenu.subMenuItems
                    .masterData.subItems.meetingAgendaAndStatus.agenda}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {meetingAgenda?.title}
                </StyledDetailTableContent>
              </Grid>
              <Grid item xs={3}>
                <StyledDetailTableHeading>
                  {messages.sidebar.menuItems.secondaryMenu.subMenuItems
                    .masterData.subItems.meetingAgendaAndStatus.project}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {meetingAgenda?.project ? meetingAgenda?.project?.title : '-'}
                </StyledDetailTableContent>
              </Grid>
              <Grid item xs={3}>
                <StyledDetailTableHeading>
                  {messages.sidebar.menuItems.secondaryMenu.subMenuItems
                    .masterData.subItems.teamPosition.division}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {meetingAgenda?.divisions ? meetingAgenda?.divisions?.map((item) => `${item.divisionName}`).join(', ') : '-'}
                </StyledDetailTableContent>
              </Grid>
              <Grid item xs={3}>
                <StyledDetailTableHeading>
                  {messages.userManagement.userProfile.status}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {formatStatus(meetingAgenda?.status)}
                </StyledDetailTableContent>
              </Grid>
              <Grid item>
                <StyledDetailTableHeading>
                  {messages.sidebar.menuItems.secondaryMenu.subMenuItems
                    .masterData.subItems.meetingAgendaAndStatus
                    .meetingAgendaDetails.implementationDetail}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {meetingAgenda?.implementationDetail}
                </StyledDetailTableContent>
              </Grid>
              {meetingAgenda?.guides?.length
                                && (
                                <Grid item xs={12}>
                                  <StyledDetailTableHeading>
                                    {messages.sidebar.menuItems.secondaryMenu.subMenuItems
                                      .masterData.subItems.meetingAgendaAndStatus
                                      .meetingAgendaDetails.guideVideo}
                                  </StyledDetailTableHeading>
                                  <StyledDetailTableContent>
                                    <Table
                                      specs={[
                                        {
                                          id: 'sno',
                                          label: 'S.No',
                                        },
                                        {
                                          id: 'name',
                                          label: 'Name',
                                        },
                                        {
                                          id: 'type',
                                          label: 'Type',
                                        },
                                        {
                                          id: 'resourceUrl',
                                          label: 'Guide link',
                                          getValue: (row: MeetingAgendaDetailEntity) => row,
                                          format: (row: GuideEntity) => (
                                            resourceUrl(row)
                                          ),
                                        },
                                      ]}
                                      data={meetingAgenda?.guides}
                                      disableSorting={['sno', 'name', 'type', 'resourceUrl']}
                                      metadata={{
                                        order: '',
                                        direction: 'asc',
                                        total: 10,
                                        page: 1,
                                        limit: 10,
                                        filters: {},
                                        allowedFilters: [''],
                                      }}
                                    />
                                  </StyledDetailTableContent>
                                </Grid>
                                )}
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
                .masterData.subItems.meetingAgendaAndStatus.form.deleteAgenda}
              disabled={meetingAgenda?.status === Status.inactive}
              onClick={showDeleteQuestionForm}
            />
          </StyledDetailFooter>
        </Grid>
      </Card>

      <Modal
        show={formVisibility}
        heading={messages.sidebar.menuItems.secondaryMenu.subMenuItems
          .masterData.subItems.meetingAgendaAndStatus.form.editAgenda}
        onClose={hideForm}
        fitContent
      >
        <AgendaForm
          onCancel={hideForm}
          onSuccess={() => {
            hideForm();
            toast(<Toast
              text={
                                  messages.sidebar.menuItems.secondaryMenu.subMenuItems
                                    .masterData.subItems.meetingAgendaAndStatus.form.success?.agendaUpdated
                              }
            />);
            refreshEntity();
          }}
          endpoint={`${MEETING_AGENDA}/${meetingAgenda?.id}`}
          isUpdate
          agendaData={meetingAgenda}
        />
      </Modal>

      <Modal
        show={deleteQuestionformVisibility}
        heading={messages.sidebar.menuItems.secondaryMenu.subMenuItems
          .masterData.subItems.meetingAgendaAndStatus.form.deactivateAgenda}
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
                                    .masterData.subItems.meetingAgendaAndStatus.form.success?.agendaDeleted
                              }
            />);
            refreshEntity();
          }}
          api={`${MEETING_AGENDA}/${meetingAgenda?.id}`}
          bodyText={messages.sidebar.menuItems.secondaryMenu.subMenuItems
            .masterData.subItems.meetingAgendaAndStatus.form.deactivateAgendaText}
          cancelButton={messages?.general?.cancel}
          confirmButton={
                        messages.sidebar.menuItems.secondaryMenu.subMenuItems
                          .masterData.subItems.meetingAgendaAndStatus.form.deactivateAgenda
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

export default AgendaDetails;
