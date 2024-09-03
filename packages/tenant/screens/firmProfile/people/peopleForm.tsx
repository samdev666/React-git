import React, { useEffect, useRef, useState } from "react";
import { Container } from "../../../components";
import {
  Button,
  CustomRadioGroup,
  DetailPageWrapper,
  Form,
  MaterialAutocompleteInput,
  MaterialDateInput,
  MaterialTextInput,
  PhoneInput,
  SwitchInput,
  Toast,
} from "@wizehub/components";
import { useEntity, useFormReducer, useOptions } from "@wizehub/common/hooks";
import messages from "../../../messages";
import { useLocation, useParams } from "react-router-dom";
import { Id, Option } from "@wizehub/common/models";
import {
  PersonTypeOptions,
  PersonRelations,
  EmployeeTypeOptions,
  DecisionOption,
  Status,
} from "@wizehub/common/models/modules";
import {
  StyledFileInput,
  StyledFileUploadContainer,
  StyledFileUploadOutlinedIcon,
  StyledLaunchPadCloseIcon,
  StyledLaunchPadCloseIconContainer,
  StyledLaunchPadContainer,
  StyledLaunchPadImage,
  StyledLaunchPadPhotoIcon,
  StyledUploadTypographyText,
} from "../../systemPreferences/launchPadSetup/styles";
import { handleFileSelect } from "../../systemPreferences/launchPadSetup/launchPadForm";
import {
  HttpMethods,
  capitalizeEntireString,
  capitalizeLegend,
  daysInAnYearValidator,
  emailValidator,
  emptyValueValidator,
  fileSizeCheckFunction,
  formatCurrency,
  linkValidator,
  mapIdNameToOptionWithoutCaptializing,
  maxMinNumberValidator,
  numberValidator,
  phoneValidator,
  required,
  requiredIf,
  trimWordWrapper,
  validatePassedDate,
  weekHoursValidator,
  weeksPerYearValidator,
} from "@wizehub/common/utils";
import { toast } from "react-toastify";
import { StyledProfilePictureUploadContainer } from "../styles";
import { Divider, Grid } from "@mui/material";
import { goBack, push } from "connected-react-router";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import { apiCall, hideLoader, showLoader } from "@wizehub/common/redux/actions";
import {
  BASIC_EMPLOYEE_DETAIL,
  DELETE_EMPLOYEE,
  DIVISION_LISTING_API,
  EMPLOYEE_IMAGE_REMOVE_API,
  EMPLOYEE_UPLOAD_API,
  SENSITIVE_EMPLOYEE_DETAIL,
  TEAM_POSITION_LISTING_API,
} from "../../../api";
import {
  Division,
  PersonBasicDetailEntity,
  PersonSensitiveDetailEntity,
  TeamPositionEntity,
} from "@wizehub/common/models/genericEntities";
import { routes } from "../../../utils";
import { config } from "../../../config";
import moment from "moment";
import {
  billableWorkingWeeks,
  costPerHour,
  feeCapacity,
  finalCostPerHour,
  finalProductiveHours,
  GrossProfitKPI,
  productiveHours,
  totalHours,
} from "./mathFunctions";
import { percentageCalculatorFunction } from "../../plan/budgetAndCapacity/budgetAndCapacityFormula";

interface Props {}

interface FormData {
  tenantId: Id;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dialCode?: string;
  dob?: string;
  division?: {
    id: Id;
    label: string;
  };
  role?: {
    id: Id;
    label: string;
  };
  potentialRole?: {
    id: Id;
    label: string;
  };
  linkedInUrl: string;
  extension: string;
  type?: string;
  status?: Status;
  strengths?: string;
  weaknesses?: string;
  bio?: string;
  personalEmail?: string;
  personalPhoneNumber?: string;
  emergencyContactPersonName?: string;
  emergencyContactPersonEmail?: string;
  emergencyContactRelation?: {
    id: string;
    label: string;
  };
  emergencyContactPhoneNumber?: string;
  commencementDate: string;
  preCommencementExperience: string;
  location?: string;
  employmentType: {
    id: string;
    label: string;
  };
  hoursPerWeek: number;
  inputWeeksPerYear: number;
  inputAnnualLeave: number;
  inputSickLeave: number;
  inputPublicHolidays: number;
  salary: number;
  chargeRate: number;
  productivity: number;
  dateTerminated?: string;
  hireAgain?: {
    id: Id;
    label: string;
  };
}

