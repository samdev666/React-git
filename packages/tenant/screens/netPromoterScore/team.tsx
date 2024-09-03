import React, { useEffect, useState } from "react";
import { Container } from "../../components";
import {
  StyledHeadingTypography,
  StyledMainHeadingButtonContainer,
  StyledMainHeadingContainer,
} from "@wizehub/components/detailPageWrapper/styles";
import {
  StyledBudgestAndCapacityLeftHeadingContainer,
  StyledTeamCapacityBottomCardTypography,
} from "../plan/budgetAndCapacity/styles";
import messages from "../../messages";
import { Grid } from "@mui/material";
import {
  Button,
  Card,
  CustomInputComponent,
  MaterialAutocompleteInput,
  Modal,
  Toast,
} from "@wizehub/components";
import { ResponsiveDayViewIcon } from "../plan/budgetAndCapacity/budgetAndCapacity";
import {
  financialYearStartMonth,
  HttpMethods,
  mapIdNameToOptionWithTitleWithoutCaptializing,
  nullablePlaceHolder,
  totalValueMethod,
  ytdAverageDistribution,
} from "@wizehub/common/utils";
import {
  useEntity,
  useFormReducer,
  useOptions,
  usePopupReducer,
} from "@wizehub/common/hooks";
import {
  ResponsiveEditIcon,
  ResponsiveSyncIcon,
} from "../systemPreferences/launchPadSetup/launchPadSetupDetail";
import { Id, UserActionConfig } from "@wizehub/common/models";
import TeamPlanForm from "./teamPlanForm";
import {
  ADD_PLAN,
  RESYNC_TEAM_NPS,
  TEAM_NPS,
  TEAM_NPS_BY_ID,
  TEAM_NPS_PLAN_LISTING_API,
} from "../../api";
import {
  LockupPlanEntity,
  PlanEntity,
  TeamNPSEntity,
} from "@wizehub/common/models/genericEntities";
import { useSelector } from "react-redux";
import { ReduxState } from "../../redux/reducers";
import {
  StyledInnerGridDashedTableContainer,
  StyledInnerGridTableHeadingTypography,
  StyledTeamBudgetMonthNameTypography,
  StyledTeamBudgetScrollableContainer,
} from "../financialOverview/styles";
import {
  StyledDeleteTeamDataIcon,
  StyledTeamScoreMonthTypography,
} from "./styles";
import { useDispatch } from "react-redux";
import { apiCall, hideLoader, showLoader } from "@wizehub/common/redux/actions";
import { toast } from "react-toastify";
import { Months } from "@wizehub/common/models/modules";
import DeleteCTAForm from "../systemPreferences/launchPadSetup/deleteCTAForm";
import {
  StyledNoMVVInfo,
  StyledNoMVVInfoContainer,
} from "../firmProfile/styles";
import { StyledNoDataInfo } from "@wizehub/components/table/styles";

