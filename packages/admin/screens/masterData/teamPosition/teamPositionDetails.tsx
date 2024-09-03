import React from 'react';
import { useEntity, usePopupReducer } from '@wizehub/common/hooks';
import {
  Button, Card, Modal, Stepper, Toast,
} from '@wizehub/components';
import { Grid } from '@mui/material';
import { formatStatus } from '@wizehub/components/table';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { HttpMethods } from '@wizehub/common/utils';
import { Status } from '@wizehub/common/models/modules';
import { TeamPositionEntity } from '@wizehub/common/models/genericEntities';
import DeleteCTAForm from '../../tenantManagement/deleteCTAForm';
import TeamPositionForm from './teamPositionForm';
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
import { TEAM_POSITION } from '../../../api';
import { Container } from '../../../components';
import { ResponsiveDeleteIcon, ResponsiveEditIcon } from '../../productManagement/productManagementDetails';

interface Props { }

const TeamPositionDetails: React.FC<Props> = () => {
  const { id: positionId } = useParams<{id?: string}>();

  const { entity: teamPosition, refreshEntity } = useEntity<TeamPositionEntity>(
    TEAM_POSITION,
    positionId,
  );

  const {
    visibility: formVisibility,
    showPopup: showForm,
    hidePopup: hideForm,
  } = usePopupReducer();

  const {
    visibility: deletePositionFormVisibility,
    showPopup: showDeletePositionForm,
    hidePopup: hideDeletePositionForm,
  } = usePopupReducer();

  return (
    <Container noPadding>
      <StyledMasterDataHeadingContainer>
        <StyledMasterDataLeftHeadingContainer>
          <Stepper />
          <StyledHeadingTypography>
            {messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
              .subItems.teamPosition.heading}
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
              <Grid item xs={3}>
                <StyledDetailTableHeading>
                  {messages.sidebar.menuItems.secondaryMenu.subMenuItems
                    .leadDataManagement.subItems.leadSource.form.name}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {teamPosition?.name}
                </StyledDetailTableContent>
              </Grid>
              <Grid item xs={3}>
                <StyledDetailTableHeading>
                  {messages.sidebar.menuItems.secondaryMenu.subMenuItems
                    .masterData.subItems.teamPosition.teamPositionDetails.positionLevel}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {teamPosition?.positionLevel}
                </StyledDetailTableContent>
              </Grid>
              <Grid item xs={3}>
                <StyledDetailTableHeading>
                  {messages.sidebar.menuItems.secondaryMenu.subMenuItems
                    .masterData.subItems.teamPosition.division}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {teamPosition?.divisions?.map((item) => `${item.name}`).join(', ')}
                </StyledDetailTableContent>
              </Grid>
              <Grid item xs={2}>
                <StyledDetailTableHeading>
                  {messages.userManagement.userProfile.status}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {formatStatus(teamPosition?.status)}
                </StyledDetailTableContent>
              </Grid>
              <Grid item>
                <StyledDetailTableHeading>
                  {messages.sidebar.menuItems.secondaryMenu.subMenuItems
                    .masterData.subItems.teamPosition.teamPositionDetails.description}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {teamPosition?.description || '-'}
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
                .masterData.subItems.teamPosition.form.deletePosition}
              disabled={teamPosition?.status === Status.inactive}
              onClick={showDeletePositionForm}
            />
          </StyledDetailFooter>
        </Grid>
      </Card>

      <Modal
        show={formVisibility}
        heading={messages.sidebar.menuItems.secondaryMenu.subMenuItems
          .masterData.subItems.teamPosition.form.editPosition}
        onClose={hideForm}
        fitContent
      >
        <TeamPositionForm
          onCancel={hideForm}
          onSuccess={() => {
            hideForm();
            toast(<Toast
              text={
                                  messages.sidebar.menuItems.secondaryMenu.subMenuItems
                                    .masterData.subItems.teamPosition.form.success?.updated
                              }
            />);
            refreshEntity();
          }}
          endpoint={`${TEAM_POSITION}/${teamPosition?.id}`}
          isUpdate
          positionData={teamPosition}
        />
      </Modal>

      <Modal
        show={deletePositionFormVisibility}
        heading={messages.sidebar.menuItems.secondaryMenu.subMenuItems
          .masterData.subItems.teamPosition.form.deactivatePosition}
        onClose={hideDeletePositionForm}
        fitContent
      >
        <DeleteCTAForm
          onCancel={hideDeletePositionForm}
          onSuccess={() => {
            hideDeletePositionForm();
            toast(<Toast
              text={
                                  messages.sidebar.menuItems.secondaryMenu.subMenuItems
                                    .masterData.subItems.teamPosition.form.success?.deleted
                              }
            />);
            refreshEntity();
          }}
          api={`${TEAM_POSITION}/${teamPosition?.id}`}
          bodyText={messages.sidebar.menuItems.secondaryMenu.subMenuItems
            .masterData.subItems.teamPosition.form.deactivatePositionText}
          cancelButton={messages?.general?.cancel}
          confirmButton={
                        messages.sidebar.menuItems.secondaryMenu.subMenuItems
                          .masterData.subItems.teamPosition.form.deactivatePosition
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

export default TeamPositionDetails;
