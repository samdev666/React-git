import React from "react";
import { Container } from "../../../components";
import { DetailPageWrapper, Modal, Toast } from "@wizehub/components";
import messages from "../../../messages";
import { Divider, Grid } from "@mui/material";
import {
  StyledBottomDivContainer,
  StyledCircleImageContainer,
  StyledCircledImage,
  StyledPhotoGridContainer,
  StyledSecondaryCardHeading,
} from "../styles";
import { useEntity, usePopupReducer } from "@wizehub/common/hooks";
import {
  PersonBasicDetailEntity,
  PersonSensitiveDetailEntity,
} from "@wizehub/common/models/genericEntities";
import { BASIC_EMPLOYEE_DETAIL, SENSITIVE_EMPLOYEE_DETAIL } from "../../../api";
import { config } from "../../../config";
import {
  StyledDetailTableContent,
  StyledDetailTableHeading,
} from "@wizehub/components/detailPageWrapper/styles";
import {
  HttpMethods,
  capitalizeLegend,
  dateFormatterFunction,
  formatCurrency,
  nullablePlaceHolder,
} from "@wizehub/common/utils";
import { formatStatus } from "@wizehub/components/table";
import {
  launchPadLinkColumn,
  ResponsiveDeleteIcon,
  ResponsiveEditIcon,
} from "../../systemPreferences/launchPadSetup/launchPadSetupDetail";
import { Id, UserActionConfig } from "@wizehub/common/models";
import DeleteCTAForm from "../../systemPreferences/launchPadSetup/deleteCTAForm";
import { toast } from "react-toastify";
import { Status } from "@wizehub/common/models/modules";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import { routes } from "../../../utils";
import { useHistory, useParams } from "react-router-dom";
import {
  billableWorkingWeeks,
  feeCapacity,
  finalCostPerHour,
  finalProductiveHours,
  GrossProfitKPI,
  totalHours,
} from "./mathFunctions";
import { percentageCalculatorFunction } from "../../plan/budgetAndCapacity/budgetAndCapacityFormula";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";

