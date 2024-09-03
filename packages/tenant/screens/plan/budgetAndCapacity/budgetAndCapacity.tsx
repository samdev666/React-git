import React, { useEffect, useState } from "react";
import { Container } from "../../../components";
import {
  StyledHeadingTypography,
  StyledMainHeadingButtonContainer,
  StyledMainHeadingContainer,
  StyledMainLeftHeadingContainer,
} from "@wizehub/components/detailPageWrapper/styles";
import messages from "../../../messages";
import {
  Button,
  MaterialAutocompleteInput,
  Modal,
  MultiTabComponent,
} from "@wizehub/components";
import { ResponsiveAddIcon } from "../../systemPreferences/launchPadSetup/launchPadSetup";
import { ResponsiveEditIcon } from "../../systemPreferences/launchPadSetup/launchPadSetupDetail";
import {
  useActiveTabLocation,
  useEntity,
  useFormReducer,
  useOptions,
  usePagination,
  usePopupReducer,
} from "@wizehub/common/hooks";
import {
  StyledBudgestAndCapacityLeftHeadingContainer,
  StyledMainCardHeaderContainer,
} from "./styles";
import { Divider, Grid } from "@mui/material";
import ViewDayOutlinedIcon from "@mui/icons-material/ViewDayOutlined";
import {
  ADD_PLAN,
  BUDGET_TEAM_LISTING_API,
  PLAN_LISTING_API,
} from "../../../api";
import {
  StyledNoDataInfo,
  StyledNoDataInfoContainer,
  StyledResponsiveIcon,
} from "@wizehub/components/table/styles";
import {
  BudgetAndCapacityEnum,
  Id,
  MetaData,
  PaginatedEntity,
  UserActionConfig,
  getDefaultMetaData,
} from "@wizehub/common/models";
import PlanForm from "./planForm";
import {
  BudgetTeamEntity,
  PlanEntity,
} from "@wizehub/common/models/genericEntities";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import { mapIdNameToOptionWithoutCaptializing } from "@wizehub/common/utils";
import { BUDGET_TEAM_ACTION, setBudgetPlan } from "../../../redux/actions";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { routes } from "../../../utils";
import FeeBudget from "./feeBudget";
import TeamCapacity from "./teamCapacity";
import { useHistory } from "react-router-dom";
import { hideLoader, showLoader } from "@wizehub/common/redux/actions";
import TeamBudget from "./teamBudget";
import DistributeBudgetForm from "./distributeBudgetForm";
import SummaryResults from "./summaryResults";
import AddchartIcon from "@mui/icons-material/Addchart";
import { greyScaleColour } from "@wizehub/common/theme/style.palette";
import NoTeamPopup from "../../financialOverview/feeWonAndLost/noTeamPopup";

export const ResponsiveDayViewIcon = StyledResponsiveIcon(ViewDayOutlinedIcon);

export const paginatedBudgetTeam: PaginatedEntity = {
  key: "budgetTeam",
  name: BUDGET_TEAM_ACTION,
  api: BUDGET_TEAM_LISTING_API,
};

export const getDefaultBudgetTeamFilter = (): MetaData<BudgetTeamEntity> => ({
  ...getDefaultMetaData<BudgetTeamEntity>(),
  order: "createdOn",
  direction: "desc",
  allResults: true,
});

const getDefaulBudgetAndCapacityPlanFilter = (): MetaData<PlanEntity> => ({
  ...getDefaultMetaData<PlanEntity>(),
  allResults: true,
});

const budgetAndCapacityTabs = [
  {
    id: "feeBudget",
    label: messages?.plan?.budgetAndCapacity?.feeBudget,
  },
  {
    id: "teamCapacity",
    label: messages?.plan?.budgetAndCapacity?.teamCapacity,
  },
  {
    id: "teamBudget",
    label: messages?.plan?.budgetAndCapacity?.teamBudget,
  },
  {
    id: "summaryResults",
    label: messages?.plan?.budgetAndCapacity?.summaryResults,
  },
];

