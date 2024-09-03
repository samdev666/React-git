import React, { useEffect, useState } from "react";
import { Container } from "../../../components";
import {
    Button,
    CustomRadioGroup,
    DetailPageWrapper,
    DragDropComponent,
    MaterialAutocompleteInput,
    MaterialDateInput,
    MaterialTextInput,
    PhoneInput,
    Toast
} from "@wizehub/components";
import { Grid, Typography } from "@mui/material";
import { StyledFormActionButtonContainer, StyledSeparator } from "./styles";
import { useFormReducer, useOptions } from "@wizehub/common/hooks";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { apiCall } from "../../../redux/actions";
import {
    emptyValueValidator,
    HttpMethods, mapIdFullNameToOption,
    mapIdNameToOptionWithoutCaptializing,
    required,
    trimWordWrapper
} from "@wizehub/common/utils";
import messages from "../../../messages";
import { routes } from "../../../utils";
import { goBack, push } from "connected-react-router";
import {
    CLIENT_CLASS_LISTING_API,
    LEAD_INDUSTRY_LISTING_API,
    LEAD_SOURCE_LISTING_API,
    PEOPLE_LISTING_API,
    REMOVE_TENANT_CLIENT_DOCUMENT,
    TENANT_CLIENT,
    UPLAOD_TENANT_CLIENT_DOCUMENT
} from "../../../api";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import { StatusOptions } from "@wizehub/common/models/modules";
import moment from "moment";
import {
    ClientClassEntity,
    ClientEntity,
    DocumentEntity,
    LeadDataEntity,
    LeadIndustryInterface,
    LeadSourceEntity,
    PersonBasicDetailEntity
} from "@wizehub/common/models/genericEntities";
import { toast } from "react-toastify";

interface Props {
}

const validators = {
    clientName: [
        required(messages?.leadManagement?.form?.error?.clientNameRequired),
        emptyValueValidator,
    ],
    businessName: [
        required(messages?.leadManagement?.form?.error?.businessNameRequired),
        emptyValueValidator,
    ],
    dateLeadFound: [
        required(messages?.leadManagement?.form?.error?.dateLeadFoundRequired)
    ],
    mobile: [
        required(messages?.leadManagement?.form?.error?.mobileNumberRequired),
        emptyValueValidator
    ],
    status: [
        required(messages?.leadManagement?.form?.error?.statusRequired),
    ],
};

export const getOption = (data: LeadDataEntity) => (
    data?.id ? {
        id: data?.id,
        label: data?.name,
    } : ''
)

