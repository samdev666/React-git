import React, { useEffect, useState } from "react";
import { Container } from "../../../components";
import {
  Button,
  DetailPageWrapper,
  DragDropComponent,
  Form,
  JoditEditorComponent,
  MaterialTextInput,
  SwitchInput,
  Toast,
} from "@wizehub/components";
import messages from "../../../messages";
import { Grid } from "@mui/material";
import { useEntity, useFormReducer } from "@wizehub/common/hooks";
import {
  HttpMethods,
  emptyValueValidator,
  fileSizeCheckFunction,
  required,
} from "@wizehub/common/utils";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import {
  StyledCautionIcon,
  StyledCautionText,
  StyledCautionTextContainer,
  StyledMissionVisionValueFooterContainer,
} from "../styles";
import { useDispatch } from "react-redux";
import { Status } from "@wizehub/common/models/modules";
import { apiCall } from "@wizehub/common/redux/actions";
import {
  MISSION_VISION_VALUE_BY_ID,
  MISSION_VISION_VALUE_REMOVE_IMAGE,
  MISSION_VISION_VALUE_UPLOAD_IMAGE,
} from "../../../api";
import { useLocation } from "react-router-dom";
import { MissionVisionValueEntityInterface } from "@wizehub/common/models/genericEntities";
import { Id } from "@wizehub/common/models";
import { MAX_FILE_SIZE } from "../../../utils/constant";
import { toast } from "react-toastify";
import { goBack, push } from "connected-react-router";
import { routes } from "../../../utils";
import { config } from "../../../config";
import {
  StyledEntitySubTextTypography,
  StyledPlanTextTypography,
} from "../../plan/budgetAndCapacity/styles";

interface FormData {
  templateName: string;
  status: Status;
  mission: string;
  vision: string;
  value: string;
}

const validators = {
  templateName: [
    required(
      messages?.firmProfile?.missionVisionValues?.addNewMissionVisionValue
        ?.validators?.templateName
    ),
    emptyValueValidator,
  ],
  mission: [
    required(
      messages?.firmProfile?.missionVisionValues?.addNewMissionVisionValue
        ?.validators?.mission
    ),
    emptyValueValidator,
  ],
  vision: [
    required(
      messages?.firmProfile?.missionVisionValues?.addNewMissionVisionValue
        ?.validators?.vision
    ),
    emptyValueValidator,
  ],
  value: [
    required(
      messages?.firmProfile?.missionVisionValues?.addNewMissionVisionValue
        ?.validators?.value
    ),
    emptyValueValidator,
  ],
};

