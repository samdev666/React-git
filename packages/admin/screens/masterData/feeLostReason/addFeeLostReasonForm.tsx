import { useFormReducer } from '@wizehub/common/hooks';
import {
  Button,
  Form,
  FormError,
  FormRow,
  FormRowItem,
  MaterialTextInput,
  SwitchInput,
} from '@wizehub/components';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  HttpMethods, emptyValueValidator, required, trimWordWrapper,
} from '@wizehub/common/utils';
import { Status } from '@wizehub/common/models/modules';
import { FeeLostReasonEntity } from '@wizehub/common/models/genericEntities';
import messages from '../../../messages';
import { apiCall } from '../../../redux/actions';

interface Props {
    onCancel: () => void;
    onSuccess: () => void;
    endpoint: string;
    isUpdate?: boolean;
    reasonData?: FeeLostReasonEntity;
}

interface FormData {
  title: string;
  status: Status
}

const validators = {
  title: [
    required(messages.sidebar.menuItems.secondaryMenu.subMenuItems
      .masterData.validators.titleRequired),
    emptyValueValidator,
  ],
};

const AddFeeLostReason: React.FC<Props> = ({
  onCancel,
  onSuccess,
  endpoint,
  isUpdate = false,
  reasonData,
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

  const onSubmit = async (data: FormData) => {
    const sanitizBody = {
      name: trimWordWrapper(data?.title),
      status: data?.status ? Status.active : Status.inactive,
    };

    return new Promise<void>((resolve, reject) => {
      reduxDispatch(
        apiCall(
          endpoint,
          resolve,
          reject,
          isUpdate ? HttpMethods.PATCH : HttpMethods.POST,
          sanitizBody,
        ),
      );
    })
      .then(() => {
        onSuccess();
      })
      .catch((err) => {
        setSubmitError(err?.message);
      });
  };

  useEffect(() => {
    if (isUpdate) {
      change('title', reasonData?.name);
      change('status', reasonData?.status === 'ACTIVE');
    }
  }, []);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow minWidth="530px">
        <FormRowItem>
          {connectField('title', {
            label: messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
              .subItems.feeLostReason.form.title,
            required: true,
          })(MaterialTextInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          {connectField('status', {
            label: messages.userManagement.status,
          })(SwitchInput)}
        </FormRowItem>
      </FormRow>
      {submitError && (
        <FormRow>
          <FormRowItem>
            <FormError
              message={
                                messages?.sidebar?.menuItems?.secondaryMenu?.subMenuItems
                                  ?.masterData?.error?.serverError?.[submitError]
                            }
            />
          </FormRowItem>
        </FormRow>
      )}
      <FormRow justifyContent="end" marginBottom="0px">
        <Button
          variant="outlined"
          color="secondary"
          onClick={onCancel}
          label={messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
            .subItems.feeLostReason.cancel}
        />
        <Button
          variant="contained"
          type="submit"
          disabled={submitting}
          label={messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
            .subItems.feeLostReason?.[isUpdate ? 'update' : 'create']}
        />
      </FormRow>
    </Form>
  );
};

export default AddFeeLostReason;
