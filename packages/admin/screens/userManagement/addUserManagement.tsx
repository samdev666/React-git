import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  HttpMethods,
  capitalizeLegend,
  emailValidator,
  emptyValueValidator,
  mapIdNameToOption,
  required,
  trimWordWrapper,
} from '@wizehub/common/utils';
import { useFormReducer, useOptions } from '@wizehub/common/hooks';
import {
  Form,
  FormError,
  FormRow,
  FormRowItem,
  MaterialAutocompleteInput,
  MaterialTextInput,
  SwitchInput,
  Toast,
  Button,
} from '@wizehub/components';
import { Checkbox } from '@mui/material';
import { toast } from 'react-toastify';
import { Status } from '@wizehub/common/models/modules';
import { useParams } from 'react-router-dom';
import { Id, RoleInterface } from '@wizehub/common/models';
import { UserManagementEntity } from '@wizehub/common/models/genericEntities';
import { apiCall } from '../../redux/actions';
import { ROLES_FILTER, USER_MANAGEMENT } from '../../api';
import { StyledFormControlLabel } from '../auth/styles';
import messages from '../../messages';

interface Props {
  isUpdate?: boolean;
  userManagement?: UserManagementEntity;
  onCancel: () => void;
  onSuccess: () => void;
}

const validators = {
  email: [required(messages.userManagement.form.validators.emailAddress), emailValidator],
  firstName: [required(messages.userManagement.form.validators.firstName), emptyValueValidator],
  lastName: [required(messages.userManagement.form.validators.lastName), emptyValueValidator],
  role: [required(messages.userManagement.form.validators.role)],
};

interface FormData{
  email: string;
  firstName: string;
  lastName: string;
  role: {
    id: Id
  };
  status: Status;
}

const UserManagementForm: React.FC<Props> = ({
  onCancel,
  onSuccess,
  isUpdate = false,
  userManagement,
}) => {
  const { id } = useParams<{ id?: string }>();
  const {
    submitting,
    submitError,
    handleSubmit,
    connectField,
    change,
    setSubmitError,
  } = useFormReducer(validators);
  const reduxDispatch = useDispatch();
  const [checkboxValue, setCheckboxValue] = useState<boolean>(false);

  const { options: roleOptions, searchOptions } = useOptions<RoleInterface>(
    ROLES_FILTER,
    true,
  );

  const onSubmit = async (data: FormData) => new Promise<void>((resolve, reject) => {
    const sanitizedBody = {
      email: data.email,
      firstName: trimWordWrapper(data.firstName),
      lastName: trimWordWrapper(data.lastName),
      roleId: data.role.id,
      status: data.status ? Status.active : Status.inactive,
      notifyUser: checkboxValue,
    };
    reduxDispatch(
      apiCall(
        isUpdate ? `${USER_MANAGEMENT}/${id}` : USER_MANAGEMENT,
        resolve,
        reject,
        isUpdate ? HttpMethods.PATCH : HttpMethods.POST,
        sanitizedBody,
      ),
    );
  })
    .then(() => {
      onSuccess();
      toast(() => (
        <Toast
          text={
              messages?.userManagement?.form?.success?.[
                isUpdate ? 'updated' : 'created'
              ]
            }
        />
      ));
    })
    .catch((error) => {
      setSubmitError(error?.message);
    });

  useEffect(() => {
    if (isUpdate && roleOptions) {
      change('email', userManagement?.email);
      change('firstName', userManagement?.firstName);
      change('lastName', userManagement?.lastName);
      change('status', userManagement?.status === Status.active);
      change('role', {
        id: userManagement?.role?.id,
        label: capitalizeLegend(userManagement?.role?.name),
      });
    }
  }, []);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow minWidth="530px">
        <FormRowItem>
          {connectField('email', {
            label: messages.userManagement.form.emailAddress,
            required: true,
          })(MaterialTextInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          {connectField('firstName', {
            label: messages.userManagement.form.firstName,
            required: true,
          })(MaterialTextInput)}
        </FormRowItem>
        <FormRowItem>
          {connectField('lastName', {
            label: messages.userManagement.form.lastName,
            required: true,
          })(MaterialTextInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          {connectField('role', {
            label: messages.userManagement.form.role,
            required: true,
            enableClearable: true,
            options: roleOptions?.map(mapIdNameToOption),
            searchOptions,
          })(MaterialAutocompleteInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          {connectField('status', {
            label: messages.userManagement.form.userStatus,
          })(SwitchInput)}
        </FormRowItem>
      </FormRow>
      {!isUpdate && (
        <StyledFormControlLabel
          control={(
            <Checkbox
              value={checkboxValue}
              onChange={() => setCheckboxValue((prev) => !prev)}
            />
          )}
          label={messages.userManagement.form.sendLoginCredentials}
        />
      )}
      {submitError && (
        <FormRow>
          <FormRowItem>
            <FormError
              message={messages?.general?.error?.serverError?.[submitError]}
            />
          </FormRowItem>
        </FormRow>
      )}
      <FormRow justifyContent="end" marginBottom="0px">
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
          label={messages?.general?.[isUpdate ? 'update' : 'create']}
        />
      </FormRow>
    </Form>
  );
};

export default UserManagementForm;
