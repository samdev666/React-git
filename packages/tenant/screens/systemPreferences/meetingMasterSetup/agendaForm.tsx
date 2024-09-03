import { useFormReducer, useOptions } from "@wizehub/common/hooks";
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
} from "@wizehub/components";
import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  HttpMethods,
  capitalizeLegend,
  emptyValueValidator,
  mapIdNameToOptionWithTitleWithoutCaptializing,
  mapIdNameToOptionWithoutCaptializing,
  required,
  trimWordWrapper,
} from "@wizehub/common/utils";
import { Status } from "@wizehub/common/models/modules";
import { Divider } from "@mui/material";
import {
  Division,
  MeetingAgendaDetailEntity,
  ProjectManagementEntity,
} from "@wizehub/common/models/genericEntities";
import { MetaData, getDefaultMetaData } from "@wizehub/common/models";
import messages from "../../../messages";
import { apiCall } from "../../../redux/actions";
import {
  StyledMeetinAgendaAddMoreContainer,
  StyledMeetingAgendaAddMoreIcon,
  StyledMeetingAgendaAddMoreText,
  StyledMeetingAgendaHeading,
} from "./styles";
import { AgendaTypeOptions } from "../../../utils/constant";
import { linkValidator } from "@wizehub/common/utils";
import {
  DIVISION_LISTING_API,
  MEETING_AGENDA_BY_ID,
  PROJECT_LISTING_API,
} from "../../../api";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
  isUpdate?: boolean;
  agendaData?: MeetingAgendaDetailEntity;
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
      value: "Name",
      component: MaterialTextInput,
      props: {
        required: true,
      },
    },
    {
      value: "Type",
      component: MaterialAutocompleteInput,
      props: {
        options: AgendaTypeOptions,
        required: true,
      },
    },
  ],
  [
    {
      value: "Guide link",
      component: MaterialTextInput,
      props: {
        required: true,
      },
    },
  ],
];

const validators = {
  division: [
    required(
      messages?.settings?.systemPreferences?.meetingMasterSetup?.agenda?.form
        ?.validators?.divisions
    ),
  ],
  implementationDetail: [
    required(
      messages?.settings?.systemPreferences?.meetingMasterSetup?.agenda?.form
        ?.validators?.implementationDetail
    ),
    emptyValueValidator,
  ],
  agenda: [
    required(
      messages?.settings?.systemPreferences?.meetingMasterSetup?.agenda?.form
        ?.validators?.agenda
    ),
    emptyValueValidator,
  ],
  project: [
    required(
      messages?.settings?.systemPreferences?.meetingMasterSetup?.agenda?.form
        ?.validators?.project
    ),
  ],
  guides: {
    name: [
      required(
        messages?.settings?.systemPreferences?.meetingMasterSetup?.agenda?.form
          ?.validators?.name
      ),
      emptyValueValidator,
    ],
    type: [
      required(
        messages?.settings?.systemPreferences?.meetingMasterSetup?.agenda?.form
          ?.validators?.type
      ),
    ],
    guidelink: [
      required(
        messages?.settings?.systemPreferences?.meetingMasterSetup?.agenda?.form
          ?.validators?.guideLink
      ),
      linkValidator(messages?.general?.validLink),
    ],
  },
};

const initialValues = {
  guides: [
    {
      name: "",
      type: "",
      guidelink: "",
    },
  ],
};

export const getDefaultProjectFilter =
  (): MetaData<ProjectManagementEntity> => ({
    ...getDefaultMetaData<ProjectManagementEntity>(),
    filters: {
      status: Status.active,
    },
  });