const PeopleDetail = () => {
  const { entity: personDetail, refreshEntity } =
    useEntity<PersonBasicDetailEntity>(BASIC_EMPLOYEE_DETAIL);
  const reduxDispatch = useDispatch();
  const history = useHistory();

  const { id } = useParams<{ id: string }>();

  const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);

  const { entity: personSensitiveDetail } =
    useEntity<PersonSensitiveDetailEntity>(SENSITIVE_EMPLOYEE_DETAIL);

  const {
    visibility: deletePeopleFormVisibility,
    showPopup: showDeletePeopleForm,
    hidePopup: hideDeletePersonForm,
  } = usePopupReducer<UserActionConfig>();

  return (
    <Container noPadding>
      <DetailPageWrapper
        heading={messages?.firmProfile?.people?.peopleDetail?.heading}
        cardHeading={messages?.firmProfile?.people?.peopleDetail?.staffProfile}
        headingActionButtons={[
          {
            startIcon: <ResponsiveDeleteIcon />,
            variant: "contained",
            color: "error",
            label: messages?.firmProfile?.people?.peopleDetail?.deleteButton,
            onClick: () => showDeletePeopleForm(),
            disabled: personDetail?.status === Status.inactive,
          },
          {
            startIcon: <ResponsiveEditIcon />,
            variant: "outlined",
            color: "secondary",
            label: messages?.firmProfile?.people?.peopleDetail?.editDetails,
            onClick: () => {
              reduxDispatch(
                push(routes.firmProfile.editPeopleForm.replace(":id", id))
              );
            },
          },
        ]}
        cardContent={[
          {
            value: (
              <Grid container item xs={12} gap={2}>
                <StyledPhotoGridContainer
                  container
                  item
                  xs={4}
                  justifyContent="center"
                >
                  <StyledCircleImageContainer>
                    {personDetail?.profileUrl ? (
                      <StyledCircledImage
                        src={`${config.baseImageUrl}/${personDetail?.profileUrl}`}
                        alt={personDetail?.bio}
                      />
                    ) : (
                      <StyledDetailTableHeading>
                        {messages?.firmProfile?.firmDetails?.noImage}
                      </StyledDetailTableHeading>
                    )}
                  </StyledCircleImageContainer>
                  <Grid container item xs={12} justifyContent="space-between">
                    <Grid item xs={5}>
                      <StyledDetailTableHeading>
                        {messages?.firmProfile?.people?.peopleDetail?.firstName}
                      </StyledDetailTableHeading>
                    </Grid>
                    <Grid item xs={7}>
                      <StyledDetailTableContent isShortened={true}>
                        {personDetail?.firstName
                          ? personDetail?.firstName
                          : "-"}
                      </StyledDetailTableContent>
                    </Grid>
                  </Grid>
                  <Grid container item xs={12} justifyContent="space-between">
                    <Grid item xs={5}>
                      <StyledDetailTableHeading>
                        {messages?.firmProfile?.people?.peopleDetail?.lastName}
                      </StyledDetailTableHeading>
                    </Grid>
                    <Grid item xs={7}>
                      <StyledDetailTableContent isShortened={true}>
                        {personDetail?.lastName ? personDetail?.lastName : "-"}
                      </StyledDetailTableContent>{" "}
                    </Grid>
                  </Grid>
                  <Grid container item xs={12} justifyContent="space-between">
                    <Grid item xs={5}>
                      <StyledDetailTableHeading>
                        {messages?.firmProfile?.people?.peopleDetail?.email}
                      </StyledDetailTableHeading>
                    </Grid>
                    <Grid item xs={7}>
                      <StyledDetailTableContent isShortened={true}>
                        {personDetail?.email ? personDetail?.email : "-"}
                      </StyledDetailTableContent>
                    </Grid>
                  </Grid>
                  <Grid container item xs={12} justifyContent="space-between">
                    <Grid item xs={5}>
                      <StyledDetailTableHeading>
                        {messages?.firmProfile?.people?.peopleDetail?.phone}
                      </StyledDetailTableHeading>
                    </Grid>
                    <Grid item xs={7}>
                      <StyledDetailTableContent isShortened={true}>
                        {personDetail?.dialCode && personDetail?.phoneNumber
                          ? `+${nullablePlaceHolder(
                              personDetail?.dialCode
                            )} ${nullablePlaceHolder(
                              personDetail?.phoneNumber
                            )}`
                          : "-"}
                      </StyledDetailTableContent>
                    </Grid>
                  </Grid>
                  <Grid container item xs={12} justifyContent="space-between">
                    <Grid item xs={5}>
                      <StyledDetailTableHeading>
                        {messages?.firmProfile?.people?.peopleDetail?.extension}
                      </StyledDetailTableHeading>{" "}
                    </Grid>
                    <Grid item xs={7}>
                      <StyledDetailTableContent isShortened={true}>
                        {personDetail?.extension
                          ? personDetail?.extension
                          : "-"}
                      </StyledDetailTableContent>
                    </Grid>
                  </Grid>
                  <Grid container item xs={12} justifyContent="space-between">
                    <Grid item xs={5}>
                      <StyledDetailTableHeading>
                        {messages?.firmProfile?.people?.peopleDetail?.linkedin}
                      </StyledDetailTableHeading>
                    </Grid>
                    <Grid item xs={7}>
                      <StyledDetailTableContent isShortened={true}>
                        {personDetail?.linkedInUrl
                          ? launchPadLinkColumn(personDetail?.linkedInUrl)
                          : "-"}
                      </StyledDetailTableContent>
                    </Grid>
                  </Grid>
                </StyledPhotoGridContainer>
                <Grid
                  container
                  item
                  xs={7.5}
                  columnGap={2}
                  height="fit-content"
                  rowGap={2}
                >
                  <Grid item xs={4} height="fit-content">
                    <StyledDetailTableHeading>
                      {messages?.firmProfile?.people?.peopleDetail?.role}
                    </StyledDetailTableHeading>
                    <StyledDetailTableContent>
                      {personDetail?.role?.name
                        ? personDetail?.role?.name
                        : "-"}
                    </StyledDetailTableContent>
                  </Grid>
                  <Grid item xs={4} height="fit-content">
                    <StyledDetailTableHeading>
                      {messages?.firmProfile?.people?.peopleDetail?.type}
                    </StyledDetailTableHeading>
                    <StyledDetailTableContent>
                      {personDetail?.type
                        ? capitalizeLegend(personDetail?.type)
                        : "-"}
                    </StyledDetailTableContent>
                  </Grid>
                  <Grid item xs={3} height="fit-content">
                    <StyledDetailTableHeading>
                      {messages?.firmProfile?.people?.peopleDetail?.division}
                    </StyledDetailTableHeading>
                    <StyledDetailTableContent>
                      {personDetail?.division?.name
                        ? personDetail?.division?.name
                        : "-"}
                    </StyledDetailTableContent>
                  </Grid>
                  <Grid item xs={4} height="fit-content">
                    <StyledDetailTableHeading>
                      {messages?.firmProfile?.people?.peopleDetail?.dob}
                    </StyledDetailTableHeading>
                    <StyledDetailTableContent>
                      {personDetail?.dateOfBirth
                        ? dateFormatterFunction(personDetail?.dateOfBirth)
                        : "-"}
                    </StyledDetailTableContent>
                  </Grid>
                  <Grid item xs={3} height="fit-content">
                    <StyledDetailTableHeading>
                      {messages?.firmProfile?.people?.peopleDetail?.status}
                    </StyledDetailTableHeading>
                    <StyledDetailTableContent>
                      {formatStatus(personDetail?.status)}
                    </StyledDetailTableContent>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ width: "100%", borderStyle: "dashed" }} />
                  </Grid>
                  <Grid item xs={12}>
                    <StyledDetailTableHeading>
                      {messages?.firmProfile?.people?.peopleDetail?.bio}
                    </StyledDetailTableHeading>
                    <StyledDetailTableContent>
                      {personDetail?.bio ? personDetail?.bio : "-"}
                    </StyledDetailTableContent>
                  </Grid>
                </Grid>
              </Grid>
            ),
            gridWidth: 12,
          },
        ]}
        hasGoBackIcon={true}
        detailedGridGap={2}
      />
      <DetailPageWrapper
        hasNoHeader={false}
        cardHeading={
          messages?.firmProfile?.people?.peopleDetail?.contactDetails
        }
        cardContent={[
          {
            value: (
              <StyledSecondaryCardHeading>
                {
                  messages?.firmProfile?.people?.peopleDetail
                    ?.personalContactInformation
                }
              </StyledSecondaryCardHeading>
            ),
            gridWidth: 12,
          },
          {
            heading: messages?.firmProfile?.people?.peopleDetail?.email,
            value: personSensitiveDetail?.personalContactInformation?.email
              ? personSensitiveDetail?.personalContactInformation?.email
              : "-",
            isTypography: true,
            gridWidth: 3,
          },
          {
            heading: messages?.firmProfile?.people?.peopleDetail?.phone,
            value:
              personSensitiveDetail?.personalContactInformation?.dialCode &&
              personSensitiveDetail?.personalContactInformation?.phoneNumber
                ? `+${nullablePlaceHolder(
                    personSensitiveDetail?.personalContactInformation?.dialCode
                  )} ${nullablePlaceHolder(
                    personSensitiveDetail?.personalContactInformation
                      ?.phoneNumber
                  )}`
                : "-",
            gridWidth: 3,
            isTypography: true,
          },
          {
            value: (
              <Grid item xs={12}>
                <Divider
                  sx={{
                    width: "100%",
                    marginTop: "16px",
                    borderStyle: "dashed",
                  }}
                />
              </Grid>
            ),
            gridWidth: 12,
          },
          {
            value: (
              <StyledSecondaryCardHeading>
                {
                  messages?.firmProfile?.people?.peopleDetail
                    ?.emergencyContactInformation
                }
              </StyledSecondaryCardHeading>
            ),
            gridWidth: 12,
          },
          {
            heading: messages?.firmProfile?.people?.peopleDetail?.name,
            value: personSensitiveDetail?.emergencyContactInformation?.name
              ? personSensitiveDetail?.emergencyContactInformation?.name
              : "-",
            gridWidth: 3,
            isTypography: true,
          },
          {
            heading: messages?.firmProfile?.people?.peopleDetail?.email,
            value: personSensitiveDetail?.emergencyContactInformation?.email
              ? personSensitiveDetail?.emergencyContactInformation?.email
              : "-",
            gridWidth: 3,
            isTypography: true,
          },
          {
            heading: messages?.firmProfile?.people?.peopleDetail?.phone,
            value:
              personSensitiveDetail?.emergencyContactInformation?.dialCode &&
              personSensitiveDetail?.emergencyContactInformation?.phoneNumber
                ? `+${nullablePlaceHolder(
                    personSensitiveDetail?.emergencyContactInformation?.dialCode
                  )} ${nullablePlaceHolder(
                    personSensitiveDetail?.emergencyContactInformation
                      ?.phoneNumber
                  )}`
                : "-",
            gridWidth: 3,
            isTypography: true,
          },
          {
            heading: messages?.firmProfile?.people?.peopleDetail?.relationship,
            value: personSensitiveDetail?.emergencyContactInformation?.relation
              ? capitalizeLegend(
                  personSensitiveDetail?.emergencyContactInformation?.relation
                )
              : "-",
            gridWidth: 3,
            isTypography: true,
          },
        ]}
        detailedGridGap={2}
      />
      <StyledBottomDivContainer>
        <DetailPageWrapper
          hasNoHeader={false}
          cardHeading={
            messages?.firmProfile?.people?.peopleDetail
              ?.employmentAndHumanResources
          }
          cardContent={[
            {
              heading:
                messages?.firmProfile?.people?.peopleDetail?.potentialRole,
              value: personSensitiveDetail?.potentialRole?.name
                ? personSensitiveDetail?.potentialRole?.name
                : "-",
              gridWidth: 12,
              isTypography: true,
            },
            {
              value: (
                <Grid container item xs={12} columnSpacing={1} rowGap={1}>
                  <Grid
                    container
                    item
                    xs={6}
                    display="flex"
                    flexDirection="column"
                  >
                    <StyledDetailTableHeading>
                      {messages?.firmProfile?.people?.peopleDetail?.strengths}
                    </StyledDetailTableHeading>
                    <StyledDetailTableContent>
                      {personSensitiveDetail?.strength
                        ? personSensitiveDetail?.strength
                        : "-"}
                    </StyledDetailTableContent>
                  </Grid>
                  <Grid
                    container
                    item
                    xs={6}
                    display="flex"
                    flexDirection="column"
                  >
                    <StyledDetailTableHeading>
                      {messages?.firmProfile?.people?.peopleDetail?.weaknesses}
                    </StyledDetailTableHeading>
                    <StyledDetailTableContent>
                      {personSensitiveDetail?.weakness
                        ? personSensitiveDetail?.weakness
                        : "-"}
                    </StyledDetailTableContent>
                  </Grid>
                </Grid>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <Grid item xs={12}>
                  <Divider
                    sx={{
                      width: "100%",
                      borderStyle: "dashed",
                    }}
                  />
                </Grid>
              ),
              gridWidth: 12,
            },
            {
              heading:
                messages?.firmProfile?.people?.peopleDetail?.commencementDate,
              value: personSensitiveDetail?.commencementDate
                ? dateFormatterFunction(personSensitiveDetail?.commencementDate)
                : "-",
              gridWidth: 3,
              isTypography: true,
            },
            {
              heading:
                messages?.firmProfile?.people?.peopleDetail
                  ?.preCommencementExperience,
              value: personSensitiveDetail?.previousExperience,
              gridWidth: 3,
              isTypography: true,
            },
            {
              heading: messages?.firmProfile?.people?.peopleDetail?.location,
              value: personSensitiveDetail?.location,
              gridWidth: 3,
              isTypography: true,
            },
            {
              heading:
                messages?.firmProfile?.people?.peopleDetail?.employmentType,
              value: capitalizeLegend(personSensitiveDetail?.employmentType),
              gridWidth: 3,
              isTypography: true,
            },
            {
              heading:
                messages?.firmProfile?.people?.peopleDetail?.hoursPerWeek,
              value: personSensitiveDetail?.hoursPerWeek,
              gridWidth: 3,
              isTypography: true,
            },
            {
              value: (
                <Grid item xs={12}>
                  <Divider
                    sx={{
                      width: "100%",
                      borderStyle: "dashed",
                    }}
                  />
                </Grid>
              ),
              gridWidth: 12,
            },
            {
              heading:
                messages?.firmProfile?.people?.peopleDetail?.inputWeeksPerYear,
              value: personSensitiveDetail?.weeksPerYear,
              gridWidth: 3,
              isTypography: true,
            },
            {
              heading:
                messages?.firmProfile?.people?.peopleDetail?.inputAnnualLeave,
              value: personSensitiveDetail?.annualLeave,
              gridWidth: 3,
              isTypography: true,
            },
            {
              heading:
                messages?.firmProfile?.people?.peopleDetail?.inputSickLeave,
              value: personSensitiveDetail?.sickLeave,
              gridWidth: 3,
              isTypography: true,
            },
            {
              heading:
                messages?.firmProfile?.people?.peopleDetail
                  ?.inputPublicHolidays,
              value: personSensitiveDetail?.publicHolidays,
              gridWidth: 3,
              isTypography: true,
            },
            {
              value: (
                <Grid item xs={12}>
                  <Divider
                    sx={{
                      width: "100%",
                      borderStyle: "dashed",
                    }}
                  />
                </Grid>
              ),
              gridWidth: 12,
            },
            {
              heading: messages?.firmProfile?.people?.peopleDetail?.salary,
              value: formatCurrency(personSensitiveDetail?.salary, false),
              gridWidth: 3,
              isTypography: true,
            },
            {
              heading: messages?.firmProfile?.people?.peopleDetail?.chargeRate,
              value: formatCurrency(personSensitiveDetail?.chargeRate, false),
              gridWidth: 3,
              isTypography: true,
            },
            {
              heading:
                messages?.firmProfile?.people?.peopleDetail?.productivity,
              value: personSensitiveDetail?.productivity,
              gridWidth: 3,
              isTypography: true,
            },
            {
              value: (
                <Grid item xs={12}>
                  <Divider
                    sx={{
                      width: "100%",
                      borderStyle: "dashed",
                    }}
                  />
                </Grid>
              ),
              gridWidth: 12,
            },
            {
              heading:
                messages?.firmProfile?.people?.peopleDetail?.dateTerminated,
              value: personSensitiveDetail?.terminatedDate
                ? dateFormatterFunction(personSensitiveDetail?.terminatedDate)
                : "-",
              gridWidth: 3,
              isTypography: true,
            },
            {
              heading: messages?.firmProfile?.people?.peopleDetail?.hireAgain,
              value: personSensitiveDetail?.hireAgain,
              gridWidth: 3,
              isTypography: true,
            },
            {
              value: (
                <Grid item xs={12}>
                  <Divider
                    sx={{
                      width: "100%",
                      borderStyle: "dashed",
                    }}
                  />
                </Grid>
              ),
              gridWidth: 12,
            },
            {
              heading:
                messages?.firmProfile?.people?.peopleDetail
                  ?.billableWorkingWeeks,
              value: billableWorkingWeeks(
                personSensitiveDetail?.weeksPerYear,
                personSensitiveDetail?.annualLeave,
                personSensitiveDetail?.sickLeave,
                personSensitiveDetail?.publicHolidays
              ),
              gridWidth: 2,
              isTypography: true,
            },
            {
              heading: messages?.firmProfile?.people?.peopleDetail?.totalHours,
              value: totalHours(
                billableWorkingWeeks(
                  personSensitiveDetail?.weeksPerYear,
                  personSensitiveDetail?.annualLeave,
                  personSensitiveDetail?.sickLeave,
                  personSensitiveDetail?.publicHolidays
                ),
                personSensitiveDetail?.hoursPerWeek
              ),
              gridWidth: 2,
              isTypography: true,
            },
            {
              heading:
                messages?.firmProfile?.people?.peopleDetail?.productiveHours,
              value: finalProductiveHours(
                totalHours(
                  billableWorkingWeeks(
                    personSensitiveDetail?.weeksPerYear,
                    personSensitiveDetail?.annualLeave,
                    personSensitiveDetail?.sickLeave,
                    personSensitiveDetail?.publicHolidays
                  ),
                  personSensitiveDetail?.hoursPerWeek
                ),
                personSensitiveDetail?.productivity
              ),
              gridWidth: 2,
              isTypography: true,
            },
            {
              heading: messages?.firmProfile?.people?.peopleDetail?.costPerHour,
              value: formatCurrency(
                finalCostPerHour(
                  personSensitiveDetail?.salary,
                  totalHours(
                    billableWorkingWeeks(
                      personSensitiveDetail?.weeksPerYear,
                      personSensitiveDetail?.annualLeave,
                      personSensitiveDetail?.sickLeave,
                      personSensitiveDetail?.publicHolidays
                    ),
                    personSensitiveDetail?.hoursPerWeek
                  )
                ),
                false
              ),
              gridWidth: 2,
              isTypography: true,
            },
            {
              heading:
                messages?.firmProfile?.people?.peopleDetail?.multipleLabourCost,
              value: formatCurrency(
                finalCostPerHour(
                  feeCapacity(
                    finalProductiveHours(
                      totalHours(
                        billableWorkingWeeks(
                          personSensitiveDetail?.weeksPerYear,
                          personSensitiveDetail?.annualLeave,
                          personSensitiveDetail?.sickLeave,
                          personSensitiveDetail?.publicHolidays
                        ),
                        personSensitiveDetail?.hoursPerWeek
                      ),
                      personSensitiveDetail?.productivity
                    ),
                    personSensitiveDetail?.chargeRate
                  ),
                  personSensitiveDetail?.salary
                ),
                false
              ),
              gridWidth: 2,
              isTypography: true,
            },
            {
              heading: messages?.firmProfile?.people?.peopleDetail?.feeCapacity,
              value: formatCurrency(
                feeCapacity(
                  finalProductiveHours(
                    totalHours(
                      billableWorkingWeeks(
                        personSensitiveDetail?.weeksPerYear,
                        personSensitiveDetail?.annualLeave,
                        personSensitiveDetail?.sickLeave,
                        personSensitiveDetail?.publicHolidays
                      ),
                      personSensitiveDetail?.hoursPerWeek
                    ),
                    personSensitiveDetail?.productivity
                  ),
                  personSensitiveDetail?.chargeRate
                ),
                false
              ),
              gridWidth: 2,
              isTypography: true,
            },
            {
              heading:
                messages?.firmProfile?.people?.peopleDetail?.grossProfitKpi,
              value: GrossProfitKPI(
                feeCapacity(
                  finalProductiveHours(
                    totalHours(
                      billableWorkingWeeks(
                        personSensitiveDetail?.weeksPerYear,
                        personSensitiveDetail?.annualLeave,
                        personSensitiveDetail?.sickLeave,
                        personSensitiveDetail?.publicHolidays
                      ),
                      personSensitiveDetail?.hoursPerWeek
                    ),
                    personSensitiveDetail?.productivity
                  ),
                  personSensitiveDetail?.chargeRate
                ),
                personSensitiveDetail?.salary
              ),
              gridWidth: 2,
              isTypography: true,
            },
          ]}
          detailedGridGap={2}
        />
      </StyledBottomDivContainer>
      <Modal
        show={deletePeopleFormVisibility}
        heading={messages?.firmProfile?.people?.form?.deactivatePeople}
        onClose={hideDeletePersonForm}
        fitContent
      >
        <DeleteCTAForm
          onCancel={hideDeletePersonForm}
          onSuccess={() => {
            hideDeletePersonForm();
            toast(
              <Toast
                text={messages?.firmProfile?.people?.form?.success?.deleted}
              />
            );
            refreshEntity();
          }}
          api={`${BASIC_EMPLOYEE_DETAIL}/${personDetail?.id}`}
          bodyText={messages?.firmProfile?.people?.form?.note}
          cancelButton={messages?.firmProfile?.people?.form?.cancel}
          confirmButton={messages?.firmProfile?.people?.form?.deactivate}
          apiMethod={HttpMethods.PATCH}
          deleteBody={{
            tenantId: tenantId,
            status: Status.inactive,
          }}
        />
      </Modal>
    </Container>
  );
};

export default PeopleDetail;
