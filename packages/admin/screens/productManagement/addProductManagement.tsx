import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  HttpMethods,
  emptyValueValidator,
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
} from '@wizehub/components';
import { toast } from 'react-toastify';
import { Status } from '@wizehub/common/models/modules';
import {
  CountryEntity,
  ProductManagementDetailEntity,
} from '@wizehub/common/models/genericEntities';
import { FrequencyType, Id, Option } from '@wizehub/common/models';
import { COUNTRIES_API, PRODUCT_MANAGEMENT } from '../../api';
import { apiCall } from '../../redux/actions';
import messages from '../../messages';

interface Props {
  isUpdate?: boolean;
  productManagement?: Id;
  onCancel: () => void;
  onSuccess: () => void;
}

const validators = {
  name: [
    required(messages.productManagement.form.validators.name),
    emptyValueValidator,
  ],
  uniqueIdentifier: [
    required(messages.productManagement.form.validators.uniqueIdentifier),
  ],
  trialPeriod: [
    required(messages.productManagement.form.validators.trialPeriod),
    numberValidator(
      messages.productManagement.form.validators.trailPeriodValidator,
    ),
  ],
  gracePeriod: [
    required(messages.productManagement.form.validators.gracePeriod),
    numberValidator(
      messages.productManagement.form.validators.gracePeriodValidator,
    ),
  ],
  basePrice: [
    required(messages.productManagement.form.validators.basePrice),
    numberValidator(
      messages.productManagement.form.validators.basePriceValidator,
    ),
  ],
  perUserPrice: [
    required(messages.productManagement.form.validators.extraUserPrice),
    numberValidator(
      messages.productManagement.form.validators.extraUserPriceValidator,
    ),
  ],
  baseUsers: [
    required(messages.productManagement.form.validators.noOfUsers),
    numberValidator(
      messages.productManagement.form.validators.baseUsersValidator,
    ),
  ],
  currency: [required(messages.productManagement.form.validators.currency)],
};

const mapIdNameToOptionForCountryCode = (entity: {
  id: Id;
  currencyCode: string;
}): Option => ({ id: entity?.id, label: entity?.currencyCode });

interface ApiSanitizedBody {
  name: string;
  trialPeriod: number;
  gracePeriod: number;
  basePrice: number;
  perUserPrice: number;
  baseUsers: number;
  currencyCode: string;
  status: 'ACTIVE' | 'INACTIVE';
  billingFrequency?: 'MONTHLY';
  identifier?: string;
}

interface FormData {
  name: string;
  trialPeriod: number;
  gracePeriod: number;
  basePrice: number;
  perUserPrice: number;
  baseUsers: number;
  currency: {
    id: string;
  };
  productStatus: boolean;
  uniqueIdentifier?: string;
}

const ProductManagementForm: React.FC<Props> = ({
  onCancel,
  onSuccess,
  isUpdate = false,
  productManagement,
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
  const [productDetail, setProductDetail] = useState<ProductManagementDetailEntity>(null);

  const { options: countryOptions, searchOptions: searchCountryOptions } = useOptions<CountryEntity>(COUNTRIES_API, true);

  const fetchProductDetail = useCallback(() => {
    if (isUpdate) {
      reduxDispatch(
        apiCall(
          `${PRODUCT_MANAGEMENT}/${productManagement}`,
          (res) => {
            setProductDetail(res);
          },
          (err) => err,
        ),
      );
    }
  }, []);

  useEffect(() => {
    fetchProductDetail();
  }, [fetchProductDetail]);

  const onSubmit = async (data: FormData) => new Promise<void>((resolve, reject) => {
    let sanitizedBody: ApiSanitizedBody = {
      name: trimWordWrapper(data.name),
      trialPeriod: data.trialPeriod,
      gracePeriod: data.gracePeriod,
      basePrice: data.basePrice,
      perUserPrice: data.perUserPrice,
      baseUsers: data.baseUsers,
      currencyCode: data.currency.id,
      status: data.productStatus ? Status.active : Status.inactive,
    };
    if (!isUpdate) {
      sanitizedBody = {
        ...sanitizedBody,
        billingFrequency: FrequencyType.MONTHLY,
        identifier: data.uniqueIdentifier,
      };
    }

    reduxDispatch(
      apiCall(
        isUpdate
          ? `${PRODUCT_MANAGEMENT}/${productManagement}`
          : PRODUCT_MANAGEMENT,
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
              messages.productManagement.form?.[
                !isUpdate ? 'created' : 'updated'
              ]?.success
            }
        />
      ));
    })
    .catch((error) => {
      setSubmitError(error?.message);
    });

  useEffect(() => {
    if (isUpdate && productDetail) {
      change('name', productDetail?.name);
      change('uniqueIdentifier', productDetail?.identifier);
      change('trialPeriod', productDetail?.trialPeriod);
      change('gracePeriod', productDetail?.gracePeriod);
      change('basePrice', productDetail?.basePrice);
      change('perUserPrice', productDetail?.perUserPrice);
      change('baseUsers', productDetail?.baseUsers);
      change(
        'currency',
        countryOptions?.map(mapIdNameToOptionForCountryCode)?.find(
          (item) => item.id === productDetail?.currencyCode,
        ),
      );
      change('productStatus', productDetail?.status === Status.active);
    }
  }, [productDetail]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow>
        <FormRowItem>
          {connectField('name', {
            label: messages.productManagement.form.name,
            required: true,
          })(MaterialTextInput)}
        </FormRowItem>
        <FormRowItem>
          {connectField('uniqueIdentifier', {
            label: messages.productManagement.form.uniqueIdentifier,
            required: true,
            disabled: isUpdate,
          })(MaterialTextInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          {connectField('trialPeriod', {
            label: messages.productManagement.form.trialPeriod,
            required: true,
          })(MaterialTextInput)}
        </FormRowItem>
        <FormRowItem>
          {connectField('gracePeriod', {
            label: messages.productManagement.form.gracePeriod,
            required: true,
          })(MaterialTextInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          {connectField('basePrice', {
            label: messages.productManagement.form.basePrice,
            required: true,
          })(MaterialTextInput)}
        </FormRowItem>
        <FormRowItem>
          {connectField('perUserPrice', {
            label: messages.productManagement.form.extraUserPrice,
            required: true,
          })(MaterialTextInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem width="562px">
          {connectField('baseUsers', {
            label: messages.productManagement.form.noOfUsers,
            required: true,
          })(MaterialTextInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          {connectField('currency', {
            label: messages.productManagement.form.currency,
            enableClearable: true,
            options: countryOptions?.map(mapIdNameToOptionForCountryCode),
            required: true,
            searchOptions: searchCountryOptions,
          })(MaterialAutocompleteInput)}
        </FormRowItem>
        <FormRowItem alignItems="center">
          {connectField('productStatus', {
            label: messages.productManagement.form.productStatus,
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
          label={messages?.general?.[isUpdate ? 'update' : 'create']}
        />
      </FormRow>
    </Form>
  );
};

export default ProductManagementForm;
