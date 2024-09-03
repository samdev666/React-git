import React from "react";
import {
  Card,
  MaterialAutocompleteInput,
  Modal,
  SearchInput,
  Table,
  Toast,
} from "@wizehub/components";
import { Grid } from "@mui/material";
import messages from "../../../messages";
import { Status, StatusOptions } from "@wizehub/common/models/modules";
import {
  MetaData,
  Option,
  PaginatedEntity,
  UserActionType,
  getDefaultMetaData,
} from "@wizehub/common/models";
import { HttpMethods, capitalizeEntireString } from "@wizehub/common/utils";
import { usePagination, usePopupReducer } from "@wizehub/common/hooks";
import {
  LeadStageStatus,
  LeadStageStatusFormEntity,
} from "@wizehub/common/models/genericEntities";
import {
  LEAD_STAGE_STATUS_BY_ID,
  LEAD_STAGE_STATUS_LISTING_API,
} from "../../../api";
import { LEAD_STAGE_STATUS_ACTION } from "../../../redux/actions";
import { formatStatus } from "@wizehub/components/table";
import {
  StyledDeleteIcon,
  StyledEditIcon,
} from "@wizehub/components/table/styles";
import DeleteCTAForm from "../launchPadSetup/deleteCTAForm";
import { toast } from "react-toastify";
import StageStatusForm from "./stageStatusForm";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import { Right } from "../../../redux/reducers/auth";

interface Props {
  showAddLeadStageStatusForm: (
    metaData?: Partial<LeadStageStatusFormEntity>
  ) => void;
  addLeadStageStatusformVisibility: boolean;
  hideAddLeadStageStatusForm: () => void;
  addLeadStageStatusConfig: LeadStageStatusFormEntity;
}

const paginatedLeadStage: PaginatedEntity = {
  key: "leadStageStatus",
  name: LEAD_STAGE_STATUS_ACTION,
  api: LEAD_STAGE_STATUS_LISTING_API,
};

const getDefaultLeadStageStatusFilter = (): MetaData<LeadStageStatus> => ({
  ...getDefaultMetaData<LeadStageStatus>(),
  order: "name",
});

const StageStatus: React.FC<Props> = ({
  showAddLeadStageStatusForm,
  addLeadStageStatusformVisibility,
  hideAddLeadStageStatusForm,
  addLeadStageStatusConfig,
}) => {
  const { tenantData, auth } = useSelector((state: ReduxState) => state);
  const { tenantId } = tenantData;
  const disabledItems = auth?.rights?.some(
    (item) => item === Right.TENANT_LEAD_PROGRESS_MANAGEMENT_READ_ONLY
  );
  const {
    entity: leadStageStatusEntity,
    updateFilters,
    applyFilters,
    connectFilter,
    fetchPage,
    updateLimit,
  } = usePagination<LeadStageStatus>(
    {
      ...paginatedLeadStage,
      api: LEAD_STAGE_STATUS_LISTING_API.replace(":id", tenantId),
    },
    getDefaultLeadStageStatusFilter()
  );
  const {
    visibility: deleteLeadStageStatusformVisibility,
    showPopup: showDeleteLeadStageStatusForm,
    hidePopup: hideDeleteLeadStageStatusForm,
    metaData: deleteConfig,
  } = usePopupReducer<LeadStageStatus>();
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
                  messages?.settings?.systemPreferences?.practiceLeadStageSetup
                    ?.search
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
                {connectFilter("status", {
                  label:
                    messages?.settings?.systemPreferences
                      ?.practiceLeadStageSetup?.status,
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
              id: "name",
              label:
                messages?.settings?.systemPreferences?.practiceLeadStageSetup
                  ?.stageStatus?.table?.name,
            },
            {
              id: "leadProgressStage",
              label:
                messages?.settings?.systemPreferences?.practiceLeadStageSetup
                  ?.stageStatus?.table?.stage,
              getValue: (row: LeadStageStatus) => row,
              format: (row: LeadStageStatus) => row?.leadProgressStage?.name,
            },
            {
              id: "status",
              label:
                messages?.settings?.systemPreferences?.practiceLeadStageSetup
                  ?.stageStatus?.table?.status,
              getValue: (row: LeadStageStatus) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
          ]}
          data={leadStageStatusEntity?.records}
          metadata={leadStageStatusEntity?.metadata}
          disableSorting={["status", "leadProgressStage"]}
          updateFilters={(filterParams: any) => {
            updateFilters(filterParams);
            applyFilters();
          }}
          actions={
            !disabledItems && [
              {
                id: "edit",
                component: <StyledEditIcon />,
                onClick: (row: LeadStageStatus) => {
                  showAddLeadStageStatusForm({
                    actionConfig: {
                      type: UserActionType.EDIT,
                    },
                    leadStageStatus: { ...row },
                  });
                },
              },
              {
                id: "delete",
                render(row: LeadStageStatus) {
                  return (
                    <StyledDeleteIcon active={row?.status === Status.active} />
                  );
                },
                onClick: (row: LeadStageStatus) =>
                  row?.status === Status.active &&
                  showDeleteLeadStageStatusForm({
                    ...row,
                  }),
              },
            ]
          }
          fetchPage={fetchPage}
          updateLimit={updateLimit}
        />
      </Card>
      <Modal
        show={addLeadStageStatusformVisibility}
        heading={
          messages?.settings?.systemPreferences?.practiceLeadStageSetup
            ?.stageStatus?.form?.[
            addLeadStageStatusConfig?.actionConfig?.type === UserActionType.EDIT
              ? "editHeading"
              : "addHeading"
          ]
        }
        onClose={hideAddLeadStageStatusForm}
        fitContent
      >
        <StageStatusForm
          onCancel={hideAddLeadStageStatusForm}
          onSuccess={() => {
            hideAddLeadStageStatusForm();
            applyFilters();
          }}
          isUpdate={
            addLeadStageStatusConfig?.actionConfig?.type === UserActionType.EDIT
          }
          leadStageStatus={
            leadStageStatusEntity?.records?.filter(
              (record) =>
                record?.id ===
                Number(addLeadStageStatusConfig?.leadStageStatus?.id)
            )[0]
          }
        />
      </Modal>
      <Modal
        show={deleteLeadStageStatusformVisibility}
        heading={
          messages?.settings?.systemPreferences?.practiceLeadStageSetup
            ?.stageStatus?.form?.deactivateHeading
        }
        onClose={hideDeleteLeadStageStatusForm}
        fitContent
      >
        <DeleteCTAForm
          onCancel={hideDeleteLeadStageStatusForm}
          onSuccess={() => {
            hideDeleteLeadStageStatusForm();
            toast(
              <Toast
                text={
                  messages?.settings?.systemPreferences?.practiceLeadStageSetup
                    ?.stageStatus?.form?.success?.deleted
                }
              />
            );
            applyFilters();
          }}
          api={`${LEAD_STAGE_STATUS_BY_ID}/${deleteConfig?.id}`}
          bodyText={
            messages?.settings?.systemPreferences?.practiceLeadStageSetup
              ?.stageStatus?.form?.note
          }
          cancelButton={
            messages?.settings?.systemPreferences?.practiceLeadStageSetup
              ?.stageStatus?.form?.cancelButton
          }
          confirmButton={
            messages?.settings?.systemPreferences?.practiceLeadStageSetup
              ?.stageStatus?.form?.deactivateHeading
          }
          apiMethod={HttpMethods.PATCH}
          deleteBody={{
            tenantId: tenantId,
            status: Status.inactive,
          }}
        />
      </Modal>
    </>
  );
};

export default StageStatus;
