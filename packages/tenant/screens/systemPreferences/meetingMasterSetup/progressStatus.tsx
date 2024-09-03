import React from "react";
import { Container } from "../../../components";
import {
  StyledMeetingCategoryLeftHeadingContainer,
  StyledMeetingMasterSetupHeadingContainer,
} from "./styles";
import { StyledHeadingTypography } from "../launchPadSetup/styles";
import messages from "../../../messages";
import { Button, Card, Modal, Table, Toast } from "@wizehub/components";
import { ResponsiveAddIcon } from "../launchPadSetup/launchPadSetup";
import { Status } from "@wizehub/common/models/modules";
import {
  MetaData,
  PaginatedEntity,
  UserActionConfig,
  UserActionType,
  getDefaultMetaData,
} from "@wizehub/common/models";
import { HttpMethods } from "@wizehub/common/utils";
import { formatStatus } from "@wizehub/components/table";
import { usePagination, usePopupReducer } from "@wizehub/common/hooks";
import {
  ProgressEntity,
  ProgressStatusFormEntity,
} from "@wizehub/common/models/genericEntities";
import {
  MEETING_PROGRESS_BY_ID,
  MEETING_PROGRESS_LISTING_API,
} from "../../../api";
import { PROGRESS_ENTITY_ACTION } from "../../../redux/actions";
import {
  StyledDeleteIcon,
  StyledEditIcon,
} from "@wizehub/components/table/styles";
import DeleteCTAForm from "../launchPadSetup/deleteCTAForm";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { StyledIconButton } from "@wizehub/components/detailPageWrapper/styles";
import { useDispatch } from "react-redux";
import { goBack } from "connected-react-router";
import ProgressStatusForm from "./progressStatusForm";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import { Right } from "../../../redux/reducers/auth";

const paginatedProgressStatus: PaginatedEntity = {
  key: "meetingProgress",
  name: PROGRESS_ENTITY_ACTION,
  api: MEETING_PROGRESS_LISTING_API,
};

const getDefaultProgressStatusFilter = (): MetaData<ProgressEntity> => ({
  ...getDefaultMetaData<ProgressEntity>(),
  order: "name",
});

const ProgressStatus = () => {
  const { auth, tenantData } = useSelector((state: ReduxState) => state);
  const { tenantId } = tenantData;
  const disabledItems = auth?.rights?.some(
    (item) => item === Right.TENANT_MEETING_MASTER_MANAGEMENT_READ_ONLY
  );
  const reduxDispatch = useDispatch();
  const {
    entity: progressEntity,
    updateFilters,
    applyFilters,
    fetchPage,
    updateLimit,
  } = usePagination<ProgressEntity>(
    {
      ...paginatedProgressStatus,
      api: MEETING_PROGRESS_LISTING_API.replace(":id", tenantId),
    },
    getDefaultProgressStatusFilter()
  );

  const {
    visibility: formVisibility,
    showPopup: showForm,
    hidePopup: hideForm,
    metaData: config,
  } = usePopupReducer<ProgressStatusFormEntity>();

  const {
    visibility: deleteFormVisibility,
    showPopup: showDeleteForm,
    hidePopup: hideDeleteForm,
    metaData: deleteConfig,
  } = usePopupReducer<UserActionConfig>();
  return (
    <Container noPadding>
      <StyledMeetingMasterSetupHeadingContainer>
        <StyledMeetingCategoryLeftHeadingContainer>
          <StyledIconButton onClick={() => reduxDispatch(goBack())}>
            <ArrowBackIcon />
          </StyledIconButton>
          <StyledHeadingTypography>
            {
              messages?.settings?.systemPreferences?.meetingMasterSetup
                ?.progressStatusPage?.heading
            }
          </StyledHeadingTypography>
        </StyledMeetingCategoryLeftHeadingContainer>
        {!disabledItems && (
          <Button
            startIcon={<ResponsiveAddIcon />}
            variant="contained"
            color="primary"
            label={
              messages?.settings?.systemPreferences?.meetingMasterSetup
                ?.progressStatusPage?.button
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
      </StyledMeetingMasterSetupHeadingContainer>
      <Card
        noHeader
        cardCss={{ margin: "0 20px", overflow: "hidden !important" }}
      >
        <Table
          specs={[
            {
              id: "name",
              label:
                messages?.settings?.systemPreferences?.meetingMasterSetup
                  ?.progressStatusPage?.table?.name,
            },
            {
              id: "status",
              label:
                messages?.settings?.systemPreferences?.meetingMasterSetup
                  ?.progressStatusPage?.table?.status,
              getValue: (row: ProgressEntity) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
          ]}
          data={progressEntity?.records}
          metadata={progressEntity?.metadata}
          actions={
            !disabledItems && [
              {
                id: "edit",
                component: <StyledEditIcon />,
                onClick: (row: ProgressEntity) => {
                  showForm({
                    actionConfig: {
                      type: UserActionType.EDIT,
                    },
                    progressEntity: { ...row },
                  });
                },
              },
              {
                id: "delete",
                render(row: ProgressEntity) {
                  return (
                    <StyledDeleteIcon active={row?.status === Status.active} />
                  );
                },
                onClick: (row: ProgressEntity) => {
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
        heading={
          messages?.settings?.systemPreferences?.meetingMasterSetup
            ?.progressStatusPage?.form?.[
            config?.actionConfig?.type === UserActionType.EDIT
              ? "editHeading"
              : "addHeading"
          ]
        }
        onClose={hideForm}
        fitContent
      >
        <ProgressStatusForm
          onCancel={hideForm}
          onSuccess={() => {
            hideForm();
            applyFilters();
          }}
          isUpdate={config?.actionConfig?.type === UserActionType.EDIT}
          progressEntity={
            config?.actionConfig?.type === UserActionType.EDIT &&
            config?.progressEntity
          }
        />
      </Modal>
      <Modal
        show={deleteFormVisibility}
        heading={
          messages?.settings?.systemPreferences?.meetingMasterSetup
            ?.progressStatusPage?.form?.deactivateProgressStatus
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
                  messages?.settings?.systemPreferences?.meetingMasterSetup
                    ?.progressStatusPage?.form?.success?.deleted
                }
              />
            );
            applyFilters();
          }}
          api={`${MEETING_PROGRESS_BY_ID}/${deleteConfig?.id}`}
          bodyText={
            messages?.settings?.systemPreferences?.meetingMasterSetup
              ?.progressStatusPage?.form?.note
          }
          cancelButton={
            messages?.settings?.systemPreferences?.meetingMasterSetup
              ?.progressStatusPage?.form?.cancel
          }
          confirmButton={
            messages?.settings?.systemPreferences?.meetingMasterSetup
              ?.progressStatusPage?.form?.deactivateButton
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

export default ProgressStatus;
