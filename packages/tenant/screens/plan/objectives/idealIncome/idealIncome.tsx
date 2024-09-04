import React from "react";
import { Container } from "../../../../components";
import {
  StyledHeadingTypography,
  StyledMainHeadingContainer,
} from "@wizehub/components/detailPageWrapper/styles";
import { connect, useSelector } from "react-redux";
import {
  Card,
  FormRow,
  FormRowItem,
  MaterialDateInput,
  MaterialTextInput,
} from "@wizehub/components";
import { ReduxState } from "../../../../redux/reducers";
import { StyledResponsiveIcon } from "@wizehub/components/table/styles";
import { greyScaleColour } from "@wizehub/common/theme/style.palette";
import { mapIdNameToOptionWithoutCaptializing } from "@wizehub/common/utils";
import {
  StyledIdealIncomeContainer,
  StyledFormMessages,
  StyledGridContainer,
  StyledIdealIncomeFormLabels,
  StyledFormHeading,
  StyledFormSeparator
} from "./styles";
import ViewDayOutlinedIcon from "@mui/icons-material/ViewDayOutlined";
import { PLAN_LISTING_API } from "../../../../api";
import { Divider, Grid } from "@mui/material";
import messages from "../../../../messages";
import { Button, Form } from "@wizehub/components";
import {
  useFormReducer,
  usePopupReducer,
  useOptions,
} from "@wizehub/common/hooks";
import { MaterialAutocompleteInput } from "@wizehub/components";
import {
  UserActionConfig,
  MetaData,
  getDefaultMetaData,
} from "@wizehub/common/models";
import { PlanEntity } from "@wizehub/common/models/genericEntities";

export const ResponsiveDayViewIcon = StyledResponsiveIcon(ViewDayOutlinedIcon);

