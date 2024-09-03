import React from "react";
import { Container } from "../../../components";
import { DetailPageWrapper, Modal, Table, Toast } from "@wizehub/components";
import {
  ResponsiveDeleteIcon,
  ResponsiveEditIcon,
} from "../launchPadSetup/launchPadSetupDetail";
import messages from "../../../messages";
import { formatStatus } from "@wizehub/components/table";
import { useEntity, usePopupReducer } from "@wizehub/common/hooks";
import {
  GuideEntity,
  MeetingAgendaDetailEntity,
  MeetingQuestionEntity,
  MeetingQuestionFormEntity,
} from "@wizehub/common/models/genericEntities";
import { MEETING_AGENDA_BY_ID, MEETING_QUESTION_BY_ID } from "../../../api";
import { Status } from "@wizehub/common/models/modules";
import { StyledApplicationAnchorTag } from "./styles";
import AgendaForm from "./agendaForm";
import { toast } from "react-toastify";
import { UserActionConfig, UserActionType } from "@wizehub/common/models";
import DeleteCTAForm from "../launchPadSetup/deleteCTAForm";
import { HttpMethods } from "@wizehub/common/utils";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import { Right } from "../../../redux/reducers/auth";

const resourceUrl = (row: GuideEntity) => (
  <StyledApplicationAnchorTag
    href={
      row?.resourceUrl?.includes("https://") ||
      row?.resourceUrl?.includes("http://")
        ? row?.resourceUrl
        : `https://${row?.resourceUrl}`
    }
    target="_blank"
  >
    {row?.resourceUrl}
  </StyledApplicationAnchorTag>
);

const MeetingAgendaDetail = () => {
  const { auth, tenantData } = useSelector((state: ReduxState) => state);
  const { tenantId } = tenantData;
  const disabledItems = auth?.rights?.some(
    (item) => item === Right.TENANT_MEETING_MASTER_MANAGEMENT_READ_ONLY
  );
  const { entity: meetingAgenda, refreshEntity } =
    useEntity<MeetingAgendaDetailEntity>(MEETING_AGENDA_BY_ID);
  const {
    visibility,
    showPopup,
    hidePopup,
    metaData: addConfig,
  } = usePopupReducer<MeetingQuestionFormEntity>();
  const {
    visibility: deleteFormVisibility,
    showPopup: showDeleteForm,
    hidePopup: hideDeleteForm,
  } = usePopupReducer<UserActionConfig>();
  return (
    <Container noPadding>
      <DetailPageWrapper
        heading={
          messages?.settings?.systemPreferences?.meetingMasterSetup?.agenda
            ?.detailPage?.heading
        }
        hasGoBackIcon={true}
        headingActionButtons={
          !disabledItems && [
            {
              color: "secondary",
              variant: "outlined",
              label:
                messages?.settings?.systemPreferences?.meetingMasterSetup
                  ?.agenda?.detailPage?.editDetail,
              onClick: () =>
                showPopup({
                  actionConfig: {
                    type: UserActionType.EDIT,
                  },
                }),
              startIcon: <ResponsiveEditIcon />,
            },
          ]
        }
        cardHeading={
          messages?.settings?.systemPreferences?.meetingMasterSetup?.agenda
            ?.detailPage?.generalInformation
        }
        cardContent={[
          {
            heading:
              messages?.settings?.systemPreferences?.meetingMasterSetup?.agenda
                ?.detailPage?.agenda,
            value: meetingAgenda?.title,
            isTypography: true,
          },
          {
            heading:
              messages?.settings?.systemPreferences?.meetingMasterSetup?.agenda
                ?.detailPage?.project,
            value: meetingAgenda?.project?.title,
            isTypography: true,
          },
          {
            heading:
              messages?.settings?.systemPreferences?.meetingMasterSetup?.agenda
                ?.detailPage?.division,
            value: meetingAgenda?.divisions
              ?.map((item) => `${item.divisionName}`)
              .join(", "),
            gridWidth: 3,
            isTypography: true,
          },
          {
            heading:
              messages?.settings?.systemPreferences?.meetingMasterSetup
                ?.questions?.detailPage?.status,
            value: formatStatus(meetingAgenda?.status),
          },
          {
            heading:
              messages?.settings?.systemPreferences?.meetingMasterSetup?.agenda
                ?.detailPage?.implementationDetail,
            value: meetingAgenda?.implementationDetail,
            gridWidth: 12,
            isTypography: true,
          },
          {
            heading:
              messages?.settings?.systemPreferences?.meetingMasterSetup?.agenda
                ?.detailPage?.guideVideo,
            value:
              meetingAgenda?.guides &&
              (() => (
                <Table
                  specs={[
                    {
                      id: "name",
                      label: "Name",
                    },
                    {
                      id: "type",
                      label: "Type",
                    },
                    {
                      id: "resourceUrl",
                      label: "Guide link",
                      getValue: (row: MeetingAgendaDetailEntity) => row,
                      format: (row: GuideEntity) => resourceUrl(row),
                    },
                  ]}
                  data={meetingAgenda?.guides}
                  disableSorting={["sno", "name", "type", "resourceUrl"]}
                  metadata={{
                    order: "",
                    direction: "asc",
                    total: 10,
                    page: 1,
                    limit: 10,
                    filters: {},
                    allowedFilters: [""],
                  }}
                />
              ))(),
            gridWidth: 12,
          },
        ]}
        footerActionButton={
          !disabledItems && [
            {
              color: "error",
              variant: "contained",
              startIcon: <ResponsiveDeleteIcon />,
              label:
                messages?.settings?.systemPreferences?.meetingMasterSetup
                  ?.agenda?.detailPage?.deleteAgenda,
              onClick: () => showDeleteForm(),
              disabled: meetingAgenda?.status === Status.inactive,
            },
          ]
        }
      />
      <Modal
        show={visibility}
        heading={
          messages?.settings?.systemPreferences?.meetingMasterSetup?.agenda
            ?.form?.editHeading
        }
        onClose={hidePopup}
        fitContent
      >
        <AgendaForm
          onCancel={hidePopup}
          onSuccess={() => {
            hidePopup();
            toast(
              <Toast
                text={
                  messages?.settings?.systemPreferences?.meetingMasterSetup
                    ?.agenda?.form?.success?.updated
                }
              />
            );
            refreshEntity();
          }}
          isUpdate={addConfig?.actionConfig?.type === UserActionType.EDIT}
          agendaData={meetingAgenda}
        />
      </Modal>
      <Modal
        show={deleteFormVisibility}
        heading={
          messages?.settings?.systemPreferences?.meetingMasterSetup?.agenda
            ?.form?.deactivateAgenda
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
                    ?.agenda?.form?.success?.deleted
                }
              />
            );
            refreshEntity();
          }}
          api={`${MEETING_AGENDA_BY_ID}/${meetingAgenda?.id}`}
          bodyText={
            messages?.settings?.systemPreferences?.meetingMasterSetup?.agenda
              ?.form?.note
          }
          cancelButton={
            messages?.settings?.systemPreferences?.meetingMasterSetup?.agenda
              ?.form?.cancel
          }
          confirmButton={
            messages?.settings?.systemPreferences?.meetingMasterSetup?.agenda
              ?.form?.deactivateAgenda
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

export default MeetingAgendaDetail;
