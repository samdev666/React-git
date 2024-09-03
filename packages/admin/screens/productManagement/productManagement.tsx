import React from 'react';
import {
  Card,
  Table,
  Modal,
  Stepper,
  Button,
  SearchInput,
  MaterialAutocompleteInput,
} from '@wizehub/components';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import { usePagination, usePopupReducer } from '@wizehub/common/hooks';
import {
  MetaData,
  getDefaultMetaData,
  PaginatedEntity,
  Option,
  UserActionConfig,
  UserActionType,
} from '@wizehub/common/models';
import { Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { formatStatus } from '@wizehub/components/table';
import {
  StyledEditIcon,
  StyledResponsiveIcon,
  StyledVisibilityIcon,
} from '@wizehub/components/table/styles';
import { ProductManagementEntity } from '@wizehub/common/models/genericEntities';
import { Status, StatusOptions } from '@wizehub/common/models/modules';
import { capitalizeEntireString } from '@wizehub/common/utils';
import { StyledHeadingTypography } from '../userManagement/styles';
import {
  StyledProductManagementHeadingContainer,
  StyledProductManagementLeftHeadingContainer,
} from './styles';
import ProductManagementForm from './addProductManagement';
import { PRODUCT_MANAGEMENT_LISTING_API } from '../../api';
import { PRODUCTMANAGEMENTLISTING } from '../../redux/actions';
import { routes } from '../../utils';
import messages from '../../messages';
import { Container } from '../../components';

import { ReduxState } from '../../redux/reducers';
import { Right } from '../../redux/reducers/auth';

const paginatedProductManagement: PaginatedEntity = {
  key: 'productManagement',
  name: PRODUCTMANAGEMENTLISTING,
  api: PRODUCT_MANAGEMENT_LISTING_API,
};

export const ResponsiveAddIcon = StyledResponsiveIcon(AddIcon);

const getDefaultProductManagementFilter = (): MetaData<ProductManagementEntity> => ({
  ...getDefaultMetaData<ProductManagementEntity>(),
  order: 'name',
});

const ProductManagement = () => {
  const reduxDispatch = useDispatch();
  const auth = useSelector((state: ReduxState) => state.auth);
  const {
    entity: productManagementData,
    applyFilters,
    connectFilter,
    fetchPage,
    updateLimit,
    updateFilters,
  } = usePagination<ProductManagementEntity>(
    paginatedProductManagement,
    getDefaultProductManagementFilter(),
  );

  const {
    visibility: formVisibility,
    showPopup: showForm,
    hidePopup: hideForm,
    metaData: config,
  } = usePopupReducer<UserActionConfig>();

  const disabledItems = auth.rights.some((item) => item === Right.PRODUCT_MANAGEMENT_READ_ONLY);

  return (
    <Container noPadding>
      <StyledProductManagementHeadingContainer>
        <StyledProductManagementLeftHeadingContainer>
          <Stepper />
          <StyledHeadingTypography>
            {messages.productManagement.heading}
          </StyledHeadingTypography>
        </StyledProductManagementLeftHeadingContainer>
        {
          !disabledItems && (
          <Button
            startIcon={<ResponsiveAddIcon />}
            variant="contained"
            color="primary"
            label={messages.productManagement.buttonText}
            onClick={() => showForm({
              type: UserActionType.CREATE,
            })}
          />
          )
        }
      </StyledProductManagementHeadingContainer>
      <Card
        headerCss={{ display: 'flex' }}
        header={(
          <Grid container margin="0 16px" xs={12}>
            <Grid item xs={3}>
              <SearchInput
                connectFilter={connectFilter}
                label={messages.productManagement.search}
              />
            </Grid>
            <Grid container item xs={7} justifyContent="end" marginLeft="auto">
              <Grid xs={3} item>
                {connectFilter('status', {
                  label: messages?.productManagement?.status,
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
              label: messages?.productManagement?.table?.serialNo,
            },
            {
              id: 'name',
              label: messages?.productManagement?.table?.name,
            },
            {
              id: 'numberOfTenants',
              label:
                messages?.productManagement?.table?.numberOfTenantsAttached,
            },
            {
              id: 'status',
              label: messages?.productManagement?.table?.status,
              getValue: (row: ProductManagementEntity) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
          ]}
          disableSorting={['status', 'sno']}
          updateFilters={(filterParams: any) => {
            updateFilters(filterParams);
            applyFilters();
          }}
          data={productManagementData?.records}
          metadata={productManagementData?.metadata}
          actions={[
            {
              id: 'edit',
              component: !disabledItems && <StyledEditIcon />,
              onClick: (row: ProductManagementEntity) => {
                !disabledItems && showForm({
                  type: UserActionType.EDIT,
                  id: row?.id,
                });
              },
            },
            {
              id: 'view',
              component: <StyledVisibilityIcon />,
              onClick: (row: ProductManagementEntity) => {
                reduxDispatch(
                  push(
                    routes.productmanagement.productDetail.replace(
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
        heading={
          messages?.productManagement?.form?.[
            config?.type === UserActionType.EDIT
              ? 'editProduct'
              : 'addNewProduct'
          ]
        }
        onClose={hideForm}
        fitContent
      >
        <ProductManagementForm
          isUpdate={config?.type === UserActionType.EDIT}
          onCancel={hideForm}
          onSuccess={() => {
            hideForm();
            applyFilters();
          }}
          productManagement={config?.id}
        />
      </Modal>
    </Container>
  );
};

export default ProductManagement;
