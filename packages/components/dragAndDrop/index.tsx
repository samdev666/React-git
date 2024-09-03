import { toast } from "react-toastify";
import { Grid } from "@mui/material";
import React, {
  Dispatch,
  DragEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  fileSizeCheckFunction,
  validFileTypeCheckFunction,
} from "@wizehub/common/utils/commonFunctions";
import { allowedFiles } from "@wizehub/tenant/utils/constant";
import Button from "../button";
import {
  StyledAttachmentContainer,
  StyledCancelOutlinedIcon,
  StyledDragActiveText,
  StyledDragDropForm,
  StyledDragDropFormContainer,
  StyledDragDropSubText,
  StyledDragDropText,
  StyledFileName,
  StyledFileSizeText,
  StyledFileUploadOutlinedIcon,
  StyledFilesContainer,
  StyledImageOutlinedIcon,
  StyledInputFile,
  StyledInsertDriveFileOutlinedIcon,
  StyledPendingOutlinedIcon,
  StyledProgressBar,
  StyledProgressBarContainer,
  StyledUploadText,
} from "./styles";
import Toast from "../toast";
import { StyledError } from "../textInput/styles";
import messages from "../messages";
import { config } from "@wizehub/tenant/config";

interface Props {
  orientation?: "horizontal" | "vertical";
  acceptedFiles?: string;
  files?: any;
  setFiles?: Dispatch<SetStateAction<any[]>>;
  multiple?: boolean;
  isPdf?: boolean;
  error?: string;
  maxFileSize?: number;
  setIsUploadCompleted?: React.Dispatch<React.SetStateAction<boolean>>;
  onFilesDelete?: (id: string) => void;
  fileContainerWidth?: string | number;
  onlyImageUrl?: boolean;
  requiresDragDrop?: boolean;
  fileWidth?: string;
}

export const formatSize = (sizeInBytes: any) => {
  if (!sizeInBytes) {
    return;
  }
  const KB = 1024;
  const MB = 1024 * 1024;

  if (sizeInBytes < KB) {
    return `${Math.round(sizeInBytes)} B`;
  }
  if (sizeInBytes < MB) {
    return `${Math.round(sizeInBytes / KB)} KB`;
  }
  return `${Math.round(sizeInBytes / MB)} MB`;
};

