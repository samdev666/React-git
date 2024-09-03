import React from "react";
import { Container } from "../../components";
import { Card, DetailPageWrapper, Modal, Toast } from "@wizehub/components";
import messages from "../../messages";
import { ResponsiveDeleteIcon, ResponsiveEditIcon } from "../systemPreferences/launchPadSetup/launchPadSetupDetail";
import Table from "@wizehub/components/table";
import { useEntity, usePopupReducer } from "@wizehub/common/hooks";
import { PoliciesAndProceduresEntity, PolicyProcedureDocumentEntity } from "@wizehub/common/models/genericEntities";
import { Grid } from "@mui/material";
import { renderFiles } from "../leadManagement/leadBoard/clientDetails";
import { POLICIES_AND_PROCEDURES_API } from "../../api";
import { goBack, push } from "connected-react-router";
import { useDispatch } from "react-redux";
import { routes } from "../../utils";
import DeleteCTAForm from "../systemPreferences/launchPadSetup/deleteCTAForm";
import { toast } from "react-toastify";
import { capitalizeLegend, dateFormatterFunction, HttpMethods } from "@wizehub/common/utils";
import { UserActionConfig } from "@wizehub/common/models";
import { formatPolicyProcedureStatus } from "./policyProcedureCommonScreen";
import { StyledPolicyAnchorTag } from "./styles";

interface Props {

}

const formatLink = (link: string) => (
    <StyledPolicyAnchorTag
        href={
            link?.includes('https://')
                || link?.includes('http://')
                ? link
                : `https://${link}`
        }
        target="_blank"
    >
        {link}
    </StyledPolicyAnchorTag>
);

