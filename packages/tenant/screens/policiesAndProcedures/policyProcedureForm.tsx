import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { Container } from "../../components";
import { Button, DetailPageWrapper, DragDropComponent, MaterialAutocompleteInput, MaterialTextInput, RecursiveFieldInput, Toast } from "@wizehub/components";
import { useFormReducer, useOptions } from "@wizehub/common/hooks";
import messages from "../../messages";
import { Grid } from "@mui/material";
import { StyledSeparator } from "../leadManagement/leadBoard/styles";
import { goBack } from "connected-react-router";
import { useDispatch } from "react-redux";
import { StyledPolicyAddMoreContainer, StyledPolicyAddMoreIcon, StyledPolicyAddMoreText, StyledPolicyFormLabels } from "./styles";
import { useLocation, useParams } from "react-router-dom";
import { PolicyStatusOptions, VideoOptions } from "../../utils/constant";
import { DIVISION_LISTING_API, PEOPLE_LISTING_API, POLICIES_AND_PROCEDURES_API, POLICIES_AND_PROCEDURES_REMOVE_DOCUMENT_API, POLICIES_AND_PROCEDURES_UPLOAD_DOCUMENT_API } from "../../api";
import { capitalizeLegend, emptyValueValidator, HttpMethods, linkValidator, mapIdFullNameToOption, mapIdNameToOption, required, trimWordWrapper } from "@wizehub/common/utils";
import { AuthorEntity, Division, PersonBasicDetailEntity, PolicyProcedureDivisionEntity, PolicyProcedureDocumentEntity, PolicyProcedureLinkEntity, PolicyProcedureVideoEntity } from "@wizehub/common/models/genericEntities";
import { useSelector } from "react-redux";
import { ReduxState } from "../../redux/reducers";
import { toast } from "react-toastify";
import { apiCall } from "../../redux/actions";
import { Id, Option } from "@wizehub/common/models";

interface FormData {
    policyName: string,
    policyNumber: string,
    author: AuthorEntity;
    division?: PolicyProcedureDivisionEntity;
    status: Option;
    keywords?: string;
    description?: string;
    links: {
        id?: Id;
        resourcename: string;
        resourcelink: string;
    }[];
    video: {
        id?: Id;
        videodisplayname: string;
        videolink: string;
        videotype: Option;
    }[];
    deletedLinks?: Number[];
    deletedVideos?: Number[];
}

const videoFormLayout = [
    [
        {
            value: "Video Link",
            component: MaterialTextInput,
            props: {
                required: true,
            },
        },
    ],
    [
        {
            value: "Video Display Name",
            component: MaterialTextInput,
            props: {
                required: true
            },
        },
        {
            value: "Video Type",
            component: MaterialAutocompleteInput,
            props: {
                options: VideoOptions,
                required: true,
            },
        },
    ],
];

const linksFormLayout = [
    [
        {
            value: "Resource Name",
            component: MaterialTextInput,
            props: {
                required: true,
            },
        },
        {
            value: "Resource Link",
            component: MaterialTextInput,
            props: {
                required: true,
            },
        },
    ],
];

const validators = {
    policyName: [
        required(messages?.execute?.policiesAndProcedures?.form?.validators?.policyNameRequired),
        emptyValueValidator,
    ],
    policyNumber: [
        required(messages?.execute?.policiesAndProcedures?.form?.validators?.policyNumberRequired),
        emptyValueValidator,
    ],
    division: [
        required(messages?.execute?.policiesAndProcedures?.form?.validators?.divisionRequired),
    ],
    author: [
        required(messages?.execute?.policiesAndProcedures?.form?.validators?.authorRequired),
    ],
    status: [
        required(messages?.execute?.policiesAndProcedures?.form?.validators?.statusRequired),
    ],
    keywords: [
        required(messages?.execute?.policiesAndProcedures?.form?.validators?.keywordsRequired),
    ],
    links: {
        resourcename: [
            required(messages?.execute?.policiesAndProcedures?.form?.validators?.resourceNameRequired),
            emptyValueValidator,
        ],
        resourcelink: [
            required(messages?.execute?.policiesAndProcedures?.form?.validators?.resourceLinkRequired),
            linkValidator(messages?.general?.validLink),
        ],
    },
    video: {
        videolink: [
            required(messages?.execute?.policiesAndProcedures?.form?.validators?.videoLinkRequired),
            linkValidator(messages?.general?.validLink),
        ],
        videodisplayname: [
            required(messages?.execute?.policiesAndProcedures?.form?.validators?.videoDisplayNameRequired),
            emptyValueValidator,
        ],
        videotype: [
            required(messages?.execute?.policiesAndProcedures?.form?.validators?.videoTypeRequired),
        ]
    },
}

