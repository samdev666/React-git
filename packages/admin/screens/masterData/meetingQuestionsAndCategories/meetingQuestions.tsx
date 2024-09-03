import React from 'react';
import {
  Id,
  MetaData, Option, PaginatedEntity, getDefaultMetaData,
} from '@wizehub/common/models';
import { useOptions, usePagination } from '@wizehub/common/hooks';
import {
  Card,
  MaterialAutocompleteInput,
  Modal,
  SearchInput,
  Table,
  Toast,
} from '@wizehub/components';
import { Grid } from '@mui/material';
import { push } from 'connected-react-router';
import { StyledVisibilityIcon } from '@wizehub/components/table/styles';
import { useDispatch } from 'react-redux';
import {
  capitalizeEntireString, mapIdNameToOptionWithoutCaptializing,
} from '@wizehub/common/utils';
import { toast } from 'react-toastify';
import { Status, StatusOptions } from '@wizehub/common/models/modules';
import { Division, MeetingCategoryEntity, MeetingQuestionEntity } from '@wizehub/common/models/genericEntities';
import { formatStatus } from '@wizehub/components/table';
import MeetingQuestionForm from './meetingQuestionForm';
import { routes } from '../../../utils';
import messages from '../../../messages';
import {
  DIVISION_LISTING_API,
  MEETING_CATEGORY_LISTING_API,
  MEETING_QUESTION,
  MEETING_QUESTION_LISTING_API,
} from '../../../api';
import { MEETINGQUESTIONLISTING } from '../../../redux/actions';

interface Props {
    formVisibility: boolean;
    hideForm: () => void;
}

const paginatedMeetingQuestion: PaginatedEntity = {
  key: 'meetingQuestion',
  name: MEETINGQUESTIONLISTING,
  api: MEETING_QUESTION_LISTING_API,
};

export const getDefaultMeetingQuestionFilter = (
  division?: string,
  categoryId?: string,
  status?: string,
): MetaData<MeetingQuestionEntity> => ({
  ...getDefaultMetaData<MeetingQuestionEntity>(),
  order: 'question',
  filters: {
    division,
    categoryId,
    status,
  },
  allowedFilters: [division, categoryId, status],
});

const getDefaultMeetingCategoryFilter = (): MetaData<MeetingCategoryEntity> => ({
  ...getDefaultMetaData<MeetingCategoryEntity>(),
  order: 'name',
  filters: {
    status: Status.active,
  },
});

const MeetingQuestions: React.FC<Props> = ({
  formVisibility, hideForm,
}) => {
  const {
    entity: meetingQuestion,
    updateFilters,
    applyFilters,
    connectFilter,
    fetchPage,
    updateLimit,
  } = usePagination<MeetingQuestionEntity>(
    paginatedMeetingQuestion,
    getDefaultMeetingQuestionFilter(),
  );

  const {
    options: meetingCategory,
    searchOptions,
  } = useOptions<MeetingCategoryEntity>(
    `${MEETING_CATEGORY_LISTING_API}`,
    true,
    getDefaultMeetingCategoryFilter(),
  );

  const {
    options: divisionOptions,
    searchOptions: divisionSearchOptions,
  } = useOptions<Division>(
    DIVISION_LISTING_API,
  );

  const reduxDispatch = useDispatch();

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
                  .leadDataManagement.search}
              />
            </Grid>
            <Grid container item xs={7} justifyContent="end" marginLeft="auto">
              <Grid xs={3} item mr={2}>
                {connectFilter('divisionId', {
                  label: messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
                    .subItems.teamPosition.division,
                  enableClearable: true,
                  options: divisionOptions?.map(mapIdNameToOptionWithoutCaptializing),
                  autoApplyFilters: true,
                  searchOptions: divisionSearchOptions,
                  formatValue: (value?: number | string) => divisionOptions
                    ?.map(mapIdNameToOptionWithoutCaptializing)
                    .find((opt) => opt?.id === value),
                  formatFilterValue: (value?: Option) => value?.id,
                })(MaterialAutocompleteInput)}
              </Grid>
              <Grid xs={3} item mr={2}>
                {connectFilter('categoryId', {
                  label: messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
                    .subItems.meetingQuestionsAndCategories.category,
                  enableClearable: true,
                  options: meetingCategory?.map(mapIdNameToOptionWithoutCaptializing),
                  autoApplyFilters: true,
                  searchOptions,
                  formatValue: (value?: number | string) => meetingCategory
                    ?.map(mapIdNameToOptionWithoutCaptializing)
                    .find((opt) => opt?.id === value),
                  formatFilterValue: (value?: Option) => value?.id,
                })(MaterialAutocompleteInput)}
              </Grid>
              <Grid xs={2} item>
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
              id: 'question',
              label: 'Name',
            },
            {
              id: 'category',
              label: 'Category',
              getValue: (row: MeetingQuestionEntity) => row?.category?.name,
            },
            {
              id: 'divisions',
              label: 'Division',
              getValue: (row: MeetingQuestionEntity) => row?.divisions,
              format: (row: Array<{id: Id; name: string}>) => row?.map((item) => `${item.name}`).join(', '),
            },
            {
              id: 'status',
              label: 'Status',
              getValue: (row: MeetingQuestionEntity) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
          ]}
          data={meetingQuestion.records}
          metadata={meetingQuestion.metadata}
          actions={[
            {
              id: 'view',
              component: <StyledVisibilityIcon />,
              onClick: (row: MeetingQuestionEntity) => {
                reduxDispatch(
                  push(routes.masterData.meetingQuestionDetails.replace(':id', row?.id?.toString())),
                );
              },
            },
          ]}
          fetchPage={fetchPage}
          updateLimit={updateLimit}
          disableSorting={[
            'sno',
            'category',
            'divisions',
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
          .masterData.subItems.meetingQuestionsAndCategories.form.addQuestion}
        onClose={hideForm}
        fitContent
      >
        <MeetingQuestionForm
          onCancel={hideForm}
          onSuccess={() => {
            hideForm();
            toast(<Toast
              text={
                      messages.sidebar.menuItems.secondaryMenu.subMenuItems
                        .masterData.subItems.meetingQuestionsAndCategories
                        .form.success?.questionCreated
                    }
            />);
            applyFilters();
          }}
          endpoint={MEETING_QUESTION}
        />
      </Modal>
    </>
  );
};

export default MeetingQuestions;
