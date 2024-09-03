import React from 'react';
import {
  MetaData, Option, PaginatedEntity, getDefaultMetaData,
} from '@wizehub/common/models';
import { useOptions, usePagination } from '@wizehub/common/hooks';
import { useDispatch } from 'react-redux';
import { capitalizeEntireString, mapIdNameToOptionWithoutCaptializing } from '@wizehub/common/utils';
import { push } from 'connected-react-router';
import { StyledVisibilityIcon } from '@wizehub/components/table/styles';
import {
  Card, MaterialAutocompleteInput, Modal, SearchInput, Table, Toast,
} from '@wizehub/components';
import { Grid } from '@mui/material';
import { toast } from 'react-toastify';
import { Division, MeetingAgendaEntity } from '@wizehub/common/models/genericEntities';
import { formatStatus } from '@wizehub/components/table';
import { Status } from '@wizehub/common/models/modules';
import { routes } from '../../../utils';
import messages from '../../../messages';
import AgendaForm from './agendaForm';
import { DIVISION_LISTING_API, MEETING_AGENDA, MEETING_AGENDA_LISTING_API } from '../../../api';
import { MEETINGAGENDALISTING } from '../../../redux/actions';
import { StatusOptions } from '../../../utils/constant';

interface Props {
    formVisibility: boolean;
    hideForm: () => void;
}

const paginatedMeetingAgenda: PaginatedEntity = {
  key: 'meetingAgenda',
  name: MEETINGAGENDALISTING,
  api: MEETING_AGENDA_LISTING_API,
};

export const getDefaultMeetingAgendaFilter = (): MetaData<MeetingAgendaEntity> => ({
  ...getDefaultMetaData<MeetingAgendaEntity>(),
  order: 'title',
});

const MeetingAgenda: React.FC<Props> = ({
  formVisibility, hideForm,
}) => {
  const {
    entity: meetingAgenda,
    updateFilters,
    applyFilters,
    connectFilter,
    fetchPage,
    updateLimit,
  } = usePagination<MeetingAgendaEntity>(
    paginatedMeetingAgenda,
    getDefaultMeetingAgendaFilter(),
  );

  const { options: divisionOptions, searchOptions: searchDivisionOptions } = useOptions<Division>(DIVISION_LISTING_API);

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
              <Grid xs={3} item marginRight="16px">
                {connectFilter('divisionId', {
                  label: messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
                    .subItems.teamPosition.division,
                  enableClearable: true,
                  options: divisionOptions?.map(mapIdNameToOptionWithoutCaptializing),
                  autoApplyFilters: true,
                  formatValue: (value?: number | string) => divisionOptions?.map(mapIdNameToOptionWithoutCaptializing)?.find((opt) => opt?.id === value),
                  formatFilterValue: (value?: Option) => capitalizeEntireString(value?.id),
                  searchOptions: searchDivisionOptions,
                })(MaterialAutocompleteInput)}
              </Grid>
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
              id: 'title',
              label: 'Name',
            },
            {
              id: 'project',
              label: 'Project',
              getValue: (row: MeetingAgendaEntity) => row?.project,
              format: (project: MeetingAgendaEntity) => project?.title || '-',
            },
            {
              id: 'divisionIds',
              label: 'Division',
              getValue: (row: MeetingAgendaEntity) => row?.divisions?.map((item) => `${item.divisionName}`).join(', '),
            },
            {
              id: 'status',
              label: 'Status',
              getValue: (row: MeetingAgendaEntity) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
          ]}
          data={meetingAgenda.records}
          metadata={meetingAgenda.metadata}
          actions={[
            {
              id: 'view',
              component: <StyledVisibilityIcon />,
              onClick: (row: MeetingAgendaEntity) => {
                reduxDispatch(
                  push(routes.masterData.meetingAgendaDetails.replace(':id', row?.id?.toString())),
                );
              },
            },
          ]}
          fetchPage={fetchPage}
          updateLimit={updateLimit}
          disableSorting={[
            'sno',
            'divisionIds',
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
          .masterData.subItems.meetingAgendaAndStatus.form.addAgenda}
        onClose={hideForm}
        fitContent
      >
        <AgendaForm
          onCancel={hideForm}
          onSuccess={() => {
            hideForm();
            toast(<Toast
              text={
                                  messages.sidebar.menuItems.secondaryMenu.subMenuItems
                                    .masterData.subItems.meetingAgendaAndStatus.form.success?.agendaCreated
                              }
            />);
            applyFilters();
          }}
          endpoint={MEETING_AGENDA}
        />
      </Modal>
    </>
  );
};

export default MeetingAgenda;
