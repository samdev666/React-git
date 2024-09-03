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
  RecursiveFieldInput,
} from '@wizehub/components';
import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  HttpMethods,
  capitalizeLegend,
  emptyValueValidator,
  mapIdNameToOptionWithTitleWithoutCaptializing,
  mapIdNameToOptionWithoutCaptializing,
  required,
  trimWordWrapper,
} from '@wizehub/common/utils';
import { Status } from '@wizehub/common/models/modules';
import { Divider } from '@mui/material';
import { Division, MeetingAgendaDetailEntity, ProjectManagementEntity } from '@wizehub/common/models/genericEntities';
import { MetaData, getDefaultMetaData } from '@wizehub/common/models';
import messages from '../../../messages';
import { apiCall } from '../../../redux/actions';
import {
  StyledMeetinAgendaAddMoreContainer,
  StyledMeetingAgendaAddMoreIcon,
  StyledMeetingAgendaAddMoreText,
  StyledMeetingAgendaHeading,
} from '../styles';
import { AgendaTypeOptions } from '../../../utils/constant';
import { linkValidator } from '../../../utils';
import { DIVISION_LISTING_API, PROJECT_MANAGEMENT_LISTING_API } from '../../../api';

interface Props {
    onCancel: () => void;
    onSuccess: () => void;
    endpoint: string;
    isUpdate?: boolean;
    agendaData?: MeetingAgendaDetailEntity
}

interface DivisionInterface {
  id: string | number;
}

interface Project {
  id: string | number;
}

interface FormData {
  division?: DivisionInterface[];
  agenda: string;
  implementationDetail: string;
  guides?: {
    name: string;
    type: {
      id: number;
    };
    guidelink: string;
  }[];
  project?: Project;
  status: boolean;
}

const guidesFormLayout = [
  [
    {
      value: 'Name',
      component: MaterialTextInput,
      props: {
        required: true,
      },
    },
    {

      value: 'Type',
      component: MaterialAutocompleteInput,
      props: {
        options: AgendaTypeOptions,
        required: true,
      },
    },
  ],
  [
    {
      value: 'Guide link',
      component: MaterialTextInput,
      props: {
        required: true,
      },
    },
  ],
];

const validators = {
  division: [required(messages.sidebar.menuItems.secondaryMenu.subMenuItems
    .masterData.validators.divisionRequired)],
  implementationDetail: [
    required(messages.sidebar.menuItems.secondaryMenu.subMenuItems
      .masterData.validators.implementationDetailRequired),
    emptyValueValidator,
  ],
  agenda: [
    required(messages.sidebar.menuItems.secondaryMenu.subMenuItems
      .masterData.validators.agendaRequired),
    emptyValueValidator,
  ],
  project: [required(messages.sidebar.menuItems.secondaryMenu.subMenuItems
    .masterData.validators.project)],
  guides: {
    name: [
      required(messages.sidebar.menuItems.secondaryMenu.subMenuItems
        .leadDataManagement.validators.nameRequired),
      emptyValueValidator,
    ],
    type: [
      required(messages.sidebar.menuItems.secondaryMenu.subMenuItems
        .masterData.validators.typeRequired),
    ],
    guidelink: [
      required(messages.sidebar.menuItems.secondaryMenu.subMenuItems
        .masterData.validators.guideLinkRequired),
      linkValidator,
    ],
  },
};

const initialValues = {
  guides: [
    {
      name: '',
      type: '',
      guidelink: '',
    },
  ],
};

export const getDefaultProjectFilter = (): MetaData<ProjectManagementEntity> => ({
  ...getDefaultMetaData<ProjectManagementEntity>(),
  filters: {
    status: Status.active,
  },
});