const Team = () => {
  const { tenantData, firmProfile } = useSelector((state: ReduxState) => state);
  const reduxDispatch = useDispatch();
  const { tenantId } = tenantData;
  const { connectField, formValues, change, submitting, handleSubmit } =
    useFormReducer();
  const [showUpdateButton, setShowUpdateButton] = useState<boolean>(false);

  const {
    visibility: createPlanFormVisibility,
    showPopup: showCreatePlanForm,
    hidePopup: hideCreatePlanForm,
  } = usePopupReducer<UserActionConfig>();

  const {
    visibility: removeTeamValueVisibility,
    showPopup: showRemoveTeamValueForm,
    hidePopup: hideRemoveTeamValueForm,
    metaData: removeTeamValueConfig,
  } = usePopupReducer<{
    teamId: Id;
  }>();

  const { options: planOptions, refreshOptions } = useOptions<LockupPlanEntity>(
    TEAM_NPS_PLAN_LISTING_API.replace(":tenantId", tenantId),
    true
  );

  const finanacialMonths = financialYearStartMonth(
    firmProfile?.financialYearStartMonth
  );

  const { entity: planEntity, refreshEntity } = useEntity<PlanEntity>(
    ADD_PLAN,
    planOptions.filter(
      (planId) => planId?.id === formValues?.plan?.value?.id
    )[0]?.plan?.id
  );

  const { entity: teamNpsEntity, refreshEntity: refreshTeamNpsEntity } =
    useEntity<Array<TeamNPSEntity>>(
      TEAM_NPS_BY_ID.replace(":tenantId", tenantId),
      planEntity?.planTeamNpsId
    );

  useEffect(() => {
    if (!formValues?.plan?.value?.id && planOptions.length > 0) {
      change("plan", {
        id: planOptions[0]?.id,
        label: planOptions[0]?.notes,
      });
      //   applyFilters();
    }
  }, [planOptions]);

  useEffect(() => {
    if (formValues?.plan?.value?.id) {
      refreshEntity();
    }
  }, [formValues?.plan?.value?.id]);

  useEffect(() => {
    if (planEntity) {
      refreshTeamNpsEntity();
    }
  }, [planEntity]);

  const teamList = teamNpsEntity?.map((team) => {
    return {
      id: team?.teamNpsId,
      teamName: team?.teamName,
    };
  });

  useEffect(() => {
    if (showUpdateButton) {
      teamNpsEntity?.map((team) => {
        team?.scores?.map((score) => {
          change(
            `${Months[score?.month - 1]?.label}-${team?.teamNpsId}-score`,
            score?.score
          );
        });
      });
    }
  }, [showUpdateButton]);

  useEffect(() => {
    reduxDispatch(showLoader());
    setTimeout(() => {
      reduxDispatch(hideLoader());
    }, 800);
  }, []);

  const handleResyncTeamNps = async () => {
    const sanitizedBody = {
      tenantId: tenantId,
      teamNpsId: planEntity?.planTeamNpsId,
    };
    return new Promise((resolve, reject) => {
      reduxDispatch(
        apiCall(
          RESYNC_TEAM_NPS,
          resolve,
          reject,
          HttpMethods.POST,
          sanitizedBody
        )
      );
    })
      .then(() => {
        refreshTeamNpsEntity();
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

  const onSubmit = async () => {
    return Promise.all(
      teamList?.map(
        (team) =>
          new Promise<void>((resolve, reject) => {
            reduxDispatch(
              apiCall(
                `${TEAM_NPS}/${team?.id}`,
                resolve,
                reject,
                HttpMethods.PATCH,
                {
                  tenantId: tenantId,
                  teamNpsId: planEntity?.planTeamNpsId,
                  scores: Array.from({ length: 12 }, (_, i) => {
                    const value =
                      formValues?.[`${Months[i].label}-${team?.id}-score`]
                        ?.value;
                    return { month: i + 1, value: value };
                  }),
                }
              )
            );
          })
      )
    )
      .then(() => {
        refreshTeamNpsEntity();
        teamNpsEntity?.map((team) => {
          team?.scores?.map((score) => {
            change(
              `${Months[score?.month - 1]?.label}-${team?.teamNpsId}-score`,
              undefined
            );
          });
        });
        toast(() => (
          <Toast text={messages?.measure?.netPromoterScore?.team?.success} />
        ));
        setShowUpdateButton(false);
      })
      .catch((error) => {
        toast(() => (
          <Toast
            type="error"
            text={
              messages?.measure?.netPromoterScore?.team?.error?.serverError?.[
                error?.message
              ]
            }
          />
        ));
      });
  };

  return (
    <Container noPadding>
      <StyledMainHeadingContainer>
        <StyledBudgestAndCapacityLeftHeadingContainer container xs={7}>
          <StyledHeadingTypography>
            {messages?.measure?.netPromoterScore?.team?.heading}
          </StyledHeadingTypography>
          <Grid container item xs={4} gap={2}>
            <Grid item xs={7}>
              {connectField("plan", {
                label: messages?.measure?.netPromoterScore?.team?.plan,
                options: planOptions?.map((planOption) => ({
                  id: planOption?.id,
                  label: planOption?.notes,
                })),
              })(MaterialAutocompleteInput)}
            </Grid>
            <Grid item xs={3}>
              <Button
                startIcon={<ResponsiveDayViewIcon />}
                variant="text"
                color="primary"
                label={messages?.measure?.netPromoterScore?.team?.plan}
                onClick={() => showCreatePlanForm()}
              />
            </Grid>
          </Grid>
        </StyledBudgestAndCapacityLeftHeadingContainer>
        <StyledMainHeadingButtonContainer>
          {!showUpdateButton && (
            <>
              <Button
                startIcon={<ResponsiveSyncIcon />}
                variant="outlined"
                color="secondary"
                label={messages?.measure?.financialOverview?.fees?.resyncTeam}
                onClick={() => handleResyncTeamNps()}
              />
              <Button
                startIcon={<ResponsiveEditIcon />}
                variant="outlined"
                color="secondary"
                label={messages?.measure?.netPromoterScore?.team?.edit}
                onClick={() => setShowUpdateButton(true)}
              />
            </>
          )}
        </StyledMainHeadingButtonContainer>
      </StyledMainHeadingContainer>
      <Grid container xs={12} padding="10px 20px 20px 20px">
        {teamNpsEntity?.length ? (
          <Card
            cardCss={{
              width: "100%",
            }}
            noHeader={true}
          >
            <Grid container item xs={12} gap={2}>
              <Grid container item xs={2}>
                <StyledInnerGridDashedTableContainer
                  item
                  xs={12}
                  noBorderBottom={!teamNpsEntity?.length}
                >
                  <StyledInnerGridTableHeadingTypography>
                    {messages?.measure?.netPromoterScore?.team?.npsSurveyResult}
                  </StyledInnerGridTableHeadingTypography>
                </StyledInnerGridDashedTableContainer>
                <StyledInnerGridDashedTableContainer
                  item
                  xs={12}
                  noBackgroundColor={true}
                  noBorderBottom={!teamNpsEntity?.length}
                  display={!teamNpsEntity?.length && "none"}
                ></StyledInnerGridDashedTableContainer>
                {teamList?.map((team, index) => {
                  return (
                    <>
                      <StyledInnerGridDashedTableContainer
                        key={team?.id}
                        item
                        xs={12}
                        noBorderBottom={index === teamNpsEntity?.length - 1}
                      >
                        <StyledTeamScoreMonthTypography>
                          {team?.teamName}
                        </StyledTeamScoreMonthTypography>
                      </StyledInnerGridDashedTableContainer>
                      <StyledInnerGridDashedTableContainer
                        item
                        xs={12}
                        noBackgroundColor={true}
                        display={index === teamNpsEntity?.length - 1 && "none"}
                      ></StyledInnerGridDashedTableContainer>
                    </>
                  );
                })}
              </Grid>
              <StyledTeamBudgetScrollableContainer
                container
                item
                xs
                flexGrow={1}
                display="grid"
                gridAutoFlow="column"
                overflow="auto"
              >
                {finanacialMonths?.map((month) => {
                  const monthList = teamNpsEntity?.map((team) => {
                    return team["scores"].filter(
                      (obj) => obj.month === month?.monthNumber
                    )[0];
                  });
                  return (
                    <Grid container item xs minWidth="65px" flexGrow={1}>
                      <StyledInnerGridDashedTableContainer
                        item
                        xs={12}
                        noBorderBottom={!monthList?.length}
                      >
                        <StyledTeamBudgetMonthNameTypography>
                          {month?.monthName}
                        </StyledTeamBudgetMonthNameTypography>
                      </StyledInnerGridDashedTableContainer>
                      <StyledInnerGridDashedTableContainer
                        item
                        xs={12}
                        noBackgroundColor={true}
                        noBorderBottom={!monthList?.length}
                        display={!monthList?.length && "none"}
                      ></StyledInnerGridDashedTableContainer>
                      {monthList?.map((monthBudget, index) => {
                        const teamAtThatIndex = teamList[index];
                        return (
                          <>
                            {!showUpdateButton ? (
                              <StyledInnerGridDashedTableContainer
                                item
                                xs={12}
                                noBorderBottom={index === monthList?.length - 1}
                              >
                                <StyledTeamScoreMonthTypography textAlign="center">
                                  {nullablePlaceHolder(monthBudget?.score)}
                                </StyledTeamScoreMonthTypography>
                              </StyledInnerGridDashedTableContainer>
                            ) : (
                              <StyledInnerGridDashedTableContainer
                                item
                                xs={12}
                                paddingValue="8px 16px"
                                noBorderBottom={index === monthList?.length - 1}
                              >
                                {connectField(
                                  `${month?.monthName}-${teamAtThatIndex?.id}-score`,
                                  {
                                    min: 0,
                                    max: 0,
                                    type: "number",
                                  }
                                )(CustomInputComponent)}
                              </StyledInnerGridDashedTableContainer>
                            )}
                            <StyledInnerGridDashedTableContainer
                              item
                              xs={12}
                              noBackgroundColor={true}
                              display={
                                index === monthList?.length - 1 && "none"
                              }
                            ></StyledInnerGridDashedTableContainer>
                          </>
                        );
                      })}
                    </Grid>
                  );
                })}
                <Grid container item xs minWidth="125px" flexGrow={1}>
                  <StyledInnerGridDashedTableContainer
                    item
                    xs={12}
                    noBorderBottom={!teamNpsEntity?.length}
                    paddingValue="3px 21px"
                  >
                    <StyledTeamCapacityBottomCardTypography textAlign="center">
                      {messages?.measure?.netPromoterScore?.team?.ytdAverage}
                    </StyledTeamCapacityBottomCardTypography>
                  </StyledInnerGridDashedTableContainer>
                  <StyledInnerGridDashedTableContainer
                    item
                    xs={12}
                    noBackgroundColor={true}
                    noBorderBottom={!teamNpsEntity?.length}
                    display={!teamNpsEntity?.length && "none"}
                  ></StyledInnerGridDashedTableContainer>
                  {teamNpsEntity?.map((employee, index) => {
                    const monthTotal = totalValueMethod(
                      employee?.scores,
                      "score"
                    );
                    const ytdAverage = ytdAverageDistribution(
                      monthTotal,
                      employee?.scores?.filter((score) => score?.score)?.length
                    );
                    return (
                      <>
                        <StyledInnerGridDashedTableContainer
                          item
                          xs={12}
                          noBorderBottom={index === teamNpsEntity?.length - 1}
                        >
                          <StyledTeamScoreMonthTypography textAlign="center">
                            {ytdAverage}
                          </StyledTeamScoreMonthTypography>
                        </StyledInnerGridDashedTableContainer>
                        <StyledInnerGridDashedTableContainer
                          item
                          xs={12}
                          noBackgroundColor={true}
                          display={
                            index === teamNpsEntity?.length - 1 && "none"
                          }
                        ></StyledInnerGridDashedTableContainer>
                      </>
                    );
                  })}
                </Grid>
                <Grid container item xs minWidth="125px" flexGrow={1}>
                  <StyledInnerGridDashedTableContainer
                    item
                    xs={12}
                    noBorderBottom={!teamNpsEntity?.length}
                  >
                    <StyledTeamCapacityBottomCardTypography textAlign="center">
                      {messages?.measure?.netPromoterScore?.team?.delete}
                    </StyledTeamCapacityBottomCardTypography>
                  </StyledInnerGridDashedTableContainer>
                  <StyledInnerGridDashedTableContainer
                    item
                    xs={12}
                    noBackgroundColor={true}
                    noBorderBottom={!teamNpsEntity?.length}
                    display={!teamNpsEntity?.length && "none"}
                  ></StyledInnerGridDashedTableContainer>
                  {teamNpsEntity?.map((employee, index) => {
                    return (
                      <>
                        <StyledInnerGridDashedTableContainer
                          item
                          xs={12}
                          noBorderBottom={index === teamNpsEntity?.length - 1}
                          alignItems="center"
                        >
                          <StyledDeleteTeamDataIcon
                            onClick={() =>
                              showRemoveTeamValueForm({
                                teamId: employee?.teamNpsId,
                              })
                            }
                          />
                        </StyledInnerGridDashedTableContainer>
                        <StyledInnerGridDashedTableContainer
                          item
                          xs={12}
                          noBackgroundColor={true}
                          display={
                            index === teamNpsEntity?.length - 1 && "none"
                          }
                        ></StyledInnerGridDashedTableContainer>
                      </>
                    );
                  })}
                </Grid>
              </StyledTeamBudgetScrollableContainer>
            </Grid>
          </Card>
        ) : (
          <StyledNoMVVInfoContainer>
            <StyledNoDataInfo>
              {messages?.measure?.financialOverview?.ebidta?.noPlanHeading}
            </StyledNoDataInfo>
          </StyledNoMVVInfoContainer>
        )}
        {showUpdateButton && (
          <Grid
            container
            padding="14px 0px"
            gap="15px"
            justifyContent="flex-end"
          >
            <Button
              label={messages?.measure?.netPromoterScore?.team?.cancel}
              variant="outlined"
              color="secondary"
              onClick={() => setShowUpdateButton(false)}
            />
            <Button
              label={messages?.measure?.netPromoterScore?.team?.update}
              variant="contained"
              color="primary"
              onClick={handleSubmit(onSubmit)}
              disabled={submitting}
            />
          </Grid>
        )}
      </Grid>
      <Modal
        show={createPlanFormVisibility}
        heading={messages?.measure?.netPromoterScore?.team?.planForm?.heading}
        onClose={() => {
          refreshOptions();
          hideCreatePlanForm();
        }}
        fitContent
      >
        <TeamPlanForm
          onCancel={hideCreatePlanForm}
          onSuccess={() => {
            hideCreatePlanForm();
          }}
        />
      </Modal>
      <Modal
        show={removeTeamValueVisibility}
        heading={messages?.measure?.netPromoterScore?.team?.deleteForm?.heading}
        onClose={hideRemoveTeamValueForm}
        fitContent
      >
        <DeleteCTAForm
          onCancel={hideRemoveTeamValueForm}
          onSuccess={() => {
            hideRemoveTeamValueForm();
            toast(
              <Toast
                text={
                  messages?.measure?.netPromoterScore?.team?.deleteForm?.success
                    ?.deleted
                }
              />
            );
            teamNpsEntity?.map((team) => {
              team?.scores?.map((score) => {
                change(
                  `${Months[score?.month - 1]?.label}-${team?.teamNpsId}-score`,
                  undefined
                );
              });
            });
            refreshTeamNpsEntity();
          }}
          api={`${TEAM_NPS}/${removeTeamValueConfig?.teamId}`}
          bodyText={messages?.measure?.netPromoterScore?.team?.deleteForm?.note}
          cancelButton={
            messages?.measure?.netPromoterScore?.team?.deleteForm?.cancel
          }
          confirmButton={
            messages?.measure?.netPromoterScore?.team?.deleteForm?.delete
          }
          apiMethod={HttpMethods.PATCH}
          deleteBody={{
            tenantId: tenantId,
            teamNpsId: planEntity?.planTeamNpsId,
            scores: Array.from({ length: 12 }, (_, i) => {
              return { month: i + 1, value: null };
            }),
          }}
        />
      </Modal>
    </Container>
  );
};

export default Team;
