import React, { useEffect, useState } from "react";
import { Container } from "../../../components";
import {
    StyledHeadingTypography,
    StyledMainHeadingButtonContainer,
    StyledMainHeadingContainer
} from "@wizehub/components/detailPageWrapper/styles";
import {
    StyledBudgestAndCapacityLeftHeadingContainer,
    StyledMainCardHeaderContainer
} from "../../plan/budgetAndCapacity/styles";
import { Divider, Grid } from "@mui/material";
import {
    Button,
    MaterialAutocompleteInput,
    Modal,
    MultiTabComponent,
    Toast
} from "@wizehub/components";
import messages from "../../../messages";
import {
    ADD_PLAN,
    FEE_LOSTS_LISTING_API,
    FEE_WONS_API,
    FEE_WONS_LISTING_API,
    FEE_WON_AND_LOST_PLAN_LISTING_API,
    FEE_WON_AND_LOST_TEAM_LISTING_API,
    RESYNC_FEE_WON_LOST_TEAM
} from "../../../api";
import { useEntity, useFormReducer, useOptions, usePagination, usePopupReducer } from "@wizehub/common/hooks";
import { FeeLostsEntity, FeeWonAndLostPlanEntity, FeeWonAndLostTeamEntity, FeeWonsEntity, PlanEntity } from "@wizehub/common/models/genericEntities";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import { HttpMethods } from "@wizehub/common/utils";
import { ResponsiveDayViewIcon } from "../../plan/budgetAndCapacity/budgetAndCapacity";
import { ResponsiveAddIcon } from "../../systemPreferences/launchPadSetup/launchPadSetup";
import { Id, MetaData, UserActionConfig, UserActionType, getDefaultMetaData } from "@wizehub/common/models";
import { paginatedFeeTeam } from "../fees";
import FeeWonAndLostPlanForm from "./feeWonAndLostPlanForm";
import NewClients from "./newClients";
import LostClients from "./lostClients";
import { greyScaleColour } from "@wizehub/common/theme/style.palette";
import ClientDetailsModal from "../../leadManagement/leadBoard/clientDetailsModal";
import LostClientsForm from "./lostClientsForm";
import { apiCall, hideLoader, showLoader } from "../../../redux/actions";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { StyledNoDataInfo, StyledNoDataInfoContainer } from "@wizehub/components/table/styles";
import NoTeamPopup from "./noTeamPopup";
import { ResponsiveSyncIcon } from "../../systemPreferences/launchPadSetup/launchPadSetupDetail";
import { StyledFeeWonAndLostButton } from "./styles";

interface Props { }

const feeWonAndLostTabs = [
    {
        id: 'newClients',
        label: messages?.measure?.financialOverview?.feesWonAndLost?.newClients
    },
    {
        id: 'lostClients',
        label: messages?.measure?.financialOverview?.feesWonAndLost?.lostClients
    }
];

const getDefaultFeeWonAndLostTeamFilter = (): MetaData<FeeWonAndLostTeamEntity> => ({
    ...getDefaultMetaData<FeeWonAndLostTeamEntity>(),
    direction: "desc",
});

