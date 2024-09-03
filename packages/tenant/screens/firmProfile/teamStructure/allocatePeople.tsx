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
import {
  DivisionEmployeesEntity,
  TeamEmployeesEntity,
} from "@wizehub/common/models/genericEntities";
import {
  Id,
  MetaData,
  Option,
  PagedEntity,
  UserActionConfig,
} from "@wizehub/common/models";
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
import { divisionEmployeeNameColumn } from "./commonScreen";
import { formatStatus } from "@wizehub/components/table";
import { StyledRemoveIcon } from "@wizehub/components/table/styles";
import { usePopupReducer } from "@wizehub/common/hooks";
import DeleteCTAForm from "../../systemPreferences/launchPadSetup/deleteCTAForm";
import { toast } from "react-toastify";
import { TEAM_EMPLOYEE_API } from "../../../api";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";

interface Props {
  teamEmployeeEntity: PagedEntity<TeamEmployeesEntity>;
  teamEmployeeUpdateFilter: (
    filter: Partial<MetaData<TeamEmployeesEntity>>
  ) => void;
  teamEmployeeApplyFilter: (loadMore?: boolean) => void;
  teamEmployeeConnectFilter: (
    name: string,
    extraProps?: Record<any, any>
  ) => (Filter: any) => any;
  teamEmployeeFetchPage: (page?: number) => void;
  teamEmployeeUpdateLimit: (limit?: number) => void;
  activeTeam: Id;
}

const AllocatePeople: React.FC<Props> = ({
  teamEmployeeApplyFilter,
  teamEmployeeConnectFilter,
  teamEmployeeEntity,
  teamEmployeeFetchPage,
  teamEmployeeUpdateFilter,
  teamEmployeeUpdateLimit,
  activeTeam,
}) => {
  const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);

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
        cardCss={{
          margin: "10px 0px 0px 20px",
          overflow: "visible !important",
          width: "100%",
          marginBottom: "20px",
        }}
        header={
          <Grid container margin="0 16px" xs={12}>
            <Grid item xs={3}>
              <SearchInput
                connectFilter={teamEmployeeConnectFilter}
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
                {teamEmployeeConnectFilter("status", {
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
                {teamEmployeeConnectFilter("type", {
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
          data={teamEmployeeEntity?.records}
          metadata={teamEmployeeEntity?.metadata}
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
          fetchPage={teamEmployeeFetchPage}
          updateLimit={teamEmployeeUpdateLimit}
          disableSorting={["status", "sno", "type", "role"]}
          updateFilters={(filterParams: any) => {
            teamEmployeeUpdateFilter(filterParams);
            teamEmployeeApplyFilter();
          }}
        />
      </Card>
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
            teamEmployeeApplyFilter();
          }}
          api={TEAM_EMPLOYEE_API}
          bodyText={messages?.firmProfile?.teamStructure?.form?.note}
          cancelButton={messages?.firmProfile?.teamStructure?.form?.cancel}
          confirmButton={messages?.firmProfile?.teamStructure?.form?.remove}
          apiMethod={HttpMethods.DELETE}
          deleteBody={{
            tenantId: tenantId,
            teamId: activeTeam,
            employeeId: deleteConfig?.id,
          }}
        />
      </Modal>
    </>
  );
};

export default AllocatePeople;
