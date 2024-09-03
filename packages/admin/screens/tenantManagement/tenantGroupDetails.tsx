import React, { useState } from 'react';
import { Grid } from '@mui/material';
import {
  Card,
  Modal,
  Stepper,
  Button,
  CustomTabs,
  Toast,
} from '@wizehub/components';
import { usePopupReducer, useEntity } from '@wizehub/common/hooks';
import { formatStatus } from '@wizehub/components/table';
import {
  Option,
  UserActionConfig,
  UserActionType,
} from '@wizehub/common/models';
import { TenantGroupManagementEntity } from '@wizehub/common/models/genericEntities';
import { useParams } from 'react-router-dom';
import { HttpMethods } from '@wizehub/common/utils';
import { Status } from '@wizehub/common/models/modules';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import TenantGroupManagementDetail from './tenantGroupManagementDetail';
import UserGroupManagementListing from './userGroupManagementDetail';
import AddGroupForm from './addGroupForm';
import DeleteCTAForm from './deleteCTAForm';
import {
  StyledDetailChildren,
  StyledDetailFooter,
  StyledDetailHeading,
  StyledDetailHeadingContainer,
  StyledDetailTableContent,
  StyledDetailTableHeading,
  StyledHeadingTypography,
} from '../userManagement/styles';
import {
  StyledGroupDetailSecondaryCard,
  StyledTenantManagementDetailButtonContainer,
  StyledTenantManagementHeadingContainer,
  StyledTenantManagementLeftHeadingContainer,
} from './styles';
import { TENANT_GROUP, TENANT_GROUP_USER } from '../../api';
import messages from '../../messages';
import { Container } from '../../components';
import {
  ResponsiveDeleteIcon,
  ResponsiveEditIcon,
} from '../productManagement/productManagementDetails';
import { ResponsiveAddIcon } from '../productManagement/productManagement';
import { ReduxState } from '../../redux/reducers';
import { Right } from '../../redux/reducers/auth';

const groupDetailTabs: Option[] = [
  {
    id: 'users',
    label: messages.tenantManagement.tenantGroupDetail.users,
  },
  {
    id: 'tenants',
    label: messages.tenantManagement.tenantGroupDetail.tenants,
  },
];

