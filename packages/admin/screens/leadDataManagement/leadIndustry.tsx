import React, { useState } from 'react';
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
  Id,
  MetaData, Option, PaginatedEntity, getDefaultMetaData,
} from '@wizehub/common/models';
import { usePagination, usePopupReducer } from '@wizehub/common/hooks';
import { toast } from 'react-toastify';
import { StyledEditIcon } from '@wizehub/components/table/styles';
import { HttpMethods, capitalizeEntireString } from '@wizehub/common/utils';
import { Status } from '@wizehub/common/models/modules';
import { LeadIndustryInterface } from '@wizehub/common/models/genericEntities';
import { formatStatus } from '@wizehub/components/table';
import { Container } from '../../components';
import messages from '../../messages';
import {
  StyledLeadDataManagementHeadingContainer,
  StyledLeadDataManagementLeftHeadingContainer,
} from './styles';
import { LEADINDUSTRYLISTING } from '../../redux/actions';
import { LEAD_INDUSTRY, LEAD_INDUSTRY_LISTING_API } from '../../api';
import AddEditForm from './addEditForm';
import DeleteCTAForm from '../tenantManagement/deleteCTAForm';
import { StatusOptions } from '../../utils/constant';
import { StyledDeleteIcon } from '../masterData/styles';
import { StyledHeadingTypography } from '../userManagement/styles';
import { ResponsiveAddIcon } from '../productManagement/productManagement';

interface Props { }

const paginatedLeadIndustry: PaginatedEntity = {
  key: 'leadIndustry',
  name: LEADINDUSTRYLISTING,
  api: LEAD_INDUSTRY_LISTING_API,
};

const getDefaultLeadIndustryFilter = (
  status?: string,
): MetaData<LeadIndustryInterface> => ({
  ...getDefaultMetaData<LeadIndustryInterface>(),
  order: 'name',
  filters: {
    status,
  },
  allowedFilters: [status],
});

const LeadIndustry: React.FC<Props> = () => {
  const {
    visibility: formVisibility,
    showPopup: showForm,
    hidePopup: hideForm,
    metaData: config,
  } = usePopupReducer<LeadIndustryInterface>();
  const {
    entity: leadIndustry,
    updateFilters,
    applyFilters,
    connectFilter,
    fetchPage,
    updateLimit,
  } = usePagination<LeadIndustryInterface>(
    paginatedLeadIndustry,
    getDefaultLeadIndustryFilter(),
  );

  const {
    visibility: deleteFormVisibility,
    showPopup: showDeleteForm,
    hidePopup: hideDeleteForm,
    metaData: deleteConfig,
  } = usePopupReducer<{
    id: Id;
    name: string;
  }>();

  return (
    <Container noPadding>
      <StyledLeadDataManagementHeadingContainer>
        <StyledLeadDataManagementLeftHeadingContainer>
          <Stepper />
          <StyledHeadingTypography>
            {messages.sidebar.menuItems.secondaryMenu.subMenuItems
              .leadDataManagement.subItems.leadIndustry.heading}
          </StyledHeadingTypography>
        </StyledLeadDataManagementLeftHeadingContainer>
        <Button
          startIcon={<ResponsiveAddIcon />}
          variant="contained"
          color="primary"
          label={messages.sidebar.menuItems.secondaryMenu.subMenuItems
            .leadDataManagement.subItems.leadIndustry.buttonText}
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
                  .leadIndustry.search}
              />
            </Grid>
            <Grid container item xs={7} justifyContent="end" marginLeft="auto">
              <Grid item xs={3}>
                {connectFilter('status', {
                  label: messages.sidebar.menuItems.secondaryMenu.subMenuItems
                    .leadIndustry.status,
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
                .leadIndustry.table.sno,
            },
            {
              id: 'name',
              label: messages.sidebar.menuItems.secondaryMenu.subMenuItems
                .leadIndustry.table.name,
            },
            {
              id: 'status',
              label: messages.sidebar.menuItems.secondaryMenu.subMenuItems
                .leadIndustry.table.status,
              getValue: (row: LeadIndustryInterface) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
          ]}
          data={leadIndustry.records}
          metadata={leadIndustry.metadata}
          actions={[
            {
              id: 'edit',
              component: <StyledEditIcon />,
              onClick: (editLeadIndustryRow: LeadIndustryInterface) => showForm({ ...editLeadIndustryRow }),
            },
            {
              id: 'delete',
              render(deleteLeadIndustryRow: LeadIndustryInterface) {
                return <StyledDeleteIcon active={deleteLeadIndustryRow?.status === Status.active} />;
              },
              onClick: (deleteLeadIndustryRow: LeadIndustryInterface) => deleteLeadIndustryRow?.status === Status.active && showDeleteForm({
                ...deleteLeadIndustryRow,
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
          .leadDataManagement.subItems.leadIndustry.form[config?.id
            ? 'editIndustry' : 'addIndustry']}
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
                        .leadDataManagement.subItems.leadIndustry.form.success?.[
                          config?.id ? 'updated' : 'created'
                        ]
                  }
            />);
            applyFilters();
          }}
          endpoint={config?.id ? `${LEAD_INDUSTRY}/${config?.id}` : LEAD_INDUSTRY}
          isUpdate={!!config?.id}
          leadData={config}
        />
      </Modal>

      <Modal
        show={deleteFormVisibility}
        heading={messages.sidebar.menuItems.secondaryMenu.subMenuItems
          .leadDataManagement.subItems.leadIndustry.form.deactivateLeadIndustry}
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
                          .leadDataManagement.subItems.leadIndustry.form.success?.deleted
                    }
            />);
            applyFilters();
          }}
          api={`${LEAD_INDUSTRY}/${deleteConfig?.id}`}
          bodyText={messages.sidebar.menuItems.secondaryMenu.subMenuItems
            .leadDataManagement.subItems.leadIndustry.form.deactivateIndustryText}
          cancelButton={messages?.general?.cancel}
          confirmButton={
                        messages.sidebar.menuItems.secondaryMenu.subMenuItems
                          .leadDataManagement.subItems.leadIndustry.form.deleteButtonText
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

export default LeadIndustry;
