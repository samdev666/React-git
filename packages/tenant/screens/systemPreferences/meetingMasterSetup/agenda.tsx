import { Grid } from "@mui/material";
import {
  Card,
  MaterialAutocompleteInput,
  Modal,
  SearchInput,
  Table,
  Toast,
} from "@wizehub/components";
import React from "react";
import messages from "../../../messages";
import { Status, StatusOptions } from "@wizehub/common/models/modules";
import {
  capitalizeEntireString,
  mapIdNameToOptionWithoutCaptializing,
} from "@wizehub/common/utils";
import {
  Id,
  MetaData,
  Option,
  PaginatedEntity,
  getDefaultMetaData,
} from "@wizehub/common/models";
import { formatStatus } from "@wizehub/components/table";
import {
  Division,
  MeetingAgendaEntity,
  MeetingAgendaFormEntity,
  MeetingCategoryEntity,
} from "@wizehub/common/models/genericEntities";
import { useOptions, usePagination } from "@wizehub/common/hooks";
import { MEETING_AGENDA_ACTION } from "../../../redux/actions";
import { DIVISION_LISTING_API, MEETING_AGENDA_LISTING_API } from "../../../api";
import { StyledVisibilityIcon } from "@wizehub/components/table/styles";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { routes } from "../../../utils";
import AgendaForm from "./agendaForm";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";

interface Props {
  showAddMeetingAgendaStatusForm: (
    metaData?: Partial<MeetingAgendaFormEntity>
  ) => void;
  addMeetingAgendaformVisibility: boolean;
  hideAddMeetingAgendaStatusForm: () => void;
  addMeetingAgendaConfig: MeetingAgendaFormEntity;
}

const paginatedMeetingAgenda: PaginatedEntity = {
  key: "meetingAgenda",
  name: MEETING_AGENDA_ACTION,
  api: MEETING_AGENDA_LISTING_API,
};

const getDefaultMeetingAgendaFilter = (): MetaData<MeetingAgendaEntity> => ({
  ...getDefaultMetaData<MeetingAgendaEntity>(),
  order: "title",
});

const Agenda: React.FC<Props> = ({
  addMeetingAgendaformVisibility,
  hideAddMeetingAgendaStatusForm,
}) => {
  const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
  const reduxDispatch = useDispatch();
  const {
    entity: meetingAgendaEntity,
    updateFilters,
    applyFilters,
    connectFilter,
    fetchPage,
    updateLimit,
  } = usePagination<MeetingAgendaEntity>(
    {
      ...paginatedMeetingAgenda,
      api: MEETING_AGENDA_LISTING_API.replace(":id", tenantId),
    },
    getDefaultMeetingAgendaFilter()
  );

  const { options: divisionOptions, searchOptions: divisionSearchOptions } =
    useOptions<Division>(DIVISION_LISTING_API);
  return (
    <>
      <Card
        headerCss={{ display: "flex" }}
        header={
          <Grid container xs={12} margin="0 16px">
            <Grid item xs={3}>
              <SearchInput
                connectFilter={connectFilter}
                label={
                  messages?.settings?.systemPreferences?.meetingMasterSetup
                    ?.questions?.search
                }
              />
            </Grid>
            <Grid
              container
              item
              xs={7}
              marginLeft="auto"
              justifyContent="end"
              gap="16px"
            >
              <Grid item xs={3}>
                {connectFilter("divisionId", {
                  label:
                    messages?.settings?.systemPreferences?.meetingMasterSetup
                      ?.agenda?.division,
                  enableClearable: true,
                  options: divisionOptions?.map(
                    mapIdNameToOptionWithoutCaptializing
                  ),
                  autoApplyFilters: true,
                  searchOptions: divisionSearchOptions,
                  formatValue: (value?: number | string) =>
                    divisionOptions
                      ?.map(mapIdNameToOptionWithoutCaptializing)
                      .find((opt) => opt?.id === value),
                  formatFilterValue: (value?: Option) => value?.id,
                })(MaterialAutocompleteInput)}
              </Grid>
              <Grid item xs={3}>
                {connectFilter("status", {
                  label:
                    messages?.settings?.systemPreferences?.meetingMasterSetup
                      ?.agenda?.status,
                  enableClearable: true,
                  options: StatusOptions,
                  autoApplyFilters: true,
                  formatValue: (value?: number | string) =>
                    StatusOptions?.find((opt) => opt?.id === value),
                  formatFilterValue: (value?: Option) =>
                    capitalizeEntireString(value?.id),
                })(MaterialAutocompleteInput)}
              </Grid>
            </Grid>
          </Grid>
        }
        cardCss={{ margin: "0 20px", overflow: "visible !important" }}
      >
        <Table
          specs={[
            {
              id: "title",
              label:
                messages?.settings?.systemPreferences?.meetingMasterSetup
                  ?.agenda?.table?.name,
            },
            {
              id: "project",
              label:
                messages?.settings?.systemPreferences?.meetingMasterSetup
                  ?.agenda?.table?.project,
              getValue: (row: MeetingAgendaEntity) => row?.project,
              format: (row) => (row?.title ? row.title : "-"),
            },
            {
              id: "divisions",
              label:
                messages?.settings?.systemPreferences?.meetingMasterSetup
                  ?.agenda?.table?.division,
              getValue: (row: MeetingAgendaEntity) => row?.divisions,
              format: (row: Array<{ id: Id; divisionName: string }>) =>
                row?.map((item) => `${item.divisionName}`).join(", "),
            },
            {
              id: "status",
              label:
                messages?.settings?.systemPreferences?.meetingMasterSetup
                  ?.agenda?.table?.status,
              getValue: (row: MeetingAgendaEntity) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
          ]}
          data={meetingAgendaEntity?.records}
          metadata={meetingAgendaEntity?.metadata}
          disableSorting={["sno", "category", "divisions", "status"]}
          updateFilters={(filterParams: any) => {
            updateFilters(filterParams);
            applyFilters();
          }}
          actions={[
            {
              id: "view",
              component: <StyledVisibilityIcon />,
              onClick: (row: MeetingAgendaEntity) => {
                reduxDispatch(
                  push(
                    routes.meetingMasterSetup.meetingAgendaDetail.replace(
                      ":id",
                      row?.id?.toString()
                    )
                  )
                );
              },
            },
          ]}
          fetchPage={fetchPage}
          updateLimit={updateLimit}
        />
      </Card>
      <Modal
        show={addMeetingAgendaformVisibility}
        heading={
          messages?.settings?.systemPreferences?.meetingMasterSetup?.agenda
            ?.form?.addHeading
        }
        onClose={hideAddMeetingAgendaStatusForm}
        fitContent
      >
        <AgendaForm
          onCancel={hideAddMeetingAgendaStatusForm}
          onSuccess={() => {
            hideAddMeetingAgendaStatusForm();
            toast(
              <Toast
                text={
                  messages?.settings?.systemPreferences?.meetingMasterSetup
                    ?.agenda?.form?.success?.created
                }
              />
            );
            applyFilters();
          }}
        />
      </Modal>
    </>
  );
};

export default Agenda;
