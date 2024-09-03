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
  Id,
  MetaData, Option, PaginatedEntity, getDefaultMetaData,
} from '@wizehub/common/models';
import { usePagination, usePopupReducer } from '@wizehub/common/hooks';
import { toast } from 'react-toastify';
import { StyledEditIcon } from '@wizehub/components/table/styles';
import { HttpMethods, capitalizeEntireString } from '@wizehub/common/utils';
import { Status } from '@wizehub/common/models/modules';
import { LeadProgressStatusEntity } from '@wizehub/common/models/genericEntities';
import { formatStatus } from '@wizehub/components/table';
import messages from '../../../messages';
import { STAGESTATUSLISTING } from '../../../redux/actions';
import { STAGE_STATUS, STAGE_STATUS_LISTING_API } from '../../../api';
import DeleteCTAForm from '../../tenantManagement/deleteCTAForm';
import ProgressStageForm from './progressStageForm';
import { StyledDeleteIcon } from '../../masterData/styles';
import { StatusOptions } from '../../../utils/constant';

interface Props {
    formVisibility: boolean;
    hideForm: () => void;
}

const paginatedStageStatus: PaginatedEntity = {
  key: 'stageStatus',
  name: STAGESTATUSLISTING,
  api: STAGE_STATUS_LISTING_API,
};

const getDefaultStageStatusFilter = (
  status?: string,
): MetaData<LeadProgressStatusEntity> => ({
  ...getDefaultMetaData<LeadProgressStatusEntity>(),
  order: 'name',
  filters: {
    status,
  },
  allowedFilters: [status],
});

const StageStatus: React.FC<Props> = ({
  formVisibility, hideForm,
}) => {
  const {
    entity: stageStatus,
    updateFilters,
    applyFilters,
    connectFilter,
    fetchPage,
    updateLimit,
  } = usePagination<LeadProgressStatusEntity>(
    paginatedStageStatus,
    getDefaultStageStatusFilter(),
  );

  const {
    visibility: editFormVisibility,
    showPopup: showEditForm,
    hidePopup: hideEditForm,
    metaData: editConfig,
  } = usePopupReducer<LeadProgressStatusEntity>();

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
    <>
      <Card
        headerCss={{ display: 'flex' }}
        header={(
          <Grid container margin="0 16px" xs={12}>
            <Grid item xs={3}>
              <SearchInput
                connectFilter={connectFilter}
                label={messages.sidebar.menuItems.secondaryMenu.subMenuItems
                  .stageStatus.search}
              />
            </Grid>
            <Grid container item xs={7} justifyContent="end" marginLeft="auto">
              <Grid item xs={3}>
                {connectFilter('status', {
                  label: messages.sidebar.menuItems.secondaryMenu.subMenuItems
                    .stageStatus.status,
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
              label: 'Name',
            },
            {
              id: 'leadProgressStage',
              label: 'Stage',
              getValue: (row: LeadProgressStatusEntity) => row?.leadProgressStage,
              format: (row: LeadProgressStatusEntity) => row?.name,
            },
            {
              id: 'status',
              label: 'Status',
              getValue: (row: LeadProgressStatusEntity) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
          ]}
          data={stageStatus.records}
          metadata={stageStatus.metadata}
          actions={[
            {
              id: 'edit',
              component: <StyledEditIcon />,
              onClick: (editRow: LeadProgressStatusEntity) => showEditForm({ ...editRow }),
            },
            {
              id: 'delete',
              render(deleteRow: LeadProgressStatusEntity) {
                return <StyledDeleteIcon active={deleteRow?.status === Status.active} />;
              },
              onClick: (deleteRow: LeadProgressStatusEntity) => deleteRow?.status === Status.active && showDeleteForm({
                ...deleteRow,
              }),
            },
          ]}
          fetchPage={fetchPage}
          updateLimit={updateLimit}
          disableSorting={[
            'sno',
            'leadProgressStageId',
            'status',
          ]}
          updateFilters={(filterParams: any) => {
            updateFilters(filterParams);
            applyFilters();
          }}
        />
      </Card>

      <Modal
        show={editConfig?.id ? editFormVisibility : formVisibility}
        heading={messages.sidebar.menuItems.secondaryMenu.subMenuItems
          .stageStatus.subItems.stageStatusBlock.form[editConfig?.id
            ? 'editStatus' : 'addStatus']}
        onClose={() => {
          editConfig?.id
            ? hideEditForm()
            : hideForm();
        }}
        fitContent
      >
        <ProgressStageForm
          onCancel={() => {
            editConfig?.id
              ? hideEditForm()
              : hideForm();
          }}
          onSuccess={() => {
            editConfig?.id
              ? hideEditForm()
              : hideForm();
            toast(<Toast
              text={
                                  messages.sidebar.menuItems.secondaryMenu.subMenuItems
                                    .leadDataManagement.subItems.leadProgressStages.form.success?.[editConfig?.id
                                      ? 'statusUpdated' : 'statusCreated']
        }
            />);
            applyFilters();
          }}
          endpoint={editConfig?.id ? `${STAGE_STATUS}/${editConfig?.id}` : STAGE_STATUS}
          isUpdate={!!editConfig?.id}
          leadData={editConfig}
          isStage
        />
      </Modal>

      <Modal
        show={deleteFormVisibility}
        heading={messages.sidebar.menuItems.secondaryMenu.subMenuItems
          .leadDataManagement.subItems.leadProgressStages.form.deleteStatusButtonText}
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
                                    .leadDataManagement.subItems.leadProgressStages.form.success?.statusDeleted
                              }
            />);
            applyFilters();
          }}
          api={`${STAGE_STATUS}/${deleteConfig?.id}`}
          bodyText={messages.sidebar.menuItems.secondaryMenu.subMenuItems
            .leadDataManagement.subItems.leadProgressStages.form.deactivateStatusText}
          cancelButton={messages?.general?.cancel}
          confirmButton={
                        messages.sidebar.menuItems.secondaryMenu.subMenuItems
                          .leadDataManagement.subItems.leadProgressStages.form.deleteStatusButtonText
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

export default StageStatus;
