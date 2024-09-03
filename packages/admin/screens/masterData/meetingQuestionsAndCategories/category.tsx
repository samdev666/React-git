import React from 'react';
import {
  Card, Modal, Table, Toast,
} from '@wizehub/components';
import { MetaData, PaginatedEntity, getDefaultMetaData } from '@wizehub/common/models';
import { usePagination, usePopupReducer } from '@wizehub/common/hooks';
import { toast } from 'react-toastify';
import { StyledEditIcon } from '@wizehub/components/table/styles';
import { HttpMethods } from '@wizehub/common/utils';
import { Status } from '@wizehub/common/models/modules';
import { formatStatus } from '@wizehub/components/table';
import { MeetingCategoryEntity } from '@wizehub/common/models/genericEntities';
import { MEETINGCATEGORYLISTING } from '../../../redux/actions';
import { MEETING_CATEGORY, MEETING_CATEGORY_LISTING_API } from '../../../api';
import messages from '../../../messages';
import AddEditForm from '../../leadDataManagement/addEditForm';
import DeleteCTAForm from '../../tenantManagement/deleteCTAForm';
import { StyledDeleteIcon } from '../styles';

interface Props {
    formVisibility: boolean;
    hideForm: () => void;
}

const paginatedMeetingCategory: PaginatedEntity = {
  key: 'meetingCategory',
  name: MEETINGCATEGORYLISTING,
  api: MEETING_CATEGORY_LISTING_API,
};

export const getDefaultMeetingCategoryFilter = (): MetaData<MeetingCategoryEntity> => ({
  ...getDefaultMetaData<MeetingCategoryEntity>(),
  order: 'name',
});

const Category: React.FC<Props> = ({
  formVisibility, hideForm,
}) => {
  const {
    entity: meetingCategory,
    fetchPage,
    updateLimit,
    applyFilters,
    updateFilters,
  } = usePagination<MeetingCategoryEntity>(
    paginatedMeetingCategory,
    getDefaultMeetingCategoryFilter(),
  );

  const {
    visibility: editFormVisibility,
    showPopup: showEditForm,
    hidePopup: hideEditForm,
    metaData: editConfig,
  } = usePopupReducer<MeetingCategoryEntity>();

  const {
    visibility: deleteCategoryformVisibility,
    showPopup: showDeleteForm,
    hidePopup: hideDeleteCategoryForm,
    metaData: deleteConfig,
  } = usePopupReducer<MeetingCategoryEntity>();

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
              getValue: (row: MeetingCategoryEntity) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
          ]}
          data={meetingCategory.records}
          metadata={meetingCategory.metadata}
          actions={[
            {
              id: 'edit',
              component: <StyledEditIcon />,
              onClick: (row: MeetingCategoryEntity) => showEditForm({ ...row }),
            },
            {
              id: 'delete',
              render(row: MeetingCategoryEntity) {
                return <StyledDeleteIcon active={row?.status === Status.active} />;
              },
              onClick: (row: MeetingCategoryEntity) => row?.status === Status.active && showDeleteForm({
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
          .masterData.subItems.meetingQuestionsAndCategories.form[
            editConfig?.id ? 'editCategory' : 'addCategory']}
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
                                    .masterData.subItems.meetingQuestionsAndCategories.form.success?.
                                      [editConfig?.id ? 'categoryUpdated' : 'categoryCreated']
        }
            />);
            applyFilters();
          }}
          endpoint={editConfig?.id ? `${MEETING_CATEGORY}/${editConfig?.id}` : MEETING_CATEGORY}
          isUpdate={!!editConfig?.id}
          leadData={editConfig}
        />
      </Modal>

      <Modal
        show={deleteCategoryformVisibility}
        heading={messages.sidebar.menuItems.secondaryMenu.subMenuItems
          .masterData.subItems.meetingQuestionsAndCategories.form.deactivateCategory}
        onClose={hideDeleteCategoryForm}
        fitContent
      >
        <DeleteCTAForm
          onCancel={hideDeleteCategoryForm}
          onSuccess={() => {
            hideDeleteCategoryForm();
            toast(<Toast
              text={
                                  messages.sidebar.menuItems.secondaryMenu.subMenuItems
                                    .masterData.subItems.meetingQuestionsAndCategories.form.success?.categoryDeleted
                              }
            />);
            applyFilters();
          }}
          api={`${MEETING_CATEGORY}/${deleteConfig?.id}`}
          bodyText={messages.sidebar.menuItems.secondaryMenu.subMenuItems
            .masterData.subItems.meetingQuestionsAndCategories.form.deactivateCategoryText}
          cancelButton={messages?.general?.cancel}
          confirmButton={
                        messages.sidebar.menuItems.secondaryMenu.subMenuItems
                          .masterData.subItems.meetingQuestionsAndCategories.form.deactivateCategory
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

export default Category;
