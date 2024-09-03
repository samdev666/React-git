import React from 'react';
import { useDispatch } from 'react-redux';
import {
  HttpMethods, emptyValueValidator, required, validatePassedDate,
} from '@wizehub/common/utils';
import { useEntity, useFormReducer } from '@wizehub/common/hooks';
import {
  Form,
  FormError,
  FormRow,
  FormRowItem,
  MaterialDateInput,
  MaterialTextInput,
  Toast,
  Button,
} from '@wizehub/components';
import { Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { ProductManagementDetailEntity } from '@wizehub/common/models/genericEntities';
import { Id } from '@wizehub/common/models';
import { PRODUCT_MANAGEMENT, TENANT_SUBSCRIPTION_RENEW } from '../../api';
import { apiCall } from '../../redux/actions';
import messages from '../../messages';

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
  productId: Id;
  subscriptionId: Id;
}

interface ApiSanitizedBody {
  tenantSubscriptionId: Id;
  transactionId: Id;
  transactionMode: string;
  paymentDate: string;
  notes: string | null;
  transactionValue: string;
  transactionCurrencyCode: string;
  productId: Id
}

interface FormData {
  paymentId: string;
  paymentMethod: string;
  paymentDate: string;
}

const validators = {
  paymentDate: [
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

const RenewSubscriptionForm: React.FC<Props> = ({
  onCancel,
  onSuccess,
  productId,
  subscriptionId,
}) => {
  const {
    submitting,
    submitError,
    handleSubmit,
    connectField,
    setSubmitError,
  } = useFormReducer(validators);
  const reduxDispatch = useDispatch();

  const { entity: productDetail } = useEntity<ProductManagementDetailEntity>(
    PRODUCT_MANAGEMENT,
    productId,
  );

  const onSubmit = async (data: FormData) => new Promise<void>((resolve, reject) => {
    const sanitizedBody: ApiSanitizedBody = {
      tenantSubscriptionId: subscriptionId,
      productId,
      transactionId: data?.paymentId,
      transactionMode: data?.paymentMethod,
      transactionValue: productDetail?.basePrice?.toString(),
      transactionCurrencyCode: productDetail?.currencyCode,
      paymentDate: data?.paymentDate,
      notes: null,
    };
    reduxDispatch(
      apiCall(
        TENANT_SUBSCRIPTION_RENEW,
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
          text={
              messages?.tenantManagement?.tenantListingDetail?.renewForm
                ?.success
            }
        />
      ));
    })
    .catch((error) => {
      setSubmitError(error?.message);
    });

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow>
        <FormRowItem>
          {connectField('paymentDate', {
            label:
              messages?.tenantManagement?.tenantListingDetail?.renewForm
                ?.paymentDate,
          })(MaterialDateInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          {connectField('paymentId', {
            label:
              messages?.tenantManagement?.tenantListingDetail?.renewForm
                ?.paymentId,
          })(MaterialTextInput)}
        </FormRowItem>
        <FormRowItem>
          {connectField('paymentMethod', {
            label:
              messages?.tenantManagement?.tenantListingDetail?.renewForm
                ?.paymentMethod,
          })(MaterialTextInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <Typography variant="h5">
            {
              messages?.tenantManagement?.tenantListingDetail?.renewForm
                ?.amountPayable
            }
            {productDetail?.basePrice}
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
          label={
            messages?.tenantManagement?.tenantListingDetail?.renewForm?.cancel
          }
        />
        <Button
          variant="contained"
          type="submit"
          disabled={submitting}
          label={
            messages?.tenantManagement?.tenantListingDetail?.renewForm?.renew
          }
        />
      </FormRow>
    </Form>
  );
};

export default RenewSubscriptionForm;
