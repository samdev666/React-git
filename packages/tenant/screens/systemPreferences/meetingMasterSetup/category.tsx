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
import { HttpMethods, capitalizeEntireString } from "@wizehub/common/utils";
import { formatStatus } from "@wizehub/components/table";
import { usePagination, usePopupReducer } from "@wizehub/common/hooks";
import {
  MeetingCategoryEntity,
  MeetingCategoryFormEntity,
} from "@wizehub/common/models/genericEntities";
import {
  LEAD_INDUSTRY_BY_ID,
  MEETING_CATEGORY_BY_ID,
  MEETING_CATEGORY_LISTING_API,
} from "../../../api";
import { MEETING_CATEGORY_ACTION } from "../../../redux/actions";
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
import CategoryForm from "./categoryForm";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import { Right } from "../../../redux/reducers/auth";

const paginatedMeetingCategory: PaginatedEntity = {
  key: "meetingCategory",
  name: MEETING_CATEGORY_ACTION,
  api: MEETING_CATEGORY_LISTING_API,
};

const getDefaultMeetingCategoryFilter =
  (): MetaData<MeetingCategoryEntity> => ({
    ...getDefaultMetaData<MeetingCategoryEntity>(),
    order: "name",
  });

const Category = () => {
  const { auth, tenantData } = useSelector((state: ReduxState) => state);
  const { tenantId } = tenantData;
  const disabledItems = auth?.rights?.some(
    (item) => item === Right.TENANT_MEETING_MASTER_MANAGEMENT_READ_ONLY
  );
  const reduxDispatch = useDispatch();
  const {
    entity: categoryEntity,
    updateFilters,
    applyFilters,
    fetchPage,
    updateLimit,
  } = usePagination<MeetingCategoryEntity>(
    {
      ...paginatedMeetingCategory,
      api: MEETING_CATEGORY_LISTING_API.replace(":id", tenantId),
    },
    getDefaultMeetingCategoryFilter()
  );

  const {
    visibility: formVisibility,
    showPopup: showForm,
    hidePopup: hideForm,
    metaData: config,
  } = usePopupReducer<MeetingCategoryFormEntity>();

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
                ?.category?.heading
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
                ?.category?.button
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
                  ?.category?.table?.name,
            },
            {
              id: "status",
              label:
                messages?.settings?.systemPreferences?.meetingMasterSetup
                  ?.category?.table?.status,
              getValue: (row: MeetingCategoryEntity) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
          ]}
          data={categoryEntity?.records}
          metadata={categoryEntity?.metadata}
          actions={
            !disabledItems && [
              {
                id: "edit",
                component: <StyledEditIcon />,
                onClick: (row: MeetingCategoryEntity) => {
                  showForm({
                    actionConfig: {
                      type: UserActionType.EDIT,
                    },
                    categoryEntity: { ...row },
                  });
                },
              },
              {
                id: "delete",
                render(row: MeetingCategoryEntity) {
                  return (
                    <StyledDeleteIcon active={row?.status === Status.active} />
                  );
                },
                onClick: (row: MeetingCategoryEntity) => {
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
          messages?.settings?.systemPreferences?.meetingMasterSetup?.category
            ?.form?.[
            config?.actionConfig?.type === UserActionType.EDIT
              ? "editHeading"
              : "addHeading"
          ]
        }
        onClose={hideForm}
        fitContent
      >
        <CategoryForm
          onCancel={hideForm}
          onSuccess={() => {
            hideForm();
            applyFilters();
          }}
          isUpdate={config?.actionConfig?.type === UserActionType.EDIT}
          categoryEntity={
            config?.actionConfig?.type === UserActionType.EDIT &&
            config?.categoryEntity
          }
        />
      </Modal>
      <Modal
        show={deleteFormVisibility}
        heading={
          messages?.settings?.systemPreferences?.meetingMasterSetup?.category
            ?.form?.deactivateCategory
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
                    ?.category?.form?.success?.deleted
                }
              />
            );
            applyFilters();
          }}
          api={`${MEETING_CATEGORY_BY_ID}/${deleteConfig?.id}`}
          bodyText={
            messages?.settings?.systemPreferences?.meetingMasterSetup?.category
              ?.form?.note
          }
          cancelButton={
            messages?.settings?.systemPreferences?.meetingMasterSetup?.category
              ?.form?.cancel
          }
          confirmButton={
            messages?.settings?.systemPreferences?.meetingMasterSetup?.category
              ?.form?.deactivateButton
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

export default Category;