const AgendaForm: React.FC<Props> = ({
  onCancel,
  onSuccess,
  agendaData,
  isUpdate = false,
}) => {
  const addMoreRef = useRef(null);
  const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);

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

  const { options: divisionOptions, searchOptions: searchDivisionOptions } =
    useOptions<Division>(DIVISION_LISTING_API);

  const { options: projectOptions, searchOptions: searchProjectOptions } =
    useOptions<ProjectManagementEntity>(
      PROJECT_LISTING_API.replace(":id", tenantId),
      true,
      getDefaultProjectFilter()
    );

  const reduxDispatch = useDispatch();

  const onSubmit = async (data: FormData) => {
    const sanitizedBody = {
      tenantId: tenantId,
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
          isUpdate
            ? `${MEETING_AGENDA_BY_ID}/${agendaData?.id}`
            : MEETING_AGENDA_BY_ID,
          resolve,
          reject,
          isUpdate ? HttpMethods.PATCH : HttpMethods.POST,
          sanitizedBody
        )
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
      change(
        "division",
        agendaData?.divisions?.map((option) => ({
          id: option.id,
          label: `${capitalizeLegend(option?.divisionName)}`,
        }))
      );
      change("agenda", agendaData?.title);
      change("implementationDetail", agendaData?.implementationDetail);
      change("status", agendaData?.status === "ACTIVE");
      change("project", {
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

        handleRecursiveChange("guides", guides);
      } else {
        handleRecursiveChange("guides", []);
      }
    }
  }, []);

  const handleAddField = () => {
    if (addMoreRef?.current) {
      addMoreRef.current?.addItemToGroup("guides");
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow minWidth="530px">
        <FormRowItem>
          {connectField("agenda", {
            label:
              messages?.settings?.systemPreferences?.meetingMasterSetup?.agenda
                ?.form?.agenda,
            required: true,
          })(MaterialTextInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          {connectField("implementationDetail", {
            label:
              messages?.settings?.systemPreferences?.meetingMasterSetup?.agenda
                ?.form?.implementationDetail,
            multiline: true,
            required: true,
            minRows: 3,
          })(MaterialTextInput)}
        </FormRowItem>
      </FormRow>
      <FormRow minWidth="530px">
        <FormRowItem>
          {connectField("division", {
            label:
              messages?.settings?.systemPreferences?.meetingMasterSetup?.agenda
                ?.form?.divisions,
            required: true,
            multiple: true,
            options: divisionOptions?.map(mapIdNameToOptionWithoutCaptializing),
            isLimit: true,
            searchOptions: searchDivisionOptions,
          })(MaterialAutocompleteInput)}
        </FormRowItem>
        <FormRowItem>
          {connectField("project", {
            label:
              messages?.settings?.systemPreferences?.meetingMasterSetup?.agenda
                ?.form?.project,
            required: true,
            searchOptions: searchProjectOptions,
            options: projectOptions?.map(
              mapIdNameToOptionWithTitleWithoutCaptializing
            ),
          })(MaterialAutocompleteInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          {connectField("status", {
            label:
              messages?.settings?.systemPreferences?.meetingMasterSetup?.agenda
                ?.form?.status,
          })(SwitchInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <Divider sx={{ width: "100%" }} />
        </FormRowItem>
      </FormRow>
      <FormRow marginBottom="0px">
        <FormRowItem>
          <StyledMeetingAgendaHeading>
            {
              messages?.settings?.systemPreferences?.meetingMasterSetup?.agenda
                ?.form?.guide
            }
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
            {
              messages?.settings?.systemPreferences?.meetingMasterSetup?.agenda
                ?.form?.addMore
            }
          </StyledMeetingAgendaAddMoreText>
        </StyledMeetinAgendaAddMoreContainer>
      </FormRow>

      {connectFieldReplicate("guides", {
        formLayout: guidesFormLayout,
        ref: addMoreRef,
        showAddButton: false,
      })(RecursiveFieldInput)}

      {submitError && (
        <FormRow>
          <FormRowItem>
            <FormError
              message={
                messages?.settings?.systemPreferences?.meetingMasterSetup
                  ?.agenda?.form?.error?.serverError?.[submitError]
              }
            />
          </FormRowItem>
        </FormRow>
      )}
      <FormRow justifyContent="end" marginBottom="0px">
        <Button
          variant="outlined"
          disabled={submitting}
          color="secondary"
          onClick={onCancel}
          label={
            messages?.settings?.systemPreferences?.meetingMasterSetup?.agenda
              ?.form?.cancel
          }
        />
        <Button
          variant="contained"
          type="submit"
          disabled={submitting}
          label={
            messages?.settings?.systemPreferences?.meetingMasterSetup?.agenda
              ?.form?.[isUpdate ? "update" : "create"]
          }
        />
      </FormRow>
    </Form>
  );
};

export default AgendaForm;
