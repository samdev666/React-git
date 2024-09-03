import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  HttpMethods,
  emptyValueValidator,
  required,
  trimWordWrapper,
} from '@wizehub/common/utils';
import { useFormReducer } from '@wizehub/common/hooks';
import {
  Form,
  FormError,
  FormRow,
  FormRowItem,
  MaterialTextInput,
  SwitchInput,
  Toast,
  Button,
} from '@wizehub/components';
import { toast } from 'react-toastify';
import { Status } from '@wizehub/common/models/modules';
import { TenantGroupManagementEntity } from '@wizehub/common/models/genericEntities';
import { TENANT_GROUP } from '../../api';
import { apiCall } from '../../redux/actions';
import messages from '../../messages';

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
  isUpdate?: boolean;
  groupTenantDetail?: TenantGroupManagementEntity;
}

const validators = {
  name: [
    required(messages?.tenantManagement?.groupForm?.validator?.name),
    emptyValueValidator,
  ],
  description: [
    required(messages?.tenantManagement?.groupForm?.validator?.description),
  ],
};

interface FormData{
  name: string;
  status: Status;
  description: string;
}

const AddGroupForm: React.FC<Props> = ({
  onCancel,
  onSuccess,
  isUpdate,
  groupTenantDetail,
}) => {
  const {
    submitting,
    submitError,
    handleSubmit,
    connectField,
    change,
    setSubmitError,
  } = useFormReducer(validators);
  const reduxDispatch = useDispatch();

  const onSubmit = async (data: FormData) => new Promise<void>((resolve, reject) => {
    const sanitizedBody = {
      name: trimWordWrapper(data?.name),
      status: data?.status ? Status.active : Status.inactive,
      description: trimWordWrapper(data?.description),
    };
    reduxDispatch(
      apiCall(
        isUpdate ? `${TENANT_GROUP}/${groupTenantDetail?.id}` : TENANT_GROUP,
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
              messages?.tenantManagement?.groupForm?.success?.[
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
    if (isUpdate && groupTenantDetail) {
      change('name', groupTenantDetail?.name);
      change('description', groupTenantDetail?.description);
      change('status', groupTenantDetail?.status === Status.active);
    }
  }, [groupTenantDetail]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow width="562px">
        <FormRowItem width="423px" gap="16px" alignItems="center">
          {connectField('name', {
            label: messages?.tenantManagement?.groupForm?.name,
            required: true,
          })(MaterialTextInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          {connectField('description', {
            multiline: true,
            label: messages?.tenantManagement?.groupForm?.description,
            minRows: 5,
          })(MaterialTextInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          {connectField('status', {
            label: messages?.tenantManagement?.groupForm?.status,
          })(SwitchInput)}
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
          label={
            isUpdate ? messages?.general?.update : messages?.general?.create
          }
        />
      </FormRow>
    </Form>
  );
};

export default AddGroupForm;
