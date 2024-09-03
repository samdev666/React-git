import React from "react";
import { Container } from "../../../components";
import {
  StyledHeadingTypography,
  StyledMainHeadingButtonContainer,
  StyledMainHeadingContainer,
  StyledMainLeftHeadingContainer,
} from "@wizehub/components/detailPageWrapper/styles";
import messages from "../../../messages";
import {
  Button,
  Card,
  MaterialAutocompleteInput,
  SearchInput,
  Table,
} from "@wizehub/components";
import { ResponsiveAddIcon } from "../../systemPreferences/launchPadSetup/launchPadSetup";
import { Grid } from "@mui/material";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import { useOptions, usePagination } from "@wizehub/common/hooks";
import {
  PersonBasicDetailEntity,
  TeamPositionEntity,
} from "@wizehub/common/models/genericEntities";
import {
  MetaData,
  Option,
  PaginatedEntity,
  getDefaultMetaData,
} from "@wizehub/common/models";
import { PEOPLE_LISTING_API, TEAM_POSITION_LISTING_API } from "../../../api";
import { PEOPLE_ACTION } from "../../../redux/actions";
import { Status, StatusOptions } from "@wizehub/common/models/modules";
import { formatStatus } from "@wizehub/components/table";
import {
  capitalizeEntireString,
  mapIdNameToOptionWithoutCaptializing,
} from "@wizehub/common/utils";
import { StyledVisibilityIcon } from "@wizehub/components/table/styles";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { routes } from "../../../utils";
import { Id } from "react-toastify";
import { StyledPeopleEmailcolumn, StyledPeopleNamecolumn } from "../styles";

const paginatedPeople: PaginatedEntity = {
  key: "people",
  name: PEOPLE_ACTION,
  api: PEOPLE_LISTING_API,
};

const getDefaultPeopleFilter = (): MetaData<PersonBasicDetailEntity> => ({
  ...getDefaultMetaData<PersonBasicDetailEntity>(),
  order: "name",
});

const peopleNameColumn = (row: PersonBasicDetailEntity) => {
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

const People = () => {
  const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
  const reduxDispatch = useDispatch();
  const {
    entity: peopleEntity,
    updateFilters,
    applyFilters,
    connectFilter,
    fetchPage,
    updateLimit,
  } = usePagination<PersonBasicDetailEntity>(
    {
      ...paginatedPeople,
      api: PEOPLE_LISTING_API.replace(":tenantId", tenantId),
    },
    getDefaultPeopleFilter()
  );

  const { options: roleOptions, searchOptions } =
    useOptions<TeamPositionEntity>(
      `${TEAM_POSITION_LISTING_API.replace(":tenantId", tenantId)}`,
      true
    );

  return (
    <Container noPadding>
      <StyledMainHeadingContainer>
        <StyledMainLeftHeadingContainer>
          <StyledHeadingTypography>
            {messages?.firmProfile?.people?.heading}
          </StyledHeadingTypography>
        </StyledMainLeftHeadingContainer>
        <StyledMainHeadingButtonContainer>
          <Button
            startIcon={<ResponsiveAddIcon />}
            variant="contained"
            color="primary"
            label={messages?.firmProfile?.people?.addPeople}
            onClick={() => {
              reduxDispatch(push(routes.firmProfile.peopleForm));
            }}
          />
        </StyledMainHeadingButtonContainer>
      </StyledMainHeadingContainer>
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
                {connectFilter("roleId", {
                  label: messages?.firmProfile?.people?.role,
                  enableClearable: true,
                  options: roleOptions?.map(
                    mapIdNameToOptionWithoutCaptializing
                  ),
                  autoApplyFilters: true,
                  searchOptions: searchOptions,
                  formatValue: (value?: number | string) =>
                    roleOptions
                      ?.map(mapIdNameToOptionWithoutCaptializing)
                      ?.find((opt) => opt?.id === value),
                  formatFilterValue: (value?: Option) => value?.id,
                })(MaterialAutocompleteInput)}
              </Grid>
              <Grid xs={3} item>
                {connectFilter("status", {
                  label: messages?.firmProfile?.people?.status,
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
              label: messages?.firmProfile?.people?.table?.name,
              getValue: (row: PersonBasicDetailEntity) => row,
              format: (row: PersonBasicDetailEntity) => peopleNameColumn(row),
            },
            {
              id: "role",
              label: messages?.firmProfile?.people?.table?.role,
              getValue: (row: PersonBasicDetailEntity) => row?.role,
              format: (row: { id: Id; name: string }) =>
                row?.name ? row.name : "-",
            },
            {
              id: "phoneNumber",
              label: messages?.firmProfile?.people?.table?.phoneNumber,
              getValue: (row: PersonBasicDetailEntity) => row,
              format: (row: PersonBasicDetailEntity) =>
                row?.dialCode && row?.phoneNumber
                  ? `+${row?.dialCode} ${row?.phoneNumber}`
                  : "-",
            },
            {
              id: "status",
              label: messages?.firmProfile?.people?.table?.status,
              getValue: (row: PersonBasicDetailEntity) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
          ]}
          data={peopleEntity?.records}
          metadata={peopleEntity?.metadata}
          actions={[
            {
              id: "view",
              component: <StyledVisibilityIcon />,
              onClick: (row: PersonBasicDetailEntity) => {
                reduxDispatch(
                  push(
                    routes.firmProfile.peopleDetail.replace(
                      ":id",
                      row?.id?.toString()
                    )
                  )
                );
              },
            },
          ]}
          fetchPage={fetchPage}
          updateLimit={updateLimit}
          disableSorting={["status", "role", "phoneNumber"]}
          updateFilters={(filterParams: any) => {
            updateFilters(filterParams);
            applyFilters();
          }}
        />
      </Card>
    </Container>
  );
};

export default People;
