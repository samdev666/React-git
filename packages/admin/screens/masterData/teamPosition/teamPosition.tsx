import React from 'react';
import {
  Button,
  Card,
  MaterialAutocompleteInput,
  Modal,
  SearchInput,
  Stepper,
  Table,
  Toast,
} from '@wizehub/components';
import { Grid } from '@mui/material';
import { useOptions, usePagination, usePopupReducer } from '@wizehub/common/hooks';
import {
  MetaData, Option, PaginatedEntity, getDefaultMetaData,
} from '@wizehub/common/models';
import { StyledVisibilityIcon } from '@wizehub/components/table/styles';
import { push } from 'connected-react-router';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { capitalizeEntireString, mapIdNameToOption, mapIdNameToOptionWithoutCaptializing } from '@wizehub/common/utils';
import { Division, TeamPositionEntity } from '@wizehub/common/models/genericEntities';
import { formatStatus } from '@wizehub/components/table';
import { Status } from '@wizehub/common/models/modules';
import { routes } from '../../../utils';
import { DIVISION_LISTING_API, TEAM_POSITION, TEAM_POSITION_LISTING_API } from '../../../api';
import { TEAMPOSITIONLISTING } from '../../../redux/actions';
import messages from '../../../messages';
import {
  StyledMasterDataHeadingContainer,
  StyledMasterDataLeftHeadingContainer,
} from '../styles';
import { Container } from '../../../components';
import TeamPositionForm from './teamPositionForm';
import { PositionOptions, StatusOptions } from '../../../utils/constant';
import { StyledHeadingTypography } from '../../userManagement/styles';
import { ResponsiveAddIcon } from '../../productManagement/productManagement';

interface Props { }

const paginatedTeamPosition: PaginatedEntity = {
  key: 'teamPosition',
  name: TEAMPOSITIONLISTING,
  api: TEAM_POSITION_LISTING_API,
};

const getDefaultTeamPositionFilter = (): MetaData<TeamPositionEntity> => ({
  ...getDefaultMetaData<TeamPositionEntity>(),
  order: 'name',
});

const TeamPosition: React.FC<Props> = () => {
  const {
    entity: teamPosition,
    updateFilters,
    applyFilters,
    connectFilter,
    fetchPage,
    updateLimit,
  } = usePagination<TeamPositionEntity>(
    paginatedTeamPosition,
    getDefaultTeamPositionFilter(),
  );

  const {
    visibility: formVisibility,
    showPopup: showForm,
    hidePopup: hideForm,
    metaData: config,
  } = usePopupReducer<TeamPositionEntity>();

  const reduxDispatch = useDispatch();

  const { options: divisionOptions, searchOptions: searchDivisionOptions } = useOptions<Division>(DIVISION_LISTING_API);

  return (
    <Container noPadding>
      <StyledMasterDataHeadingContainer>
        <StyledMasterDataLeftHeadingContainer>
          <Stepper />
          <StyledHeadingTypography>
            {messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
              .subItems.teamPosition.heading}
          </StyledHeadingTypography>
        </StyledMasterDataLeftHeadingContainer>
        <Button
          startIcon={<ResponsiveAddIcon />}
          variant="contained"
          color="primary"
          label={messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
            .subItems.teamPosition.positionButtonText}
          onClick={showForm}
        />
      </StyledMasterDataHeadingContainer>

      <Card
        header={(
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid item width="320px" marginLeft="16px">
              <SearchInput
                connectFilter={connectFilter}
                label={messages.sidebar.menuItems.secondaryMenu.subMenuItems
                  .leadDataManagement.search}
              />
            </Grid>
            <Grid item display="flex" marginRight="16px" alignItems="center">
              <Grid item width="140px" marginRight="16px">
                {connectFilter('divisionId', {
                  label: messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
                    .subItems.teamPosition.division,
                  enableClearable: true,
                  options: divisionOptions?.map(mapIdNameToOptionWithoutCaptializing),
                  autoApplyFilters: true,
                  searchOptions: searchDivisionOptions,
                  formatValue: (value?: number | string) => divisionOptions?.map(mapIdNameToOption)?.find((opt) => opt?.id === value),
                  formatFilterValue: (value?: Option) => capitalizeEntireString(value?.id),
                })(MaterialAutocompleteInput)}
              </Grid>
              <Grid item width="140px">
                {connectFilter('status', {
                  label: messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
                    .subItems.teamPosition.status,
                  enableClearable: true,
                  options: StatusOptions,
                  autoApplyFilters: true,
                  formatValue: (value?: number | string) => StatusOptions?.find((opt) => opt?.id === value),
                  formatFilterValue: (value?: Option) => capitalizeEntireString(value?.id),
                })(MaterialAutocompleteInput)}
              </Grid>
            </Grid>
          </Grid>
                  )}
        cardCss={{ margin: '0 20px', overflow: 'visible !important' }}
      >
        <Table
          specs={[
            {
              id: 'sno',
              label: 'S.No',
            },
            {
              id: 'name',
              label: 'Name',
            },
            {
              id: 'positionLevel',
              label: 'Position Level',
              getValue: (row: TeamPositionEntity) => PositionOptions?.find(
                (item) => item?.id === row?.positionLevel,
              )?.label,
            },
            {
              id: 'division',
              label: 'Division',
              getValue: (row: TeamPositionEntity) => row?.divisions?.map((item) => `${item.name}`).join(', '),
            },
            {
              id: 'status',
              label: 'Status',
              getValue: (row: TeamPositionEntity) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
          ]}
          data={teamPosition.records}
          metadata={teamPosition.metadata}
          actions={[
            {
              id: 'view',
              component: <StyledVisibilityIcon />,
              onClick: (row: TeamPositionEntity) => {
                reduxDispatch(
                  push(routes.masterData.teamPositionDetails.replace(':id', row?.id?.toString())),
                );
              },
            },
          ]}
          fetchPage={fetchPage}
          updateLimit={updateLimit}
          disableSorting={[
            'sno',
            'division',
            'status',
          ]}
          updateFilters={(filterParams: any) => {
            updateFilters(filterParams);
            applyFilters();
          }}
        />
      </Card>

      <Modal
        show={formVisibility}
        heading={messages.sidebar.menuItems.secondaryMenu.subMenuItems
          .masterData.subItems.teamPosition.form.addPosition}
        onClose={hideForm}
        fitContent
      >
        <TeamPositionForm
          onCancel={hideForm}
          onSuccess={() => {
            hideForm();
            toast(<Toast
              text={
                                  messages.sidebar.menuItems.secondaryMenu.subMenuItems
                                    .masterData.subItems.teamPosition.form.success?.created
                              }
            />);
            applyFilters();
          }}
          endpoint={TEAM_POSITION}
          positionData={config}
        />
      </Modal>
    </Container>
  );
};

export default TeamPosition;
