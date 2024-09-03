import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  MaterialAutocompleteInput,
  Modal,
  SearchInput,
  Stepper,
  Table,
} from '@wizehub/components';
import { Checkbox, FormControlLabel, Grid } from '@mui/material';
import { usePagination, usePopupReducer } from '@wizehub/common/hooks';
import {
  MetaData, Option, PaginatedEntity, getDefaultMetaData,
} from '@wizehub/common/models';
import { StyledVisibilityIcon } from '@wizehub/components/table/styles';
import { push } from 'connected-react-router';
import { useDispatch } from 'react-redux';
import { capitalizeEntireString, capitalizeLegend } from '@wizehub/common/utils';
import { formatStatus } from '@wizehub/components/table';
import { LaunchPadType, Status } from '@wizehub/common/models/modules';
import { ApplicationDetailEntity, ApplicationEntity } from '@wizehub/common/models/genericEntities';
import { Container } from '../../../components';
import {
  StyledApplciationProfileContainer,
  StyledApplicationChip,
  StyledApplicationChipLabel,
  StyledApplicationProfileAvatar,
  StyledApplicationTypographyText,
  StyledAvatarText,
  StyledMasterDataHeadingContainer,
  StyledMasterDataLeftHeadingContainer,
} from '../styles';
import messages from '../../../messages';
import { APPLICATIONLISTING } from '../../../redux/actions';
import { APPLICATION, APPLICATION_LISTING_API } from '../../../api';
import { routes } from '../../../utils';
import ApplicationForm from './applicationForm';
import { StatusOptions } from '../../../utils/constant';
import { StyledHeadingTypography } from '../../userManagement/styles';
import { config } from '../../../config';
import { ResponsiveAddIcon } from '../../productManagement/productManagement';

interface Props { }

const paginatedApplciation: PaginatedEntity = {
  key: 'application',
  name: APPLICATIONLISTING,
  api: APPLICATION_LISTING_API,
};

const getDefaultApplicationFilter = (): MetaData<ApplicationEntity> => ({
  ...getDefaultMetaData<ApplicationEntity>(),
  order: 'name',
});

const applicationNameColumn = (row: ApplicationEntity) => (
  <StyledApplciationProfileContainer>
    {row?.icon ? (
      <StyledApplicationProfileAvatar
        alt="avatar"
        src={`${config.baseImageUrl}/${row.icon}`}
        width="36px"
        height="36px"
        marginRight="12px"
      />
    ) : (
      <StyledApplicationProfileAvatar
        alt="avatar"
        width="33px"
        height="33px"
        marginRight="12px"
      />
    )}
    <StyledAvatarText>{row?.name}</StyledAvatarText>
  </StyledApplciationProfileContainer>
);

const applicationTypeColumn = (row: ApplicationEntity) => (
  <StyledApplicationChip
    label={(
      <StyledApplicationChipLabel>
        {row?.type === LaunchPadType.WIZEHUB ? messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
          .subItems.application.wizeTool : capitalizeLegend(row.type)}
      </StyledApplicationChipLabel>
          )}
  />
);

const ApplicationComponent: React.FC<Props> = () => {
  const [checked, setChecked] = useState(false);

  const {
    entity: application,
    updateFilters,
    applyFilters,
    connectFilter,
    fetchPage,
    updateLimit,
  } = usePagination<ApplicationEntity>(
    paginatedApplciation,
    getDefaultApplicationFilter(),
  );

  const {
    visibility: formVisibility,
    showPopup: showForm,
    hidePopup: hideForm,
    metaData: config,
  } = usePopupReducer<ApplicationDetailEntity>();

  const reduxDispatch = useDispatch();

  useEffect(() => {
    updateFilters({
      filters: {
        type: checked ? LaunchPadType.WIZEHUB : '',
      },
    });
    applyFilters();
  }, [checked]);

  return (
    <Container noPadding>
      <StyledMasterDataHeadingContainer>
        <StyledMasterDataLeftHeadingContainer>
          <Stepper />
          <StyledHeadingTypography>
            {messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
              .subItems.application.heading}
          </StyledHeadingTypography>
        </StyledMasterDataLeftHeadingContainer>
        <Button
          startIcon={<ResponsiveAddIcon />}
          variant="contained"
          color="primary"
          label={messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
            .subItems.application.applicationButtonText}
          onClick={() => showForm()}
        />
      </StyledMasterDataHeadingContainer>

      <Card
        headerCss={{ display: 'flex' }}
        header={(
          <Grid container margin="0 16px" xs={12}>
            <Grid item xs={3}>
              <SearchInput
                connectFilter={connectFilter}
                label={messages.sidebar.menuItems.secondaryMenu.subMenuItems
                  .leadDataManagement.search}
              />
            </Grid>
            <Grid container item xs={7} justifyContent="end" marginLeft="auto">
              <Grid xs={2} item display="flex" alignItems="center">
                <FormControlLabel
                  label={(
                    <StyledApplicationTypographyText>
                      {messages.sidebar.menuItems.secondaryMenu.subMenuItems
                        .leadDataManagement.wizeTool}
                    </StyledApplicationTypographyText>
                  )}
                  control={(
                    <Checkbox
                      checked={checked}
                      onChange={() => {
                        setChecked(!checked);
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid xs={3} item>
                {connectFilter('status', {
                  label: messages?.userManagement?.status,
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
              getValue: (row: ApplicationEntity) => row,
              format: (row: ApplicationEntity) => applicationNameColumn(row),
            },
            {
              id: 'type',
              label: '',
              getValue: (row: ApplicationEntity) => row,
              format: (row: ApplicationEntity) => applicationTypeColumn(row),
            },
            {
              id: 'status',
              label: 'Status',
              getValue: (row: ApplicationEntity) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
          ]}
          data={application.records}
          metadata={application.metadata}
          actions={[
            {
              id: 'view',
              component: <StyledVisibilityIcon />,
              onClick: (row: ApplicationEntity) => {
                reduxDispatch(
                  push(routes.masterData.applicationDetail.replace(':id', row?.id?.toString())),
                );
              },
            },
          ]}
          fetchPage={fetchPage}
          updateLimit={updateLimit}
          disableSorting={[
            'sno',
            'type',
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
          .masterData.subItems.application.form.addApplication}
        onClose={hideForm}
        fitContent
      >
        <ApplicationForm
          onCancel={hideForm}
          onSuccess={() => {
            hideForm();
            applyFilters();
          }}
          endpoint={APPLICATION}
          applicationData={config}
        />
      </Modal>
    </Container>
  );
};

export default ApplicationComponent;
