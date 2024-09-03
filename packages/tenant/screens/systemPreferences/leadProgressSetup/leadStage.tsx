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
  LeadStageEntity,
  LeadStageFormEntity,
} from "@wizehub/common/models/genericEntities";
import { LEAD_STAGE_BY_ID, LEAD_STAGE_LISTING_API } from "../../../api";
import { LEAD_STAGE_ACTION } from "../../../redux/actions";
import { formatStatus } from "@wizehub/components/table";
import {
  StyledDeleteIcon,
  StyledEditIcon,
  StyledVisibilityIcon,
} from "@wizehub/components/table/styles";
import LeadStageForm from "./leadStageForm";
import DeleteCTAForm from "../launchPadSetup/deleteCTAForm";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";

interface Props {
  showAddLeadStageForm: (metaData?: Partial<LeadStageFormEntity>) => void;
  addLeadStageformVisibility: boolean;
  hideAddLeadStageForm: () => void;
  addConfig: LeadStageFormEntity;
}

const paginatedLeadStage: PaginatedEntity = {
  key: "leadStage",
  name: LEAD_STAGE_ACTION,
  api: LEAD_STAGE_LISTING_API,
};

const getDefaultLeadStageFilter = (): MetaData<LeadStageEntity> => ({
  ...getDefaultMetaData<LeadStageEntity>(),
  order: "name",
});

const LeadStage: React.FC<Props> = ({
  showAddLeadStageForm,
  addLeadStageformVisibility,
  hideAddLeadStageForm,
  addConfig,
}) => {
  const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
  const {
    entity: leadStageEntity,
    updateFilters,
    applyFilters,
    connectFilter,
    fetchPage,
    updateLimit,
  } = usePagination<LeadStageEntity>(
    {
      ...paginatedLeadStage,
      api: LEAD_STAGE_LISTING_API.replace(":id", tenantId),
    },
    getDefaultLeadStageFilter()
  );
  const {
    visibility: deleteLeadStageformVisibility,
    showPopup: showDeleteLeadStageForm,
    hidePopup: hideDeleteLeadStageForm,
    metaData: deleteConfig,
  } = usePopupReducer<LeadStageEntity>();
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
                  ?.leadStage?.table?.name,
            },
            {
              id: "status",
              label:
                messages?.settings?.systemPreferences?.practiceLeadStageSetup
                  ?.leadStage?.table?.status,
              getValue: (row: LeadStageEntity) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
          ]}
          data={leadStageEntity?.records}
          metadata={leadStageEntity?.metadata}
          disableSorting={["status", "sno"]}
          updateFilters={(filterParams: any) => {
            updateFilters(filterParams);
            applyFilters();
          }}
          actions={[
            {
              id: "edit",
              component: <StyledEditIcon />,
              onClick: (row: LeadStageEntity) => {
                showAddLeadStageForm({
                  actionConfig: {
                    type: UserActionType.EDIT,
                  },
                  leadStage: { ...row },
                });
              },
            },
            {
              id: "delete",
              render(row: LeadStageEntity) {
                return (
                  <StyledDeleteIcon active={row?.status === Status.active} />
                );
              },
              onClick: (row: LeadStageEntity) =>
                row?.status === Status.active &&
                showDeleteLeadStageForm({
                  ...row,
                }),
            },
          ]}
          fetchPage={fetchPage}
          updateLimit={updateLimit}
        />
      </Card>
      <Modal
        show={addLeadStageformVisibility}
        heading={
          messages?.settings?.systemPreferences?.practiceLeadStageSetup
            ?.leadStage?.form?.[
            addConfig?.actionConfig?.type === UserActionType.EDIT
              ? "editHeading"
              : "addHeading"
          ]
        }
        onClose={hideAddLeadStageForm}
        fitContent
      >
        <LeadStageForm
          onCancel={hideAddLeadStageForm}
          onSuccess={() => {
            hideAddLeadStageForm();
            applyFilters();
          }}
          isUpdate={addConfig?.actionConfig?.type === UserActionType.EDIT}
          leadStage={
            leadStageEntity?.records?.filter(
              (record) => record?.id === Number(addConfig?.leadStage?.id)
            )[0]
          }
        />
      </Modal>
      <Modal
        show={deleteLeadStageformVisibility}
        heading={
          messages?.settings?.systemPreferences?.practiceLeadStageSetup
            ?.leadStage?.form?.deactivateHeading
        }
        onClose={hideDeleteLeadStageForm}
        fitContent
      >
        <DeleteCTAForm
          onCancel={hideDeleteLeadStageForm}
          onSuccess={() => {
            hideDeleteLeadStageForm();
            toast(
              <Toast
                text={
                  messages?.settings?.systemPreferences?.practiceLeadStageSetup
                    ?.leadStage?.form?.success?.deleted
                }
              />
            );
            applyFilters();
          }}
          api={`${LEAD_STAGE_BY_ID}/${deleteConfig?.id}`}
          bodyText={
            messages?.settings?.systemPreferences?.practiceLeadStageSetup
              ?.leadStage?.form?.note
          }
          cancelButton={
            messages?.settings?.systemPreferences?.practiceLeadStageSetup
              ?.leadStage?.form?.cancelButton
          }
          confirmButton={
            messages?.settings?.systemPreferences?.practiceLeadStageSetup
              ?.leadStage?.form?.deactivateHeading
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

export default LeadStage;
