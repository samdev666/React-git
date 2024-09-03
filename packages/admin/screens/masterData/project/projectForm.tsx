import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  HttpMethods,
  capitalizeLegend,
  emptyValueValidator,
  linkValidator,
  mapIdNameToOptionWithTitle,
  mapIdNameToOptionWithoutCaptializing,
  required,
  trimWordWrapper,
} from "@wizehub/common/utils";
import { useFormReducer, useOptions } from "@wizehub/common/hooks";
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
  RecursiveFieldInput,
  DragDropComponent,
} from "@wizehub/components";
import { toast } from "react-toastify";
import { Status } from "@wizehub/common/models/modules";
import { useParams } from "react-router-dom";
import {
  Division,
  DocumentEntity,
  ProjectManagementEntity,
  Stage,
} from "@wizehub/common/models/genericEntities";
import { Id, MetaData, getDefaultMetaData } from "@wizehub/common/models";
import {
  DELETE_PROJECT_DOCUMENT,
  DIVISION_LISTING_API,
  PROJECT_BY_ID,
  PROJECT_STAGES,
  UPLOAD_PROJECT_DOCUMENT,
} from "../../../api";
import { apiCall } from "../../../redux/actions";
import messages from "../../../messages";
import {
  StyledMeetinAgendaAddMoreContainer,
  StyledMeetingAgendaAddMoreIcon,
  StyledMeetingAgendaAddMoreText,
  StyledMeetingAgendaHeading,
} from "../styles";
import { Divider, Grid } from "@mui/material";

interface Props {
  isUpdate?: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  projectManagement?: ProjectManagementEntity;
}

interface FormData {
  title: string;
  stage: { id: Id };
  division: { id: Id };
  description: string;
  status: Status;
  projectlinks?: {
    title: string;
    link: string;
  }[];
}

const getDefaultStageOptionFilter = (): MetaData<Stage> => ({
  ...getDefaultMetaData<Stage>(),
  order: "title",
});

const validators = {
  title: [
    required(messages?.projectManagement?.form?.validation?.title),
    emptyValueValidator,
  ],
  stage: [required(messages?.projectManagement?.form?.validation?.stage)],
  division: [required(messages?.projectManagement?.form?.validation?.division)],
  projectlinks: {
    title: [
      required(messages?.projectManagement?.form?.validation?.linkTitle),
      emptyValueValidator,
    ],
    link: [
      required(messages?.projectManagement?.form?.validation?.link),
      linkValidator(messages?.general?.validLink),
    ],
  },
};

const projectFormLayout = [
  [
    {
      value: "Title",
      component: MaterialTextInput,
      props: {
        required: true,
      },
    },
    {
      value: "Link",
      component: MaterialTextInput,
      props: {
        required: true,
      },
    },
  ],
];

const initialValues = {
  projectlinks: [
    {
      title: "",
      link: "",
    },
  ],
};

