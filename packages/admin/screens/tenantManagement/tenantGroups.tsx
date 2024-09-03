import React from 'react';
import {
  Card,
  Table,
  Modal,
  SearchInput,
  MaterialAutocompleteInput,
} from '@wizehub/components';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { usePagination } from '@wizehub/common/hooks';
import {
  MetaData,
  getDefaultMetaData,
  PaginatedEntity,
  Option,
} from '@wizehub/common/models';
import { Grid } from '@mui/material';
import { formatStatus } from '@wizehub/components/table';
import { StyledVisibilityIcon } from '@wizehub/components/table/styles';
import { TENANT_GROUP_MANAGEMENT_LISTING } from '@wizehub/common/redux/actions';
import { TenantGroupManagementEntity } from '@wizehub/common/models/genericEntities';
import { Status, StatusOptions } from '@wizehub/common/models/modules';
import { capitalizeEntireString } from '@wizehub/common/utils';
import { TENANT_GROUP_LISTING_API } from '../../api';
import AddGroupForm from './addGroupForm';
import { routes } from '../../utils';
import messages from '../../messages';

const paginatedTenantGroupManagement: PaginatedEntity = {
  key: 'tenantGroupManagement',
  name: TENANT_GROUP_MANAGEMENT_LISTING,
  api: TENANT_GROUP_LISTING_API,
};

const getDefaultTenantGroupManagementFilter = (): MetaData<TenantGroupManagementEntity> => ({
  ...getDefaultMetaData<TenantGroupManagementEntity>(),
  order: 'name',
});

interface Props {
  formVisibility: boolean;
  hideForm: () => void;
}

const TenantGroups: React.FC<Props> = ({ formVisibility, hideForm }) => {
  const {
    entity: tenantGroupManagementData,
    updateFilters,
    applyFilters,
    connectFilter,
    fetchPage,
    updateLimit,
  } = usePagination<TenantGroupManagementEntity>(
    paginatedTenantGroupManagement,
    getDefaultTenantGroupManagementFilter(),
  );
  const reduxDispatch = useDispatch();

  return (
    <>
      <Card
        headerCss={{ display: 'flex' }}
        header={(
          <Grid container margin="0 16px" xs={12}>
            <Grid item xs={3}>
              <SearchInput
                connectFilter={connectFilter}
                label={messages.tenantManagement.search}
              />
            </Grid>
            <Grid container item xs={7} justifyContent="end" marginLeft="auto">
              <Grid xs={3} item>
                {connectFilter('status', {
                  label: messages?.tenantManagement?.status,
                  enableClearable: true,
                  options: StatusOptions,
                  autoApplyFilters: true,
                  formatValue: (value?: number | string) => StatusOptions?.find((opt) => opt?.id === value),
                  formatFilterValue: (value?: Option) => capitalizeEntireString(value?.id),
                })(MaterialAutocompleteInput)}
              </Grid>
            </Grid>
          </Grid>
        )}
        cardCss={{ margin: '0 20px', overflow: 'visible !important' }}
      >
        <Table
          specs={[
            {
              id: 'sno',
              label: messages?.tenantManagement?.tenantGroupsTable?.serialNo,
            },
            {
              id: 'name',
              label: messages?.tenantManagement?.tenantGroupsTable?.name,
            },
            {
              id: 'tenants',
              label: messages?.tenantManagement?.tenantGroupsTable?.tenants,
              getValue: (row: TenantGroupManagementEntity) => row,
              format: (row: TenantGroupManagementEntity) => (row ? row?.tenantCount : '-'),
            },
            {
              id: 'status',
              label: messages?.tenantManagement?.tenantGroupsTable?.status,
              getValue: (row: TenantGroupManagementEntity) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
          ]}
          disableSorting={['tenants', 'status', 'sno']}
          updateFilters={(filterParams: any) => {
            updateFilters(filterParams);
            applyFilters();
          }}
          data={tenantGroupManagementData?.records}
          metadata={tenantGroupManagementData?.metadata}
          actions={[
            {
              id: 'view',
              component: <StyledVisibilityIcon />,
              onClick: (row: TenantGroupManagementEntity) => {
                reduxDispatch(
                  push(
                    routes.tenantmanagement.tenantGroupDetail.replace(
                      ':id',
                      row?.id?.toString(),
                    ),
                  ),
                );
              },
            },
          ]}
          fetchPage={fetchPage}
          updateLimit={updateLimit}
        />
      </Card>
      <Modal
        show={formVisibility}
        heading={messages?.tenantManagement?.groupForm?.heading}
        onClose={hideForm}
        fitContent
      >
        <AddGroupForm
          onCancel={hideForm}
          onSuccess={() => {
            hideForm();
            applyFilters();
          }}
        />
      </Modal>
    </>
  );
};

export default TenantGroups;
