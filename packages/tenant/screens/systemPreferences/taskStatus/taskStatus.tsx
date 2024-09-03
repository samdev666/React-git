import React from "react";
import { Button, Card, Modal, Stepper, Toast } from "@wizehub/components";
import {
  MetaData,
  PaginatedEntity,
  getDefaultMetaData,
} from "@wizehub/common/models";
import { usePagination, usePopupReducer } from "@wizehub/common/hooks";
import Table, { formatStatus } from "@wizehub/components/table";
import { toast } from "react-toastify";
import {
  StyledDeleteIcon,
  StyledEditIcon,
} from "@wizehub/components/table/styles";
import { HttpMethods } from "@wizehub/common/utils";
import { Status } from "@wizehub/common/models/modules";
import {
  FeeLostReasonEntity,
  TaskStatusEntity,
} from "@wizehub/common/models/genericEntities";
import { Container } from "../../../components";
import messages from "../../../messages";
import TaskStatusForm from "./taskStatusForm";
import { TASK_STATUS_BY_ID, TASK_STATUS_LISTING_API } from "../../../api";
import { TASK_STATUS_ACTION } from "../../../redux/actions";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import {
  StyledFeeLostReasonHeadingContainer,
  StyledFeeLostReasonLeftHeadingContainer,
} from "../feeLostReasonSetup/styles";
import { StyledHeadingTypography } from "../launchPadSetup/styles";
import { ResponsiveAddIcon } from "../launchPadSetup/launchPadSetup";
import DeleteCTAForm from "../launchPadSetup/deleteCTAForm";
import { Right } from "../../../redux/reducers/auth";

interface Props {}

const paginatedTaskStatus: PaginatedEntity = {
  key: "taskStatus",
  name: TASK_STATUS_ACTION,
  api: TASK_STATUS_LISTING_API,
};

const getDefaultTaskStatusFilter = (): MetaData<TaskStatusEntity> => ({
  ...getDefaultMetaData<TaskStatusEntity>(),
  order: "name",
});

const TaskStatus: React.FC<Props> = () => {
  const { tenantData, auth } = useSelector((state: ReduxState) => state);
  const { tenantId } = tenantData;
  const disabledItems = auth?.rights?.some(
    (item) => item === Right.TENANT_TASK_MANAGEMENT_READ_ONLY
  );
  const {
    entity: taskStatusEntity,
    updateFilters,
    applyFilters,
    fetchPage,
    updateLimit,
  } = usePagination<TaskStatusEntity>(
    {
      ...paginatedTaskStatus,
      api: TASK_STATUS_LISTING_API.replace(":tenantId", tenantId),
    },
    getDefaultTaskStatusFilter()
  );

  const {
    visibility: formVisibility,
    showPopup: showForm,
    hidePopup: hideForm,
    metaData: config,
  } = usePopupReducer<TaskStatusEntity>();

  const {
    visibility: deleteReasonformVisibility,
    showPopup: showDeleteReasonForm,
    hidePopup: hideDeleteReasonForm,
    metaData: deleteConfig,
  } = usePopupReducer<TaskStatusEntity>();

  return (
    <Container noPadding>
      <StyledFeeLostReasonHeadingContainer>
        <StyledFeeLostReasonLeftHeadingContainer>
          <StyledHeadingTypography>
            {messages?.settings?.systemPreferences?.taskStatus?.heading}
          </StyledHeadingTypography>
        </StyledFeeLostReasonLeftHeadingContainer>
        {!disabledItems && (
          <Button
            startIcon={<ResponsiveAddIcon />}
            variant="contained"
            color="primary"
            label={messages?.settings?.systemPreferences?.taskStatus?.button}
            onClick={() => showForm()}
          />
        )}
      </StyledFeeLostReasonHeadingContainer>

      <Card cardCss={{ margin: "0 20px" }} noHeaderPadding>
        <Table
          specs={[
            {
              id: "name",
              label:
                messages?.settings?.systemPreferences?.taskStatus?.table?.name,
            },
            {
              id: "status",
              label:
                messages?.settings?.systemPreferences?.taskStatus?.table
                  ?.status,
              getValue: (row: FeeLostReasonEntity) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
          ]}
          data={taskStatusEntity.records}
          metadata={taskStatusEntity.metadata}
          actions={
            !disabledItems && [
              {
                id: "edit",
                component: <StyledEditIcon />,
                onClick: (row: FeeLostReasonEntity) => showForm({ ...row }),
              },
              {
                id: "delete",
                render(row: FeeLostReasonEntity) {
                  return (
                    <StyledDeleteIcon active={row?.status === Status.active} />
                  );
                },
                onClick: (row: FeeLostReasonEntity) =>
                  row?.status === Status.active &&
                  showDeleteReasonForm({
                    ...row,
                  }),
              },
            ]
          }
          fetchPage={fetchPage}
          updateLimit={updateLimit}
          disableSorting={["sno", "status"]}
          updateFilters={(filterParams: any) => {
            updateFilters(filterParams);
            applyFilters();
          }}
        />
      </Card>

      <Modal
        show={formVisibility}
        heading={
          messages?.settings?.systemPreferences?.taskStatus?.form[
            config?.id ? "editTaskStatus" : "addTask"
          ]
        }
        onClose={hideForm}
        fitContent
      >
        <TaskStatusForm
          onCancel={hideForm}
          onSuccess={() => {
            hideForm();
            toast(
              <Toast
                text={
                  messages?.settings?.systemPreferences?.taskStatus?.form
                    ?.success?.[config?.id ? "updated" : "created"]
                }
              />
            );
            applyFilters();
          }}
          isUpdate={!!config?.id}
          taskStatus={config}
        />
      </Modal>

      <Modal
        show={deleteReasonformVisibility}
        heading={
          messages?.settings?.systemPreferences?.taskStatus?.form
            ?.deactivateTaskStatus
        }
        onClose={hideDeleteReasonForm}
        fitContent
      >
        <DeleteCTAForm
          onCancel={hideDeleteReasonForm}
          onSuccess={() => {
            hideDeleteReasonForm();
            toast(
              <Toast
                text={
                  messages?.settings?.systemPreferences?.taskStatus?.form
                    ?.success?.deleteCategory
                }
              />
            );
            applyFilters();
          }}
          api={`${TASK_STATUS_BY_ID}/${deleteConfig?.id}`}
          bodyText={
            messages?.settings?.systemPreferences?.taskStatus?.form?.note
          }
          cancelButton={
            messages?.settings?.systemPreferences?.taskStatus?.form?.cancel
          }
          confirmButton={
            messages?.settings?.systemPreferences?.taskStatus?.form
              ?.deactivateTaskStatus
          }
          apiMethod={HttpMethods.PATCH}
          deleteBody={{
            status: Status.inactive,
            tenantId: tenantId,
          }}
        />
      </Modal>
    </Container>
  );
};

export default TaskStatus;
