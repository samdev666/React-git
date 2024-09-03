import { useFormReducer, useOptions } from "@wizehub/common/hooks";
import {
  AccountManagementEntity,
  PersonBasicDetailEntity,
} from "@wizehub/common/models/genericEntities";
import {
  HttpMethods,
  capitalizeLegend,
  generateStrongPassword,
  mapIdNameToOptionWithoutCaptializing,
  passwordValidator,
  required,
  requiredIf,
} from "@wizehub/common/utils";
import {
  Button,
  CustomRadioGroup,
  Form,
  FormError,
  FormRow,
  FormRowItem,
  MaterialAutocompleteInput,
  MaterialTextInput,
  SwitchInput,
  Toast,
} from "@wizehub/components";
import React, { useEffect, useState } from "react";
import messages from "../../messages";
import { StyledFormControlLabel } from "@wizehub/components/switchinput/styles";
import {
  Checkbox,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import { StyledUserLoginFormControlLabel } from "./styles";
import { StyledResponsiveIcon } from "@wizehub/components/table/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Id,
  MetaData,
  Option,
  RoleInterface,
  getDefaultMetaData,
} from "@wizehub/common/models";
import {
  ACCOUNT_MANAGEMENT_API,
  PEOPLE_LISTING_API,
  ROLE_LISTING_API,
} from "../../api";
import { getDefaultRoleFilter } from "./accountManagement";
import { useSelector } from "react-redux";
import { ReduxState } from "../../redux/reducers";
import { mapIdFirstNameLastNameToOptionWithoutCaptializing } from "../firmProfile/teamStructure/addTeamMemberForm";
import { Status } from "@wizehub/common/models/modules";
import { useDispatch } from "react-redux";
import { apiCall } from "@wizehub/common/redux/actions";
import { toast } from "react-toastify";
import { push } from "connected-react-router";
import { routes } from "../../utils";
import CopyAllOutlinedIcon from "@mui/icons-material/CopyAllOutlined";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
  isUpdate?: boolean;
  accountManagementDetail?: AccountManagementEntity;
}

const getDefaultTeamMemberFilter = (): MetaData<PersonBasicDetailEntity> => ({
  ...getDefaultMetaData<PersonBasicDetailEntity>(),
  filters: {
    status: Status.active,
  },
});

interface FormData {
  user: Option;
  role: Option;
  status: Status;
}
const checkManualPassword =
  (type: string) => (formValues: { passwordType: { value: string } }) =>
    formValues?.passwordType?.value === type;

export const ResponsivePasswordIcon = StyledResponsiveIcon(LockOutlinedIcon);

