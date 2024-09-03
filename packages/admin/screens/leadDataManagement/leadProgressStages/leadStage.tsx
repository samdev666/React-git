import { Grid } from '@mui/material';
import {
  Card,
  MaterialAutocompleteInput,
  Modal,
  SearchInput,
  Table,
  Toast,
} from '@wizehub/components';
import React from 'react';
import {
  MetaData, Option, PaginatedEntity, getDefaultMetaData,
} from '@wizehub/common/models';
import { usePagination, usePopupReducer } from '@wizehub/common/hooks';
import { Id, toast } from 'react-toastify';
import { StyledEditIcon } from '@wizehub/components/table/styles';
import { HttpMethods, capitalizeEntireString } from '@wizehub/common/utils';
import { Status } from '@wizehub/common/models/modules';
import { LeadProgressStatusEntity } from '@wizehub/common/models/genericEntities';
import { formatStatus } from '@wizehub/components/table';
import messages from '../../../messages';
import { LEADSTAGELISTING } from '../../../redux/actions';
import { LEAD_STAGE, LEAD_STAGE_LISTING_API } from '../../../api';
import DeleteCTAForm from '../../tenantManagement/deleteCTAForm';
import { StatusOptions } from '../../../utils/constant';
import ProgressStageForm from './progressStageForm';
import { StyledDeleteIcon } from '../../masterData/styles';

interface Props {
    formVisibility: boolean;
    hideForm: () => void;
}

export const paginatedLeadStage: PaginatedEntity = {
  key: 'leadStage',
  name: LEADSTAGELISTING,
  api: LEAD_STAGE_LISTING_API,
};

export const getDefaultLeadStageFilter = (
  status?: string,
): MetaData<LeadProgressStatusEntity> => ({
  ...getDefaultMetaData<LeadProgressStatusEntity>(),
  order: 'name',
  filters: {
    status,
  },
  allowedFilters: [status],
});

const LeadStage: React.FC<Props> = ({
  formVisibility, hideForm,
}) => {
  const {
    entity: leadStage,
    updateFilters,
    applyFilters,
    connectFilter,
    fetchPage,
    updateLimit,
  } = usePagination<LeadProgressStatusEntity>(
    paginatedLeadStage,
    getDefaultLeadStageFilter(),
  );

  const {
    visibility: editLeadFormVisibility,
    showPopup: showEditLeadForm,
    hidePopup: hideEditLeadForm,
    metaData: editConfig,
  } = usePopupReducer<LeadProgressStatusEntity>();

  const {
    visibility: deleteLeadFormVisibility,
    showPopup: showDeleteLeadForm,
    hidePopup: hideDeleteLeadForm,
    metaData: deleteConfig,
  } = usePopupReducer<{
    id: Id;
    name: string;
  }>();

  return (
    <>
      <Card
        headerCss={{ display: 'flex' }}
        header={(
          <Grid container margin="0 16px" xs={12}>
            <Grid item xs={3}>
              <SearchInput
                connectFilter={connectFilter}
                label={messages.sidebar.menuItems.secondaryMenu.subMenuItems
                  .leadStages.search}
              />
            </Grid>
            <Grid container item xs={7} justifyContent="end" marginLeft="auto">
              <Grid item xs={3}>
                {connectFilter('status', {
                  label: messages.sidebar.menuItems.secondaryMenu.subMenuItems
                    .leadStages.status,
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
                .leadStages.table.sno,
            },
            {
              id: 'name',
              label: messages.sidebar.menuItems.secondaryMenu.subMenuItems
                .leadStages.table.name,
            },
            {
              id: 'status',
              label: messages.sidebar.menuItems.secondaryMenu.subMenuItems
                .leadStages.table.status,
              getValue: (row: LeadProgressStatusEntity) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
          ]}
          data={leadStage.records}
          metadata={leadStage.metadata}
          actions={[
            {
              id: 'edit',
              component: <StyledEditIcon />,
              onClick: (editRow: LeadProgressStatusEntity) => showEditLeadForm({ ...editRow }),
            },
            {
              id: 'delete',
              render(editRow: LeadProgressStatusEntity) {
                return <StyledDeleteIcon active={editRow?.status === Status.active} />;
              },
              onClick: (editRow: LeadProgressStatusEntity) => editRow?.status === Status.active && showDeleteLeadForm({
                ...editRow,
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
        show={editConfig?.id ? editLeadFormVisibility : formVisibility}
        heading={messages.sidebar.menuItems.secondaryMenu.subMenuItems
          .leadDataManagement.subItems.leadProgressStages.form[editConfig?.id
            ? 'editStage' : 'addStage']}
        onClose={() => {
          editConfig?.id
            ? hideEditLeadForm()
            : hideForm();
        }}
        fitContent
      >
        <ProgressStageForm
          onCancel={() => {
            editConfig?.id
              ? hideEditLeadForm()
              : hideForm();
          }}
          onSuccess={() => {
            editConfig?.id ? hideEditLeadForm() : hideForm();
            toast(<Toast
              text={
                    messages.sidebar.menuItems.secondaryMenu.subMenuItems
                      .leadDataManagement.subItems.leadProgressStages.form.success?.[editConfig?.id
                        ? 'stageUpdated' : 'stageCreated']
                    }
            />);
            applyFilters();
          }}
          endpoint={editConfig?.id ? `${LEAD_STAGE}/${editConfig?.id}` : LEAD_STAGE}
          isUpdate={!!editConfig?.id}
          leadData={editConfig}
        />
      </Modal>

      <Modal
        show={deleteLeadFormVisibility}
        heading={messages.sidebar.menuItems.secondaryMenu.subMenuItems
          .leadDataManagement.subItems.leadProgressStages.form.deleteStageButtonText}
        onClose={hideDeleteLeadForm}
        fitContent
      >
        <DeleteCTAForm
          onCancel={hideDeleteLeadForm}
          onSuccess={() => {
            hideDeleteLeadForm();
            toast(<Toast
              text={
                                  messages.sidebar.menuItems.secondaryMenu.subMenuItems
                                    .leadDataManagement.subItems.leadProgressStages.form.success?.stageDeleted
                              }
            />);
            applyFilters();
          }}
          api={`${LEAD_STAGE}/${deleteConfig?.id}`}
          bodyText={messages.sidebar.menuItems.secondaryMenu.subMenuItems
            .leadDataManagement.subItems.leadProgressStages.form.deactivateStageText}
          cancelButton={messages?.general?.cancel}
          confirmButton={
                        messages.sidebar.menuItems.secondaryMenu.subMenuItems
                          .leadDataManagement.subItems.leadProgressStages.form.deleteStageButtonText
                    }
          apiMethod={HttpMethods.PATCH}
          deleteBody={
                        {
                          status: Status.inactive,
                        }
                    }
        />
      </Modal>
    </>
  );
};

export default LeadStage;
