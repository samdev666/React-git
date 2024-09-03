import React, { useEffect, useState } from "react";
import { Container } from "../../../components";
import {
  StyledHeadingTypography,
  StyledMainHeadingButtonContainer,
  StyledMainHeadingContainer,
  StyledMainLeftHeadingContainer,
} from "@wizehub/components/detailPageWrapper/styles";
import { Button, CustomTabs, Modal, Toast } from "@wizehub/components";
import messages from "../../../messages";
import { ResponsiveAddIcon } from "../../systemPreferences/launchPadSetup/launchPadSetup";
import { usePagination, usePopupReducer } from "@wizehub/common/hooks";
import { MissionVisionValueInterface } from "@wizehub/common/models/genericEntities";
import {
  Id,
  MetaData,
  Option,
  PaginatedEntity,
  getDefaultMetaData,
} from "@wizehub/common/models";
import {
  MISSION_VISION_VALUE_BY_ID,
  MISSION_VISION_VALUE_LISTING_API,
} from "../../../api";
import { MISSION_VISION_VALUE_ACTION } from "../../../redux/actions";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import { Grid } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  StyledAccordian,
  StyledAccordianLeftContainer,
  StyledAccordianRightContainer,
  StyledAccordianSubHeading,
  StyledAccordionSummary,
  StyledNoMVVInfoContainer,
  StyledRedDeleteIcon,
} from "../styles";
import { formatStatus } from "@wizehub/components/table";
import {
  // ResponsiveDeleteIcon,
  ResponsiveEditIcon,
} from "../../systemPreferences/launchPadSetup/launchPadSetupDetail";
import ExpandAccordian from "./expandAccordian";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { routes } from "../../../utils";
import { useHistory } from "react-router-dom";
import { Status } from "@wizehub/common/models/modules";
import {
  StyledNoDataInfo,
  StyledResponsiveIcon,
} from "@wizehub/components/table/styles";
import { Right } from "../../../redux/reducers/auth";
import DeleteCTAForm from "../../systemPreferences/launchPadSetup/deleteCTAForm";
import { toast } from "react-toastify";
import { HttpMethods } from "@wizehub/common/utils";

interface Props {}

const ResponsiveDeleteIcon = StyledResponsiveIcon(StyledRedDeleteIcon);

const mvvTabs: Option[] = [
  {
    id: "active",
    label: messages?.firmProfile?.missionVisionValues?.active,
  },
  {
    id: "all",
    label: messages?.firmProfile?.missionVisionValues?.all,
  },
];

const paginatedMissionVisionValue: PaginatedEntity = {
  key: "missionVisionValue",
  name: MISSION_VISION_VALUE_ACTION,
  api: MISSION_VISION_VALUE_LISTING_API,
};

const getDefaultMissionVisionValueFilter =
  (): MetaData<MissionVisionValueInterface> => ({
    ...getDefaultMetaData<MissionVisionValueInterface>(),
    order: "title",
    filters: {
      status: Status.active,
    },
    allResults: true,
  });

