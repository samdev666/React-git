import React, { useState } from 'react';
import {
  Card,
  Table,
  Modal,
  Stepper,
  Button,
  SearchInput,
  MaterialAutocompleteInput,
  MaterialDateRangePicker,
} from '@wizehub/components';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import {
  useOptions,
  usePagination,
  usePopupReducer,
} from '@wizehub/common/hooks';
import {
  MetaData,
  getDefaultMetaData,
  PaginatedEntity,
  Option,
  UserActionConfig,
  RoleInterface,
} from '@wizehub/common/models';
import { Grid } from '@mui/material';
import { formatStatus } from '@wizehub/components/table';
import { StyledVisibilityIcon } from '@wizehub/components/table/styles';
import { UserManagementEntity } from '@wizehub/common/models/genericEntities';
import {
  capitalizeEntireString,
  capitalizeLegend,
  dateFormatterFunction,
  mapIdNameToOption,
} from '@wizehub/common/utils';
import { Status, StatusOptions } from '@wizehub/common/models/modules';
import moment from 'moment';
import {
  StyledHeadingTypography,
  StyledUserManagementEmailcolumn,
  StyledUserManagementHeadingContainer,
  StyledUserManagementLeftHeadingContainer,
  StyledUserManagementNamecolumn,
} from './styles';
import UserManagementForm from './addUserManagement';
import { ROLES_FILTER, USER_MANAGEMENT_LISTING_API } from '../../api';
import { USERMANAGEMENTLISTING } from '../../redux/actions';
import { routes } from '../../utils';
import messages from '../../messages';
import { Container } from '../../components';
import { ResponsiveAddIcon } from '../productManagement/productManagement';

const paginatedUserManagement: PaginatedEntity = {
  key: 'userManagement',
  name: USERMANAGEMENTLISTING,
  api: USER_MANAGEMENT_LISTING_API,
};

const getDefaultUserManagementFilter = (): MetaData<UserManagementEntity> => ({
  ...getDefaultMetaData<UserManagementEntity>(),
  order: 'firstName',
});

const userManagementNameColumn = (row: UserManagementEntity) => {
  const name = `${row.firstName} ${row.lastName}`;
  return (
    <Grid container display="flex" flexDirection="column">
      <Grid item>
        <StyledUserManagementNamecolumn>
          {row?.firstName && row?.lastName ? name : '-'}
        </StyledUserManagementNamecolumn>
      </Grid>
      <Grid item>
        <StyledUserManagementEmailcolumn>
          {row.email}
        </StyledUserManagementEmailcolumn>
      </Grid>
    </Grid>
  );
};

