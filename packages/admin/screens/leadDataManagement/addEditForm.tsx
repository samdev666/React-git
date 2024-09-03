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
import { LeadIndustryInterface } from '@wizehub/common/models/genericEntities';
import messages from '../../messages';
import { apiCall } from '../../redux/actions';

interface Props {
    onCancel: () => void;
    onSuccess: () => void;
    endpoint: string;
    isUpdate?: boolean;
    leadData?: LeadIndustryInterface;
}

interface FormData {
  name: string;
  status: Status;
}

const validators = {
  name: [
    required(messages.sidebar.menuItems.secondaryMenu.subMenuItems
      .leadDataManagement.validators.nameRequired),
    emptyValueValidator,
  ],
};

const AddEditForm: React.FC<Props> = ({
  onCancel,
  onSuccess,
  endpoint,
  isUpdate = false,
  leadData,
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
    const sanitizeBody = {
      name: trimWordWrapper(data.name),
      status: data.status ? Status.active : Status.inactive,
    };

    return new Promise<void>((resolve, reject) => {
      reduxDispatch(
        apiCall(
          endpoint,
          resolve,
          reject,
          isUpdate ? HttpMethods.PATCH : HttpMethods.POST,
          sanitizeBody,
        ),
      );
    })
      .then(() => {
        onSuccess();
      })
      .catch((error) => {
        setSubmitError(error?.message);
      });
  };

  useEffect(() => {
    if (isUpdate) {
      change('name', leadData?.name);
      change('status', leadData?.status === 'ACTIVE');
    }
  }, []);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow minWidth="530px">
        <FormRowItem>
          {connectField('name', {
            label: messages.sidebar.menuItems.secondaryMenu.subMenuItems
              .leadDataManagement.subItems.leadSource.form.name,
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
                                  ?.leadDataManagement?.error?.serverError?.[submitError]
                                || messages?.sidebar?.menuItems?.secondaryMenu?.subMenuItems
                                  ?.masterData?.error?.serverError?.[submitError]
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

export default AddEditForm;
