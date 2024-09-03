import React, { useEffect, useState } from "react";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Container } from "../../components";
import {
    StyledHeadingTypography,
    StyledProfileAvatar,
    StyledProfileDetailChildren,
    StyledProfileDetailTableLinkContent,
    StyledProfileHeadingContainer,
    StyledProfileLeftHeadingContainer,
} from './styles';
import { Button, Card, Modal, Toast } from "@wizehub/components";
import messages from "../../messages";
import { CircularProgress, Grid } from "@mui/material";
import {
    StyledDetailHeading,
    StyledDetailHeadingContainer,
    StyledDetailTableContent,
    StyledDetailTableHeading
} from "@wizehub/components/detailPageWrapper/styles";
import { config } from "../../config";
import { useSelector } from "react-redux";
import { ReduxState } from "../../redux/reducers";
import { capitalizeLegend } from "@wizehub/common/utils";
import { brandColour, otherColour } from "@wizehub/common/theme/style.palette";
import { Status } from "@wizehub/common/models/modules";
import { formatStatus } from "@wizehub/components/table";
import { useDispatch } from "react-redux";
import { usePopupReducer } from "@wizehub/common/hooks";
import { Id, VerificationActionType } from "@wizehub/common/models";
import EditForm from "./editForm";
import { apiCall, fetchUserProfile } from "../../redux/actions";
import ChangePasswordForm from "./changePasswordForm";
import ChangeMFAForm from "./changeMFAForm";
import UpdateMultiFactorAuthenticationForm from "./updateMultiFactorAuthentication";
import DisableMFAForm from "./disableMFAForm";
import EnableMFAForm from "./enableMFAForm";
import VerifySecureCodeForm from "./verifySecureCodeForm";
import { toast } from "react-toastify";
import RecoveryCodeForm from "./recoveryCodeForm";
import { USER_TWO_FA_AUTENTICATION } from "../../api";

