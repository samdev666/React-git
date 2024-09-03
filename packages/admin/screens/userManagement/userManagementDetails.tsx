import React from 'react';
import {
  DetailPageWrapper, Modal, Toast,
} from '@wizehub/components';
import { usePopupReducer, useEntity } from '@wizehub/common/hooks';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
import { formatStatus } from '@wizehub/components/table';
import { UserManagementEntity } from '@wizehub/common/models/genericEntities';
import { useParams } from 'react-router-dom';
import { UserActionConfig } from '@wizehub/common/models';
import { toast } from 'react-toastify';
import { HttpMethods, capitalizeLegend } from '@wizehub/common/utils';
import { Status } from '@wizehub/common/models/modules';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { StyledResponsiveIcon } from '@wizehub/components/table/styles';
import { routes } from '../../utils';
import { ResponsiveDeleteIcon, ResponsiveEditIcon } from '../productManagement/productManagementDetails';
import DeleteCTAForm from '../tenantManagement/deleteCTAForm';
import UserPasswordForm from './changeUserPasswordForm';
import UserManagementForm from './addUserManagement';
import { USER_MANAGEMENT } from '../../api';
import messages from '../../messages';
import { Container } from '../../components';

export const ResponsiveHttpsOutlinedIcon = StyledResponsiveIcon(HttpsOutlinedIcon);

const toastComponentForUserManagement = () => (
  <Toast text={messages?.userManagement?.form?.delete} />
);

const UserManagementDetails: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const reduxDispatch = useDispatch();
  const { entity: userManagementData, refreshEntity } = useEntity<UserManagementEntity>(USER_MANAGEMENT);

  const {
    visibility: editFormVisibility,
    showPopup: showEditForm,
    hidePopup: hideEditForm,
  } = usePopupReducer<UserActionConfig>();

  const {
    visibility: passwordFormVisibility,
    showPopup: showPasswordForm,
    hidePopup: hidePasswordForm,
  } = usePopupReducer<UserActionConfig>();

  const {
    visibility: deleteFormVisibility,
    showPopup: showDeleteForm,
    hidePopup: hideDeleteForm,
  } = usePopupReducer<UserActionConfig>();

  return (
    <Container noPadding>
      <DetailPageWrapper
        heading={messages.userManagement.userProfile.heading}
        headingActionButtons={[
          {
            color: 'secondary',
            variant: 'outlined',
            label: messages.userManagement.userProfile.editDetails,
            startIcon: <ResponsiveEditIcon />,
            onClick: () => showEditForm(),
          },
          {
            variant: 'contained',
            color: 'primary',
            startIcon: <ResponsiveHttpsOutlinedIcon />,
            label: messages.userManagement.userProfile.changeUserPassword,
            onClick: () => showPasswordForm(),
          },
        ]}
        cardHeading={messages.userManagement.userProfile.generalInformation}
        cardContent={[
          {
            heading: messages.userManagement.userProfile.emailAddress,
            value: userManagementData?.email,
            gridWidth: 3,
          },
          {
            heading: messages.userManagement.userProfile.firstName,
            value: userManagementData?.firstName,
          },
          {
            heading: messages.userManagement.userProfile.lastName,
            value: userManagementData?.lastName,
          },
          {
            heading: messages.userManagement.userProfile.role,
            value: capitalizeLegend(userManagementData?.role?.name),
          },
          {
            heading: messages.userManagement.userProfile.status,
            value: formatStatus(userManagementData?.status),
          },
        ]}
        footerActionButton={[
          {
            color: 'error',
            variant: 'contained',
            startIcon: <ResponsiveDeleteIcon />,
            label: messages.userManagement.userProfile.deleteThisUser,
            onClick: () => showDeleteForm(),
            disabled: userManagementData?.status === Status.inactive,
          },
        ]}
      />
      <Modal
        show={editFormVisibility}
        heading={messages.userManagement.form.editUser}
        onClose={hideEditForm}
        fitContent
      >
        <UserManagementForm
          isUpdate
          onCancel={hideEditForm}
          onSuccess={() => {
            hideEditForm();
            refreshEntity();
          }}
          userManagement={userManagementData}
        />
      </Modal>
      <Modal
        show={passwordFormVisibility}
        heading={messages.userManagement.form.generateNewPassword}
        onClose={hidePasswordForm}
        fitContent
      >
        <UserPasswordForm
          onCancel={hidePasswordForm}
          onSuccess={hidePasswordForm}
          userId={id}
        />
      </Modal>
      <Modal
        show={deleteFormVisibility}
        heading={messages.userManagement.form.deactivateUser}
        onClose={hideDeleteForm}
        fitContent
      >
        <DeleteCTAForm
          api={`${USER_MANAGEMENT}/${id}`}
          bodyText={messages.userManagement.form.deactivateUserText}
          cancelButton={messages?.general?.cancel}
          confirmButton={messages.userManagement.form.deactivateUser}
          onCancel={hideDeleteForm}
          onSuccess={() => {
            hideDeleteForm();
            toast(toastComponentForUserManagement());
            reduxDispatch(push(routes.usermanagement.root));
          }}
          apiMethod={HttpMethods.PATCH}
          deleteBody={{
            roleId: userManagementData?.role?.id,
            status: Status.inactive,
          }}
        />
      </Modal>
    </Container>
  );
};

export default UserManagementDetails;
