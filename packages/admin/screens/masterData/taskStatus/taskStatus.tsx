import React, { useState } from "react";
import { Button, Card, Modal, Stepper, Toast } from "@wizehub/components";
import {
  MetaData,
  PaginatedEntity,
  getDefaultMetaData,
} from "@wizehub/common/models";
import { usePagination, usePopupReducer } from "@wizehub/common/hooks";
import { Grid } from "@mui/material";
import Table, { formatStatus } from "@wizehub/components/table";
import { toast } from "react-toastify";
import { StyledEditIcon } from "@wizehub/components/table/styles";
import { HttpMethods, capitalizeEntireString } from "@wizehub/common/utils";
import { Status } from "@wizehub/common/models/modules";
import {
  CategoryEntity,
  FeeLostReasonEntity,
  TaskStatusEntity,
} from "@wizehub/common/models/genericEntities";
import { Container } from "../../../components";
import {
  StyledDeleteIcon,
  StyledMasterDataHeadingContainer,
  StyledMasterDataLeftHeadingContainer,
} from "../styles";
import messages from "../../../messages";
import { TASK_STATUS_LISTING } from "../../../redux/actions";
import { TASK_STATUS_BY_ID, TASK_STATUS_LISTING_API } from "../../../api";
// import AddFeeLostReason from './addFeeLostReasonForm';
import DeleteCTAForm from "../../tenantManagement/deleteCTAForm";
import { StyledHeadingTypography } from "../../userManagement/styles";
import { ResponsiveAddIcon } from "../../productManagement/productManagement";
import TaskStatusForm from "./taskStatusForm";

interface Props {}

const paginatedTaskStatus: PaginatedEntity = {
  key: "taskStatus",
  name: TASK_STATUS_LISTING,
  api: TASK_STATUS_LISTING_API,
};

const getDefaultTaskStatusFilter = (): MetaData<TaskStatusEntity> => ({
  ...getDefaultMetaData<TaskStatusEntity>(),
  order: "name",
});

const TaskStatus: React.FC<Props> = () => {
  const {
    entity: taskStatusEntity,
    updateFilters,
    applyFilters,
    connectFilter,
    fetchPage,
    updateLimit,
  } = usePagination<TaskStatusEntity>(
    paginatedTaskStatus,
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
      <StyledMasterDataHeadingContainer>
        <StyledMasterDataLeftHeadingContainer>
          <Stepper />
          <StyledHeadingTypography>
            {
              messages?.sidebar?.menuItems?.secondaryMenu?.subMenuItems
                ?.masterData?.subItems?.taskStatus?.heading
            }
          </StyledHeadingTypography>
        </StyledMasterDataLeftHeadingContainer>
        <Button
          startIcon={<ResponsiveAddIcon />}
          variant="contained"
          color="primary"
          label={
            messages?.sidebar?.menuItems?.secondaryMenu?.subMenuItems
              ?.masterData?.subItems?.taskStatus?.createTask
          }
          onClick={showForm}
        />
      </StyledMasterDataHeadingContainer>

      <Card cardCss={{ margin: "0 20px" }} noHeaderPadding>
        <Table
          specs={[
            {
              id: "sno",
              label:
                messages?.sidebar?.menuItems?.secondaryMenu?.subMenuItems
                  ?.masterData?.subItems?.taskStatus?.table?.sno,
            },
            {
              id: "name",
              label:
                messages?.sidebar?.menuItems?.secondaryMenu?.subMenuItems
                  ?.masterData?.subItems?.taskStatus?.table?.name,
            },
            {
              id: "status",
              label:
                messages?.sidebar?.menuItems?.secondaryMenu?.subMenuItems
                  ?.masterData?.subItems?.taskStatus?.table?.status,
              getValue: (row: FeeLostReasonEntity) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
          ]}
          data={taskStatusEntity.records}
          metadata={taskStatusEntity.metadata}
          actions={[
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
          ]}
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
          messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
            .subItems.taskStatus.form[config?.id ? "editTaskStatus" : "addTask"]
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
                  messages?.sidebar?.menuItems?.secondaryMenu?.subMenuItems
                    ?.masterData?.subItems?.taskStatus?.form?.success?.[
                    config?.id ? "updated" : "created"
                  ]
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
          messages?.sidebar?.menuItems?.secondaryMenu?.subMenuItems?.masterData
            ?.subItems?.taskStatus?.form?.deactivateTaskStatus
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
                  messages?.sidebar?.menuItems?.secondaryMenu?.subMenuItems
                    ?.masterData?.subItems?.taskStatus?.form?.success
                    ?.deleteCategory
                }
              />
            );
            applyFilters();
          }}
          api={`${TASK_STATUS_BY_ID}/${deleteConfig?.id}`}
          bodyText={
            messages?.sidebar?.menuItems?.secondaryMenu?.subMenuItems
              ?.masterData?.subItems?.taskStatus?.form?.note
          }
          cancelButton={
            messages?.sidebar?.menuItems?.secondaryMenu?.subMenuItems
              ?.masterData?.subItems?.taskStatus?.form?.cancel
          }
          confirmButton={
            messages?.sidebar?.menuItems?.secondaryMenu?.subMenuItems
              ?.masterData?.subItems?.taskStatus?.form?.deactivateTaskStatus
          }
          apiMethod={HttpMethods.PATCH}
          deleteBody={{
            status: Status.inactive,
          }}
        />
      </Modal>
    </Container>
  );
};

export default TaskStatus;
