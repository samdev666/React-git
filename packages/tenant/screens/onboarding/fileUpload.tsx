import React, { useState } from 'react';
import {
    StyledFormContainer,
    StyledScreenWrapper
} from '../auth/styles';
import {
    Button,
    DragDropComponent,
    Form,
    FormRow,
    FormRowItem,
    Toast
} from '@wizehub/components';
import { useEntity, useFormReducer } from '@wizehub/common/hooks';
import { FILE_UPLOAD, FIRM_DETAIL_BY_ID } from '../../api';
import messages from '../../messages';
import { Container } from '../../components';
import { SidePanel } from '../auth';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { routes } from '../../utils';
import { push } from 'connected-react-router';
import { useDispatch } from 'react-redux';
import { Grid, LinearProgress } from '@mui/material';
import { StyledInfoContainer, StyledFormHeading, StyledFormSubHeading } from '@wizehub/admin/screens/auth/styles';
import { apiCall } from '../../redux/actions';
import { HttpMethods } from '@wizehub/common/utils';
import { StyledSkipArrowForwardIcon, StyledSkipLink, StyledSkipLinkText } from './styles';
import { useSelector } from 'react-redux';
import { ReduxState } from '../../redux/reducers';
import { FirmProfileEntity } from '@wizehub/common/models/genericEntities';
import { StyledFilesContainer, StyledIconContainer } from '../leadManagement/leadBoard/styles';
import { config } from '../../config';
import { StyledCancelOutlinedIcon, StyledFileName } from '@wizehub/components/dragAndDrop/styles';

interface TenantData {
    token: string;
    data: {
        id: string;
        name: string;
        abn: string;
        streetAddress?: string | null;
        logoPath?: string | null;
        city: string;
        countryId: {
            id: number;
            name: string;
        };
        postalCode?: string | null;
        nextBillingDate?: string | null;
        financialStartMonth?: number;
        dateFormat?: string;
        status?: string;
        group?: string | null;
    }
}

interface Props {
}

const FileUploadComponent: React.FC<Props> = () => {
    const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
    const reduxDispatch = useDispatch();

    const [files, setFiles] = useState<any[]>([]);
    const [isUploadCompleted, setIsUploadCompleted] = useState<boolean>(false);
    const [loader, setLoader] = useState(false);

    const { entity: firmDetail, refreshEntity } = useEntity<FirmProfileEntity>(
        FIRM_DETAIL_BY_ID,
        tenantId
    );

    const {
        submitError,
        handleSubmit,
        connectField,
        setSubmitError,
    } = useFormReducer();

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('tenantId', tenantId);

        return new Promise<any>((resolve, reject) => {
            reduxDispatch(
                apiCall(
                    FILE_UPLOAD,
                    resolve,
                    reject,
                    HttpMethods.POST,
                    formData,
                    { isFormData: true },
                )
            );
        })
            .then(() => {
                setFiles(null);
                setLoader(false);
                setIsUploadCompleted(true);
            })
            .catch((error) => {
                setSubmitError(error?.message);
            });
    };

    const onSubmit = async () => {
        setIsUploadCompleted(false);
        setLoader(true);
        await uploadFile(files?.[0]?.file)
        toast(() => (
            <Toast subText={messages?.signup?.form?.fileUpload?.success?.uploaded} />
        ));
        reduxDispatch(push(routes.success));
    };

    return (
        <Container noPadding hasHeader={false} hideSidebar>
            <StyledScreenWrapper>
                <SidePanel />
                <StyledFormContainer>
                    <StyledInfoContainer>
                        <StyledFormHeading variant="h1">
                            {messages?.signup?.form?.fileUpload?.heading}
                        </StyledFormHeading>
                        <StyledFormSubHeading>
                            {messages?.signup?.form?.fileUpload?.subHeading}
                        </StyledFormSubHeading>
                    </StyledInfoContainer>
                    <Form
                        onSubmit={handleSubmit(onSubmit)}
                        style={{ padding: '24px 0px', maxWidth: "340px" }}
                        hasPadding
                    >
                        <FormRow marginBottom="8px">
                            <FormRowItem>
                                {connectField('fileUpload', {
                                    files,
                                    setFiles,
                                    multiple: false,
                                    setIsUploadCompleted,
                                    width: '100%',
                                    requiresDragDrop: true,
                                    fileWidth: "100%"
                                })(DragDropComponent)}
                            </FormRowItem>
                            {(firmDetail?.logoPath && files?.length === 0)
                                && <StyledFilesContainer container>
                                    <Grid item xs={10}>
                                        <StyledIconContainer item>
                                            <img
                                                src={`${config.baseImageUrl}/${firmDetail?.logoPath}`}
                                                alt="img"
                                                width="32px"
                                                height="32px"
                                            />
                                        </StyledIconContainer>
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
                                </StyledFilesContainer>}
                        </FormRow>
                        {loader && <LinearProgress />}
                        <FormRow marginTop={"8px"}>
                            <FormRowItem>
                                <Button
                                    label={messages?.signup?.form?.fileUpload?.uploadButton}
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    fullWidth
                                    disabled={!isUploadCompleted}
                                />
                            </FormRowItem>
                        </FormRow>
                        <FormRow marginTop={"8px"}>
                            <FormRowItem display="flex" alignItems={"center"} justifyContent={"center"}>
                                <StyledSkipLink href={routes.success}>
                                    <StyledSkipLinkText>
                                        {messages?.signup?.form?.fileUpload?.skipStep}
                                    </StyledSkipLinkText>
                                    <StyledSkipArrowForwardIcon />
                                </StyledSkipLink>
                            </FormRowItem>
                        </FormRow>
                    </Form>
                </StyledFormContainer>
            </StyledScreenWrapper>
        </Container>
    );
};

export default FileUploadComponent;
