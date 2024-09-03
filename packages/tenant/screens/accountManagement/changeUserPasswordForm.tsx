import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  HttpMethods,
  generateStrongPassword,
  passwordValidator,
  requiredIf,
} from "@wizehub/common/utils";
import { useFormReducer } from "@wizehub/common/hooks";
import {
  Form,
  FormError,
  FormRow,
  FormRowItem,
  MaterialTextInput,
  Button,
  Toast,
  CustomRadioGroup,
} from "@wizehub/components";
import {
  Checkbox,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Id, toast } from "react-toastify";
import CopyAllOutlinedIcon from "@mui/icons-material/CopyAllOutlined";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import { apiCall } from "../../redux/actions";
import messages from "../../messages";
import { ACCOUNT_MANAGEMENT_API } from "../../api";
import { StyledFormControlLabel } from "@wizehub/components/switchinput/styles";
import { useSelector } from "react-redux";
import { ReduxState } from "../../redux/reducers";
import md5 from "md5";

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
  userId: Id;
}

const checkManualPassword =
  (type: string) => (formValues: { passwordType: { value: string } }) =>
    formValues?.passwordType?.value === type;

const validators = {
  password: [
    requiredIf(
      messages?.settings?.accountManagement?.form?.validators?.password,
      checkManualPassword("manually")
    ),
    passwordValidator,
  ],
};

const UserPasswordForm: React.FC<Props> = ({ onCancel, onSuccess, userId }) => {
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
  const [selectedCheckBox, setSelectedCheckBox] = useState<boolean>(false);
  const [password, setPassword] = useState<string>(generateStrongPassword(10));

  const generatePassword = () => {
    setPassword(generateStrongPassword(10));
  };

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

  const onSubmit = async (data: { password: string }) =>
    new Promise<void>((resolve, reject) => {
      const sanitizedBody = {
        tenantId: tenantId,
        userId,
        newPassword:
          formValues?.passwordType?.value === "automatically"
            ? password
            : data?.password,
        notifyUser: selectedCheckBox,
      };
      reduxDispatch(
        apiCall(
          `${ACCOUNT_MANAGEMENT_API}/${userId}`,
          resolve,
          reject,
          HttpMethods.PATCH,
          sanitizedBody
        )
      );
    })
      .then(() => {
        onSuccess();
        toast(() => (
          <Toast
            text={
              messages?.settings?.accountManagement?.form?.success?.password
            }
          />
        ));
      })
      .catch((error) => {
        setSubmitError(error?.message);
      });

  useEffect(() => {
    change("passwordType", "automatically");
  }, []);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRowItem alignItems="center" gap="16px">
        <Typography variant="subtitle1">
          {messages?.settings?.accountManagement?.form?.generate}
        </Typography>
        {connectField("passwordType", {
          options: [
            {
              value: "automatically",
              label: messages?.settings?.accountManagement?.form?.automatically,
            },
            {
              value: "manually",
              label: messages?.settings?.accountManagement?.form?.manually,
            },
          ],
          required: true,
        })(CustomRadioGroup)}
      </FormRowItem>
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
      <FormRow>
        <FormRowItem>
          <StyledFormControlLabel
            control={
              <Checkbox
                value={selectedCheckBox}
                onChange={() => setSelectedCheckBox((prev) => !prev)}
              />
            }
            label={
              messages?.settings?.accountManagement?.form?.sendLoginCredentials
            }
          />
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
      <FormRow justifyContent="flex-end" marginBottom="0px">
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
          label={messages?.settings?.accountManagement?.form?.update}
        />
      </FormRow>
    </Form>
  );
};

export default UserPasswordForm;