const validators = {
  firstName: [
    required(messages?.firmProfile?.people?.form?.validators?.firstName),
    emptyValueValidator,
  ],
  lastName: [
    required(messages?.firmProfile?.people?.form?.validators?.lastName),
    emptyValueValidator,
  ],
  email: [
    required(messages?.firmProfile?.people?.form?.validators?.email),
    emailValidator,
  ],
  phone: [
    required(messages?.firmProfile?.people?.form?.validators?.phone),
    phoneValidator,
  ],
  dob: [
    required(messages?.firmProfile?.people?.form?.validators?.dob),
    validatePassedDate(
      messages?.firmProfile?.people?.form?.validators?.passedDate
    ),
  ],
  role: [required(messages?.firmProfile?.people?.form?.validators?.role)],
  commencementDate: [
    required(messages?.firmProfile?.people?.form?.validators?.commencementDate),
    validatePassedDate(
      messages?.firmProfile?.people?.form?.validators?.passedDate
    ),
  ],
  employmentType: [
    required(messages?.firmProfile?.people?.form?.validators?.employmentType),
  ],
  hoursPerWeek: [
    required(messages?.firmProfile?.people?.form?.validators?.hoursPerWeek),
    weekHoursValidator(messages?.general?.errors?.invalidHoursPerWeek),
  ],
  inputWeeksPerYear: [
    required(
      messages?.firmProfile?.people?.form?.validators?.inputWeeksPerYear
    ),
    weeksPerYearValidator(messages?.general?.errors?.invalidWeeksPerYear),
  ],
  inputAnnualLeave: [
    required(messages?.firmProfile?.people?.form?.validators?.inputAnnualLeave),
    weeksPerYearValidator(messages?.general?.errors?.invalidWeeksPerYear),
  ],
  inputSickLeave: [
    required(messages?.firmProfile?.people?.form?.validators?.inputSickLeave),
    weeksPerYearValidator(messages?.general?.errors?.invalidWeeksPerYear),
  ],
  inputPublicHolidays: [
    required(
      messages?.firmProfile?.people?.form?.validators?.inputPublicHolidays
    ),
    weeksPerYearValidator(messages?.general?.errors?.invalidWeeksPerYear),
  ],
  salary: [
    required(messages?.firmProfile?.people?.form?.validators?.salary),
    numberValidator(
      messages?.firmProfile?.people?.form?.validators?.salaryValidator
    ),
  ],
  chargeRate: [
    required(messages?.firmProfile?.people?.form?.validators?.chargeRate),
    numberValidator(
      messages?.firmProfile?.people?.form?.validators?.chargeRateValidator
    ),
  ],
  productivity: [
    required(messages?.firmProfile?.people?.form?.validators?.productivity),
    numberValidator(
      messages?.firmProfile?.people?.form?.validators?.productivityValidator
    ),
  ],
  emergencyContactPersonEmail: [emailValidator],
  personalEmail: [emailValidator],
  dateTerminated: [
    validatePassedDate(
      messages?.firmProfile?.people?.form?.validators?.passedDate
    ),
  ],
  preCommencementExperience: [
    maxMinNumberValidator(
      100,
      0,
      messages?.firmProfile?.people?.form?.validators?.preCommencementExperience
    ),
  ],
  linkedInUrl: [
    linkValidator(messages?.firmProfile?.people?.form?.validators?.linkedInUrl),
  ],
  personalPhoneNumber: [phoneValidator],
  emergencyContactPhoneNumber: [phoneValidator],
};

const peopleFormToastComponent = () => (
  <Toast
    subText={
      messages?.settings?.systemPreferences?.launchPadSetup?.form?.errors
        ?.fileSizeUploadError
    }
    type="error"
  />
);

