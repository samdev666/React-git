import React, { useState } from 'react';
import {
  Card,
  Table,
  Modal,
  SearchInput,
  MaterialDateRangePicker,
  MaterialAutocompleteInput,
} from '@wizehub/components';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import { useOptions, usePagination } from '@wizehub/common/hooks';
import {
  MetaData,
  getDefaultMetaData,
  PaginatedEntity,
  Option,
} from '@wizehub/common/models';
import { Grid } from '@mui/material';
import { formatStatus } from '@wizehub/components/table';
import { StyledVisibilityIcon } from '@wizehub/components/table/styles';
import {
  TenantGroupManagementEntity,
  TenantManagementEntity,
} from '@wizehub/common/models/genericEntities';
import { Status, StatusOptions } from '@wizehub/common/models/modules';
import {
  capitalizeEntireString,
  dateFormatterFunction,
  mapIdNameToOptionWithoutCaptializing,
} from '@wizehub/common/utils';
import moment from 'moment';
import TenantManagementForm from './addTenantManagement';
import {
  TENANT_GROUP_LISTING_API,
  TENANT_MANAGEMENT_LISTING_API,
} from '../../api';
import { TENANT_MANAGEMENT_LISTING } from '../../redux/actions';
import { routes } from '../../utils';
import messages from '../../messages';
import { ReduxState } from '../../redux/reducers';
import { Right } from '../../redux/reducers/auth';

const paginatedTenantManagement: PaginatedEntity = {
  key: 'tenantListingManagement',
  name: TENANT_MANAGEMENT_LISTING,
  api: TENANT_MANAGEMENT_LISTING_API,
};

const getDefaultTenantManagementFilter =
  (): MetaData<TenantManagementEntity> => ({
    ...getDefaultMetaData<TenantManagementEntity>(),
    order: 'name',
  });

interface Props {
  formVisibility: boolean;
  hideForm: () => void;
}

const TenantListing: React.FC<Props> = ({ formVisibility, hideForm }) => {
  const [dateRange, setDateRange] = useState<{
    startDate: Date;
    endDate: Date;
  }>({ startDate: null, endDate: null });

  const auth = useSelector((state: ReduxState) => state.auth);
  const reduxDispatch = useDispatch();

  const { options: groupOptions, searchOptions } =
    useOptions<TenantGroupManagementEntity>(TENANT_GROUP_LISTING_API, true);

  const {
    entity: tenantManagementData,
    updateFilters,
    applyFilters,
    resetFilters,
    connectFilter,
    fetchPage,
    updateLimit,
  } = usePagination<TenantManagementEntity>(
    paginatedTenantManagement,
    getDefaultTenantManagementFilter()
  );

  return (
    <>
      <Card
        headerCss={{ display: 'flex' }}
        header={
          <Grid container xs={12} margin="0 16px">
            <Grid item xs={3}>
              <SearchInput
                connectFilter={connectFilter}
                label={messages.tenantManagement.search}
              />
            </Grid>
            <Grid
              container
              item
              xs={7}
              marginLeft="auto"
              justifyContent="end"
              gap="16px"
            >
              <Grid item xs={4.5}>
                {connectFilter('nextBillingStartDate-nextBillingEndDate', {
                  label: messages?.tenantManagement?.dateRange,
                  autoApplyFilters: true,
                  multipleFilter: true,
                  filterKeys: ['nextBillingStartDate', 'nextBillingEndDate'],
                  valueKeys: ['startDate', 'endDate'],
                  formatMultipleFilterValue: (value: any) => {
                    const valueArray = Object.values(value);
                    return valueArray.map((obj) =>
                      moment(obj).format('YYYY-MM-DD')
                    );
                  },
                })(MaterialDateRangePicker)}
              </Grid>
              <Grid item xs={3}>
                {connectFilter('status', {
                  label: messages?.tenantManagement?.status,
                  enableClearable: true,
                  options: StatusOptions,
                  autoApplyFilters: true,
                  formatValue: (value?: number | string) =>
                    StatusOptions?.find((opt) => opt?.id === value),
                  formatFilterValue: (value?: Option) =>
                    capitalizeEntireString(value?.id),
                })(MaterialAutocompleteInput)}
              </Grid>
              {auth?.rights.includes(Right.GROUP_MANAGEMENT) && (
                <Grid item xs={3}>
                  {connectFilter('groupId', {
                    label: messages?.tenantManagement?.group,
                    enableClearable: true,
                    options: groupOptions?.map(
                      mapIdNameToOptionWithoutCaptializing
                    ),
                    searchOptions,
                    autoApplyFilters: true,
                    formatValue: (value?: number | string) =>
                      groupOptions
                        ?.map(mapIdNameToOptionWithoutCaptializing)
                        ?.find((opt) => opt?.id === value),
                    formatFilterValue: (value?: Option) => value?.id,
                  })(MaterialAutocompleteInput)}
                </Grid>
              )}
            </Grid>
          </Grid>
        }
        cardCss={{ margin: '0 20px', overflow: 'visible !important' }}
      >
        <Table
          specs={[
            {
              id: 'sno',
              label: messages?.tenantManagement?.tenantListingTable?.serialNo,
            },
            {
              id: 'name',
              label: messages?.tenantManagement?.tenantListingTable?.name,
            },
            {
              id: 'product',
              label: messages?.tenantManagement?.tenantListingTable?.product,
              getValue: (row: TenantManagementEntity) => row?.productName,
              format: (row: string) => row || '-',
            },
            {
              id: 'abn',
              label: messages?.tenantManagement?.tenantListingTable?.abn,
            },
            {
              id: 'group',
              label: messages?.tenantManagement?.tenantListingTable?.groupName,
              getValue: (row: TenantManagementEntity) => row?.group?.name,
              format: (row: string) => row || '-',
            },
            {
              id: 'nextBillingDate',
              label:
                messages?.tenantManagement?.tenantListingTable?.nextBillingDate,
              getValue: (row: TenantManagementEntity) => row?.nextBillingDate,
              format: (row: string) => (row ? dateFormatterFunction(row) : '-'),
            },
            {
              id: 'status',
              label: messages?.tenantManagement?.tenantListingTable?.status,
              getValue: (row: TenantManagementEntity) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
          ]}
          data={tenantManagementData?.records}
          metadata={tenantManagementData?.metadata}
          disableSorting={['status', 'sno', 'product', 'group']}
          updateFilters={(filterParams: any) => {
            updateFilters(filterParams);
            applyFilters();
          }}
          actions={[
            {
              id: 'view',
              component: <StyledVisibilityIcon />,
              onClick: (row: TenantManagementEntity) => {
                reduxDispatch(
                  push(
                    routes.tenantmanagement.tenantDetail.replace(
                      ':id',
                      row?.id?.toString()
                    )
                  )
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
        heading={messages?.tenantManagement?.form?.addNewTenant}
        onClose={hideForm}
        fitContent
      >
        <TenantManagementForm
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

export default TenantListing;
