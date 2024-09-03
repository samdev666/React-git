import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  HttpMethods,
  generateStrongPassword,
  passwordValidator,
  requiredIf,
} from '@wizehub/common/utils';
import { useFormReducer } from '@wizehub/common/hooks';
import {
  Form,
  FormError,
  FormRow,
  FormRowItem,
  MaterialTextInput,
  Button,
  Toast,
  CustomRadioGroup,
} from '@wizehub/components';
import {
  Checkbox,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Id, toast } from 'react-toastify';
import CopyAllOutlinedIcon from '@mui/icons-material/CopyAllOutlined';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import { apiCall } from '../../redux/actions';
import { USER_MANAGEMENT_PASSWORD } from '../../api';
import { StyledFormControlLabel } from '../auth/styles';
import messages from '../../messages';

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
  userId: Id;
}

const checkManualPassword = (type: string) => (formValues: {passwordType: {value: string}}) => formValues?.passwordType?.value === type;

const validators = {
  password: [
    requiredIf(
      messages.userManagement.passwordForm.validators.password,
      checkManualPassword('manually'),
    ),
    passwordValidator,
  ],
};

const UserPasswordForm: React.FC<Props> = ({ onCancel, onSuccess, userId }) => {
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
          <Toast text={messages?.userManagement?.form?.textCopy?.success} />
        ));
      })
      .catch(() => {
        toast(() => (
          <Toast
            type="error"
            text={messages?.userManagement?.form?.textCopy?.error}
          />
        ));
      });
  };

  const onSubmit = async (data: {password: string}) => new Promise<void>((resolve, reject) => {
    const sanitizedBody = {
      userId,
      newPassword:
          formValues?.passwordType?.value === 'automatically'
            ? password
            : data?.password,
      notifyUser: selectedCheckBox,
    };
    reduxDispatch(
      apiCall(
        USER_MANAGEMENT_PASSWORD,
        resolve,
        reject,
        HttpMethods.POST,
        sanitizedBody,
      ),
    );
  })
    .then(() => {
      onSuccess();
      toast(() => (
        <Toast
          text={messages?.userManagement?.passwordForm?.success?.updated}
        />
      ));
    })
    .catch((error) => {
      setSubmitError(error?.message);
    });

  useEffect(() => {
    change('passwordType', 'automatically');
  }, []);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRowItem alignItems="center" gap="16px">
        <Typography variant="subtitle1">
          {messages.userManagement.form.generate}
        </Typography>
        {connectField('passwordType', {
          options: [
            {
              value: 'automatically',
              label: messages.userManagement.form.automatically,
            },
            { value: 'manually', label: messages.userManagement.form.manually },
          ],
          required: true,
        })(CustomRadioGroup)}
      </FormRowItem>
      <FormRow width="562px" mt={2}>
        {formValues?.passwordType?.value === 'manually' ? (
          <FormRowItem>
            {connectField('password', {
              label: messages.userManagement.form.enterPassword,
              required: true,
            })(MaterialTextInput)}
          </FormRowItem>
        ) : (
          <FormRowItem gap="16px">
            <MaterialTextInput
              label={messages.userManagement.form.generatePassword}
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
              label={messages.userManagement.form.copy}
              onClick={handleCopyText}
            />
          </FormRowItem>
        )}
      </FormRow>
      <FormRow>
        <FormRowItem>
          <StyledFormControlLabel
            control={(
              <Checkbox
                value={selectedCheckBox}
                onChange={() => setSelectedCheckBox((prev) => !prev)}
              />
            )}
            label={messages.userManagement.form.passwordDetails}
          />
        </FormRowItem>
      </FormRow>
      {submitError && (
        <FormRow>
          <FormRowItem>
            <FormError
              message={
                messages?.user?.form?.errors?.serverErrors?.[submitError]
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
          label={messages?.general?.cancel}
        />
        <Button
          variant="contained"
          type="submit"
          disabled={submitting}
          label={messages?.general?.update}
        />
      </FormRow>
    </Form>
  );
};

export default UserPasswordForm;