const PolicyDetails: React.FC<Props> = () => {
    const { entity: policiesAndProcedures, refreshEntity } =
        useEntity<PoliciesAndProceduresEntity>(POLICIES_AND_PROCEDURES_API);

    const reduxDispatch = useDispatch();

    const {
        visibility: deleteFormVisibility,
        showPopup: showDeleteForm,
        hidePopup: hideDeleteForm,
    } = usePopupReducer<UserActionConfig>();

    return (
        <Container noPadding>
            <DetailPageWrapper
                hasGoBackIcon
                heading={messages?.execute?.policiesAndProcedures?.details?.heading}
                cardHeading={messages?.execute?.policiesAndProcedures?.details?.generalInformation}
                headingActionButtons={
                    [
                        {
                            color: "secondary",
                            variant: "outlined",
                            label: messages?.settings?.systemPreferences?.launchPadSetup?.detail
                                ?.button,
                            onClick: () => {
                                reduxDispatch(
                                    push({
                                        pathname: `${routes.policiesAndProcedures.root}/edit`,
                                        state: { policyProcedureData: policiesAndProcedures }
                                    })
                                )
                            },
                            startIcon: <ResponsiveEditIcon />,
                        },
                    ]
                }
                cardContent={[
                    {
                        heading: messages?.execute?.policiesAndProcedures?.details?.policyNumber,
                        value: policiesAndProcedures?.number,
                        gridWidth: 2,
                        isTypography: true,
                    },
                    {
                        heading: messages?.execute?.policiesAndProcedures?.policyName,
                        value: policiesAndProcedures?.name,
                        gridWidth: 3,
                        isTypography: true,
                    },
                    {
                        heading: messages?.execute?.policiesAndProcedures?.details?.dateUpdated,
                        value: dateFormatterFunction(policiesAndProcedures?.updatedOn, 'DD MMMM YYYY'),
                        gridWidth: 2,
                        isTypography: true,
                    },
                    {
                        heading: messages?.execute?.policiesAndProcedures?.author,
                        value: `${policiesAndProcedures?.author?.firstName || ''} ${policiesAndProcedures?.author?.lastName || ''}`,
                        gridWidth: 2,
                        isTypography: true,
                    },
                    {
                        heading: messages?.settings?.systemPreferences?.launchPadSetup?.status,
                        value: formatPolicyProcedureStatus(policiesAndProcedures?.status),
                        gridWidth: 3,
                        isTypography: true,
                    },
                    {
                        heading: messages?.execute?.policiesAndProcedures?.details?.division,
                        value: policiesAndProcedures?.division?.name,
                        gridWidth: 2,
                        isTypography: true,
                    },
                    {
                        heading: messages?.execute?.policiesAndProcedures?.details?.searchableKeywords,
                        value: policiesAndProcedures?.keywords,
                        gridWidth: 4,
                        isTypography: true,
                    },
                    {
                        heading: messages?.execute?.policiesAndProcedures?.details?.description,
                        value: policiesAndProcedures?.description,
                        gridWidth: 12,
                        isTypography: true,
                    },
                    {
                        heading: messages?.execute?.policiesAndProcedures?.details?.links,
                        value: (
                            <Card
                                noHeader
                            >
                                <Table
                                    specs={[
                                        {
                                            id: "name",
                                            label: messages?.execute?.policiesAndProcedures?.details?.resourceName,
                                            getValue: (row) => row?.name
                                        },
                                        {
                                            id: "link",
                                            label: messages?.execute?.policiesAndProcedures?.details?.resourceLink,
                                            getValue: (row) => row,
                                            format: (row) => formatLink(row?.link)
                                        }
                                    ]}
                                    data={policiesAndProcedures ? policiesAndProcedures?.links : []}
                                    disableSorting={['resourceLink']}
                                />
                            </Card>
                        ),
                        gridWidth: 12,
                    },
                    {
                        heading: messages?.execute?.policiesAndProcedures?.details?.video,
                        value: (
                            <Card
                                noHeader
                            >
                                <Table
                                    specs={[
                                        {
                                            id: "name",
                                            label: messages?.execute?.policiesAndProcedures?.details?.videoDisplayName,
                                            getValue: (row) => row?.name,
                                        },
                                        {
                                            id: "link",
                                            label: messages?.execute?.policiesAndProcedures?.details?.videoLink,
                                            getValue: (row) => row,
                                            format: (row) => formatLink(row?.link)
                                        },
                                        {
                                            id: "type",
                                            label: messages?.execute?.policiesAndProcedures?.details?.videoType,
                                            getValue: (row) => capitalizeLegend(row?.type),
                                        },
                                    ]}
                                    data={policiesAndProcedures ? policiesAndProcedures?.videos : []}
                                    disableSorting={['videoLink', 'videoType']}
                                />
                            </Card>
                        ),
                        gridWidth: 12,
                    },
                    {
                        heading: policiesAndProcedures?.documents?.length
                            ? messages?.execute?.policiesAndProcedures?.details?.document : '',
                        value: policiesAndProcedures?.documents?.length
                            ? (
                                <Grid container display={"flex"} gap="8px">
                                    {policiesAndProcedures?.documents?.map((val: PolicyProcedureDocumentEntity) => (
                                        <Grid item minWidth={"262px"}>
                                            {renderFiles(val?.resourceUrl, val?.fileName, val?.fileSize)}
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : null,
                        gridWidth: policiesAndProcedures?.documents?.length ? 12 : 0,
                    }
                ]}
                footerActionButton={[
                    {
                        startIcon: <ResponsiveDeleteIcon />,
                        variant: "contained",
                        color: "error",
                        label: messages?.execute?.policiesAndProcedures?.form?.deletePolicy,
                        onClick: () => showDeleteForm(),
                    },
                ]}
                detailedGridGap={4}
            />
            <Modal
                show={deleteFormVisibility}
                heading={messages?.execute?.policiesAndProcedures?.form?.deactivatePolicy}
                onClose={hideDeleteForm}
                fitContent
            >
                <DeleteCTAForm
                    onCancel={hideDeleteForm}
                    onSuccess={() => {
                        hideDeleteForm();
                        toast(
                            <Toast
                                text={messages?.execute?.policiesAndProcedures?.form?.success?.deactivated}
                            />
                        );
                        reduxDispatch(goBack());
                    }}
                    api={`${POLICIES_AND_PROCEDURES_API}/${policiesAndProcedures?.id}`}
                    bodyText={messages?.execute?.policiesAndProcedures?.form?.deactivatePolicyNote}
                    cancelButton={messages?.firmProfile?.people?.form?.cancel}
                    confirmButton={messages?.execute?.policiesAndProcedures?.form?.deletePolicy}
                    apiMethod={HttpMethods.DELETE}
                />
            </Modal>
        </Container>
    )
};

export default PolicyDetails;