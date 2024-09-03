import React from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  Button,
  Form,
  FormError,
  FormRow,
  FormRowItem,
  Toast,
} from '@wizehub/components';
import { useFormReducer } from '@wizehub/common/hooks';
import { HttpMethods } from '@wizehub/common/utils';
import { TenantProductDetailEntity } from '@wizehub/common/models/genericEntities';
import moment from 'moment';
import { Id } from '@wizehub/common/models';
import { apiCall } from '../../redux/actions';
import messages from '../../messages';
import { StyledTenantManagementNoteText } from './styles';
import { TENANT_SUBSCRIPTION_DETAIL } from '../../api';

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
  tenantProductDetail: TenantProductDetailEntity;
}

interface ApiSanitizedBody {
  tenantSubscriptionId: Id;
  endDate: string;
  reason: string | null;
}

const CancelSubscriptionForm: React.FC<Props> = ({
  onSuccess,
  onCancel,
  tenantProductDetail,
}) => {
  const reduxDispatch = useDispatch();

  const {
    submitting, submitError, handleSubmit, setSubmitError,
  } = useFormReducer();

  const onSubmit = async () => new Promise<any>((resolve, reject) => {
    const sanitizedBody: ApiSanitizedBody = {
      tenantSubscriptionId: tenantProductDetail?.id,
      endDate: moment().format('YYYY-MM-DD'),
      reason: null,
    };
    reduxDispatch(
      apiCall(
        TENANT_SUBSCRIPTION_DETAIL,
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
              messages?.tenantManagement?.tenantListingDetail
                ?.cancelSubscription?.success
            }
        />
      ));
    })
    .catch((err) => {
      setSubmitError(err?.message);
    });

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow width="562px">
        <FormRowItem>
          <StyledTenantManagementNoteText>
            {
              messages?.tenantManagement?.tenantListingDetail
                ?.cancelSubscription?.note
            }
          </StyledTenantManagementNoteText>
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
      <FormRow justifyContent="flex-end" mb={0}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onCancel}
          label={
            messages?.tenantManagement?.tenantListingDetail?.cancelSubscription
              ?.noButton
          }
        />
        <Button
          variant="contained"
          color="error"
          type="submit"
          disabled={submitting}
          label={
            messages?.tenantManagement?.tenantListingDetail?.cancelSubscription
              ?.cancelSubscription
          }
        />
      </FormRow>
    </Form>
  );
};

export default CancelSubscriptionForm;
