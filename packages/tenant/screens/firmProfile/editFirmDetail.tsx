import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Button,
  Form,
  FormError,
  FormRow,
  FormRowItem,
  TextInput,
  Toast,
  PhoneInput,
  MaterialAutocompleteInput,
  MaterialTextInput,
} from "@wizehub/components";
import { useFormReducer, useOptions } from "@wizehub/common/hooks";
import {
  HttpMethods,
  emailValidator,
  emptyValueValidator,
  fileSizeCheckFunction,
  numberValidator,
  required,
  trimWordWrapper,
} from "@wizehub/common/utils";
import messages from "../../messages";
import {
  StyledEditFirmDetailAvatarContainer,
  StyledEditFirmDetailText,
  StyledFileInput,
  StyledPhotoContent,
  StyledFirmDetailImageAndTextContainer,
} from "./styles";
import { ReduxState } from "../../redux/reducers";
import { MAX_FILE_SIZE } from "../../utils/constant";
import {
  FIRM_DETAIL_BY_ID,
  FILE_UPLOAD,
  FILE_REMOVAL,
  COUNTRIES_API,
} from "../../api";
import { config } from "../../config";
import { apiCall } from "@wizehub/common/redux/actions";
import {
  CountryEntity,
  FirmProfileEntity,
} from "@wizehub/common/models/genericEntities";
import { Id, Option } from "@wizehub/common/models";
import { Country } from "@wizehub/common/models/modules";

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
  firmDetailData: FirmProfileEntity;
}

const mapIdNameToOptionForCountryCode = (entity: {
  id: Id;
  name: string;
}): Option => ({ id: entity?.id, label: entity?.name });