const PeopleForm: React.FC<Props> = () => {
  const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const reduxDispatch = useDispatch();
  const { submitting, handleSubmit, connectField, change, formValues } =
    useFormReducer(validators);
  const { id: personId } = useParams<{ id: string }>();

  const { entity: basicEmployeeEntity } = useEntity<PersonBasicDetailEntity>(
    BASIC_EMPLOYEE_DETAIL,
    personId
  );

  const { entity: sensitiveEmployeeEntity } =
    useEntity<PersonSensitiveDetailEntity>(SENSITIVE_EMPLOYEE_DETAIL, personId);

  const { options: divisionOptions, searchOptions: divisionSearchOptions } =
    useOptions<Division>(DIVISION_LISTING_API);

  const { options: roleOptions, searchOptions: roleSearchOptions } =
    useOptions<TeamPositionEntity>(
      `${TEAM_POSITION_LISTING_API.replace(":tenantId", tenantId)}`,
      true
    );

  const {
    options: potentialRoleOptions,
    searchOptions: potentialRoleSearchOptions,
  } = useOptions<TeamPositionEntity>(
    `${TEAM_POSITION_LISTING_API.replace(":tenantId", tenantId)}`,
    true
  );

  //To show loader when we edit a form
  // useEffect(() => {
  //   if (personId) {
  //     if (!basicEmployeeEntity || !sensitiveEmployeeEntity) {
  //       reduxDispatch(showLoader());
  //     } else {
  //       reduxDispatch(hideLoader());
  //     }
  //   }
  // }, [basicEmployeeEntity, sensitiveEmployeeEntity]);

  useEffect(() => {
    if (basicEmployeeEntity || sensitiveEmployeeEntity) {
      change("firstName", basicEmployeeEntity?.firstName);
      change("lastName", basicEmployeeEntity?.lastName);
      change("email", basicEmployeeEntity?.email);
      if (basicEmployeeEntity?.dialCode && basicEmployeeEntity?.phoneNumber) {
        change(
          "phone",
          `${+basicEmployeeEntity?.dialCode + basicEmployeeEntity?.phoneNumber}`
        );
      }
      if (basicEmployeeEntity?.dateOfBirth) {
        change("dob", moment(basicEmployeeEntity?.dateOfBirth));
      }
      if (basicEmployeeEntity?.role?.id) {
        change("role", {
          id: basicEmployeeEntity?.role?.id,
          label: basicEmployeeEntity?.role?.name,
        });
      }
      if (sensitiveEmployeeEntity?.potentialRole?.id) {
        change("potentialRole", {
          id: sensitiveEmployeeEntity?.potentialRole?.id,
          label: sensitiveEmployeeEntity?.potentialRole?.name,
        });
      }
      if (basicEmployeeEntity?.division?.id) {
        change("division", {
          id: basicEmployeeEntity?.division?.id,
          label: basicEmployeeEntity?.division?.name,
        });
      }
      if (basicEmployeeEntity?.type) {
        change(
          "type",
          PersonTypeOptions?.find(
            (personType) => personType?.value === basicEmployeeEntity?.type
          )?.value
        );
      }
      if (basicEmployeeEntity?.profileUrl) {
        change(
          "icon",
          `${config.baseImageUrl}/${basicEmployeeEntity?.profileUrl}`
        );
      }
      change("status", basicEmployeeEntity?.status === Status.active);
      change("strengths", sensitiveEmployeeEntity?.strength);
      change("weaknesses", sensitiveEmployeeEntity?.weakness);
      change("bio", basicEmployeeEntity?.bio);
      change(
        "personalEmail",
        sensitiveEmployeeEntity?.personalContactInformation?.email
      );
      change("linkedInUrl", basicEmployeeEntity?.linkedInUrl);
      change("extension", basicEmployeeEntity?.extension);
      if (
        sensitiveEmployeeEntity?.personalContactInformation?.dialCode &&
        sensitiveEmployeeEntity?.personalContactInformation?.phoneNumber
      ) {
        change(
          "personalPhoneNumber",
          `${
            +sensitiveEmployeeEntity?.personalContactInformation?.dialCode +
            sensitiveEmployeeEntity?.personalContactInformation?.phoneNumber
          }`
        );
      }
      change(
        "emergencyContactPersonName",
        sensitiveEmployeeEntity?.emergencyContactInformation?.name
      );
      change(
        "emergencyContactPersonEmail",
        sensitiveEmployeeEntity?.emergencyContactInformation?.email
      );
      if (
        sensitiveEmployeeEntity?.emergencyContactInformation?.dialCode &&
        sensitiveEmployeeEntity?.emergencyContactInformation?.phoneNumber
      ) {
        change(
          "emergencyContactPhoneNumber",
          `${
            +sensitiveEmployeeEntity?.emergencyContactInformation?.dialCode +
            sensitiveEmployeeEntity?.emergencyContactInformation?.phoneNumber
          }`
        );
      }
      if (sensitiveEmployeeEntity?.emergencyContactInformation?.relation) {
        change(
          "emergencyContactRelation",
          PersonRelations?.find(
            (item) =>
              item.id ===
              sensitiveEmployeeEntity?.emergencyContactInformation?.relation
          )
        );
      }
      if (sensitiveEmployeeEntity?.commencementDate) {
        change(
          "commencementDate",
          moment(sensitiveEmployeeEntity?.commencementDate)
        );
      }
      change(
        "preCommencementExperience",
        sensitiveEmployeeEntity?.previousExperience
      );
      change("location", sensitiveEmployeeEntity?.location);
      if (sensitiveEmployeeEntity?.employmentType) {
        change("employmentType", {
          id: sensitiveEmployeeEntity?.employmentType,
          label: capitalizeLegend(sensitiveEmployeeEntity?.employmentType),
        });
      }
      change("hoursPerWeek", sensitiveEmployeeEntity?.hoursPerWeek);
      change("inputWeeksPerYear", sensitiveEmployeeEntity?.weeksPerYear);
      change("inputAnnualLeave", sensitiveEmployeeEntity?.annualLeave);
      change("inputSickLeave", sensitiveEmployeeEntity?.sickLeave);
      change("inputPublicHolidays", sensitiveEmployeeEntity?.publicHolidays);
      change("salary", sensitiveEmployeeEntity?.salary);
      change("chargeRate", sensitiveEmployeeEntity?.chargeRate);
      change("productivity", sensitiveEmployeeEntity?.productivity);
      if (sensitiveEmployeeEntity?.terminatedDate) {
        change(
          "dateTerminated",
          moment(sensitiveEmployeeEntity?.terminatedDate)
        );
      }
      if (sensitiveEmployeeEntity?.hireAgain) {
        change("hireAgain", {
          id: sensitiveEmployeeEntity?.hireAgain,
          label: capitalizeLegend(sensitiveEmployeeEntity?.hireAgain),
        });
      }
    }
  }, [basicEmployeeEntity, sensitiveEmployeeEntity]);

  useEffect(() => {
    if (!basicEmployeeEntity) {
      change("type", PersonTypeOptions[0]?.value);
      change("status", true);
    }
  }, []);

  const handleFileUpload = async (id: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "employeeId",
      personId ? basicEmployeeEntity?.id?.toString() : id
    );

    return new Promise<void>((resolve, reject) => {
      reduxDispatch(
        apiCall(
          EMPLOYEE_UPLOAD_API,
          resolve,
          reject,
          HttpMethods.POST,
          formData,
          { isFormData: true }
        )
      );
    })
      .then(() => {
        setFile(null);
      })
      .catch(() => {
        toast(() => (
          <Toast
            text={
              messages?.firmProfile?.people?.form?.errors?.[
                personId ? "updateImageUplodError" : "createImageUploadError"
              ]
            }
            type="error"
          />
        ));
      });
  };

  const handleDeleteFile = async (id: string) =>
    new Promise<void>((resolve, reject) => {
      reduxDispatch(
        apiCall(
          EMPLOYEE_IMAGE_REMOVE_API.replace(":id", personId),
          resolve,
          reject,
          HttpMethods.DELETE
        )
      );
    })
      .then(() => {
        toast(() => (
          <Toast
            text={
              messages?.firmProfile?.people?.form?.success?.[
                personId ? "updated" : "created"
              ]
            }
          />
        ));
      })
      .catch(() => {});

  const processPeoplImageActions = async (res: {
    data?: {
      id: Id;
      icon: {
        length: number;
      };
    };
  }) => {
    const id = res?.data?.id;
    const iconExists = res?.data?.icon?.length;
    const iconValueMissing = !formValues?.icon?.value;

    if (file) {
      await handleFileUpload(id?.toString());
    } else if (personId && iconExists && iconValueMissing) {
      await handleDeleteFile(id?.toString());
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getImageSrc = (
    file: any,
    isUpdate: boolean,
    formValues: Record<string, any>
  ) => {
    if (file) {
      return URL.createObjectURL(file);
    }
    if (isUpdate) {
      return formValues?.icon?.value || "";
    }
    return "";
  };

  const imageSrc = getImageSrc(file, !!personId, formValues);

  const onSubmit = async (data: FormData) => {
    let basicSanitizedBody: any = {
      tenantId: tenantId,
      firstName: trimWordWrapper(data?.firstName),
      lastName: trimWordWrapper(data?.lastName),
      email: data?.email,
      phoneNumber: data?.phone?.includes("-")
        ? data?.phone?.split("-")[1]
        : data?.phone?.substring(2),
      dialCode: data?.phone?.includes("-")
        ? data?.phone?.split("-")[0]
        : data?.phone?.substring(0, 2),
      dateOfBirth: moment(data?.dob)
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
        .format(),
      divisionId: data?.division ? data?.division?.id : data?.division,
      roleId: data?.role?.id,
      type: data?.type,
      status: data?.status ? Status.active : Status.inactive,
      bio: trimWordWrapper(data?.bio),
      linkedInUrl: trimWordWrapper(data?.linkedInUrl),
      extension: data?.extension,
    };

    return new Promise<any>((resolve, reject) => {
      reduxDispatch(
        apiCall(
          personId
            ? `${BASIC_EMPLOYEE_DETAIL}/${personId}`
            : BASIC_EMPLOYEE_DETAIL,
          resolve,
          reject,
          personId ? HttpMethods.PATCH : HttpMethods.POST,
          basicSanitizedBody
        )
      );
    })
      .then(async (res) => {
        await processPeoplImageActions(res);
        let sensitiveSanitizedBody: any = {
          employeeId: res?.data?.id,
          strength: trimWordWrapper(data?.strengths),
          weakness: trimWordWrapper(data?.weaknesses),
          tenantId: tenantId,
          commencementDate: moment(data?.commencementDate)
            .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
            .format(),
          preCommencementExperience: data?.preCommencementExperience,
          location: data?.location,
          employmentType: data.employmentType?.id,
          hoursPerWeek: data?.hoursPerWeek,
          weeksPerYear: data.inputWeeksPerYear,
          annualLeave: data.inputAnnualLeave,
          sickLeave: data.inputSickLeave,
          publicHolidays: data?.inputPublicHolidays,
          salary: data?.salary,
          chargeRate: data?.chargeRate,
          productivity: data?.productivity,
          terminatedDate: moment(data?.dateTerminated)
            .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
            .format(),
          hireAgain: data?.hireAgain?.id,
          potentialRoleId: data?.potentialRole?.id,
          personalContactInformation: {
            email: undefined,
            phoneNumber: undefined,
            dialCode: undefined,
          },
          emergencyContactInformation: {
            name: undefined,
            email: undefined,
            phoneNumber: undefined,
            dialCode: undefined,
            relationship: undefined,
          },
        };
        if (data?.personalEmail) {
          sensitiveSanitizedBody = {
            ...sensitiveSanitizedBody,
            personalContactInformation: {
              ...sensitiveSanitizedBody?.personalContactInformation,
              email: data?.personalEmail,
            },
          };
        }
        if (data?.personalPhoneNumber) {
          sensitiveSanitizedBody = {
            ...sensitiveSanitizedBody,
            personalContactInformation: {
              ...sensitiveSanitizedBody?.personalContactInformation,
              phoneNumber: data?.personalPhoneNumber?.includes("-")
                ? data?.personalPhoneNumber?.split("-")[1]
                : data?.personalPhoneNumber?.substring(2),
              dialCode: data?.personalPhoneNumber?.includes("-")
                ? data?.personalPhoneNumber?.split("-")[0]
                : data?.personalPhoneNumber?.substring(0, 2),
            },
          };
        }
        if (data?.emergencyContactPersonName) {
          sensitiveSanitizedBody = {
            ...sensitiveSanitizedBody,
            emergencyContactInformation: {
              ...sensitiveSanitizedBody?.emergencyContactInformation,
              name: trimWordWrapper(data?.emergencyContactPersonName),
            },
          };
        }
        if (data?.emergencyContactPersonEmail) {
          sensitiveSanitizedBody = {
            ...sensitiveSanitizedBody,
            emergencyContactInformation: {
              ...sensitiveSanitizedBody?.emergencyContactInformation,
              email: data?.emergencyContactPersonEmail,
            },
          };
        }
        if (data?.emergencyContactRelation?.id) {
          sensitiveSanitizedBody = {
            ...sensitiveSanitizedBody,
            emergencyContactInformation: {
              ...sensitiveSanitizedBody?.emergencyContactInformation,
              relationship: data?.emergencyContactRelation?.id,
            },
          };
        }
        if (data?.emergencyContactPhoneNumber) {
          sensitiveSanitizedBody = {
            ...sensitiveSanitizedBody,
            emergencyContactInformation: {
              ...sensitiveSanitizedBody?.emergencyContactInformation,
              phoneNumber: data?.emergencyContactPhoneNumber?.includes("-")
                ? data?.emergencyContactPhoneNumber?.split("-")[1]
                : data?.emergencyContactPhoneNumber.substring(2),
              dialCode: data?.emergencyContactPhoneNumber?.includes("-")
                ? data?.emergencyContactPhoneNumber?.split("-")[0]
                : data?.emergencyContactPhoneNumber.substring(0, 2),
            },
          };
        }
        return new Promise<void>((resolve, reject) => {
          reduxDispatch(
            apiCall(
              personId
                ? `${SENSITIVE_EMPLOYEE_DETAIL}/${personId}`
                : SENSITIVE_EMPLOYEE_DETAIL,
              resolve,
              reject,
              personId ? HttpMethods.PATCH : HttpMethods.POST,
              sensitiveSanitizedBody
            )
          );
        })
          .then(() => {
            toast(() => (
              <Toast
                text={
                  messages?.firmProfile?.people?.form?.success?.[
                    personId ? "updated" : "created"
                  ]
                }
              />
            ));
            reduxDispatch(push(routes.firmProfile.people));
          })
          .catch(async (error) => {
            if (!personId) {
              return new Promise<any>((resolve, reject) => {
                reduxDispatch(
                  apiCall(
                    `${DELETE_EMPLOYEE}/${res?.data?.id}`,
                    resolve,
                    reject,
                    HttpMethods.DELETE
                  )
                );
              })
                .then(() => {
                  toast(() => (
                    <Toast
                      text={
                        messages?.firmProfile?.people?.form?.success
                          ?.employeeDeleteSuccess
                      }
                      type="error"
                    />
                  ));
                })
                .catch((err) => {
                  toast(() => (
                    <Toast
                      text={
                        messages?.firmProfile?.people?.form?.error
                          ?.serverError?.[error?.message]
                      }
                      type="error"
                    />
                  ));
                });
            }
            toast(() => (
              <Toast
                text={
                  messages?.firmProfile?.people?.form?.error?.serverError?.[
                    error?.message
                  ]
                    ? messages?.firmProfile?.people?.form?.error?.serverError?.[
                        error?.message
                      ]
                    : messages?.firmProfile?.people?.form?.error?.serverError
                        ?.general
                }
                type="error"
              />
            ));
          });
      })
      .catch((error) => {
        toast(() => (
          <Toast
            text={
              messages?.firmProfile?.people?.form?.error?.serverError?.[
                error?.message
              ]
            }
            type="error"
          />
        ));
      });
  };
  return (
    <Container noPadding>
      <Form
        onSubmit={handleSubmit(onSubmit)}
        style={{ margin: "0px", gap: "8px" }}
      >
        <DetailPageWrapper
          heading={
            messages?.firmProfile?.people?.form?.[
              personId ? "editPeople" : "addPeople"
            ]
          }
          cardHeading={messages?.firmProfile?.people?.form?.generalInformation}
          cardContent={[
            {
              value: connectField("firstName", {
                label: messages?.firmProfile?.people?.form?.firstName,
                required: true,
              })(MaterialTextInput),
              gridWidth: 3,
            },
            {
              value: connectField("lastName", {
                label: messages?.firmProfile?.people?.form?.lastName,
                required: true,
              })(MaterialTextInput),
              gridWidth: 3,
            },
            {
              value: connectField("email", {
                label: messages?.firmProfile?.people?.form?.email,
                required: true,
              })(MaterialTextInput),
              gridWidth: 3,
            },
            {
              value: connectField("dob", {
                label: messages?.firmProfile?.people?.form?.dob,
                disableFuture: true,
                required: true,
              })(MaterialDateInput),
              gridWidth: 3,
            },
            {
              value: connectField("phone", {
                label: messages?.firmProfile?.people?.form?.phone,
                required: true,
              })(PhoneInput),
              gridWidth: 3,
            },
            {
              value: connectField("extension", {
                label: messages?.firmProfile?.people?.form?.extension,
              })(MaterialTextInput),
              gridWidth: 3,
            },
            {
              value: connectField("role", {
                label: messages?.firmProfile?.people?.form?.role,
                required: true,
                enableClearable: true,
                options: roleOptions?.map(mapIdNameToOptionWithoutCaptializing),
                searchOptions: roleSearchOptions,
              })(MaterialAutocompleteInput),
              gridWidth: 3,
            },
            {
              value: connectField("division", {
                label: messages?.firmProfile?.people?.form?.division,
                enableClearable: true,
                options: divisionOptions?.map(
                  mapIdNameToOptionWithoutCaptializing
                ),
                searchOptions: divisionSearchOptions,
              })(MaterialAutocompleteInput),
              gridWidth: 3,
            },
            {
              value: connectField("linkedInUrl", {
                label: messages?.firmProfile?.people?.form?.linkedin,
              })(MaterialTextInput),
              gridWidth: 3,
            },
            {
              heading: messages?.firmProfile?.people?.form?.type,
              value: connectField("type", {
                options: PersonTypeOptions,
                required: true,
              })(CustomRadioGroup),
              gridWidth: 12,
            },
            {
              heading: messages?.firmProfile?.people?.form?.profilePicture,
              value: (
                <StyledProfilePictureUploadContainer>
                  <StyledLaunchPadContainer
                    item
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    width="50px"
                    height="50px"
                    position="relative"
                  >
                    {file || formValues?.icon?.value ? (
                      <>
                        <StyledLaunchPadImage
                          src={imageSrc}
                          alt="application"
                        />
                        <StyledLaunchPadCloseIconContainer
                          onClick={() => {
                            setFile(null);
                            if (!!personId) {
                              change("icon", null);
                            }
                          }}
                        >
                          <StyledLaunchPadCloseIcon />
                        </StyledLaunchPadCloseIconContainer>
                      </>
                    ) : (
                      <StyledLaunchPadPhotoIcon />
                    )}
                  </StyledLaunchPadContainer>
                  <StyledFileInput
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={(e) => {
                      if (handleFileSelect(e)) {
                        if (fileSizeCheckFunction(e.target.files[0].size, 1)) {
                          toast(peopleFormToastComponent());
                          return;
                        }
                        setFile(e.target.files[0]);

                        const fileInput = e.target;
                        fileInput.value = null;
                      }
                    }}
                  />

                  <StyledFileUploadContainer
                    item
                    display="flex"
                    gap="5px"
                    onClick={handleClick}
                    padding="0 24px"
                  >
                    <StyledFileUploadOutlinedIcon />
                    <StyledUploadTypographyText>
                      {messages?.firmProfile?.people?.form?.uploadHere}
                    </StyledUploadTypographyText>
                  </StyledFileUploadContainer>
                </StyledProfilePictureUploadContainer>
              ),
              gridWidth: 3,
            },
            {
              value: (
                <Grid item display="flex">
                  {connectField("status", {
                    label: messages?.firmProfile?.people?.form?.status,
                  })(SwitchInput)}
                </Grid>
              ),
              gridWidth: 8,
            },
            {
              value: connectField("bio", {
                label: messages?.firmProfile?.people?.form?.bio,
                options: PersonTypeOptions,
                multiline: true,
                minRows: 4,
              })(MaterialTextInput),
              gridWidth: 12,
            },
          ]}
          hasGoBackIcon={true}
          detailedGridGap={2}
        />
        <DetailPageWrapper
          hasNoHeader={false}
          cardHeading={messages?.firmProfile?.people?.form?.contactInformation}
          containsPhoneNumber={true}
          cardContent={[
            {
              heading:
                messages?.firmProfile?.people?.form?.personalContactInformation,
              value: (
                <Grid container columnSpacing={2} rowGap={2}>
                  <Grid item xs={6}>
                    {connectField("personalEmail", {
                      label: messages?.firmProfile?.people?.form?.email,
                    })(MaterialTextInput)}
                  </Grid>
                  <Grid item xs={6}>
                    {connectField("personalPhoneNumber", {
                      label: messages?.firmProfile?.people?.form?.phone,
                      position: "absolute",
                    })(PhoneInput)}
                  </Grid>
                </Grid>
              ),
              gridWidth: 6,
            },
            {
              heading:
                messages?.firmProfile?.people?.form
                  ?.emergencyContactInformation,
              value: (
                <Grid container columnSpacing={2} rowGap={2}>
                  <Grid item xs={3}>
                    {connectField("emergencyContactPersonName", {
                      label: messages?.firmProfile?.people?.form?.name,
                    })(MaterialTextInput)}
                  </Grid>
                  <Grid item xs={3}>
                    {connectField("emergencyContactPersonEmail", {
                      label: messages?.firmProfile?.people?.form?.email,
                    })(MaterialTextInput)}
                  </Grid>
                  <Grid item xs={3}>
                    {connectField("emergencyContactPhoneNumber", {
                      label: messages?.firmProfile?.people?.form?.phone,
                      position: "absolute",
                    })(PhoneInput)}
                  </Grid>
                  <Grid item xs={3}>
                    {connectField("emergencyContactRelation", {
                      label: messages?.firmProfile?.people?.form?.relationship,
                      options: PersonRelations,
                    })(MaterialAutocompleteInput)}
                  </Grid>
                </Grid>
              ),
              gridWidth: 12,
            },
          ]}
          detailedGridGap={2}
        />
        <DetailPageWrapper
          hasNoHeader={false}
          cardHeading={messages?.firmProfile?.people?.form?.workInformation}
          cardContent={[
            {
              value: (
                <Grid container item xs={3}>
                  {connectField("potentialRole", {
                    label: messages?.firmProfile?.people?.form?.potentialRole,
                    enableClearable: true,
                    options: potentialRoleOptions?.map(
                      mapIdNameToOptionWithoutCaptializing
                    ),
                    searchOptions: potentialRoleSearchOptions,
                  })(MaterialAutocompleteInput)}
                </Grid>
              ),
              gridWidth: 12,
            },
            {
              value: connectField("strengths", {
                label: messages?.firmProfile?.people?.form?.strengths,
                options: PersonTypeOptions,
                multiline: true,
                minRows: 4,
              })(MaterialTextInput),
              gridWidth: 6,
            },
            {
              value: connectField("weaknesses", {
                label: messages?.firmProfile?.people?.form?.weaknesses,
                options: PersonTypeOptions,
                multiline: true,
                minRows: 4,
              })(MaterialTextInput),
              gridWidth: 6,
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
              value: connectField("commencementDate", {
                label: messages?.firmProfile?.people?.form?.commencementDate,
                required: true,
              })(MaterialDateInput),
              gridWidth: 3,
            },
            {
              value: connectField("preCommencementExperience", {
                label:
                  messages?.firmProfile?.people?.form
                    ?.preCommencementExperience,
                type: "number",
              })(MaterialTextInput),
              gridWidth: 3,
            },
            {
              value: connectField("location", {
                label: messages?.firmProfile?.people?.form?.location,
              })(MaterialTextInput),
              gridWidth: 3,
            },
            {
              value: connectField("employmentType", {
                label: messages?.firmProfile?.people?.form?.employmentType,
                options: EmployeeTypeOptions,
                required: true,
              })(MaterialAutocompleteInput),
              gridWidth: 3,
            },
            {
              value: connectField("hoursPerWeek", {
                label: messages?.firmProfile?.people?.form?.hoursPerWeek,
                type: "number",
                required: true,
              })(MaterialTextInput),
              gridWidth: 3,
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
              value: connectField("inputWeeksPerYear", {
                label: messages?.firmProfile?.people?.form?.inputWeeksPerYear,
                type: "number",
                required: true,
              })(MaterialTextInput),
              gridWidth: 3,
            },
            {
              value: connectField("inputAnnualLeave", {
                label: `${messages?.firmProfile?.people?.form?.inputAnnualLeave} (In Weeks)`,
                type: "number",
                required: true,
              })(MaterialTextInput),
              gridWidth: 3,
            },
            {
              value: connectField("inputSickLeave", {
                label: `${messages?.firmProfile?.people?.form?.inputSickLeave} (In Weeks)`,
                type: "number",
                required: true,
              })(MaterialTextInput),
              gridWidth: 3,
            },
            {
              value: connectField("inputPublicHolidays", {
                label: `${messages?.firmProfile?.people?.form?.inputPublicHolidays} (In Weeks)`,
                type: "number",
                required: true,
              })(MaterialTextInput),
              gridWidth: 3,
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
              value: connectField("salary", {
                label: messages?.firmProfile?.people?.form?.salary,
                type: "number",
                required: true,
              })(MaterialTextInput),
              gridWidth: 3,
            },
            {
              value: connectField("chargeRate", {
                label: `${messages?.firmProfile?.people?.form?.chargeRate} ($)`,
                type: "number",
                required: true,
              })(MaterialTextInput),
              gridWidth: 3,
            },
            {
              value: connectField("productivity", {
                label: messages?.firmProfile?.people?.form?.productivity,
                type: "number",
                required: true,
              })(MaterialTextInput),
              gridWidth: 3,
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
              value: connectField("dateTerminated", {
                label: messages?.firmProfile?.people?.form?.dateTerminated,
              })(MaterialDateInput),
              gridWidth: 3,
              isTypography: true,
            },
            {
              value: connectField("hireAgain", {
                label: messages?.firmProfile?.people?.form?.hireAgain,
                options: DecisionOption,
                enableClearable: true,
              })(MaterialAutocompleteInput),
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
                messages?.firmProfile?.people?.form?.billableWorkingWeeks,
              value: billableWorkingWeeks(
                formValues?.inputWeeksPerYear?.value,
                formValues?.inputAnnualLeave?.value,
                formValues?.inputSickLeave?.value,
                formValues?.inputPublicHolidays?.value
              ),
              gridWidth: 2,
              isTypography: true,
            },
            {
              heading: messages?.firmProfile?.people?.form?.totalHours,
              value: totalHours(
                billableWorkingWeeks(
                  formValues?.inputWeeksPerYear?.value,
                  formValues?.inputAnnualLeave?.value,
                  formValues?.inputSickLeave?.value,
                  formValues?.inputPublicHolidays?.value
                ),
                formValues?.hoursPerWeek?.value
              ),
              gridWidth: 2,
              isTypography: true,
            },
            {
              heading: messages?.firmProfile?.people?.form?.productiveHours,
              value: finalProductiveHours(
                totalHours(
                  billableWorkingWeeks(
                    formValues?.inputWeeksPerYear?.value,
                    formValues?.inputAnnualLeave?.value,
                    formValues?.inputSickLeave?.value,
                    formValues?.inputPublicHolidays?.value
                  ),
                  formValues?.hoursPerWeek?.value
                ),
                formValues?.productivity?.value
              ),
              gridWidth: 2,
              isTypography: true,
            },
            {
              heading: messages?.firmProfile?.people?.form?.costPerHour,
              value: formatCurrency(
                finalCostPerHour(
                  formValues?.salary?.value,
                  totalHours(
                    billableWorkingWeeks(
                      formValues?.inputWeeksPerYear?.value,
                      formValues?.inputAnnualLeave?.value,
                      formValues?.inputSickLeave?.value,
                      formValues?.inputPublicHolidays?.value
                    ),
                    formValues?.hoursPerWeek?.value
                  )
                ),
                false
              ),
              gridWidth: 2,
              isTypography: true,
            },
            {
              heading: messages?.firmProfile?.people?.form?.multipleLabourCost,
              value: formatCurrency(
                finalCostPerHour(
                  feeCapacity(
                    finalProductiveHours(
                      totalHours(
                        billableWorkingWeeks(
                          formValues?.inputWeeksPerYear?.value,
                          formValues?.inputAnnualLeave?.value,
                          formValues?.inputSickLeave?.value,
                          formValues?.inputPublicHolidays?.value
                        ),
                        formValues?.hoursPerWeek?.value
                      ),
                      formValues?.productivity?.value
                    ),
                    formValues?.chargeRate?.value
                  ),
                  formValues?.salary?.value
                ),
                false
              ),
              gridWidth: 3,
              isTypography: true,
            },
            {
              heading: messages?.firmProfile?.people?.form?.feesCapacity,
              value: formatCurrency(
                feeCapacity(
                  finalProductiveHours(
                    totalHours(
                      billableWorkingWeeks(
                        formValues?.inputWeeksPerYear?.value,
                        formValues?.inputAnnualLeave?.value,
                        formValues?.inputSickLeave?.value,
                        formValues?.inputPublicHolidays?.value
                      ),
                      formValues?.hoursPerWeek?.value
                    ),
                    formValues?.productivity?.value
                  ),
                  formValues?.chargeRate?.value
                ),
                false
              ),
              isTypography: true,
            },
            {
              heading: messages?.firmProfile?.people?.form?.grossProfitkpi,
              value: GrossProfitKPI(
                feeCapacity(
                  finalProductiveHours(
                    totalHours(
                      billableWorkingWeeks(
                        formValues?.inputWeeksPerYear?.value,
                        formValues?.inputAnnualLeave?.value,
                        formValues?.inputSickLeave?.value,
                        formValues?.inputPublicHolidays?.value
                      ),
                      formValues?.hoursPerWeek?.value
                    ),
                    formValues?.productivity?.value
                  ),
                  formValues?.chargeRate?.value
                ),
                formValues?.salary?.value
              ),
              isTypography: true,
            },
          ]}
          detailedGridGap={2}
        />
        <Grid
          container
          padding="14px 24px"
          gap="15px"
          justifyContent="flex-end"
        >
          <Button
            label={
              messages?.firmProfile?.missionVisionValues
                ?.addNewMissionVisionValue?.cancel
            }
            variant="outlined"
            color="secondary"
            onClick={() => reduxDispatch(goBack())}
          />
          <Button
            label={
              messages?.firmProfile?.missionVisionValues
                ?.addNewMissionVisionValue?.[personId ? "update" : "add"]
            }
            variant="contained"
            color="primary"
            type="submit"
            disabled={submitting}
          />
        </Grid>
      </Form>
    </Container>
  );
};

export default PeopleForm;
