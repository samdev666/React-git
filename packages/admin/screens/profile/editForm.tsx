import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  Button,
  Form,
  FormError,
  FormRow,
  FormRowItem,
  TextInput,
  Toast,
  PhoneInput,
} from '@wizehub/components';
import { useFormReducer } from '@wizehub/common/hooks';
import {
  HttpMethods,
  emailValidator,
  emptyValueValidator,
  fileSizeCheckFunction,
  required,
} from '@wizehub/common/utils';
import { apiCall } from '../../redux/actions';
import messages from '../../messages';
import {
  StyledEditProfileAvatarContainer,
  StyledEditProfileText,
  StyledFileInput,
  StyledPhotoContent,
  StyledProfileImageAndTextContainer,
} from './styles';
import { ReduxState } from '../../redux/reducers';
import { MAX_FILE_SIZE } from '../../utils/constant';
import {
  PROFILE,
  REMOVE_PROFILE_IMAGE,
  UPLOAD_PROFILE_IMAGE,
} from '../../api';
import { config } from '../../config';

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

const validators = {
  firstName: [
    required(messages?.profile?.form?.errors?.firstNameRequired),
    emptyValueValidator,
  ],
  lastName: [
    required(messages?.profile?.form?.errors?.lastNameRequired),
    emptyValueValidator,
  ],
  email: [
    required(messages?.profile?.form?.errors?.emailRequired),
    emailValidator,
  ],
};

export const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFile = e.target.files[0];
  if (selectedFile) {
    const isFileValid = selectedFile.type === 'image/png'
      || selectedFile.type === 'image/jpg'
      || selectedFile.type === 'image/jpeg';
    if (isFileValid) return true;
    toast(() => (
      <Toast subText={messages?.general?.errors?.fileTypeError} type="error" />
    ));
  }
  return false;
};

interface FormData{
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const EditForm: React.FC<Props> = ({ onSuccess, onCancel }) => {
  const fileInputRef = useRef(null);
  const reduxDispatch = useDispatch();
  const userProfile = useSelector((state: ReduxState) => state.profile);
  const [file, setFile] = useState(null);

  const {
    submitting,
    submitError,
    handleSubmit,
    connectField,
    change,
    setSubmitError,
    hasError,
  } = useFormReducer(validators);

  useEffect(() => {
    change('firstName', userProfile?.firstName);
    change('lastName', userProfile?.lastName);
    change('email', userProfile?.email);
    if (userProfile?.dialCode && userProfile?.phoneNumber) {
      change('phone', `${+userProfile.dialCode + userProfile.phoneNumber}`);
    }
  }, []);

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    setFile(null);
    return new Promise<void>((resolve, reject) => {
      reduxDispatch(
        apiCall(
          UPLOAD_PROFILE_IMAGE,
          resolve,
          reject,
          HttpMethods.POST,
          formData,
          { isFormData: true },
        ),
      );
    })
      .then(async () => {
        onSuccess();
        toast(() => (
          <Toast
            subText={messages?.profile?.editForm?.success?.updatedSuccessfully}
          />
        ));
      })
      .catch(() => {
        onCancel();
        toast(() => (
          <Toast
            type="error"
            subText={messages?.profile?.editForm?.photoError}
          />
        ));
      });
  };

  const handleDeleteFile = async () => new Promise<void>((resolve, reject) => {
    reduxDispatch(
      apiCall(REMOVE_PROFILE_IMAGE, resolve, reject, HttpMethods.DELETE),
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
          subText={messages?.profile?.editForm?.photoError}
        />
      ));
    });

  const onSubmit = async (data: FormData) => new Promise<any>((resolve, reject) => {
    const sanitizedBody = {
      firstName: data?.firstName?.trim(),
      lastName: data?.lastName?.trim(),
      email: data?.email,
      phoneNumber: data?.phone?.substring(2),
      dialCode: data?.phone?.substring(0, 2),
    };
    reduxDispatch(
      apiCall(PROFILE, resolve, reject, HttpMethods.PATCH, sanitizedBody),
    );
  })
    .then(async (res) => {
      if (res && file && userProfile?.profileUrl && !fileSizeCheckFunction(file.size, MAX_FILE_SIZE)) {
        return handleDeleteFile();
      }
      if (res && file) {
        return handleFileUpload();
      }
      onSuccess();
      return toast(() => (
        <Toast
          subText={
                messages?.profile?.editForm?.success?.updatedSuccessfully
              }
        />
      ));
    })
    .catch((err) => {
      setSubmitError(err.message);
    });

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow>
        <FormRowItem alignItems="center" gap="62px">
          <StyledEditProfileText>
            {messages?.profile?.editForm?.profilePicture}
          </StyledEditProfileText>
          <StyledProfileImageAndTextContainer>
            {file && (
              <StyledEditProfileAvatarContainer
                src={file ? URL.createObjectURL(file) : ''}
                alt="profile"
                onClick={handleClick}
              />
            )}
            {!file && (
              userProfile?.profileUrl ? (
                <StyledEditProfileAvatarContainer
                  src={
                    userProfile?.profileUrl
                      ? `${config.baseImageUrl}/${userProfile?.profileUrl}`
                      : ''
                  }
                  alt="profile"
                  onClick={handleClick}
                />
              ) : (
                <StyledEditProfileAvatarContainer onClick={handleClick} />
              )
            )}
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
                      />,
                    );
                  }
                  setFile(e.target.files[0]);
                }
              }}
            />
            <StyledPhotoContent onClick={handleClick}>
              {messages?.profile?.editForm?.changePhoto}
            </StyledPhotoContent>
          </StyledProfileImageAndTextContainer>
        </FormRowItem>
      </FormRow>
      <FormRow width="562px" mb={2}>
        <FormRowItem>
          {connectField('firstName', {
            label: messages?.profile?.editForm?.firstName,
            required: true,
          })(TextInput)}
        </FormRowItem>
        <FormRowItem>
          {connectField('lastName', {
            label: messages?.profile?.editForm?.lastName,
            required: true,
          })(TextInput)}
        </FormRowItem>
      </FormRow>
      <FormRow mb={2}>
        <FormRowItem>
          {connectField('email', {
            label: messages?.profile?.editForm?.emailAddress,
            required: true,
          })(TextInput)}
        </FormRowItem>
      </FormRow>
      <FormRow mb={2}>
        <FormRowItem>
          {connectField('phone', {
            label: messages?.profile?.editForm?.phoneNumber,
            type: 'number',
            enableSearch: true,
            required: true,
            placeholder: messages?.profile?.editForm?.phoneNumber,
            hasError,
          })(PhoneInput)}
        </FormRowItem>
      </FormRow>
      {submitError && (
        <FormRow>
          <FormRowItem>
            <FormError
              message={
                messages?.profile?.form?.errors?.serverErrors?.[submitError]
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
          label={messages?.general?.update}
        />
      </FormRow>
    </Form>
  );
};

export default EditForm;
