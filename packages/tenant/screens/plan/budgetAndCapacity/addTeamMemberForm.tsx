import { useEntity, useFormReducer, useOptions } from "@wizehub/common/hooks";
import {
  Button,
  Form,
  FormError,
  FormRow,
  FormRowItem,
  MaterialAutocompleteInput,
  MaterialTextInput,
  Toast,
} from "@wizehub/components";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  formatCurrency,
  HttpMethods,
  nullablePlaceHolder,
  required,
} from "@wizehub/common/utils";
import {
  PersonBasicDetailEntity,
  PersonSensitiveDetailEntity,
} from "@wizehub/common/models/genericEntities";
import messages from "../../../messages";
import { apiCall } from "@wizehub/common/redux/actions";
import {
  ADD_TEAM_MEMBER_API,
  ATTACH_TEAM_EMPLOYEE,
  BASIC_EMPLOYEE_DETAIL,
  PEOPLE_LISTING_API,
  SENSITIVE_EMPLOYEE_DETAIL,
  TEAM_EMPLOYEE_LISTING_API,
} from "../../../api";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import {
  Id,
  MetaData,
  Option,
  getDefaultMetaData,
} from "@wizehub/common/models";
import { Divider } from "@mui/material";
import {
  StyledAddTeamSubTextTypography,
  StyledValueTypography,
} from "./styles";
import {
  billableWorkingWeeks,
  feeCapacity,
  finalCostPerHour,
  finalProductiveHours,
  GrossProfitKPI,
  totalHours,
} from "../../firmProfile/people/mathFunctions";
import { Status } from "@wizehub/common/models/modules";

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
  teamDivisionId: Id;
  teamReferentialId: Id;
}

interface FormData {
  name: Option;
  productivity: number;
  chargeRate: number;
}

const validators = {
  name: [
    required(
      messages?.plan?.budgetAndCapacity?.teamCapacityTab?.teamMemberForm
        ?.validators?.name
    ),
  ],
  productivity: [
    required(
      messages?.plan?.budgetAndCapacity?.teamCapacityTab?.teamMemberForm
        ?.validators?.productivity
    ),
  ],
  chargeRate: [
    required(
      messages?.plan?.budgetAndCapacity?.teamCapacityTab?.teamMemberForm
        ?.validators?.chargeRate
    ),
  ],
};

export const mapIdFirstNameLastNameToOptionWithoutCaptializing = (entity: {
  id: Id;
  firstName: string;
  lastName: string;
}): Option => ({
  id: entity?.id,
  label: `${entity?.firstName} ${entity?.lastName}`,
});

const getDefaultOptions = (): MetaData<PersonBasicDetailEntity> => ({
  ...getDefaultMetaData<PersonBasicDetailEntity>(),
  allResults: true,
  filters: {
    status: Status.active,
  },
});