const AddNewMissionVisionValues = () => {
  const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
  const { state } = useLocation<{ mvvId: Id }>();
  const [files, setFiles] = useState([]);
  const reduxDispatch = useDispatch();

  const { entity: mvvDetail, refreshEntity } =
    useEntity<MissionVisionValueEntityInterface>(
      MISSION_VISION_VALUE_BY_ID,
      state?.mvvId
    );

  const handleFileUpload = async (id?: Id) => {
    const formData = new FormData();
    formData.append("file", files?.[0]?.file);
    formData.append("mvvId", id ? id.toString() : mvvDetail?.id.toString());
    setFiles(null);
    return new Promise<void>((resolve, reject) => {
      reduxDispatch(
        apiCall(
          MISSION_VISION_VALUE_UPLOAD_IMAGE,
          resolve,
          reject,
          HttpMethods.POST,
          formData,
          { isFormData: true }
        )
      );
    })
      .then(async () => {})
      .catch(() => {
        toast(() => (
          <Toast
            type="error"
            subText={messages?.profile?.editForm?.photoError}
          />
        ));
      });
  };

  const handleDeleteFile = async () =>
    new Promise<void>((resolve, reject) => {
      reduxDispatch(
        apiCall(
          MISSION_VISION_VALUE_REMOVE_IMAGE.replace(
            ":id",
            mvvDetail?.id.toString()
          ),
          resolve,
          reject,
          HttpMethods.DELETE
        )
      );
    })
      .then(async () => {})
      .catch(() => {
        toast(() => (
          <Toast
            type="error"
            subText={messages?.profile?.editForm?.photoError}
          />
        ));
      });

  useEffect(() => {
    change("templateName", mvvDetail?.title);
    change("mission", mvvDetail?.mission);
    change("vision", mvvDetail?.vision);
    change("value", mvvDetail?.values);
    if (mvvDetail?.imageUrl) {
      setFiles([
        {
          id: mvvDetail?.id,
          resourceUrl: `${mvvDetail?.imageUrl}`,
        },
      ]);
    }
    change("status", mvvDetail?.status === Status.active);
  }, [mvvDetail]);
  const { submitting, handleSubmit, connectField, change } =
    useFormReducer(validators);
  const onSubmit = async (data: FormData) => {
    const sanitizedBody = {
      tenantId: tenantId,
      title: data?.templateName,
      mission: data?.mission,
      vision: data?.vision,
      values: data?.value,
      status: data?.status ? Status.active : Status.inactive,
    };
    return new Promise<any>((resolve, reject) => {
      reduxDispatch(
        apiCall(
          state?.mvvId
            ? `${MISSION_VISION_VALUE_BY_ID}/${state.mvvId}`
            : MISSION_VISION_VALUE_BY_ID,
          resolve,
          reject,
          state?.mvvId ? HttpMethods.PATCH : HttpMethods.POST,
          sanitizedBody
        )
      );
    })
      .then(async (res) => {
        if (
          res?.data?.id &&
          state?.mvvId &&
          files[0]?.resourceUrl !== (mvvDetail?.imageUrl ?? undefined)
        ) {
          await handleDeleteFile();
        }

        if (
          res?.data?.id &&
          files.length &&
          files[0]?.resourceUrl !== (mvvDetail?.imageUrl ?? null)
        ) {
          await handleFileUpload(res?.data?.id);
        }
        reduxDispatch(push(routes.firmProfile.missionVisionValues));
        return toast(() => (
          <Toast
            subText={
              messages?.firmProfile?.missionVisionValues
                ?.addNewMissionVisionValue?.success?.[
                state?.mvvId ? "updated" : "created"
              ]
            }
          />
        ));
      })
      .catch((err) => {
        toast(
          <Toast
            text={
              messages?.firmProfile?.missionVisionValues
                ?.addNewMissionVisionValue?.error?.serverError?.[err?.message]
            }
            type="error"
          />
        );
      });
  };
  return (
    <Container noPadding>
      <Form
        onSubmit={handleSubmit(onSubmit)}
        style={{ margin: "0px", gap: "8px" }}
      >
        <DetailPageWrapper
          heading={
            messages?.firmProfile?.missionVisionValues
              ?.addNewMissionVisionValue?.[
              state?.mvvId ? "editHeading" : "heading"
            ]
          }
          cardHeading={
            messages?.firmProfile?.missionVisionValues?.addNewMissionVisionValue
              ?.generalInformation
          }
          cardContent={[
            {
              value: connectField("templateName", {
                label:
                  messages?.firmProfile?.missionVisionValues
                    ?.addNewMissionVisionValue?.templateName,
              })(MaterialTextInput),
              gridWidth: 12,
            },
            {
              value: (
                <Grid
                  container
                  item
                  xs={12}
                  gap={2}
                  display="flex"
                  flexDirection="column"
                >
                  <StyledPlanTextTypography>
                    {
                      messages?.firmProfile?.missionVisionValues
                        ?.addNewMissionVisionValue?.mission
                    }
                  </StyledPlanTextTypography>
                  {connectField("mission")(JoditEditorComponent)}
                </Grid>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <Grid
                  container
                  item
                  xs={12}
                  gap={2}
                  display="flex"
                  flexDirection="column"
                >
                  <StyledPlanTextTypography>
                    {
                      messages?.firmProfile?.missionVisionValues
                        ?.addNewMissionVisionValue?.vision
                    }
                  </StyledPlanTextTypography>
                  {connectField("vision")(JoditEditorComponent)}
                </Grid>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <Grid
                  container
                  item
                  xs={12}
                  gap={2}
                  display="flex"
                  flexDirection="column"
                >
                  <StyledPlanTextTypography>
                    {
                      messages?.firmProfile?.missionVisionValues
                        ?.addNewMissionVisionValue?.values
                    }
                  </StyledPlanTextTypography>
                  {connectField("value")(JoditEditorComponent)}
                </Grid>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <Grid
                  container
                  item
                  xs={12}
                  gap={2}
                  display="flex"
                  flexDirection="column"
                >
                  <StyledEntitySubTextTypography>
                    {
                      messages?.firmProfile?.missionVisionValues
                        ?.addNewMissionVisionValue?.imageUpload
                    }
                  </StyledEntitySubTextTypography>
                  {connectField("fileUpload", {
                    files,
                    setFiles,
                    orientation: "horizontal",
                    multiple: false,
                    onlyImageUrl: true,
                  })(DragDropComponent)}
                </Grid>
              ),
              gridWidth: 12,
            },
            {
              value: (
                <StyledMissionVisionValueFooterContainer container>
                  <Grid item xs={1.2} display="flex">
                    {connectField("status", {
                      label:
                        messages?.firmProfile?.missionVisionValues
                          ?.addNewMissionVisionValue?.status,
                    })(SwitchInput)}
                  </Grid>
                  <Grid item>
                    <StyledCautionTextContainer>
                      <StyledCautionIcon />
                      <StyledCautionText>
                        {
                          messages?.firmProfile?.missionVisionValues
                            ?.addNewMissionVisionValue?.discalimerText
                        }
                      </StyledCautionText>
                    </StyledCautionTextContainer>
                  </Grid>
                </StyledMissionVisionValueFooterContainer>
              ),
              gridWidth: 12,
            },
          ]}
          hasGoBackIcon={true}
        />
        <Grid
          container
          padding="14px 24px"
          gap="15px"
          justifyContent="flex-end"
        >
          <Button
            label={
              messages?.firmProfile?.missionVisionValues
                ?.addNewMissionVisionValue?.cancel
            }
            variant="outlined"
            color="secondary"
            onClick={() => reduxDispatch(goBack())}
            disabled={submitting}
          />
          <Button
            label={
              messages?.firmProfile?.missionVisionValues
                ?.addNewMissionVisionValue?.[state?.mvvId ? "update" : "add"]
            }
            variant="contained"
            color="primary"
            type="submit"
            disabled={submitting}
          />
        </Grid>
      </Form>
    </Container>
  );
};

export default AddNewMissionVisionValues;
