import React, { useEffect, useState } from "react";
import { Container } from "../../../components";
import { routes } from "../../../utils";
import { Button, Card, DetailPageWrapper, Modal, Toast } from "@wizehub/components";
import { Grid, Typography } from "@mui/material";
import { ResponsiveEditIcon } from "../../systemPreferences/launchPadSetup/launchPadSetupDetail";
import messages from "../../../messages";
import {
    StyledAddText,
    StyledClientDetailContainer,
    StyledClientDetailHeading,
    StyledClientDetailsModalInfoHeading,
    StyledClientDetailSubHeading,
    StyledDetailTable,
    StyledFilesContainer,
    StyledIconContainer,
    StyledMeetingAgendaAddMoreIcon,
    StyledNoteDate,
    StyledNotesHeading,
    StyledSeparator
} from "./styles";
import {
    StyledCancelOutlinedIcon,
    StyledFileName,
    StyledFileSizeText
} from "@wizehub/components/dragAndDrop/styles";
import { useDispatch } from "react-redux";
import { goBack, push } from "connected-react-router";
import { useLocation, useParams } from "react-router-dom";
import { apiCall } from "../../../redux/actions";
import { dateFormatterFunction, formatCurrency, HttpMethods, monthFunction, nullablePlaceHolder } from "@wizehub/common/utils";
import { LEAD_PROGRESS_API, LEAD_PROGRESSS_LISTING_API, NOTES_API, NOTES_LISTING_API, TENANT_CLIENT } from "../../../api";
import { config } from "../../../config";
import { formatSize } from "@wizehub/components/dragAndDrop";
import {
    ClientEntity,
    DocumentEntity,
    LeadProgressEntity,
    NoteEntity
} from "@wizehub/common/models/genericEntities";
import {
    StyledDetailChildren,
    StyledDetailHeading,
    StyledDetailHeadingContainer,
    StyledDetailTableContent,
    StyledDetailTableHeading,
    StyledHeadingTypography,
    StyledIconButton,
    StyledMainHeadingButtonContainer,
    StyledMainHeadingContainer,
    StyledMainLeftHeadingContainer
} from "@wizehub/components/detailPageWrapper/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Table from "@wizehub/components/table";
import { StyledEditIcon } from "@wizehub/components/table/styles";
import { StyledDeleteIcon } from "../../marketingResults/styles";
import { usePopupReducer } from "@wizehub/common/hooks";
import AddEditProgressForm from "./addEditProgressForm";
import AddEditNoteForm from "./addEditNoteForm";
import DeleteCTAForm from "../../systemPreferences/launchPadSetup/deleteCTAForm";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import { greyScaleColour } from "@wizehub/common/theme/style.palette";

interface Props {

}

export const renderFiles = (url: string, fileName: string, fileSize: string) => {
    return (
        <StyledFilesContainer container width="292px">
            <Grid item xs={10}>
                <Grid container gap="14px" sx={{ flexWrap: 'nowrap' }}>
                    <StyledIconContainer item>
                        <img
                            src={url ? `${config.baseImageUrl}/${url}` : ''}
                            alt="img"
                            width="32px"
                            height="32px"
                        />
                    </StyledIconContainer>
                    <Grid item>
                        <Grid
                            container
                            display="flex"
                            flexDirection="column"
                            gap="4px"
                        >
                            <Grid item>
                                <StyledFileName>
                                    {fileName}
                                </StyledFileName>
                            </Grid>
                            <Grid item>
                                <StyledFileSizeText>
                                    {formatSize(fileSize)}
                                </StyledFileSizeText>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid
                item
                xs={1}
                display="flex"
                justifyContent="flex-end"
            >
                <StyledCancelOutlinedIcon
                    cursor={"inherit"}
                />
            </Grid>
        </StyledFilesContainer>
    )
}

