import React, { useEffect, useState } from "react";
import { Container } from "../../components";
import {
  StyledHeadingTypography,
  StyledMainHeadingContainer,
} from "@wizehub/components/detailPageWrapper/styles";
import {
  StyledBudgestAndCapacityLeftHeadingContainer,
  StyledEntitySubTextTypography,
} from "../plan/budgetAndCapacity/styles";
import messages from "../../messages";
import { Grid } from "@mui/material";
import {
  useEntity,
  useFormReducer,
  useOptions,
  usePopupReducer,
} from "@wizehub/common/hooks";
import {
  Button,
  Card,
  MaterialAutocompleteInput,
  Modal,
  Table,
  Toast,
} from "@wizehub/components";
import { ResponsiveDayViewIcon } from "../plan/budgetAndCapacity/budgetAndCapacity";
import { Id, UserActionConfig } from "@wizehub/common/models";
import PlanForm from "./planForm";
import {
  LockupEntity,
  LockupPlanEntity,
  PlanEntity,
} from "@wizehub/common/models/genericEntities";
import {
  ADD_PLAN,
  LOCKUP_LISTING_API,
  LOCKUP_PLAN_FILTER_LISTING_API,
  RESYNC_LOCKUP_TEAM,
} from "../../api";
import { useSelector } from "react-redux";
import { ReduxState } from "../../redux/reducers";
import {
  ResponsiveEditIcon,
  ResponsiveSyncIcon,
} from "../systemPreferences/launchPadSetup/launchPadSetupDetail";
import {
  StyledEditIconContainer,
  StyledMainHeadingEbitdaButtonContainer,
  StyledNameAndIconContainer,
} from "./styles";
import { LOCKUP_MONTH_TYPE } from "@wizehub/common/models/modules";
import EditLockupForm from "./editLockupForm";
import {
  formatCurrency,
  HttpMethods,
  mapIdNameToOptionWithTitleWithoutCaptializing,
} from "@wizehub/common/utils";
import {
  StyledNoDataInfo,
  StyledNoDataInfoContainer,
} from "@wizehub/components/table/styles";
import { useDispatch } from "react-redux";
import { apiCall } from "@wizehub/common/redux/actions";
import { toast } from "react-toastify";

