import React from "react";
import { Container } from "../../../components";
import { DetailPageWrapper, Modal, Toast } from "@wizehub/components";
import messages from "../../../messages";
import { StyledResponsiveIcon } from "@wizehub/components/table/styles";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useEntity, usePopupReducer } from "@wizehub/common/hooks";
import { LaunchPadDetailEntity } from "@wizehub/common/models/genericEntities";
import { LAUNCH_PAD_BY_ID } from "../../../api";
import { formatStatus } from "@wizehub/components/table";
import {
  StyledLaunchPadAnchorTag,
  StyledLaunchPadProfileAvatar,
} from "./styles";
import { config } from "../../../config";
import { UserActionConfig } from "@wizehub/common/models";
import LaunchPadForm from "./launchPadForm";
import DeleteCTAForm from "./deleteCTAForm";
import { toast } from "react-toastify";
import { HttpMethods } from "@wizehub/common/utils";
import { Status } from "@wizehub/common/models/modules";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import SyncIcon from "@mui/icons-material/Sync";
import { Right } from "../../../redux/reducers/auth";

interface Props {}

export const ResponsiveEditIcon = StyledResponsiveIcon(EditOutlinedIcon);
export const ResponsiveDeleteIcon = StyledResponsiveIcon(
  DeleteOutlineOutlinedIcon
);

export const ResponsiveSyncIcon = StyledResponsiveIcon(SyncIcon);

const launchPadIconColumn = (icon: string) => {
  return icon?.length ? (
    <StyledLaunchPadProfileAvatar
      alt="avatar"
      src={`${config.baseImageUrl}/${icon}`}
      width="30px"
      height="30px"
    />
  ) : (
    <StyledLaunchPadProfileAvatar alt="avatar" width="30px" height="30px" />
  );
};

export const launchPadLinkColumn = (link: string) => {
  return (
    <StyledLaunchPadAnchorTag
      href={
        link?.includes("https://") || link?.includes("http://")
          ? link
          : `https://${link}`
      }
      target="_blank"
    >
      {link}
    </StyledLaunchPadAnchorTag>
  );
};

const LaunchPadSetupDetail: React.FC<Props> = () => {
  const { tenantData, auth } = useSelector((state: ReduxState) => state);
  const { tenantId } = tenantData;
  const disabledItems = auth?.rights?.some(
    (item) => item === Right.TENANT_LAUNCH_PAD_APP_MANAGEMENT_READ_ONLY
  );
  const { entity: launchPadDetail, refreshEntity } =
    useEntity<LaunchPadDetailEntity>(LAUNCH_PAD_BY_ID);
  const {
    visibility: formVisibility,
    showPopup: showForm,
    hidePopup: hideForm,
  } = usePopupReducer<UserActionConfig>();

  const {
    visibility: deleteApplicationFormVisibility,
    showPopup: showDeleteApplicationForm,
    hidePopup: hideDeleteApplicationForm,
  } = usePopupReducer<UserActionConfig>();
  return (
    <Container noPadding>
      <DetailPageWrapper
        heading={
          messages?.settings?.systemPreferences?.launchPadSetup?.detail?.heading
        }
        hasGoBackIcon={true}
        headingActionButtons={
          !disabledItems && [
            {
              color: "secondary",
              variant: "outlined",
              label:
                messages?.settings?.systemPreferences?.launchPadSetup?.detail
                  ?.button,
              onClick: () => showForm(),
              startIcon: <ResponsiveEditIcon />,
            },
          ]
        }
        cardHeading={
          messages?.settings?.systemPreferences?.launchPadSetup?.detail
            ?.generalInformation
        }
        cardContent={[
          {
            heading:
              messages?.settings?.systemPreferences?.launchPadSetup?.detail
                ?.name,
            value: launchPadDetail?.name,
            gridWidth: 3,
            isTypography: true,
          },
          {
            heading:
              messages?.settings?.systemPreferences?.launchPadSetup?.detail
                ?.icon,
            value: launchPadIconColumn(launchPadDetail?.icon),
          },
          {
            heading:
              messages?.settings?.systemPreferences?.launchPadSetup?.detail
                ?.status,
            value: formatStatus(launchPadDetail?.status),
          },
          {
            heading:
              messages?.settings?.systemPreferences?.launchPadSetup?.detail
                ?.link,
            value: launchPadLinkColumn(launchPadDetail?.url),
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
                messages?.settings?.systemPreferences?.launchPadSetup?.detail
                  ?.deleteButton,
              onClick: () => showDeleteApplicationForm(),
              disabled: launchPadDetail?.status === Status.inactive,
            },
          ]
        }
      />
      <Modal
        show={formVisibility}
        heading={
          messages?.settings?.systemPreferences?.launchPadSetup?.form
            ?.editHeading
        }
        onClose={hideForm}
        fitContent
      >
        <LaunchPadForm
          onCancel={hideForm}
          onSuccess={() => {
            hideForm();
            refreshEntity();
          }}
          isUpdate={true}
          launchPadAppId={launchPadDetail?.id}
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
            refreshEntity();
          }}
          api={`${LAUNCH_PAD_BY_ID}/${launchPadDetail?.id}`}
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

export default LaunchPadSetupDetail;
