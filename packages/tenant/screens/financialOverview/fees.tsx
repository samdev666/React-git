import React, { useEffect, useState } from "react";
import { Container } from "../../components";
import {
  StyledHeadingTypography,
  StyledMainHeadingButtonContainer,
  StyledMainHeadingContainer,
} from "@wizehub/components/detailPageWrapper/styles";
import {
  StyledBudgestAndCapacityLeftHeadingContainer,
  StyledMainCardHeaderContainer,
} from "../plan/budgetAndCapacity/styles";
import messages from "../../messages";
import { Divider, Grid } from "@mui/material";
import {
  Button,
  MaterialAutocompleteInput,
  Modal,
  MultiTabComponent,
  Toast,
} from "@wizehub/components";
import {
  getDefaultBudgetTeamFilter,
  ResponsiveDayViewIcon,
} from "../plan/budgetAndCapacity/budgetAndCapacity";
import {
  useActiveTabLocation,
  useEntity,
  useFormReducer,
  useOptions,
  usePagination,
  usePopupReducer,
} from "@wizehub/common/hooks";
import { Id, PaginatedEntity, UserActionConfig } from "@wizehub/common/models";
import {
  ResponsiveEditIcon,
  ResponsiveSyncIcon,
} from "../systemPreferences/launchPadSetup/launchPadSetupDetail";
import { push } from "connected-react-router";
import { routes } from "../../utils";
import FeeBreakdown from "./feeBreakdown";
import VarianceAnalysis from "./varianceAnalysis";
import { useDispatch } from "react-redux";
import FeePlanForm from "./feePlanForm";
import {
  BudgetTeamEntity,
  LockupPlanEntity,
  PlanEntity,
} from "@wizehub/common/models/genericEntities";
import { useSelector } from "react-redux";
import { ReduxState } from "../../redux/reducers";
import {
  ADD_PLAN,
  FEE_PLAN_LISTING_API,
  FEE_TEAM_LISTING_API,
  RESYNC_FEE_TEAM,
} from "../../api";
import {
  HttpMethods,
  mapIdNameToOptionWithTitleWithoutCaptializing,
} from "@wizehub/common/utils";
import { FEE_TEAM_ACTION } from "../../redux/actions";
import { apiCall, hideLoader, showLoader } from "@wizehub/common/redux/actions";
import { toast } from "react-toastify";
import { greyScaleColour } from "@wizehub/common/theme/style.palette";
import {
  StyledNoMVVInfo,
  StyledNoMVVInfoContainer,
} from "../firmProfile/styles";
import { StyledNoDataInfo } from "@wizehub/components/table/styles";

export const paginatedFeeTeam: PaginatedEntity = {
  key: "feeTeam",
  name: FEE_TEAM_ACTION,
  api: FEE_TEAM_LISTING_API,
};

const feeTabs = [
  {
    id: "feeBreakdown",
    label: messages?.measure?.financialOverview?.fees?.feeBreakdown,
    route: routes.financialOverview.feeBreakdown,
  },
  {
    id: "varianceAnalysis",
    label: messages?.measure?.financialOverview?.fees?.varianceAnalysis,
    route: routes.financialOverview.varianceAnalysis,
  },
];

