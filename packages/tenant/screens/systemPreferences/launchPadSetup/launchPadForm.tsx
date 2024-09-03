import { useEntity, useFormReducer } from "@wizehub/common/hooks";
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
import { Status } from "@wizehub/common/models/modules";
import { Grid } from "@mui/material";
import { toast } from "react-toastify";
import { fontWeight } from "@wizehub/common/theme/style.typography";
import { LaunchPad, LaunchPadDetailEntity } from "@wizehub/common/models/genericEntities";
import { Id } from "@wizehub/common/models";
import messages from "../../../messages";
import {
  StyledLaunchPadCloseIcon,
  StyledLaunchPadCloseIconContainer,
  StyledLaunchPadImage,
  StyledLaunchPadContainer,
  StyledLaunchPadPhotoIcon,
  StyledFileInput,
  StyledFileUploadContainer,
  StyledFileUploadOutlinedIcon,
  StyledUploadTypographyText,
  StyledIconTypography,
} from "./styles";
import {
  UPLOAD_LAUNCH_PAD_ICON,
  DELETE_LAUNCH_PAD_ICON,
  LAUNCH_PAD_BY_ID,
} from "../../../api";
import { config } from "../../../config";
import { linkValidator } from "@wizehub/common/utils";
import { apiCall } from "@wizehub/common/redux/actions";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
  isUpdate?: boolean;
  launchPadAppId?: Id;
}

interface FormData {
  name: string;
  link: string;
  status: Status;
}

const validators = {
  name: [
    required(
      messages?.settings?.systemPreferences?.launchPadSetup?.form?.validators
        ?.name
    ),
    emptyValueValidator,
  ],
  link: [
    required(
      messages?.settings?.systemPreferences?.launchPadSetup?.form?.validators
        ?.link
    ),
    linkValidator(messages?.general?.validLink),
    emptyValueValidator,
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

const LaunchPadForm: React.FC<Props> = ({
  onCancel,
  onSuccess,
  launchPadAppId,
  isUpdate = false,
}) => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);

  const { entity: launchPadAppData } =
    useEntity<LaunchPadDetailEntity>(
      LAUNCH_PAD_BY_ID,
      launchPadAppId
    );

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
      isUpdate ? launchPadAppId?.toString() : id
    );

    return new Promise<void>((resolve, reject) => {
      reduxDispatch(
        apiCall(
          UPLOAD_LAUNCH_PAD_ICON,
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
              messages?.settings?.systemPreferences?.launchPadSetup?.form
                ?.success?.[isUpdate ? "updated" : "created"]
            }
          />
        ));
      })
      .catch(() => {
        toast(() => (
          <Toast
            text={
              messages?.settings?.systemPreferences?.launchPadSetup?.form
                ?.errors?.[
              isUpdate ? "updateImageUplodError" : "createImageUploadError"
              ]
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
          DELETE_LAUNCH_PAD_ICON.replace(":id", id),
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
              messages?.settings?.systemPreferences?.launchPadSetup?.form
                ?.success?.[isUpdate ? "updated" : "created"]
            }
          />
        ));
      })
      .catch(() => { });

  const handleSuccess = () => {
    onSuccess();
    toast(() => (
      <Toast
        text={
          messages?.settings?.systemPreferences?.launchPadSetup?.form
            ?.success?.[isUpdate ? "updated" : "created"]
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
    const getStatus = (isUpdate: boolean, status: Status): Status => {
      if (isUpdate) {
        return status ? Status.active : Status.inactive;
      }
      return Status.active;
    };

    const sanitizedBody = {
      name: trimWordWrapper(data.name),
      url: data.link,
      status: getStatus(isUpdate, data.status),
      tenantId: tenantId,
      type: "WIZEHUB",
    };

    return new Promise((resolve, reject) => {
      reduxDispatch(
        apiCall(
          !isUpdate
            ? LAUNCH_PAD_BY_ID
            : `${LAUNCH_PAD_BY_ID}/${launchPadAppId}`,
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
    if (isUpdate && launchPadAppData) {
      change("name", launchPadAppData?.name);
      change("link", launchPadAppData?.url);
      change("status", launchPadAppData?.status === Status.active);
      change(
        "icon",
        launchPadAppData?.icon?.length
          ? `${config.baseImageUrl}/${launchPadAppData?.icon}`
          : null
      );
    }
  }, [launchPadAppData]);

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

  const launchPadFormToastComponent = () => (
    <Toast
      subText={
        messages?.settings?.systemPreferences?.launchPadSetup?.form?.errors
          ?.fileSizeUploadError
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
              messages?.settings?.systemPreferences?.launchPadSetup?.form?.name,
            required: true,
          })(MaterialTextInput)}
        </FormRowItem>
        <FormRowItem>
          {connectField("link", {
            label:
              messages?.settings?.systemPreferences?.launchPadSetup?.form?.link,
            required: true,
          })(MaterialTextInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem display="flex" flexDirection="column" gap="10px">
          <StyledIconTypography>
            {messages?.settings?.systemPreferences?.launchPadSetup?.form?.icon}
          </StyledIconTypography>
          <Grid container display="flex" alignItems="center" gap="20px">
            <StyledLaunchPadContainer
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
                  <StyledLaunchPadImage src={imageSrc} alt="application" />
                  <StyledLaunchPadCloseIconContainer
                    onClick={() => {
                      setFile(null);
                      if (isUpdate) {
                        change("icon", null);
                      }
                    }}
                  >
                    <StyledLaunchPadCloseIcon />
                  </StyledLaunchPadCloseIconContainer>
                </>
              ) : (
                <StyledLaunchPadPhotoIcon />
              )}
            </StyledLaunchPadContainer>

            <StyledFileInput
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={(e) => {
                if (handleFileSelect(e)) {
                  if (fileSizeCheckFunction(e.target.files[0].size, 1)) {
                    toast(launchPadFormToastComponent());
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
                  messages?.settings?.systemPreferences?.launchPadSetup?.form
                    ?.uploadIcon
                }
              </StyledUploadTypographyText>
            </StyledFileUploadContainer>
          </Grid>
        </FormRowItem>
        <FormRowItem>
          {connectField("status", {
            label:
              messages?.settings?.systemPreferences?.launchPadSetup?.form
                ?.status,
            fontWeight: fontWeight.medium,
          })(SwitchInput)}
        </FormRowItem>
      </FormRow>
      {submitError && (
        <FormRow>
          <FormRowItem>
            <FormError
              message={
                messages?.settings?.systemPreferences?.launchPadSetup?.form
                  ?.error?.serverError?.[submitError]
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
          label={
            messages?.settings?.systemPreferences?.launchPadSetup?.form?.cancel
          }
        />
        <Button
          variant="contained"
          type="submit"
          disabled={submitting}
          label={
            messages?.settings?.systemPreferences?.launchPadSetup?.form?.[
            isUpdate ? "update" : "create"
            ]
          }
        />
      </FormRow>
    </Form>
  );
};

export default LaunchPadForm;
