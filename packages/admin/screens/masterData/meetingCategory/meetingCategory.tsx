import React, { useState } from "react";
import {
  Button,
  Card,
  MaterialAutocompleteInput,
  Modal,
  SearchInput,
  Stepper,
  Toast,
} from "@wizehub/components";
import {
  MetaData,
  Option,
  PaginatedEntity,
  getDefaultMetaData,
} from "@wizehub/common/models";
import { usePagination, usePopupReducer } from "@wizehub/common/hooks";
import { Grid } from "@mui/material";
import Table, { formatStatus } from "@wizehub/components/table";
import { toast } from "react-toastify";
import { StyledEditIcon } from "@wizehub/components/table/styles";
import { HttpMethods, capitalizeEntireString } from "@wizehub/common/utils";
import { Status } from "@wizehub/common/models/modules";
import {
  CategoryEntity,
  FeeLostReasonEntity,
} from "@wizehub/common/models/genericEntities";
import { Container } from "../../../components";
import {
  StyledDeleteIcon,
  StyledMasterDataHeadingContainer,
  StyledMasterDataLeftHeadingContainer,
} from "../styles";
import messages from "../../../messages";
import { CATEGORY_LISTING, FEELOSTREASONLISTING } from "../../../redux/actions";
import {
  CATEGORY_BY_ID,
  CATEGORY_LISTING_API,
  FEE_LOST_REASON,
} from "../../../api";
// import AddFeeLostReason from './addFeeLostReasonForm';
import DeleteCTAForm from "../../tenantManagement/deleteCTAForm";
import { StyledHeadingTypography } from "../../userManagement/styles";
import { ResponsiveAddIcon } from "../../productManagement/productManagement";
import MeetingCategoryForm from "./meetingCategoryForm";

interface Props {}

const paginatedMeetingCateogry: PaginatedEntity = {
  key: "cateogry",
  name: CATEGORY_LISTING,
  api: CATEGORY_LISTING_API,
};

const getDefaultMeetingCateogryFilter = (): MetaData<CategoryEntity> => ({
  ...getDefaultMetaData<CategoryEntity>(),
  order: "name",
});

const MeetingCategory: React.FC<Props> = () => {
  const {
    entity: meetingCateogry,
    updateFilters,
    applyFilters,
    connectFilter,
    fetchPage,
    updateLimit,
  } = usePagination<CategoryEntity>(
    paginatedMeetingCateogry,
    getDefaultMeetingCateogryFilter()
  );

  const {
    visibility: formVisibility,
    showPopup: showForm,
    hidePopup: hideForm,
    metaData: config,
  } = usePopupReducer<CategoryEntity>();

  const {
    visibility: deleteReasonformVisibility,
    showPopup: showDeleteReasonForm,
    hidePopup: hideDeleteReasonForm,
    metaData: deleteConfig,
  } = usePopupReducer<CategoryEntity>();

  return (
    <Container noPadding>
      <StyledMasterDataHeadingContainer>
        <StyledMasterDataLeftHeadingContainer>
          <Stepper />
          <StyledHeadingTypography>
            {
              messages?.sidebar?.menuItems?.secondaryMenu?.subMenuItems
                ?.masterData?.subItems?.meetingCategory?.heading
            }
          </StyledHeadingTypography>
        </StyledMasterDataLeftHeadingContainer>
        <Button
          startIcon={<ResponsiveAddIcon />}
          variant="contained"
          color="primary"
          label={
            messages?.sidebar?.menuItems?.secondaryMenu?.subMenuItems
              ?.masterData?.subItems?.meetingCategory?.addButton
          }
          onClick={showForm}
        />
      </StyledMasterDataHeadingContainer>

      <Card cardCss={{ margin: "0 20px" }} noHeaderPadding>
        <Table
          specs={[
            {
              id: "sno",
              label:
                messages?.sidebar?.menuItems?.secondaryMenu?.subMenuItems
                  ?.masterData?.subItems?.meetingCategory?.table?.sno,
            },
            {
              id: "name",
              label:
                messages?.sidebar?.menuItems?.secondaryMenu?.subMenuItems
                  ?.masterData?.subItems?.meetingCategory?.table?.name,
            },
            {
              id: "status",
              label:
                messages?.sidebar?.menuItems?.secondaryMenu?.subMenuItems
                  ?.masterData?.subItems?.meetingCategory?.table?.status,
              getValue: (row: FeeLostReasonEntity) => row?.status,
              format: (row: Status) => formatStatus(row),
            },
          ]}
          data={meetingCateogry.records}
          metadata={meetingCateogry.metadata}
          actions={[
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
          ]}
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
          messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
            .subItems.feeLostReason.form[
            config?.id ? "editReason" : "addReason"
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
                  messages?.sidebar?.menuItems?.secondaryMenu?.subMenuItems
                    ?.masterData?.subItems?.meetingCategory?.form?.success?.[
                    config?.id ? "updated" : "created"
                  ]
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
          messages?.sidebar?.menuItems?.secondaryMenu?.subMenuItems?.masterData
            ?.subItems?.meetingCategory?.form?.deactivateCategory
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
                  messages?.sidebar?.menuItems?.secondaryMenu?.subMenuItems
                    ?.masterData?.subItems?.meetingCategory?.form?.success
                    ?.deleteCategory
                }
              />
            );
            applyFilters();
          }}
          api={`${CATEGORY_BY_ID}/${deleteConfig?.id}`}
          bodyText={
            messages?.sidebar?.menuItems?.secondaryMenu?.subMenuItems
              ?.masterData?.subItems?.meetingCategory?.form?.note
          }
          cancelButton={
            messages?.sidebar?.menuItems?.secondaryMenu?.subMenuItems
              ?.masterData?.subItems?.meetingCategory?.form?.cancel
          }
          confirmButton={
            messages?.sidebar?.menuItems?.secondaryMenu?.subMenuItems
              ?.masterData?.subItems?.meetingCategory?.form?.deactivateCategory
          }
          apiMethod={HttpMethods.PATCH}
          deleteBody={{
            status: Status.inactive,
          }}
        />
      </Modal>
    </Container>
  );
};

export default MeetingCategory;