const UserManagement = () => {
  const reduxDispatch = useDispatch();
  const [dateRange, setDateRange] = useState<{
    startDate: Date;
    endDate: Date;
  }>({ startDate: null, endDate: null });

  const {
    entity: userManagementData,
    updateFilters,
    applyFilters,
    connectFilter,
    fetchPage,
    updateLimit,
  } = usePagination<UserManagementEntity>(
    paginatedUserManagement,
    getDefaultUserManagementFilter()
  );

  const {
    visibility: formVisibility,
    showPopup: showForm,
    hidePopup: hideForm,
  } = usePopupReducer<UserActionConfig>();

  const { options: roleOptions, searchOptions } = useOptions<RoleInterface>(
    ROLES_FILTER,
    true
  );

  return (
    <Container noPadding>
      <StyledUserManagementHeadingContainer>
        <StyledUserManagementLeftHeadingContainer>
          <Stepper />
          <StyledHeadingTypography>
            {messages.userManagement.heading}
          </StyledHeadingTypography>
        </StyledUserManagementLeftHeadingContainer>
        <Button
          startIcon={<ResponsiveAddIcon />}
          variant="contained"
          color="primary"
          label={messages.userManagement.buttonText}
          onClick={() => showForm()}
        />
      </StyledUserManagementHeadingContainer>
      <Card
        headerCss={{ display: 'flex' }}
        header={
          <Grid container margin="0 16px" xs={12}>
            <Grid item xs={3}>
              <SearchInput
                connectFilter={connectFilter}
                label={messages.userManagement.searchUser}
              />
            </Grid>
            <Grid container item xs={7} justifyContent="end" marginLeft="auto">
              <Grid xs={4.5} item mr={2}>
                {connectFilter('lastLoginStartDate-lastLoginEndDate', {
                  label: messages?.userManagement?.dateRange,
                  autoApplyFilters: true,
                  filterKeys: ['lastLoginStartDate', 'lastLoginEndDate'],
                  valueKeys: ['startDate', 'endDate'],
                  formatMultipleFilterValue: (value: any) => {
                    const valueArray = Object.values(value);
                    return valueArray.map((obj) =>
                      moment(obj).format('YYYY-MM-DD')
                    );
                  },
                  multipleFilter: true,
                })(MaterialDateRangePicker)}
              </Grid>
              <Grid xs={3} item mr={2}>
                {connectFilter('status', {
                  label: messages?.userManagement?.status,
                  enableClearable: true,
                  options: StatusOptions,
                  autoApplyFilters: true,
                  formatValue: (value?: number | string) =>
                    StatusOptions?.find((opt) => opt?.id === value),
                  formatFilterValue: (value?: Option) =>
                    capitalizeEntireString(value?.id),
                })(MaterialAutocompleteInput)}
              </Grid>
              <Grid xs={3} item>
                {connectFilter('roleId', {
                  label: messages?.userManagement?.role,
                  enableClearable: true,
                  options: roleOptions?.map(mapIdNameToOption),
                  autoApplyFilters: true,
                  searchOptions,
                  formatValue: (value?: number | string) =>
                    roleOptions
                      ?.map(mapIdNameToOption)
                      .find((opt) => opt?.id === value),
                  formatFilterValue: (value?: Option) => value?.id,
                })(MaterialAutocompleteInput)}
              </Grid>
            </Grid>
          </Grid>
        }
        cardCss={{ margin: '0 20px', overflow: 'visible !important' }}
      >
        <Table
          specs={[
            {
              id: 'sno',
              label: messages?.userManagement?.table?.sno,
            },
            {
              id: 'name',
              label: messages?.userManagement?.table?.name,
              getValue: (row: UserManagementEntity) => row,
              format: (row: UserManagementEntity) =>
                userManagementNameColumn(row),
            },
            {
              id: 'role',
              label: messages?.userManagement?.table?.role,
              getValue: (row: UserManagementEntity) =>
                capitalizeLegend(row?.data?.name),
            },
            {
              id: 'status',
              label: messages?.userManagement?.table?.status,
              getValue: (row: UserManagementEntity) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
            {
              id: 'lastLogin',
              label: messages?.userManagement?.table?.lastLogin,
              getValue: (row: UserManagementEntity) => row,
              format: (row: UserManagementEntity) =>
                row?.lastLogin ? dateFormatterFunction(row?.lastLogin) : '-',
            },
          ]}
          data={userManagementData?.records}
          metadata={userManagementData?.metadata}
          actions={[
            {
              id: 'view',
              component: <StyledVisibilityIcon />,
              onClick: (row: UserManagementEntity) => {
                reduxDispatch(
                  push(
                    routes.usermanagement.userProfile.replace(
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
          disableSorting={['status', 'role', 'sno']}
          updateFilters={(filterParams: any) => {
            updateFilters(filterParams);
            applyFilters();
          }}
        />
      </Card>

      <Modal
        show={formVisibility}
        heading={messages.userManagement.form.addUser}
        onClose={hideForm}
        fitContent
      >
        <UserManagementForm
          onCancel={hideForm}
          onSuccess={() => {
            hideForm();
            applyFilters();
          }}
        />
      </Modal>
    </Container>
  );
};

export default UserManagement;
