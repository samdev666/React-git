import { Divider, Grid } from "@mui/material";
import { greyScaleColour } from "@wizehub/common/theme/style.palette";
import {
  Button,
  Card,
  CustomTabs,
  Modal,
  Table,
  Toast,
} from "@wizehub/components";
import React, { useEffect, useState } from "react";
import {
  StyledAddTeamSubTextTypography,
  StyledEntityTypography,
  StyledSecondaryButtonContainer,
  StyledTeamCapacityBottomCardTypography,
  StyledTeamCapacityPrimaryCardTypography,
  StyledValueTypography,
} from "./styles";
import messages from "../../../messages";
import { StyledSecondaryCardContainer } from "../../firmProfile/styles";
import { ResponsiveAddIcon } from "../../systemPreferences/launchPadSetup/launchPadSetup";
import {
  Id,
  MetaData,
  Option,
  getDefaultMetaData,
  PaginatedEntity,
  UserActionConfig,
} from "@wizehub/common/models";
import { usePagination, usePopupReducer } from "@wizehub/common/hooks";
import AddTeamMemberForm from "./addTeamMemberForm";
import {
  CapacityDivisionTeamEntity,
  TeamDivisionEntity,
  TeamMetadataEntity,
} from "@wizehub/common/models/genericEntities";
import {
  ALLOCATE_BUDGET,
  BUDGET_TEAM_DIVISION,
  BUDGET_TEAM_DIVISION_BY_ID,
  BUDGET_TEAM_METADATA,
  REMOVE_TEAM_MEMBER,
} from "../../../api";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import { useDispatch } from "react-redux";
import { apiCall, BUDGET_DIVISION_TEAM_ACTION } from "../../../redux/actions";
import {
  addAnyNumberOfValues,
  capitalizeLegend,
  formatCurrency,
  HttpMethods,
  nullablePlaceHolder,
} from "@wizehub/common/utils";
import {
  allocateBudgetFunction,
  twoSubtractFunction,
  twoSumFunction,
} from "./budgetAndCapacityFormula";
import { apiCall as actionApiCall } from "@wizehub/common/redux/actions";
import { toast } from "react-toastify";
import {
  finalCostPerHour,
  totalHours,
} from "../../firmProfile/people/mathFunctions";
import { StyledDeleteIcon } from "@wizehub/components/table/styles";
import DeleteCTAForm from "../../systemPreferences/launchPadSetup/deleteCTAForm";

interface Props {
  budgetId: Id;
  budgetTeamId: Id;
  teamReferentialId: Id;
}

const paginatedDivisionTeam: PaginatedEntity = {
  key: "budgetDivisionTeam",
  name: BUDGET_DIVISION_TEAM_ACTION,
  api: BUDGET_TEAM_DIVISION_BY_ID,
};

const getDefaultDivisionTeamFilter =
  (): MetaData<CapacityDivisionTeamEntity> => ({
    ...getDefaultMetaData<CapacityDivisionTeamEntity>(),
    order: "name",
  });

