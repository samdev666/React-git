import React from "react";
import { Container } from "../../../components";
import {
  StyledLeadSourceHeadingContainer,
  StyledLeadSourceLeftHeadingContainer,
} from "./styles";
import { StyledHeadingTypography } from "../launchPadSetup/styles";
import messages from "../../../messages";
import {
  Button,
  Card,
  MaterialAutocompleteInput,
  Modal,
  SearchInput,
  Table,
  Toast,
} from "@wizehub/components";
import { ResponsiveAddIcon } from "../launchPadSetup/launchPadSetup";
import { Grid } from "@mui/material";
import { Status, StatusOptions } from "@wizehub/common/models/modules";
import {
  MetaData,
  Option,
  PaginatedEntity,
  UserActionConfig,
  UserActionType,
  getDefaultMetaData,
} from "@wizehub/common/models";
import { HttpMethods, capitalizeEntireString } from "@wizehub/common/utils";
import { formatStatus } from "@wizehub/components/table";
import { usePagination, usePopupReducer } from "@wizehub/common/hooks";
import {
  FeeLostReasonEntity,
  LeadSourceEntity,
  LeadSourceFormEntity,
} from "@wizehub/common/models/genericEntities";
import { LEAD_SOURCE_BY_ID, LEAD_SOURCE_LISTING_API } from "../../../api";
import { LEAD_SOURCE_ACTION } from "../../../redux/actions";
import {
  StyledDeleteIcon,
  StyledEditIcon,
} from "@wizehub/components/table/styles";
import LeadSourceForm from "./leadSourceForm";
import DeleteCTAForm from "../launchPadSetup/deleteCTAForm";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import { Right } from "../../../redux/reducers/auth";

const paginatedLeadSource: PaginatedEntity = {
  key: "leadSource",
  name: LEAD_SOURCE_ACTION,
  api: LEAD_SOURCE_LISTING_API,
};

const getDefaultLeadSourceFilter = (): MetaData<LeadSourceEntity> => ({
  ...getDefaultMetaData<LeadSourceEntity>(),
  order: "name",
});

const LeadSourceSetup = () => {
  const { tenantData, auth } = useSelector((state: ReduxState) => state);
  const { tenantId } = tenantData;
  const disabledItems = auth?.rights?.some(
    (item) => item === Right.TENANT_LEAD_SOURCE_INDUSTRY_MANAGEMENT_READ_ONLY
  );
  const {
    entity: leadSourceEntity,
    updateFilters,
    applyFilters,
    connectFilter,
    fetchPage,
    updateLimit,
  } = usePagination<LeadSourceEntity>(
    {
      ...paginatedLeadSource,
      api: LEAD_SOURCE_LISTING_API.replace(":id", tenantId),
    },
    getDefaultLeadSourceFilter()
  );

  const {
    visibility: formVisibility,
    showPopup: showForm,
    hidePopup: hideForm,
    metaData: config,
  } = usePopupReducer<LeadSourceFormEntity>();

  const {
    visibility: deleteFormVisibility,
    showPopup: showDeleteForm,
    hidePopup: hideDeleteForm,
    metaData: deleteConfig,
  } = usePopupReducer<UserActionConfig>();
  return (
    <Container noPadding>
      <StyledLeadSourceHeadingContainer>
        <StyledLeadSourceLeftHeadingContainer>
          <StyledHeadingTypography>
            {messages?.settings?.systemPreferences?.leadSourceSetup?.heading}
          </StyledHeadingTypography>
        </StyledLeadSourceLeftHeadingContainer>
        {!disabledItems && (
          <Button
            startIcon={<ResponsiveAddIcon />}
            variant="contained"
            color="primary"
            label={
              messages?.settings?.systemPreferences?.leadSourceSetup?.button
            }
            onClick={() =>
              showForm({
                actionConfig: {
                  type: UserActionType.CREATE,
                },
              })
            }
          />
        )}
      </StyledLeadSourceHeadingContainer>
      <Card
        headerCss={{ display: "flex" }}
        header={
          <Grid container margin="0 16px" xs={12}>
            <Grid item xs={3}>
              <SearchInput
                connectFilter={connectFilter}
                label={
                  messages?.settings?.systemPreferences?.leadSourceSetup?.search
                }
              />
            </Grid>
            <Grid container item xs={7} justifyContent="end" marginLeft="auto">
              <Grid xs={3} item>
                {connectFilter("status", {
                  label:
                    messages?.settings?.systemPreferences?.leadSourceSetup
                      ?.status,
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
                messages?.settings?.systemPreferences?.leadSourceSetup?.table
                  ?.name,
            },
            {
              id: "status",
              label:
                messages?.settings?.systemPreferences?.leadSourceSetup?.table
                  ?.status,
              getValue: (row: FeeLostReasonEntity) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
          ]}
          data={leadSourceEntity?.records}
          metadata={leadSourceEntity?.metadata}
          actions={
            !disabledItems && [
              {
                id: "edit",
                component: <StyledEditIcon />,
                onClick: (row: FeeLostReasonEntity) => {
                  showForm({
                    actionConfig: {
                      type: UserActionType.EDIT,
                    },
                    leadSource: { ...row },
                  });
                },
              },
              {
                id: "delete",
                render(row: FeeLostReasonEntity) {
                  return (
                    <StyledDeleteIcon active={row?.status === Status.active} />
                  );
                },
                onClick: (row: FeeLostReasonEntity) => {
                  row?.status === Status.active &&
                    showDeleteForm({
                      id: row?.id,
                    });
                },
              },
            ]
          }
          fetchPage={fetchPage}
          updateLimit={updateLimit}
          disableSorting={["status", "sno"]}
          updateFilters={(filterParams: any) => {
            updateFilters(filterParams);
            applyFilters();
          }}
        />
      </Card>
      <Modal
        show={formVisibility}
        heading={
          messages?.settings?.systemPreferences?.leadSourceSetup?.form?.[
            config?.actionConfig?.type === UserActionType.EDIT
              ? "editHeading"
              : "addHeading"
          ]
        }
        onClose={hideForm}
        fitContent
      >
        <LeadSourceForm
          onCancel={hideForm}
          onSuccess={() => {
            hideForm();
            applyFilters();
          }}
          isUpdate={config?.actionConfig?.type === UserActionType.EDIT}
          leadSource={
            config?.actionConfig?.type === UserActionType.EDIT &&
            config?.leadSource
          }
        />
      </Modal>
      <Modal
        show={deleteFormVisibility}
        heading={
          messages?.settings?.systemPreferences?.leadSourceSetup?.form
            ?.deactivateLeadSource
        }
        onClose={hideDeleteForm}
        fitContent
      >
        <DeleteCTAForm
          onCancel={hideDeleteForm}
          onSuccess={() => {
            hideDeleteForm();
            toast(
              <Toast
                text={
                  messages?.settings?.systemPreferences?.leadSourceSetup?.form
                    ?.success?.deleted
                }
              />
            );
            applyFilters();
          }}
          api={`${LEAD_SOURCE_BY_ID}/${deleteConfig?.id}`}
          bodyText={
            messages?.settings?.systemPreferences?.leadSourceSetup?.form?.note
          }
          cancelButton={
            messages?.settings?.systemPreferences?.leadSourceSetup?.form?.cancel
          }
          confirmButton={
            messages?.settings?.systemPreferences?.leadSourceSetup?.form
              ?.deactivateButton
          }
          apiMethod={HttpMethods.PATCH}
          deleteBody={{
            tenantId: tenantId,
            status: Status.inactive,
          }}
        />
      </Modal>
    </Container>
  );
};

export default LeadSourceSetup;
