import React from "react";
import { Container } from "../../components";
import { Button, Card } from "@wizehub/components";
import { Divider, Grid } from "@mui/material";
import { StyledArrowForwardIcon, StyledGradientDiv } from "../auth/styles";
import WizeHubCommunity from '../../assets/images/wizehub-community.png';
import {
    StyledCheckIcon,
    StyledOnboardingChartContainer,
    StyledOnboardingContainer,
    StyledOnboardingContentContainer,
    StyledOnboardingHeading,
    StyledOnboardingPhaseRowContainer,
    StyledOnboardingSubHeading,
    StyledPhaseHeading,
    StyledPhaseSubHeading,
    StyledWizehubCommunityImage,
    StyledWizehubCommunityImageContainer
} from "./styles";
import messages from "../../messages";
import { push } from "connected-react-router";
import { routes } from "../../utils";
import { useDispatch } from "react-redux";

const OnboardingPage = () => {
    const reduxDispatch = useDispatch();
    return (
        <Container noPadding>
            <Card
                noHeaderPadding
                cardCss={{
                    border: 'none',
                    padding: '0px 20px 10px 20px'
                }}
                header={
                    <StyledOnboardingContainer container>
                        <Grid item>
                            <StyledOnboardingHeading>
                                {messages?.onBoarding?.heading}
                            </StyledOnboardingHeading>
                        </Grid>
                        <Grid item>
                            <StyledOnboardingSubHeading>
                                {messages?.onBoarding?.subHeading}
                            </StyledOnboardingSubHeading>
                        </Grid>
                        <Grid item>
                            <Divider />
                        </Grid>
                    </StyledOnboardingContainer>
                }
            >
                <Grid container padding={"18px 0px"}>
                    <Grid item xs={6} display='flex' flexDirection='column'>
                        <StyledOnboardingContentContainer container>
                            <StyledOnboardingPhaseRowContainer container item>
                                <Grid container xs={5.4} display="flex" flexDirection="column" gap="12px">
                                    <Grid item>
                                        <Grid container gap="9px" display="flex" alignItems="center">
                                            <Grid item>
                                                <StyledGradientDiv>
                                                    <StyledCheckIcon />
                                                </StyledGradientDiv>
                                            </Grid>
                                            <Grid item>
                                                <StyledPhaseHeading>
                                                    {messages?.onBoarding?.phaseHeading1}
                                                </StyledPhaseHeading>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        <StyledPhaseSubHeading>
                                            {messages?.onBoarding?.phaseSubHeading1}
                                        </StyledPhaseSubHeading>
                                    </Grid>
                                </Grid>
                                <Grid item xs={5.4}>
                                    <Grid container display="flex" flexDirection="column" gap="12px">
                                        <Grid item>
                                            <Grid container gap="9px" display="flex" alignItems="center">
                                                <Grid item>
                                                    <StyledGradientDiv>
                                                        <StyledCheckIcon />
                                                    </StyledGradientDiv>
                                                </Grid>
                                                <Grid item>
                                                    <StyledPhaseHeading>
                                                        {messages?.onBoarding?.phaseHeading2}
                                                    </StyledPhaseHeading>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item>
                                            <StyledPhaseSubHeading>
                                                {messages?.onBoarding?.phaseSubHeading1}
                                            </StyledPhaseSubHeading>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </StyledOnboardingPhaseRowContainer>

                            <StyledOnboardingPhaseRowContainer container item>
                                <Grid item xs={5.4}>
                                    <Grid container display="flex" flexDirection="column" gap="12px">
                                        <Grid item>
                                            <Grid container gap="9px" display="flex" alignItems="center">
                                                <Grid item>
                                                    <StyledGradientDiv>
                                                        <StyledCheckIcon />
                                                    </StyledGradientDiv>
                                                </Grid>
                                                <Grid item>
                                                    <StyledPhaseHeading>
                                                        {messages?.onBoarding?.phaseHeading3}
                                                    </StyledPhaseHeading>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item>
                                            <StyledPhaseSubHeading>
                                                {messages?.onBoarding?.phaseSubHeading1}
                                            </StyledPhaseSubHeading>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={5.4}>
                                    <Grid container display="flex" flexDirection="column" gap="12px">
                                        <Grid item>
                                            <Grid container gap="9px" display="flex" alignItems="center">
                                                <Grid item>
                                                    <StyledGradientDiv>
                                                        <StyledCheckIcon />
                                                    </StyledGradientDiv>
                                                </Grid>
                                                <Grid item>
                                                    <StyledPhaseHeading>
                                                        {messages?.onBoarding?.phaseHeading4}
                                                    </StyledPhaseHeading>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item>
                                            <StyledPhaseSubHeading>
                                                {messages?.onBoarding?.phaseSubHeading1}
                                            </StyledPhaseSubHeading>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </StyledOnboardingPhaseRowContainer>

                            <StyledOnboardingPhaseRowContainer container item>
                                <Grid item xs={5.4}>
                                    <Grid container display="flex" flexDirection="column" gap="12px">
                                        <Grid item>
                                            <Grid container gap="9px" display="flex" alignItems="center">
                                                <Grid item>
                                                    <StyledGradientDiv>
                                                        <StyledCheckIcon />
                                                    </StyledGradientDiv>
                                                </Grid>
                                                <Grid item>
                                                    <StyledPhaseHeading>
                                                        {messages?.onBoarding?.phaseHeading5}
                                                    </StyledPhaseHeading>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item>
                                            <StyledPhaseSubHeading>
                                                {messages?.onBoarding?.phaseSubHeading1}
                                            </StyledPhaseSubHeading>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </StyledOnboardingPhaseRowContainer>
                        </StyledOnboardingContentContainer>
                    </Grid>
                    <Grid item xs={6} display='flex' flexDirection='column'>
                        <StyledOnboardingChartContainer container display='flex' flexDirection="column" alignItems="center">
                            <StyledWizehubCommunityImageContainer item>
                                <StyledWizehubCommunityImage src={WizeHubCommunity} />
                            </StyledWizehubCommunityImageContainer>
                            <Grid item>
                                <Button
                                    label={messages?.onBoarding?.btnText}
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    endIcon={<StyledArrowForwardIcon />}
                                    onClick={() => {
                                        reduxDispatch(push(routes.wizegapForms));
                                    }}
                                />
                            </Grid>
                        </StyledOnboardingChartContainer>
                    </Grid>
                </Grid>
            </Card>
        </Container>
    )
};

export default OnboardingPage;