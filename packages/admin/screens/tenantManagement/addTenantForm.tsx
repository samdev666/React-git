import React from 'react';
import { useDispatch } from 'react-redux';
import {
  HttpMethods,
  mapIdNameToOptionWithoutCaptializing,
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
import { TenantGroupTenantEntity } from '@wizehub/common/models/genericEntities';
import { Id, MetaData, getDefaultMetaData } from '@wizehub/common/models';
import { Status } from '@wizehub/common/models/modules';
import {
  TENANT_MANAGEMENT_DETAIL,
  TENANT_MANAGEMENT_LISTING_API,
} from '../../api';
import { apiCall } from '../../redux/actions';
import messages from '../../messages';

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
  groupId: Id;
}

interface SubmitData{
  name: {
    id: Id;
  }
}

const validators = {
  name: [required(messages?.tenantManagement?.form?.validators?.name)],
};

const getDefaultTenants = (): MetaData<TenantGroupTenantEntity> => ({
  ...getDefaultMetaData<TenantGroupTenantEntity>(),
  filters: {
    status: Status.active,
    noGroup: true,
  },
});

const AddTenantForm: React.FC<Props> = ({ onCancel, onSuccess, groupId }) => {
  const {
    submitting,
    submitError,
    handleSubmit,
    connectField,
    setSubmitError,
  } = useFormReducer(validators);
  const reduxDispatch = useDispatch();

  const { options: tenantOptions, searchOptions } = useOptions<TenantGroupTenantEntity>(TENANT_MANAGEMENT_LISTING_API, true, getDefaultTenants());

  const onSubmit = async (data: SubmitData) => new Promise<void>((resolve, reject) => {
    const sanitizedBody = {
      groupId,
    };
    reduxDispatch(
      apiCall(
        `${TENANT_MANAGEMENT_DETAIL}/${data?.name?.id}`,
        resolve,
        reject,
        HttpMethods.PATCH,
        sanitizedBody,
      ),
    );
  })
    .then(() => {
      onSuccess();
      toast(() => (
        <Toast
          text={
              messages?.tenantManagement?.tenantGroupDetail?.addTenant.success
            }
        />
      ));
    })
    .catch((error) => {
      setSubmitError(error?.message);
    });

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow width="562px">
        <FormRowItem>
          {connectField('name', {
            label:
              messages?.tenantManagement?.tenantGroupDetail?.addTenant.name,
            options: tenantOptions?.map(mapIdNameToOptionWithoutCaptializing),
            searchOptions,
            required: true,
          })(MaterialAutocompleteInput)}
        </FormRowItem>
      </FormRow>

      {submitError && (
        <FormRow>
          <FormRowItem>
            <FormError
              message={
                messages?.general?.error?.serverError?.[submitError]
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

export default AddTenantForm;
