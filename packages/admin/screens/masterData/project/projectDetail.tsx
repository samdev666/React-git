import React from "react";
import { Grid } from "@mui/material";
import { Button, Card, Modal, Stepper } from "@wizehub/components";
import { usePopupReducer, useEntity } from "@wizehub/common/hooks";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { formatStatus } from "@wizehub/components/table";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { UserActionConfig, UserActionType } from "@wizehub/common/models";
import { ProjectManagementEntity } from "@wizehub/common/models/genericEntities";
import { useSelector } from "react-redux";
import { StyledResponsiveIcon } from "@wizehub/components/table/styles";
import { capitalizeLegend } from "@wizehub/common/utils";
import ProjectForm from "./projectForm";
import {
  StyledDetailChildren,
  StyledDetailHeading,
  StyledDetailHeadingContainer,
  StyledDetailTableContent,
  StyledDetailTableHeading,
  StyledHeadingTypography,
} from "../../userManagement/styles";
import {
  StyledApplicationAnchorTag,
  StyledProjectAttachmentContainer,
  StyledProjectAttachmentImage,
  StyledProjectAttachmentName,
  StyledProjectAttachmentSize,
  StyledProjectManagementHeadingContainer,
  StyledProjectManagementLeftHeadingContainer,
} from "../styles";
import { PROJECT_BY_ID } from "../../../api";
import messages from "../../../messages";
import { Container } from "../../../components";
import { ReduxState } from "../../../redux/reducers";
import { Right } from "../../../redux/reducers/auth";
import { greyScaleColour } from "@wizehub/common/theme/style.palette";
import { config } from "../../../config";

export const ResponsiveDeleteIcon = StyledResponsiveIcon(
  DeleteOutlineOutlinedIcon
);

export const ResponsiveEditIcon = StyledResponsiveIcon(EditOutlinedIcon);

const ProjectDetail: React.FC = () => {
  const { entity: projectDetail, refreshEntity } =
    useEntity<ProjectManagementEntity>(PROJECT_BY_ID);
  const auth = useSelector((state: ReduxState) => state.auth);

  const disabledItems = auth.rights.some((item) => item === Right.PROJECTS);

  const {
    visibility: editFormVisibility,
    showPopup: showEditForm,
    hidePopup: hideEditForm,
    metaData: editConfig,
  } = usePopupReducer<UserActionConfig>();

  return (
    <Container noPadding>
      <StyledProjectManagementHeadingContainer>
        <StyledProjectManagementLeftHeadingContainer>
          <Stepper />
          <StyledHeadingTypography>
            {messages.projectManagement.projectDetail.heading}
          </StyledHeadingTypography>
        </StyledProjectManagementLeftHeadingContainer>
        {disabledItems && (
          <Button
            startIcon={<ResponsiveEditIcon />}
            variant="outlined"
            color="secondary"
            label={messages.projectManagement.projectDetail.buttonText}
            onClick={() =>
              showEditForm({
                type: UserActionType.EDIT,
              })
            }
          />
        )}
      </StyledProjectManagementHeadingContainer>
      <Card noHeader cardCss={{ margin: "0 20px" }}>
        <Grid container>
          <StyledDetailHeadingContainer
            container
            item
            alignItems="center"
            justifyContent="space-between"
          >
            <StyledDetailHeading>
              {messages.projectManagement.projectDetail.generalInformation}
            </StyledDetailHeading>
          </StyledDetailHeadingContainer>
          <StyledDetailChildren container item>
            <Grid container item xs={12} gap="32px">
              <Grid item xs={4}>
                <StyledDetailTableHeading>
                  {messages.projectManagement.projectDetail.title}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {projectDetail?.title ? projectDetail?.title : "-"}
                </StyledDetailTableContent>
              </Grid>
              <Grid item xs={2}>
                <StyledDetailTableHeading>
                  {messages.projectManagement.projectDetail.stage}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {projectDetail?.stage
                    ? capitalizeLegend(projectDetail?.stage?.name)
                    : "-"}
                </StyledDetailTableContent>
              </Grid>
              <Grid item xs={2}>
                <StyledDetailTableHeading>
                  {messages.projectManagement.projectDetail.division}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {projectDetail?.division
                    ? projectDetail?.division?.name
                    : "-"}
                </StyledDetailTableContent>
              </Grid>
              <Grid item xs={2}>
                <StyledDetailTableHeading>
                  {messages.projectManagement.projectDetail.status}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {projectDetail?.status
                    ? formatStatus(projectDetail?.status)
                    : "-"}
                </StyledDetailTableContent>
              </Grid>
              <Grid item xs={12}>
                <StyledDetailTableHeading>
                  {messages.projectManagement.projectDetail.description}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {projectDetail?.description
                    ? `${projectDetail?.description}`
                    : "-"}
                </StyledDetailTableContent>
              </Grid>
              {projectDetail?.links?.length ? (
                <Grid item xs={12}>
                  <StyledDetailTableHeading>
                    {messages.projectManagement.projectDetail.links}
                  </StyledDetailTableHeading>
                  {projectDetail?.links?.map(({ link, title }) => (
                    <StyledDetailTableContent mb={1}>
                      <StyledApplicationAnchorTag
                        href={
                          link?.includes("https://") ||
                          link?.includes("http://")
                            ? link
                            : `https://${link}`
                        }
                        target="_blank"
                      >
                        {title}
                      </StyledApplicationAnchorTag>
                    </StyledDetailTableContent>
                  ))}
                </Grid>
              ) : null}
              {projectDetail?.documents?.length ? (
                <Grid item xs={12}>
                  <StyledDetailTableHeading>
                    {messages.projectManagement.projectDetail.attachments}
                  </StyledDetailTableHeading>
                  <Grid container item xs={12} gap={1}>
                    {projectDetail?.documents?.map((docs) => (
                      <StyledProjectAttachmentContainer container item xs={3}>
                        <Grid container item xs={2}>
                          <StyledProjectAttachmentImage
                            src={`${config.baseImageUrl}/${docs?.url}`}
                          />
                        </Grid>
                        <Grid container item xs>
                          <Grid item xs={12}>
                            <StyledProjectAttachmentName>
                              {docs?.name}
                            </StyledProjectAttachmentName>
                          </Grid>
                          <Grid item xs={12}>
                            <StyledProjectAttachmentSize>
                              {(Number(docs?.size) / 1024 / 1024).toFixed(2)} MB
                            </StyledProjectAttachmentSize>
                          </Grid>
                        </Grid>
                      </StyledProjectAttachmentContainer>
                    ))}
                  </Grid>
                </Grid>
              ) : null}
            </Grid>
          </StyledDetailChildren>
        </Grid>
      </Card>
      <Modal
        show={editFormVisibility}
        heading={messages?.projectManagement?.form?.editProject}
        onClose={hideEditForm}
        fitContent
      >
        <ProjectForm
          isUpdate={editConfig?.type === UserActionType.EDIT}
          onCancel={hideEditForm}
          onSuccess={() => {
            hideEditForm();
            refreshEntity();
          }}
          projectManagement={projectDetail}
        />
      </Modal>
    </Container>
  );
};

export default ProjectDetail;