const AddEditLeadClientForm: React.FC<Props> = () => {
    const reduxDispatch = useDispatch();
    const location: any = useLocation();
    const { type, clientId, clientData } = location?.state;
    const { action } = useParams<{ action?: string }>();
    const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);

    const [files, setFiles] = useState([]);

    const isEdit = action === "edit";
    const isClient = type === "Client";

    const {
        submitting,
        handleSubmit,
        connectField,
        change,
        setSubmitError,
        formValues
    } = useFormReducer(validators);

    const {
        options: leadIndustryOptions,
        searchOptions: leadIndustrySearchOptions,
    } = useOptions<LeadIndustryInterface>(
        `${LEAD_INDUSTRY_LISTING_API.replace(":id", tenantId)}`,
        true
    );

    const {
        options: leadSourceOptions,
        searchOptions: leadSourceSearchOptions,
    } = useOptions<LeadSourceEntity>(
        `${LEAD_SOURCE_LISTING_API.replace(":id", tenantId)}`,
        true
    );

    const {
        options: peopleOptions,
        searchOptions: peopleSearchOptions,
    } = useOptions<PersonBasicDetailEntity>(
        `${PEOPLE_LISTING_API.replace(":tenantId", tenantId)}`,
        true
    );

    const {
        options: clientClassOptions,
    } = useOptions<ClientClassEntity>(
        CLIENT_CLASS_LISTING_API,
        true
    );

    const fileAlreadyExists = (file: any) =>
        clientData?.documents?.some(
            (value: DocumentEntity) =>
                value.fileName === (file?.fileName || file?.name)
        );

    const uploadFile = async (id?: string) => {
        const uploadPromises = files?.map((file) => {
            const fileValue = file?.id ? file : file?.file;
            const formData = new FormData();
            formData.append('file', fileValue);
            formData.append('tenantId', tenantId);
            formData.append('clientId', clientId || id);

            return !fileAlreadyExists(fileValue)
                ? new Promise<any>((resolve, reject) => {
                    reduxDispatch(
                        apiCall(
                            UPLAOD_TENANT_CLIENT_DOCUMENT,
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
            .catch((error) => {
                setSubmitError(error?.message);
            });
    };

    const deleteFile = async (id: string) => {
        const sanitizedBody = {
            tenantId: tenantId,
            clientId: clientId,
            fileIds: [id]
        };

        return new Promise<any>((resolve, reject) => {
            reduxDispatch(
                apiCall(
                    REMOVE_TENANT_CLIENT_DOCUMENT,
                    resolve,
                    reject,
                    HttpMethods.DELETE,
                    sanitizedBody
                )
            );
        })
            .then(() => {
                const filteredData = clientData?.documents?.filter((val: DocumentEntity) => val?.id?.toString() !== id);
                setFiles(filteredData);
            })
            .catch((error) => {
                setSubmitError(error?.message);
                return;
            });
    };

    const onSubmit = async (data: any) => {
        let sanitizeBody: any = {
            tenantId: tenantId,
            contactName: data?.clientName ? trimWordWrapper(data?.clientName) : null,
            businessName: data?.businessName ? trimWordWrapper(data?.businessName) : null,
            contactEmail: data?.email,
            dialCode: data?.mobile?.split('-')?.length > 1 ? data?.mobile?.split('-')[0] : clientData?.dialCode,
            phoneNumber: data?.mobile?.split('-')?.length > 1 ? data?.mobile?.split('-')[1] : clientData?.phoneNumber,
            annualFee: Number(data?.annualFees),
            clientClassId: data?.clientClass?.id,
            leadDetails: data?.leadDetails ? trimWordWrapper(data?.leadDetails) : null,
            leadFoundOn: moment(data?.dataLeadFound).format('YYYY-MM-DD'),
            clientType: type?.toUpperCase(),
            status: data?.status?.id,
            leadIndustryId: data?.industry?.id,
            clientManagerId: data?.allocatedClientManager?.id,
            leadSourceId: data?.referralSource?.id,
            referredBy: data?.referrer,
            isAppointmentBooked: data?.appointmentBooked === "yes"
        };

        if (data?.appointmentBooked === "yes" && data?.bookingDate) {
            const dateValue = moment(data?.bookingDate);
            sanitizeBody = {
                ...sanitizeBody,
                appointmentMonth: dateValue.month(),
                appointmentYear: dateValue.year()
            }
        }

        return new Promise<void>((resolve, reject) => {
            reduxDispatch(
                apiCall(
                    isEdit ? `${TENANT_CLIENT}/${clientId}` : TENANT_CLIENT,
                    resolve,
                    reject,
                    isEdit ? HttpMethods.PATCH : HttpMethods.POST,
                    sanitizeBody
                )
            );
        })
            .then(async (res: any) => {
                if (files?.length) await uploadFile(res?.data?.id);
                toast(
                    <Toast
                        text={isEdit
                            ? isClient
                                ? messages?.leadManagement?.form?.success?.clientUpdated
                                : messages?.leadManagement?.form?.success?.leadUpdated
                            : isClient
                                ? messages?.leadManagement?.form?.success?.clientAdded
                                : messages?.leadManagement?.form?.success?.leadAdded}
                    />
                );

                if (isEdit) {
                    reduxDispatch(goBack());
                } else {
                    reduxDispatch(push(
                        location?.state?.goBackRoute || routes.leadManagement.root
                    ))
                }
            })
            .catch((error) => {
                toast(
                    <Toast
                        text={messages?.leadManagement?.form?.error?.serverError?.[error?.message]}
                        type="error"
                    />
                );
            });
    };

    useEffect(() => {
        if (isEdit) {
            setFiles(clientData?.documents);
            change('clientName', clientData?.name);
            change('businessName', clientData?.businessName);
            change('industry', getOption(clientData?.leadIndustry));
            change('mobile', `${clientData?.dialCode + clientData?.phoneNumber}`);
            change('email', clientData?.email);
            change('dateLeadFound', moment(clientData?.leadFoundOn));
            change('clientClass', getOption(clientData?.class));
            change('allocatedClientManager', clientData?.clientManager?.id
                ? {
                    id: clientData?.clientManager?.id,
                    label: `${clientData?.clientManager?.firstName} ${clientData?.clientManager?.lastName}`,
                } : '');
            change('annualFees', clientData?.annualFee);
            change('status', clientData?.status);
            change('referralSource', getOption(clientData?.leadSource));
            change('referrer', clientData?.referredBy);
            change("appointmentBooked", clientData?.isAppointmentBooked ? "yes" : "no");
            change("bookingDate", moment([clientData?.appointmentYear, clientData?.appointmentMonth - 1]))
            change('leadDetails', clientData?.leadDetails);
        } else {
            change("appointmentBooked", "yes");
        }
    }, [clientData])

    return (
        <Container
            noPadding
        >
            <DetailPageWrapper
                hasGoBackIcon
                heading={isEdit ? (isClient
                    ? messages?.leadManagement?.form?.heading?.editClient
                    : messages?.leadManagement?.form?.heading?.editLead)
                    : (isClient
                        ? messages?.leadManagement?.form?.heading?.addClient
                        : messages?.leadManagement?.form?.heading?.addLead)}
                cardContent={[
                    {
                        value: connectField("clientName", {
                            label: messages?.leadManagement?.labels?.clientName,
                            required: true
                        })(MaterialTextInput),
                        gridWidth: 3,
                    },
                    {
                        value: connectField("businessName", {
                            label: messages?.leadManagement?.labels?.businessName,
                            required: true
                        })(MaterialTextInput),
                        gridWidth: 3,
                    },
                    {
                        value: connectField("email", {
                            label: messages?.signup?.form?.email,
                        })(MaterialTextInput),
                        gridWidth: 3,
                    },
                    {
                        value: connectField("mobile", {
                            label: messages?.leadManagement?.labels?.mobileNumber,
                            required: true
                        })(PhoneInput),
                        gridWidth: 3,
                    },
                    {
                        value: connectField("allocatedClientManager", {
                            label: messages?.leadManagement?.labels?.allocatedClientManager,
                            options: peopleOptions?.map(mapIdFullNameToOption),
                            searchOptions: peopleSearchOptions
                        })(MaterialAutocompleteInput),
                        gridWidth: 3,
                    },
                    {
                        value: connectField("dateLeadFound", {
                            label: messages?.leadManagement?.labels?.dateLeadFound,
                            required: true
                        })(MaterialDateInput),
                        gridWidth: 3,
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
                        value: connectField("annualFees", {
                            label: messages?.leadManagement?.labels?.annualFeesDollar,
                            type: 'number',
                        })(MaterialTextInput),
                        gridWidth: 3,
                    },
                    {
                        value: connectField("referralSource", {
                            label: messages?.leadManagement?.labels?.referralSource,
                            options: leadSourceOptions?.map(mapIdNameToOptionWithoutCaptializing),
                            searchOptions: leadSourceSearchOptions
                        })(MaterialAutocompleteInput),
                        gridWidth: 3,
                    },
                    {
                        value: connectField("industry", {
                            label: messages?.leadManagement?.labels?.industry,
                            options: leadIndustryOptions?.map(mapIdNameToOptionWithoutCaptializing),
                            serachOptions: leadIndustrySearchOptions,
                        })(MaterialAutocompleteInput),
                        gridWidth: 3,
                    },
                    {
                        value: connectField("referrer", {
                            label: messages?.leadManagement?.labels?.referrer,
                        })(MaterialTextInput),
                        gridWidth: 3,
                    },
                    {
                        value: connectField("status", {
                            label: messages?.settings?.systemPreferences?.leadIndustrySetup?.status,
                            required: true,
                            options: StatusOptions
                        })(MaterialAutocompleteInput),
                        gridWidth: 3,
                    },
                    {
                        value: connectField('clientClass', {
                            label: messages?.leadManagement?.labels?.clientClass,
                            options: clientClassOptions?.map(mapIdNameToOptionWithoutCaptializing),
                        })(MaterialAutocompleteInput),
                        gridWidth: 3,
                    },
                    {
                        value: (
                            <Grid container display="flex" alignItems={"center"} columnGap={"15px"}>
                                <Grid item>
                                    <Typography
                                        sx={{
                                            fontSize: '16px',
                                            fontWeight: 500,
                                            color: "#232323"
                                        }}
                                    >
                                        Appointment booked
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    {connectField('appointmentBooked', {
                                        options: [
                                            {
                                                value: 'yes',
                                                label: "Yes"
                                            },
                                            {
                                                value: 'no',
                                                label: "No"
                                            },
                                        ],
                                    })(CustomRadioGroup)}
                                </Grid>
                            </Grid>
                        ),
                        gridWidth: 3,
                    },
                    {
                        value: connectField('bookingDate', {
                            label: "Select",
                            views: ['month', 'year'],
                            dateFormat: 'MM/YYYY'
                        })(MaterialDateInput),
                        gridWidth: 3,
                    },
                    {
                        value: connectField("leadDetails", {
                            label: messages?.leadManagement?.labels?.leadDetails,
                            multiline: true,
                            minRows: 3
                        })(MaterialTextInput),
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
                            <Grid container display={"flex"} gap="14px">
                                <Grid item xs={12}>
                                    <Grid container display={"flex"} gap="16px" flexDirection={"column"}>
                                        <Grid item>
                                            <Typography sx={{ fontWeight: 500, color: "#232323" }}>
                                                {messages?.leadManagement?.labels?.fileAttachments}
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            {connectField("fileUpload", {
                                                files,
                                                setFiles,
                                                orientation: 'horizontal',
                                                acceptedFiles: '.pdf, image/*',
                                                fileContainerWidth: '292px',
                                                onFilesDelete: deleteFile
                                            })(DragDropComponent)}
                                        </Grid>
                                    </Grid>

                                </Grid>
                            </Grid>
                        ),
                        gridWidth: 12,
                    },
                ]}
                columnSpacing={2}
                detailedGridGap={3}
            />
            <StyledFormActionButtonContainer>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                        reduxDispatch(push(routes.leadManagement.root))
                    }}
                    label={messages?.firmProfile?.teamStructure?.form?.cancel}
                />
                <Button
                    variant="contained"
                    type="submit"
                    disabled={submitting}
                    onClick={handleSubmit(onSubmit)}
                    label={isEdit ? "Update" : messages?.plan?.budgetAndCapacity?.teamCapacityTab?.teamMemberForm?.add}
                />
            </StyledFormActionButtonContainer>
        </Container >
    )
}

export default AddEditLeadClientForm;