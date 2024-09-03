import React from "react";
import { Container } from "../../../components";
import { DetailPageWrapper, Modal, Toast } from "@wizehub/components";
import {
  ResponsiveDeleteIcon,
  ResponsiveEditIcon,
} from "../launchPadSetup/launchPadSetupDetail";
import messages from "../../../messages";
import { formatStatus } from "@wizehub/components/table";
import { useEntity, usePopupReducer } from "@wizehub/common/hooks";
import {
  MeetingQuestionEntity,
  MeetingQuestionFormEntity,
} from "@wizehub/common/models/genericEntities";
import { MEETING_QUESTION_BY_ID } from "../../../api";
import { Status } from "@wizehub/common/models/modules";
import QuestionForm from "./questionForm";
import { toast } from "react-toastify";
import { UserActionConfig, UserActionType } from "@wizehub/common/models";
import DeleteCTAForm from "../launchPadSetup/deleteCTAForm";
import { HttpMethods } from "@wizehub/common/utils";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import { Right } from "../../../redux/reducers/auth";

const MeetingQuestionDetail = () => {
  const { auth, tenantData } = useSelector((state: ReduxState) => state);
  const { tenantId } = tenantData;
  const disabledItems = auth?.rights?.some(
    (item) => item === Right.TENANT_MEETING_MASTER_MANAGEMENT_READ_ONLY
  );
  const { entity: meetingQuestion, refreshEntity } =
    useEntity<MeetingQuestionEntity>(MEETING_QUESTION_BY_ID);

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
          messages?.settings?.systemPreferences?.meetingMasterSetup?.questions
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
                  ?.questions?.detailPage?.editDetail,
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
          messages?.settings?.systemPreferences?.meetingMasterSetup?.questions
            ?.detailPage?.generalInformation
        }
        cardContent={[
          {
            heading:
              messages?.settings?.systemPreferences?.meetingMasterSetup
                ?.questions?.detailPage?.category,
            value: meetingQuestion?.category?.name,
            isTypography: true,
          },
          {
            heading:
              messages?.settings?.systemPreferences?.meetingMasterSetup
                ?.questions?.detailPage?.division,
            value: meetingQuestion?.divisions
              ?.map((item) => `${item.name}`)
              .join(", "),
            gridWidth: 3,
            isTypography: true,
          },
          {
            heading:
              messages?.settings?.systemPreferences?.meetingMasterSetup
                ?.questions?.detailPage?.status,
            value: formatStatus(meetingQuestion?.status),
          },
          {
            heading:
              messages?.settings?.systemPreferences?.meetingMasterSetup
                ?.questions?.detailPage?.question,
            value: meetingQuestion?.question,
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
                messages?.settings?.systemPreferences?.meetingMasterSetup
                  ?.questions?.detailPage?.deleteQuestion,
              onClick: () => showDeleteForm(),
              disabled: meetingQuestion?.status === Status.inactive,
            },
          ]
        }
      />
      <Modal
        show={visibility}
        heading={
          messages?.settings?.systemPreferences?.meetingMasterSetup?.questions
            ?.form.editHeading
        }
        onClose={hidePopup}
        fitContent
      >
        <QuestionForm
          onCancel={hidePopup}
          onSuccess={() => {
            hidePopup();
            toast(
              <Toast
                text={
                  messages?.settings?.systemPreferences?.meetingMasterSetup
                    ?.questions?.form?.success?.updated
                }
              />
            );
            refreshEntity();
          }}
          isUpdate={UserActionType.EDIT === addConfig?.actionConfig?.type}
          meetingQuestionData={meetingQuestion}
        />
      </Modal>
      <Modal
        show={deleteFormVisibility}
        heading={
          messages?.settings?.systemPreferences?.meetingMasterSetup?.questions
            ?.form?.deactivateQuestion
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
                    ?.questions?.form?.success?.deleted
                }
              />
            );
            refreshEntity();
          }}
          api={`${MEETING_QUESTION_BY_ID}/${meetingQuestion?.id}`}
          bodyText={
            messages?.settings?.systemPreferences?.meetingMasterSetup?.questions
              ?.form?.note
          }
          cancelButton={
            messages?.settings?.systemPreferences?.meetingMasterSetup?.questions
              ?.form?.cancel
          }
          confirmButton={
            messages?.settings?.systemPreferences?.meetingMasterSetup?.questions
              ?.form?.deactivateQuestion
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

export default MeetingQuestionDetail;