const AgendaForm: React.FC<Props> = ({
  onCancel,
  onSuccess,
  endpoint,
  isUpdate = false,
  agendaData,
}) => {
  const addMoreRef = useRef(null);

  const {
    submitting,
    submitError,
    handleSubmit,
    connectField,
    setSubmitError,
    connectFieldReplicate,
    change,
    handleRecursiveChange,
  } = useFormReducer(validators, initialValues);

  const { options: divisionOptions, searchOptions: searchDivisionOptions } = useOptions<Division>(DIVISION_LISTING_API);

  const { options: projectOptions, searchOptions: searchProjectOptions } = useOptions<ProjectManagementEntity>(PROJECT_MANAGEMENT_LISTING_API, true, getDefaultProjectFilter());

  const reduxDispatch = useDispatch();

  const onSubmit = async (data: FormData) => {
    const sanitizedBody = {
      divisionIds: data?.division?.map((item) => Number(item?.id)),
      title: trimWordWrapper(data.agenda),
      implementationDetail: trimWordWrapper(data.implementationDetail),
      guides: data?.guides?.map((val) => ({
        name: trimWordWrapper(val?.name),
        type: val?.type?.id,
        url: val?.guidelink,
      })),
      projectId: data?.project?.id,
      status: data.status ? Status.active : Status.inactive,
    };

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
      change('division', agendaData?.divisions?.map((option) => ({
        id: option.id,
        label: `${capitalizeLegend(option?.divisionName)}`,
      })));
      change('agenda', agendaData?.title);
      change('implementationDetail', agendaData?.implementationDetail);
      change('status', agendaData?.status === 'ACTIVE');
      change('project', {
        id: agendaData?.project?.id,
        label: agendaData?.project?.title,
      });
      if (agendaData?.guides) {
        const guides = agendaData.guides.map((item) => ({
          id: item?.id,
          name: item?.name,
          type: {
            id: item?.type,
            label: capitalizeLegend(item?.type),
          },
          guidelink: item?.resourceUrl,
        }));

        handleRecursiveChange('guides', guides);
      } else {
        handleRecursiveChange('guides', []);
      }
    }
  }, []);

  const handleAddField = () => {
    if (addMoreRef?.current) {
      addMoreRef.current?.addItemToGroup('guides');
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow minWidth="530px">
        <FormRowItem>
          {connectField('agenda', {
            label: messages.sidebar.menuItems.secondaryMenu.subMenuItems
              .masterData.subItems.meetingAgendaAndStatus.agenda,
            required: true,
          })(MaterialTextInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          {connectField('implementationDetail', {
            label: messages.sidebar.menuItems.secondaryMenu.subMenuItems
              .masterData.subItems.meetingAgendaAndStatus
              .meetingAgendaDetails.implementationDetail,
            multiline: true,
            required: true,
            minRows: 3,
          })(MaterialTextInput)}
        </FormRowItem>
      </FormRow>
      <FormRow minWidth="530px">
        <FormRowItem>
          {connectField('division', {
            label: messages.sidebar.menuItems.secondaryMenu.subMenuItems
              .masterData.subItems.meetingAgendaAndStatus.divisions,
            required: true,
            multiple: true,
            options: divisionOptions?.map(mapIdNameToOptionWithoutCaptializing),
            isLimit: true,
            searchOptions: searchDivisionOptions,
          })(MaterialAutocompleteInput)}
        </FormRowItem>
        <FormRowItem>
          {connectField('project', {
            label: messages.sidebar.menuItems.secondaryMenu.subMenuItems
              .masterData.subItems.meetingAgendaAndStatus.project,
            required: true,
            searchOptions: searchProjectOptions,
            options: projectOptions?.map(mapIdNameToOptionWithTitleWithoutCaptializing),
          })(MaterialAutocompleteInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          {connectField('status', {
            label: messages.userManagement.status,
          })(SwitchInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <Divider sx={{ width: '100%' }} />
        </FormRowItem>
      </FormRow>
      <FormRow marginBottom="0px">
        <FormRowItem>
          <StyledMeetingAgendaHeading>
            {messages.sidebar.menuItems.secondaryMenu.subMenuItems
              .masterData.subItems.meetingAgendaAndStatus.form.guide}
          </StyledMeetingAgendaHeading>
        </FormRowItem>
        <StyledMeetinAgendaAddMoreContainer
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          onClick={handleAddField}
        >
          <StyledMeetingAgendaAddMoreIcon />
          <StyledMeetingAgendaAddMoreText>
            {messages.sidebar.menuItems.secondaryMenu.subMenuItems
              .masterData.subItems.meetingAgendaAndStatus.form.addMore}
          </StyledMeetingAgendaAddMoreText>
        </StyledMeetinAgendaAddMoreContainer>
      </FormRow>

      {connectFieldReplicate('guides', {
        formLayout: guidesFormLayout,
        ref: addMoreRef,
        showAddButton: false,
      })(RecursiveFieldInput)}

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

export default AgendaForm;
