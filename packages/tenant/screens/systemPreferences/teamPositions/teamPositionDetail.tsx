import React from "react";
import { Container } from "../../../components";
import { DetailPageWrapper, Modal, Toast } from "@wizehub/components";
import messages from "../../../messages";
import {
  ResponsiveDeleteIcon,
  ResponsiveEditIcon,
} from "../launchPadSetup/launchPadSetupDetail";
import { UserActionType } from "@wizehub/common/models";
import { formatStatus } from "@wizehub/components/table";
import { Status } from "@wizehub/common/models/modules";
import { TEAM_POSITION_BY_ID } from "../../../api";
import { useEntity, usePopupReducer } from "@wizehub/common/hooks";
import { TeamPositionEntity } from "@wizehub/common/models/genericEntities";
import TeamPositionForm from "./teamPositionForm";
import { toast } from "react-toastify";
import DeleteCTAForm from "../launchPadSetup/deleteCTAForm";
import { HttpMethods } from "@wizehub/common/utils";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import { Right } from "../../../redux/reducers/auth";

const TeamPositionDetail = () => {
  const { entity: teamPosition, refreshEntity } =
    useEntity<TeamPositionEntity>(TEAM_POSITION_BY_ID);
  const { tenantData, auth } = useSelector((state: ReduxState) => state);
  const { tenantId } = tenantData;
  const disabledItems = auth?.rights?.some(
    (item) => item === Right.TENANT_TEAM_POSITION_MANAGEMENT_READ_ONLY
  );

  const {
    visibility: formVisibility,
    showPopup: showForm,
    hidePopup: hideForm,
  } = usePopupReducer();

  const {
    visibility: deletePositionFormVisibility,
    showPopup: showDeletePositionForm,
    hidePopup: hideDeletePositionForm,
  } = usePopupReducer();
  return (
    <Container noPadding>
      <DetailPageWrapper
        heading={
          messages?.settings?.systemPreferences?.teamPositions
            ?.teamPositionDetail?.heading
        }
        hasGoBackIcon={true}
        headingActionButtons={
          !disabledItems && [
            {
              color: "secondary",
              variant: "outlined",
              label:
                messages?.settings?.systemPreferences?.teamPositions
                  ?.teamPositionDetail?.editDetails,
              onClick: () => showForm(),
              startIcon: <ResponsiveEditIcon />,
            },
          ]
        }
        cardHeading={
          messages?.settings?.systemPreferences?.teamPositions
            ?.teamPositionDetail?.generalInformation
        }
        cardContent={[
          {
            heading:
              messages?.settings?.systemPreferences?.teamPositions
                ?.teamPositionDetail?.name,
            value: teamPosition?.name,
            gridWidth: 3,
            isTypography: true,
          },
          {
            heading:
              messages?.settings?.systemPreferences?.teamPositions
                ?.teamPositionDetail?.positionLevel,
            value: teamPosition?.positionLevel,
            isTypography: true,
          },
          {
            heading:
              messages?.settings?.systemPreferences?.teamPositions
                ?.teamPositionDetail?.division,
            value: teamPosition?.divisions
              ?.map((item) => `${item.name}`)
              .join(", "),
            gridWidth: 3,
            isTypography: true,
          },
          {
            heading:
              messages?.settings?.systemPreferences?.teamPositions
                ?.teamPositionDetail?.status,
            value: formatStatus(teamPosition?.status),
          },
          {
            heading:
              messages?.settings?.systemPreferences?.teamPositions
                ?.teamPositionDetail?.description,
            value: teamPosition?.description,
            gridWidth: 12,
            isTypography: true,
          },
        ]}
        footerActionButton={
          !disabledItems && [
            {
              color: "error",
              variant: "contained",
              startIcon: <ResponsiveDeleteIcon />,
              label:
                messages?.settings?.systemPreferences?.teamPositions
                  ?.teamPositionDetail?.deletePosition,
              onClick: () => showDeletePositionForm(),
              disabled: teamPosition?.status === Status.inactive,
            },
          ]
        }
      />
      <Modal
        show={formVisibility}
        heading={
          messages?.settings?.systemPreferences?.teamPositions?.form
            ?.editHeading
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
                    ?.success?.updated
                }
              />
            );
            refreshEntity();
          }}
          endpoint={`${TEAM_POSITION_BY_ID}/${teamPosition?.id}`}
          isUpdate={true}
          positionData={teamPosition}
        />
      </Modal>

      <Modal
        show={deletePositionFormVisibility}
        heading={
          messages?.settings?.systemPreferences?.teamPositions?.form
            ?.deactivatePosition
        }
        onClose={hideDeletePositionForm}
        fitContent
      >
        <DeleteCTAForm
          onCancel={hideDeletePositionForm}
          onSuccess={() => {
            hideDeletePositionForm();
            toast(
              <Toast
                text={
                  messages?.settings?.systemPreferences?.teamPositions?.form
                    ?.success?.deleted
                }
              />
            );
            refreshEntity();
          }}
          api={`${TEAM_POSITION_BY_ID}/${teamPosition?.id}`}
          bodyText={
            messages?.settings?.systemPreferences?.teamPositions?.form?.body
          }
          cancelButton={
            messages?.settings?.systemPreferences?.teamPositions?.form?.cancel
          }
          confirmButton={
            messages?.settings?.systemPreferences?.teamPositions?.form
              ?.deactivatePosition
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

export default TeamPositionDetail;
