import React from 'react';
import { useDispatch } from 'react-redux';
import {
  HttpMethods,
  mapIdFullNameToOption,
  required,
} from '@wizehub/common/utils';
import { useFormReducer, useOptions } from '@wizehub/common/hooks';
import {
  Form,
  FormError,
  FormRow,
  FormRowItem,
  MaterialAutocompleteInput,
  Toast,
  Button,
} from '@wizehub/components';
import { toast } from 'react-toastify';
import { UserManagementEntity } from '@wizehub/common/models/genericEntities';
import { useParams } from 'react-router-dom';
import { MetaData, getDefaultMetaData } from '@wizehub/common/models';
import { Status } from '@wizehub/common/models/modules';
import {
  TENANT_GROUP_USER,
  TENANT_USER,
  USER_MANAGEMENT_LISTING_API,
} from '../../api';
import { apiCall } from '../../redux/actions';
import messages from '../../messages';

interface Props {
  onCancel: () => void;
  onCreateNewUserButton: () => void;
  onSuccess: () => void;
  isGroupForm?: boolean;
}

interface FormData {
  name: {
    id: string;
  };
}

interface ApiSanitizedBody {
  userId: string;
  groupId?: string;
  tenantId?: string;
}

const validators = {
  name: [required(messages?.tenantManagement?.form?.validators?.name)],
};

const getDefaultUsers = (): MetaData<UserManagementEntity> => ({
  ...getDefaultMetaData<UserManagementEntity>(),
  filters: {
    status: Status.active,
  },
});

const AddNewUserForm: React.FC<Props> = ({
  onCancel,
  onSuccess,
  onCreateNewUserButton,
  isGroupForm,
}) => {
  const {
    submitting,
    submitError,
    handleSubmit,
    connectField,
    setSubmitError,
  } = useFormReducer(validators);
  const reduxDispatch = useDispatch();
  const { id } = useParams<{ id?: string }>();

  const { options: userOptions, searchOptions } = useOptions<UserManagementEntity>(USER_MANAGEMENT_LISTING_API, true, getDefaultUsers());

  const onSubmit = async (data: FormData) => new Promise<any>((resolve, reject) => {
    let sanitizedBody: ApiSanitizedBody = {
      userId: data?.name?.id,
    };
    if (isGroupForm) {
      sanitizedBody = {
        ...sanitizedBody,
        groupId: id,
      };
    } else {
      sanitizedBody = {
        ...sanitizedBody,
        tenantId: id,
      };
    }
    reduxDispatch(
      apiCall(
        isGroupForm ? TENANT_GROUP_USER : TENANT_USER,
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
          text={messages?.tenantManagement?.addNewUser?.success?.created}
        />
      ));
    })
    .catch((error) => {
      setSubmitError(error?.message);
    });

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow width="562px">
        <FormRowItem width="423px" gap="16px" alignItems="flex-start">
          {connectField('name', {
            label: messages?.tenantManagement?.addNewUser?.name,
            options: userOptions?.map(mapIdFullNameToOption),
            searchOptions,
            required: true,
          })(MaterialAutocompleteInput)}
          <Button
            variant="text"
            color="primary"
            label={messages?.tenantManagement?.addNewUser?.createNewUser}
            disableRipple
            onClick={() => {
              onSuccess();
              onCreateNewUserButton();
            }}
          />
        </FormRowItem>
      </FormRow>

      {submitError && (
        <FormRow>
          <FormRowItem>
            <FormError
              message={messages?.general?.error?.serverError?.[submitError]}
            />
          </FormRowItem>
        </FormRow>
      )}
      <FormRow justifyContent="end" mb={0}>
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
          label={messages?.general?.add}
        />
      </FormRow>
    </Form>
  );
};

export default AddNewUserForm;
