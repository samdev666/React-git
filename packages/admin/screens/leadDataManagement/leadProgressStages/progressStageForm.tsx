import { useFormReducer, useOptions } from '@wizehub/common/hooks';
import {
  Button,
  Form,
  FormError,
  FormRow,
  FormRowItem,
  MaterialAutocompleteInput,
  MaterialTextInput,
  SwitchInput,
} from '@wizehub/components';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  HttpMethods,
  mapIdNameToOption,
  required,
  requiredIf,
  trimWordWrapper,
} from '@wizehub/common/utils';
import { Status } from '@wizehub/common/models/modules';
import { Id, MetaData, getDefaultMetaData } from '@wizehub/common/models';
import { LeadProgressStatusEntity, LeadStageEntity } from '@wizehub/common/models/genericEntities';
import messages from '../../../messages';
import { apiCall } from '../../../redux/actions';
import { LEAD_STAGE_LISTING_API } from '../../../api';

interface Props {
    onCancel: () => void;
    onSuccess: () => void;
    endpoint: string;
    isUpdate?: boolean;
    leadData?: LeadProgressStatusEntity;
    isStage?: boolean;
}

interface FormData {
  status: Status;
  stage: {
    id: Id;
  };
  name: string;
}

interface ApiSanitizedBody {
  name: string;
  status: Status;
  leadProgressStageId?: Id;
  code?: string;
}

const getDefaultLeadStageFilter = (
  status?: string,
): MetaData<LeadStageEntity> => ({
  ...getDefaultMetaData<LeadStageEntity>(),
  order: 'name',
  filters: {
    status: Status.active,
  },
  allowedFilters: [status],
});

const ProgressStageForm: React.FC<Props> = ({
  onCancel,
  onSuccess,
  endpoint,
  isUpdate = false,
  leadData,
  isStage = false,
}) => {
  const checkStage = (formValues: {stage: {value: string}}) => isStage || !!formValues?.stage?.value;
  const validators = {
    name: [required(messages.sidebar.menuItems.secondaryMenu.subMenuItems
      .leadDataManagement.validators.nameRequired)],
    stage: [requiredIf(messages.sidebar.menuItems.secondaryMenu.subMenuItems
      .leadDataManagement.validators.stageRequired, checkStage)],
  };

  const {
    options: leadStage,
    searchOptions,
  } = useOptions<LeadStageEntity>(
    LEAD_STAGE_LISTING_API,
    true,
    getDefaultLeadStageFilter(),
  );

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
    let sanitizedBody: ApiSanitizedBody = {
      name: trimWordWrapper(data?.name),
      status: data.status ? Status.active : Status.inactive,
    };

    if (isStage) {
      sanitizedBody = {
        ...sanitizedBody,
        leadProgressStageId: data?.stage?.id,
      };
    } else {
      sanitizedBody = {
        ...sanitizedBody,
        code: trimWordWrapper(data?.name)?.replace(/\s+/g, '_')?.toUpperCase(),
      };
    }

    return new Promise<void>((resolve, reject) => {
      reduxDispatch(
        apiCall(
          endpoint,
          resolve,
          reject,
          isUpdate ? HttpMethods.PATCH : HttpMethods.POST,
          sanitizedBody,
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
      change('status', leadData?.status === Status.active);
      change('stage', {
        id: leadData?.leadProgressStage?.id,
        label: leadData?.leadProgressStage?.name,
      });
    }
  }, [leadData]);

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
        {isStage
                    && (
                    <FormRowItem>
                      {connectField('stage', {
                        label: messages.sidebar.menuItems.secondaryMenu.subMenuItems
                          .leadDataManagement.subItems.leadProgressStages.form.stage,
                        required: true,
                        searchOptions,
                        options: leadStage?.map(mapIdNameToOption),
                      })(MaterialAutocompleteInput)}
                    </FormRowItem>
                    )}
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

export default ProgressStageForm;
