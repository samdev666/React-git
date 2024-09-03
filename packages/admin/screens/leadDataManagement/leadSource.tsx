import React from 'react';
import {
  Button,
  Card,
  MaterialAutocompleteInput,
  Modal,
  SearchInput,
  Stepper,
  Table,
  Toast,
} from '@wizehub/components';
import { Grid } from '@mui/material';
import {
  MetaData, Option, PaginatedEntity, getDefaultMetaData,
} from '@wizehub/common/models';
import { usePagination, usePopupReducer } from '@wizehub/common/hooks';
import { Status } from '@wizehub/common/models/modules';
import { toast } from 'react-toastify';
import { StyledEditIcon } from '@wizehub/components/table/styles';
import { HttpMethods, capitalizeEntireString } from '@wizehub/common/utils';
import { formatStatus } from '@wizehub/components/table';
import { LeadSourceEntity } from '@wizehub/common/models/genericEntities';
import { Container } from '../../components';
import messages from '../../messages';
import {
  StyledLeadDataManagementHeadingContainer,
  StyledLeadDataManagementLeftHeadingContainer,
} from './styles';
import { LEADSOURCELISTING } from '../../redux/actions';
import { LEAD_SOURCE, LEAD_SOURCE_LISTING_API } from '../../api';
import AddEditForm from './addEditForm';
import DeleteCTAForm from '../tenantManagement/deleteCTAForm';
import { StatusOptions } from '../../utils/constant';
import { StyledDeleteIcon } from '../masterData/styles';
import { StyledHeadingTypography } from '../userManagement/styles';
import { ResponsiveAddIcon } from '../productManagement/productManagement';

interface Props { }

const paginatedLeadSource: PaginatedEntity = {
  key: 'leadSource',
  name: LEADSOURCELISTING,
  api: LEAD_SOURCE_LISTING_API,
};

const getDefaultLeadSourceFilter = (
  status?: string,
): MetaData<LeadSourceEntity> => ({
  ...getDefaultMetaData<LeadSourceEntity>(),
  order: 'name',
  filters: {
    status,
  },
  allowedFilters: [status],
});

const LeadSource: React.FC<Props> = () => {
  const {
    entity: leadSource,
    updateFilters,
    applyFilters,
    connectFilter,
    fetchPage,
    updateLimit,
  } = usePagination<LeadSourceEntity>(
    paginatedLeadSource,
    getDefaultLeadSourceFilter(),
  );

  const {
    visibility: formVisibility,
    showPopup: showForm,
    hidePopup: hideForm,
    metaData: config,
  } = usePopupReducer<LeadSourceEntity>();

  const {
    visibility: deleteFormVisibility,
    showPopup: showDeleteForm,
    hidePopup: hideDeleteForm,
    metaData: deleteConfig,
  } = usePopupReducer<LeadSourceEntity>();

  return (
    <Container noPadding>
      <StyledLeadDataManagementHeadingContainer>
        <StyledLeadDataManagementLeftHeadingContainer>
          <Stepper />
          <StyledHeadingTypography>
            {messages.sidebar.menuItems.secondaryMenu.subMenuItems
              .leadDataManagement.subItems.leadSource.heading}
          </StyledHeadingTypography>
        </StyledLeadDataManagementLeftHeadingContainer>
        <Button
          startIcon={<ResponsiveAddIcon />}
          variant="contained"
          color="primary"
          label={messages.sidebar.menuItems.secondaryMenu.subMenuItems
            .leadDataManagement.subItems.leadSource.buttonText}
          onClick={showForm}
        />
      </StyledLeadDataManagementHeadingContainer>
      <Card
        headerCss={{ display: 'flex' }}
        header={(
          <Grid container margin="0 16px" xs={12}>
            <Grid item xs={3}>
              <SearchInput
                connectFilter={connectFilter}
                label={messages.sidebar.menuItems.secondaryMenu.subMenuItems
                  .leadSource.search}
              />
            </Grid>
            <Grid container item xs={7} justifyContent="end" marginLeft="auto">
              <Grid item xs={3}>
                {connectFilter('status', {
                  label: messages.sidebar.menuItems.secondaryMenu.subMenuItems
                    .leadSource.status,
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
              label: messages.sidebar.menuItems.secondaryMenu.subMenuItems
                .leadSource.table.sno,
            },
            {
              id: 'name',
              label: messages.sidebar.menuItems.secondaryMenu.subMenuItems
                .leadSource.table.name,
            },
            {
              id: 'status',
              label: messages.sidebar.menuItems.secondaryMenu.subMenuItems
                .leadSource.table.status,
              getValue: (row: LeadSourceEntity) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
          ]}
          data={leadSource.records}
          metadata={leadSource.metadata}
          actions={[
            {
              id: 'edit',
              component: <StyledEditIcon />,
              onClick: (editLeadSourceRow: LeadSourceEntity) => showForm({ ...editLeadSourceRow }),
            },
            {
              id: 'delete',
              render(deleteLeadSourceRow: LeadSourceEntity) {
                return <StyledDeleteIcon active={deleteLeadSourceRow?.status === Status.active} />;
              },
              onClick: (deleteLeadSourceRow: LeadSourceEntity) => deleteLeadSourceRow?.status === Status.active && showDeleteForm({
                ...deleteLeadSourceRow,
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
          .leadDataManagement.subItems.leadSource.form[config?.id ? 'editSource' : 'addSource']}
        onClose={hideForm}
        fitContent
      >
        <AddEditForm
          onCancel={hideForm}
          onSuccess={() => {
            hideForm();
            toast(<Toast
              text={
                                  messages.sidebar.menuItems.secondaryMenu.subMenuItems
                                    .leadDataManagement.subItems.leadSource.form.success?.[
                                      config?.id ? 'updated' : 'created'
                                    ]
                              }
            />);
            applyFilters();
          }}
          endpoint={config?.id ? `${LEAD_SOURCE}/${config?.id}` : LEAD_SOURCE}
          isUpdate={!!config?.id}
          leadData={config}
        />
      </Modal>

      <Modal
        show={deleteFormVisibility}
        heading={messages.sidebar.menuItems.secondaryMenu.subMenuItems
          .leadDataManagement.subItems.leadSource.form.deactivateLeadSource}
        onClose={hideDeleteForm}
        fitContent
      >
        <DeleteCTAForm
          onCancel={hideDeleteForm}
          onSuccess={() => {
            hideDeleteForm();
            toast(<Toast
              text={
                                  messages.sidebar.menuItems.secondaryMenu.subMenuItems
                                    .leadDataManagement.subItems.leadSource.form.success?.deleted
                              }
            />);
            applyFilters();
          }}
          api={`${LEAD_SOURCE}/${deleteConfig?.id}`}
          bodyText={messages.sidebar.menuItems.secondaryMenu.subMenuItems
            .leadDataManagement.subItems.leadSource.form.deactivateSourceText}
          cancelButton={messages?.general?.cancel}
          confirmButton={
                        messages.sidebar.menuItems.secondaryMenu.subMenuItems
                          .leadDataManagement.subItems.leadSource.form.deleteButtonText
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

export default LeadSource;
