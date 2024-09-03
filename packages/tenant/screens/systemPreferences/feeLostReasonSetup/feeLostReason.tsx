import React from "react";
import { Container } from "../../../components";
import {
  StyledFeeLostReasonHeadingContainer,
  StyledFeeLostReasonLeftHeadingContainer,
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
  FeeLostReasonFormEntity,
} from "@wizehub/common/models/genericEntities";
import {
  FEE_LOST_REASON_BY_ID,
  FEE_LOST_REASON_LISTING_API,
} from "../../../api";
import { FEE_LOST_REASON_ACTION } from "../../../redux/actions";
import {
  StyledDeleteIcon,
  StyledEditIcon,
} from "@wizehub/components/table/styles";
import FeeLostReasonForm from "./feeLostReasonForm";
import DeleteCTAForm from "../launchPadSetup/deleteCTAForm";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import { Right } from "../../../redux/reducers/auth";

const paginatedFeeLostReason: PaginatedEntity = {
  key: "feeLostReason",
  name: FEE_LOST_REASON_ACTION,
  api: FEE_LOST_REASON_LISTING_API,
};

export const getDefaultFeeLostReasonFilter = (): MetaData<FeeLostReasonEntity> => ({
  ...getDefaultMetaData<FeeLostReasonEntity>(),
  order: "name",
});

const FeelLostReason = () => {
  const { tenantData, auth } = useSelector((state: ReduxState) => state);
  const { tenantId } = tenantData;
  const disabledItems = auth?.rights?.some(
    (item) => item === Right.TENANT_FEE_LOST_REASON_MANAGEMENT_READ_ONLY
  );
  const {
    entity: feeLostReason,
    updateFilters,
    applyFilters,
    connectFilter,
    fetchPage,
    updateLimit,
  } = usePagination<FeeLostReasonEntity>(
    {
      ...paginatedFeeLostReason,
      api: FEE_LOST_REASON_LISTING_API.replace(":id", tenantId),
    },
    getDefaultFeeLostReasonFilter()
  );

  const {
    visibility: formVisibility,
    showPopup: showForm,
    hidePopup: hideForm,
    metaData: config,
  } = usePopupReducer<FeeLostReasonFormEntity>();

  const {
    visibility: deleteFormVisibility,
    showPopup: showDeleteForm,
    hidePopup: hideDeleteForm,
    metaData: deleteConfig,
  } = usePopupReducer<UserActionConfig>();
  return (
    <Container noPadding>
      <StyledFeeLostReasonHeadingContainer>
        <StyledFeeLostReasonLeftHeadingContainer>
          <StyledHeadingTypography>
            {messages?.settings?.systemPreferences?.feeLostReasonSetup?.heading}
          </StyledHeadingTypography>
        </StyledFeeLostReasonLeftHeadingContainer>
        {!disabledItems && (
          <Button
            startIcon={<ResponsiveAddIcon />}
            variant="contained"
            color="primary"
            label={
              messages?.settings?.systemPreferences?.feeLostReasonSetup?.button
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
      </StyledFeeLostReasonHeadingContainer>
      <Card
        headerCss={{ display: "flex" }}
        header={
          <Grid container margin="0 16px" xs={12}>
            <Grid item xs={3}>
              <SearchInput
                connectFilter={connectFilter}
                label={
                  messages?.settings?.systemPreferences?.feeLostReasonSetup
                    ?.search
                }
              />
            </Grid>
            <Grid container item xs={7} justifyContent="end" marginLeft="auto">
              <Grid xs={3} item>
                {connectFilter("status", {
                  label:
                    messages?.settings?.systemPreferences?.feeLostReasonSetup
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
                messages?.settings?.systemPreferences?.feeLostReasonSetup?.table
                  ?.title,
            },
            {
              id: "status",
              label:
                messages?.settings?.systemPreferences?.feeLostReasonSetup?.table
                  ?.status,
              getValue: (row: FeeLostReasonEntity) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
          ]}
          data={feeLostReason?.records}
          metadata={feeLostReason?.metadata}
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
                    feeLostReason: { ...row },
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
        heading={config?.actionConfig?.type === UserActionType.EDIT
          ? messages?.settings?.systemPreferences?.feeLostReasonSetup?.form
            ?.editHeading
          : messages?.settings?.systemPreferences?.feeLostReasonSetup?.form
            ?.addHeading
        }
        onClose={hideForm}
        fitContent
      >
        <FeeLostReasonForm
          onCancel={hideForm}
          onSuccess={() => {
            hideForm();
            applyFilters();
          }}
          isUpdate={config?.actionConfig?.type === UserActionType.EDIT}
          feeLostReason={
            config?.actionConfig?.type === UserActionType.EDIT &&
            config?.feeLostReason
          }
        />
      </Modal>
      <Modal
        show={deleteFormVisibility}
        heading={
          messages?.settings?.systemPreferences?.feeLostReasonSetup?.form
            ?.deactivateReason
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
                  messages?.settings?.systemPreferences?.feeLostReasonSetup
                    ?.form?.success?.deleted
                }
              />
            );
            applyFilters();
          }}
          api={`${FEE_LOST_REASON_BY_ID}/${deleteConfig?.id}`}
          bodyText={
            messages?.settings?.systemPreferences?.feeLostReasonSetup?.form
              ?.note
          }
          cancelButton={
            messages?.settings?.systemPreferences?.feeLostReasonSetup?.form
              ?.cancel
          }
          confirmButton={
            messages?.settings?.systemPreferences?.feeLostReasonSetup?.form
              ?.deactivateReason
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

export default FeelLostReason;
