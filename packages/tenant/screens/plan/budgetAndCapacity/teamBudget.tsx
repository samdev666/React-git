import { Card, Modal, Toast } from "@wizehub/components";
import React, { useEffect, useState } from "react";
import {
  StyledInnerGridDashedTableContainer,
  StyledInnerGridTableBoldTypography,
  StyledInnerGridTableHeadingTypography,
  StyledTeamBudgetMonthNameTypography,
  StyledTeamBudgetScrollableContainer,
} from "../../financialOverview/styles";
import messages from "../../../messages";
import { Grid } from "@mui/material";
import {
  financialYearStartMonth,
  nullablePlaceHolder,
  totalValueMethod,
} from "@wizehub/common/utils";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import { Id, UserActionConfig } from "@wizehub/common/models";
import { useDispatch } from "react-redux";
import { apiCall } from "../../../redux/actions";
import { TEAM_BUDGET_LISTING_API } from "../../../api";
import { TeamBudgetEntity } from "@wizehub/common/models/genericEntities";
import { toast } from "react-toastify";
import {
  StyledEditEmployeeBudgetEditIcon,
  StyledTeamBudgetEmployeeTypography,
  StyledTeamBudgetMonthTypography,
  StyledTeamCapacityBottomCardTypography,
} from "./styles";
import { ResponsiveEditIcon } from "../../systemPreferences/launchPadSetup/launchPadSetupDetail";
import { usePopupReducer } from "@wizehub/common/hooks";
import EditEmployeeBudgetForm from "./editEmployeeBudget";
import DistributeBudgetForm from "./distributeBudgetForm";

interface Props {
  budgetId: Id;
  budgetTeamId: Id;
  distributeFormVisibility: boolean;
  hideDistributeForm: () => void;
  feePlanId: Id;
}