const BudgetAndCapacity = () => {
  const reduxDispatch = useDispatch();
  const selectedPlan = useSelector(
    (state: ReduxState) => state?.selectedBudgetAndCapacityPlan
  );
  const { connectField, formValues, change } = useFormReducer();
  const history = useHistory();
  const [activeTeam, setActiveTeam] = useState<Id>(null);
  const [multiActiveTab, setMultiActiveTab] = useState<string>(
    budgetAndCapacityTabs[0]?.id
  );
  const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);

  const {
    visibility: createPlanFormVisibility,
    showPopup: showCreatePlanForm,
    hidePopup: hideCreatePlanForm,
  } = usePopupReducer<UserActionConfig>();

  const {
    visibility: distributeFormVisibility,
    showPopup: showDistributeForm,
    hidePopup: hideDistributeForm,
  } = usePopupReducer<UserActionConfig>();

  const {
    visibility: noPlanPopupVisibility,
    showPopup: showNoPlanPopup,
    hidePopup: hideNoPlanPopup,
  } = usePopupReducer();

  const { entity: planEntity, refreshEntity } = useEntity<PlanEntity>(
    ADD_PLAN,
    formValues?.plan?.value?.id
  );

  const { entity: budgetTeam, applyFilters } = usePagination<BudgetTeamEntity>(
    {
      ...paginatedBudgetTeam,
      api: BUDGET_TEAM_LISTING_API.replace(":tenantId", tenantId).replace(
        ":budgetId",
        planEntity?.planBudgetId.toString()
      ),
    },
    getDefaultBudgetTeamFilter()
  );

  const teamTabs = budgetTeam?.records?.map((team) => {
    return {
      id: team?.id,
      label: team?.team?.name,
    };
  });

  const { options: planOptions, refreshOptions } = useOptions<PlanEntity>(
    PLAN_LISTING_API.replace(":tenantId", tenantId),
    true,
    getDefaulBudgetAndCapacityPlanFilter()
  );

  useEffect(() => {
    if (teamTabs && !activeTeam) {
      setActiveTeam(teamTabs[0]?.id);
    }
  }, [teamTabs]);

  useEffect(() => {
    if (!formValues?.plan?.value?.id && planOptions.length > 0) {
      if (selectedPlan) {
        const filterPlan = planOptions?.filter(
          (plan) => plan?.id === selectedPlan
        )[0];
        change("plan", {
          id: filterPlan?.id,
          label: filterPlan?.name,
        });
      } else {
        change("plan", {
          id: planOptions[0]?.id,
          label: planOptions[0]?.name,
        });
      }
      refreshEntity();
    }
  }, [planOptions]);

  useEffect(() => {
    if (formValues?.plan?.value?.id) {
      reduxDispatch(setBudgetPlan.update(formValues?.plan?.value?.id));
      refreshEntity();
    }
  }, [formValues?.plan?.value?.id]);

  useEffect(() => {
    if (budgetTeam?.metadata?.total) {
      setActiveTeam(budgetTeam?.records[0]?.id);
    }
  }, [formValues?.plan?.value?.id, budgetTeam]);

  useEffect(() => {
    if (planEntity) {
      applyFilters();
    }
  }, [planEntity]);

  useEffect(() => {
    if (formValues?.plan?.value?.id) {
      reduxDispatch(showLoader());
      setTimeout(() => {
        reduxDispatch(hideLoader());
      }, 800);
    }
  }, [multiActiveTab, formValues?.plan?.value?.id]);

  return (
    <Container noPadding>
      <StyledMainHeadingContainer>
        <StyledBudgestAndCapacityLeftHeadingContainer container xs={7}>
          <StyledHeadingTypography>
            {messages?.plan?.budgetAndCapacity?.heading}
          </StyledHeadingTypography>
          <Grid container item xs={4} gap={2}>
            <Grid item xs={7}>
              {connectField("plan", {
                label: messages?.plan?.budgetAndCapacity?.plan,
                options: planOptions?.map(mapIdNameToOptionWithoutCaptializing),
              })(MaterialAutocompleteInput)}
            </Grid>
            <Grid item xs={3}>
              <Button
                startIcon={<ResponsiveDayViewIcon />}
                variant="text"
                color="primary"
                label={messages?.plan?.budgetAndCapacity?.plan}
                onClick={() => {
                  showCreatePlanForm();
                }}
              />
            </Grid>
          </Grid>
        </StyledBudgestAndCapacityLeftHeadingContainer>
        <StyledMainHeadingButtonContainer>
          <Button
            startIcon={<AddchartIcon />}
            variant="outlined"
            color="primary"
            label={messages?.plan?.budgetAndCapacity?.firmWideResults}
            onClick={() => {
              history.push(routes.budgetAndCapacity.firmWideResults, {
                budgetId: planEntity?.planBudgetId,
              });
            }}
          />
          {multiActiveTab === budgetAndCapacityTabs[0]?.id &&
            budgetTeam?.records?.length > 0 && (
              <Button
                startIcon={<ResponsiveEditIcon />}
                variant="outlined"
                color="secondary"
                label={messages?.plan?.budgetAndCapacity?.editDetails}
                onClick={() => {
                  reduxDispatch(
                    push(
                      routes.budgetAndCapacity.editTeam
                        .replace(
                          ":currentYear",
                          planOptions
                            ?.filter(
                              (plan) => plan?.id === formValues?.plan?.value?.id
                            )[0]
                            ?.financialYear?.toString()
                        )
                        .replace(
                          ":budgetId",
                          planEntity?.planBudgetId?.toString()
                        )
                        .replace(":activeTeamId", activeTeam?.toString())
                    )
                  );
                }}
              />
            )}
          {multiActiveTab === budgetAndCapacityTabs[0]?.id && (
            <Button
              startIcon={<ResponsiveAddIcon />}
              variant="contained"
              color="primary"
              label={messages?.plan?.budgetAndCapacity?.addTeam?.heading}
              onClick={() => {
                planOptions?.length
                  ? reduxDispatch(
                      push(
                        routes.budgetAndCapacity.addTeam
                          .replace(
                            ":currentYear",
                            planOptions
                              ?.filter(
                                (plan) =>
                                  plan?.id === formValues?.plan?.value?.id
                              )[0]
                              ?.financialYear?.toString()
                          )
                          .replace(
                            ":budgetId",
                            planEntity?.planBudgetId?.toString()
                          )
                      )
                    )
                  : showNoPlanPopup();
              }}
            />
          )}
          {multiActiveTab === budgetAndCapacityTabs[2]?.id && (
            <Button
              startIcon={<ResponsiveAddIcon />}
              variant="contained"
              color="primary"
              label={
                messages?.plan?.budgetAndCapacity?.teamBudgetTab
                  ?.distributeBudget
              }
              onClick={() => showDistributeForm()}
            />
          )}
        </StyledMainHeadingButtonContainer>
      </StyledMainHeadingContainer>
      {budgetTeam?.metadata?.total ? (
        <StyledMainCardHeaderContainer>
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
              tabs={teamTabs}
              activeTab={activeTeam}
              setActiveTab={setActiveTeam}
              orientation="vertical"
            />
          </Grid>
          <Divider sx={{ borderWidth: "1px", marginLeft: "20px" }} />
          <Grid container item xs={9.9} height="fit-content">
            <Grid container item xs={12} ml="20px">
              <MultiTabComponent
                tabs={budgetAndCapacityTabs}
                activeTab={multiActiveTab}
                setActiveTab={setMultiActiveTab}
              />
            </Grid>
            <Grid container item xs={12}>
              {multiActiveTab === budgetAndCapacityTabs[0]?.id && (
                <FeeBudget
                  activeTeam={activeTeam}
                  currentYear={
                    planOptions?.filter(
                      (plan) => plan?.id === formValues?.plan?.value?.id
                    )[0]?.financialYear
                  }
                />
              )}
              {multiActiveTab === budgetAndCapacityTabs[1]?.id && (
                <TeamCapacity
                  budgetId={planEntity?.planBudgetId}
                  budgetTeamId={activeTeam}
                  teamReferentialId={
                    budgetTeam?.records?.filter(
                      (item) => item?.id === activeTeam
                    )[0]?.team?.id
                  }
                />
              )}
              {multiActiveTab === budgetAndCapacityTabs[2]?.id && (
                <TeamBudget
                  budgetId={planEntity?.planBudgetId}
                  budgetTeamId={activeTeam}
                  distributeFormVisibility={distributeFormVisibility}
                  hideDistributeForm={hideDistributeForm}
                  feePlanId={planEntity?.planFeeId}
                />
              )}
              {multiActiveTab === budgetAndCapacityTabs[3]?.id && (
                <SummaryResults
                  budgetId={planEntity?.planBudgetId}
                  budgetTeamId={activeTeam}
                />
              )}
            </Grid>
          </Grid>
        </StyledMainCardHeaderContainer>
      ) : (
        <StyledNoDataInfoContainer>
          <StyledNoDataInfo>
            {messages?.firmProfile?.teamStructure?.noTeamFound}
          </StyledNoDataInfo>
        </StyledNoDataInfoContainer>
      )}
      <Modal
        show={createPlanFormVisibility}
        heading={messages?.plan?.budgetAndCapacity?.planForm?.heading}
        onClose={() => {
          hideCreatePlanForm();
          refreshOptions();
        }}
        fitContent
      >
        <PlanForm
          onCancel={hideCreatePlanForm}
          onSuccess={() => {
            hideCreatePlanForm();
            refreshOptions();
          }}
        />
      </Modal>
      <Modal show={noPlanPopupVisibility} onClose={hideNoPlanPopup} fitContent>
        <NoTeamPopup
          onSuccess={hideNoPlanPopup}
          body={messages?.plan?.budgetAndCapacity?.planForm?.noPlan}
        />
      </Modal>
    </Container>
  );
};

export default BudgetAndCapacity;