const PolicyProcedureForm = () => {
    const { tenantData, profile: userProfile } = useSelector((state: ReduxState) => state);
    const location: any = useLocation();
    const policyProcedureData = location?.state?.policyProcedureData;
    const division = location?.state?.division;
    const { action } = useParams<{ action?: string }>();
    const addMoreLinksRef = useRef(null);
    const addMoreVideoRef = useRef(null);
    const [files, setFiles] = useState([]);
    const reduxDispatch = useDispatch();

    const isEdit = action === "edit";

    const initialValues = {
        links: [
            {
                resourcename: "",
                resourcelink: ""
            },
        ],
        video: [
            {
                videolink: "",
                videodisplayname: "",
                videotype: "",
            },
        ],
    };

    const { options: divisionOptions } =
        useOptions<Division>(DIVISION_LISTING_API);

    const {
        options: peopleOptions,
        searchOptions: peopleSearchOptions,
    } = useOptions<PersonBasicDetailEntity>(
        `${PEOPLE_LISTING_API.replace(":tenantId", tenantData?.tenantId)}`,
        true
    );

    const {
        submitting,
        handleSubmit,
        connectField,
        change,
        setSubmitError,
        connectFieldReplicate,
        handleRecursiveChange,
    } = useFormReducer(validators, initialValues);

    const handleAddField = (ref: MutableRefObject<any>, key: string) => {
        if (ref?.current) {
            ref.current?.addItemToGroup(key);
        }
    };

    const renderAddMoreButton = (ref: MutableRefObject<any>, key: string) => (
        <StyledPolicyAddMoreContainer
            onClick={() => handleAddField(ref, key)}
        >
            <StyledPolicyAddMoreIcon />
            <StyledPolicyAddMoreText>
                {
                    messages?.settings?.systemPreferences?.meetingMasterSetup?.agenda
                        ?.form?.addMore
                }
            </StyledPolicyAddMoreText>
        </StyledPolicyAddMoreContainer>
    );

    const fileAlreadyExists = (file: any) =>
        policyProcedureData?.documents?.some(
            (value: PolicyProcedureDocumentEntity) =>
                value.fileName === (file?.fileName || file?.name)
        );

    const handleDeletePolicy = async (id: string) => {
        return new Promise<void>((resolve, reject) => {
            reduxDispatch(
                apiCall(
                    `${POLICIES_AND_PROCEDURES_API}/${id}`,
                    resolve,
                    reject,
                    HttpMethods.DELETE,
                )
            );
        })
            .then(async (res: any) => {
                toast(
                    <Toast
                        text={"Policy is not created due to some error"}
                    />
                );
            })
            .catch((error) => {
                console.log("error", error);
            });
    }

    const uploadFile = async (id?: string) => {
        const uploadPromises = files?.map((file) => {
            const fileValue = file?.id ? file : file?.file;
            const formData = new FormData();
            formData.append('file', fileValue);
            formData.append('tenantId', tenantData.tenantId);
            formData.append('policyId', isEdit ? policyProcedureData?.id : id);

            return !fileAlreadyExists(fileValue)
                ? new Promise<any>((resolve, reject) => {
                    reduxDispatch(
                        apiCall(
                            POLICIES_AND_PROCEDURES_UPLOAD_DOCUMENT_API,
                            resolve,
                            reject,
                            HttpMethods.POST,
                            formData,
                            { isFormData: true },
                        )
                    );
                })
                : Promise.resolve();
        });

        return Promise.all(uploadPromises)
            .then(() => {
                setFiles(null);
            })
            .catch(async (error) => {
                if (isEdit) {
                    setSubmitError(error?.message);
                } else {
                    await handleDeletePolicy(id);
                }
            });
    };

    const deleteFile = async (id: string) => {
        const sanitizedBody = {
            tenantId: tenantData.tenantId,
            policyId: policyProcedureData?.id,
            fileIds: [id]
        };

        return new Promise<any>((resolve, reject) => {
            reduxDispatch(
                apiCall(
                    POLICIES_AND_PROCEDURES_REMOVE_DOCUMENT_API,
                    resolve,
                    reject,
                    HttpMethods.DELETE,
                    sanitizedBody
                )
            );
        })
            .then(() => {
                const filteredData = policyProcedureData?.documents?.filter((val: PolicyProcedureDocumentEntity) => val?.id !== id);
                setFiles(filteredData);
            })
            .catch((error) => {
                setSubmitError(error?.message);
                return;
            });
    };

    const onSubmit = async (data: FormData) => {
        const deletedLinks = policyProcedureData?.links?.filter((ele: PolicyProcedureLinkEntity) => !data?.links?.some((val) => val.id === ele.id))
            ?.map((ele: PolicyProcedureLinkEntity) => ele.id);
        const deletedVideos = policyProcedureData?.videos?.filter((ele: PolicyProcedureVideoEntity) => !data?.video?.some((val) => val.id === ele.id))
            .map((ele: PolicyProcedureLinkEntity) => ele.id);

        let sanitizedBody: any = {
            tenantId: tenantData.tenantId,
            authorId: data?.author?.id,
            divisionId: data?.division?.id,
            name: trimWordWrapper(data?.policyName),
            number: trimWordWrapper(data?.policyNumber),
            keywords: trimWordWrapper(data?.keywords),
            description: trimWordWrapper(data?.description),
            status: data?.status?.id,
            links: data?.links?.map((val) => val?.id
                ? ({
                    id: val?.id,
                    name: trimWordWrapper(val?.resourcename),
                    link: trimWordWrapper(val?.resourcelink)
                })
                : ({
                    name: trimWordWrapper(val?.resourcename),
                    link: trimWordWrapper(val?.resourcelink)
                })),
            videos: data?.video?.map((val) => val?.id
                ? ({
                    id: val?.id,
                    name: trimWordWrapper(val?.videodisplayname),
                    link: trimWordWrapper(val?.videolink),
                    type: val?.videotype?.id
                })
                : ({
                    name: trimWordWrapper(val?.videodisplayname),
                    link: trimWordWrapper(val?.videolink),
                    type: val?.videotype?.id
                })),
        };

        if (deletedLinks?.length) {
            sanitizedBody = {
                ...sanitizedBody,
                deletedLinks: [...deletedLinks]
            }
        }
        if (deletedVideos?.length) {
            sanitizedBody = {
                ...sanitizedBody,
                deletedVideos: [...deletedVideos],
            }
        }

        return new Promise<void>((resolve, reject) => {
            reduxDispatch(
                apiCall(
                    isEdit ? `${POLICIES_AND_PROCEDURES_API}/${policyProcedureData?.id}` : POLICIES_AND_PROCEDURES_API,
                    resolve,
                    reject,
                    isEdit ? HttpMethods.PATCH : HttpMethods.POST,
                    sanitizedBody
                )
            );
        })
            .then(async (res: any) => {
                if (files?.length) await uploadFile(res?.data?.id);
                toast(
                    <Toast
                        text={isEdit
                            ? messages?.execute?.policiesAndProcedures?.form?.success?.updated
                            : messages?.execute?.policiesAndProcedures?.form?.success?.created}
                    />
                );

                reduxDispatch(goBack());
            })
            .catch((error) => {
                toast(
                    <Toast
                        text={messages?.execute?.policiesAndProcedures?.form?.error?.serverError?.[error?.message]}
                        type="error"
                    />
                );
            });
    };

    useEffect(() => {
        if (!isEdit) {
            change('author', peopleOptions?.filter(item => item?.email === userProfile?.email)
                ?.map(mapIdFullNameToOption)?.[0]);
            change('status', PolicyStatusOptions?.[0]);
            if (division !== 'all') {
                const divisionData: Division = divisionOptions?.find(item => item.id === division?.toUpperCase());

                change('division', divisionData && {
                    id: divisionData?.id,
                    label: divisionData?.name
                });
            }
        }
    }, [peopleOptions, userProfile])

    useEffect(() => {
        if (isEdit) {
            setFiles(policyProcedureData?.documents);
            change('policyName', policyProcedureData?.name);
            change('policyNumber', policyProcedureData?.number);
            change('division', {
                id: policyProcedureData?.division?.id,
                label: policyProcedureData?.division?.name,
            });
            change('author', {
                id: policyProcedureData?.author?.id,
                label: `${policyProcedureData?.division?.firstName || ""} ${policyProcedureData?.division?.lastName || ""}`,
            });
            change('status', PolicyStatusOptions?.find(item => item.id === policyProcedureData?.status));
            change('keywords', policyProcedureData?.keywords);
            change('description', policyProcedureData?.description);
            const links = policyProcedureData?.links?.map((item: PolicyProcedureLinkEntity) => ({
                id: item?.id,
                resourcename: item?.name,
                resourcelink: item?.link,
            }));
            handleRecursiveChange('links', links);
            const video = policyProcedureData?.videos?.map((item: PolicyProcedureVideoEntity) => ({
                id: item?.id,
                videolink: item?.link,
                videodisplayname: item?.name,
                videotype: {
                    id: item?.type,
                    label: capitalizeLegend(item?.type?.toString()),
                }
            }));
            handleRecursiveChange('video', video);
        }
    }, [])

    return (
        <Container
            noPadding
        >
            <DetailPageWrapper
                hasGoBackIcon
                heading={isEdit
                    ? messages?.execute?.policiesAndProcedures?.form?.editPolicyHeading
                    : messages?.execute?.policiesAndProcedures?.form?.addPolicyHeading}
                cardHeading={messages?.execute?.policiesAndProcedures?.form?.policyInformation}
                cardContent={[
                    {
                        value: (
                            <Grid container display="flex" flexDirection="column" gap="12px" columnGap={3}>
                                <Grid item>
                                    <StyledPolicyFormLabels>
                                        {messages?.execute?.policiesAndProcedures?.form?.labels?.policy}
                                    </StyledPolicyFormLabels>
                                </Grid>
                                <Grid container columnSpacing={2} rowGap={2}>
                                    <Grid item xs={3}>
                                        {connectField("policyName", {
                                            label: messages?.execute?.policiesAndProcedures?.policyName,
                                            required: true
                                        })(MaterialTextInput)}
                                    </Grid>
                                    <Grid item xs={3}>
                                        {connectField("policyNumber", {
                                            label: messages?.execute?.policiesAndProcedures?.details?.policyNumber,
                                            required: true
                                        })(MaterialTextInput)}
                                    </Grid>
                                    <Grid item xs={3}>
                                        {connectField("division", {
                                            label: messages?.execute?.policiesAndProcedures?.details?.division,
                                            required: true,
                                            options: divisionOptions?.map(mapIdNameToOption)
                                        })(MaterialAutocompleteInput)}
                                    </Grid>
                                    <Grid item xs={3}>
                                        {connectField("author", {
                                            label: messages?.execute?.policiesAndProcedures?.author,
                                            required: true,
                                            options: peopleOptions?.map(mapIdFullNameToOption),
                                            searchOptions: peopleSearchOptions
                                        })(MaterialAutocompleteInput)}
                                    </Grid>
                                    <Grid item xs={3}>
                                        {connectField("status", {
                                            label: messages?.settings?.systemPreferences?.launchPadSetup?.status,
                                            required: true,
                                            options: PolicyStatusOptions
                                        })(MaterialAutocompleteInput)}
                                    </Grid>
                                    <Grid container item xs={12} columnSpacing={2}>
                                        <Grid item xs={6}>
                                            {connectField("keywords", {
                                                label: messages?.execute?.policiesAndProcedures?.details?.searchableKeywords,
                                                required: true,
                                                multiline: true,
                                                minRows: 3,
                                                maxRows: 3
                                            })(MaterialTextInput)}
                                        </Grid>
                                        <Grid item xs={6}>
                                            {connectField("description", {
                                                label: messages?.execute?.policiesAndProcedures?.details?.description,
                                                multiline: true,
                                                minRows: 3,
                                                maxRows: 3
                                            })(MaterialTextInput)}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        ),
                        gridWidth: 12,
                    },
                    {
                        value: (
                            <Grid item xs={12}>
                                <StyledSeparator />
                            </Grid>
                        ),
                        gridWidth: 12,
                    },
                    {
                        value: (
                            <Grid container display="flex" flexDirection="column" columnGap={3}>
                                <Grid item marginBottom="3px">
                                    <StyledPolicyFormLabels>
                                        {messages?.execute?.policiesAndProcedures?.details?.links}
                                    </StyledPolicyFormLabels>
                                </Grid>
                                <Grid item>
                                    {connectFieldReplicate("links", {
                                        formLayout: linksFormLayout,
                                        ref: addMoreLinksRef,
                                        showAddButton: false,
                                        fieldListMarginBottom: '0px'
                                    })(RecursiveFieldInput)}
                                </Grid>
                                <Grid item>
                                    {renderAddMoreButton(addMoreLinksRef, 'links')}
                                </Grid>
                            </Grid>
                        ),
                        gridWidth: 12,
                    },
                    {
                        value: (
                            <Grid item xs={12}>
                                <StyledSeparator />
                            </Grid>
                        ),
                        gridWidth: 12,
                    },
                    {
                        value: (
                            <Grid container display="flex" flexDirection="column" columnGap={3}>
                                <Grid item marginBottom="3px">
                                    <StyledPolicyFormLabels>
                                        {messages?.execute?.policiesAndProcedures?.details?.video}
                                    </StyledPolicyFormLabels>
                                </Grid>
                                <Grid item>
                                    {connectFieldReplicate("video", {
                                        formLayout: videoFormLayout,
                                        ref: addMoreVideoRef,
                                        showAddButton: false,
                                        fieldListMarginBottom: '0px'
                                    })(RecursiveFieldInput)}
                                </Grid>
                                <Grid item>
                                    {renderAddMoreButton(addMoreVideoRef, 'video')}
                                </Grid>
                            </Grid>
                        ),
                        gridWidth: 12,
                    },
                    {
                        value: (
                            <Grid item xs={12}>
                                <StyledSeparator />
                            </Grid>
                        ),
                        gridWidth: 12,
                    },
                    {
                        value: (
                            <Grid container display="flex" flexDirection="column" gap="12px" columnGap={3}>
                                <Grid item>
                                    <StyledPolicyFormLabels>
                                        {messages?.execute?.policiesAndProcedures?.form?.labels?.documents}
                                    </StyledPolicyFormLabels>
                                </Grid>
                                <Grid item xs={12}>
                                    {connectField("fileUpload", {
                                        files,
                                        setFiles,
                                        orientation: "horizontal",
                                        fileContainerWidth: '262px',
                                        onFilesDelete: deleteFile
                                    })(DragDropComponent)}
                                </Grid>
                            </Grid>
                        ),
                        gridWidth: 12,
                    },
                ]}
                detailedGridGap={3}
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
                />
                <Button
                    label={
                        messages?.firmProfile?.missionVisionValues
                            ?.addNewMissionVisionValue?.[isEdit ? "update" : "add"]
                    }
                    variant="contained"
                    color="primary"
                    type="submit"
                    onClick={handleSubmit(onSubmit)}
                    disabled={submitting}
                />
            </Grid>
        </Container>
    )
};

export default PolicyProcedureForm;