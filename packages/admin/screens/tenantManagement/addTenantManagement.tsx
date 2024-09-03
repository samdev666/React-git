import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  HttpMethods,
  emptyValueValidator,
  mapIdNameToOptionWithoutCaptializing,
  numberValidator,
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
  MaterialDateInput,
} from '@wizehub/components';
import { toast } from 'react-toastify';
import {
  CountryEntity,
  TenantDetailEntity,
  TenantGroupManagementEntity,
} from '@wizehub/common/models/genericEntities';
import {
  DateFormats,
  Status,
} from '@wizehub/common/models/modules';
import moment from 'moment';
import { MetaData, getDefaultMetaData } from '@wizehub/common/models';
import { COUNTRIES_API, TENANT_GROUP_LISTING_API, TENANT_MANAGEMENT_DETAIL } from '../../api';
import { apiCall } from '../../redux/actions';
import messages from '../../messages';

interface Props {
  isUpdate?: boolean;
  tenantManagement?: TenantDetailEntity;
  onCancel: () => void;
  onSuccess: () => void;
}

const validators = {
  name: [
    required(messages?.tenantManagement?.form?.validators?.name),
    emptyValueValidator,
  ],
  abn: [
    required(messages?.tenantManagement?.form?.validators?.abn),
    emptyValueValidator,
  ],
  financialStartMonth: [
    required(messages?.tenantManagement?.form?.validators?.financialYear),
  ],
  streetAddress: [
    required(messages?.tenantManagement?.form?.validators?.streetAddress),
    emptyValueValidator,
  ],
  country: [required(messages?.tenantManagement?.form?.validators?.country)],
  city: [
    required(messages?.tenantManagement?.form?.validators?.city),
    emptyValueValidator,
  ],
  postalCode: [
    required(messages?.tenantManagement?.form?.validators?.postalCode),
    numberValidator(
      messages?.tenantManagement?.form?.validators?.postalCodeNumberOnly,
    ),
  ],
  dateFormat: [
    required(messages?.tenantManagement?.form?.validators?.displayDateFormat),
  ],
};

const getDefaultTenantManagement = (): MetaData<TenantGroupManagementEntity> => ({
  ...getDefaultMetaData<TenantGroupManagementEntity>(),
  filters: {
    status: Status.active,
  },
});

interface FormData {
  name: string;
  abn: string;
  streetAddress: string;
  city: string;
  country: {
    id: string;
  };
  group?: {
    id?: string;
  };
  postalCode: string;
  financialStartMonth: string;
  dateFormat: {
    id: string;
  };
  status: boolean;
}

const TenantManagementForm: React.FC<Props> = ({
  onCancel,
  onSuccess,
  isUpdate = false,
  tenantManagement,
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

  const { options: groupOptions, searchOptions } = useOptions<TenantGroupManagementEntity>(TENANT_GROUP_LISTING_API, true, getDefaultTenantManagement());

  const { options: countryOptions, searchOptions: searchCountryOptions } = useOptions<CountryEntity>(COUNTRIES_API, true);

  const onSubmit = async (data: FormData) => {
    const sanitizedBody = {
      name: trimWordWrapper(data?.name),
      abn: trimWordWrapper(data?.abn),
      streetAddress: trimWordWrapper(data?.streetAddress),
      city: trimWordWrapper(data?.city),
      countryId: data?.country?.id,
      groupId: data?.group?.id ? data.group.id : null,
      postalCode: data?.postalCode,
      financialStartMonth: moment(data?.financialStartMonth).month() + 1,
      dateFormat: data?.dateFormat?.id,
      status: data?.status ? Status.active : Status.inactive,
    };
    return new Promise<void>((resolve, reject) => {
      reduxDispatch(
        apiCall(
          isUpdate
            ? `${TENANT_MANAGEMENT_DETAIL}/${tenantManagement?.id}`
            : TENANT_MANAGEMENT_DETAIL,
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
              messages?.tenantManagement?.form?.success?.[
                isUpdate ? 'updated' : 'created'
              ]
            }
          />
        ));
      })
      .catch((error) => {
        setSubmitError(error?.message);
      });
  };

  useEffect(() => {
    if (isUpdate && groupOptions) {
      change('name', tenantManagement?.name);
      change('abn', tenantManagement?.abn);
      change(
        'financialStartMonth',
        moment(tenantManagement?.financialStartMonth, 'M'),
      );
      change(
        'country',
        {
          id: tenantManagement?.countryId?.id,
          label: tenantManagement?.countryId?.name,
        },
      );
      change('city', tenantManagement?.city);
      change('postalCode', tenantManagement?.postalCode);
      change('streetAddress', tenantManagement?.streetAddress);
      if (tenantManagement?.group) {
        change(
          'group',
          {
            id: tenantManagement?.group?.id,
            label: tenantManagement?.group?.name,
          },
        );
      }
      change('dateFormat', tenantManagement?.dateFormat);
      change('status', tenantManagement?.status === Status.active);
    }
  }, []);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow minWidth="530px">
        <FormRowItem>
          {connectField('name', {
            label: messages?.tenantManagement?.form?.name,
            required: true,
          })(MaterialTextInput)}
        </FormRowItem>
        <FormRowItem>
          {connectField('abn', {
            label: messages?.tenantManagement?.form?.abn,
            required: true,
          })(MaterialTextInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          {connectField('financialStartMonth', {
            label: messages?.tenantManagement?.form?.financialYear,
            views: ['month'],
            dateFormat: 'MM',
            required: true,
          })(MaterialDateInput)}
        </FormRowItem>
        <FormRowItem>
          {connectField('country', {
            label: messages?.tenantManagement?.form?.country,
            options: countryOptions?.map(mapIdNameToOptionWithoutCaptializing),
            required: true,
            searchOptions: searchCountryOptions,
          })(MaterialAutocompleteInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          {connectField('streetAddress', {
            multiline: true,
            label: messages?.tenantManagement?.form?.streetAddress,
            minRows: 5,
            required: true,
          })(MaterialTextInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          {connectField('city', {
            label: messages?.tenantManagement?.form?.city,
            required: true,
          })(MaterialTextInput)}
        </FormRowItem>
        <FormRowItem>
          {connectField('postalCode', {
            label: messages?.tenantManagement?.form?.postalCode,
            required: true,
          })(MaterialTextInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          {connectField('group', {
            label: messages?.tenantManagement?.form?.group,
            options: groupOptions?.map(mapIdNameToOptionWithoutCaptializing),
            searchOptions,
            enableClearable: true,
            selectedOption: isUpdate && tenantManagement?.group && {
              id: tenantManagement?.group?.id,
              label: tenantManagement?.group?.name,
            },
          })(MaterialAutocompleteInput)}
        </FormRowItem>
        <FormRowItem>
          {connectField('dateFormat', {
            label: messages?.tenantManagement?.form?.displayDateFormat,
            options: DateFormats,
            required: true,
          })(MaterialAutocompleteInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          {connectField('status', {
            label: messages?.tenantManagement?.form?.tenantStatus,
          })(SwitchInput)}
        </FormRowItem>
      </FormRow>

      {submitError && (
        <FormRow>
          <FormRowItem>
            <FormError
              message={
                messages?.tenantManagement?.form?.errors?.serverError?.[
                  submitError
                ]
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
          label={messages?.general?.[isUpdate ? 'update' : 'create']}
        />
      </FormRow>
    </Form>
  );
};

export default TenantManagementForm;
