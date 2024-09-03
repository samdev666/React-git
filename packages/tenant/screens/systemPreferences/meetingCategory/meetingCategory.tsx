import React from "react";
import { Button, Card, Modal, Toast } from "@wizehub/components";
import {
  MetaData,
  PaginatedEntity,
  getDefaultMetaData,
} from "@wizehub/common/models";
import { usePagination, usePopupReducer } from "@wizehub/common/hooks";
import Table, { formatStatus } from "@wizehub/components/table";
import { toast } from "react-toastify";
import { StyledEditIcon } from "@wizehub/components/table/styles";
import { HttpMethods } from "@wizehub/common/utils";
import { Status } from "@wizehub/common/models/modules";
import {
  FeeLostReasonEntity,
  MeetingCategoryTenantEntity,
} from "@wizehub/common/models/genericEntities";
import { Container } from "../../../components";
import { StyledDeleteIcon } from "@wizehub/components/table/styles";
import messages from "../../../messages";
import { TENANT_MEETING_CATEGORY_ACTION } from "../../../redux/actions";
import {
  MEETING_CATEOGRY_LISTING_API,
  TENANT_MEETING_CATEGORY_BY_ID,
} from "../../../api";
import DeleteCTAForm from "../launchPadSetup/deleteCTAForm";
import {
  StyledFeeLostReasonHeadingContainer,
  StyledFeeLostReasonLeftHeadingContainer,
} from "../feeLostReasonSetup/styles";
import { StyledHeadingTypography } from "../launchPadSetup/styles";
import { ResponsiveAddIcon } from "../launchPadSetup/launchPadSetup";
import MeetingCategoryForm from "./meetingCategoryForm";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import { Right } from "../../../redux/reducers/auth";

interface Props {}

const paginatedMeetingCateogry: PaginatedEntity = {
  key: "tenantMeetingCategory",
  name: TENANT_MEETING_CATEGORY_ACTION,
  api: MEETING_CATEOGRY_LISTING_API,
};

const getDefaultMeetingCateogryFilter =
  (): MetaData<MeetingCategoryTenantEntity> => ({
    ...getDefaultMetaData<MeetingCategoryTenantEntity>(),
    order: "name",
  });

const MeetingCategory: React.FC<Props> = () => {
  const { tenantData, auth } = useSelector((state: ReduxState) => state);
  const { tenantId } = tenantData;
  const disabledItems = auth?.rights?.some(
    (item) => item === Right.TENANT_MEETING_CATEGORY_MANAGEMENT_READ_ONLY
  );
  const {
    entity: meetingCateogry,
    updateFilters,
    applyFilters,
    fetchPage,
    updateLimit,
  } = usePagination<MeetingCategoryTenantEntity>(
    {
      ...paginatedMeetingCateogry,
      api: MEETING_CATEOGRY_LISTING_API.replace(":tenantId", tenantId),
    },
    getDefaultMeetingCateogryFilter()
  );

  const {
    visibility: formVisibility,
    showPopup: showForm,
    hidePopup: hideForm,
    metaData: config,
  } = usePopupReducer<MeetingCategoryTenantEntity>();

  const {
    visibility: deleteReasonformVisibility,
    showPopup: showDeleteReasonForm,
    hidePopup: hideDeleteReasonForm,
    metaData: deleteConfig,
  } = usePopupReducer<MeetingCategoryTenantEntity>();

  return (
    <Container noPadding>
      <StyledFeeLostReasonHeadingContainer>
        <StyledFeeLostReasonLeftHeadingContainer>
          <StyledHeadingTypography>
            {messages?.settings?.systemPreferences?.meetingCategory?.heading}
          </StyledHeadingTypography>
        </StyledFeeLostReasonLeftHeadingContainer>
        {!disabledItems && (
          <Button
            startIcon={<ResponsiveAddIcon />}
            variant="contained"
            color="primary"
            label={
              messages?.settings?.systemPreferences?.meetingCategory?.button
            }
            onClick={() => showForm()}
          />
        )}
      </StyledFeeLostReasonHeadingContainer>

      <Card cardCss={{ margin: "0 20px" }} noHeaderPadding>
        <Table
          specs={[
            {
              id: "name",
              label:
                messages?.settings?.systemPreferences?.meetingCategory?.table
                  ?.name,
            },
            {
              id: "status",
              label:
                messages?.settings?.systemPreferences?.meetingCategory?.table
                  ?.status,
              getValue: (row: FeeLostReasonEntity) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
          ]}
          data={meetingCateogry.records}
          metadata={meetingCateogry.metadata}
          actions={
            !disabledItems && [
              {
                id: "edit",
                component: <StyledEditIcon />,
                onClick: (row: FeeLostReasonEntity) => showForm({ ...row }),
              },
              {
                id: "delete",
                render(row: FeeLostReasonEntity) {
                  return (
                    <StyledDeleteIcon active={row?.status === Status.active} />
                  );
                },
                onClick: (row: FeeLostReasonEntity) =>
                  row?.status === Status.active &&
                  showDeleteReasonForm({
                    ...row,
                  }),
              },
            ]
          }
          fetchPage={fetchPage}
          updateLimit={updateLimit}
          disableSorting={["sno", "status"]}
          updateFilters={(filterParams: any) => {
            updateFilters(filterParams);
            applyFilters();
          }}
        />
      </Card>

      <Modal
        show={formVisibility}
        heading={
          messages?.settings?.systemPreferences?.meetingCategory?.form[
            config?.id ? "editCategory" : "addCategory"
          ]
        }
        onClose={hideForm}
        fitContent
      >
        <MeetingCategoryForm
          onCancel={hideForm}
          onSuccess={() => {
            hideForm();
            toast(
              <Toast
                text={
                  messages?.settings?.systemPreferences?.meetingCategory?.form
                    ?.success?.[config?.id ? "updated" : "created"]
                }
              />
            );
            applyFilters();
          }}
          isUpdate={!!config?.id}
          meetingCategory={config}
        />
      </Modal>

      <Modal
        show={deleteReasonformVisibility}
        heading={
          messages?.settings?.systemPreferences?.meetingCategory?.form
            ?.deactivateCategory
        }
        onClose={hideDeleteReasonForm}
        fitContent
      >
        <DeleteCTAForm
          onCancel={hideDeleteReasonForm}
          onSuccess={() => {
            hideDeleteReasonForm();
            toast(
              <Toast
                text={
                  messages?.settings?.systemPreferences?.meetingCategory?.form
                    ?.success?.deleteCategory
                }
              />
            );
            applyFilters();
          }}
          api={`${TENANT_MEETING_CATEGORY_BY_ID}/${deleteConfig?.id}`}
          bodyText={
            messages?.settings?.systemPreferences?.meetingCategory?.form?.note
          }
          cancelButton={
            messages?.settings?.systemPreferences?.meetingCategory?.form?.cancel
          }
          confirmButton={
            messages?.settings?.systemPreferences?.meetingCategory?.form
              ?.deactivateCategory
          }
          apiMethod={HttpMethods.PATCH}
          deleteBody={{
            status: Status.inactive,
            tenantId: tenantId,
          }}
        />
      </Modal>
    </Container>
  );
};

export default MeetingCategory;
