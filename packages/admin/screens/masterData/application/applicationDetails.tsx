import React, { useEffect, useState } from 'react';
import { useEntity, usePopupReducer } from '@wizehub/common/hooks';
import {
  Button, Card, Modal, Stepper, Toast,
} from '@wizehub/components';
import { Checkbox, FormControlLabel, Grid } from '@mui/material';
import { formatStatus } from '@wizehub/components/table';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { HttpMethods } from '@wizehub/common/utils';
import { LaunchPadType, Status } from '@wizehub/common/models/modules';
import { ApplicationDetailEntity } from '@wizehub/common/models/genericEntities';
import { config } from '../../../config';
import DeleteCTAForm from '../../tenantManagement/deleteCTAForm';
import ApplicationForm from './applicationForm';
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
  StyledApplicationAnchorTag,
  StyledApplicationFormTypographyText,
  StyledApplicationProfileAvatar,
  StyledMasterDataDetailButtonContainer,
  StyledMasterDataHeadingContainer,
  StyledMasterDataLeftHeadingContainer,
} from '../styles';
import messages from '../../../messages';
import { APPLICATION } from '../../../api';
import { Container } from '../../../components';
import { ResponsiveDeleteIcon, ResponsiveEditIcon } from '../../productManagement/productManagementDetails';

interface Props { }

const ApplicationDetails: React.FC<Props> = () => {
  const { id: applicationId } = useParams<{id?: string}>();

  const [checked, setChecked] = useState(true);

  const { entity: application, refreshEntity } = useEntity<ApplicationDetailEntity>(
    APPLICATION,
    applicationId,
  );

  const {
    visibility: formVisibility,
    showPopup: showForm,
    hidePopup: hideForm,
  } = usePopupReducer();

  const {
    visibility: deleteApplicationFormVisibility,
    showPopup: showDeleteApplicationForm,
    hidePopup: hideDeleteApplicationForm,
  } = usePopupReducer();

  useEffect(() => {
    setChecked(application?.type === LaunchPadType.WIZEHUB);
  }, [application]);

  return (
    <Container noPadding>
      <StyledMasterDataHeadingContainer>
        <StyledMasterDataLeftHeadingContainer>
          <Stepper />
          <StyledHeadingTypography>
            {messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
              .subItems.application.applicationDetails.heading}
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
                  {application?.name}
                </StyledDetailTableContent>
              </Grid>
              <Grid item xs={2}>
                <StyledDetailTableHeading>
                  {messages.sidebar.menuItems.secondaryMenu.subMenuItems
                    .masterData.subItems.application.applicationDetails.icon}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {application?.icon?.length
                    ? (
                      <StyledApplicationProfileAvatar
                        alt="avatar"
                        width="33px"
                        height="33px"
                        marginRight="12px"
                        src={`${config.baseImageUrl}/${application?.icon}`}
                      />
                    )
                    : (
                      <StyledApplicationProfileAvatar
                        alt="avatar"
                        width="33px"
                        height="33px"
                        marginRight="12px"
                      />
                    )}
                </StyledDetailTableContent>
              </Grid>
              <Grid item xs={2}>
                <StyledDetailTableHeading>
                  {messages.userManagement.userProfile.status}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {formatStatus(application?.status)}
                </StyledDetailTableContent>
              </Grid>
              <Grid item xs={3}>
                <FormControlLabel
                  label={(
                    <StyledApplicationFormTypographyText>
                      {messages.sidebar.menuItems.secondaryMenu.subMenuItems
                        .masterData.subItems.application.applicationDetails.isWizeApplication}
                    </StyledApplicationFormTypographyText>
)}
                  control={(
                    <Checkbox
                      checked={checked}
                    />
                                      )}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledDetailTableHeading>
                  {messages.sidebar.menuItems.secondaryMenu.subMenuItems
                    .masterData.subItems.application.applicationDetails.link}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  <StyledApplicationAnchorTag
                    href={
                                            application?.url?.includes('https://')
                                                || application?.url?.includes('http://')
                                              ? application?.url
                                              : `https://${application?.url}`
                                        }
                    target="_blank"
                  >
                    {application?.url}
                  </StyledApplicationAnchorTag>
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
                .masterData.subItems.application.form.deleteApplication}
              disabled={application?.status === Status.inactive}
              onClick={showDeleteApplicationForm}
            />
          </StyledDetailFooter>
        </Grid>
      </Card>

      <Modal
        show={formVisibility}
        heading={messages.sidebar.menuItems.secondaryMenu.subMenuItems
          .masterData.subItems.application.form.editApplication}
        onClose={hideForm}
        fitContent
      >
        <ApplicationForm
          onCancel={hideForm}
          onSuccess={() => {
            hideForm();
            refreshEntity();
          }}
          endpoint={`${APPLICATION}/${application?.id}`}
          isUpdate
          applicationData={application}
        />
      </Modal>

      <Modal
        show={deleteApplicationFormVisibility}
        heading={messages.sidebar.menuItems.secondaryMenu.subMenuItems
          .masterData.subItems.application.form.deactivateApplication}
        onClose={hideDeleteApplicationForm}
        fitContent
      >
        <DeleteCTAForm
          onCancel={hideDeleteApplicationForm}
          onSuccess={() => {
            hideDeleteApplicationForm();
            toast(<Toast
              text={
                                  messages.sidebar.menuItems.secondaryMenu.subMenuItems
                                    .masterData.subItems.application.form.success?.deleted
                              }
            />);
            refreshEntity();
          }}
          api={`${APPLICATION}/${application?.id}`}
          bodyText={messages.sidebar.menuItems.secondaryMenu.subMenuItems
            .masterData.subItems.application.form.deactivateApplicationText}
          cancelButton={messages?.general?.cancel}
          confirmButton={
                        messages.sidebar.menuItems.secondaryMenu.subMenuItems
                          .masterData.subItems.application.form.deactivateApplication
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

export default ApplicationDetails;
