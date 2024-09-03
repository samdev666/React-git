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
  UserActionType,
  getDefaultMetaData,
} from "@wizehub/common/models";
import { formatStatus } from "@wizehub/components/table";
import {
  Division,
  MeetingCategoryEntity,
  MeetingQuestionEntity,
  MeetingQuestionFormEntity,
} from "@wizehub/common/models/genericEntities";
import { useOptions, usePagination } from "@wizehub/common/hooks";
import { MEETING_QUESTION_ACTION } from "../../../redux/actions";
import {
  DIVISION_LISTING_API,
  MEETING_CATEGORY_LISTING_API,
  MEETING_QUESTION_BY_ID,
  MEETING_QUESTION_LISTING_API,
} from "../../../api";
import { StyledVisibilityIcon } from "@wizehub/components/table/styles";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { routes } from "../../../utils";
import QuestionForm from "./questionForm";
import { toast } from "react-toastify";
import { ReduxState } from "../../../redux/reducers";
import { useSelector } from "react-redux";

interface Props {
  showAddMeetingQuestionForm: (
    metaData?: Partial<MeetingQuestionFormEntity>
  ) => void;
  addMeetingQuestionformVisibility: boolean;
  hideAddMeetingQuestionForm: () => void;
  addConfig: MeetingQuestionFormEntity;
}

const paginatedMeetingQuestion: PaginatedEntity = {
  key: "meetingQuestion",
  name: MEETING_QUESTION_ACTION,
  api: MEETING_QUESTION_LISTING_API,
};

const getDefaultMeetingCategoryFilter =
  (): MetaData<MeetingCategoryEntity> => ({
    ...getDefaultMetaData<MeetingCategoryEntity>(),
    order: "name",
    filters: {
      status: Status.active,
    },
  });

const getDefaultMeetingQuestionFilter =
  (): MetaData<MeetingQuestionEntity> => ({
    ...getDefaultMetaData<MeetingQuestionEntity>(),
    order: "question",
  });

const Questions: React.FC<Props> = ({
  addMeetingQuestionformVisibility,
  hideAddMeetingQuestionForm,
  addConfig,
}) => {
  const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
  const reduxDispatch = useDispatch();
  const {
    entity: meetingQuestionEntity,
    updateFilters,
    applyFilters,
    connectFilter,
    fetchPage,
    updateLimit,
  } = usePagination<MeetingQuestionEntity>(
    {
      ...paginatedMeetingQuestion,
      api: MEETING_QUESTION_LISTING_API.replace(":id", tenantId),
    },
    getDefaultMeetingQuestionFilter()
  );

  const { options: meetingCategory, searchOptions } =
    useOptions<MeetingCategoryEntity>(
      `${MEETING_CATEGORY_LISTING_API.replace(":id", tenantId)}`,
      true,
      getDefaultMeetingCategoryFilter()
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
                      ?.questions?.division,
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
                {connectFilter("categoryId", {
                  label:
                    messages?.settings?.systemPreferences?.meetingMasterSetup
                      ?.questions?.category,
                  enableClearable: true,
                  options: meetingCategory?.map(
                    mapIdNameToOptionWithoutCaptializing
                  ),
                  autoApplyFilters: true,
                  searchOptions,
                  formatValue: (value?: number | string) =>
                    meetingCategory
                      ?.map(mapIdNameToOptionWithoutCaptializing)
                      .find((opt) => opt?.id === value),
                  formatFilterValue: (value?: Option) => value?.id,
                })(MaterialAutocompleteInput)}
              </Grid>
              <Grid item xs={3}>
                {connectFilter("status", {
                  label:
                    messages?.settings?.systemPreferences?.meetingMasterSetup
                      ?.questions?.status,
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
              id: "question",
              label:
                messages?.settings?.systemPreferences?.meetingMasterSetup
                  ?.questions?.table?.name,
            },
            {
              id: "category",
              label:
                messages?.settings?.systemPreferences?.meetingMasterSetup
                  ?.questions?.table?.category,
              getValue: (row: MeetingQuestionEntity) => row?.category,
              format: (row) => row?.name,
            },
            {
              id: "divisions",
              label:
                messages?.settings?.systemPreferences?.meetingMasterSetup
                  ?.questions?.table?.division,

              getValue: (row: MeetingQuestionEntity) => row?.divisions,
              format: (row: Array<{ id: Id; name: string }>) =>
                row?.map((item) => `${item.name}`).join(", "),
            },
            {
              id: "status",
              label:
                messages?.settings?.systemPreferences?.meetingMasterSetup
                  ?.questions?.table?.status,
              getValue: (row: MeetingQuestionEntity) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
          ]}
          data={meetingQuestionEntity?.records}
          metadata={meetingQuestionEntity?.metadata}
          disableSorting={["sno", "category", "divisions", "status"]}
          updateFilters={(filterParams: any) => {
            updateFilters(filterParams);
            applyFilters();
          }}
          actions={[
            {
              id: "view",
              component: <StyledVisibilityIcon />,
              onClick: (row: MeetingQuestionEntity) => {
                reduxDispatch(
                  push(
                    routes.meetingMasterSetup.meetingQuestionDetail.replace(
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
        show={addMeetingQuestionformVisibility}
        heading={
          messages?.settings?.systemPreferences?.meetingMasterSetup?.questions
            ?.form.addHeading
        }
        onClose={hideAddMeetingQuestionForm}
        fitContent
      >
        <QuestionForm
          onCancel={hideAddMeetingQuestionForm}
          onSuccess={() => {
            hideAddMeetingQuestionForm();
            toast(
              <Toast
                text={
                  messages?.settings?.systemPreferences?.meetingMasterSetup
                    ?.questions?.form?.success?.created
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

export default Questions;