const ProfileSection: React.FC = () => {
    const userProfile = useSelector((state: ReduxState) => state.profile);
    const [isEnable, setIsEnable] = useState<boolean>(true);
    const [startLoader, setStartLoader] = useState<boolean>(false);
    const [userTwoFactorAuthentication, setUserTwoFactorAuthentication] = useState([]);
    const [refreshUserAuthentication, setRefreshUserAuthentication] = useState<boolean>(false);

    const reduxDispatch = useDispatch();

    const {
        visibility: editFormVisibility,
        showPopup: showEditForm,
        hidePopup: hideEditForm,
    } = usePopupReducer();

    const {
        visibility: changePasswordFormVisibility,
        showPopup: showChangePasswordForm,
        hidePopup: hideChangePasswordForm,
    } = usePopupReducer();

    const {
        visibility: updateFormVisibility,
        showPopup: showUpdateForm,
        hidePopup: hideUpdatesForm,
        metaData: updateFormConfig,
    } = usePopupReducer<{ isEnable?: boolean }>();

    const {
        visibility: disableMFAFormVisibility,
        showPopup: showDisableMFAForm,
        hidePopup: hideDisableMFAForm,
    } = usePopupReducer();

    const {
        visibility: enableMFAFormVisibility,
        showPopup: showEnableMFAForm,
        hidePopup: hideEnableMFAForm,
    } = usePopupReducer();

    const {
        visibility: updateMFAFormVisibility,
        showPopup: showUpdateMFAForm,
        hidePopup: hideUpdateMFAForm,
        metaData: updateMFAFormConfig,
    } = usePopupReducer<{
        method: Id;
        value: string;
        verificationActionType: VerificationActionType;
        prevMethod: Id;
        prevMethodValue: string;
    }>();

    const {
        visibility: verifySecureCodeFormVisibility,
        showPopup: showVerifySecureCodeForm,
        hidePopup: hideVerifySecureCodeForm,
        metaData: verifySecureCodeFormConfig,
    } = usePopupReducer<{
        method: Id;
        value: string;
        verificationActionType: VerificationActionType;
    }>();

    const {
        visibility: recoveryCodeFormVisibility,
        showPopup: showRecoveryCodeForm,
        hidePopup: hideRecoveryCodeForm,
        metaData: recoveryCodeConfig,
    } = usePopupReducer<{
        data?: {
            records: { id: Id; code: string }[]
        }
    }>();

    const renderContent = () => {
        if (startLoader) {
            return <CircularProgress size="20px" />;
        }

        if (isEnable) {
            return (
                <Grid item display="flex" alignItems="center" gap="10px" marginBottom="10px">
                    <StyledProfileDetailTableLinkContent
                        color={brandColour.primary100}
                        onClick={() => showUpdateForm()}
                    >
                        {messages.profile.generalInformation.setupMFA}
                    </StyledProfileDetailTableLinkContent>
                </Grid>
            );
        }

        const status = userTwoFactorAuthentication[0]?.status;
        const isStatusActive = status === Status.active;

        return (
            <>
                <Grid item display="flex" alignItems="center" gap="10px" marginBottom="10px">
                    <StyledDetailTableContent>
                        {formatStatus(status)}
                    </StyledDetailTableContent>
                    {isStatusActive && (
                        <StyledProfileDetailTableLinkContent
                            color={brandColour.primary100}
                            onClick={() => showUpdateForm()}
                        >
                            {messages.profile.generalInformation.updateChange}
                        </StyledProfileDetailTableLinkContent>
                    )}
                </Grid>
                {isStatusActive ? (
                    <StyledProfileDetailTableLinkContent
                        color={otherColour.errorDefault}
                        onClick={() => showDisableMFAForm()}
                    >
                        {messages.profile.generalInformation.disableMFA}
                    </StyledProfileDetailTableLinkContent>
                ) : (
                    <StyledProfileDetailTableLinkContent
                        color={brandColour.primary100}
                        onClick={() => showEnableMFAForm()}
                    >
                        {messages.profile.generalInformation.enableMFA}
                    </StyledProfileDetailTableLinkContent>
                )}
            </>
        );
    };

    const profileSectionToastComponent = () => (
        <Toast
            text={
                messages?.profile?.verifySecureCode?.success
            }
        />
    );

    const profileSectionRecoveryCodeComponent = () => (
        <Toast text={messages?.profile?.recoveryCode?.success} />
    );

    useEffect(() => {
        setStartLoader(true);
        reduxDispatch(
            apiCall(
                USER_TWO_FA_AUTENTICATION,
                (res) => {
                    if (res?.length) {
                        setIsEnable(false);
                        setUserTwoFactorAuthentication(res);
                    }
                    setStartLoader(false);
                },
                () => {
                    setStartLoader(false);
                },
            ),
        );
    }, [refreshUserAuthentication]);

    return (
        <Container noPadding>
            <StyledProfileHeadingContainer>
                <StyledProfileLeftHeadingContainer>
                    <StyledHeadingTypography>
                        {messages.profile.heading}
                    </StyledHeadingTypography>
                </StyledProfileLeftHeadingContainer>
                <Button
                    startIcon={<EditOutlinedIcon />}
                    variant="outlined"
                    color="secondary"
                    label={messages.profile.editButton}
                    onClick={() => showEditForm()}
                />
            </StyledProfileHeadingContainer>
            <Card noHeader cardCss={{ margin: '0 20px' }}>
                <Grid container>
                    <StyledDetailHeadingContainer
                        container
                        item
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <StyledDetailHeading>
                            {messages.profile.generalInformation.heading}
                        </StyledDetailHeading>
                    </StyledDetailHeadingContainer>
                    <StyledProfileDetailChildren container item>
                        <Grid container item xs={12}>
                            <Grid item xs={12}>
                                <StyledDetailTableHeading>
                                    {messages.profile.generalInformation.photo}
                                </StyledDetailTableHeading>
                                <StyledDetailTableContent>
                                    <StyledProfileAvatar
                                        src={`${config.baseImageUrl}/${userProfile?.profileUrl}`}
                                    />
                                </StyledDetailTableContent>
                            </Grid>
                        </Grid>
                        <Grid container item xs={12} gap="26px">
                            <Grid item xs={2}>
                                <StyledDetailTableHeading>
                                    {messages.profile.generalInformation.name}
                                </StyledDetailTableHeading>
                                <StyledDetailTableContent>
                                    {userProfile?.firstName && userProfile?.lastName
                                        ? `${userProfile?.firstName} ${userProfile?.lastName}`
                                        : '-'}
                                </StyledDetailTableContent>
                            </Grid>
                            <Grid item xs={2}>
                                <StyledDetailTableHeading>
                                    {messages.profile.generalInformation.role}
                                </StyledDetailTableHeading>
                                <StyledDetailTableContent>
                                    {userProfile?.role?.name
                                        ? capitalizeLegend(userProfile?.role?.name)
                                        : '-'}
                                </StyledDetailTableContent>
                            </Grid>
                            <Grid item xs={3}>
                                <StyledDetailTableHeading>
                                    {messages.profile.generalInformation.emailAddress}
                                </StyledDetailTableHeading>
                                <StyledDetailTableContent>
                                    {userProfile?.email ? userProfile?.email : '-'}
                                </StyledDetailTableContent>
                            </Grid>
                            <Grid item xs={2}>
                                <StyledDetailTableHeading>
                                    {messages.profile.generalInformation.phoneNumber}
                                </StyledDetailTableHeading>
                                <StyledDetailTableContent>
                                    {userProfile?.phoneNumber
                                        ? `+${userProfile?.dialCode} ${userProfile?.phoneNumber}`
                                        : '-'}
                                </StyledDetailTableContent>
                            </Grid>
                            <Grid item xs={2}>
                                <StyledDetailTableHeading>
                                    {messages.profile.generalInformation.password}
                                </StyledDetailTableHeading>
                                <StyledProfileDetailTableLinkContent
                                    color={brandColour.primary100}
                                    onClick={() => showChangePasswordForm()}
                                >
                                    {messages.profile.generalInformation.changePassword}
                                </StyledProfileDetailTableLinkContent>
                            </Grid>
                        </Grid>
                        <Grid container item xs={12}>
                            <Grid container item xs={12} flexDirection="column">
                                <Grid item display="flex" alignItems="center" gap="6px">
                                    <StyledDetailTableHeading>
                                        {
                                            messages.profile.generalInformation
                                                .multiFactorAuthentication
                                        }
                                    </StyledDetailTableHeading>
                                    {/* <StyledProfileInfoIcon /> */}
                                </Grid>
                                {renderContent()}
                            </Grid>
                        </Grid>
                    </StyledProfileDetailChildren>
                </Grid>
            </Card>

            <Modal
                fitContent
                show={changePasswordFormVisibility}
                onClose={hideChangePasswordForm}
                heading={messages?.profile?.changePasswordForm?.heading}
            >
                <ChangePasswordForm
                    onSuccess={hideChangePasswordForm}
                    onCancel={hideChangePasswordForm}
                />
            </Modal>

            <Modal
                fitContent
                show={editFormVisibility}
                onClose={hideEditForm}
                heading={messages?.profile?.editForm?.heading}
            >
                <EditForm
                    onCancel={() => hideEditForm()}
                    onSuccess={() => {
                        reduxDispatch(fetchUserProfile());
                        hideEditForm();
                    }}
                />
            </Modal>

            <Modal
                fitContent
                show={updateFormVisibility}
                onClose={hideUpdatesForm}
                heading={
                    isEnable
                        ? messages?.profile?.updateMultiFactorAuthentication?.enableHeading
                        : messages?.profile?.updateMultiFactorAuthentication?.heading
                }
            >
                <UpdateMultiFactorAuthenticationForm
                    onCancel={() => hideUpdatesForm()}
                    onSuccess={() => {
                        hideUpdatesForm();
                    }}
                    showUpdateMFAForm={!isEnable ? showUpdateMFAForm : showVerifySecureCodeForm}
                    isEnable={isEnable || updateFormConfig?.isEnable}
                />
            </Modal>

            <Modal
                fitContent
                show={updateMFAFormVisibility}
                onClose={hideUpdateMFAForm}
                heading={messages?.profile?.updateVerifyCode?.heading}
            >
                <ChangeMFAForm
                    onCancel={() => {
                        hideUpdateMFAForm();
                        showUpdateForm();
                    }}
                    onSuccess={() => {
                        hideUpdateMFAForm();
                    }}
                    method={updateMFAFormConfig?.method}
                    value={updateMFAFormConfig?.value}
                    actionType={updateMFAFormConfig?.verificationActionType}
                    prevMethod={updateMFAFormConfig?.prevMethod}
                    prevMethodValue={updateMFAFormConfig?.prevMethodValue}
                />
            </Modal>

            <Modal
                fitContent
                show={disableMFAFormVisibility}
                onClose={hideDisableMFAForm}
                heading={messages?.profile?.disableMFAForm?.heading}
            >
                <DisableMFAForm
                    onCancel={() => hideDisableMFAForm()}
                    onSuccess={() => {
                        hideDisableMFAForm();
                    }}
                    showVerifySecureCodeForm={showVerifySecureCodeForm}
                />
            </Modal>

            <Modal
                fitContent
                show={enableMFAFormVisibility}
                onClose={hideEnableMFAForm}
                heading={messages?.profile?.enableMFAForm?.heading}
            >
                <EnableMFAForm
                    onCancel={() => hideEnableMFAForm()}
                    onSuccess={() => {
                        hideEnableMFAForm();
                    }}
                    showVerifySecureCodeForm={showVerifySecureCodeForm}
                />
            </Modal>

            <Modal
                fitContent
                show={verifySecureCodeFormVisibility}
                onClose={hideVerifySecureCodeForm}
                heading={messages?.profile?.verifySecureCode?.heading}
            >
                <VerifySecureCodeForm
                    onCancel={() => {
                        hideVerifySecureCodeForm();
                        if (isEnable) {
                            showUpdateForm({
                                isEnable: true,
                            });
                        } else if (
                            verifySecureCodeFormConfig?.verificationActionType
                            === VerificationActionType.DISABLE
                        ) {
                            showDisableMFAForm();
                        } else {
                            showEnableMFAForm();
                        }
                    }}
                    onSuccess={() => {
                        hideVerifySecureCodeForm();
                        setRefreshUserAuthentication((prev) => !prev);
                        toast(profileSectionToastComponent());
                    }}
                    method={verifySecureCodeFormConfig?.method}
                    value={verifySecureCodeFormConfig?.value}
                    actionType={
                        isEnable
                            ? VerificationActionType.ENABLE
                            : verifySecureCodeFormConfig?.verificationActionType
                    }
                    showRecoveryCodeForm={isEnable && showRecoveryCodeForm}
                />
            </Modal>

            <Modal
                fitContent
                show={recoveryCodeFormVisibility}
                onClose={hideRecoveryCodeForm}
                heading={messages?.profile?.recoveryCode?.heading}
            >
                <RecoveryCodeForm
                    onSuccess={() => {
                        hideRecoveryCodeForm();
                        toast(profileSectionRecoveryCodeComponent());
                    }}
                    recoveryCodeConfig={recoveryCodeConfig}
                />
            </Modal>
        </Container>
    )
};

export default ProfileSection;