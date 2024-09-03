import { useFormReducer } from "@wizehub/common/hooks";
import {
  Button,
  Form,
  FormError,
  FormRow,
  FormRowItem,
  MaterialTextInput,
  SwitchInput,
  Toast,
} from "@wizehub/components";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  HttpMethods,
  emptyValueValidator,
  fileSizeCheckFunction,
  required,
  trimWordWrapper,
} from "@wizehub/common/utils";
import { LaunchPadType, Status } from "@wizehub/common/models/modules";
import { Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { fontWeight } from "@wizehub/common/theme/style.typography";
import { ApplicationDetailEntity } from "@wizehub/common/models/genericEntities";
import { Id } from "@wizehub/common/models";
import messages from "../../../messages";
import { apiCall } from "../../../redux/actions";
import {
  StyledApplicationCloseIcon,
  StyledApplicationCloseIconContainer,
  StyledApplicationFormTypographyText,
  StyledApplicationImage,
  StyledApplicationImageContainer,
  StyledApplicationPhotoIcon,
  StyledFileInput,
  StyledFileUploadContainer,
  StyledFileUploadOutlinedIcon,
  StyledUploadTypographyText,
} from "../styles";
import { APPLICATION_ICON_REMOVE, APPLICATION_ICON_UPLOAD } from "../../../api";
import { config } from "../../../config";
import { linkValidator } from "../../../utils";

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
  endpoint: string;
  isUpdate?: boolean;
  applicationData?: ApplicationDetailEntity;
}

interface FormData {
  name: string;
  link: string;
  status: Status;
}

const validators = {
  name: [
    required(
      messages.sidebar.menuItems.secondaryMenu.subMenuItems.leadDataManagement
        .validators.nameRequired
    ),
    emptyValueValidator,
  ],
  link: [
    required(
      messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
        .validators.linkRequired
    ),
    linkValidator,
  ],
};

export const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFile = e.target.files[0];
  if (selectedFile) {
    const isFileValid =
      selectedFile.type === "image/png" ||
      selectedFile.type === "image/jpg" ||
      selectedFile.type === "image/jpeg";
    if (isFileValid) return true;
    toast(() => (
      <Toast subText={messages?.general?.errors?.fileTypeError} type="error" />
    ));
  }
  return false;
};