const Fees = () => {
  const reduxDispatch = useDispatch();
  const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
  const { connectField, formValues, change } = useFormReducer();
  const [activeTeam, setActiveTeam] = useState<Id>(null);
  const [multiActiveTab, setMultiActiveTab] = useState<string>(feeTabs[0]?.id);

  const {
    visibility: createPlanFormVisibility,
    showPopup: showCreatePlanForm,
    hidePopup: hideCreatePlanForm,
  } = usePopupReducer<UserActionConfig>();

  const { options: planOptions, refreshOptions } = useOptions<LockupPlanEntity>(
    FEE_PLAN_LISTING_API.replace(":tenantId", tenantId),
    true
  );

  const { entity: planEntity, refreshEntity } = useEntity<PlanEntity>(
    ADD_PLAN,
    planOptions.filter(
      (planId) => planId?.id === formValues?.plan?.value?.id
    )[0]?.plan?.id
  );

  const { entity: feeTeam, applyFilters } = usePagination<BudgetTeamEntity>(
    {
      ...paginatedFeeTeam,
      api: FEE_TEAM_LISTING_API.replace(":tenantId", tenantId).replace(
        ":feeId",
        planEntity?.planFeeId?.toString()
      ),
    },
    getDefaultBudgetTeamFilter()
  );

  const handleResyncTeam = async () => {
    const sanitizedBody = {
      tenantId: tenantId,
      feeId: planEntity?.planFeeId,
    };
    return new Promise((resolve, reject) => {
      reduxDispatch(
        apiCall(
          RESYNC_FEE_TEAM,
          resolve,
          reject,
          HttpMethods.POST,
          sanitizedBody
        )
      );
    })
      .then(() => {
        applyFilters();
        toast(
          <Toast
            text={
              messages?.measure?.financialOverview?.fees?.resyncTeamForm
                ?.success
            }
          />
        );
      })
      .catch((error) => {
        toast(
          <Toast
            text={
              messages?.measure?.financialOverview?.fees?.resyncTeamForm
                ?.error?.[error?.message]
            }
          />
        );
      });
  };

  const feeTeamTabs = feeTeam?.records?.map((team) => {
    return {
      id: team?.id,
      label: team?.team?.name,
    };
  });

  feeTeamTabs.push({
    id: "firm-wide",
    label: "Firm Wide",
  });

  const currentYear = planOptions?.filter(
    (planOption) => planOption?.id === formValues?.plan?.value?.id
  )[0]?.plan?.financialYear;

  useEffect(() => {
    if (!formValues?.plan?.value?.id && planOptions.length > 0) {
      change("plan", {
        id: planOptions[0]?.id,
        label: planOptions[0]?.title,
      });
      applyFilters();
    }
  }, [planOptions]);

  useEffect(() => {
    if (feeTeamTabs && !activeTeam) {
      setActiveTeam(feeTeamTabs[0]?.id);
    }
  }, [feeTeamTabs]);

  useEffect(() => {
    if (formValues?.plan?.value?.id) {
      refreshEntity();
    }
  }, [formValues?.plan?.value?.id]);

  useEffect(() => {
    if (feeTeam?.metadata?.total) {
      setActiveTeam(feeTeam?.records[0]?.id);
    }
  }, [feeTeam, formValues?.plan?.value?.id]);

  useEffect(() => {
    if (planEntity) {
      applyFilters();
    }
  }, [planEntity]);

  useEffect(() => {
    reduxDispatch(showLoader());
    setTimeout(() => {
      reduxDispatch(hideLoader());
    }, 800);
  }, []);

  return (
    <Container noPadding>
      <StyledMainHeadingContainer>
        <StyledBudgestAndCapacityLeftHeadingContainer container xs={7}>
          <StyledHeadingTypography>
            {messages?.measure?.financialOverview?.fees?.heading}
          </StyledHeadingTypography>
          <Grid container item xs={4} gap={2}>
            <Grid item xs={7}>
              {connectField("plan", {
                label: messages?.measure?.financialOverview?.fees?.plan,
                options: planOptions?.map(
                  mapIdNameToOptionWithTitleWithoutCaptializing
                ),
              })(MaterialAutocompleteInput)}
            </Grid>
            <Grid item xs={3}>
              <Button
                startIcon={<ResponsiveDayViewIcon />}
                variant="text"
                color="primary"
                label={messages?.measure?.financialOverview?.fees?.plan}
                onClick={() => {
                  showCreatePlanForm();
                }}
              />
            </Grid>
          </Grid>
        </StyledBudgestAndCapacityLeftHeadingContainer>
        <StyledMainHeadingButtonContainer>
          <Button
            startIcon={<ResponsiveSyncIcon />}
            variant="outlined"
            color="secondary"
            label={messages?.measure?.financialOverview?.fees?.resyncTeam}
            onClick={() => handleResyncTeam()}
          />
        </StyledMainHeadingButtonContainer>
      </StyledMainHeadingContainer>
      <StyledMainCardHeaderContainer>
        {planOptions.length ? (
          feeTeam?.records?.length ? (
            <>
              <Grid
                container
                item
                xs={2.1}
                display="flex"
                flexDirection="column"
                height="70vh"
                overflow="auto"
                sx={{ backgroundColor: greyScaleColour.grey60 }}
              >
                <MultiTabComponent
                  tabs={feeTeamTabs}
                  activeTab={activeTeam}
                  setActiveTab={setActiveTeam}
                  orientation="vertical"
                  noBackgroundColor={true}
                />
              </Grid>
              <Divider sx={{ borderWidth: "1px", marginLeft: "20px" }} />
              <Grid container item xs={9.9} height="fit-content">
                <Grid container item xs={12} ml="20px">
                  <MultiTabComponent
                    tabs={feeTabs}
                    activeTab={multiActiveTab}
                    setActiveTab={setMultiActiveTab}
                  />
                </Grid>
                <Grid container item xs={12}>
                  {multiActiveTab === feeTabs[0]?.id && (
                    <FeeBreakdown
                      feeId={planEntity?.planFeeId}
                      feeTeamId={activeTeam}
                      currentYear={currentYear}
                    />
                  )}
                  {multiActiveTab === feeTabs[1]?.id && (
                    <VarianceAnalysis
                      feeId={planEntity?.planFeeId}
                      feeTeamId={activeTeam}
                      budgetId={planEntity?.planBudgetId}
                    />
                  )}
                </Grid>
              </Grid>
            </>
          ) : (
            <StyledNoMVVInfoContainer>
              <StyledNoDataInfo>
                {messages?.measure?.financialOverview?.fees?.noTeamFound}
              </StyledNoDataInfo>
            </StyledNoMVVInfoContainer>
          )
        ) : (
          <StyledNoMVVInfoContainer>
            <StyledNoDataInfo>
              {messages?.measure?.financialOverview?.ebidta?.noPlanHeading}
            </StyledNoDataInfo>
          </StyledNoMVVInfoContainer>
        )}
      </StyledMainCardHeaderContainer>
      <Modal
        show={createPlanFormVisibility}
        heading={messages?.measure?.financialOverview?.fees?.planForm?.heading}
        onClose={() => {
          refreshOptions();
          hideCreatePlanForm();
        }}
        fitContent
      >
        <FeePlanForm
          onCancel={hideCreatePlanForm}
          onSuccess={() => {
            hideCreatePlanForm();
          }}
        />
      </Modal>
    </Container>
  );
};

export default Fees;
