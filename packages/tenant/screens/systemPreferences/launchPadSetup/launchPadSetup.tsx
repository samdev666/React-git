import React from "react";
import { Container } from "../../../components";
import {
  StyledAvatarText,
  StyledHeadingTypography,
  StyledLaunchPadAnchorTag,
  StyledLaunchPadHeadingContainer,
  StyledLaunchPadLeftHeadingContainer,
  StyledLaunchPadProfileAvatar,
  StyledLaunchPadProfileContainer,
} from "./styles";
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
import {
  StyledDeleteIcon,
  StyledEditIcon,
  StyledResponsiveIcon
} from "@wizehub/components/table/styles";
import AddIcon from "@mui/icons-material/Add";
import { Grid } from "@mui/material";
import {
  MetaData,
  Option,
  PaginatedEntity,
  UserActionConfig,
  UserActionType,
  getDefaultMetaData,
} from "@wizehub/common/models";
import { Status, StatusOptions } from "@wizehub/common/models/modules";
import { capitalizeEntireString, HttpMethods, stringTrimWithNumberOfCharacters } from "@wizehub/common/utils";
import { usePagination, usePopupReducer } from "@wizehub/common/hooks";
import { LaunchPad, LaunchPadAppFormEntity } from "@wizehub/common/models/genericEntities";
import { LAUNCH_PAD_BY_ID, LAUNCH_PAD_LISTING_API } from "../../../api";
import { LAUNCH_PAD_ACTION } from "../../../redux/actions";
import { useDispatch } from "react-redux";
import { formatStatus } from "@wizehub/components/table";
import { config } from "../../../config";
import LaunchPadForm from "./launchPadForm";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import { Right } from "../../../redux/reducers/auth";
import DeleteCTAForm from "./deleteCTAForm";
import { toast } from "react-toastify";

interface Props { }

export const ResponsiveAddIcon = StyledResponsiveIcon(AddIcon);

const paginatedLaunchPad: PaginatedEntity = {
  key: "launchPad",
  name: LAUNCH_PAD_ACTION,
  api: LAUNCH_PAD_LISTING_API,
};

const getDefaultLaunchPadFilter = (): MetaData<LaunchPad> => ({
  ...getDefaultMetaData<LaunchPad>(),
  order: "name",
});

const launchPadNameColumn = (row: LaunchPad) => (
  <StyledLaunchPadProfileContainer>
    {row?.icon ? (
      <StyledLaunchPadProfileAvatar
        alt="avatar"
        src={`${config.baseImageUrl}/${row.icon}`}
        width="36px"
        height="36px"
        marginRight="12px"
      />
    ) : (
      <StyledLaunchPadProfileAvatar
        alt="avatar"
        width="33px"
        height="33px"
        marginRight="12px"
      />
    )}
    <StyledAvatarText>{row?.name}</StyledAvatarText>
  </StyledLaunchPadProfileContainer>
);

const launchPadLinkColumn = (link: string) => {
  return (
    <StyledLaunchPadAnchorTag
      href={
        link?.includes("https://") || link?.includes("http://")
          ? link
          : `https://${link}`
      }
      target="_blank"
    >
      {stringTrimWithNumberOfCharacters(link, 20)}
    </StyledLaunchPadAnchorTag>
  );
};

