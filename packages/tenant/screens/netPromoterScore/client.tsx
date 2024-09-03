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
import {
  ADD_PLAN,
  CLIENT_NPS,
  CLIENT_NPS_BY_ID,
  CLIENT_NPS_PLAN_LISTING_API,
  CLIENT_NPS_RESPONSE_RATE_BY_ID,
  CLIENT_NPS_RESPONSE_RATE_LISTING_API,
  RESYNC_CLIENT_NPS,
} from "../../api";
import {
  ClientNpsResponseRateEntity,
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
import ClientPlanForm from "./clientPlanForm";
import { greyScaleColour } from "@wizehub/common/theme/style.palette";
import {
  StyledNoMVVInfo,
  StyledNoMVVInfoContainer,
} from "../firmProfile/styles";
import { StyledNoDataInfo } from "@wizehub/components/table/styles";

const Client = () => {
  const { tenantData, firmProfile } = useSelector((state: ReduxState) => state);
  const [clientResponseRate, setClientResponseRate] = useState<
    Array<ClientNpsResponseRateEntity>
  >([]);
  const reduxDispatch = useDispatch();
  const { tenantId } = tenantData;
  const { connectField, formValues, change, submitting, handleSubmit } =
    useFormReducer();
  const [showUpdateButton, setShowUpdateButton] = useState<boolean>(false);
  const [showRefresh, setShowRefresh] = useState<boolean>(false);

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
    CLIENT_NPS_PLAN_LISTING_API.replace(":tenantId", tenantId),
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
      CLIENT_NPS_BY_ID.replace(":tenantId", tenantId),
      planEntity?.planClientNpsId
    );

  useEffect(() => {
    if (!formValues?.plan?.value?.id && planOptions.length > 0) {
      change("plan", {
        id: planOptions[0]?.id,
        label: planOptions[0]?.notes,
      });
    }
  }, [planOptions]);

  useEffect(() => {
    if (formValues?.plan?.value?.id) {
      refreshEntity();
    }
  }, [formValues?.plan?.value?.id]);

  useEffect(() => {
    if (planEntity && !showUpdateButton) {
      refreshTeamNpsEntity();
      reduxDispatch(
        apiCall(
          CLIENT_NPS_RESPONSE_RATE_LISTING_API.replace(
            ":tenantId",
            tenantId
          ).replace(":clientNpsId", planEntity?.planClientNpsId?.toString()),
          (resolve) => {
            setClientResponseRate(resolve);
          },
          (reject) => {}
        )
      );
      setShowRefresh(false);
    }
  }, [planEntity, showUpdateButton, showRefresh]);

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
      clientResponseRate?.map((client) => {
        change(
          `${Months[client?.month - 1]?.label}-response`,
          client?.responseRate
        );
      });
    }
  }, [showUpdateButton]);

  useEffect(() => {
    reduxDispatch(showLoader());
    setTimeout(() => {
      reduxDispatch(hideLoader());
    }, 800);
  }, []);

  const handleResyncClientNps = async () => {
    const sanitizedBody = {
      tenantId: tenantId,
      clientNpsId: planEntity?.planClientNpsId,
    };
    return new Promise((resolve, reject) => {
      reduxDispatch(
        apiCall(
          RESYNC_CLIENT_NPS,
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
                `${CLIENT_NPS}/${team?.id}`,
                resolve,
                reject,
                HttpMethods.PATCH,
                {
                  tenantId: tenantId,
                  clientNpsId: planEntity?.planClientNpsId,
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
      .then(async () => {
        return new Promise<void>((resolve, reject) => {
          reduxDispatch(
            apiCall(
              CLIENT_NPS_RESPONSE_RATE_BY_ID,
              resolve,
              reject,
              HttpMethods.PATCH,
              {
                tenantId: tenantId,
                clientNpsId: planEntity?.planClientNpsId,
                responseRates: Array.from({ length: 12 }, (_, i) => {
                  const value =
                    formValues?.[`${Months[i].label}-response`]?.value;
                  return { month: i + 1, value: value };
                }),
              }
            )
          );
        })
          .then(() => {
            refreshTeamNpsEntity();
            toast(() => (
              <Toast
                text={messages?.measure?.netPromoterScore?.client?.success}
              />
            ));
            teamNpsEntity?.map((team) => {
              team?.scores?.map((score) => {
                change(
                  `${Months[score?.month - 1]?.label}-${team?.teamNpsId}-score`,
                  undefined
                );
              });
            });
            clientResponseRate?.map((client) => {
              change(`${Months[client?.month - 1]?.label}-response`, undefined);
            });
            setShowUpdateButton(false);
          })
          .catch((error) => {});
      })
      .catch((error) => {
        toast(() => (
          <Toast
            type="error"
            text={
              messages?.measure?.netPromoterScore?.client?.error?.serverError?.[
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
            {messages?.measure?.netPromoterScore?.client?.heading}
          </StyledHeadingTypography>
          <Grid container item xs={4} gap={2}>
            <Grid item xs={7}>
              {connectField("plan", {
                label: messages?.measure?.netPromoterScore?.client?.plan,
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
                label={messages?.measure?.netPromoterScore?.client?.plan}
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
                onClick={() => handleResyncClientNps()}
              />
              <Button
                startIcon={<ResponsiveEditIcon />}
                variant="outlined"
                color="secondary"
                label={messages?.measure?.netPromoterScore?.client?.edit}
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
                    {
                      messages?.measure?.netPromoterScore?.client
                        ?.npsSurveyResult
                    }
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
                <StyledInnerGridDashedTableContainer
                  item
                  xs={12}
                  noBackgroundColor={true}
                ></StyledInnerGridDashedTableContainer>
                <StyledInnerGridDashedTableContainer
                  item
                  xs={12}
                  noBorderBottom={true}
                >
                  <StyledInnerGridTableHeadingTypography>
                    {messages?.measure?.netPromoterScore?.client?.responseRate}
                  </StyledInnerGridTableHeadingTypography>
                </StyledInnerGridDashedTableContainer>
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
                  const clientNpsResponse = clientResponseRate?.filter(
                    (client) => client?.month === month?.monthNumber
                  )[0]?.responseRate;
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
                              <StyledInnerGridDashedTableContainer item xs={12}>
                                <StyledTeamScoreMonthTypography textAlign="center">
                                  {nullablePlaceHolder(monthBudget?.score)}
                                </StyledTeamScoreMonthTypography>
                              </StyledInnerGridDashedTableContainer>
                            ) : (
                              <StyledInnerGridDashedTableContainer
                                item
                                xs={12}
                                paddingValue="8px 16px"
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
                      <StyledInnerGridDashedTableContainer
                        item
                        xs={12}
                        noBackgroundColor={true}
                      ></StyledInnerGridDashedTableContainer>
                      {!showUpdateButton ? (
                        <StyledInnerGridDashedTableContainer
                          item
                          xs={12}
                          noBorderBottom={true}
                        >
                          <StyledInnerGridTableHeadingTypography
                            textAlign="center"
                            inputColor={greyScaleColour?.secondaryMain}
                          >
                            {clientNpsResponse ? clientNpsResponse : "-"}
                          </StyledInnerGridTableHeadingTypography>
                        </StyledInnerGridDashedTableContainer>
                      ) : (
                        <StyledInnerGridDashedTableContainer
                          item
                          xs={12}
                          paddingValue="8px 16px"
                          noBorderBottom={true}
                        >
                          {connectField(`${month?.monthName}-response`, {
                            min: 0,
                            max: 0,
                            type: "number",
                          })(CustomInputComponent)}
                        </StyledInnerGridDashedTableContainer>
                      )}
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
                      {messages?.measure?.netPromoterScore?.client?.ytdAverage}
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
                  <StyledInnerGridDashedTableContainer
                    item
                    xs={12}
                    noBackgroundColor={true}
                  ></StyledInnerGridDashedTableContainer>
                  <StyledInnerGridDashedTableContainer
                    item
                    xs={12}
                    noBorderBottom={true}
                  >
                    <StyledInnerGridTableHeadingTypography
                      textAlign="center"
                      inputColor={greyScaleColour?.secondaryMain}
                    >
                      {ytdAverageDistribution(
                        totalValueMethod(clientResponseRate, "responseRate"),
                        clientResponseRate?.filter(
                          (responseRate) => responseRate?.responseRate
                        )?.length
                      )}
                    </StyledInnerGridTableHeadingTypography>
                  </StyledInnerGridDashedTableContainer>
                </Grid>
                <Grid container item xs minWidth="125px" flexGrow={1}>
                  <StyledInnerGridDashedTableContainer
                    item
                    xs={12}
                    noBorderBottom={!teamNpsEntity?.length}
                  >
                    <StyledTeamCapacityBottomCardTypography textAlign="center">
                      {messages?.measure?.netPromoterScore?.client?.delete}
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
                  <StyledInnerGridDashedTableContainer
                    item
                    xs={12}
                    noBackgroundColor={true}
                  ></StyledInnerGridDashedTableContainer>
                  <StyledInnerGridDashedTableContainer
                    item
                    xs={12}
                    noBorderBottom={true}
                    alignItems="center"
                  >
                    <StyledDeleteTeamDataIcon
                      onClick={() => showRemoveTeamValueForm()}
                    />
                  </StyledInnerGridDashedTableContainer>
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
              label={messages?.measure?.netPromoterScore?.client?.cancel}
              variant="outlined"
              color="secondary"
              onClick={() => setShowUpdateButton(false)}
              disabled={submitting}
            />
            <Button
              label={messages?.measure?.netPromoterScore?.client?.update}
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
        heading={messages?.measure?.netPromoterScore?.client?.planForm?.heading}
        onClose={() => {
          refreshOptions();
          hideCreatePlanForm();
        }}
        fitContent
      >
        <ClientPlanForm
          onCancel={hideCreatePlanForm}
          onSuccess={() => {
            hideCreatePlanForm();
          }}
        />
      </Modal>
      <Modal
        show={removeTeamValueVisibility}
        heading={
          messages?.measure?.netPromoterScore?.client?.deleteForm?.heading
        }
        onClose={hideRemoveTeamValueForm}
        fitContent
      >
        <DeleteCTAForm
          onCancel={hideRemoveTeamValueForm}
          onSuccess={() => {
            hideRemoveTeamValueForm();
            refreshTeamNpsEntity();
            setShowRefresh(true);
            teamNpsEntity?.map((team) => {
              team?.scores?.map((score) => {
                change(
                  `${Months[score?.month - 1]?.label}-${team?.teamNpsId}-score`,
                  undefined
                );
              });
            });
            clientResponseRate?.map((client) => {
              change(`${Months[client?.month - 1]?.label}-response`, undefined);
            });
            toast(
              <Toast
                text={
                  messages?.measure?.netPromoterScore?.client?.deleteForm
                    ?.success?.deleted
                }
              />
            );
          }}
          api={
            removeTeamValueConfig?.teamId
              ? `${CLIENT_NPS}/${removeTeamValueConfig?.teamId}`
              : CLIENT_NPS_RESPONSE_RATE_BY_ID
          }
          bodyText={
            messages?.measure?.netPromoterScore?.client?.deleteForm?.note
          }
          cancelButton={
            messages?.measure?.netPromoterScore?.client?.deleteForm?.cancel
          }
          confirmButton={
            messages?.measure?.netPromoterScore?.client?.deleteForm?.delete
          }
          apiMethod={HttpMethods.PATCH}
          deleteBody={
            removeTeamValueConfig?.teamId
              ? {
                  tenantId: tenantId,
                  clientNpsId: planEntity?.planClientNpsId,
                  scores: Array.from({ length: 12 }, (_, i) => {
                    return { month: i + 1, value: null };
                  }),
                }
              : {
                  tenantId: tenantId,
                  clientNpsId: planEntity?.planClientNpsId,
                  responseRates: Array.from({ length: 12 }, (_, i) => {
                    return { month: i + 1, value: null };
                  }),
                }
          }
        />
      </Modal>
    </Container>
  );
};

export default Client;
