import React from "react";
import { Container } from "../../components";
import {
  StyledHeadingTypography,
  StyledMainHeadingContainer,
  StyledMainLeftHeadingContainer,
} from "@wizehub/components/detailPageWrapper/styles";
import messages from "../../messages";
import {
  Button,
  Card,
  MaterialAutocompleteInput,
  MaterialDateRangePicker,
  Modal,
  SearchInput,
  Table,
  Toast,
} from "@wizehub/components";
import { ResponsiveAddIcon } from "../systemPreferences/launchPadSetup/launchPadSetup";
import { Grid } from "@mui/material";
import { Status, StatusOptions } from "@wizehub/common/models/modules";
import {
  MetaData,
  Option,
  PaginatedEntity,
  RoleInterface,
  RoleTypeEnum,
  UserActionConfig,
  UserActionType,
  getDefaultMetaData,
} from "@wizehub/common/models";
import {
  HttpMethods,
  capitalizeEntireString,
  capitalizeLegend,
  dateFormatterFunction,
  mapIdNameToOption,
  nullablePlaceHolder,
} from "@wizehub/common/utils";
import { useSelector } from "react-redux";
import { ReduxState } from "../../redux/reducers";
import {
  useOptions,
  usePagination,
  usePopupReducer,
} from "@wizehub/common/hooks";
import { AccountManagementEntity } from "@wizehub/common/models/genericEntities";
import {
  ACCOUNT_MANAGEMENT_API,
  ACCOUNT_MANAGEMENT_LISTING_API,
  ROLE_LISTING_API,
} from "../../api";
import { formatStatus } from "@wizehub/components/table";
import { ACCOUNT_MANAGEMENT_ACTION } from "../../redux/actions";
import moment from "moment";
import {
  StyledPeopleEmailcolumn,
  StyledPeopleNamecolumn,
} from "../firmProfile/styles";
import {
  StyledDeleteIcon,
  StyledEditIcon,
} from "@wizehub/components/table/styles";
import AddAccountForm, { ResponsivePasswordIcon } from "./addAccountForm";
import DeleteCTAForm from "../systemPreferences/launchPadSetup/deleteCTAForm";
import { toast } from "react-toastify";
import UserPasswordForm from "./changeUserPasswordForm";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const paginatedAccountManagement: PaginatedEntity = {
  key: "accountManagement",
  name: ACCOUNT_MANAGEMENT_ACTION,
  api: ACCOUNT_MANAGEMENT_LISTING_API,
};

const getDefaultTeamPositionFilter = (): MetaData<AccountManagementEntity> => ({
  ...getDefaultMetaData<AccountManagementEntity>(),
  order: "name",
});

export const getDefaultRoleFilter = (): MetaData<RoleInterface> => ({
  ...getDefaultMetaData<RoleInterface>(),
  order: "name",
  filters: {
    type: RoleTypeEnum.WIZEHUB_PORTAL,
  },
});

const accountManagementEmployeeNameColumn = (row: AccountManagementEntity) => {
  const name = `${row.firstName} ${row.lastName}`;
  return (
    <Grid container display="flex" flexDirection="column">
      <Grid item>
        <StyledPeopleNamecolumn>
          {row?.firstName && row?.lastName ? name : "-"}
        </StyledPeopleNamecolumn>
      </Grid>
      <Grid item>
        <StyledPeopleEmailcolumn>{row.email}</StyledPeopleEmailcolumn>
      </Grid>
    </Grid>
  );
};