const LaunchPadSetup: React.FC<Props> = () => {
  const reduxDispatch = useDispatch();
  const { tenantData, auth } = useSelector((state: ReduxState) => state);
  const { tenantId } = tenantData;
  const {
    entity: launchPad,
    updateFilters,
    applyFilters,
    connectFilter,
    fetchPage,
    updateLimit,
  } = usePagination<LaunchPad>(
    {
      ...paginatedLaunchPad,
      api: LAUNCH_PAD_LISTING_API.replace(":id", tenantId),
    },
    getDefaultLaunchPadFilter()
  );

  const disabledItems = auth?.rights?.some(
    (item) => item === Right.TENANT_LAUNCH_PAD_APP_MANAGEMENT_READ_ONLY
  );

  const {
    visibility: formVisibility,
    showPopup: showForm,
    hidePopup: hideForm,
    metaData: config,
  } = usePopupReducer<LaunchPadAppFormEntity>();

  const {
    visibility: deleteApplicationFormVisibility,
    showPopup: showDeleteApplicationForm,
    hidePopup: hideDeleteApplicationForm,
    metaData: deleteConfig,
  } = usePopupReducer<UserActionConfig>();

  return (
    <Container noPadding>
      <StyledLaunchPadHeadingContainer>
        <StyledLaunchPadLeftHeadingContainer>
          <StyledHeadingTypography>
            {messages?.settings?.systemPreferences?.launchPadSetup?.heading}
          </StyledHeadingTypography>
        </StyledLaunchPadLeftHeadingContainer>
        {!disabledItems && (
          <Button
            startIcon={<ResponsiveAddIcon />}
            variant="contained"
            color="primary"
            label={
              messages?.settings?.systemPreferences?.launchPadSetup?.button
            }
            onClick={() => showForm()}
          />
        )}
      </StyledLaunchPadHeadingContainer>
      <Card
        headerCss={{ display: "flex" }}
        header={
          <Grid container margin="0 16px" xs={12}>
            <Grid item xs={3}>
              <SearchInput
                connectFilter={connectFilter}
                label={
                  messages?.settings?.systemPreferences?.launchPadSetup?.search
                }
              />
            </Grid>
            <Grid container item xs={7} justifyContent="end" marginLeft="auto">
              <Grid xs={3} item>
                {connectFilter("status", {
                  label:
                    messages?.settings?.systemPreferences?.launchPadSetup
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
                messages?.settings?.systemPreferences?.launchPadSetup?.table
                  ?.name,
              getValue: (row: LaunchPad) => row,
              format: (row: LaunchPad) => launchPadNameColumn(row),
            },
            {
              id: "url",
              label: messages?.settings?.systemPreferences?.launchPadSetup?.detail
                ?.link,
              getValue: (row: LaunchPad) => row,
              format: (row: LaunchPad) => row?.url ? launchPadLinkColumn(row?.url) : '-'
            },
            {
              id: "status",
              label:
                messages?.settings?.systemPreferences?.launchPadSetup?.table
                  ?.status,
              getValue: (row: LaunchPad) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
          ]}
          data={launchPad?.records}
          metadata={launchPad?.metadata}
          actions={
            !disabledItems && [
              {
                id: "edit",
                component: <StyledEditIcon />,
                onClick: (row: LaunchPad) => {
                  showForm({
                    actionConfig: {
                      type: UserActionType.EDIT,
                    },
                    id: row?.id,
                  });
                },
              },
              {
                id: "delete",
                render(row: LaunchPad) {
                  return (
                    <StyledDeleteIcon active={row?.status === Status.active} />
                  );
                },
                onClick: (row: LaunchPad) => {
                  row?.status === Status.active &&
                    showDeleteApplicationForm({
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
          messages?.settings?.systemPreferences?.launchPadSetup?.form?.[
          config?.actionConfig?.type === UserActionType.EDIT
            ? "editHeading"
            : "addHeading"
          ]
        }
        onClose={hideForm}
        fitContent
      >
        <LaunchPadForm
          onCancel={hideForm}
          onSuccess={() => {
            hideForm();
            applyFilters();
          }}
          isUpdate={config?.actionConfig?.type === UserActionType.EDIT}
          launchPadAppId={
            config?.actionConfig?.type === UserActionType.EDIT &&
            config?.id
          }
        />
      </Modal>

      <Modal
        show={deleteApplicationFormVisibility}
        heading={
          messages?.settings?.systemPreferences?.launchPadSetup?.form
            ?.deactivateApplicationHeading
        }
        onClose={hideDeleteApplicationForm}
        fitContent
      >
        <DeleteCTAForm
          onCancel={hideDeleteApplicationForm}
          onSuccess={() => {
            hideDeleteApplicationForm();
            toast(
              <Toast
                text={
                  messages?.settings?.systemPreferences?.launchPadSetup?.form
                    ?.success?.deleted
                }
              />
            );
            applyFilters()
          }}
          api={`${LAUNCH_PAD_BY_ID}/${deleteConfig?.id}`}
          bodyText={
            messages?.settings?.systemPreferences?.launchPadSetup?.form
              ?.deactivateApplicationNote
          }
          cancelButton={
            messages?.settings?.systemPreferences?.launchPadSetup?.form?.cancel
          }
          confirmButton={
            messages?.settings?.systemPreferences?.launchPadSetup?.form
              ?.deactivateApplicationHeading
          }
          apiMethod={HttpMethods.DELETE}
          deleteBody={{
            tenantId: tenantId,
            status: Status.inactive,
          }}
        />
      </Modal>
    </Container>
  );
};

export default LaunchPadSetup;
