import React from 'react';
import {
  Card,
  Table,
  Modal,
  Stepper,
  Button,
  SearchInput,
  MaterialAutocompleteInput,
} from '@wizehub/components';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import { useOptions, usePagination, usePopupReducer } from '@wizehub/common/hooks';
import {
  MetaData,
  getDefaultMetaData,
  PaginatedEntity,
  Option,
  UserActionConfig,
  UserActionType,
} from '@wizehub/common/models';
import { Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { formatStatus } from '@wizehub/components/table';
import {
  StyledResponsiveIcon,
  StyledVisibilityIcon,
} from '@wizehub/components/table/styles';
import {
  Division, ProjectManagementEntity, Stage,
} from '@wizehub/common/models/genericEntities';
import { Status, StatusOptions } from '@wizehub/common/models/modules';
import {
  capitalizeEntireString, capitalizeLegend, mapIdNameToOptionWithTitleWithoutCaptializing, mapIdNameToOptionWithoutCaptializing,
} from '@wizehub/common/utils';
import { StyledHeadingTypography } from '../../userManagement/styles';
import {
  StyledProjectManagementHeadingContainer,
  StyledProjectManagementLeftHeadingContainer,
} from '../styles';
import { DIVISION_LISTING_API, PROJECT_MANAGEMENT_LISTING_API, PROJECT_STAGES } from '../../../api';
import { PROJECT_MANAGEMENT_LISTING_ACTION } from '../../../redux/actions';
import { routes } from '../../../utils';
import messages from '../../../messages';
import { Container } from '../../../components';
import { ReduxState } from '../../../redux/reducers';
import { Right } from '../../../redux/reducers/auth';
import ProjectForm from './projectForm';

const paginatedProductManagement: PaginatedEntity = {
  key: 'projectManagement',
  name: PROJECT_MANAGEMENT_LISTING_ACTION,
  api: PROJECT_MANAGEMENT_LISTING_API,
};

export const ResponsiveAddIcon = StyledResponsiveIcon(AddIcon);

const getDefaultProjectManagementFilter = (): MetaData<ProjectManagementEntity> => ({
  ...getDefaultMetaData<ProjectManagementEntity>(),
});

export const getDefaultStageOptionFilter = (): MetaData<Stage> => ({
  ...getDefaultMetaData<Stage>(),
  order: 'title',
});

const ProjectManagement = () => {
  const reduxDispatch = useDispatch();
  const auth = useSelector((state: ReduxState) => state.auth);
  const {
    entity: projectManagementData,
    applyFilters,
    connectFilter,
    fetchPage,
    updateLimit,
    updateFilters,
  } = usePagination<ProjectManagementEntity>(
    paginatedProductManagement,
    getDefaultProjectManagementFilter(),
  );

  const { options: divisionOptions, searchOptions: searchDivisionOptions } = useOptions<Division>(DIVISION_LISTING_API);

  const { options: stagesOptions, searchOptions: searchStageOptions } = useOptions<Stage>(PROJECT_STAGES, true, getDefaultStageOptionFilter());

  const {
    visibility: formVisibility,
    showPopup: showForm,
    hidePopup: hideForm,
  } = usePopupReducer<UserActionConfig>();

  const disabledItems = auth.rights.some((item) => item === Right.PROJECTS);

  return (
    <Container noPadding>
      <StyledProjectManagementHeadingContainer>
        <StyledProjectManagementLeftHeadingContainer>
          <Stepper />
          <StyledHeadingTypography>
            {messages.projectManagement.heading}
          </StyledHeadingTypography>
        </StyledProjectManagementLeftHeadingContainer>
        {
          disabledItems && (
          <Button
            startIcon={<ResponsiveAddIcon />}
            variant="contained"
            color="primary"
            label={messages.projectManagement.buttonText}
            onClick={() => showForm({
              type: UserActionType.CREATE,
            })}
          />
          )
        }
      </StyledProjectManagementHeadingContainer>
      <Card
        headerCss={{ display: 'flex' }}
        header={(
          <Grid container margin="0 16px" xs={12}>
            <Grid item xs={3}>
              <SearchInput
                connectFilter={connectFilter}
                label={messages.productManagement.search}
              />
            </Grid>
            <Grid container item xs={7} justifyContent="end" marginLeft="auto">
              <Grid xs={3} item marginRight="16px">
                {connectFilter('stageId', {
                  label: messages?.projectManagement?.stage,
                  enableClearable: true,
                  options: stagesOptions?.map(mapIdNameToOptionWithTitleWithoutCaptializing),
                  autoApplyFilters: true,
                  formatValue: (value?: number | string) => stagesOptions?.map(mapIdNameToOptionWithTitleWithoutCaptializing)?.find((opt) => opt?.id === value),
                  formatFilterValue: (value?: Option) => value?.id,
                  searchOptions: searchStageOptions,
                })(MaterialAutocompleteInput)}
              </Grid>
              <Grid xs={3} item marginRight="16px">
                {connectFilter('divisionId', {
                  label: messages?.projectManagement?.division,
                  enableClearable: true,
                  options: divisionOptions?.map(mapIdNameToOptionWithoutCaptializing),
                  autoApplyFilters: true,
                  formatValue: (value?: number | string) => divisionOptions?.map(mapIdNameToOptionWithoutCaptializing)?.find((opt) => opt?.id === value),
                  formatFilterValue: (value?: Option) => capitalizeEntireString(value?.id),
                  searchOptions: searchDivisionOptions,
                })(MaterialAutocompleteInput)}
              </Grid>
              <Grid xs={3} item>
                {connectFilter('status', {
                  label: messages?.projectManagement?.status,
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
              label: messages?.projectManagement?.table?.serialNo,
            },
            {
              id: 'title',
              label: messages?.projectManagement?.table?.title,
            },
            {
              id: 'stage',
              label:
                messages?.projectManagement?.table?.stage,
              getValue: (row: ProjectManagementEntity) => capitalizeLegend(row?.stage?.name),
            },
            {
              id: 'division',
              label:
                  messages?.projectManagement?.table?.division,
              getValue: (row: ProjectManagementEntity) => row?.division?.name,
            },
            {
              id: 'status',
              label: messages?.projectManagement?.table?.status,
              getValue: (row: ProjectManagementEntity) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
          ]}
          disableSorting={['status', 'sno', 'stage', 'division']}
          updateFilters={(filterParams: any) => {
            updateFilters(filterParams);
            applyFilters();
          }}
          data={projectManagementData?.records}
          metadata={projectManagementData?.metadata}
          actions={[
            {
              id: 'view',
              component: <StyledVisibilityIcon />,
              onClick: (row: ProjectManagementEntity) => {
                reduxDispatch(
                  push(
                    routes.masterData.projectDetails.replace(
                      ':id',
                      row?.id?.toString(),
                    ),
                  ),
                );
              },
            },
          ]}
          fetchPage={fetchPage}
          updateLimit={updateLimit}
        />
      </Card>

      <Modal
        show={formVisibility}
        heading={
            messages?.projectManagement?.form?.addProject
        }
        onClose={hideForm}
        fitContent
      >
        <ProjectForm
          onCancel={hideForm}
          onSuccess={() => {
            hideForm();
            applyFilters();
          }}
        />
      </Modal>
    </Container>
  );
};

export default ProjectManagement;