const Lockup = () => {
  const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
  const { connectField, formValues, change } = useFormReducer();
  const [refresh, setRefresh] = useState<boolean>(false);
  const reduxDispatch = useDispatch();
  const {
    visibility: createPlanFormVisibility,
    showPopup: showCreatePlanForm,
    hidePopup: hideCreatePlanForm,
  } = usePopupReducer<UserActionConfig>();

  const { options: planOptions, refreshOptions } = useOptions<LockupPlanEntity>(
    LOCKUP_PLAN_FILTER_LISTING_API.replace(":tenantId", tenantId),
    true
  );

  const { entity: planEntity, refreshEntity } = useEntity<PlanEntity>(
    ADD_PLAN,
    planOptions?.filter((plan) => plan?.id === formValues?.plan?.value?.id)[0]
      ?.plan?.id
  );

  const { entity: lockupEntity, refreshEntity: refreshLockupEntity } =
    useEntity<Array<LockupEntity>>(
      LOCKUP_LISTING_API.replace(":tenantId", tenantId),
      planEntity?.planLockupId?.toString()
    );

  const {
    visibility: createEditFormVisibility,
    showPopup: showEditForm,
    hidePopup: hideEditForm,
    metaData: lockupEditConfig,
  } = usePopupReducer<{
    type: LOCKUP_MONTH_TYPE;
    value: Id;
  }>();

  useEffect(() => {
    if (!formValues?.plan?.value?.id && planOptions.length > 0) {
      change("plan", {
        id: planOptions[0]?.id,
        label: planOptions[0]?.title,
      });
      refreshEntity();
    }
  }, [planOptions]);

  useEffect(() => {
    if (formValues?.plan?.value?.id) {
      refreshEntity();
    }
  }, [formValues?.plan?.value?.id, refresh]);

  useEffect(() => {
    if (planEntity) {
      refreshLockupEntity();
    }
  }, [planEntity]);

  const handleResyncEbidtaTeam = async () => {
    const sanitizedBody = {
      tenantId: tenantId,
      lockupId: planEntity?.planLockupId,
    };
    return new Promise((resolve, reject) => {
      reduxDispatch(
        apiCall(
          RESYNC_LOCKUP_TEAM,
          resolve,
          reject,
          HttpMethods.POST,
          sanitizedBody
        )
      );
    })
      .then(() => {
        setRefresh((prev) => !prev);
        toast(
          <Toast text={messages?.measure?.financialOverview?.lockup?.success} />
        );
      })
      .catch((error) => {
        toast(
          <Toast
            text={
              messages?.measure?.financialOverview?.lockup?.error
                ?.serverError?.[error?.message]
            }
          />
        );
      });
  };

  return (
    <Container noPadding>
      <StyledMainHeadingContainer>
        <StyledBudgestAndCapacityLeftHeadingContainer container xs={7}>
          <StyledHeadingTypography>
            {messages?.measure?.financialOverview?.lockup?.heading}
          </StyledHeadingTypography>
          <Grid container item xs={4} gap={2}>
            <Grid item xs={7}>
              {connectField("plan", {
                label: messages?.measure?.financialOverview?.lockup?.plan,
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
                label={messages?.measure?.financialOverview?.lockup?.plan}
                onClick={() => {
                  showCreatePlanForm();
                }}
              />
            </Grid>
          </Grid>
        </StyledBudgestAndCapacityLeftHeadingContainer>
        <StyledMainHeadingEbitdaButtonContainer>
          <Button
            startIcon={<ResponsiveSyncIcon />}
            variant="outlined"
            color="secondary"
            label={messages?.measure?.financialOverview?.ebidta?.resyncTeam}
            onClick={() => handleResyncEbidtaTeam()}
          />
        </StyledMainHeadingEbitdaButtonContainer>
      </StyledMainHeadingContainer>
      {lockupEntity?.length > 0 ? (
        <Card
          noHeader
          cardCss={{ margin: "0 20px", overflow: "hidden !important" }}
        >
          <Table
            specs={[
              {
                id: "team",
                label:
                  messages?.measure?.financialOverview?.lockup?.table?.team,
                getValue: (row: LockupEntity) => row?.team,
                format: (row: { id: Id; name: string }) => row?.name,
              },
              {
                id: "workInProgress",
                label: messages?.measure?.financialOverview?.lockup?.table?.wip,
                getValue: (row: LockupEntity) => row,
                format: (row: LockupEntity) => {
                  return (
                    <StyledNameAndIconContainer>
                      <StyledEntitySubTextTypography style={{ width: "70px" }}>
                        {formatCurrency(row?.workInProgress, false)}
                      </StyledEntitySubTextTypography>
                      <StyledEditIconContainer
                        onClick={() => {
                          showEditForm({
                            type: LOCKUP_MONTH_TYPE.WIP,
                            value: row?.lockupTeamId,
                          });
                        }}
                      >
                        <ResponsiveEditIcon />
                      </StyledEditIconContainer>
                    </StyledNameAndIconContainer>
                  );
                },
              },
              {
                id: "debts",
                label:
                  messages?.measure?.financialOverview?.lockup?.table?.debtors,
                getValue: (row: LockupEntity) => row,
                format: (row: LockupEntity) => {
                  return (
                    <StyledNameAndIconContainer>
                      <StyledEntitySubTextTypography style={{ width: "70px" }}>
                        {formatCurrency(row?.debts, false)}
                      </StyledEntitySubTextTypography>
                      <StyledEditIconContainer
                        onClick={() => {
                          showEditForm({
                            type: LOCKUP_MONTH_TYPE.DEBTORS,
                            value: row?.lockupTeamId,
                          });
                        }}
                      >
                        <ResponsiveEditIcon />
                      </StyledEditIconContainer>
                    </StyledNameAndIconContainer>
                  );
                },
              },
            ]}
            data={lockupEntity}
          />
        </Card>
      ) : (
        <StyledNoDataInfoContainer>
          <StyledNoDataInfo>
            {messages?.measure?.financialOverview?.ebidta?.noPlanHeading}
          </StyledNoDataInfo>
        </StyledNoDataInfoContainer>
      )}

      <Modal
        show={createPlanFormVisibility}
        heading={
          messages?.measure?.financialOverview?.lockup?.planForm?.heading
        }
        onClose={() => {
          refreshOptions();
          hideCreatePlanForm();
        }}
        fitContent
      >
        <PlanForm
          onCancel={hideCreatePlanForm}
          onSuccess={() => {
            hideCreatePlanForm();
          }}
        />
      </Modal>
      <Modal
        show={createEditFormVisibility}
        heading={
          messages?.measure?.financialOverview?.lockup?.table?.[
            lockupEditConfig?.type === LOCKUP_MONTH_TYPE.WIP ? "wip" : "debtors"
          ]
        }
        onClose={hideEditForm}
        fitContent
      >
        <EditLockupForm
          onCancel={hideEditForm}
          onSuccess={() => {
            hideEditForm();
            refreshEntity();
          }}
          lockupEntity={lockupEditConfig}
          lockupId={planEntity?.planLockupId}
        />
      </Modal>
    </Container>
  );
};

export default Lockup;
