import React from 'react';
import {
  Card, Table, Modal, Toast,
} from '@wizehub/components';
import { usePagination, usePopupReducer } from '@wizehub/common/hooks';
import {
  MetaData,
  getDefaultMetaData,
  PaginatedEntity,
  UserActionConfig,
} from '@wizehub/common/models';
import { formatStatus } from '@wizehub/components/table';
import { StyledRemoveIcon } from '@wizehub/components/table/styles';
import { TenantGroupUserEntity } from '@wizehub/common/models/genericEntities';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { Status } from '@wizehub/common/models/modules';
import DeleteCTAForm from './deleteCTAForm';
import AddNewUserForm from './addNewUserForm';
import { TENANT_GROUP_USER, TENANT_GROUP_USER_LISTING } from '../../api';
import { TENANT_GROUP_USER_MANAGEMENT } from '../../redux/actions';
import messages from '../../messages';
import UserManagementForm from '../userManagement/addUserManagement';
import { ReduxState } from '../../redux/reducers';
import { Right } from '../../redux/reducers/auth';

const paginatedUserGroupManagementDetail: PaginatedEntity = {
  key: 'tenantGroupUserManagement',
  name: TENANT_GROUP_USER_MANAGEMENT,
  api: TENANT_GROUP_USER_LISTING,
};

const getDefaultUserGroupManagementDetailFilter = (
  groupId: string,
): MetaData<TenantGroupUserEntity> => ({
  ...getDefaultMetaData<TenantGroupUserEntity>(),
  order: 'name',
  filters: {
    groupId,
  },
});

interface Props {
  addNewUserFormVisibility: boolean;
  showAddNewUserForm: () => void;
  hideAddNewUserForm: () => void;
}

const UserGroupManagementListing: React.FC<Props> = ({
  addNewUserFormVisibility,
  showAddNewUserForm,
  hideAddNewUserForm,
}) => {
  const { id } = useParams<{ id?: string }>();
  const auth = useSelector((state: ReduxState) => state.auth);
  const disabledItems = !auth?.rights.includes(Right.TENANT_MANAGEMENT_READ_ONLY);
  const {
    entity: userGroupManagementDetailData,
    updateFilters,
    applyFilters,
    fetchPage,
    updateLimit,
  } = usePagination<TenantGroupUserEntity>(
    paginatedUserGroupManagementDetail,
    getDefaultUserGroupManagementDetailFilter(id),
  );

  const {
    visibility: removeUserFormVisibility,
    showPopup: showRemoveUserForm,
    hidePopup: hideRemoveUserForm,
    metaData: removeUserConfig,
  } = usePopupReducer<UserActionConfig>();

  const {
    visibility: createNewUserFormVisibility,
    showPopup: showCreateNewUserForm,
    hidePopup: hideCreateNewUserForm,
  } = usePopupReducer<UserActionConfig>();

  const userGroupManagementDetailToastComponent = () => (
    <Toast
      text={
        messages?.tenantManagement?.tenantListingDetail?.attachedUser
          ?.success
      }
    />
  );

  return (
    <>
      <Card noHeader cardCss={{ margin: '0 20px' }}>
        <Table
          specs={[
            {
              id: 'sno',
              label:
                messages.tenantManagement.tenantListingDetail.attachedUser
                  .serialNo,
            },
            {
              id: 'name',
              label:
                messages.tenantManagement.tenantListingDetail.attachedUser.name,
            },
            {
              id: 'status',
              label: 'Status',
              getValue: (row: TenantGroupUserEntity) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
          ]}
          disableSorting={['sno']}
          updateFilters={(filterParams: any) => {
            updateFilters(filterParams);
            applyFilters();
          }}
          data={userGroupManagementDetailData?.records}
          metadata={userGroupManagementDetailData?.metadata}
          actions={[disabledItems
            && {
              id: 'delete',
              component: <StyledRemoveIcon />,
              onClick: (row: TenantGroupUserEntity) => showRemoveUserForm({ id: row.id }),
            },
          ]}
          fetchPage={fetchPage}
          updateLimit={updateLimit}
        />
      </Card>
      <Modal
        show={addNewUserFormVisibility}
        heading={messages?.tenantManagement?.addNewUser?.heading}
        onClose={hideAddNewUserForm}
        fitContent
      >
        <AddNewUserForm
          onCancel={hideAddNewUserForm}
          onSuccess={() => {
            hideAddNewUserForm();
            applyFilters();
          }}
          onCreateNewUserButton={showCreateNewUserForm}
          isGroupForm
        />
      </Modal>
      <Modal
        show={createNewUserFormVisibility}
        heading={messages?.tenantManagement?.addNewUser?.createNewUser}
        onClose={() => {
          hideCreateNewUserForm();
          showAddNewUserForm();
        }}
        fitContent
      >
        <UserManagementForm
          onCancel={() => {
            hideCreateNewUserForm();
            showAddNewUserForm();
          }}
          onSuccess={() => {
            hideCreateNewUserForm();
            showAddNewUserForm();
          }}
        />
      </Modal>
      <Modal
        show={removeUserFormVisibility}
        heading={
          messages?.tenantManagement?.tenantGroupDetail?.removeForm?.userHeading
        }
        onClose={hideRemoveUserForm}
        fitContent
      >
        <DeleteCTAForm
          onCancel={hideRemoveUserForm}
          onSuccess={() => {
            hideRemoveUserForm();
            toast(userGroupManagementDetailToastComponent());
            applyFilters();
          }}
          api={TENANT_GROUP_USER}
          bodyText={
            messages?.tenantManagement?.tenantGroupDetail?.removeForm?.userNote
          }
          cancelButton={messages?.general?.cancel}
          confirmButton={messages?.general?.remove}
          deleteBody={{ groupId: id, userId: removeUserConfig?.id }}
        />
      </Modal>
    </>
  );
};

export default UserGroupManagementListing;