const FeeWonAndLost: React.FC<Props> = () => {
    const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
    const [activeTab, setActiveTab] = useState<string>(feeWonAndLostTabs[0]?.id);
    const [feeWonsData, setFeeWonsData] = useState<FeeWonsEntity[]>(null);
    const [feeLostsData, setFeeLostsData] = useState<FeeLostsEntity[]>(null);
    const { connectField, formValues, change } = useFormReducer();
    const [activeTeam, setActiveTeam] = useState<Id>(null);

    const reduxDispatch = useDispatch();

    const {
        visibility: createPlanFormVisibility,
        showPopup: showCreatePlanForm,
        hidePopup: hideCreatePlanForm,
    } = usePopupReducer<UserActionConfig>();

    const {
        visibility: clientFormVisibility,
        showPopup: showClientForm,
        hidePopup: hideClientForm,
        metaData: clientConfig
    } = usePopupReducer<UserActionConfig>();

    const {
        visibility: lostClientFormVisibility,
        showPopup: showLostClientForm,
        hidePopup: hideLostClientForm,
        metaData: lostClientConfig
    } = usePopupReducer<UserActionConfig>();

    const {
        visibility: noTeamPopupVisibility,
        showPopup: showNoTeamPopup,
        hidePopup: hiideNoTeamPopup,
    } = usePopupReducer();

    const { options: planOptions, refreshOptions } = useOptions<FeeWonAndLostPlanEntity>(
        FEE_WON_AND_LOST_PLAN_LISTING_API.replace(":tenantId", tenantId),
        true
    );

    const { entity: planEntity, refreshEntity: refreshPlanEntity } = useEntity<PlanEntity>(
        ADD_PLAN,
        planOptions.filter(
            (planId) => planId?.id === formValues?.plan?.value?.id
        )[0]?.plan?.id
    );

    const { entity: feeWonAndLostTeam, applyFilters } = usePagination<FeeWonAndLostTeamEntity>(
        {
            ...paginatedFeeTeam,
            api: FEE_WON_AND_LOST_TEAM_LISTING_API.replace(":tenantId", tenantId).replace(
                ":feeWonLostId",
                planEntity?.planFeeWonLostId?.toString()
            ),
        },
        getDefaultFeeWonAndLostTeamFilter()
    );

    const feeWonAndLostTeamTabs = feeWonAndLostTeam?.records?.map((team) => {
        return {
            id: team?.id,
            label: team?.team?.name,
        };
    });

    const handleResyncTeam = async () => {
        const sanitizedBody = {
            tenantId: tenantId,
            feeWonLostId: planEntity?.planFeeWonLostId,
        };
        return new Promise((resolve, reject) => {
            reduxDispatch(
                apiCall(
                    RESYNC_FEE_WON_LOST_TEAM,
                    resolve,
                    reject,
                    HttpMethods.POST,
                    sanitizedBody
                )
            );
        })
            .then(() => {
                applyFilters();
            })
            .catch((error) => {
                console.log(error)
            });
    };

    const getFeeWonsClientsData = async () => {
        return new Promise<void>((resolve, reject) => {
            reduxDispatch(
                apiCall(
                    FEE_WONS_LISTING_API.replace(":tenantId", tenantId).replace(
                        ":feeWonLostId",
                        planEntity?.planFeeWonLostId?.toString()
                    ).replace(
                        ":feeWonLostTeamId",
                        activeTeam?.toString()
                    ),
                    resolve,
                    reject,
                    HttpMethods.GET
                )
            );
        }).then((res: any) => {
            setFeeWonsData(res?.records);
        }).catch((error) => { console.log(error?.message) });
    }

    const getFeeLostsClientsData = async () => {
        return new Promise<void>((resolve, reject) => {
            reduxDispatch(
                apiCall(
                    FEE_LOSTS_LISTING_API.replace(":tenantId", tenantId).replace(
                        ":feeWonLostId",
                        planEntity?.planFeeWonLostId?.toString()
                    ).replace(
                        ":feeWonLostTeamId",
                        activeTeam?.toString()
                    ),
                    resolve,
                    reject,
                    HttpMethods.GET
                )
            );
        }).then((res: any) => {
            setFeeLostsData(res?.records);
        }).catch((error) => { console.log(error?.message) });
    }

    useEffect(() => {
        if (!formValues?.plan?.value?.id && planOptions.length > 0) {
            change("plan", {
                id: planOptions[0]?.id,
                label: planOptions[0]?.plan?.name,
            });
            refreshPlanEntity();
        }
    }, [planOptions]);

    useEffect(() => {
        if (feeWonAndLostTeamTabs && !activeTeam) {
            setActiveTeam(feeWonAndLostTeamTabs[0]?.id);
        }
    }, [feeWonAndLostTeamTabs]);

    useEffect(() => {
        if (formValues?.plan?.value?.id) {
            reduxDispatch(showLoader());
            setTimeout(() => {
                reduxDispatch(hideLoader());
            }, 800);
            refreshPlanEntity();
        }
    }, [formValues?.plan?.value?.id]);

    useEffect(() => {
        if (feeWonAndLostTeam?.metadata?.total) {
            setActiveTeam(feeWonAndLostTeam?.records[0]?.id);
        }
    }, [feeWonAndLostTeam, formValues?.plan?.value?.id]);

    useEffect(() => {
        if (planEntity) {
            applyFilters();
        }
    }, [planEntity]);

    return (
        <Container noPadding>
            <StyledMainHeadingContainer>
                <StyledBudgestAndCapacityLeftHeadingContainer container xs={7}>
                    <StyledHeadingTypography>
                        {messages?.measure?.financialOverview?.feesWonAndLost?.heading}
                    </StyledHeadingTypography>
                    <Grid container item xs={4} gap={2}>
                        <Grid item xs={7}>
                            {connectField("plan", {
                                label: messages?.measure?.financialOverview?.fees?.plan,
                                options: planOptions?.map((item: FeeWonAndLostPlanEntity) => {
                                    return {
                                        id: item?.id,
                                        label: item?.plan?.name
                                    }
                                }),
                            })(MaterialAutocompleteInput)}
                        </Grid>
                        <Grid item xs={3}>
                            <Button
                                startIcon={<ResponsiveDayViewIcon />}
                                variant="text"
                                color="primary"
                                label={messages?.measure?.financialOverview?.fees?.plan}
                                onClick={() => {
                                    showCreatePlanForm();
                                }}
                            />
                        </Grid>
                    </Grid>
                </StyledBudgestAndCapacityLeftHeadingContainer>
                <StyledMainHeadingButtonContainer>
                    <StyledFeeWonAndLostButton
                        variant="outlined"
                        label={messages?.measure?.financialOverview?.feesWonAndLost?.aboutFeeWonLost}
                        onClick={() => { }}
                    />
                    <Button
                        startIcon={<ResponsiveSyncIcon />}
                        variant="outlined"
                        color="secondary"
                        label={messages?.measure?.financialOverview?.fees?.resyncTeam}
                        onClick={() => handleResyncTeam()}
                    />
                    <Button
                        startIcon={<ResponsiveAddIcon />}
                        variant="contained"
                        color="primary"
                        label={messages?.measure?.financialOverview?.feesWonAndLost?.newClient}
                        onClick={() => {
                            !feeWonAndLostTeam?.metadata?.total
                                ? showNoTeamPopup()
                                : activeTab === feeWonAndLostTabs[1]?.id
                                    ? showLostClientForm()
                                    : showClientForm()
                        }}
                    />
                </StyledMainHeadingButtonContainer>
            </StyledMainHeadingContainer>

            {feeWonAndLostTeam?.metadata?.total
                ? <StyledMainCardHeaderContainer>
                    <Grid
                        container
                        item
                        xs={2}
                        display="flex"
                        flexDirection="column"
                        height="calc(100vh - 200px)"
                        overflow="auto"
                        sx={{ backgroundColor: greyScaleColour.grey60 }}
                    >
                        <MultiTabComponent
                            tabs={feeWonAndLostTeamTabs}
                            activeTab={activeTeam}
                            setActiveTab={setActiveTeam}
                            orientation="vertical"
                            noBackgroundColor={true}
                        />
                    </Grid>
                    <Divider orientation="vertical" sx={{ marginLeft: "10px" }} />
                    <Grid container item xs={10} height="fit-content">
                        <Grid container item xs={12} ml="10px">
                            <MultiTabComponent
                                tabs={feeWonAndLostTabs}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                            />
                        </Grid>
                        <Grid container item xs={12}>
                            {activeTab === feeWonAndLostTabs[0]?.id && (
                                <NewClients
                                    showClientForm={showClientForm}
                                    feeWonAndLostId={planEntity?.planFeeWonLostId?.toString()}
                                    feeWonAndLostTeamId={activeTeam}
                                    getFeeWonsClientsData={getFeeWonsClientsData}
                                    feeWonsData={feeWonsData}
                                />
                            )}
                            {activeTab === feeWonAndLostTabs[1]?.id && (
                                <LostClients
                                    showLostClientForm={showLostClientForm}
                                    feeWonAndLostId={planEntity?.planFeeWonLostId?.toString()}
                                    feeWonAndLostTeamId={activeTeam}
                                    getFeeLostsClientsData={getFeeLostsClientsData}
                                    feeLostsData={feeLostsData}
                                />
                            )}
                        </Grid>
                    </Grid>
                </StyledMainCardHeaderContainer>
                : <StyledNoDataInfoContainer>
                    <StyledNoDataInfo>
                        {messages?.firmProfile?.teamStructure?.noTeamFound}
                    </StyledNoDataInfo>
                </StyledNoDataInfoContainer>}
            <Modal
                show={createPlanFormVisibility}
                heading={messages?.measure?.financialOverview?.feesWonAndLost?.planForm?.heading}
                onClose={() => {
                    refreshOptions();
                    hideCreatePlanForm();
                }}
                fitContent
            >
                <FeeWonAndLostPlanForm
                    onCancel={hideCreatePlanForm}
                    onSuccess={() => {
                        hideCreatePlanForm();
                    }}
                />
            </Modal>

            <Modal
                show={clientFormVisibility}
                heading={clientConfig?.type === UserActionType.EDIT
                    ? messages?.general?.edit
                    : messages?.measure?.financialOverview?.feesWonAndLost?.newClient}
                onClose={hideClientForm}
                fitContent
            >
                <ClientDetailsModal
                    onCancel={hideClientForm}
                    onSuccess={() => {
                        hideClientForm();
                        toast(() => (
                            <Toast text={clientConfig?.type === UserActionType.EDIT
                                ? messages?.measure?.financialOverview?.feesWonAndLost?.newClientsTab?.success?.updated
                                : messages?.measure?.financialOverview?.feesWonAndLost?.newClientsTab?.success?.created} />
                        ))
                        getFeeWonsClientsData();
                    }}
                    endpoint={clientConfig?.type === UserActionType.EDIT
                        ? `${FEE_WONS_API}/${clientConfig?.id}`
                        : FEE_WONS_API
                    }
                    isEdit={clientConfig?.type === UserActionType.EDIT}
                    clientId={clientConfig?.id}
                    feeWonAndLostId={planEntity?.planFeeWonLostId}
                    feeWonAndLostTeamId={activeTeam}
                />
            </Modal>

            <Modal
                show={lostClientFormVisibility}
                heading={lostClientConfig?.type === UserActionType.EDIT
                    ? messages?.general?.edit
                    : messages?.measure?.financialOverview?.feesWonAndLost?.newClient}
                onClose={hideLostClientForm}
                fitContent
            >
                <LostClientsForm
                    onCancel={hideLostClientForm}
                    onSuccess={() => {
                        hideLostClientForm();
                        toast(() => (
                            <Toast text={lostClientConfig?.type === UserActionType.EDIT
                                ? messages?.measure?.financialOverview?.feesWonAndLost?.lostClientsTab?.success?.updated
                                : messages?.measure?.financialOverview?.feesWonAndLost?.lostClientsTab?.success?.created} />
                        ))
                        getFeeLostsClientsData();
                    }}
                    isEdit={lostClientConfig?.type === UserActionType.EDIT}
                    clientId={lostClientConfig?.id}
                    feeWonAndLostId={planEntity?.planFeeWonLostId}
                    feeWonAndLostTeamId={activeTeam}
                />
            </Modal>

            <Modal
                show={noTeamPopupVisibility}
                onClose={hiideNoTeamPopup}
                fitContent
            >
                <NoTeamPopup
                    onSuccess={hiideNoTeamPopup}
                    body={messages?.measure?.financialOverview?.feesWonAndLost?.body}
                />
            </Modal>
        </Container>
    )
};

export default FeeWonAndLost;