const IdealIncome = () => {
  const { connectField, formValues, connectFieldReplicate } = useFormReducer();
  const {
    visibility: createPlanFormVisibility,
    showPopup: showCreatePlanForm,
    hidePopup: hideCreatePlanForm,
  } = usePopupReducer<UserActionConfig>();
  const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);

  const getDefaulBudgetAndCapacityPlanFilter = (): MetaData<PlanEntity> => ({
    ...getDefaultMetaData<PlanEntity>(),
    allResults: true,
  });
  const { options: planOptions, refreshOptions } = useOptions<PlanEntity>(
    PLAN_LISTING_API.replace(":tenantId", tenantId),
    true,
    getDefaulBudgetAndCapacityPlanFilter()
  );
  return (
    <Container noPadding>
      <StyledMainHeadingContainer>
        <StyledIdealIncomeContainer container xs={7}>
          <StyledHeadingTypography>
            {messages?.plan?.objectives?.idealIncome?.heading}
          </StyledHeadingTypography>
          <Grid container item xs={4} gap={2}>
            <Grid item xs={7}>
              {connectField("plan", {
                label: messages?.plan?.objectives?.idealIncome?.plan,
                options: planOptions?.map(mapIdNameToOptionWithoutCaptializing),
              })(MaterialAutocompleteInput)}
            </Grid>
            <Grid item xs={3}>
              <Button
                startIcon={<ResponsiveDayViewIcon />}
                variant="text"
                color="primary"
                label={messages?.plan?.objectives?.idealIncome?.plan}
                onClick={() => {
                  showCreatePlanForm();
                }}
              >
                ideal
              </Button>
            </Grid>
          </Grid>
        </StyledIdealIncomeContainer>
      </StyledMainHeadingContainer>
      <Grid xs={12} gap={2} padding={2} display="flex">
       
        
        <Grid container xs={3.5} height="78vh">
        <StyledGridContainer>
          <Card noHeader cardCss={{ padding: "16px" }}>
            <Grid container xs={12} gap={2}>
            <Grid item>
            <StyledFormHeading>
                  {
                    messages?.plan?.objectives?.idealIncome?.yourIdealIcome?.heading
                  }
            </StyledFormHeading>
            </Grid>
            <Grid item xs={12}>
            <StyledFormSeparator />
            </Grid>
              <Grid item display="flex" columnGap={1}>
                <Grid item>
                  {connectField("name", {
                    label:
                      messages?.plan?.objectives?.idealIncome?.yourIdealIcome
                        ?.form?.enterName,
                  })(MaterialTextInput)}
                </Grid>
                <Grid item>
                  {connectField("income", {
                    label:
                      messages?.plan?.objectives?.idealIncome?.yourIdealIcome
                        ?.form?.enterIncome,
                  })(MaterialTextInput)}
                </Grid>
              </Grid>
              <Grid item xs={12}>
            <StyledFormSeparator />
            </Grid>
              <Grid item>
                <StyledFormMessages>
                  {
                    messages?.plan?.objectives?.idealIncome?.yourIdealIcome
                      ?.ebitdaPartnerSalaries
                  }
                </StyledFormMessages>
              </Grid>
              <Grid item xs={12}>
                {connectField("ebitaPercentage", {
                  label:
                    messages?.plan?.objectives?.idealIncome?.yourIdealIcome
                      ?.form?.enterYourEbita,
                })(MaterialTextInput)}
              </Grid>
              <Grid item>
                <StyledFormMessages>
                  {
                    messages?.plan?.objectives?.idealIncome?.yourIdealIcome
                      ?.profitMargin
                  }
                </StyledFormMessages>
              </Grid>

              <Grid item xs={12}>
                {connectField("GP", {
                  label:
                    messages?.plan?.objectives?.idealIncome?.yourIdealIcome
                      ?.form?.enterYourGP,
                })(MaterialTextInput)}
              </Grid>

              <Grid item>
                <StyledFormMessages>
                  {
                    messages?.plan?.objectives?.idealIncome?.yourIdealIcome
                      ?.achieveIdealIncome
                  }
                </StyledFormMessages>
              </Grid>

              <Grid item xs={12}>
                {connectField("date", {})(MaterialDateInput)}
              </Grid>


                <Button
                  variant="contained"
                  type="submit"
                  label={
                      messages?.plan?.objectives?.idealIncome?.yourIdealIcome
                      ?.form?.button
                    }
                    fullWidth
                    />

            </Grid>
          </Card>
          </StyledGridContainer>
          </Grid>
      

          <Grid container xs={9.2}>
        <StyledGridContainer>
          <Card noHeader cardCss={{ padding: "16px" }}>
            <Grid container xs={12} gap={2}>
            <Grid item>
            <StyledFormHeading>
                  {
                    messages?.plan?.objectives?.idealIncome?.yourIdealIcome?.heading
                  }
                </StyledFormHeading>
            </Grid>
              <Grid item display="flex" columnGap={2}>
                <Grid item>
                  {connectField("name", {
                    label:
                      messages?.plan?.objectives?.idealIncome?.yourIdealIcome
                        ?.form?.enterName,
                  })(MaterialTextInput)}
                </Grid>
                <Grid item>
                  {connectField("income", {
                    label:
                      messages?.plan?.objectives?.idealIncome?.yourIdealIcome
                        ?.form?.enterIncome,
                  })(MaterialTextInput)}
                </Grid>
              </Grid>

              <Grid item>
                <StyledFormMessages>
                  {
                    messages?.plan?.objectives?.idealIncome?.yourIdealIcome
                      ?.ebitdaPartnerSalaries
                  }
                </StyledFormMessages>
              </Grid>
              <Grid item xs={12}>
                {connectField("ebitaPercentage", {
                  label:
                    messages?.plan?.objectives?.idealIncome?.yourIdealIcome
                      ?.form?.enterYourEbita,
                })(MaterialTextInput)}
              </Grid>

              <Grid item>
                <StyledFormMessages>
                  {
                    messages?.plan?.objectives?.idealIncome?.yourIdealIcome
                      ?.profitMargin
                  }
                </StyledFormMessages>
              </Grid>

              <Grid item xs={12}>
                {connectField("GP", {
                  label:
                    messages?.plan?.objectives?.idealIncome?.yourIdealIcome
                      ?.form?.enterYourGP,
                })(MaterialTextInput)}
              </Grid>

              <Grid item>
                <StyledFormMessages>
                  {
                    messages?.plan?.objectives?.idealIncome?.yourIdealIcome
                      ?.achieveIdealIncome
                  }
                </StyledFormMessages>
              </Grid>

              <Grid item xs={12}>
                {connectField("date", {})(MaterialDateInput)}
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  type="submit"
                  label={
                    messages?.plan?.objectives?.idealIncome?.yourIdealIcome
                      ?.form?.button
                  }
                />
              </Grid>
            </Grid>
          </Card>
          </StyledGridContainer>
          </Grid>
      </Grid>
    </Container>
  );
};

export default IdealIncome;