const AddAccountForm: React.FC<Props> = ({
  onCancel,
  onSuccess,
  accountManagementDetail,
  isUpdate,
}) => {
  const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
  const [selectedCheckBox, setSelectedCheckBox] = useState<boolean>(false);

  const [password, setPassword] = useState<string>(generateStrongPassword(10));
  const reduxDispatch = useDispatch();

  const handleCopyText = () => {
    navigator.clipboard
      .writeText(password)
      .then(() => {
        toast(() => (
          <Toast
            text={messages?.settings?.accountManagement?.form?.success?.copied}
          />
        ));
      })
      .catch(() => {
        toast(() => (
          <Toast
            type="error"
            text={
              messages?.settings?.accountManagement?.form?.copiedNotSuccesful
            }
          />
        ));
      });
  };

  const checkVerifyMethod = () => () => !isUpdate;

  const validators = {
    user: [
      requiredIf(
        messages?.settings?.accountManagement?.form?.validators?.user,
        checkVerifyMethod()
      ),
    ],
    role: [
      required(messages?.settings?.accountManagement?.form?.validators?.role),
    ],
    password: [
      requiredIf(
        messages?.settings?.accountManagement?.form?.validators?.password,
        checkManualPassword("manually")
      ),
      passwordValidator,
    ],
  };
  const {
    submitting,
    submitError,
    handleSubmit,
    connectField,
    setSubmitError,
    formValues,
    change,
  } = useFormReducer(validators);
  const onSubmit = async (data: FormData) => {
    let sanitizeBody: any = {
      tenantId: tenantId,
      employeeId: data?.user?.id,
      status: data.status ? Status.active : Status.inactive,
      roleId: data?.role?.id,
      password:
        formValues?.passwordType?.value === "manually"
          ? formValues?.password?.value
          : password,
    };
    if (!isUpdate) {
      sanitizeBody = {
        ...sanitizeBody,
        notifyUser: selectedCheckBox,
      };
    }
    return new Promise<void>((resolve, reject) => {
      reduxDispatch(
        apiCall(
          isUpdate
            ? `${ACCOUNT_MANAGEMENT_API}/${accountManagementDetail?.id}`
            : ACCOUNT_MANAGEMENT_API,
          resolve,
          reject,
          isUpdate ? HttpMethods.PATCH : HttpMethods.POST,
          sanitizeBody
        )
      );
    })
      .then(() => {
        onSuccess();
        toast(
          <Toast
            text={
              messages?.settings?.accountManagement?.form?.success?.[
                isUpdate ? "updated" : "created"
              ]
            }
          />
        );
      })
      .catch((error) => {
        setSubmitError(error?.message);
      });
  };
  const { options: roleOptions, searchOptions: searchRoleOptions } =
    useOptions<RoleInterface>(ROLE_LISTING_API, true, getDefaultRoleFilter());

  const { options: peopleOptions, searchOptions: searchPeopleOptions } =
    useOptions<PersonBasicDetailEntity>(
      PEOPLE_LISTING_API.replace(":tenantId", tenantId),
      true,
      getDefaultTeamMemberFilter()
    );

  const generatePassword = () => {
    setPassword(generateStrongPassword(10));
  };

  useEffect(() => {
    if (isUpdate) {
      change("role", {
        id: accountManagementDetail?.role?.id,
        label: capitalizeLegend(accountManagementDetail?.role?.name),
      });
      change("status", accountManagementDetail?.status === Status.active);
    }
  }, []);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {!isUpdate && (
        <FormRow width="562px">
          <FormRowItem width="423px" gap="16px" alignItems="flex-start">
            {connectField("user", {
              label: messages?.settings?.accountManagement?.form?.user,
              options: peopleOptions?.map(
                mapIdFirstNameLastNameToOptionWithoutCaptializing
              ),
              searchOptions: searchPeopleOptions,
              required: true,
              enableClearable: true,
            })(MaterialAutocompleteInput)}
            <Button
              variant="text"
              color="primary"
              label={messages?.settings?.accountManagement?.form?.createNew}
              disableRipple
              onClick={() => {
                onCancel();
                reduxDispatch(push(routes.firmProfile.peopleForm));
              }}
            />
          </FormRowItem>
        </FormRow>
      )}
      <FormRow width="562px">
        <FormRowItem>
          {connectField("role", {
            label: messages?.settings?.accountManagement?.form?.role,
            options: roleOptions?.map(mapIdNameToOptionWithoutCaptializing),
            searchOptions: searchRoleOptions,
            required: true,
            enableClearable: true,
          })(MaterialAutocompleteInput)}
        </FormRowItem>
      </FormRow>
      {!isUpdate && (
        <>
          <FormRow>
            <FormRowItem alignItems="center" gap="16px">
              <Typography variant="subtitle1">
                {messages?.settings?.accountManagement?.form?.generate}
              </Typography>
              {connectField("passwordType", {
                options: [
                  {
                    value: "automatically",
                    label:
                      messages?.settings?.accountManagement?.form
                        ?.automatically,
                  },
                  {
                    value: "manually",
                    label:
                      messages?.settings?.accountManagement?.form?.manually,
                  },
                ],
                required: true,
              })(CustomRadioGroup)}
            </FormRowItem>
          </FormRow>
          <FormRow width="562px" mt={2}>
            {formValues?.passwordType?.value === "manually" ? (
              <FormRowItem>
                {connectField("password", {
                  label: messages?.settings?.accountManagement?.form?.password,
                  required: true,
                })(MaterialTextInput)}
              </FormRowItem>
            ) : (
              <FormRowItem gap="16px">
                <MaterialTextInput
                  label={messages?.settings?.accountManagement?.form?.generate}
                  value={password}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => generatePassword()}>
                          <RotateLeftIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  startIcon={<CopyAllOutlinedIcon />}
                  variant="contained"
                  disabled={submitting}
                  label={messages?.settings?.accountManagement?.form?.copy}
                  onClick={handleCopyText}
                />
              </FormRowItem>
            )}
          </FormRow>
        </>
      )}
      {!isUpdate && (
        <FormRow>
          <FormRowItem>
            <StyledUserLoginFormControlLabel
              control={
                <Checkbox
                  value={selectedCheckBox}
                  onChange={() => setSelectedCheckBox((prev) => !prev)}
                />
              }
              label={
                messages?.settings?.accountManagement?.form
                  ?.sendLoginCredentials
              }
            />
          </FormRowItem>
        </FormRow>
      )}
      <FormRow alignItems="center">
        <FormRowItem>
          {connectField("status", {
            label: messages?.settings?.accountManagement?.form?.userStatus,
          })(SwitchInput)}
        </FormRowItem>
      </FormRow>

      {submitError && (
        <FormRow>
          <FormRowItem>
            <FormError
              message={
                messages?.settings?.accountManagement?.form?.error
                  ?.serverError?.[submitError]
              }
            />
          </FormRowItem>
        </FormRow>
      )}
      <FormRow justifyContent="space-between" mb={0}>
        <FormRowItem justifyContent="end" gap={2}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onCancel}
            label={messages?.settings?.accountManagement?.form?.cancel}
          />
          <Button
            variant="contained"
            type="submit"
            disabled={submitting}
            label={
              messages?.settings?.accountManagement?.form?.[
                isUpdate ? "update" : "create"
              ]
            }
          />
        </FormRowItem>
      </FormRow>
    </Form>
  );
};

export default AddAccountForm;
