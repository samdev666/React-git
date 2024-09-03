import React from "react";
import { Container } from "../../../components";
import {
  StyledLeadIndustryHeadingContainer,
  StyledLeadIndustryLeftHeadingContainer,
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
  LeadIndustryFormEntity,
  LeadIndustryInterface,
} from "@wizehub/common/models/genericEntities";
import {
  LEAD_INDUSTRY_BY_ID,
  LEAD_INDUSTRY_LISTING_API,
  LEAD_SOURCE_BY_ID,
} from "../../../api";
import { LEAD_INDUSTRY_ACTION } from "../../../redux/actions";
import {
  StyledDeleteIcon,
  StyledEditIcon,
} from "@wizehub/components/table/styles";
import LeadIndustryForm from "./leadIndustryForm";
import DeleteCTAForm from "../launchPadSetup/deleteCTAForm";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import { Right } from "../../../redux/reducers/auth";

const paginatedLeadIndustry: PaginatedEntity = {
  key: "leadIndustry",
  name: LEAD_INDUSTRY_ACTION,
  api: LEAD_INDUSTRY_LISTING_API,
};

const getDefaultLeadIndustryFilter = (): MetaData<LeadIndustryInterface> => ({
  ...getDefaultMetaData<LeadIndustryInterface>(),
  order: "name",
});

const LeadIndustrySetup = () => {
  const { tenantData, auth } = useSelector((state: ReduxState) => state);
  const { tenantId } = tenantData;
  const disabledItems = auth?.rights?.some(
    (item) => item === Right.TENANT_LEAD_SOURCE_INDUSTRY_MANAGEMENT_READ_ONLY
  );
  const {
    entity: leadIndustryEntity,
    updateFilters,
    applyFilters,
    connectFilter,
    fetchPage,
    updateLimit,
  } = usePagination<LeadIndustryInterface>(
    {
      ...paginatedLeadIndustry,
      api: LEAD_INDUSTRY_LISTING_API.replace(":id", tenantId),
    },
    getDefaultLeadIndustryFilter()
  );

  const {
    visibility: formVisibility,
    showPopup: showForm,
    hidePopup: hideForm,
    metaData: config,
  } = usePopupReducer<LeadIndustryFormEntity>();

  const {
    visibility: deleteFormVisibility,
    showPopup: showDeleteForm,
    hidePopup: hideDeleteForm,
    metaData: deleteConfig,
  } = usePopupReducer<UserActionConfig>();
  return (
    <Container noPadding>
      <StyledLeadIndustryHeadingContainer>
        <StyledLeadIndustryLeftHeadingContainer>
          <StyledHeadingTypography>
            {messages?.settings?.systemPreferences?.leadIndustrySetup?.heading}
          </StyledHeadingTypography>
        </StyledLeadIndustryLeftHeadingContainer>
        {!disabledItems && (
          <Button
            startIcon={<ResponsiveAddIcon />}
            variant="contained"
            color="primary"
            label={
              messages?.settings?.systemPreferences?.leadIndustrySetup?.button
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
      </StyledLeadIndustryHeadingContainer>
      <Card
        headerCss={{ display: "flex" }}
        header={
          <Grid container margin="0 16px" xs={12}>
            <Grid item xs={3}>
              <SearchInput
                connectFilter={connectFilter}
                label={
                  messages?.settings?.systemPreferences?.leadIndustrySetup
                    ?.search
                }
              />
            </Grid>
            <Grid container item xs={7} justifyContent="end" marginLeft="auto">
              <Grid xs={3} item>
                {connectFilter("status", {
                  label:
                    messages?.settings?.systemPreferences?.leadIndustrySetup
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
                messages?.settings?.systemPreferences?.leadIndustrySetup?.table
                  ?.name,
            },
            {
              id: "status",
              label:
                messages?.settings?.systemPreferences?.leadIndustrySetup?.table
                  ?.status,
              getValue: (row: LeadIndustryInterface) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
          ]}
          data={leadIndustryEntity?.records}
          metadata={leadIndustryEntity?.metadata}
          actions={
            !disabledItems && [
              {
                id: "edit",
                component: <StyledEditIcon />,
                onClick: (row: LeadIndustryInterface) => {
                  showForm({
                    actionConfig: {
                      type: UserActionType.EDIT,
                    },
                    leadIndustry: { ...row },
                  });
                },
              },
              {
                id: "delete",
                render(row: LeadIndustryInterface) {
                  return (
                    <StyledDeleteIcon active={row?.status === Status.active} />
                  );
                },
                onClick: (row: LeadIndustryInterface) => {
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
          messages?.settings?.systemPreferences?.leadIndustrySetup?.form?.[
            config?.actionConfig?.type === UserActionType.EDIT
              ? "editHeading"
              : "addHeading"
          ]
        }
        onClose={hideForm}
        fitContent
      >
        <LeadIndustryForm
          onCancel={hideForm}
          onSuccess={() => {
            hideForm();
            applyFilters();
          }}
          isUpdate={config?.actionConfig?.type === UserActionType.EDIT}
          leadIndustry={
            config?.actionConfig?.type === UserActionType.EDIT &&
            config?.leadIndustry
          }
        />
      </Modal>
      <Modal
        show={deleteFormVisibility}
        heading={
          messages?.settings?.systemPreferences?.leadIndustrySetup?.form
            ?.deactivateLeadIndustry
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
                  messages?.settings?.systemPreferences?.leadIndustrySetup?.form
                    ?.success?.deleted
                }
              />
            );
            applyFilters();
          }}
          api={`${LEAD_INDUSTRY_BY_ID}/${deleteConfig?.id}`}
          bodyText={
            messages?.settings?.systemPreferences?.leadIndustrySetup?.form?.note
          }
          cancelButton={
            messages?.settings?.systemPreferences?.leadIndustrySetup?.form
              ?.cancel
          }
          confirmButton={
            messages?.settings?.systemPreferences?.leadIndustrySetup?.form
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

export default LeadIndustrySetup;
