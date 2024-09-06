import React, { useRef } from "react";
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
  RecursiveFieldInput,
} from "@wizehub/components";
import { ReduxState } from "../../../../redux/reducers";
import { StyledResponsiveIcon } from "@wizehub/components/table/styles";
import {
  greyScaleColour,
  brandColour,
} from "@wizehub/common/theme/style.palette";
import {
  mapIdNameToOptionWithoutCaptializing,
  required,
} from "@wizehub/common/utils";
import {
  StyledIdealIncomeContainer,
  StyledFormMessages,
  StyledGridContainer,
  StyledFormHeading,
  StyledFormSeparator,
  StyledIdealIncomeAddMoreText,
  StyledDesiredIncomeHeading,
  StyledDesiredIncomeHeadingValue,
  StyledDesiredIncomeCommonText,
  StyledCapitalValueHeading,
  StyledCommonCapitalValue,
  StyledCommonCapitalValueMessage,
  StyledDesiredIdealIncomeStatus,
  StyledFormAddMoreIcon,
  StyledFormAddMoreIconContainer,
  StyledCapitalValueGridWapper,
  StyledDesiredIncomeGridWapper,
  StyledDesiredIncomeInnerGridWapper
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
import { Height, Padding } from "@mui/icons-material";
import { ResponsiveDayViewIcon } from "../../budgetAndCapacity/budgetAndCapacity";

const guidesFormLayout = [
  [
    {
      value:
        messages?.plan?.objectives?.idealIncome?.yourIdealIcome?.form
          ?.enterName,
      component: MaterialTextInput,
      props: {
        required: true,
      },
    },
    {
      value:
        messages?.plan?.objectives?.idealIncome?.yourIdealIcome?.form
          ?.enterIncome,
      component: MaterialTextInput,
      props: {
        required: true,
      },
    },
  ],
];
const initialValues = {
  guides: [
    {
      name: "",
      income: "",
    },
  ],
};
const validators = {
  guides: {
    name: [
      required(
        messages?.plan?.objectives?.idealIncome?.yourIdealIcome?.form
          ?.validators?.name
      ),
    ],
    income: [
      required(
        messages?.plan?.objectives?.idealIncome?.yourIdealIcome?.form
          ?.validators?.income
      ),
    ],
  },
};

const IdealIncome = () => {
  const addMoreRef = useRef(null);
  const { connectField, formValues, connectFieldReplicate } = useFormReducer(
    validators,
    initialValues
  );
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
  const handleAddField = () => {
    if (addMoreRef?.current) {
      addMoreRef.current?.addItemToGroup("guides");
    }
  };

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
              ></Button>
            </Grid>
          </Grid>
        </StyledIdealIncomeContainer>
      </StyledMainHeadingContainer>
      <Grid xs={12} gap={2} padding={2} display="flex" height={"100%"}>
        <Grid container xs={3.5}>
          <StyledGridContainer>
            <Card
              noHeader
              cardCss={{
                padding: "16px",
                overflow: "hidden",
                overflowY: "scroll",
              }}
            >
              <Grid container xs={12} gap={2}>
                <Grid
                  item
                  xs={12}
                  display={"flex"}
                  justifyContent={"space-between"}
                >
                  <StyledFormHeading>
                    {
                      messages?.plan?.objectives?.idealIncome?.yourIdealIcome
                        ?.heading
                    }
                  </StyledFormHeading>
                  <StyledFormAddMoreIconContainer onClick={handleAddField}>
                    <StyledFormAddMoreIcon />
                    <StyledIdealIncomeAddMoreText>
                      {
                        messages?.plan?.objectives?.idealIncome?.yourIdealIcome
                          ?.addMore
                      }
                    </StyledIdealIncomeAddMoreText>
                  </StyledFormAddMoreIconContainer>
                </Grid>
                <Grid item xs={12}>
                  <StyledFormSeparator />
                </Grid>
                <Grid item>
                  {connectFieldReplicate("guides", {
                    formLayout: guidesFormLayout,
                    ref: addMoreRef,
                    showAddButton: false,
                  })(RecursiveFieldInput)}
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

        {/* Desired Income & capital value Grid */}

        <Grid container xs={9.2}>
          <Grid
            xs={12}
            bgcolor={greyScaleColour.grey60}
            padding={2}
            display={"flex"}
            flexDirection={"column"}
            gap={1}
          >

            {/* Desired Income card*/}
            <Card noHeader>
              <Grid container xs={12}>
                <StyledDesiredIncomeGridWapper
                  item
                  xs={12}
                  bgcolor={`${brandColour.primary100}`}
                >
                  <StyledDesiredIncomeHeading>
                    {
                      messages?.plan?.objectives?.idealIncome?.desiredIncome
                        ?.heading
                    }
                  </StyledDesiredIncomeHeading>
                  <StyledDesiredIncomeHeadingValue>
                    $640,000
                  </StyledDesiredIncomeHeadingValue>
                </StyledDesiredIncomeGridWapper>
                
                <Grid container item xs={12} padding={"0px 16px"}>
                <StyledDesiredIncomeInnerGridWapper item xs={12}>
                  <Grid item xs={4}>
                    <StyledDesiredIncomeCommonText>
                      {
                        messages?.plan?.objectives?.idealIncome?.desiredIncome
                          ?.soldCost
                      }
                    </StyledDesiredIncomeCommonText>
                  </Grid>
                  <Grid item xs={2} display={"flex"} justifyContent={"flex-end"}>
                    <StyledDesiredIdealIncomeStatus>
                      LESS
                    </StyledDesiredIdealIncomeStatus>
                  </Grid>
                  <Grid item xs={3} textAlign={"end"}>
                    <StyledDesiredIncomeCommonText>
                      40.00%
                    </StyledDesiredIncomeCommonText>
                  </Grid>
                  <Grid item xs={3} textAlign={"end"}>
                    <StyledDesiredIncomeCommonText>
                      $640,000
                    </StyledDesiredIncomeCommonText>
                  </Grid>
                </StyledDesiredIncomeInnerGridWapper>

                <StyledDesiredIncomeInnerGridWapper item xs={12}>
                  <Grid item xs={4}>
                    <StyledDesiredIncomeCommonText>
                      {
                        messages?.plan?.objectives?.idealIncome?.desiredIncome
                          ?.grossProfit
                      }
                    </StyledDesiredIncomeCommonText>
                  </Grid>
                  <Grid item xs={2} display={"flex"} justifyContent={"flex-end"}>
                    <StyledDesiredIdealIncomeStatus>
                      EQUAL
                    </StyledDesiredIdealIncomeStatus>
                  </Grid>
                  <Grid item xs={3} textAlign={"end"}>
                    <StyledDesiredIncomeCommonText>
                      40.00%
                    </StyledDesiredIncomeCommonText>
                  </Grid>
                  <Grid item xs={3} textAlign={"end"}>
                    <StyledDesiredIncomeCommonText>
                      $640,000
                    </StyledDesiredIncomeCommonText>
                  </Grid>
                </StyledDesiredIncomeInnerGridWapper>

                <StyledDesiredIncomeInnerGridWapper item xs={12}>
                  <Grid item xs={4}>
                    <StyledDesiredIncomeCommonText>
                      {
                        messages?.plan?.objectives?.idealIncome?.desiredIncome
                          ?.expenses
                      }
                    </StyledDesiredIncomeCommonText>
                  </Grid>
                  <Grid item xs={2} display={"flex"} justifyContent={"flex-end"}>
                    <StyledDesiredIdealIncomeStatus>
                      LESS
                    </StyledDesiredIdealIncomeStatus>
                  </Grid>
                  <Grid item xs={3} textAlign={"end"}>
                    <StyledDesiredIncomeCommonText>
                      40.00%
                    </StyledDesiredIncomeCommonText>
                  </Grid>
                  <Grid item xs={3} textAlign={"end"}>
                    <StyledDesiredIncomeCommonText>
                      $640,000
                    </StyledDesiredIncomeCommonText>
                  </Grid>
                </StyledDesiredIncomeInnerGridWapper>
                </Grid>

                <StyledDesiredIncomeGridWapper
                  item
                  xs={12}
                  bgcolor={`${brandColour.primary70}`}
                >
                  <Grid item xs={4}>
                    <StyledDesiredIncomeCommonText>
                      {
                        messages?.plan?.objectives?.idealIncome?.desiredIncome
                          ?.yourIdealIncome
                      }
                    </StyledDesiredIncomeCommonText>
                  </Grid>
                  <Grid item xs={2} display={"flex"} justifyContent={"flex-end"}>
                    <StyledDesiredIdealIncomeStatus>
                      EQUAL
                    </StyledDesiredIdealIncomeStatus>
                  </Grid>
                  <Grid item xs={3} textAlign={"end"}>
                    <StyledDesiredIncomeCommonText>
                      40.00%
                    </StyledDesiredIncomeCommonText>
                  </Grid>
                  <Grid item xs={3} textAlign={"end"}>
                    <StyledDesiredIncomeCommonText>
                      $440,000
                    </StyledDesiredIncomeCommonText>
                  </Grid>
                </StyledDesiredIncomeGridWapper>
              </Grid>
            </Card>

            {/* Capital value card */}
            <Card noHeader cardCss={{ padding: "0px 16px" }}>
              <Grid container xs={12}>
                <StyledCapitalValueGridWapper item xs={12}>
                  <StyledCapitalValueHeading>
                    {
                      messages?.plan?.objectives?.idealIncome
                        ?.capitalValueAnalysis?.heading
                    }
                  </StyledCapitalValueHeading>
                </StyledCapitalValueGridWapper>
                <StyledFormSeparator />
                <StyledCapitalValueGridWapper item xs={12}>
                  <StyledCommonCapitalValue>
                    {
                      messages?.plan?.objectives?.idealIncome
                        ?.capitalValueAnalysis?.revenue
                    }
                  </StyledCommonCapitalValue>
                  <StyledCommonCapitalValue>$640,000</StyledCommonCapitalValue>
                </StyledCapitalValueGridWapper>

                <StyledCapitalValueGridWapper item xs={12}>
                  <StyledCommonCapitalValue>
                    {
                      messages?.plan?.objectives?.idealIncome
                        ?.capitalValueAnalysis?.dollerInvestment
                    }
                  </StyledCommonCapitalValue>
                  <StyledCommonCapitalValue>$640,000</StyledCommonCapitalValue>
                </StyledCapitalValueGridWapper>

                <StyledCapitalValueGridWapper item xs={12}>
                  <StyledCommonCapitalValue>
                    {
                      messages?.plan?.objectives?.idealIncome
                        ?.capitalValueAnalysis?.yourIdealIncome
                    }
                  </StyledCommonCapitalValue>
                  <StyledCommonCapitalValue>$640,000</StyledCommonCapitalValue>
                </StyledCapitalValueGridWapper>

                <StyledCapitalValueGridWapper item xs={12}>
                  <StyledCommonCapitalValue>
                    {
                      messages?.plan?.objectives?.idealIncome
                        ?.capitalValueAnalysis?.returnInvestment
                    }
                  </StyledCommonCapitalValue>
                  <StyledCommonCapitalValue>25%</StyledCommonCapitalValue>
                </StyledCapitalValueGridWapper>

                <StyledCapitalValueGridWapper item xs={12}>
                  <StyledCommonCapitalValueMessage>
                    {
                      messages?.plan?.objectives?.idealIncome
                        ?.capitalValueAnalysis?.message
                    }
                  </StyledCommonCapitalValueMessage>
                </StyledCapitalValueGridWapper>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default IdealIncome;
