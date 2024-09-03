import React from 'react';
import { Card, Table, Modal } from '@wizehub/components';
import { usePagination, usePopupReducer } from '@wizehub/common/hooks';
import {
  MetaData,
  getDefaultMetaData,
  PaginatedEntity,
  UserActionConfig,
} from '@wizehub/common/models';
import { formatStatus } from '@wizehub/components/table';
import { StyledRemoveIcon } from '@wizehub/components/table/styles';
import { TenantGroupTenantEntity } from '@wizehub/common/models/genericEntities';
import { useParams } from 'react-router-dom';
import { HttpMethods } from '@wizehub/common/utils';
import { useSelector } from 'react-redux';
import { Status } from '@wizehub/common/models/modules';
import DeleteCTAForm from './deleteCTAForm';
import AddTenantForm from './addTenantForm';
import {
  TENANT_GROUP_TENANT_LISTING,
  TENANT_MANAGEMENT_DETAIL,
} from '../../api';
import { TENANT_GROUP_TENANT_MANAGEMENT } from '../../redux/actions';
import messages from '../../messages';
import { ReduxState } from '../../redux/reducers';
import { Right } from '../../redux/reducers/auth';

const paginatedTenantGroupManagementDetail: PaginatedEntity = {
  key: 'tenantGroupTenantManagement',
  name: TENANT_GROUP_TENANT_MANAGEMENT,
  api: TENANT_GROUP_TENANT_LISTING,
};

const getDefaultTenantGroupManagementDetailFilter = (
  groupId?: string,
): MetaData<TenantGroupTenantEntity> => ({
  ...getDefaultMetaData<TenantGroupTenantEntity>(),
  order: 'name',
  filters: {
    groupId,
  },
});
interface Props {
  addTenantFormVisibility: boolean;
  hideAddTenantForm: () => void;
}

const TenantGroupManagementDetail: React.FC<Props> = ({
  addTenantFormVisibility,
  hideAddTenantForm,
}) => {
  const { id } = useParams<{ id?: string }>();
  const auth = useSelector((state: ReduxState) => state.auth);
  const disabledItems = !auth?.rights.includes(Right.TENANT_MANAGEMENT_READ_ONLY);
  const {
    entity,
    updateFilters,
    applyFilters,
    fetchPage,
    updateLimit,
  } = usePagination<TenantGroupTenantEntity>(
    paginatedTenantGroupManagementDetail,
    getDefaultTenantGroupManagementDetailFilter(id),
  );

  const {
    visibility: removeUserFormVisibility,
    showPopup: showRemoveUserForm,
    hidePopup: hideRemoveUserForm,
    metaData: removeUserConfig,
  } = usePopupReducer<UserActionConfig>();

  return (
    <>
      <Card noHeader cardCss={{ margin: '0 20px' }}>
        <Table
          specs={[
            {
              id: 'sno',
              label:
              messages?.tenantManagement?.tenantGroupDetail?.addTenant.table.serialNo,
            },
            {
              id: 'name',
              label:
              messages?.tenantManagement?.tenantGroupDetail?.addTenant.table.name,
            },
            {
              id: 'status',
              label: messages?.tenantManagement?.tenantGroupDetail?.addTenant?.table?.status,
              getValue: (row: TenantGroupTenantEntity) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
          ]}
          disableSorting={['sno']}
          updateFilters={(filterParams: any) => {
            updateFilters(filterParams);
            applyFilters();
          }}
          data={entity?.records}
          metadata={entity?.metadata}
          actions={[disabledItems
            && {
              id: 'delete',
              component: <StyledRemoveIcon />,
              onClick: (row: TenantGroupTenantEntity) => showRemoveUserForm({ id: row.id }),
            },
          ]}
          fetchPage={fetchPage}
          updateLimit={updateLimit}
        />
      </Card>
      <Modal
        show={addTenantFormVisibility}
        heading={
          messages?.tenantManagement?.tenantGroupDetail?.addTenant?.heading
        }
        onClose={hideAddTenantForm}
        fitContent
      >
        <AddTenantForm
          onCancel={hideAddTenantForm}
          onSuccess={() => {
            hideAddTenantForm();
            applyFilters();
          }}
          groupId={id}
        />
      </Modal>
      <Modal
        show={removeUserFormVisibility}
        heading={
          messages?.tenantManagement?.tenantGroupDetail?.removeForm
            ?.tenantHeading
        }
        onClose={hideRemoveUserForm}
        fitContent
      >
        <DeleteCTAForm
          onCancel={hideRemoveUserForm}
          onSuccess={() => {
            hideRemoveUserForm();
            applyFilters();
          }}
          api={`${TENANT_MANAGEMENT_DETAIL}/${removeUserConfig?.id}`}
          bodyText={
            messages?.tenantManagement?.tenantGroupDetail?.removeForm
              ?.tenantNote
          }
          apiMethod={HttpMethods.PATCH}
          cancelButton={messages?.general?.cancel}
          confirmButton={messages?.general?.remove}
          deleteBody={{
            groupId: null,
          }}
        />
      </Modal>
    </>
  );
};

export default TenantGroupManagementDetail;