const AccountManagement = () => {
  const { tenantData, profile } = useSelector((state: ReduxState) => state);
  const { tenantId } = tenantData;
  const {
    entity: accountManagementEntity,
    updateFilters,
    applyFilters,
    connectFilter,
    fetchPage,
    updateLimit,
  } = usePagination<AccountManagementEntity>(
    {
      ...paginatedAccountManagement,
      api: ACCOUNT_MANAGEMENT_LISTING_API.replace(":tenantId", tenantId),
    },
    getDefaultTeamPositionFilter()
  );

  const { options: roleOptions, searchOptions } = useOptions<RoleInterface>(
    ROLE_LISTING_API,
    true,
    getDefaultRoleFilter()
  );

  const {
    visibility: formVisibility,
    showPopup: showForm,
    hidePopup: hideForm,
    metaData: config,
  } = usePopupReducer<{
    actionConfig: UserActionConfig;
    accountManagementDetails?: AccountManagementEntity;
  }>();

  const {
    visibility: deleteFormVisibility,
    showPopup: showDeleteForm,
    hidePopup: hideDeleteForm,
    metaData: deleteConfig,
  } = usePopupReducer<UserActionConfig>();

  const {
    visibility: passwordFormVisibility,
    showPopup: showPasswordForm,
    hidePopup: hidePasswordForm,
    metaData: passwordConfig,
  } = usePopupReducer<UserActionConfig>();

  return (
    <Container noPadding>
      <StyledMainHeadingContainer>
        <StyledMainLeftHeadingContainer>
          <StyledHeadingTypography>
            {messages?.settings?.accountManagement?.heading}
          </StyledHeadingTypography>
        </StyledMainLeftHeadingContainer>
        <Button
          startIcon={<ResponsiveAddIcon />}
          variant="contained"
          color="primary"
          label={messages?.settings?.accountManagement?.button}
          onClick={() => {
            showForm({
              actionConfig: {
                type: UserActionType.CREATE,
              },
            });
          }}
        />
      </StyledMainHeadingContainer>
      <Card
        headerCss={{ display: "flex" }}
        header={
          <Grid container margin="0 16px" xs={12}>
            <Grid item xs={3}>
              <SearchInput
                connectFilter={connectFilter}
                label={messages?.settings?.accountManagement?.search}
              />
            </Grid>
            <Grid
              container
              item
              xs={7}
              justifyContent="end"
              marginLeft="auto"
              gap={2}
            >
              <Grid xs={4.5} item>
                {connectFilter("lastLoginStartDate-lastLoginEndDate", {
                  label: messages?.settings?.accountManagement?.dateRange,
                  autoApplyFilters: true,
                  filterKeys: ["lastLoginStartDate", "lastLoginEndDate"],
                  valueKeys: ["startDate", "endDate"],
                  formatMultipleFilterValue: (value: any) => {
                    const valueArray = Object.values(value);
                    return valueArray.map((obj) =>
                      moment(obj).format("YYYY-MM-DD")
                    );
                  },
                  multipleFilter: true,
                })(MaterialDateRangePicker)}
              </Grid>
              <Grid xs={3} item>
                {connectFilter("status", {
                  label: messages?.settings?.accountManagement?.status,
                  enableClearable: true,
                  options: StatusOptions,
                  autoApplyFilters: true,
                  formatValue: (value?: number | string) =>
                    StatusOptions?.find((opt) => opt?.id === value),
                  formatFilterValue: (value?: Option) =>
                    capitalizeEntireString(value?.id),
                })(MaterialAutocompleteInput)}
              </Grid>
              <Grid xs={3} item>
                {connectFilter("roleId", {
                  label: messages?.settings?.accountManagement?.role,
                  enableClearable: true,
                  options: roleOptions?.map(mapIdNameToOption),
                  autoApplyFilters: true,
                  searchOptions,
                  formatValue: (value?: number | string) =>
                    roleOptions
                      ?.map(mapIdNameToOption)
                      .find((opt) => opt?.id === value),
                  formatFilterValue: (value?: Option) => value?.id,
                })(MaterialAutocompleteInput)}
              </Grid>
            </Grid>
          </Grid>
        }
        cardCss={{
          margin: "0 20px",
          overflow: "visible !important",
          marginBottom: "20px",
        }}
      >
        <Table
          specs={[
            {
              id: "name",
              label: messages?.settings?.accountManagement?.table?.name,
              getValue: (row: AccountManagementEntity) => row,
              format: (row: AccountManagementEntity) =>
                accountManagementEmployeeNameColumn(row),
            },
            {
              id: "role",
              label: messages?.settings?.accountManagement?.table?.role,
              getValue: (row: AccountManagementEntity) => row?.role,
              format: (row) => (row ? capitalizeLegend(row?.name) : "-"),
            },
            {
              id: "status",
              label: messages?.settings?.accountManagement?.table?.status,
              getValue: (row: AccountManagementEntity) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
            {
              id: "lastLogin",
              label:
                messages?.settings?.accountManagement?.table?.lastLoggedInDate,
              getValue: (row: AccountManagementEntity) => row?.lastLogin,
              format: (row) => (row ? dateFormatterFunction(row) : "-"),
            },
          ]}
          data={accountManagementEntity?.records}
          metadata={accountManagementEntity?.metadata}
          actions={[
            {
              id: "passwordChange",
              component: <LockOutlinedIcon />,
              onClick: (row: AccountManagementEntity) => {
                showPasswordForm({
                  id: row?.id,
                });
              },
            },
            {
              id: "edit",
              render(row: AccountManagementEntity) {
                return (
                  <StyledEditIcon
                    active={profile?.id?.toString() !== row?.id?.toString()}
                  />
                );
              },
              onClick: (row: AccountManagementEntity) => {
                profile?.id !== row?.id &&
                  showForm({
                    actionConfig: {
                      type: UserActionType.EDIT,
                    },
                    accountManagementDetails: row,
                  });
              },
            },
            {
              id: "delete",
              render(row: AccountManagementEntity) {
                return (
                  <StyledDeleteIcon active={row?.status === Status.active} />
                );
              },
              onClick: (row: AccountManagementEntity) => {
                row?.status === Status.active &&
                  showDeleteForm({
                    id: row?.id,
                  });
              },
            },
          ]}
          fetchPage={fetchPage}
          updateLimit={updateLimit}
          disableSorting={["status", "sno", "role"]}
          updateFilters={(filterParams: any) => {
            updateFilters(filterParams);
            applyFilters();
          }}
        />
      </Card>
      <Modal
        show={formVisibility}
        heading={
          config?.actionConfig?.type === UserActionType.EDIT
            ? messages?.settings?.accountManagement?.form?.editHeading
            : messages?.settings?.accountManagement?.form?.addHeading
        }
        onClose={hideForm}
        fitContent
      >
        <AddAccountForm
          onCancel={hideForm}
          onSuccess={() => {
            hideForm();
            applyFilters();
          }}
          isUpdate={config?.actionConfig?.type === UserActionType.EDIT}
          accountManagementDetail={
            config?.actionConfig?.type === UserActionType.EDIT &&
            config?.accountManagementDetails
          }
        />
      </Modal>
      <Modal
        show={passwordFormVisibility}
        heading={messages?.settings?.accountManagement?.form?.changePassword}
        onClose={hidePasswordForm}
        fitContent
      >
        <UserPasswordForm
          onCancel={hidePasswordForm}
          onSuccess={() => {
            hidePasswordForm();
            applyFilters();
          }}
          userId={passwordConfig?.id}
        />
      </Modal>
      <Modal
        show={deleteFormVisibility}
        heading={messages?.settings?.accountManagement?.form?.delete}
        onClose={hideDeleteForm}
        fitContent
      >
        <DeleteCTAForm
          onCancel={() => {
            hideDeleteForm();
            applyFilters();
          }}
          onSuccess={() => {
            hideDeleteForm();
            toast(
              <Toast
                text={
                  messages?.settings?.accountManagement?.form?.success?.deleted
                }
              />
            );
            applyFilters();
          }}
          api={`${ACCOUNT_MANAGEMENT_API}/${deleteConfig?.id}`}
          bodyText={messages?.settings?.accountManagement?.form?.note}
          cancelButton={messages?.settings?.accountManagement?.form?.cancel}
          confirmButton={
            messages?.settings?.accountManagement?.form?.deleteButton
          }
          apiMethod={HttpMethods.DELETE}
        />
      </Modal>
    </Container>
  );
};

export default AccountManagement;
