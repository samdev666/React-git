import React, { useState } from 'react';
import {
  Button,
  Card,
  MaterialAutocompleteInput,
  Modal,
  SearchInput,
  Stepper,
  Toast,
} from '@wizehub/components';
import {
  MetaData, Option, PaginatedEntity, getDefaultMetaData,
} from '@wizehub/common/models';
import { usePagination, usePopupReducer } from '@wizehub/common/hooks';
import { Grid } from '@mui/material';
import Table, { formatStatus } from '@wizehub/components/table';
import { toast } from 'react-toastify';
import { StyledEditIcon } from '@wizehub/components/table/styles';
import { HttpMethods, capitalizeEntireString } from '@wizehub/common/utils';
import { Status } from '@wizehub/common/models/modules';
import { FeeLostReasonEntity } from '@wizehub/common/models/genericEntities';
import { Container } from '../../../components';
import {
  StyledDeleteIcon,
  StyledMasterDataHeadingContainer,
  StyledMasterDataLeftHeadingContainer,
} from '../styles';
import messages from '../../../messages';
import { FEELOSTREASONLISTING } from '../../../redux/actions';
import { FEE_LOST_REASON, FEE_LOST_REASON_LISTING_API } from '../../../api';
import AddFeeLostReason from './addFeeLostReasonForm';
import DeleteCTAForm from '../../tenantManagement/deleteCTAForm';
import { StatusOptions } from '../../../utils/constant';
import { StyledHeadingTypography } from '../../userManagement/styles';
import { ResponsiveAddIcon } from '../../productManagement/productManagement';

interface Props { }

const paginatedFeeLostReason: PaginatedEntity = {
  key: 'feeLostReason',
  name: FEELOSTREASONLISTING,
  api: FEE_LOST_REASON_LISTING_API,
};

const getDefaultReasonFilter = (): MetaData<FeeLostReasonEntity> => ({
  ...getDefaultMetaData<FeeLostReasonEntity>(),
  order: 'name',
});

const FeeLostReason: React.FC<Props> = () => {
  const [status, setStatus] = useState<Option>(null);
  const {
    entity: feeLostReason,
    updateFilters,
    applyFilters,
    connectFilter,
    fetchPage,
    updateLimit,
  } = usePagination<FeeLostReasonEntity>(
    paginatedFeeLostReason,
    getDefaultReasonFilter(),
  );

  const {
    visibility: formVisibility,
    showPopup: showForm,
    hidePopup: hideForm,
    metaData: config,
  } = usePopupReducer<FeeLostReasonEntity>();

  const {
    visibility: deleteReasonformVisibility,
    showPopup: showDeleteReasonForm,
    hidePopup: hideDeleteReasonForm,
    metaData: deleteConfig,
  } = usePopupReducer<FeeLostReasonEntity>();

  return (
    <Container noPadding>
      <StyledMasterDataHeadingContainer>
        <StyledMasterDataLeftHeadingContainer>
          <Stepper />
          <StyledHeadingTypography>
            {messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
              .subItems.feeLostReason.heading}
          </StyledHeadingTypography>
        </StyledMasterDataLeftHeadingContainer>
        <Button
          startIcon={<ResponsiveAddIcon />}
          variant="contained"
          color="primary"
          label={messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
            .subItems.feeLostReason.reasonButtonText}
          onClick={showForm}
        />
      </StyledMasterDataHeadingContainer>

      <Card
        headerCss={{ display: 'flex' }}
        header={(
          <Grid container margin="0 16px" xs={12}>
            <Grid item xs={3}>
              <SearchInput
                connectFilter={connectFilter}
                label={messages.sidebar.menuItems.secondaryMenu.subMenuItems
                  .leadDataManagement.search}
              />
            </Grid>
            <Grid container item xs={7} justifyContent="end" marginLeft="auto">
              <Grid xs={3} item>
                {connectFilter('status', {
                  label: messages?.userManagement?.status,
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
              label: 'S.No',
            },
            {
              id: 'name',
              label: 'Title',
            },
            {
              id: 'status',
              label: 'Status',
              getValue: (row: FeeLostReasonEntity) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
          ]}
          data={feeLostReason.records}
          metadata={feeLostReason.metadata}
          actions={[
            {
              id: 'edit',
              component: <StyledEditIcon />,
              onClick: (row: FeeLostReasonEntity) => showForm({ ...row }),
            },
            {
              id: 'delete',
              render(row: FeeLostReasonEntity) {
                return <StyledDeleteIcon active={row?.status === Status.active} />;
              },
              onClick: (row: FeeLostReasonEntity) => row?.status === Status.active && showDeleteReasonForm({
                ...row,
              }),

            },
          ]}
          fetchPage={fetchPage}
          updateLimit={updateLimit}
          disableSorting={[
            'sno',
            'status',
          ]}
          updateFilters={(filterParams: any) => {
            updateFilters(filterParams);
            applyFilters();
          }}
        />
      </Card>

      <Modal
        show={formVisibility}
        heading={messages.sidebar.menuItems.secondaryMenu.subMenuItems
          .masterData.subItems.feeLostReason.form[config?.id ? 'editReason' : 'addReason']}
        onClose={hideForm}
        fitContent
      >
        <AddFeeLostReason
          onCancel={hideForm}
          onSuccess={() => {
            hideForm();
            toast(<Toast
              text={
                                  messages.sidebar.menuItems.secondaryMenu.subMenuItems
                                    .masterData.subItems.feeLostReason.form.success?.[
                                      config?.id ? 'updated' : 'created'
                                    ]
                              }
            />);
            applyFilters();
          }}
          endpoint={config?.id ? `${FEE_LOST_REASON}/${config?.id}` : FEE_LOST_REASON}
          isUpdate={!!config?.id}
          reasonData={config}
        />
      </Modal>

      <Modal
        show={deleteReasonformVisibility}
        heading={messages.sidebar.menuItems.secondaryMenu.subMenuItems
          .masterData.subItems.feeLostReason.form.deactivateReason}
        onClose={hideDeleteReasonForm}
        fitContent
      >
        <DeleteCTAForm
          onCancel={hideDeleteReasonForm}
          onSuccess={() => {
            hideDeleteReasonForm();
            toast(<Toast
              text={
                                  messages.sidebar.menuItems.secondaryMenu.subMenuItems
                                    .masterData.subItems.feeLostReason.form.success?.deleted
                              }
            />);
            applyFilters();
          }}
          api={`${FEE_LOST_REASON}/${deleteConfig?.id}`}
          bodyText={messages.sidebar.menuItems.secondaryMenu.subMenuItems
            .masterData.subItems.feeLostReason.form.deactivateReasonText}
          cancelButton={messages?.general?.cancel}
          confirmButton={
                        messages.sidebar.menuItems.secondaryMenu.subMenuItems
                          .masterData.subItems.feeLostReason.form.deactivateReason
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

export default FeeLostReason;