const TeamBudget: React.FC<Props> = ({
  budgetId,
  budgetTeamId,
  distributeFormVisibility,
  hideDistributeForm,
  feePlanId,
}) => {
  const { tenantData, firmProfile } = useSelector((state: ReduxState) => state);
  const [refresh, setRefresh] = useState<boolean>(false);
  const { tenantId } = tenantData;
  const reduxDispatch = useDispatch();
  const [teamBudgetEntity, setTeamBudgetEntity] = useState<
    Array<TeamBudgetEntity>
  >([]);

  const {
    visibility: editTeamBudgetFormVisibility,
    showPopup: showEditTeamBudgetForm,
    hidePopup: hideEditTeamBudgetForm,
    metaData: editTeamBudgetFormConfig,
  } = usePopupReducer<{
    employeeEntity: TeamBudgetEntity;
  }>();

  const finanacialMonths = financialYearStartMonth(
    firmProfile?.financialYearStartMonth
  );

  useEffect(() => {
    if (budgetId && budgetTeamId) {
      setTeamBudgetEntity([]);
      reduxDispatch(
        apiCall(
          TEAM_BUDGET_LISTING_API.replace(":tenantId", tenantId)
            .replace(":budgetId", budgetId?.toString())
            .replace(":budgetTeamId", budgetTeamId?.toString()),
          (resolve) => {
            setTeamBudgetEntity(resolve);
          },
          (reject) => {}
        )
      );
    }
  }, [budgetId, budgetTeamId, refresh]);

  const employeeList = teamBudgetEntity?.map((team) => {
    return team?.employee;
  });

  return (
    <>
      <Card
        cardCss={{
          margin: "10px 0px 0px 20px",
          width: "100%",
        }}
        noHeader={true}
      >
        <Grid container item xs={12} gap={2}>
          <Grid container item xs={3}>
            <StyledInnerGridDashedTableContainer
              item
              xs={12}
              noBorderBottom={!employeeList?.length}
            >
              <StyledInnerGridTableHeadingTypography>
                {messages?.plan?.budgetAndCapacity?.teamBudgetTab?.teamMember}
              </StyledInnerGridTableHeadingTypography>
            </StyledInnerGridDashedTableContainer>
            <StyledInnerGridDashedTableContainer
              item
              xs={12}
              noBackgroundColor={true}
              noBorderBottom={!employeeList?.length}
              display={!employeeList?.length && "none"}
            ></StyledInnerGridDashedTableContainer>
            {employeeList?.map((employee, index) => {
              return (
                <>
                  <StyledInnerGridDashedTableContainer
                    key={employee?.id}
                    item
                    xs={12}
                    noBorderBottom={index === employeeList?.length - 1}
                  >
                    <StyledTeamBudgetEmployeeTypography>
                      {`${employee?.firstName} ${employee?.lastName}`}
                    </StyledTeamBudgetEmployeeTypography>
                  </StyledInnerGridDashedTableContainer>
                  <StyledInnerGridDashedTableContainer
                    item
                    xs={12}
                    noBackgroundColor={true}
                    display={index === employeeList?.length - 1 && "none"}
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
              const monthList = teamBudgetEntity.map((team) => {
                return team["monthlyBudget"].filter(
                  (obj) => obj.month === month?.monthNumber
                )[0];
              });
              return (
                <Grid container item xs minWidth="125px" flexGrow={1}>
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
                    return (
                      <>
                        <StyledInnerGridDashedTableContainer
                          item
                          xs={12}
                          noBorderBottom={index === monthList?.length - 1}
                        >
                          <StyledTeamBudgetMonthTypography textAlign="center">
                            {nullablePlaceHolder(
                              monthBudget?.budget?.toFixed(2)
                            )}
                          </StyledTeamBudgetMonthTypography>
                        </StyledInnerGridDashedTableContainer>
                        <StyledInnerGridDashedTableContainer
                          item
                          xs={12}
                          noBackgroundColor={true}
                          display={index === monthList?.length - 1 && "none"}
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
                noBorderBottom={!teamBudgetEntity?.length}
              >
                <StyledTeamCapacityBottomCardTypography textAlign="center">
                  {messages?.plan?.budgetAndCapacity?.teamBudgetTab?.total}
                </StyledTeamCapacityBottomCardTypography>
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={12}
                noBackgroundColor={true}
                noBorderBottom={!teamBudgetEntity?.length}
                display={!teamBudgetEntity?.length && "none"}
              ></StyledInnerGridDashedTableContainer>
              {teamBudgetEntity?.map((employee, index) => {
                const monthTotal = totalValueMethod(
                  employee?.monthlyBudget,
                  "budget"
                );
                return (
                  <>
                    <StyledInnerGridDashedTableContainer
                      item
                      xs={12}
                      noBorderBottom={index === teamBudgetEntity?.length - 1}
                    >
                      <StyledTeamBudgetMonthTypography textAlign="center">
                        {nullablePlaceHolder(Number(monthTotal)?.toFixed(2))}
                      </StyledTeamBudgetMonthTypography>
                    </StyledInnerGridDashedTableContainer>
                    <StyledInnerGridDashedTableContainer
                      item
                      xs={12}
                      noBackgroundColor={true}
                      display={index === teamBudgetEntity?.length - 1 && "none"}
                    ></StyledInnerGridDashedTableContainer>
                  </>
                );
              })}
            </Grid>
            <Grid container item xs minWidth="125px" flexGrow={1}>
              <StyledInnerGridDashedTableContainer
                item
                xs={12}
                noBorderBottom={!teamBudgetEntity?.length}
              >
                <StyledTeamCapacityBottomCardTypography textAlign="center">
                  {messages?.plan?.budgetAndCapacity?.teamBudgetTab?.edit}
                </StyledTeamCapacityBottomCardTypography>
              </StyledInnerGridDashedTableContainer>
              <StyledInnerGridDashedTableContainer
                item
                xs={12}
                noBackgroundColor={true}
                noBorderBottom={!teamBudgetEntity?.length}
                display={!teamBudgetEntity?.length && "none"}
              ></StyledInnerGridDashedTableContainer>
              {teamBudgetEntity?.map((employee, index) => {
                return (
                  <>
                    <StyledInnerGridDashedTableContainer
                      item
                      xs={12}
                      noBorderBottom={index === teamBudgetEntity?.length - 1}
                      alignItems="center"
                    >
                      <StyledEditEmployeeBudgetEditIcon
                        onClick={() =>
                          showEditTeamBudgetForm({
                            employeeEntity: employee,
                          })
                        }
                      />
                    </StyledInnerGridDashedTableContainer>
                    <StyledInnerGridDashedTableContainer
                      item
                      xs={12}
                      noBackgroundColor={true}
                      display={index === teamBudgetEntity?.length - 1 && "none"}
                    ></StyledInnerGridDashedTableContainer>
                  </>
                );
              })}
            </Grid>
          </StyledTeamBudgetScrollableContainer>
        </Grid>
      </Card>
      <Modal
        show={editTeamBudgetFormVisibility}
        heading={
          messages?.plan?.budgetAndCapacity?.teamBudgetTab?.editTeamBudgetForm
            ?.heading
        }
        onClose={hideEditTeamBudgetForm}
        fitContent
      >
        <EditEmployeeBudgetForm
          onCancel={hideEditTeamBudgetForm}
          onSuccess={() => {
            hideEditTeamBudgetForm();
            setRefresh((prev) => !prev);
          }}
          budgetTeamId={budgetTeamId}
          budgetId={budgetId}
          employeeBudget={editTeamBudgetFormConfig?.employeeEntity}
        />
      </Modal>
      <Modal
        show={distributeFormVisibility}
        heading={
          messages?.plan?.budgetAndCapacity?.teamBudgetTab?.distributeBudgetForm
            ?.heading
        }
        onClose={hideDistributeForm}
        fitContent
      >
        <DistributeBudgetForm
          onCancel={() => {
            hideDistributeForm();
          }}
          onSuccess={() => {
            hideDistributeForm();
            setRefresh((prev) => !prev);
            toast(
              <Toast
                text={
                  messages?.plan?.budgetAndCapacity?.teamBudgetTab
                    ?.distributeBudgetForm?.success
                }
              />
            );
          }}
          feePlanId={feePlanId}
          feeTeamId={budgetTeamId}
          budgetId={budgetId}
          teamBudgetEntity={teamBudgetEntity}
        />
      </Modal>
    </>
  );
};

export default TeamBudget;