const AddTeamMemberForm: React.FC<Props> = ({
  onCancel,
  onSuccess,
  teamDivisionId,
  teamReferentialId,
}) => {
  const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
  const {
    submitting,
    submitError,
    handleSubmit,
    connectField,
    change,
    setSubmitError,
    formValues,
  } = useFormReducer(validators);

  const reduxDispatch = useDispatch();
  const { options, searchOptions } = useOptions<PersonBasicDetailEntity>(
    TEAM_EMPLOYEE_LISTING_API.replace(":tenantId", tenantId).replace(
      ":teamId",
      teamReferentialId?.toString()
    ),
    true,
    getDefaultOptions()
  );

  const {
    entity: personSensitiveDetail,
    refreshEntity,
    clearEntity: clearPersonSensitiveDetail,
  } = useEntity<PersonSensitiveDetailEntity>(
    SENSITIVE_EMPLOYEE_DETAIL,
    formValues?.name?.value?.id
  );

  const {
    entity: personBasicDetail,
    refreshEntity: refreshBasicDetail,
    clearEntity: clearPersonBasicDetail,
  } = useEntity<PersonBasicDetailEntity>(
    BASIC_EMPLOYEE_DETAIL,
    formValues?.name?.value?.id
  );

  useEffect(() => {
    if (formValues?.name?.value?.id) {
      refreshEntity();
      refreshBasicDetail();
    } else {
      clearPersonSensitiveDetail();
      clearPersonBasicDetail();
      change("productivity", undefined);
      change("chargeRate", undefined);
    }
  }, [formValues?.name?.value?.id]);

  useEffect(() => {
    if (personSensitiveDetail) {
      change("productivity", personSensitiveDetail?.productivity);
      change("chargeRate", personSensitiveDetail?.chargeRate);
    }
  }, [personSensitiveDetail]);

  const onSubmit = async (data: FormData) => {
    const sanitizeBody = {
      teamDivisionId: teamDivisionId,
      tenantId: tenantId,
      employeeId: data?.name?.id,
      productivity: data?.productivity,
      chargeRate: data?.chargeRate,
      capacityFee: feeCapacity(
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
          formValues?.productivity?.value
        ),
        formValues?.chargeRate?.value
      ),
      productiveHours: finalProductiveHours(
        totalHours(
          billableWorkingWeeks(
            personSensitiveDetail?.weeksPerYear,
            personSensitiveDetail?.annualLeave,
            personSensitiveDetail?.sickLeave,
            personSensitiveDetail?.publicHolidays
          ),
          personSensitiveDetail?.hoursPerWeek
        ),
        formValues?.productivity?.value
      ),
    };

    return new Promise<void>((resolve, reject) => {
      reduxDispatch(
        apiCall(
          ATTACH_TEAM_EMPLOYEE,
          resolve,
          reject,
          HttpMethods.POST,
          sanitizeBody
        )
      );
    })
      .then(() => {
        onSuccess();
        toast(
          <Toast
            text={
              messages?.plan?.budgetAndCapacity?.teamCapacityTab?.teamMemberForm
                ?.success?.created
            }
          />
        );
      })
      .catch((error) => {
        setSubmitError(error?.message);
      });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow minWidth="712px">
        <FormRowItem>
          {connectField("name", {
            label:
              messages?.plan?.budgetAndCapacity?.teamCapacityTab?.teamMemberForm
                ?.name,
            required: true,
            options: options?.map(
              mapIdFirstNameLastNameToOptionWithoutCaptializing
            ),
            searchOptions: searchOptions,
            enableClearable: true,
          })(MaterialAutocompleteInput)}
        </FormRowItem>
        <FormRowItem>
          {connectField("productivity", {
            label:
              messages?.plan?.budgetAndCapacity?.teamCapacityTab?.teamMemberForm
                ?.productivity,
            required: true,
            disabled: !formValues?.name?.value,
            type: "number",
          })(MaterialTextInput)}
        </FormRowItem>
        <FormRowItem>
          {connectField("chargeRate", {
            label:
              messages?.plan?.budgetAndCapacity?.teamCapacityTab?.teamMemberForm
                ?.chargeRate,
            required: true,
            disabled: !formValues?.name?.value,
            type: "number",
          })(MaterialTextInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <Divider sx={{ width: "100%" }} />
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem flexDirection="column">
          <StyledAddTeamSubTextTypography>
            {
              messages?.plan?.budgetAndCapacity?.teamCapacityTab?.teamMemberForm
                ?.roleType
            }
          </StyledAddTeamSubTextTypography>
          <StyledValueTypography>
            {personBasicDetail?.role?.name
              ? personBasicDetail?.role?.name
              : "-"}
          </StyledValueTypography>
        </FormRowItem>
        <FormRowItem flexDirection="column">
          <StyledAddTeamSubTextTypography>
            {
              messages?.plan?.budgetAndCapacity?.teamCapacityTab?.teamMemberForm
                ?.experienceYears
            }
          </StyledAddTeamSubTextTypography>
          <StyledValueTypography>
            {personSensitiveDetail?.previousExperience
              ? personSensitiveDetail?.previousExperience
              : "-"}
          </StyledValueTypography>
        </FormRowItem>
        <FormRowItem flexDirection="column">
          <StyledAddTeamSubTextTypography>
            {
              messages?.plan?.budgetAndCapacity?.teamCapacityTab?.teamMemberForm
                ?.location
            }
          </StyledAddTeamSubTextTypography>
          <StyledValueTypography>
            {personSensitiveDetail?.location
              ? personSensitiveDetail?.location
              : "-"}
          </StyledValueTypography>
        </FormRowItem>
        <FormRowItem flexDirection="column">
          <StyledAddTeamSubTextTypography>
            {
              messages?.plan?.budgetAndCapacity?.teamCapacityTab?.teamMemberForm
                ?.salary
            }
          </StyledAddTeamSubTextTypography>
          <StyledValueTypography>
            {formatCurrency(personSensitiveDetail?.salary, false)}
          </StyledValueTypography>
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem flexDirection="column">
          <StyledAddTeamSubTextTypography>
            {
              messages?.plan?.budgetAndCapacity?.teamCapacityTab?.teamMemberForm
                ?.inputWeeksPerYear
            }
          </StyledAddTeamSubTextTypography>
          <StyledValueTypography>
            {nullablePlaceHolder(personSensitiveDetail?.weeksPerYear)}
          </StyledValueTypography>
        </FormRowItem>
        <FormRowItem flexDirection="column">
          <StyledAddTeamSubTextTypography>
            {
              messages?.plan?.budgetAndCapacity?.teamCapacityTab?.teamMemberForm
                ?.inputAnnualLeave
            }
          </StyledAddTeamSubTextTypography>
          <StyledValueTypography>
            {nullablePlaceHolder(personSensitiveDetail?.annualLeave)}
          </StyledValueTypography>
        </FormRowItem>
        <FormRowItem flexDirection="column">
          <StyledAddTeamSubTextTypography>
            {
              messages?.plan?.budgetAndCapacity?.teamCapacityTab?.teamMemberForm
                ?.inputSickLeave
            }
          </StyledAddTeamSubTextTypography>
          <StyledValueTypography>
            {nullablePlaceHolder(personSensitiveDetail?.sickLeave)}
          </StyledValueTypography>
        </FormRowItem>
        <FormRowItem flexDirection="column">
          <StyledAddTeamSubTextTypography>
            {
              messages?.plan?.budgetAndCapacity?.teamCapacityTab?.teamMemberForm
                ?.inputPublicHolidays
            }
          </StyledAddTeamSubTextTypography>
          <StyledValueTypography>
            {nullablePlaceHolder(personSensitiveDetail?.publicHolidays)}
          </StyledValueTypography>
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem flexDirection="column">
          <StyledAddTeamSubTextTypography>
            {
              messages?.plan?.budgetAndCapacity?.teamCapacityTab?.teamMemberForm
                ?.workingWeek
            }
          </StyledAddTeamSubTextTypography>
          <StyledValueTypography>
            {nullablePlaceHolder(
              billableWorkingWeeks(
                personSensitiveDetail?.weeksPerYear,
                personSensitiveDetail?.annualLeave,
                personSensitiveDetail?.sickLeave,
                personSensitiveDetail?.publicHolidays
              )
            )}
          </StyledValueTypography>
        </FormRowItem>
        <FormRowItem flexDirection="column">
          <StyledAddTeamSubTextTypography>
            {
              messages?.plan?.budgetAndCapacity?.teamCapacityTab?.teamMemberForm
                ?.totalHours
            }
          </StyledAddTeamSubTextTypography>
          <StyledValueTypography>
            {nullablePlaceHolder(
              totalHours(
                billableWorkingWeeks(
                  personSensitiveDetail?.weeksPerYear,
                  personSensitiveDetail?.annualLeave,
                  personSensitiveDetail?.sickLeave,
                  personSensitiveDetail?.publicHolidays
                ),
                personSensitiveDetail?.hoursPerWeek
              )
            )}
          </StyledValueTypography>
        </FormRowItem>
        <FormRowItem flexDirection="column">
          <StyledAddTeamSubTextTypography>
            {
              messages?.plan?.budgetAndCapacity?.teamCapacityTab?.teamMemberForm
                ?.productiveHours
            }
          </StyledAddTeamSubTextTypography>
          <StyledValueTypography>
            {nullablePlaceHolder(
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
                formValues?.productivity?.value
              )
            )}
          </StyledValueTypography>
        </FormRowItem>
        <FormRowItem flexDirection="column">
          <StyledAddTeamSubTextTypography>
            {
              messages?.plan?.budgetAndCapacity?.teamCapacityTab?.teamMemberForm
                ?.hoursPerWeek
            }
          </StyledAddTeamSubTextTypography>
          <StyledValueTypography>
            {nullablePlaceHolder(personSensitiveDetail?.hoursPerWeek)}
          </StyledValueTypography>
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem flexDirection="column">
          <StyledAddTeamSubTextTypography>
            {
              messages?.plan?.budgetAndCapacity?.teamCapacityTab?.teamMemberForm
                ?.costPerHour
            }
          </StyledAddTeamSubTextTypography>
          <StyledValueTypography>
            {formatCurrency(
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
            )}
          </StyledValueTypography>
        </FormRowItem>
        <FormRowItem flexDirection="column">
          <StyledAddTeamSubTextTypography>
            {
              messages?.plan?.budgetAndCapacity?.teamCapacityTab?.teamMemberForm
                ?.capacityFees
            }
          </StyledAddTeamSubTextTypography>
          <StyledValueTypography>
            {formatCurrency(
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
                  formValues?.productivity?.value
                ),
                formValues?.chargeRate?.value
              ),
              false
            )}
          </StyledValueTypography>
        </FormRowItem>
        <FormRowItem flexDirection="column">
          <StyledAddTeamSubTextTypography>
            {
              messages?.plan?.budgetAndCapacity?.teamCapacityTab?.teamMemberForm
                ?.grossProfit
            }
          </StyledAddTeamSubTextTypography>
          <StyledValueTypography>
            {nullablePlaceHolder(
              GrossProfitKPI(
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
                    formValues?.productivity?.value
                  ),
                  formValues?.chargeRate?.value
                ),
                personSensitiveDetail?.salary
              )
            )}
          </StyledValueTypography>
        </FormRowItem>
        <FormRowItem flexDirection="column">
          <StyledAddTeamSubTextTypography>
            {
              messages?.plan?.budgetAndCapacity?.teamCapacityTab?.teamMemberForm
                ?.multipleLabourCost
            }
          </StyledAddTeamSubTextTypography>
          <StyledValueTypography>
            {formatCurrency(
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
                    formValues?.productivity?.value
                  ),
                  formValues?.chargeRate?.value
                ),
                personSensitiveDetail?.salary
              ),
              false
            )}
          </StyledValueTypography>
        </FormRowItem>
      </FormRow>
      {submitError && (
        <FormRow>
          <FormRowItem>
            <FormError
              message={
                messages?.plan?.budgetAndCapacity?.teamCapacityTab
                  ?.teamMemberForm?.error?.serverError?.[submitError]
              }
            />
          </FormRowItem>
        </FormRow>
      )}
      <FormRow justifyContent="end" mb={0}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onCancel}
          label={
            messages?.plan?.budgetAndCapacity?.teamCapacityTab?.teamMemberForm
              ?.cancel
          }
        />
        <Button
          variant="contained"
          type="submit"
          disabled={submitting}
          label={
            messages?.plan?.budgetAndCapacity?.teamCapacityTab?.teamMemberForm
              ?.add
          }
        />
      </FormRow>
    </Form>
  );
};

export default AddTeamMemberForm;