const DragDropComponent: React.FC<Props> = ({
  orientation = "vertical",
  acceptedFiles,
  files,
  setFiles,
  multiple = true,
  isPdf = false,
  error,
  maxFileSize,
  setIsUploadCompleted,
  onlyImageUrl = false,
  requiresDragDrop = false,
  fileWidth,
  ...props
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [progresses, setProgresses] = useState<any>({});
  const [uploadedSizes, setUploadedSizes] = useState<any>({});
  const [totalSizes, setTotalSizes] = useState<any>({});

  const inputRef = useRef<any>(null);
  const idCounter = useRef(0);

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const fileAlreadyExists = (file: File) =>
    files?.some((value: any) => value?.file?.name === file?.name);

  const handleDeleteAttachment = (file: any) => {
    if (files && file) {
      setFiles([...files.filter((val: any) => file.fileId !== val.fileId)]);
    }
  };

  const simulateUpload = (file: File) => {
    const total = file.size;
    let loaded = 0;
    const uploadSpeed = 50000;

    const interval = setInterval(() => {
      loaded += uploadSpeed;
      if (loaded >= total) {
        loaded = total;
        clearInterval(interval);
      }

      setUploadedSizes((prevSizes: any) => ({
        ...prevSizes,
        [file.name]: loaded,
      }));

      setProgresses((prevProgresses: any) => ({
        ...prevProgresses,
        [file.name]: Math.round((loaded / total) * 100),
      }));
    }, 1000);
  };

  const handleFileUpload = (file: File[]) => {
    const newFile = file[0];
    const fileName = file?.[0]?.name;
    const newFileId = idCounter.current++;

    if (multiple) {
      if (fileAlreadyExists(newFile)) {
        toast(() => (
          <Toast
            subText={messages?.dragDrop?.error?.fileAlreadyUploaded}
            type="error"
          />
        ));
        return;
      }
      if (files?.length) {
        if (files?.length <= 6) {
          setFiles([...files, { fileId: newFileId, file: newFile }]);
        } else {
          toast(() => <Toast subText={"Max. 7 files allowed."} type="error" />);
        }
      } else {
        setFiles([{ fileId: newFileId, file: newFile }]);
      }
    } else {
      setFiles([{ fileId: newFileId, file: newFile }]);
    }

    if (setIsUploadCompleted) {
      setProgresses((prev: any) => ({ ...prev, [fileName]: 0 }));
      setUploadedSizes((prev: any) => ({ ...prev, [fileName]: 0 }));
      setTotalSizes((prev: any) => ({ ...prev, [fileName]: newFile.size }));
      simulateUpload(newFile);
    }
  };

  const handleFile = (files: File[]) => {
    const file = files?.[0];
    const fileType = file?.type;
    const allowedFilesArray: string | string[] = isPdf
      ? "application/pdf"
      : allowedFiles;

    if (fileSizeCheckFunction(file?.size, maxFileSize || 10)) {
      toast(() => (
        <Toast
          subText={`Try uploading a file less than ${maxFileSize || "10"} MB`}
          type="error"
        />
      ));
      return;
    }
    if (!validFileTypeCheckFunction(fileType, allowedFilesArray)) {
      toast(() => (
        <Toast
          subText={
            isPdf
              ? "Try uploading PDF file"
              : messages?.dragDrop?.error?.fileTypeError
          }
          type="error"
        />
      ));
      return;
    }
    if (setIsUploadCompleted) setIsUploadCompleted(false);
    handleFileUpload(files);
  };

  const handleChange = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    setDragActive(false);
    const fileInput = e.target;
    const file = fileInput.files?.[0];

    if (file) {
      handleFile([file]);
      fileInput.value = null;
    }
  };

  const handleDrag = (e: DragEvent<any>) => {
    e.stopPropagation();
    e.preventDefault();
    if (setIsUploadCompleted) setIsUploadCompleted(false);
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer?.files;
    if (file && file.length > 0) {
      handleFile(file);
      inputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (setIsUploadCompleted) {
      if (files?.length === 0) {
        setIsUploadCompleted(false);
      } else if (
        files?.length === 1
          ? uploadedSizes?.[files?.[0]?.file?.name] ===
          totalSizes[files?.[0]?.file?.name]
          : uploadedSizes[0] === totalSizes[0]
      ) {
        setIsUploadCompleted(true);
      }
    }
  }, [uploadedSizes, totalSizes, files]);

  return (
    <StyledDragDropFormContainer>
      <StyledDragDropForm
        padding={orientation === "horizontal" && "16px 0px"}
        isDragActive={dragActive}
        onDragEnter={handleDrag}
        onDrop={handleDrop}
        isHidden={!multiple && files?.length && !requiresDragDrop}
      >
        {orientation === "vertical" ? (
          <Grid
            container
            gap="20px"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <StyledInputFile
              ref={inputRef}
              type="file"
              multiple
              onChange={handleChange}
              accept={acceptedFiles}
            />
            <>
              <Grid item marginTop="26px">
                <StyledFileUploadOutlinedIcon />
              </Grid>
              <Grid item>
                <Grid
                  container
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  gap="10px"
                >
                  <Grid item>
                    <StyledDragDropText>
                      {messages?.dragDrop?.heading}
                    </StyledDragDropText>
                  </Grid>
                  <Grid item>
                    <StyledDragDropSubText>
                      {messages?.dragDrop?.subHeading}
                    </StyledDragDropSubText>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item marginBottom="26px">
                <Button
                  label="Select file"
                  variant="outlined"
                  color="secondary"
                  onClick={onButtonClick}
                />
              </Grid>
            </>
            {dragActive && (
              <StyledDragActiveText
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              />
            )}
          </Grid>
        ) : (
          <Grid
            container
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <StyledInputFile
              ref={inputRef}
              type="file"
              multiple
              onChange={handleChange}
              accept={acceptedFiles}
            />
            <>
              <Grid item marginLeft="26px">
                <Grid container gap="10px" alignItems="center">
                  <Grid item>
                    <StyledFileUploadOutlinedIcon />
                  </Grid>
                  <Grid item>
                    <Grid
                      container
                      display="flex"
                      flexDirection="column"
                      alignItems="unset"
                      gap="4px"
                    >
                      <Grid item>
                        <StyledDragDropText>
                          {messages?.dragDrop?.heading}
                        </StyledDragDropText>
                      </Grid>
                      <Grid item>
                        <StyledDragDropSubText>
                          {messages?.dragDrop?.subHeading}
                        </StyledDragDropSubText>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item marginRight="26px">
                <Button
                  label="Select file"
                  variant="outlined"
                  color="secondary"
                  onClick={onButtonClick}
                />
              </Grid>
            </>
            {dragActive && (
              <StyledDragActiveText
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              />
            )}
          </Grid>
        )}
      </StyledDragDropForm>
      {files && files?.length !== 0 && (
        <StyledAttachmentContainer container width="100%">
          <Grid container gap="5px">
            {files?.map((file: any) => {
              const fileValue = file?.id ? file : file?.file;
              const uploadedSize = formatSize(uploadedSizes[fileValue?.name]);
              const totalSize = formatSize(totalSizes[fileValue?.name]);

              const renderUploadedFile = () =>
                fileValue?.type === "application/pdf" ? (
                  <StyledInsertDriveFileOutlinedIcon />
                ) : (
                  <StyledImageOutlinedIcon />
                );

              const renderUploadedFileType = () =>
                fileValue?.type === "application/pdf" ? (
                  <StyledInsertDriveFileOutlinedIcon />
                ) : (
                  <img
                    src={
                      fileValue?.id
                        ? (fileValue?.resourceUrl ? `${config.baseImageUrl}/${fileValue?.resourceUrl}` : `${config.baseImageUrl}/${fileValue?.url}`)
                        : URL.createObjectURL(fileValue)
                    }
                    alt="attribute"
                    width={!multiple && !requiresDragDrop ? "250px" : "32px"}
                    height={!multiple && !requiresDragDrop ? "250px" : "32px"}
                    style={{
                      objectFit:
                        !multiple && !requiresDragDrop ? "contain" : "unset",
                    }}
                  />
                );

              return (
                <StyledFilesContainer
                  container
                  display="flex"
                  flexDirection={props?.fileContainerWidth ? "row" : "column"}
                  padding="14px"
                  gap="16px"
                  key={file}
                  width={
                    props?.fileContainerWidth
                      ? props?.fileContainerWidth
                      : fileWidth || "fit-content"
                  }
                >
                  <Grid container item xs={12}>
                    <Grid
                      container
                      display="flex"
                      justifyContent="space-between"
                      sx={{ flexWrap: "nowrap" }}
                      xs={12}
                      gap={1}
                    >
                      {setIsUploadCompleted ? (
                        <Grid item xs={10}>
                          <Grid
                            container
                            gap="14px"
                            sx={{ flexWrap: "nowrap" }}
                          >
                            <Grid item display="flex" alignItems="center">
                              {uploadedSize !== totalSize
                                ? renderUploadedFile()
                                : renderUploadedFileType()}
                            </Grid>

                            <Grid item>
                              <Grid
                                container
                                display="flex"
                                flexDirection="column"
                                gap="4px"
                              >
                                <Grid item>
                                  <StyledFileName>
                                    {fileValue?.name}
                                  </StyledFileName>
                                </Grid>
                                <Grid item>
                                  <Grid container gap="4px" alignItems="center">
                                    <Grid item>
                                      <StyledFileSizeText>
                                        {uploadedSize !== totalSize
                                          ? `${uploadedSize || "0 B"
                                          } of ${totalSize}.`
                                          : totalSize}
                                      </StyledFileSizeText>
                                    </Grid>
                                    {uploadedSize !== totalSize && (
                                      <>
                                        <Grid item>
                                          <StyledPendingOutlinedIcon />
                                        </Grid>
                                        <Grid item>
                                          <StyledUploadText>
                                            {messages?.dragDrop?.uploading}
                                          </StyledUploadText>
                                        </Grid>
                                      </>
                                    )}
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      ) : (
                        <Grid container item xs={10}>
                          <Grid
                            container
                            item
                            gap="14px"
                            sx={{ flexWrap: "nowrap" }}
                          >
                            <Grid container item xs={2}>
                              {renderUploadedFileType()}
                            </Grid>
                            {!onlyImageUrl && (
                              <Grid container item>
                                <Grid
                                  container
                                  display="flex"
                                  flexDirection="column"
                                  gap="4px"
                                >
                                  <Grid item>
                                    <StyledFileName>
                                      {fileValue?.name || fileValue?.fileName}
                                    </StyledFileName>
                                  </Grid>
                                  <Grid item>
                                    <StyledFileSizeText>
                                      {formatSize(
                                        fileValue?.size || fileValue?.fileSize
                                      )}
                                    </StyledFileSizeText>
                                  </Grid>
                                </Grid>
                              </Grid>
                            )}
                          </Grid>
                        </Grid>
                      )}
                      <Grid
                        item
                        xs={1}
                        display="flex"
                        justifyContent="flex-end"
                      >
                        <StyledCancelOutlinedIcon
                          onClick={() => {
                            if (props?.onFilesDelete && file?.id) {
                              props?.onFilesDelete(file.id);
                            }
                            handleDeleteAttachment(file);
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  {uploadedSize !== totalSize && setIsUploadCompleted && (
                    <Grid item>
                      <StyledProgressBarContainer>
                        <StyledProgressBar
                          width={progresses?.[fileValue?.name]}
                        />
                      </StyledProgressBarContainer>
                    </Grid>
                  )}
                </StyledFilesContainer>
              );
            })}
          </Grid>
        </StyledAttachmentContainer>
      )}
      {error && <StyledError variant="body2">{error}</StyledError>}
    </StyledDragDropFormContainer>
  );
};

export default DragDropComponent;