const TenantGroupDetails: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { entity: tenantGroupManagement, refreshEntity } = useEntity<TenantGroupManagementEntity>(TENANT_GROUP);
  const auth = useSelector((state: ReduxState) => state.auth);
  const disabledItems = !auth?.rights.includes(Right.TENANT_MANAGEMENT_READ_ONLY);

  const [activeTab, setActiveTab] = useState<'users' | 'tenants'>('users');
  const {
    visibility: editFormVisibility,
    showPopup: showEditForm,
    hidePopup: hideEditForm,
  } = usePopupReducer<UserActionConfig>();

  const {
    visibility: deleteGroupFormVisibility,
    showPopup: showDeleteGroupForm,
    hidePopup: hideDeleteGroupForm,
  } = usePopupReducer<UserActionConfig>();

  const {
    visibility: addNewUserFormVisibility,
    showPopup: showAddNewUserForm,
    hidePopup: hideAddNewUserForm,
  } = usePopupReducer<UserActionConfig>();

  const {
    visibility: addTenantFormVisibility,
    showPopup: showAddTenantForm,
    hidePopup: hideAddTenantForm,
  } = usePopupReducer<UserActionConfig>();

  const {
    visibility: removeUserFormVisibility,
    hidePopup: hideRemoveUserForm,
    metaData: removeUserConfig,
  } = usePopupReducer<UserActionConfig>();

  const tenantGroupDetailToastComponent = () => (
    <Toast
      text={
        messages?.tenantManagement?.tenantGroupDetail?.deactivateGroup
          .success
      }
    />
  );

  return (
    <Container noPadding>
      <StyledTenantManagementHeadingContainer>
        <StyledTenantManagementLeftHeadingContainer>
          <Stepper />
          <StyledHeadingTypography>
            {messages.tenantManagement.tenantGroupDetail.heading}
          </StyledHeadingTypography>
        </StyledTenantManagementLeftHeadingContainer>
        {
          disabledItems && (
          <StyledTenantManagementDetailButtonContainer>
            <Button
              startIcon={<ResponsiveEditIcon />}
              variant="outlined"
              color="secondary"
              label={messages.tenantManagement.tenantGroupDetail.editButton}
              onClick={() => showEditForm({
                type: UserActionType.EDIT,
              })}
            />
          </StyledTenantManagementDetailButtonContainer>
          )
        }
      </StyledTenantManagementHeadingContainer>
      <Card noHeader cardCss={{ margin: '0 20px' }}>
        <Grid container>
          <StyledDetailHeadingContainer
            container
            item
            alignItems="center"
            justifyContent="space-between"
          >
            <StyledDetailHeading>
              {messages.tenantManagement.tenantGroupDetail.generalInformation}
            </StyledDetailHeading>
          </StyledDetailHeadingContainer>
          <StyledDetailChildren container item>
            <Grid container item xs={12} gap="32px">
              <Grid item xs={2}>
                <StyledDetailTableHeading>
                  {messages.tenantManagement.tenantGroupDetail.groupName}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {tenantGroupManagement?.name
                    ? tenantGroupManagement?.name
                    : '-'}
                </StyledDetailTableContent>
              </Grid>
              <Grid item xs={2}>
                <StyledDetailTableHeading>
                  {messages.tenantManagement.tenantGroupDetail.description}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {tenantGroupManagement?.description
                    ? tenantGroupManagement?.description
                    : '-'}
                </StyledDetailTableContent>
              </Grid>
              <Grid item xs={2}>
                <StyledDetailTableHeading>
                  {messages.tenantManagement.tenantGroupDetail.status}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {tenantGroupManagement?.status
                    ? formatStatus(tenantGroupManagement?.status)
                    : '-'}
                </StyledDetailTableContent>
              </Grid>
            </Grid>
          </StyledDetailChildren>
          {
            disabledItems && (
            <StyledDetailFooter justifyContent="flex-end" container item>
              <Button
                startIcon={<ResponsiveDeleteIcon />}
                variant="contained"
                color="error"
                label={
                messages.tenantManagement.tenantGroupDetail.deleteThisGroup
              }
                disabled={tenantGroupManagement?.status === Status.inactive}
                onClick={() => showDeleteGroupForm()}
              />
            </StyledDetailFooter>
            )
          }
        </Grid>
      </Card>
      <StyledGroupDetailSecondaryCard>
        <CustomTabs
          tabs={groupDetailTabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        {disabledItems && (
          activeTab !== 'tenants' ? (
            <Button
              startIcon={<ResponsiveAddIcon />}
              variant="contained"
              color="primary"
              label={messages.tenantManagement.tenantGroupDetail.addNewUser}
              onClick={() => showAddNewUserForm()}
            />
          ) : (
            <Button
              startIcon={<ResponsiveAddIcon />}
              variant="contained"
              color="primary"
              label={messages.tenantManagement.tenantGroupDetail.addNewTenant}
              onClick={() => showAddTenantForm()}
            />
          ))}
      </StyledGroupDetailSecondaryCard>
      {activeTab === 'users' ? (
        <UserGroupManagementListing
          addNewUserFormVisibility={addNewUserFormVisibility}
          showAddNewUserForm={showAddNewUserForm}
          hideAddNewUserForm={hideAddNewUserForm}
        />
      ) : (
        <TenantGroupManagementDetail
          addTenantFormVisibility={addTenantFormVisibility}
          hideAddTenantForm={hideAddTenantForm}
        />
      )}
      <Modal
        show={editFormVisibility}
        heading={messages?.tenantManagement?.form?.editTenantGroupDetails}
        onClose={hideEditForm}
        fitContent
      >
        <AddGroupForm
          onCancel={hideEditForm}
          onSuccess={() => {
            hideEditForm();
            refreshEntity();
          }}
          groupTenantDetail={tenantGroupManagement}
          isUpdate
        />
      </Modal>

      <Modal
        show={deleteGroupFormVisibility}
        heading={
          messages?.tenantManagement?.tenantGroupDetail?.deactivateGroup.heading
        }
        onClose={hideDeleteGroupForm}
        fitContent
      >
        <DeleteCTAForm
          onCancel={hideDeleteGroupForm}
          onSuccess={() => {
            hideDeleteGroupForm();
            toast(tenantGroupDetailToastComponent());
            refreshEntity();
          }}
          api={`${TENANT_GROUP}/${id}`}
          bodyText={
            messages?.tenantManagement?.tenantGroupDetail?.deactivateGroup.note
          }
          cancelButton={messages?.general?.cancel}
          confirmButton={
            messages?.tenantManagement?.tenantGroupDetail?.deactivateGroup
              .deactivateUser
          }
          apiMethod={HttpMethods.PATCH}
          deleteBody={{
            status: Status.inactive,
          }}
        />
      </Modal>

      <Modal
        show={removeUserFormVisibility}
        heading={
          activeTab === 'users'
            ? messages?.tenantManagement?.tenantGroupDetail?.removeForm
              ?.userHeading
            : messages?.tenantManagement?.tenantGroupDetail?.removeForm
              ?.tenantHeading
        }
        onClose={hideRemoveUserForm}
        fitContent
      >
        <DeleteCTAForm
          onCancel={hideRemoveUserForm}
          onSuccess={hideRemoveUserForm}
          api={activeTab === 'users' ? `${TENANT_GROUP_USER}` : ''}
          bodyText={
            activeTab === 'users'
              ? messages?.tenantManagement?.tenantGroupDetail?.removeForm
                ?.userNote
              : messages?.tenantManagement?.tenantGroupDetail?.removeForm
                ?.tenantNote
          }
          cancelButton={messages?.general?.cancel}
          confirmButton={messages?.general?.remove}
          deleteBody={
            activeTab === 'users'
              ? { groupId: id, userId: removeUserConfig?.id }
              : {}
          }
        />
      </Modal>
    </Container>
  );
};

export default TenantGroupDetails;
