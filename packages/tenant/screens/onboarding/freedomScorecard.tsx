import React, { useEffect, useState } from "react";
import { Container } from "../../components";
import { Box, Grid } from "@mui/material";
import {
    StyledCheckCircleIcon,
    StyledDivider,
    StyledFreedomStepsContainer,
    StyledLeftStepsContainer,
    StyledLeftStepsContentContainer,
    StyledLeftStepsContentImage,
    StyledLeftStepsContentImageContainer,
    StyledLeftStepsContentName,
    StyledLeftStepsContentValue,
    StyledLeftStepsHeading1,
    StyledLeftStepsHeading2,
    StyledLeftStepsHeadingContainer,
    StyledRightStepsContainer,
    StyledRightStepsFirstContainer,
    StyledRightStepsFirstSubContainer,
    StyledRightStepsFirstSubContainerHeading,
    StyledRightStepsFirstSubContainerSubHeading,
    StyledRightStepsSecondContainer,
    StyledRightStepsSecondSubContainer,
    StyledRightStepsSecondSubContainerContent,
    StyledRightStepsSecondSubContainerHeading,
    StyledRightStepsSecondSubContainerSubHeading,
    StyledStepsHeadingContainer,
    StyledStepsInfoContainer,
    StyledStepsInfoSubContainer
} from "./styles";
import FreedomScorecardImage from '../../assets/images/freedomScorecard.png';
import { Button } from "@wizehub/components";
import messages from "../../messages";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { push } from "connected-react-router";
import { useDispatch } from "react-redux";
import { routes } from "../../utils";
import { useSelector } from "react-redux";
import { ReduxState } from "../../redux/reducers";
import { FIRM_DETAIL_BY_ID, GET_TENANT_FORMS } from "../../api";
import { useEntity } from "@wizehub/common/hooks";
import { FirmProfileEntity, TenantFormData } from "@wizehub/common/models/genericEntities";
import { apiCall } from "../../redux/actions";
import { HttpMethods } from "@wizehub/common/utils";
import { TenantFormsCode } from "../../utils/constant";