const validators = {
  name: [
    required(messages?.firmProfile?.firmDetails?.form?.validators?.name),
    emptyValueValidator,
  ],
  postalCode: [
    required(messages?.firmProfile?.firmDetails?.form?.validators?.postalCode),
    numberValidator(
      messages?.firmProfile?.firmDetails?.form?.validators?.postalCodeNumber
    ),
  ],
  streetAddress: [
    required(
      messages?.firmProfile?.firmDetails?.form?.validators?.streetAddress
    ),
  ],
  country: [
    required(messages?.firmProfile?.firmDetails?.form?.validators?.country),
  ],
  city: [required(messages?.firmProfile?.firmDetails?.form?.validators?.city)],
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

interface FormData {
  name: string;
  abn: string;
  streetAddress: string;
  city: string;
  country: {
    id: Id;
    label: string;
  };
  postalCode: string;
}

const EditFirmDetailForm: React.FC<Props> = ({
  onSuccess,
  onCancel,
  firmDetailData,
}) => {
  const fileInputRef = useRef(null);
  const reduxDispatch = useDispatch();
  const { tenantData } = useSelector((state: ReduxState) => state);
  const [file, setFile] = useState(null);
  const { options: countryOptions } = useOptions<CountryEntity>(
    COUNTRIES_API,
    true
  );

  const {
    submitting,
    submitError,
    handleSubmit,
    connectField,
    change,
    setSubmitError,
    formValues,
    hasError,
  } = useFormReducer(validators);

  useEffect(() => {
    change("name", firmDetailData?.name);
    change("abn", firmDetailData?.abn);
    change("streetAddress", firmDetailData?.streetAddress);
    change("city", firmDetailData?.city);
    change("postalCode", Number(firmDetailData?.postalCode));
  }, []);

  useEffect(() => {
    if (countryOptions.length) {
      change(
        "country",
        countryOptions
          ?.map(mapIdNameToOptionForCountryCode)
          ?.find((item) => item.id == firmDetailData?.countryId?.id)
      );
    }
  }, [countryOptions]);

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("tenantId", tenantData?.tenantId);
    setFile(null);
    return new Promise<void>((resolve, reject) => {
      reduxDispatch(
        apiCall(FILE_UPLOAD, resolve, reject, HttpMethods.POST, formData, {
          isFormData: true,
        })
      );
    })
      .then(async () => {
        onSuccess();
        toast(() => (
          <Toast
            subText={messages?.firmProfile?.firmDetails?.form?.success?.updated}
          />
        ));
      })
      .catch(() => {
        onCancel();
        toast(() => (
          <Toast
            type="error"
            subText={
              messages?.firmProfile?.firmDetails?.form?.error?.photoError
            }
          />
        ));
      });
  };

  const handleDeleteFile = async () =>
    new Promise<void>((resolve, reject) => {
      reduxDispatch(
        apiCall(
          FILE_REMOVAL.replace(":id", tenantData?.tenantId),
          resolve,
          reject,
          HttpMethods.DELETE
        )
      );
    })
      .then(async () => {
        await handleFileUpload();
      })
      .catch(() => {
        onCancel();
        toast(() => (
          <Toast
            type="error"
            subText={
              messages?.firmProfile?.firmDetails?.form?.error?.photoError
            }
          />
        ));
      });

  const onSubmit = async (data: FormData) => {
    return new Promise<any>((resolve, reject) => {
      let sanitizedBody: any = {
        name: trimWordWrapper(data?.name),
        streetAddress: trimWordWrapper(data?.streetAddress),
        city: trimWordWrapper(data?.city),
        countryId: data?.country?.id,
        postalCode: trimWordWrapper(data?.postalCode.toString()),
      };

      if (data?.abn) {
        sanitizedBody = {
          ...sanitizedBody,
          abn: trimWordWrapper(data?.abn) ? trimWordWrapper(data?.abn) : null,
        };
      } else {
        sanitizedBody = {
          ...sanitizedBody,
          abn: null,
        };
      }

      reduxDispatch(
        apiCall(
          `${FIRM_DETAIL_BY_ID}/${tenantData?.tenantId}`,
          resolve,
          reject,
          HttpMethods.PATCH,
          sanitizedBody
        )
      );
    })
      .then(async (res) => {
        if (
          res &&
          file &&
          firmDetailData?.logoPath &&
          !fileSizeCheckFunction(file.size, MAX_FILE_SIZE)
        ) {
          return handleDeleteFile();
        }
        if (res && file) {
          return handleFileUpload();
        }
        onSuccess();
        return toast(() => (
          <Toast
            subText={messages?.firmProfile?.firmDetails?.form?.success?.updated}
          />
        ));
      })
      .catch((err) => {
        setSubmitError(err.message);
      });
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow>
        <FormRowItem alignItems="center" gap="62px">
          <StyledEditFirmDetailText>
            {messages?.firmProfile?.firmDetails?.form?.logo}
          </StyledEditFirmDetailText>
          <StyledFirmDetailImageAndTextContainer>
            {file && (
              <StyledEditFirmDetailAvatarContainer
                src={file ? URL.createObjectURL(file) : ""}
                alt="firmProfile"
                onClick={handleClick}
              />
            )}
            {!file &&
              (firmDetailData?.logoPath ? (
                <StyledEditFirmDetailAvatarContainer
                  src={
                    firmDetailData?.logoPath
                      ? `${config.baseImageUrl}/${firmDetailData?.logoPath}`
                      : ""
                  }
                  alt="profile"
                  onClick={handleClick}
                />
              ) : (
                <StyledEditFirmDetailAvatarContainer onClick={handleClick} />
              ))}
            <StyledFileInput
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={(e) => {
                if (handleFileSelect(e)) {
                  if (
                    fileSizeCheckFunction(e.target.files[0].size, MAX_FILE_SIZE)
                  ) {
                    toast(
                      <Toast
                        type="error"
                        subText={messages?.general?.errors?.fileSizeError}
                      />
                    );
                  }
                  setFile(e.target.files[0]);
                }
              }}
            />
            <StyledPhotoContent onClick={handleClick}>
              {messages?.firmProfile?.firmDetails?.form?.changeLogo}
            </StyledPhotoContent>
          </StyledFirmDetailImageAndTextContainer>
        </FormRowItem>
      </FormRow>
      <FormRow width="562px" mb={2}>
        <FormRowItem>
          {connectField("name", {
            label: messages?.firmProfile?.firmDetails?.form?.name,
            required: true,
          })(TextInput)}
        </FormRowItem>
        <FormRowItem>
          {connectField("abn", {
            label:
              formValues?.country?.value?.label === Country.AUSTRALIA
                ? messages?.firmProfile?.firmDetails?.form?.abn
                : messages?.firmProfile?.firmDetails?.form?.firmIdentifier,
          })(TextInput)}
        </FormRowItem>
      </FormRow>
      <FormRow mb={2}>
        <FormRowItem>
          {connectField("country", {
            label: messages?.firmProfile?.firmDetails?.form?.country,
            enableClearable: true,
            options: countryOptions?.map(mapIdNameToOptionForCountryCode),
            required: true,
          })(MaterialAutocompleteInput)}
        </FormRowItem>
      </FormRow>
      <FormRow mb={2}>
        <FormRowItem>
          {connectField("streetAddress", {
            label: messages?.firmProfile?.firmDetails?.form?.streetAddress,
            multiline: true,
            required: true,
            minRows: 3,
          })(MaterialTextInput)}
        </FormRowItem>
      </FormRow>
      <FormRow mb={2}>
        <FormRowItem>
          {connectField("city", {
            label: messages?.firmProfile?.firmDetails?.form?.city,
            required: true,
          })(TextInput)}
        </FormRowItem>
        <FormRowItem>
          {connectField("postalCode", {
            label: messages?.firmProfile?.firmDetails?.form?.postalCode,
            required: true,
          })(TextInput)}
        </FormRowItem>
      </FormRow>
      {submitError && (
        <FormRow>
          <FormRowItem>
            <FormError
              message={
                submitError === "error.tenant.duplicate"
                  ? messages?.firmProfile?.firmDetails?.form?.error?.serverError?.[
                      submitError
                    ]?.replace(
                      ":abn",
                      formValues?.country?.value?.label === Country.AUSTRALIA
                        ? "abn"
                        : "firm identifier"
                    )
                  : messages?.firmProfile?.firmDetails?.form?.error
                      ?.serverError?.[submitError]
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
          disabled={submitting}
          label={messages?.firmProfile?.firmDetails?.form?.cancel}
        />
        <Button
          variant="contained"
          type="submit"
          disabled={submitting}
          label={messages?.firmProfile?.firmDetails?.form?.update}
        />
      </FormRow>
    </Form>
  );
};

export default EditFirmDetailForm;