const ApplicationForm: React.FC<Props> = ({
  onCancel,
  onSuccess,
  endpoint,
  isUpdate = false,
  applicationData,
}) => {
  const fileInputRef = useRef(null);
  const [checked, setChecked] = useState(false);
  const [file, setFile] = useState(null);

  const {
    submitting,
    submitError,
    handleSubmit,
    connectField,
    change,
    setSubmitError,
    formValues,
  } = useFormReducer(validators);

  const reduxDispatch = useDispatch();

  const handleFileUpload = async (id: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "launchPadId",
      isUpdate ? applicationData?.id?.toString() : id
    );

    return new Promise<void>((resolve, reject) => {
      reduxDispatch(
        apiCall(
          APPLICATION_ICON_UPLOAD,
          resolve,
          reject,
          HttpMethods.POST,
          formData,
          { isFormData: true }
        )
      );
    })
      .then(() => {
        onSuccess();
        setFile(null);
        toast(() => (
          <Toast
            text={
              messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
                .subItems.application.form.success?.[
                isUpdate ? "updated" : "created"
              ]
            }
          />
        ));
      })
      .catch(() => {
        toast(() => (
          <Toast
            text={
              isUpdate
                ? messages.sidebar.menuItems.secondaryMenu.subMenuItems
                    .masterData.subItems.application.form.error
                    .updateImageUplodError
                : messages.sidebar.menuItems.secondaryMenu.subMenuItems
                    .masterData.subItems.application.form.error
                    .createImageUploadError
            }
            type="error"
          />
        ));
        onSuccess();
      });
  };

  const handleDeleteFile = async (id: string) =>
    new Promise<void>((resolve, reject) => {
      reduxDispatch(
        apiCall(
          APPLICATION_ICON_REMOVE.replace(":id", id),
          resolve,
          reject,
          HttpMethods.DELETE
        )
      );
    })
      .then(() => {
        onSuccess();
        toast(() => (
          <Toast
            text={
              messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
                .subItems.application.form.success?.[
                isUpdate ? "updated" : "created"
              ]
            }
          />
        ));
      })
      .catch(() => {});

  const handleSuccess = () => {
    onSuccess();
    toast(() => (
      <Toast
        text={
          messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
            .subItems.application.form.success?.[
            isUpdate ? "updated" : "created"
          ]
        }
      />
    ));
  };

  const processFileActions = async (res: {
    data?: {
      id: Id;
      icon: {
        length: number;
      };
    };
  }) => {
    const id = res?.data?.id;
    const iconExists = res?.data?.icon?.length;
    const iconValueMissing = !formValues?.icon?.value;

    if (file) {
      await handleFileUpload(id?.toString());
    } else if (isUpdate && iconExists && iconValueMissing) {
      await handleDeleteFile(id?.toString());
    } else {
      handleSuccess();
    }
  };

  const onSubmit = async (data: FormData) => {
    const sanitizedBody = {
      name: trimWordWrapper(data.name),
      url: data.link,
      status: data?.status ? Status.active : Status.inactive,
      type: checked ? LaunchPadType.WIZEHUB : LaunchPadType.OTHER,
    };

    return new Promise((resolve, reject) => {
      reduxDispatch(
        apiCall(
          endpoint,
          resolve,
          reject,
          isUpdate ? HttpMethods.PATCH : HttpMethods.POST,
          sanitizedBody
        )
      );
    })
      .then(async (res) => {
        await processFileActions(res);
      })
      .catch((error) => {
        setSubmitError(error?.message);
      });
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    if (isUpdate) {
      setChecked(applicationData?.type === LaunchPadType.WIZEHUB);

      change("name", applicationData?.name);
      change("link", applicationData?.url);
      change("status", applicationData?.status === Status.active);
      change(
        "icon",
        applicationData?.icon?.length
          ? `${config.baseImageUrl}/${applicationData?.icon}`
          : null
      );
    }
  }, []);

  const getImageSrc = (
    file: any,
    isUpdate: boolean,
    formValues: Record<string, any>
  ) => {
    if (file) {
      return URL.createObjectURL(file);
    }
    if (isUpdate) {
      return formValues?.icon?.value || "";
    }
    return "";
  };

  const imageSrc = getImageSrc(file, isUpdate, formValues);

  const applicationFormToastComponent = () => (
    <Toast
      subText={
        messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
          .subItems.application.form.error.fileSizeUploadError
      }
      type="error"
    />
  );

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow minWidth="530px">
        <FormRowItem>
          {connectField("name", {
            label:
              messages.sidebar.menuItems.secondaryMenu.subMenuItems
                .leadDataManagement.subItems.leadSource.form.name,
            required: true,
          })(MaterialTextInput)}
        </FormRowItem>
        <FormRowItem>
          {connectField("link", {
            label:
              messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
                .subItems.application.applicationDetails.link,
            required: true,
          })(MaterialTextInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem display="flex" flexDirection="column" gap="10px">
          <Typography>
            {
              messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
                .subItems.application.applicationDetails.icon
            }
          </Typography>
          <Grid container display="flex" alignItems="center" gap="20px">
            <StyledApplicationImageContainer
              item
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="50px"
              height="50px"
              position="relative"
            >
              {file || formValues?.icon?.value ? (
                <>
                  <StyledApplicationImage src={imageSrc} alt="application" />
                  <StyledApplicationCloseIconContainer
                    onClick={() => {
                      setFile(null);
                      if (isUpdate) {
                        change("icon", null);
                      }
                    }}
                  >
                    <StyledApplicationCloseIcon />
                  </StyledApplicationCloseIconContainer>
                </>
              ) : (
                <StyledApplicationPhotoIcon />
              )}
            </StyledApplicationImageContainer>

            <StyledFileInput
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={(e) => {
                if (handleFileSelect(e)) {
                  if (fileSizeCheckFunction(e.target.files[0].size, 1)) {
                    toast(applicationFormToastComponent());
                    return;
                  }
                  setFile(e.target.files[0]);

                  const fileInput = e.target;
                  fileInput.value = null;
                }
              }}
            />

            <StyledFileUploadContainer
              item
              display="flex"
              gap="5px"
              onClick={handleClick}
            >
              <StyledFileUploadOutlinedIcon />
              <StyledUploadTypographyText>
                {
                  messages.sidebar.menuItems.secondaryMenu.subMenuItems
                    .masterData.subItems.application.form.uploadIcon
                }
              </StyledUploadTypographyText>
            </StyledFileUploadContainer>
          </Grid>
        </FormRowItem>
        <FormRowItem>
          {connectField("status", {
            label: messages.userManagement.status,
            fontWeight: fontWeight.regular,
          })(SwitchInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <FormControlLabel
            label={
              <StyledApplicationFormTypographyText>
                {
                  messages.sidebar.menuItems.secondaryMenu.subMenuItems
                    .masterData.subItems.application.applicationDetails
                    .isWizeApplication
                }
              </StyledApplicationFormTypographyText>
            }
            control={
              <Checkbox
                checked={checked}
                onChange={() => setChecked(!checked)}
              />
            }
          />
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

export default ApplicationForm;