const ClientDetails: React.FC<Props> = () => {
    const reduxDispatch = useDispatch();
    const location: any = useLocation();

    const { id } = useParams<{ id?: string }>();
    const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
    const [clientData, setClientData] = useState<ClientEntity>(null);
    const [leadProgressData, setLeadProgressData] = useState<any>(null);
    const [notesData, setNotesData] = useState<any>(null);

    const {
        visibility: progressFormVisibility,
        showPopup: showProgressForm,
        hidePopup: hideProgressForm,
        metaData: progressConfig,
    } = usePopupReducer<LeadProgressEntity>();

    const {
        visibility: noteFormVisibility,
        showPopup: showNoteForm,
        hidePopup: hideNoteForm,
        metaData: notesConfig
    } = usePopupReducer<NoteEntity>();

    const {
        visibility: deleteProgressFormVisibility,
        showPopup: showDeleteProgressForm,
        hidePopup: hideDeleteProgressForm,
        metaData: deleteProgressConfig,
    } = usePopupReducer<LeadProgressEntity>();

    const {
        visibility: deleteNoteFormVisibility,
        showPopup: showDeleteNoteForm,
        hidePopup: hideDeleteNoteForm,
        metaData: deleteNotesConfig,
    } = usePopupReducer<NoteEntity>();

    const getClientDataById = async () => {
        return new Promise<void>((resolve, reject) => {
            reduxDispatch(
                apiCall(
                    `${TENANT_CLIENT}/${id}`,
                    resolve,
                    reject,
                    HttpMethods.GET
                )
            );
        })
            .then((res: any) => {
                setClientData(res);
            })
            .catch((error) => {
                console.log(error?.message)
            });
    }

    const getLeadProgressData = async () => {
        return new Promise<void>((resolve, reject) => {
            reduxDispatch(
                apiCall(
                    `${LEAD_PROGRESSS_LISTING_API.replace(':tenantId', tenantId).replace(':clientId', id)}`,
                    resolve,
                    reject,
                    HttpMethods.GET
                )
            );
        })
            .then((res: any) => {
                setLeadProgressData(res);
            })
            .catch((error) => {
                console.log(error?.message)
            });
    }

    const getNotesData = async () => {
        return new Promise<void>((resolve, reject) => {
            reduxDispatch(
                apiCall(
                    `${NOTES_LISTING_API.replace(':tenantId', tenantId).replace(':clientId', id)}`,
                    resolve,
                    reject,
                    HttpMethods.GET
                )
            );
        })
            .then((res: any) => {
                setNotesData(res);
            })
            .catch((error) => {
                console.log(error?.message)
            });
    }

    useEffect(() => {
        getClientDataById();
        getLeadProgressData();
        getNotesData();
    }, [])

    return (
        <Container
            noPadding
        >
            <StyledMainHeadingContainer>
                <StyledMainLeftHeadingContainer hasGoBackIcon={true}>
                    <StyledIconButton onClick={() => reduxDispatch(goBack())}>
                        <ArrowBackIcon />
                    </StyledIconButton>
                    <StyledHeadingTypography>
                        {clientData?.businessName}
                    </StyledHeadingTypography>
                </StyledMainLeftHeadingContainer>
                <StyledMainHeadingButtonContainer>
                    <Button
                        startIcon={<ResponsiveEditIcon />}
                        variant="outlined"
                        color="secondary"
                        label={messages?.firmProfile?.firmDetails?.button}
                        onClick={() => {
                            reduxDispatch(push({
                                pathname: `${routes.leadManagement.root}/edit`,
                                state: {
                                    type: clientData?.leadStage?.name,
                                    clientId: id,
                                    clientData
                                }
                            }))
                        }}
                    />
                </StyledMainHeadingButtonContainer>
            </StyledMainHeadingContainer>

            <Card noHeader cardCss={{ margin: "0 20px" }}>
                <Grid container>
                    <StyledDetailHeadingContainer
                        container
                        item
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <StyledDetailHeading>
                            {messages?.firmProfile?.firmDetails?.generalInformation}
                        </StyledDetailHeading>
                    </StyledDetailHeadingContainer>
                    <StyledDetailChildren container item>
                        <Grid container xs={12} columnGap={4} rowGap={3}>
                            <Grid item xs={2}>
                                <StyledDetailTableHeading>
                                    {messages?.leadManagement?.labels?.clientName}
                                </StyledDetailTableHeading>
                                <StyledDetailTableContent>
                                    {clientData?.name || '-'}
                                </StyledDetailTableContent>
                            </Grid>
                            <Grid item xs={2}>
                                <StyledDetailTableHeading>
                                    {messages?.leadManagement?.labels?.businessName}
                                </StyledDetailTableHeading>
                                <StyledDetailTableContent>
                                    {clientData?.businessName}
                                </StyledDetailTableContent>
                            </Grid>
                            <Grid item xs={2}>
                                <StyledDetailTableHeading>
                                    {messages?.leadManagement?.labels?.mobileNumber}
                                </StyledDetailTableHeading>
                                <StyledDetailTableContent>
                                    {(clientData?.dialCode && clientData?.phoneNumber)
                                        ? `(${clientData?.dialCode}) ${clientData?.phoneNumber}`
                                        : '-'}
                                </StyledDetailTableContent>
                            </Grid>
                            <Grid item xs={2}>
                                <StyledDetailTableHeading>
                                    {messages?.signup?.form?.email}
                                </StyledDetailTableHeading>
                                <StyledDetailTableContent>
                                    {clientData?.email || '-'}
                                </StyledDetailTableContent>
                            </Grid>
                            <Grid item xs={2}>
                                <StyledDetailTableHeading>
                                    {messages?.leadManagement?.labels?.allocatedClientManager}
                                </StyledDetailTableHeading>
                                <StyledDetailTableContent>
                                    {`${clientData?.clientManager?.firstName || '-'} ${clientData?.clientManager?.lastName || '-'}`}
                                </StyledDetailTableContent>
                            </Grid>
                            <Grid item xs={2}>
                                <StyledDetailTableHeading>
                                    {messages?.leadManagement?.labels?.dateLeadFound}
                                </StyledDetailTableHeading>
                                <StyledDetailTableContent>
                                    {clientData?.leadFoundOn
                                        ? dateFormatterFunction(clientData?.leadFoundOn, "DD/MM/YYYY")
                                        : '-'}
                                </StyledDetailTableContent>
                            </Grid>
                            <Grid item xs={12}>
                                <StyledSeparator />
                            </Grid>
                            <Grid item xs={2}>
                                <StyledDetailTableHeading>
                                    {messages?.leadManagement?.labels?.annualFeesDollar}
                                </StyledDetailTableHeading>
                                <StyledDetailTableContent>
                                    {formatCurrency(clientData?.annualFee) || '-'}
                                </StyledDetailTableContent>
                            </Grid>
                            <Grid item xs={2}>
                                <StyledDetailTableHeading>
                                    {messages?.leadManagement?.labels?.referralSource}
                                </StyledDetailTableHeading>
                                <StyledDetailTableContent>
                                    {clientData?.leadSource?.name || '-'}
                                </StyledDetailTableContent>
                            </Grid>
                            <Grid item xs={2}>
                                <StyledDetailTableHeading>
                                    {messages?.leadManagement?.labels?.referrer}
                                </StyledDetailTableHeading>
                                <StyledDetailTableContent>
                                    {clientData?.referredBy || '-'}
                                </StyledDetailTableContent>
                            </Grid>
                            <Grid item xs={2}>
                                <StyledDetailTableHeading>
                                    {messages?.leadManagement?.labels?.industry}
                                </StyledDetailTableHeading>
                                <StyledDetailTableContent>
                                    {clientData?.leadIndustry?.name || '-'}
                                </StyledDetailTableContent>
                            </Grid>
                            <Grid item xs={2}>
                                <StyledDetailTableHeading>
                                    {messages?.settings?.systemPreferences?.leadIndustrySetup?.status}
                                </StyledDetailTableHeading>
                                <StyledDetailTableContent>
                                    {clientData?.status || '-'}
                                </StyledDetailTableContent>
                            </Grid>
                            <Grid item xs={2}>
                                <StyledDetailTableHeading>
                                    {messages?.leadManagement?.labels?.clientClass}
                                </StyledDetailTableHeading>
                                <StyledDetailTableContent>
                                    {clientData?.class?.name || '-'}
                                </StyledDetailTableContent>
                            </Grid>
                            {clientData?.isAppointmentBooked &&
                                <Grid item xs={2}>
                                    <StyledDetailTableHeading>
                                        {messages?.leadManagement?.labels?.appointmentBooked}
                                    </StyledDetailTableHeading>
                                    <StyledDetailTableContent>
                                        {`${monthFunction(clientData?.appointmentMonth)?.label} ${clientData?.appointmentYear}`}
                                    </StyledDetailTableContent>
                                </Grid>}
                            <Grid item xs={12}>
                                <StyledDetailTableHeading>
                                    {messages?.leadManagement?.labels?.leadDetails}
                                </StyledDetailTableHeading>
                                <StyledDetailTableContent>
                                    {clientData?.leadDetails || '-'}
                                </StyledDetailTableContent>
                            </Grid>
                            {clientData?.documents?.length
                                ? <>
                                    <Grid item xs={12}>
                                        <StyledSeparator />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container display={"flex"} gap="10px">
                                            {clientData?.documents?.map((val: DocumentEntity) => (
                                                <Grid item minWidth={"262px"}>
                                                    {renderFiles(val?.resourceUrl, val?.fileName, val?.fileSize?.toString())}
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Grid>
                                </>
                                : <></>
                            }
                        </Grid>
                    </StyledDetailChildren>
                </Grid>
            </Card>

            {location?.state?.showLeadData &&
                <>
                    <Card noHeader cardCss={{ margin: "20px 20px 0px 20px" }}>
                        <Grid container>
                            <StyledDetailHeadingContainer
                                container
                                item
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <StyledDetailHeading>
                                    {messages?.leadManagement?.details?.leadProgessInformation?.heading}
                                </StyledDetailHeading>
                            </StyledDetailHeadingContainer>
                            <StyledDetailTable container item>
                                <Grid container display={"flex"} justifyContent={"space-between"} alignItems="center">
                                    <Grid item>
                                        <Typography>
                                            {`${messages?.leadManagement?.details?.leadProgessInformation?.labels?.totalProgress} (${leadProgressData?.records?.length || 0})`}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Grid container display={"flex"} alignItems="center" gap={"2px"} style={{ cursor: 'pointer' }} onClick={() => showProgressForm()}>
                                            <Grid item>
                                                <StyledMeetingAgendaAddMoreIcon />
                                            </Grid>
                                            <Grid item>
                                                <StyledAddText>
                                                    {messages?.leadManagement?.details?.leadProgessInformation?.labels?.addProgress}
                                                </StyledAddText>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Card
                                    noHeader
                                >
                                    <Table
                                        specs={[
                                            {
                                                id: 'leadStatus',
                                                label: messages?.leadManagement?.details?.leadProgessInformation?.labels?.actionStep,
                                                getValue: (row: any) => row?.leadStatus?.name
                                            },
                                            {
                                                id: 'status',
                                                label: 'Status',
                                                getValue: (row: any) => row?.status
                                            },
                                            {
                                                id: 'actionBy',
                                                label: messages?.leadManagement?.details?.leadProgessInformation?.labels?.who,
                                                getValue: (row: any) => (row?.actionBy?.firstName && row?.actionBy?.lastName) &&
                                                    `${row?.actionBy?.firstName} ${row?.actionBy?.lastName}`
                                            }
                                        ]}
                                        data={leadProgressData?.records || []}
                                        metadata={leadProgressData?.metadata}
                                        actions={[
                                            {
                                                id: 'delete',
                                                component: <StyledDeleteIcon />,
                                                onClick: (row: any) => showDeleteProgressForm({
                                                    id: row?.id
                                                }),
                                            },
                                            {
                                                id: 'edit',
                                                component: <StyledEditIcon />,
                                                onClick: (row: any) => showProgressForm({
                                                    id: row?.id
                                                }),
                                            }
                                        ]}
                                    />
                                </Card>
                            </StyledDetailTable>
                        </Grid>
                    </Card>

                    <Card noHeader cardCss={{ margin: "20px 20px 20px 20px" }}>
                        <Grid container>
                            <StyledDetailHeadingContainer
                                container
                                item
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <StyledDetailHeading>
                                    {messages?.leadManagement?.details?.notes?.heading}
                                </StyledDetailHeading>
                            </StyledDetailHeadingContainer>
                            <StyledDetailTable container item>
                                <Grid container display={"flex"} justifyContent={"space-between"} alignItems="center">
                                    <Grid item>
                                        <Typography>
                                            {`${messages?.leadManagement?.details?.notes?.labels?.totalNotes} (${notesData?.records?.length || 0})`}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Grid container display={"flex"} alignItems="center" gap={"2px"} style={{ cursor: 'pointer' }} onClick={() => showNoteForm()}>
                                            <Grid item>
                                                <StyledMeetingAgendaAddMoreIcon />
                                            </Grid>
                                            <Grid item>
                                                <StyledAddText>
                                                    {messages?.leadManagement?.details?.notes?.labels?.addNote}
                                                </StyledAddText>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Card
                                    noHeader
                                    cardCss={{
                                        padding: "20px 24px 20px 24px",
                                        backgroundColor: greyScaleColour.grey60
                                    }}
                                >
                                    {notesData?.records?.map((item: any, index: number) => (
                                        <Grid container display={"flex"} alignItems={"center"}>
                                            <Grid item xs={11}>
                                                <Grid container display={"flex"} flexDirection={"column"} gap="4px">
                                                    <Grid item>
                                                        <StyledNotesHeading>
                                                            {`Note ${index + 1}`}
                                                        </StyledNotesHeading>
                                                    </Grid>
                                                    <Grid item>
                                                        <StyledClientDetailsModalInfoHeading>
                                                            {item?.notes}
                                                        </StyledClientDetailsModalInfoHeading>
                                                    </Grid>
                                                    <Grid item display="flex" justifyContent={"flex-end"}>
                                                        <StyledNoteDate>
                                                            {dateFormatterFunction(item?.updatedOn, 'DD/MM/YYYY')}
                                                        </StyledNoteDate>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={1}>
                                                <Grid container display={"flex"} gap="16px" justifyContent={"flex-end"}>
                                                    <Grid item>
                                                        <StyledDeleteIcon style={{ cursor: 'pointer' }} onClick={() => {
                                                            showDeleteNoteForm({
                                                                id: item?.id
                                                            })
                                                        }} />
                                                    </Grid>
                                                    <Grid item>
                                                        <StyledEditIcon style={{ cursor: 'pointer' }} onClick={() => {
                                                            showNoteForm({
                                                                id: item?.id
                                                            })
                                                        }} />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    ))}
                                </Card>
                            </StyledDetailTable>
                        </Grid>
                    </Card>            </>
            }

            <Modal
                show={progressFormVisibility}
                heading={progressConfig?.id
                    ? messages?.leadManagement?.leadProgress?.form?.headings?.editNewProgress
                    : messages?.leadManagement?.leadProgress?.form?.headings?.addNewProgress}
                onClose={hideProgressForm}
                fitContent
            >
                <AddEditProgressForm
                    onCancel={hideProgressForm}
                    onSuccess={() => {
                        hideProgressForm();
                        getLeadProgressData();
                        toast(() => (
                            <Toast
                                text={progressConfig?.id
                                    ? messages?.leadManagement?.leadProgress?.form?.success?.updated
                                    : messages?.leadManagement?.leadProgress?.form?.success?.created}
                            />
                        ))
                    }}
                    clientId={id}
                    isEdit={!!progressConfig?.id}
                    id={progressConfig?.id}
                />
            </Modal>

            <Modal
                show={noteFormVisibility}
                heading={notesConfig?.id
                    ? messages?.leadManagement?.note?.form?.headings?.editNote
                    : messages?.leadManagement?.note?.form?.headings?.addNewNote}
                onClose={hideNoteForm}
                fitContent
            >
                <AddEditNoteForm
                    onCancel={hideNoteForm}
                    onSuccess={() => {
                        hideNoteForm();
                        getNotesData();
                        toast(() => (
                            <Toast
                                text={notesConfig?.id
                                    ? messages?.leadManagement?.note?.form?.success?.updated
                                    : messages?.leadManagement?.note?.form?.success?.created}
                            />
                        ))
                    }}
                    clientId={id}
                    isEdit={!!notesConfig?.id}
                    id={notesConfig?.id}
                />
            </Modal>

            <Modal
                show={deleteProgressFormVisibility}
                heading={messages?.settings?.accountManagement?.form?.deleteButton}
                onClose={hideDeleteProgressForm}
                fitContent
            >
                <DeleteCTAForm
                    onCancel={hideDeleteProgressForm}
                    onSuccess={() => {
                        hideDeleteProgressForm();
                        getLeadProgressData();
                        toast(() => (
                            <Toast
                                text={messages?.leadManagement?.leadProgress?.form?.success?.deleted}
                            />
                        ))
                    }}
                    api={`${LEAD_PROGRESS_API}/${deleteProgressConfig?.id}`}
                    bodyText={messages?.leadManagement?.leadProgress?.form?.headings?.deleteHeading}
                    cancelButton={messages?.general?.cancel}
                    confirmButton={messages?.settings?.accountManagement?.form?.deleteButton}
                    apiMethod={HttpMethods.DELETE}
                />
            </Modal>

            <Modal
                show={deleteNoteFormVisibility}
                heading={messages?.settings?.accountManagement?.form?.deleteButton}
                onClose={hideDeleteNoteForm}
                fitContent
            >
                <DeleteCTAForm
                    onCancel={hideDeleteNoteForm}
                    onSuccess={() => {
                        hideDeleteNoteForm();
                        getNotesData();
                        toast(() => (
                            <Toast
                                text={messages?.leadManagement?.note?.form?.success?.deleted}
                            />
                        ))
                    }}
                    api={`${NOTES_API}/${deleteNotesConfig?.id}`}
                    bodyText={messages?.leadManagement?.note?.form?.headings?.deleteHeading}
                    cancelButton={messages?.general?.cancel}
                    confirmButton={messages?.settings?.accountManagement?.form?.deleteButton}
                    apiMethod={HttpMethods.DELETE}
                />
            </Modal>
        </Container >
    )
}

export default ClientDetails;