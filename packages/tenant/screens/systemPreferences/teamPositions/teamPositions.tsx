import React from "react";
import { Container } from "../../../components";
import {
  useOptions,
  usePagination,
  usePopupReducer,
} from "@wizehub/common/hooks";
import {
  Division,
  TeamPositionEntity,
} from "@wizehub/common/models/genericEntities";
import {
  MetaData,
  Option,
  PaginatedEntity,
  getDefaultMetaData,
} from "@wizehub/common/models";
import { TEAM_POSITION_ACTION } from "../../../redux/actions";
import {
  DIVISION_LISTING_API,
  TEAM_POSITION_BY_ID,
  TEAM_POSITION_LISTING_API,
} from "../../../api";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import {
  StyledHeadingTypography,
  StyledMainHeadingContainer,
  StyledMainLeftHeadingContainer,
} from "@wizehub/components/detailPageWrapper/styles";
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
  capitalizeEntireString,
  mapIdNameToOptionWithoutCaptializing,
} from "@wizehub/common/utils";
import { formatStatus } from "@wizehub/components/table";
import { StyledVisibilityIcon } from "@wizehub/components/table/styles";
import { push } from "connected-react-router";
import { routes } from "../../../utils";
import { useDispatch } from "react-redux";
import { PositionOptions } from "../../../utils/constant";
import TeamPositionForm from "./teamPositionForm";
import { toast } from "react-toastify";
import { Right } from "../../../redux/reducers/auth";

const paginatedTeamPosition: PaginatedEntity = {
  key: "teamPosition",
  name: TEAM_POSITION_ACTION,
  api: TEAM_POSITION_LISTING_API,
};

const getDefaultTeamPositionFilter = (): MetaData<TeamPositionEntity> => ({
  ...getDefaultMetaData<TeamPositionEntity>(),
  order: "name",
});

const TeamPositions = () => {
  const { tenantData, auth } = useSelector((state: ReduxState) => state);
  const { tenantId } = tenantData;
  const disabledItems = auth?.rights?.some(
    (item) => item === Right.TENANT_TEAM_POSITION_MANAGEMENT_READ_ONLY
  );
  const reduxDispatch = useDispatch();

  const {
    visibility: formVisibility,
    showPopup: showForm,
    hidePopup: hideForm,
  } = usePopupReducer<TeamPositionEntity>();
  const {
    entity: teamPosition,
    updateFilters,
    applyFilters,
    connectFilter,
    fetchPage,
    updateLimit,
  } = usePagination<TeamPositionEntity>(
    {
      ...paginatedTeamPosition,
      api: TEAM_POSITION_LISTING_API.replace(":tenantId", tenantId),
    },
    getDefaultTeamPositionFilter()
  );
  const { options: divisionOptions, searchOptions: divisionSearchOptions } =
    useOptions<Division>(DIVISION_LISTING_API);
  return (
    <Container noPadding>
      <StyledMainHeadingContainer>
        <StyledMainLeftHeadingContainer>
          <StyledHeadingTypography>
            {messages?.settings?.systemPreferences?.teamPositions?.heading}
          </StyledHeadingTypography>
        </StyledMainLeftHeadingContainer>
        {!disabledItems && (
          <Button
            startIcon={<ResponsiveAddIcon />}
            variant="contained"
            color="primary"
            label={messages?.settings?.systemPreferences?.teamPositions?.button}
            onClick={() => {
              showForm();
            }}
          />
        )}
      </StyledMainHeadingContainer>
      <Card
        headerCss={{ display: "flex" }}
        header={
          <Grid container margin="0 16px" xs={12}>
            <Grid item xs={3}>
              <SearchInput
                connectFilter={connectFilter}
                label={
                  messages?.settings?.systemPreferences?.teamPositions?.search
                }
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
                {connectFilter("divisionId", {
                  label:
                    messages?.settings?.systemPreferences?.teamPositions
                      ?.division,
                  enableClearable: true,
                  options: divisionOptions?.map(
                    mapIdNameToOptionWithoutCaptializing
                  ),
                  autoApplyFilters: true,
                  searchOptions: divisionSearchOptions,
                  formatValue: (value?: number | string) =>
                    divisionOptions
                      ?.map(mapIdNameToOptionWithoutCaptializing)
                      ?.find((opt) => opt?.id === value),
                  formatFilterValue: (value?: Option) =>
                    capitalizeEntireString(value?.id),
                })(MaterialAutocompleteInput)}
              </Grid>
              <Grid xs={3} item>
                {connectFilter("status", {
                  label:
                    messages?.settings?.systemPreferences?.teamPositions
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
                messages?.settings?.systemPreferences?.teamPositions?.table
                  ?.name,
            },
            {
              id: "positionLevel",
              label:
                messages?.settings?.systemPreferences?.teamPositions?.table
                  ?.positionLevel,
              getValue: (row: TeamPositionEntity) =>
                PositionOptions?.find((item) => item?.id === row?.positionLevel)
                  ?.label,
            },
            {
              id: "division",
              label:
                messages?.settings?.systemPreferences?.teamPositions?.table
                  ?.division,
              getValue: (row: TeamPositionEntity) =>
                row?.divisions?.map((item) => `${item.name}`).join(", "),
            },
            {
              id: "status",
              label:
                messages?.settings?.systemPreferences?.teamPositions?.table
                  ?.status,
              getValue: (row: TeamPositionEntity) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
          ]}
          data={teamPosition?.records}
          metadata={teamPosition?.metadata}
          actions={[
            {
              id: "view",
              component: <StyledVisibilityIcon />,
              onClick: (row: TeamPositionEntity) => {
                reduxDispatch(
                  push(
                    routes.teamPositions.teamPositionDetail.replace(
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
          disableSorting={["status", "division"]}
          updateFilters={(filterParams: any) => {
            updateFilters(filterParams);
            applyFilters();
          }}
        />
      </Card>
      <Modal
        show={formVisibility}
        heading={
          messages?.settings?.systemPreferences?.teamPositions?.form?.addHeading
        }
        onClose={hideForm}
        fitContent
      >
        <TeamPositionForm
          onCancel={hideForm}
          onSuccess={() => {
            hideForm();
            toast(
              <Toast
                text={
                  messages?.settings?.systemPreferences?.teamPositions?.form
                    ?.success?.created
                }
              />
            );
            applyFilters();
          }}
          endpoint={TEAM_POSITION_BY_ID}
        />
      </Modal>
    </Container>
  );
};

export default TeamPositions;