const TeamCapacity: React.FC<Props> = ({
  budgetId,
  budgetTeamId,
  teamReferentialId,
}) => {
  const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
  const reduxDispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<string>(null);
  const [teamDivision, setTeamDivision] =
    useState<Array<TeamDivisionEntity>>(null);
  const [teamMetadata, setTeamMetadata] = useState<Array<TeamMetadataEntity>>(
    []
  );
  const {
    visibility: createFormVisibility,
    showPopup: showCreateForm,
    hidePopup: hideCreateForm,
  } = usePopupReducer<UserActionConfig>();

  const {
    visibility: deleteTeamMemberVisibility,
    showPopup: showDeleteTeamMemberForm,
    hidePopup: hideDeleteTeamMemberForm,
    metaData: deleteMetaData,
  } = usePopupReducer<UserActionConfig>();

  const activeTeamMetadata = teamMetadata?.filter(
    (team) => team?.id === activeTab
  )[0];

  const {
    entity: divisionTeamEntity,
    updateFilters,
    applyFilters,
    fetchPage,
    updateLimit,
  } = usePagination<CapacityDivisionTeamEntity>(
    {
      ...paginatedDivisionTeam,
      api: BUDGET_TEAM_DIVISION_BY_ID.replace(":tenantId", tenantId).replace(
        ":divisionTeamId",
        activeTab
      ),
    },
    getDefaultDivisionTeamFilter()
  );

  useEffect(() => {
    if (budgetId && budgetTeamId) {
      reduxDispatch(
        apiCall(
          BUDGET_TEAM_DIVISION.replace(":tenantId", tenantId)
            .replace(":budgetId", budgetId?.toString())
            .replace(":budgetTeamId", budgetTeamId?.toString()),
          (resolve) => {
            setTeamDivision(resolve);
            setActiveTab(resolve[0]?.id);
            applyFilters();
          },
          (reject) => {
            console.log(reject);
          }
        )
      );
    }
  }, [budgetId, budgetTeamId]);

  useEffect(() => {
    reduxDispatch(
      apiCall(
        BUDGET_TEAM_METADATA.replace(":tenantId", tenantId).replace(
          ":teamId",
          budgetTeamId?.toString()
        ),
        (resolve) => {
          setTeamMetadata(resolve);
        },
        (reject) => {
          console.log(reject);
        }
      )
    );
  }, [divisionTeamEntity?.metadata?.total, budgetTeamId]);

  useEffect(() => {
    applyFilters();
  }, [activeTab]);

  const teamCapacityTabs: Option[] = teamDivision?.map((division) => {
    return {
      id: division?.id,
      label: capitalizeLegend(division?.name),
    };
  });

  const handleAllocateBudget = async () => {
    const activeTabId = teamMetadata?.filter(
      (team) => team?.id === activeTab
    )[0];
    const allocateBudgets = divisionTeamEntity?.records?.map((divisionTeam) => {
      return {
        id: divisionTeam?.id,
        allocatedBudget: allocateBudgetFunction(
          divisionTeam?.capacityFee,
          activeTabId?.totalCapacityFee,
          activeTabId?.totalAnnualBudget
        ),
      };
    });
    const sanitizedBody = {
      divisionTeamId: activeTabId?.id,
      tenantId: tenantId,
      allocatedBudgets: allocateBudgets,
    };
    return new Promise<void>((resolve, reject) => {
      reduxDispatch(
        actionApiCall(
          ALLOCATE_BUDGET,
          resolve,
          reject,
          HttpMethods.POST,
          sanitizedBody
        )
      );
    })
      .then(() => {
        toast(
          <Toast
            text={
              messages?.plan?.budgetAndCapacity?.teamCapacityTab?.success
                ?.allocated
            }
          />
        );
      })
      .catch((error) => {
        toast(
          <Toast
            text={
              messages?.plan?.budgetAndCapacity?.teamCapacityTab?.error
                ?.serverError?.[error?.message]
            }
            type="error"
          />
        );
      });
  };

  return (
    <>
      <Grid item xs={12}>
        <Card
          cardCss={{
            margin: "10px 0 10px 20px",
            backgroundColor: greyScaleColour.grey60,
            padding: "18px 24px",
          }}
          headerCss={{ display: "flex" }}
          noHeaderPadding={true}
        >
          <Grid container xs={12}>
            <StyledTeamCapacityPrimaryCardTypography>
              {messages?.plan?.budgetAndCapacity?.teamCapacityTab?.heading}
            </StyledTeamCapacityPrimaryCardTypography>
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ width: "100%", margin: "16px 0" }} />
          </Grid>
          <Grid container item xs={12} columnSpacing={2} rowGap={2}>
            <Grid item xs={2.5}>
              <StyledAddTeamSubTextTypography>
                {
                  messages?.plan?.budgetAndCapacity?.teamCapacityTab
                    ?.totalSalary
                }
              </StyledAddTeamSubTextTypography>
              <StyledEntityTypography>
                {teamMetadata[0]?.totalSalary || teamMetadata[1]?.totalSalary
                  ? formatCurrency(
                      twoSumFunction(
                        teamMetadata[0]?.totalSalary,
                        teamMetadata[1]?.totalSalary
                      )
                    )
                  : "-"}
              </StyledEntityTypography>
            </Grid>
            <Grid item xs={2.5}>
              <StyledAddTeamSubTextTypography>
                {messages?.plan?.budgetAndCapacity?.teamCapacityTab?.totalHours}
              </StyledAddTeamSubTextTypography>
              <StyledEntityTypography>
                {teamMetadata[0]?.totalHours || teamMetadata[1]?.totalHours
                  ? formatCurrency(
                      twoSumFunction(
                        teamMetadata[0]?.totalHours,
                        teamMetadata[1]?.totalHours
                      ),
                      false
                    )
                  : "-"}
              </StyledEntityTypography>
            </Grid>
            <Grid item xs={2.5}>
              <StyledAddTeamSubTextTypography>
                {
                  messages?.plan?.budgetAndCapacity?.teamCapacityTab
                    ?.productiveHours
                }
              </StyledAddTeamSubTextTypography>
              <StyledEntityTypography>
                {teamMetadata[0]?.productiveHours ||
                teamMetadata[1]?.productiveHours
                  ? formatCurrency(
                      twoSumFunction(
                        teamMetadata[0]?.productiveHours,
                        teamMetadata[1]?.productiveHours
                      ),
                      false
                    )
                  : "-"}
              </StyledEntityTypography>
            </Grid>
            <Grid item xs={2.5}>
              <StyledAddTeamSubTextTypography>
                {
                  messages?.plan?.budgetAndCapacity?.teamCapacityTab
                    ?.capacityFees
                }
              </StyledAddTeamSubTextTypography>
              <StyledEntityTypography>
                {teamMetadata[0]?.totalCapacityFee ||
                teamMetadata[1]?.totalCapacityFee
                  ? formatCurrency(
                      twoSumFunction(
                        teamMetadata[0]?.totalCapacityFee,
                        teamMetadata[1]?.totalCapacityFee
                      )
                    )
                  : "-"}
              </StyledEntityTypography>
            </Grid>
            <Grid item xs={2}>
              <StyledAddTeamSubTextTypography>
                {
                  messages?.plan?.budgetAndCapacity?.teamCapacityTab
                    ?.totalBudget
                }
              </StyledAddTeamSubTextTypography>
              <StyledEntityTypography>
                {teamMetadata[0]?.totalAnnualBudget ||
                teamMetadata[1]?.totalAnnualBudget
                  ? formatCurrency(
                      twoSumFunction(
                        teamMetadata[0]?.totalAnnualBudget,
                        teamMetadata[1]?.totalAnnualBudget
                      )
                    )
                  : "-"}
              </StyledEntityTypography>
            </Grid>
          </Grid>
        </Card>
        <Grid item xs={12} margin="0px 0px 12px 20px">
          <Divider sx={{ width: "100%" }} />
        </Grid>
        <Grid container item xs={12} height="fit-content">
          <StyledSecondaryCardContainer>
            <CustomTabs
              tabs={teamCapacityTabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <StyledSecondaryButtonContainer>
              <Button
                variant="outlined"
                color="secondary"
                label={
                  messages?.plan?.budgetAndCapacity?.teamCapacityTab
                    ?.allocateBudget
                }
                onClick={async () => {
                  await handleAllocateBudget();
                  applyFilters();
                }}
                disabled={!divisionTeamEntity?.records?.length}
              />
              <Button
                startIcon={<ResponsiveAddIcon />}
                variant="contained"
                color="primary"
                label={
                  messages?.plan?.budgetAndCapacity?.teamCapacityTab
                    ?.addTeamMember
                }
                onClick={() => showCreateForm()}
              />
            </StyledSecondaryButtonContainer>
          </StyledSecondaryCardContainer>
        </Grid>
        <Card
          noHeader
          cardCss={{
            margin: "12px 0 20px 20px",
            overflow: "hidden !important",
          }}
        >
          <Table
            specs={[
              {
                id: "name",
                label:
                  messages?.plan?.budgetAndCapacity?.teamCapacityTab?.table
                    ?.name,
              },
              {
                id: "role",
                label:
                  messages?.plan?.budgetAndCapacity?.teamCapacityTab?.table
                    ?.role,
                getValue: (row: CapacityDivisionTeamEntity) => row?.role,
                format: (row: { id: Id; name: string }) => row?.name,
              },
              {
                id: "type",
                label:
                  messages?.plan?.budgetAndCapacity?.teamCapacityTab?.table
                    ?.type,

                getValue: (row: CapacityDivisionTeamEntity) => row?.type,
                format: (row) => capitalizeLegend(row),
              },
              {
                id: "capacityFee",
                label:
                  messages?.plan?.budgetAndCapacity?.teamCapacityTab?.table
                    ?.capacityFees,
                getValue: (row: CapacityDivisionTeamEntity) => row?.capacityFee,
                format: (row) => (row ? formatCurrency(row) : "-"),
              },
              {
                id: "annualBudget",
                label:
                  messages?.plan?.budgetAndCapacity?.teamCapacityTab?.table
                    ?.estAnnualBudget,
                getValue: (row: CapacityDivisionTeamEntity) =>
                  row?.annualBudget,
                format: (row) => (row ? formatCurrency(row) : "-"),
              },
            ]}
            data={divisionTeamEntity?.records}
            metadata={divisionTeamEntity?.metadata}
            actions={[
              {
                id: "delete",
                render(row: CapacityDivisionTeamEntity) {
                  return <StyledDeleteIcon active={true} />;
                },
                onClick: (row: CapacityDivisionTeamEntity) => {
                  showDeleteTeamMemberForm({
                    id: row?.id,
                  });
                },
              },
            ]}
            expandRow={(row: CapacityDivisionTeamEntity) => {
              return (
                <Grid container xs={12} columnSpacing={2} rowGap={2}>
                  <Grid container item xs={2.4}>
                    <Grid item xs={12}>
                      <StyledAddTeamSubTextTypography>
                        {
                          messages?.plan?.budgetAndCapacity?.teamCapacityTab
                            ?.table?.experience
                        }
                      </StyledAddTeamSubTextTypography>
                      <StyledValueTypography>
                        {nullablePlaceHolder(row?.experience)}
                      </StyledValueTypography>
                    </Grid>
                  </Grid>
                  <Grid container item xs={2.4}>
                    <Grid item xs={12}>
                      <StyledAddTeamSubTextTypography>
                        {
                          messages?.plan?.budgetAndCapacity?.teamCapacityTab
                            ?.table?.location
                        }
                      </StyledAddTeamSubTextTypography>
                      <StyledValueTypography>
                        {row?.location ? row?.location : "-"}
                      </StyledValueTypography>
                    </Grid>
                  </Grid>
                  <Grid container item xs={2.4}>
                    <Grid item xs={12}>
                      <StyledAddTeamSubTextTypography>
                        {
                          messages?.plan?.budgetAndCapacity?.teamCapacityTab
                            ?.table?.salary
                        }
                      </StyledAddTeamSubTextTypography>
                      <StyledValueTypography>
                        {formatCurrency(row?.salary)}
                      </StyledValueTypography>
                    </Grid>
                  </Grid>
                  <Grid container item xs={2.4}>
                    <Grid item xs={12}>
                      <StyledAddTeamSubTextTypography>
                        {
                          messages?.plan?.budgetAndCapacity?.teamCapacityTab
                            ?.table?.workingWeeks
                        }
                      </StyledAddTeamSubTextTypography>
                      <StyledValueTypography>
                        {nullablePlaceHolder(
                          twoSubtractFunction(
                            row?.workingWeeks,
                            addAnyNumberOfValues(
                              row?.sickLeave,
                              row?.publicHolidays,
                              row?.annualLeave
                            )
                          )
                        )}
                      </StyledValueTypography>
                    </Grid>
                  </Grid>
                  <Grid container item xs={2.4}>
                    <Grid item xs={12}>
                      <StyledAddTeamSubTextTypography>
                        {
                          messages?.plan?.budgetAndCapacity?.teamCapacityTab
                            ?.table?.hoursPerWeek
                        }
                      </StyledAddTeamSubTextTypography>
                      <StyledValueTypography>
                        {nullablePlaceHolder(row?.hoursPerWeek)}
                      </StyledValueTypography>
                    </Grid>
                  </Grid>
                  <Grid container item xs={2.4}>
                    <Grid item xs={12}>
                      <StyledAddTeamSubTextTypography>
                        {
                          messages?.plan?.budgetAndCapacity?.teamCapacityTab
                            ?.table?.totalHours
                        }
                      </StyledAddTeamSubTextTypography>
                      <StyledValueTypography>
                        {nullablePlaceHolder(
                          totalHours(row?.workingWeeks, row?.hoursPerWeek)
                        )}
                      </StyledValueTypography>
                    </Grid>
                  </Grid>
                  <Grid container item xs={2.4}>
                    <Grid item xs={12}>
                      <StyledAddTeamSubTextTypography>
                        {
                          messages?.plan?.budgetAndCapacity?.teamCapacityTab
                            ?.table?.productivity
                        }
                      </StyledAddTeamSubTextTypography>
                      <StyledValueTypography>
                        {nullablePlaceHolder(row?.productivity)}
                      </StyledValueTypography>
                    </Grid>
                  </Grid>
                  <Grid container item xs={2.4}>
                    <Grid item xs={12}>
                      <StyledAddTeamSubTextTypography>
                        {
                          messages?.plan?.budgetAndCapacity?.teamCapacityTab
                            ?.table?.productiveHours
                        }
                      </StyledAddTeamSubTextTypography>
                      <StyledValueTypography>
                        {nullablePlaceHolder(row?.productiveHours)}
                      </StyledValueTypography>
                    </Grid>
                  </Grid>
                  <Grid container item xs={2.4}>
                    <Grid item xs={12}>
                      <StyledAddTeamSubTextTypography>
                        {
                          messages?.plan?.budgetAndCapacity?.teamCapacityTab
                            ?.table?.costPerHour
                        }
                      </StyledAddTeamSubTextTypography>
                      <StyledValueTypography>
                        {formatCurrency(
                          finalCostPerHour(
                            row?.salary,
                            totalHours(row?.workingWeeks, row?.hoursPerWeek)
                          )
                        )}
                      </StyledValueTypography>
                    </Grid>
                  </Grid>
                  <Grid container item xs={2.4}>
                    <Grid item xs={12}>
                      <StyledAddTeamSubTextTypography>
                        {
                          messages?.plan?.budgetAndCapacity?.teamCapacityTab
                            ?.table?.chargeRate
                        }
                      </StyledAddTeamSubTextTypography>
                      <StyledValueTypography>
                        {formatCurrency(row?.chargeRate)}
                      </StyledValueTypography>
                    </Grid>
                  </Grid>
                </Grid>
              );
            }}
            fetchPage={fetchPage}
            updateLimit={updateLimit}
            disableSorting={["status", "sno", "role", "type"]}
            updateFilters={(filterParams: any) => {
              updateFilters(filterParams);
              applyFilters();
            }}
            isExpandable={true}
          />
          <Grid
            container
            item
            xs={12}
            padding="18px 20px"
            borderTop={`1px solid ${greyScaleColour.grey80}`}
          >
            <Grid container item xs={12}>
              <StyledTeamCapacityBottomCardTypography>
                {`${
                  messages?.plan?.budgetAndCapacity?.teamCapacityTab?.total
                } ( ${capitalizeLegend(
                  teamDivision?.filter((team) => team?.id === activeTab)[0]
                    ?.name
                )} Team )`}
              </StyledTeamCapacityBottomCardTypography>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ width: "100%", margin: "16px 0" }} />
            </Grid>
            <Grid container item xs={12} columnSpacing={2} rowGap={2}>
              <Grid item xs={2.5}>
                <StyledAddTeamSubTextTypography>
                  {
                    messages?.plan?.budgetAndCapacity?.teamCapacityTab
                      ?.totalSalary
                  }
                </StyledAddTeamSubTextTypography>
                <StyledEntityTypography>
                  {formatCurrency(activeTeamMetadata?.totalSalary)}
                </StyledEntityTypography>
              </Grid>
              <Grid item xs={2.5}>
                <StyledAddTeamSubTextTypography>
                  {
                    messages?.plan?.budgetAndCapacity?.teamCapacityTab
                      ?.totalHours
                  }
                </StyledAddTeamSubTextTypography>
                <StyledEntityTypography>
                  {nullablePlaceHolder(activeTeamMetadata?.totalHours)}
                </StyledEntityTypography>
              </Grid>
              <Grid item xs={2.5}>
                <StyledAddTeamSubTextTypography>
                  {
                    messages?.plan?.budgetAndCapacity?.teamCapacityTab
                      ?.productiveHours
                  }
                </StyledAddTeamSubTextTypography>
                <StyledEntityTypography>
                  {nullablePlaceHolder(activeTeamMetadata?.productiveHours)}
                </StyledEntityTypography>
              </Grid>
              <Grid item xs={2.5}>
                <StyledAddTeamSubTextTypography>
                  {
                    messages?.plan?.budgetAndCapacity?.teamCapacityTab
                      ?.capacityFees
                  }
                </StyledAddTeamSubTextTypography>
                <StyledEntityTypography>
                  {formatCurrency(activeTeamMetadata?.totalCapacityFee)}
                </StyledEntityTypography>
              </Grid>
              <Grid item xs={2}>
                <StyledAddTeamSubTextTypography>
                  {
                    messages?.plan?.budgetAndCapacity?.teamCapacityTab
                      ?.totalBudget
                  }
                </StyledAddTeamSubTextTypography>
                <StyledEntityTypography>
                  {formatCurrency(activeTeamMetadata?.totalAnnualBudget)}
                </StyledEntityTypography>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Modal
        show={createFormVisibility}
        heading={
          messages?.plan?.budgetAndCapacity?.teamCapacityTab?.teamMemberForm
            ?.heading
        }
        onClose={hideCreateForm}
        fitContent
      >
        <AddTeamMemberForm
          onCancel={hideCreateForm}
          onSuccess={() => {
            hideCreateForm();
            applyFilters();
          }}
          teamDivisionId={activeTab}
          teamReferentialId={teamReferentialId}
        />
      </Modal>
      <Modal
        show={deleteTeamMemberVisibility}
        heading={
          messages?.plan?.budgetAndCapacity?.teamCapacityTab?.teamMemberForm
            ?.deleteEmployee
        }
        onClose={hideDeleteTeamMemberForm}
        fitContent
      >
        <DeleteCTAForm
          onCancel={hideDeleteTeamMemberForm}
          onSuccess={async () => {
            hideDeleteTeamMemberForm();
            toast(
              <Toast
                text={
                  messages?.plan?.budgetAndCapacity?.teamCapacityTab
                    ?.teamMemberForm?.success?.deleted
                }
              />
            );
            await handleAllocateBudget();
            applyFilters();
          }}
          api={`${REMOVE_TEAM_MEMBER}/${deleteMetaData?.id}`}
          bodyText={
            messages?.plan?.budgetAndCapacity?.teamCapacityTab?.teamMemberForm
              ?.note
          }
          cancelButton={
            messages?.settings?.systemPreferences?.teamPositions?.form?.cancel
          }
          confirmButton={
            messages?.plan?.budgetAndCapacity?.teamCapacityTab?.teamMemberForm
              ?.deleteEmployee
          }
          apiMethod={HttpMethods.DELETE}
          hasInfoText={true}
          infoText={
            messages?.plan?.budgetAndCapacity?.teamCapacityTab?.teamMemberForm
              ?.infoText
          }
        />
      </Modal>
    </>
  );
};

export default TeamCapacity;
