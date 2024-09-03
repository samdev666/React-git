import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  HttpMethods,
  emptyValueValidator,
  mapIdNameToOptionWithoutCaptializing,
  required,
  validatePassedDate,
} from '@wizehub/common/utils';
import { useFormReducer, useOptions } from '@wizehub/common/hooks';
import {
  Form,
  FormError,
  FormRow,
  FormRowItem,
  MaterialAutocompleteInput,
  MaterialDateInput,
  MaterialTextInput,
  Toast,
  Button,
} from '@wizehub/components';
import { Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { ProductManagementDetailEntity, TenantProductDetailEntity } from '@wizehub/common/models/genericEntities';
import { useParams } from 'react-router-dom';
import { MetaData, getDefaultMetaData } from '@wizehub/common/models';
import { Status } from '@wizehub/common/models/modules';
import moment from 'moment';
import {
  PRODUCT_MANAGEMENT,
  PRODUCT_MANAGEMENT_LISTING_API,
  TENANT_PRODUCT_SUBSCRIPTION,
} from '../../api';
import { apiCall } from '../../redux/actions';
import messages from '../../messages';

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
  isActivate?: boolean;
  productDetail?: TenantProductDetailEntity
}

interface Product {
  id: string;
}

interface FormData {
  productName: Product;
  paymentId: string;
  paymentMethod: string;
  startDate: string;
}

interface ApiSanitizedBody {
  tenantId: string;
  productId: string;
  transactionId: string;
  transactionMode: string;
  transactionValue: string;
  transactionCurrencyCode: string;
  startDate: string;
  notes: string | null;
}

const validators = {
  productName: [
    required(
      messages?.tenantManagement?.attachProductForm?.validators?.productName,
    ),
  ],
  startDate: [
    required(
      messages?.tenantManagement?.attachProductForm?.validators?.startDate,
    ),
    validatePassedDate(messages?.tenantManagement?.attachProductForm?.validators?.validYear),
  ],
  paymentId: [
    required(
      messages?.tenantManagement?.attachProductForm?.validators?.paymentId,
    ),
    emptyValueValidator,
  ],
  paymentMethod: [
    required(
      messages?.tenantManagement?.attachProductForm?.validators?.paymentMethod,
    ),
    emptyValueValidator,
  ],
};

const getDefaultProductOptions = (): MetaData<ProductManagementDetailEntity> => ({
  ...getDefaultMetaData<ProductManagementDetailEntity>(),
  filters: {
    status: Status.active,
  },
});

const AttachProductForm: React.FC<Props> = ({
  onCancel,
  onSuccess,
  isActivate,
  productDetail,
}) => {
  const {
    submitting,
    submitError,
    handleSubmit,
    connectField,
    change,
    formValues,
    setSubmitError,
  } = useFormReducer(validators);
  const reduxDispatch = useDispatch();
  const { id } = useParams<{ id?: string }>();
  const [selectedProduct, setSelectedProduct] = useState<ProductManagementDetailEntity>(null);

  useEffect(() => {
    if (formValues?.productName?.value?.id) {
      reduxDispatch(
        apiCall(
          `${PRODUCT_MANAGEMENT}/${formValues?.productName?.value?.id}`,
          (res) => {
            setSelectedProduct(res);
          },
          (err) => err,
        ),
      );
    }
  }, [formValues?.productName?.value?.id]);

  const { options: productOptions, searchOptions } = useOptions<ProductManagementDetailEntity>(
    PRODUCT_MANAGEMENT_LISTING_API,
    true,
    getDefaultProductOptions(),
  );

  useEffect(() => {
    if (isActivate && productOptions) {
      change(
        'productName',
        {
          id: productDetail?.product?.id,
          label: productDetail?.product?.name,
        },
      );
    }
  }, []);

  const onSubmit = async (data: FormData) => new Promise<void>((resolve, reject) => {
    const sanitizedBody: ApiSanitizedBody = {
      tenantId: id,
      productId: data?.productName?.id,
      transactionId: data?.paymentId,
      transactionMode: data?.paymentMethod,
      transactionValue: selectedProduct?.basePrice?.toString(),
      transactionCurrencyCode: selectedProduct?.currencyCode,
      startDate: moment(data?.startDate).format('YYYY-MM-DD'),
      notes: null,
    };
    reduxDispatch(
      apiCall(
        TENANT_PRODUCT_SUBSCRIPTION,
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
          text={messages?.tenantManagement?.attachProductForm?.success}
        />
      ));
    })
    .catch((error) => {
      setSubmitError(error?.message);
    });

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow>
        <FormRowItem width="273px">
          {connectField('productName', {
            label: messages?.tenantManagement?.attachProductForm?.productName,
            options: productOptions?.map(mapIdNameToOptionWithoutCaptializing),
            searchOptions,
            required: true,
          })(MaterialAutocompleteInput)}
        </FormRowItem>
        <FormRowItem>
          {connectField('startDate', {
            label: messages?.tenantManagement?.attachProductForm?.startDate,
            required: true,
          })(MaterialDateInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          {connectField('paymentId', {
            label: messages?.tenantManagement?.attachProductForm?.paymentId,
            required: true,
          })(MaterialTextInput)}
        </FormRowItem>
        <FormRowItem>
          {connectField('paymentMethod', {
            label: messages?.tenantManagement?.attachProductForm?.paymentMethod,
            required: true,
          })(MaterialTextInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <Typography variant="h5">
            {messages?.tenantManagement?.attachProductForm?.amountPayable}
            {selectedProduct?.basePrice}
          </Typography>
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
          label={messages?.tenantManagement?.attachProductForm?.attach}
        />
      </FormRow>
    </Form>
  );
};

export default AttachProductForm;