const MissionVisionValue: React.FC<Props> = () => {
  const { tenantData, auth } = useSelector((state: ReduxState) => state);
  const { tenantId } = tenantData;
  const [expanded, setExpanded] = useState<Record<Id, boolean>>({});
  const [activeTab, setActiveTab] = useState<"active" | "all">("active");
  const history = useHistory();

  const reduxDispatch = useDispatch();
  const disabledItems = auth?.rights?.some(
    (item) => item === Right.TENANT_MISSION_VISION_VALUES_MANAGEMENT_READ_ONLY
  );

  const handleChange = (id: Id) => (event: any, isExpanded: boolean) => {
    setExpanded((prev) => ({ ...prev, [id]: isExpanded }));
  };
  const {
    entity: missionVisionValueEntity,
    updateFilters,
    applyFilters,
    resetFilters,
  } = usePagination<MissionVisionValueInterface>(
    {
      ...paginatedMissionVisionValue,
      api: MISSION_VISION_VALUE_LISTING_API.replace(":tenantId", tenantId),
    },
    getDefaultMissionVisionValueFilter()
  );

  useEffect(() => {
    if (activeTab === "all") {
      updateFilters({
        filters: {
          status: null,
        },
      });
      applyFilters();
    } else {
      resetFilters();
    }
    setExpanded({});
  }, [activeTab]);

  const {
    visibility: deleteMVvFormVisibility,
    showPopup: showDeleteMvvForm,
    hidePopup: hideDeleteMvvForm,
    metaData: deleteMvvConfig,
  } = usePopupReducer<{
    id: Id;
  }>();

  return (
    <Container noPadding>
      <StyledMainHeadingContainer>
        <StyledMainLeftHeadingContainer>
          <StyledHeadingTypography>
            {messages?.firmProfile?.missionVisionValues?.heading}
          </StyledHeadingTypography>
        </StyledMainLeftHeadingContainer>
        <StyledMainHeadingButtonContainer>
          {!disabledItems && (
            <Button
              startIcon={<ResponsiveAddIcon />}
              variant="contained"
              color="primary"
              label={messages?.firmProfile?.missionVisionValues?.button}
              onClick={() => {
                reduxDispatch(
                  push(routes.firmProfile.addNewMissionVisionValues)
                );
              }}
            />
          )}
        </StyledMainHeadingButtonContainer>
      </StyledMainHeadingContainer>
      <Grid container xs={12}>
        <CustomTabs
          tabs={mvvTabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </Grid>
      <Grid container padding="0 20px">
        <Grid item xs={12}>
          {missionVisionValueEntity?.records?.length ? (
            missionVisionValueEntity?.records?.map((missionVisionValue) => (
              <StyledAccordian
                key={missionVisionValue?.id}
                expanded={
                  activeTab === "active"
                    ? missionVisionValue?.status === Status.active
                    : !!expanded[missionVisionValue?.id]
                }
                onChange={handleChange(missionVisionValue?.id)}
              >
                <StyledAccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  id={missionVisionValue?.id.toString()}
                >
                  <StyledAccordianLeftContainer>
                    <StyledAccordianSubHeading>
                      {missionVisionValue?.title}
                    </StyledAccordianSubHeading>
                  </StyledAccordianLeftContainer>
                  <StyledAccordianRightContainer>
                    {activeTab !== "active" &&
                      formatStatus(missionVisionValue?.status)}
                    {!disabledItems && (
                      <>
                        <ResponsiveDeleteIcon
                          onClick={(e: any) => {
                            e.stopPropagation();
                            showDeleteMvvForm({ id: missionVisionValue?.id });
                          }}
                        />
                        <ResponsiveEditIcon
                          onClick={() =>
                            history.push(
                              routes.firmProfile.addNewMissionVisionValues,
                              {
                                mvvId: missionVisionValue?.id,
                              }
                            )
                          }
                        />
                      </>
                    )}
                  </StyledAccordianRightContainer>
                </StyledAccordionSummary>
                {(!!expanded[missionVisionValue?.id] ||
                  missionVisionValue?.status === Status.active) && (
                  <ExpandAccordian accordianId={missionVisionValue?.id} />
                )}
              </StyledAccordian>
            ))
          ) : (
            <StyledNoMVVInfoContainer>
              <StyledNoDataInfo>
                {messages?.firmProfile?.missionVisionValues?.addNewMvvText}
              </StyledNoDataInfo>
            </StyledNoMVVInfoContainer>
          )}
        </Grid>
      </Grid>
      <Modal
        show={deleteMVvFormVisibility}
        heading={
          messages?.firmProfile?.missionVisionValues?.deleteForm?.heading
        }
        onClose={hideDeleteMvvForm}
        fitContent
      >
        <DeleteCTAForm
          onCancel={hideDeleteMvvForm}
          onSuccess={() => {
            hideDeleteMvvForm();
            toast(
              <Toast
                text={
                  messages?.firmProfile?.missionVisionValues?.deleteForm
                    ?.success
                }
              />
            );
            if (activeTab === "all") {
              updateFilters({
                filters: {
                  status: null,
                },
              });
              applyFilters();
            } else {
              resetFilters();
            }
            setExpanded({});
          }}
          api={`${MISSION_VISION_VALUE_BY_ID}/${deleteMvvConfig?.id}`}
          bodyText={
            messages?.firmProfile?.missionVisionValues?.deleteForm?.note
          }
          cancelButton={
            messages?.firmProfile?.missionVisionValues?.deleteForm?.cancel
          }
          confirmButton={
            messages?.firmProfile?.missionVisionValues?.deleteForm?.delete
          }
          apiMethod={HttpMethods.DELETE}
        />
      </Modal>
    </Container>
  );
};

export default MissionVisionValue;
