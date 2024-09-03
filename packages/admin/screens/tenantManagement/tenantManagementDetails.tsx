import React from 'react';
import { Grid } from '@mui/material';
import {
  Card,
  Modal,
  Button,
  Table,
  Toast,
  DetailPageWrapper,
} from '@wizehub/components';
import {
  usePopupReducer,
  useEntity,
  usePagination,
} from '@wizehub/common/hooks';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { formatStatus } from '@wizehub/components/table';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import {
  Id,
  MetaData,
  PaginatedEntity,
  UserActionConfig,
  UserActionType,
  getDefaultMetaData,
} from '@wizehub/common/models';
import {
  StyledRemoveIcon,
  StyledResponsiveIcon,
} from '@wizehub/components/table/styles';
import {
  TenantDetailEntity,
  TenantProductDetailEntity,
  TenantUserEntity,
} from '@wizehub/common/models/genericEntities';
import { useSelector } from 'react-redux';
import { Status } from '@wizehub/common/models/modules';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { HttpMethods, dateFormatterFunction } from '@wizehub/common/utils';
import moment from 'moment';
import TenantManagementForm from './addTenantManagement';
import AttachProductForm from './attachProductForm';
import AddNewUserForm from './addNewUserForm';
import DeleteCTAForm from './deleteCTAForm';
import CancelSubscriptionForm from './cancelSubscriptionForm';
import RenewSubscriptionForm from './renewSubscriptionForm';
import UserManagementForm from '../userManagement/addUserManagement';
import { TENANT_USER_MANAGEMENT_LISTING } from '../../redux/actions';
import {
  ResponsiveDeleteIcon,
  ResponsiveEditIcon,
} from '../productManagement/productManagementDetails';
import {
  StyledDetailChildren,
  StyledDetailFooter,
  StyledDetailHeading,
  StyledDetailHeadingContainer,
  StyledDetailTableContent,
  StyledDetailTableHeading,
} from '../userManagement/styles';
import {
  StyledTenantDetailTabHeading,
} from './styles';

import messages from '../../messages';
import { Container } from '../../components';
import {
  TENANT_MANAGEMENT_DETAIL,
  TENANT_PRODUCT_DETAIL,
  TENANT_USER,
  TENANT_USER_LISTING,
} from '../../api';
import { ReduxState } from '../../redux/reducers';
import { Right } from '../../redux/reducers/auth';

const paginatedTenantUserManagement: PaginatedEntity = {
  key: 'tenantUserManagementListing',
  name: TENANT_USER_MANAGEMENT_LISTING,
  api: TENANT_USER_LISTING,
};

export const ResponsivePersonOutlinedIcon = StyledResponsiveIcon(
  PersonOutlineOutlinedIcon,
);
export const ResponsivePeopleAltOutlineIcon = StyledResponsiveIcon(
  PeopleAltOutlinedIcon,
);

const getDefaultTenantUserManagementFilter = (
  tenantId: Id,
): MetaData<TenantUserEntity> => ({
  ...getDefaultMetaData<TenantUserEntity>(),
  order: 'name',
  filters: {
    tenantId: tenantId?.toString(),
  },
});

const subscriptionEndDateHeadingFunction = (status: Status) => {
  let message = '';
  switch (status) {
    case Status.active:
      message = messages?.tenantManagement?.tenantListingDetail
        ?.subscriptDetail?.nextBillingDate;
      break;
    case Status.expiring:
      message = messages?.tenantManagement?.tenantListingDetail
        ?.subscriptDetail?.validityEndDate;
      break;
    default:
      message = messages?.tenantManagement?.tenantListingDetail
        ?.subscriptDetail?.endDate;
      break;
  }
  return message;
};

const TenantManagementDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { entity: tenantDetailEntity, refreshEntity } = useEntity<TenantDetailEntity>(TENANT_MANAGEMENT_DETAIL);
  const auth = useSelector((state: ReduxState) => state.auth);
  const disabledItems = !auth?.rights.includes(Right.TENANT_MANAGEMENT_READ_ONLY);

  const {
    entity: tenantProductDetailEntity,
    refreshEntity: tenantProductDetailRefreshEntity,
  } = useEntity<TenantProductDetailEntity>(TENANT_PRODUCT_DETAIL);

  const {
    entity: tenantUserListing,
    updateFilters,
    applyFilters,
    fetchPage,
    updateLimit,
  } = usePagination<TenantUserEntity>(
    paginatedTenantUserManagement,
    getDefaultTenantUserManagementFilter(id),
  );

  const {
    visibility: editFormVisibility,
    showPopup: showEditForm,
    hidePopup: hideEditForm,
    metaData: config,
  } = usePopupReducer<UserActionConfig>();

  const {
    visibility: attachProductFormVisibility,
    showPopup: showAttachProductForm,
    hidePopup: hideAttachProductForm,
    metaData: attachProductConfig,
  } = usePopupReducer<{ isActivate?: boolean }>();

  const {
    visibility: deactivateUserFormVisibility,
    showPopup: showDeactivateUserForm,
    hidePopup: hideDeactivateUserForm,
  } = usePopupReducer<UserActionConfig>();

  const {
    visibility: addNewUserFormVisibility,
    showPopup: showAddNewUserForm,
    hidePopup: hideAddNewUserForm,
  } = usePopupReducer<UserActionConfig>();

  const {
    visibility: createNewUserFormVisibility,
    showPopup: showCreateNewUserForm,
    hidePopup: hideCreateNewUserForm,
  } = usePopupReducer<UserActionConfig>();

  const {
    visibility: removeUserFormVisibility,
    showPopup: showRemoveUserForm,
    hidePopup: hideRemoveUserForm,
    metaData: removeUserFormConfig,
  } = usePopupReducer<UserActionConfig>();

  const {
    visibility: cancelSubscriptionFormVisibility,
    showPopup: showCancelSubscriptionForm,
    hidePopup: hideCancelSubscriptionForm,
  } = usePopupReducer<UserActionConfig>();

  const {
    visibility: renewSubscriptionFormVisibility,
    showPopup: showRenewSubscriptionForm,
    hidePopup: hideRenewSubscriptionForm,
  } = usePopupReducer<UserActionConfig>();

  const formatDate = (entity: TenantProductDetailEntity) => {
    if (!entity?.validityEndDate) {
      return '-';
    }

    const date = entity.status === Status.active
      ? moment(entity.validityEndDate).add(1, 'days')
      : entity.validityEndDate;

    return dateFormatterFunction(date);
  };

  const tenantManagementDetailToastComponent = () => (
    <Toast
      text={messages?.tenantManagement?.deactivateUserForm?.success}
    />
  );

  const tenantManagementDetailDeleteToastComponent = () => (
    <Toast text={messages?.tenantManagement?.removeUser?.success} />
  );

  return (
    <Container noPadding>
      <DetailPageWrapper
        heading={messages.tenantManagement.tenantListingDetail.heading}
        headingActionButtons={[
          {
            startIcon: <ResponsiveEditIcon />,
            variant: 'outlined',
            color: 'secondary',
            label: messages.tenantManagement.tenantListingDetail.editButton,
            onClick: () => showEditForm({
              type: UserActionType.EDIT,
            }),
          },
          {
            startIcon: <ResponsivePersonOutlinedIcon />,
            variant: 'outlined',
            color: 'secondary',
            label: messages.tenantManagement.tenantListingDetail.attachProduct,
            onClick: () => showAttachProductForm(),
          },
        ]}
        disabledActionButtons={disabledItems}
        cardHeading={messages.tenantManagement.tenantListingDetail.generalInformation}
        cardContent={[
          {
            heading: messages.tenantManagement.tenantListingDetail.tenantName,
            value: tenantDetailEntity?.name,
          },
          {
            heading: messages.tenantManagement.tenantListingDetail.abn,
            value: tenantDetailEntity?.abn,
          },
          {
            heading: messages.tenantManagement.tenantListingDetail.country,
            value: tenantDetailEntity?.countryId?.name,
          },
          {
            heading: messages.tenantManagement.tenantListingDetail.financialYearStartMonth,
            value: moment().month(tenantDetailEntity?.financialStartMonth - 1).format('MMMM'),
          },
          {
            heading: messages.tenantManagement.tenantListingDetail.group,
            value: tenantDetailEntity?.group?.name,
          },
          {
            heading: messages.tenantManagement.tenantListingDetail.status,
            value: formatStatus(tenantDetailEntity?.status),
          },
          {
            heading: messages.tenantManagement.tenantListingDetail.streetAddress,
            value: tenantDetailEntity?.streetAddress,
          },
          {
            heading: messages.tenantManagement.tenantListingDetail.city,
            value: tenantDetailEntity?.city,
          },
          {
            heading: messages?.tenantManagement?.tenantListingDetail?.postalAddress,
            value: tenantDetailEntity?.postalCode,
          },
        ]}
        footerActionButton={[
          {
            startIcon: <ResponsiveDeleteIcon />,
            variant: 'contained',
            color: 'error',
            disabled: tenantDetailEntity?.status === Status.inactive,
            label: messages?.tenantManagement?.tenantListingDetail?.deleteTenant,
            onClick: () => showDeactivateUserForm(),
          },
        ]}
      />
      {tenantProductDetailEntity && (
        <Card noHeader cardCss={{ margin: '0 20px' }}>
          <Grid container>
            <StyledDetailHeadingContainer
              container
              item
              alignItems="center"
              justifyContent="space-between"
            >
              <StyledDetailHeading>
                {
                  messages?.tenantManagement?.tenantListingDetail
                    ?.subscriptDetail?.heading
                }
              </StyledDetailHeading>
            </StyledDetailHeadingContainer>
            <StyledDetailChildren container item>
              <Grid container item xs={12} gap="32px">
                <Grid item xs={2}>
                  <StyledDetailTableHeading>
                    {
                      messages?.tenantManagement?.tenantListingDetail
                        ?.subscriptDetail?.productName
                    }
                  </StyledDetailTableHeading>
                  <StyledDetailTableContent>
                    {tenantProductDetailEntity?.product?.name
                      ? tenantProductDetailEntity?.product?.name
                      : '-'}
                  </StyledDetailTableContent>
                </Grid>
                <Grid item xs={2}>
                  <StyledDetailTableHeading>
                    {
                      messages?.tenantManagement?.tenantListingDetail
                        ?.subscriptDetail?.startDate
                    }
                  </StyledDetailTableHeading>
                  <StyledDetailTableContent>
                    {tenantProductDetailEntity?.startDate
                      ? dateFormatterFunction(tenantProductDetailEntity?.startDate)
                      : '-'}
                  </StyledDetailTableContent>
                </Grid>
                <Grid item xs={2}>
                  <StyledDetailTableHeading>
                    {
                      subscriptionEndDateHeadingFunction(tenantProductDetailEntity?.status)
                    }
                  </StyledDetailTableHeading>
                  <StyledDetailTableContent>
                    {formatDate(tenantProductDetailEntity)}
                  </StyledDetailTableContent>
                </Grid>
                <Grid item xs={2}>
                  <StyledDetailTableHeading>
                    {
                      messages?.tenantManagement?.tenantListingDetail
                        ?.subscriptDetail?.status
                    }
                  </StyledDetailTableHeading>
                  <StyledDetailTableContent>
                    {tenantProductDetailEntity?.status
                      ? formatStatus(tenantProductDetailEntity?.status)
                      : '-'}
                  </StyledDetailTableContent>
                </Grid>
              </Grid>
            </StyledDetailChildren>
            {
              disabledItems && (
              <StyledDetailFooter
                justifyContent="flex-end"
                container
                item
                gap="10px"
              >
                {tenantProductDetailEntity?.status === Status.cancelled ? (
                  <Button
                    variant="contained"
                    color="primary"
                    label={
                    messages?.tenantManagement?.tenantListingDetail?.activate
                  }
                    onClick={() => showAttachProductForm({
                      isActivate: true,
                    })}
                  />
                ) : (
                  <>
                    <Button
                      variant="contained"
                      color="error"
                      label={
                      messages?.tenantManagement?.tenantListingDetail
                        ?.subscriptDetail?.cancel
                    }
                      onClick={() => showCancelSubscriptionForm()}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      label={
                      messages?.tenantManagement?.tenantListingDetail
                        ?.subscriptDetail?.renew
                    }
                      onClick={() => showRenewSubscriptionForm()}
                    />
                  </>
                )}
              </StyledDetailFooter>
              )
            }
          </Grid>
        </Card>
      )}
      <Card
        header={(
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid item width="320px" marginLeft="16px">
              <StyledTenantDetailTabHeading>
                {
                  messages.tenantManagement.tenantListingDetail.attachedUser
                    .heading
                }
              </StyledTenantDetailTabHeading>
            </Grid>
            <Grid item display="flex" marginRight="16px">
              {
                  disabledItems && (
                  <Button
                    startIcon={<ResponsivePeopleAltOutlineIcon />}
                    variant="contained"
                    color="primary"
                    label={
                  messages.tenantManagement.tenantListingDetail.attachedUser
                    .assignExecutiveCoaches
                }
                    onClick={() => showAddNewUserForm()}
                  />
                  )
                }
            </Grid>
          </Grid>
        )}
        cardCss={{ margin: '0 20px', overflow: 'visible !important' }}
      >
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
              getValue: (row: TenantUserEntity) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
          ]}
          disableSorting={['status', 'sno']}
          updateFilters={(filterParams: any) => {
            updateFilters(filterParams);
            applyFilters();
          }}
          data={tenantUserListing?.records}
          metadata={tenantUserListing?.metadata}
          actions={[
            disabledItems
              && {
                id: 'delete',
                component: <StyledRemoveIcon />,
                onClick: (row: TenantUserEntity) => showRemoveUserForm({
                  id: row.id,
                }),
              },
          ]}
          fetchPage={fetchPage}
          updateLimit={updateLimit}
        />
      </Card>
      <Modal
        show={editFormVisibility}
        heading={messages?.tenantManagement?.form?.editTenantDetails}
        onClose={hideEditForm}
        fitContent
      >
        <TenantManagementForm
          isUpdate={config?.type === UserActionType.EDIT}
          onCancel={hideEditForm}
          onSuccess={() => {
            hideEditForm();
            refreshEntity();
          }}
          tenantManagement={tenantDetailEntity}
        />
      </Modal>
      <Modal
        show={attachProductFormVisibility}
        heading={messages?.tenantManagement?.attachProductForm?.heading}
        onClose={hideAttachProductForm}
        fitContent
      >
        <AttachProductForm
          onCancel={hideAttachProductForm}
          onSuccess={() => {
            hideAttachProductForm();
            tenantProductDetailRefreshEntity();
          }}
          isActivate={attachProductConfig?.isActivate}
          productDetail={tenantProductDetailEntity}
        />
      </Modal>

      <Modal
        show={deactivateUserFormVisibility}
        heading={messages?.tenantManagement?.deactivateUserForm?.heading}
        onClose={hideDeactivateUserForm}
        fitContent
      >
        <DeleteCTAForm
          onCancel={hideDeactivateUserForm}
          onSuccess={() => {
            hideDeactivateUserForm();
            toast(tenantManagementDetailToastComponent());
            refreshEntity();
          }}
          api={`${TENANT_MANAGEMENT_DETAIL}/${tenantDetailEntity?.id}`}
          bodyText={messages?.tenantManagement?.deactivateUserForm?.note}
          cancelButton={messages?.general?.cancel}
          confirmButton={
            messages?.tenantManagement?.deactivateUserForm?.deactivateUser
          }
          apiMethod={HttpMethods.PATCH}
          deleteBody={{
            status: Status.inactive,
          }}
        />
      </Modal>

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
        heading={messages?.tenantManagement?.removeUser?.heading}
        onClose={hideRemoveUserForm}
        fitContent
      >
        <DeleteCTAForm
          onCancel={hideRemoveUserForm}
          onSuccess={() => {
            hideRemoveUserForm();
            toast(tenantManagementDetailDeleteToastComponent());
            applyFilters();
          }}
          api={TENANT_USER}
          bodyText={messages?.tenantManagement?.removeUser?.note}
          cancelButton={messages?.general?.cancel}
          confirmButton={messages?.general?.remove}
          deleteBody={{
            tenantId: tenantDetailEntity?.id,
            userId: removeUserFormConfig?.id,
          }}
        />
      </Modal>

      <Modal
        show={cancelSubscriptionFormVisibility}
        heading={
          messages?.tenantManagement?.tenantListingDetail?.cancelSubscription
            ?.heading
        }
        onClose={hideCancelSubscriptionForm}
        fitContent
      >
        <CancelSubscriptionForm
          onCancel={hideCancelSubscriptionForm}
          onSuccess={() => {
            hideCancelSubscriptionForm();
            tenantProductDetailRefreshEntity();
          }}
          tenantProductDetail={tenantProductDetailEntity}
        />
      </Modal>

      <Modal
        show={renewSubscriptionFormVisibility}
        heading={
          messages?.tenantManagement?.tenantListingDetail?.renewForm?.heading
        }
        onClose={hideRenewSubscriptionForm}
        fitContent
      >
        <RenewSubscriptionForm
          onCancel={hideRenewSubscriptionForm}
          onSuccess={() => {
            hideRenewSubscriptionForm();
            tenantProductDetailRefreshEntity();
          }}
          productId={tenantProductDetailEntity?.product?.id}
          subscriptionId={tenantProductDetailEntity?.id}
        />
      </Modal>
    </Container>
  );
};

export default TenantManagementDetails;