const FreedomScorecardComponent = () => {
    const reduxDispatch = useDispatch();
    const [isFormCompleted, setIsFormCompleted] = useState<boolean>(false);

    const { profile: userProfile, tenantData } = useSelector(
        (state: ReduxState) => state
    );
    const { entity: firmDetail } = useEntity<FirmProfileEntity>(
        FIRM_DETAIL_BY_ID,
        tenantData?.tenantId
    );

    const getTenantForms = async (isPrev?: boolean) => {
        return (
            new Promise((resolve, reject) => {
                reduxDispatch(
                    apiCall(
                        GET_TENANT_FORMS.replace(':tenantId', tenantData?.tenantId).replace(':code', TenantFormsCode.businessAssessment),
                        resolve,
                        reject,
                        HttpMethods.GET
                    )
                );
            })
                .then((res: TenantFormData) => {
                    if (res?.completionStatus === "COMPLETED") {
                        setIsFormCompleted(true);
                    }
                })
                .catch((error) => {
                    console.log(error, "error");
                })
        )
    }

    useEffect(() => {
        if (tenantData?.tenantId) {
            getTenantForms();
        }
    }, [tenantData?.tenantId])

    const renderDetailsInfo = (heading: string, value: string) => (
        <StyledRightStepsFirstSubContainer container>
            <Grid item>
                <StyledRightStepsFirstSubContainerHeading>
                    {heading}
                </StyledRightStepsFirstSubContainerHeading>
            </Grid>
            <Grid item>
                <StyledDivider />
            </Grid>
            <Grid item>
                <StyledRightStepsFirstSubContainerSubHeading>
                    {value}
                </StyledRightStepsFirstSubContainerSubHeading>
            </Grid>
        </StyledRightStepsFirstSubContainer>
    );

    const renderStepsContainer = (
        heading1: string,
        content1: string,
        heading2: string,
        content2: string,
    ) => (
        <StyledStepsInfoSubContainer container>
            <Grid item>
                {renderStepsInfo(
                    heading1,
                    content1
                )}
            </Grid>
            <Grid item>
                {renderStepsInfo(
                    heading2,
                    content2
                )}
            </Grid>
        </StyledStepsInfoSubContainer>
    );

    const renderStepsInfo = (heading: string, content: string) => (
        <StyledLeftStepsContentContainer container>
            <Grid item>
                <StyledStepsHeadingContainer container>
                    <Grid item>
                        <StyledCheckCircleIcon />
                    </Grid>
                    <Grid item>
                        <StyledRightStepsFirstSubContainerSubHeading>
                            {heading}
                        </StyledRightStepsFirstSubContainerSubHeading>
                    </Grid>
                </StyledStepsHeadingContainer>
            </Grid>
            <Grid item>
                <StyledDivider />
            </Grid>
            <Grid item>
                <StyledRightStepsFirstSubContainerHeading>
                    {content}
                </StyledRightStepsFirstSubContainerHeading>
            </Grid>
        </StyledLeftStepsContentContainer>
    );

    return (
        <Container noPadding hasHeader={false} hideSidebar>
            <StyledFreedomStepsContainer>
                <Box display="flex" flex="2">
                    <StyledLeftStepsContainer container>
                        <Grid item>
                            <StyledLeftStepsHeadingContainer container>
                                <Grid item>
                                    <StyledLeftStepsHeading1>
                                        {messages?.businessAssessment?.heading}
                                    </StyledLeftStepsHeading1>
                                </Grid>
                                <Grid item>
                                    <StyledLeftStepsHeading2>
                                        {messages?.onBoarding?.freedomScorecardSteps?.heading}
                                    </StyledLeftStepsHeading2>
                                </Grid>
                            </StyledLeftStepsHeadingContainer>
                        </Grid>
                        <Grid item>
                            <StyledLeftStepsContentContainer container>
                                <Grid item>
                                    <StyledLeftStepsContentImageContainer>
                                        <StyledLeftStepsContentImage
                                            src={FreedomScorecardImage}
                                            alt="freedom-scorecard"
                                        />
                                    </StyledLeftStepsContentImageContainer>
                                </Grid>
                                <Grid item>
                                    <StyledLeftStepsContentValue>
                                        {messages?.onBoarding?.freedomScorecardSteps?.subHeading}
                                        <StyledLeftStepsContentName>- DAVID STARR JORDAN</StyledLeftStepsContentName>
                                    </StyledLeftStepsContentValue>
                                </Grid>
                            </StyledLeftStepsContentContainer>
                        </Grid>
                    </StyledLeftStepsContainer>
                </Box>
                <Box display="flex" flex="3">
                    <StyledRightStepsContainer container>
                        <Grid item>
                            <StyledRightStepsFirstContainer container>
                                <Grid item>
                                    {renderDetailsInfo(
                                        messages?.leadManagement?.labels?.businessName,
                                        firmDetail?.name || '-'
                                    )}
                                </Grid>
                                <Grid item>
                                    {renderDetailsInfo(
                                        messages?.profile?.generalInformation?.name,
                                        (userProfile?.firstName && userProfile?.lastName)
                                            ? `${userProfile?.firstName} ${userProfile.lastName}` : '-'
                                    )}
                                </Grid>
                            </StyledRightStepsFirstContainer>
                        </Grid>

                        <Grid item>
                            <StyledRightStepsSecondContainer container>
                                <Grid item>
                                    <StyledRightStepsSecondSubContainer container>
                                        <StyledRightStepsSecondSubContainerContent item>
                                            <StyledRightStepsSecondSubContainerHeading>
                                                {messages?.onBoarding?.heading}
                                            </StyledRightStepsSecondSubContainerHeading>
                                            <StyledRightStepsSecondSubContainerSubHeading>
                                                {messages?.onBoarding?.freedomScorecardSteps?.meetingAgenda}
                                            </StyledRightStepsSecondSubContainerSubHeading>
                                        </StyledRightStepsSecondSubContainerContent>
                                        <Grid item>
                                            <StyledStepsInfoContainer container>
                                                <Grid item>
                                                    {renderStepsContainer(
                                                        messages?.onBoarding?.phaseHeading1,
                                                        messages?.onBoarding?.freedomScorecardSteps?.discoverHeading,
                                                        messages?.onBoarding?.phaseHeading3,
                                                        messages?.onBoarding?.freedomScorecardSteps?.executeHeading,
                                                    )}
                                                </Grid>
                                                <Grid item>
                                                    {renderStepsContainer(
                                                        messages?.onBoarding?.phaseHeading2,
                                                        messages?.onBoarding?.freedomScorecardSteps?.planHeading,
                                                        messages?.onBoarding?.phaseHeading4,
                                                        messages?.onBoarding?.freedomScorecardSteps?.measureHeading
                                                    )}
                                                </Grid>
                                            </StyledStepsInfoContainer>
                                        </Grid>
                                    </StyledRightStepsSecondSubContainer>
                                </Grid>
                                <Grid item>
                                    <Button
                                        label={messages?.onBoarding?.trial?.beginBtn}
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        endIcon={<ArrowForwardIcon />}
                                        onClick={() => {
                                            reduxDispatch(
                                                push(isFormCompleted
                                                    ? routes.businessScoreccards.summary
                                                    : routes.businessScoreccards.businessAssessment)
                                            )
                                        }}
                                    />
                                </Grid>
                            </StyledRightStepsSecondContainer>
                        </Grid>
                    </StyledRightStepsContainer>
                </Box>
            </StyledFreedomStepsContainer>
        </Container>
    )
};

export default FreedomScorecardComponent;