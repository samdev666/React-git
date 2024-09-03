import { Grid } from "@mui/material";
import {
  Id,
  MetaData,
  Option,
  PaginatedEntity,
  UserActionConfig,
  getDefaultMetaData,
} from "@wizehub/common/models";
import {
  Card,
  MaterialAutocompleteInput,
  Modal,
  SearchInput,
  Table,
  Toast,
} from "@wizehub/components";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import { usePagination, usePopupReducer } from "@wizehub/common/hooks";
import { DivisionEmployeesEntity } from "@wizehub/common/models/genericEntities";
import { DIVISION_EMPLOYEE_ACTION } from "../../../redux/actions";
import {
  ADD_TEAM_MEMBER_API,
  DIVISION_EMPLOYEE_LISTING_API,
} from "../../../api";
import messages from "../../../messages";
import {
  PersonTypeAutocompleteOptions,
  Status,
  StatusOptions,
} from "@wizehub/common/models/modules";
import {
  HttpMethods,
  capitalizeEntireString,
  capitalizeLegend,
} from "@wizehub/common/utils";
import { formatStatus } from "@wizehub/components/table";
import { StyledRemoveIcon } from "@wizehub/components/table/styles";
import AddTeamMemberForm from "./addTeamMemberForm";
import { StyledPeopleEmailcolumn, StyledPeopleNamecolumn } from "../styles";
import moment from "moment";
import DeleteCTAForm from "../../systemPreferences/launchPadSetup/deleteCTAForm";
import { toast } from "react-toastify";

interface Props {
  divisionId: Id;
  createFormVisibility: boolean;
  hideCreateForm: () => void;
}

const paginatedDivisionEmployee: PaginatedEntity = {
  key: "divisionEmployee",
  name: DIVISION_EMPLOYEE_ACTION,
  api: DIVISION_EMPLOYEE_LISTING_API,
};

const getDefaultDivisionEmployeeFilter =
  (): MetaData<DivisionEmployeesEntity> => ({
    ...getDefaultMetaData<DivisionEmployeesEntity>(),
    order: "name",
  });

export const divisionEmployeeNameColumn = (row: DivisionEmployeesEntity) => {
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

const calculateAge = (dateOfBirth: string) => {
  const dob = moment(dateOfBirth);
  const now = moment();
  const age = now.diff(dob, "years");

  return age.toString();
};

const CommonScreen: React.FC<Props> = ({
  divisionId,
  createFormVisibility,
  hideCreateForm,
}) => {
  const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
  const {
    entity: divisionEmployeeEntity,
    updateFilters,
    applyFilters,
    connectFilter,
    fetchPage,
    resetFilters,
    updateLimit,
  } = usePagination<DivisionEmployeesEntity>(
    {
      ...paginatedDivisionEmployee,
      api: DIVISION_EMPLOYEE_LISTING_API.replace(":tenantId", tenantId).replace(
        ":divisionId",
        divisionId?.toString()
      ),
    },
    getDefaultDivisionEmployeeFilter()
  );

  useEffect(() => {
    if (divisionId) {
      resetFilters();
    }
  }, [divisionId]);

  const {
    visibility: deleteFormVisibility,
    showPopup: showDeleteForm,
    hidePopup: hideDeleteForm,
    metaData: deleteConfig,
  } = usePopupReducer<UserActionConfig>();

  return (
    <>
      <Card
        headerCss={{ display: "flex" }}
        header={
          <Grid container margin="0 16px" xs={12}>
            <Grid item xs={3}>
              <SearchInput
                connectFilter={connectFilter}
                label={messages?.firmProfile?.people?.search}
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
              <Grid xs={3} item>
                {connectFilter("status", {
                  label: messages?.firmProfile?.teamStructure?.status,
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
                {connectFilter("type", {
                  label: messages?.firmProfile?.teamStructure?.type,
                  enableClearable: true,
                  options: PersonTypeAutocompleteOptions,
                  autoApplyFilters: true,
                  formatValue: (value?: number | string) =>
                    PersonTypeAutocompleteOptions?.find(
                      (opt) => opt?.id === value
                    ),
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
              label: messages?.firmProfile?.teamStructure?.form?.table?.name,
              getValue: (row: DivisionEmployeesEntity) => row,
              format: (row: DivisionEmployeesEntity) =>
                row ? divisionEmployeeNameColumn(row) : "-",
            },
            {
              id: "dateOfBirth",
              label: messages?.firmProfile?.teamStructure?.form?.table?.age,
              getValue: (row: DivisionEmployeesEntity) => row,
              format: (row: DivisionEmployeesEntity) =>
                row?.dateOfBirth ? calculateAge(row?.dateOfBirth) : "-",
            },
            {
              id: "role",
              label: messages?.firmProfile?.teamStructure?.form?.table?.role,
              getValue: (row: DivisionEmployeesEntity) => row,
              format: (row: DivisionEmployeesEntity) =>
                row?.role?.name ? row?.role?.name : "-",
            },
            {
              id: "type",
              label: messages?.firmProfile?.teamStructure?.form?.table?.type,
              getValue: (row: DivisionEmployeesEntity) => row,
              format: (row: DivisionEmployeesEntity) =>
                row?.type ? capitalizeLegend(row?.type) : "-",
            },
            {
              id: "status",
              label: messages?.firmProfile?.teamStructure?.form?.table?.status,
              getValue: (row: DivisionEmployeesEntity) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
          ]}
          data={divisionEmployeeEntity?.records}
          metadata={divisionEmployeeEntity?.metadata}
          actions={[
            {
              id: "delete",
              render(row: DivisionEmployeesEntity) {
                return <StyledRemoveIcon active={true} />;
              },
              onClick: (row: DivisionEmployeesEntity) => {
                showDeleteForm({
                  id: row?.id,
                });
              },
            },
          ]}
          fetchPage={fetchPage}
          updateLimit={updateLimit}
          disableSorting={["status", "role", "type", "dateOfBirth"]}
          updateFilters={(filterParams: any) => {
            updateFilters(filterParams);
            applyFilters();
          }}
        />
      </Card>

      <Modal
        show={createFormVisibility}
        heading={messages?.firmProfile?.teamStructure?.addTeamMember}
        onClose={hideCreateForm}
        fitContent
      >
        <AddTeamMemberForm
          onCancel={hideCreateForm}
          onSuccess={() => {
            hideCreateForm();
            applyFilters();
          }}
        />
      </Modal>
      <Modal
        show={deleteFormVisibility}
        heading={messages?.firmProfile?.teamStructure?.form?.removeHeading}
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
                  messages?.firmProfile?.teamStructure?.form?.success?.deleted
                }
              />
            );
            applyFilters();
          }}
          api={ADD_TEAM_MEMBER_API}
          bodyText={messages?.firmProfile?.teamStructure?.form?.note}
          cancelButton={messages?.firmProfile?.teamStructure?.form?.cancel}
          confirmButton={messages?.firmProfile?.teamStructure?.form?.remove}
          apiMethod={HttpMethods.DELETE}
          deleteBody={{
            tenantId: tenantId,
            divisionId: divisionId,
            employeeId: deleteConfig?.id,
          }}
        />
      </Modal>
    </>
  );
};

export default CommonScreen;
