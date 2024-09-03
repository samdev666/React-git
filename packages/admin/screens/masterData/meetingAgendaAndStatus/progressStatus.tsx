import React from 'react';
import { MetaData, PaginatedEntity, getDefaultMetaData } from '@wizehub/common/models';
import { usePagination, usePopupReducer } from '@wizehub/common/hooks';
import {
  Card, Modal, Table, Toast,
} from '@wizehub/components';
import { toast } from 'react-toastify';
import { StyledEditIcon } from '@wizehub/components/table/styles';
import { HttpMethods } from '@wizehub/common/utils';
import { Status } from '@wizehub/common/models/modules';
import { formatStatus } from '@wizehub/components/table';
import { ProgressEntity } from '@wizehub/common/models/genericEntities';
import { MEETINGSTATUSLISTING } from '../../../redux/actions';
import { MEETING_STATUS, MEETING_STATUS_LISTING_API } from '../../../api';
import messages from '../../../messages';
import AddEditForm from '../../leadDataManagement/addEditForm';
import DeleteCTAForm from '../../tenantManagement/deleteCTAForm';
import { StyledDeleteIcon } from '../styles';

interface Props {
    formVisibility: boolean;
    hideForm: () => void;
}

const paginatedMeetingStatus: PaginatedEntity = {
  key: 'meetingStatus',
  name: MEETINGSTATUSLISTING,
  api: MEETING_STATUS_LISTING_API,
};

export const getDefaultMeetingStatusFilter = (): MetaData<ProgressEntity> => ({
  ...getDefaultMetaData<ProgressEntity>(),
  order: 'name',
});

const ProgressStatus: React.FC<Props> = ({
  formVisibility, hideForm,
}) => {
  const {
    entity: meetingStatus,
    fetchPage,
    updateLimit,
    applyFilters,
    updateFilters,
  } = usePagination<ProgressEntity>(
    paginatedMeetingStatus,
    getDefaultMeetingStatusFilter(),
  );

  const {
    visibility: editFormVisibility,
    showPopup: showEditForm,
    hidePopup: hideEditForm,
    metaData: editConfig,
  } = usePopupReducer<ProgressEntity>();

  const {
    visibility: deleteStatusformVisibility,
    showPopup: showDeleteStatusForm,
    hidePopup: hideDeleteStatusForm,
    metaData: deleteConfig,
  } = usePopupReducer<ProgressEntity>();

  return (
    <>
      <Card
        cardCss={{ margin: '0 20px' }}
        noHeaderPadding
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
              id: 'status',
              label: 'Status',
              getValue: (row: ProgressEntity) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
          ]}
          data={meetingStatus.records}
          metadata={meetingStatus.metadata}
          actions={[
            {
              id: 'edit',
              component: <StyledEditIcon />,
              onClick: (row: ProgressEntity) => showEditForm({ ...row }),
            },
            {
              id: 'delete',
              render(row: ProgressEntity) {
                return <StyledDeleteIcon active={row?.status === Status.active} />;
              },
              onClick: (row: ProgressEntity) => row?.status === Status.active && showDeleteStatusForm({
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
        show={editConfig?.id ? editFormVisibility : formVisibility}
        heading={messages.sidebar.menuItems.secondaryMenu.subMenuItems
          .masterData.subItems.meetingAgendaAndStatus.form[
            editConfig?.id ? 'editStatus' : 'addStatus']}
        onClose={() => {
          editConfig?.id
            ? hideEditForm()
            : hideForm();
        }}
        fitContent
      >
        <AddEditForm
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
                                    .masterData.subItems.meetingAgendaAndStatus.form.success?.
                                      [editConfig?.id ? 'statusUpdated' : 'statusCreated']
        }
            />);
            applyFilters();
          }}
          endpoint={editConfig?.id ? `${MEETING_STATUS}/${editConfig?.id}` : MEETING_STATUS}
          isUpdate={!!editConfig?.id}
          leadData={editConfig}
        />
      </Modal>

      <Modal
        show={deleteStatusformVisibility}
        heading={messages.sidebar.menuItems.secondaryMenu.subMenuItems
          .masterData.subItems.meetingAgendaAndStatus.form.deactivateProgressStatus}
        onClose={hideDeleteStatusForm}
        fitContent
      >
        <DeleteCTAForm
          onCancel={hideDeleteStatusForm}
          onSuccess={() => {
            hideDeleteStatusForm();
            toast(<Toast
              text={
                                  messages.sidebar.menuItems.secondaryMenu.subMenuItems
                                    .masterData.subItems.meetingAgendaAndStatus.form.success?.statusDeleted
                              }
            />);
            applyFilters();
          }}
          api={`${MEETING_STATUS}/${deleteConfig?.id}`}
          bodyText={messages.sidebar.menuItems.secondaryMenu.subMenuItems
            .masterData.subItems.meetingAgendaAndStatus.form.deactivateStatusText}
          cancelButton={messages?.general?.cancel}
          confirmButton={
                        messages.sidebar.menuItems.secondaryMenu.subMenuItems
                          .masterData.subItems.meetingAgendaAndStatus.form.deactivateStatus
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

export default ProgressStatus;