const ProjectForm: React.FC<Props> = ({
  onCancel,
  onSuccess,
  projectManagement,
  isUpdate = false,
}) => {
  const addMoreRef = useRef(null);
  const { id } = useParams<{ id?: string }>();
  const [files, setFiles] = useState([]);
  const {
    submitting,
    submitError,
    handleSubmit,
    connectField,
    change,
    setSubmitError,
    connectFieldReplicate,
    handleRecursiveChange,
  } = useFormReducer(validators, initialValues);
  const reduxDispatch = useDispatch();

  const { options: divisionOptions, searchOptions: searchDivisionOptions } =
    useOptions<Division>(DIVISION_LISTING_API);

  const { options: stagesOptions, searchOptions: searchStageOptions } =
    useOptions<Stage>(PROJECT_STAGES, true, getDefaultStageOptionFilter());

  const fileAlreadyExists = (file: any) =>
    projectManagement?.documents?.some(
      (value: any) => value.name === (file?.fileName || file?.name)
    );

  const uploadFile = async (id?: string) => {
    const uploadPromises = files?.map((file) => {
      const fileValue = file?.id ? file : file?.file;
      const formData = new FormData();
      formData.append("file", fileValue);
      formData.append("projectId", id);

      return !fileAlreadyExists(fileValue)
        ? new Promise<any>((resolve, reject) => {
            reduxDispatch(
              apiCall(
                UPLOAD_PROJECT_DOCUMENT,
                resolve,
                reject,
                HttpMethods.POST,
                formData,
                { isFormData: true }
              )
            );
          })
        : Promise.resolve();
    });

    return Promise.all(uploadPromises)
      .then(() => {
        setFiles(null);
      })
      .catch((error) => {
        setSubmitError(error?.message);
      });
  };

  const deleteFile = async (id: string) => {
    const sanitizedBody = {
      projectId: projectManagement?.id,
      fileIds: [id],
    };

    return new Promise<any>((resolve, reject) => {
      reduxDispatch(
        apiCall(
          DELETE_PROJECT_DOCUMENT,
          resolve,
          reject,
          HttpMethods.DELETE,
          sanitizedBody
        )
      );
    })
      .then(() => {
        const filteredData = projectManagement?.documents?.filter(
          (val: any) => val?.id?.toString() !== id.toString()
        );
        setFiles(filteredData);
      })
      .catch((error) => {
        setSubmitError(error?.message);
        return;
      });
  };

  const onSubmit = async (data: FormData) => {
    return new Promise<any>((resolve, reject) => {
      const sanitizedBody = {
        title: trimWordWrapper(data.title),
        stageId: data.stage?.id,
        divisionId: data.division?.id,
        description: trimWordWrapper(data.description),
        status: data.status ? Status.active : Status.inactive,
        links: data?.projectlinks?.map((val) => ({
          title: trimWordWrapper(val?.title),
          link: val?.link,
        })),
      };
      reduxDispatch(
        apiCall(
          isUpdate ? `${PROJECT_BY_ID}/${id}` : PROJECT_BY_ID,
          resolve,
          reject,
          isUpdate ? HttpMethods.PATCH : HttpMethods.POST,
          sanitizedBody
        )
      );
    })
      .then(async (res) => {
        if (files?.length) await uploadFile(res?.data?.id);
        onSuccess();
        toast(() => (
          <Toast
            text={
              messages?.projectManagement?.form?.success?.[
                isUpdate ? "updated" : "created"
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
    if (isUpdate) {
      change("title", projectManagement?.title);
      change("stage", {
        id: projectManagement?.stage?.id,
        label: capitalizeLegend(projectManagement?.stage?.name),
      });
      change("description", projectManagement?.description);
      change("status", projectManagement?.status === Status.active);
      change("division", {
        id: projectManagement?.division?.id,
        label: projectManagement?.division?.name,
      });
      setFiles(projectManagement?.documents);
      if (projectManagement?.links) {
        const guides = projectManagement?.links.map((item) => ({
          title: item?.title,
          link: item?.link,
        }));
        handleRecursiveChange("projectlinks", guides);
      } else {
        handleRecursiveChange("projectlinks", []);
      }
    }
  }, []);

  const handleAddField = () => {
    if (addMoreRef?.current) {
      addMoreRef.current?.addItemToGroup("projectlinks");
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow minWidth="530px">
        <FormRowItem>
          {connectField("title", {
            label: messages?.projectManagement?.form?.title,
            required: true,
          })(MaterialTextInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          {connectField("stage", {
            label: messages?.projectManagement?.form?.stage,
            required: true,
            enableClearable: true,
            options: stagesOptions?.map(mapIdNameToOptionWithTitle),
            searchOptions: searchStageOptions,
          })(MaterialAutocompleteInput)}
        </FormRowItem>
        <FormRowItem>
          {connectField("division", {
            label: messages?.projectManagement?.form?.division,
            required: true,
            enableClearable: true,
            options: divisionOptions?.map(mapIdNameToOptionWithoutCaptializing),
            searchOptions: searchDivisionOptions,
          })(MaterialAutocompleteInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          {connectField("description", {
            multiline: true,
            label: messages?.projectManagement?.form?.description,
            minRows: 5,
          })(MaterialTextInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          {connectField("status", {
            label: messages?.projectManagement?.form?.status,
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
            {messages?.projectManagement?.form?.link}
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
            {messages?.projectManagement?.form?.addMore}
          </StyledMeetingAgendaAddMoreText>
        </StyledMeetinAgendaAddMoreContainer>
      </FormRow>

      {connectFieldReplicate("projectlinks", {
        formLayout: projectFormLayout,
        ref: addMoreRef,
        showAddButton: false,
      })(RecursiveFieldInput)}
      <FormRow>
        <FormRowItem>
          <Divider sx={{ width: "100%" }} />
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <StyledMeetingAgendaHeading>
            {messages?.projectManagement?.form?.attachments}
          </StyledMeetingAgendaHeading>
        </FormRowItem>
      </FormRow>
      <Grid item xs={12}>
        {connectField("fileUpload", {
          files,
          setFiles,
          orientation: "horizontal",
          acceptedFiles: ".pdf, image/*",
          fileContainerWidth: "292px",
          onFilesDelete: deleteFile,
        })(DragDropComponent)}
      </Grid>
      {submitError && (
        <FormRow mt={2}>
          <FormRowItem>
            <FormError
              message={messages?.general?.error?.serverError?.[submitError]}
            />
          </FormRowItem>
        </FormRow>
      )}
      <FormRow justifyContent="end" mb={0} mt={2}>
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
          label={messages?.general?.[isUpdate ? "update" : "create"]}
        />
      </FormRow>
    </Form>
  );
};

export default ProjectForm;
