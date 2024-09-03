import React, { useEffect, useState } from "react";
import { Container } from "../../components";
import { Box, Divider, Grid } from "@mui/material";
import { Button } from "@wizehub/components";
import { routes } from "../../utils";
import { push } from "connected-react-router";
import { useDispatch } from "react-redux";
import {
    StyleArrowForwardIcon,
    StyledAccoundReadyText,
    StyledAccountContainer,
    StyledAccountHeading,
    StyledAccountReadyContainer,
    StyledAccountSubHeading,
    StyledBoxHeading,
    StyledBoxSubHeading,
    StyledChartContainer,
    StyledChartHeading,
    StyledChartIconContainer,
    StyledChartSubHeading,
    StyledLeftBoxContainer,
    StyledNumberContainer,
    StyledNumberText,
    StyledPlanContainer,
    StyledPlanContentContainer,
    StyledPlanText,
    StyledRightBoxContainer,
    StyledRightContainerHeading,
    StyledToolContainer,
    StyledWelcomBoxContainer,
    StyledWelcomText
} from "./styles";
import messages from "../../messages";
import VectorIcon from '../../assets/images/Vector.svg';
import { AuthenticationStatus } from "../../redux/reducers/auth";
import { updateAuthenticationStatus } from "../../redux/actions";

interface Props {
}

const TrialPageComponent: React.FC<Props> = () => {
    const reduxDispatch = useDispatch();
    const [disableButton, setDisableButton] = useState<boolean>(true);

    useEffect(() => {
        setTimeout(() => {
            setDisableButton(false);
        }, 1500);
    }, [])

    const stepsArr: {
        numberText: string;
        heading: string;
        subHeading: string;
    }[] = [
            {
                numberText: '01',
                heading: messages?.onBoarding?.trial?.heading1,
                subHeading: messages?.onBoarding?.trial?.subHeading1,
            },
            {
                numberText: '02',
                heading: messages?.onBoarding?.trial?.heading2,
                subHeading: messages?.onBoarding?.trial?.subHeading2,
            },
            {
                numberText: '03',
                heading: messages?.onBoarding?.trial?.heading3,
                subHeading: messages?.onBoarding?.trial?.subHeading3,
            },
            {
                numberText: '04',
                heading: messages?.onBoarding?.trial?.heading4,
                subHeading: messages?.onBoarding?.trial?.subHeading4,
            },
        ]

    return (
        <Container noPadding hasHeader={false} hideSidebar>
            <Box display={"flex"}>
                <StyledLeftBoxContainer>
                    <StyledAccountContainer>
                        <Box>
                            <StyledAccountHeading>
                                {messages?.onBoarding?.trial?.accountHeading}
                            </StyledAccountHeading>
                        </Box>
                        <Box>
                            <StyledAccountSubHeading>
                                {messages?.onBoarding?.trial?.accountSubHeading}
                            </StyledAccountSubHeading>
                        </Box>
                    </StyledAccountContainer>

                    <StyledWelcomBoxContainer>
                        <Box>
                            <StyledWelcomText>
                                {messages?.onBoarding?.trial?.welcomeText}
                            </StyledWelcomText>
                        </Box>
                        <StyledPlanContainer>
                            {stepsArr.map(({
                                numberText,
                                heading,
                                subHeading
                            }) => (
                                <StyledPlanContentContainer>
                                    <Box>
                                        <StyledNumberContainer>
                                            <StyledNumberText>
                                                {numberText}
                                            </StyledNumberText>
                                        </StyledNumberContainer>
                                    </Box>
                                    <StyledPlanText>
                                        <Box>
                                            <StyledBoxHeading>
                                                {heading}
                                            </StyledBoxHeading>
                                        </Box>
                                        <Box>
                                            <Divider />
                                        </Box>
                                        <Box>
                                            <StyledBoxSubHeading>
                                                {subHeading}
                                            </StyledBoxSubHeading>
                                        </Box>
                                    </StyledPlanText>
                                </StyledPlanContentContainer>
                            ))}
                        </StyledPlanContainer>
                    </StyledWelcomBoxContainer>
                </StyledLeftBoxContainer>

                <StyledRightBoxContainer>
                    <StyledToolContainer>
                        <Box>
                            <StyledRightContainerHeading>
                                {messages?.onBoarding?.trial?.doYouKnow}
                            </StyledRightContainerHeading>
                        </Box>
                        <StyledChartContainer>
                            <Box>
                                <StyledChartHeading>
                                    {messages?.onBoarding?.trial?.chartHeading}
                                </StyledChartHeading>
                            </Box>
                            <Box>
                                <StyledChartSubHeading>
                                    {messages?.onBoarding?.trial?.chartSubHeading}
                                </StyledChartSubHeading>
                            </Box>
                            <StyledChartIconContainer>
                                <img src={VectorIcon} alt="vector" />
                            </StyledChartIconContainer>
                        </StyledChartContainer>
                    </StyledToolContainer>

                    <StyledChartIconContainer>
                        <Button
                            label={messages?.onBoarding?.trial?.appointmentBtn}
                            type="submit"
                            variant="outlined"
                            color="secondary"
                        />
                    </StyledChartIconContainer>

                    <StyledAccountReadyContainer>
                        <Box>
                            <StyledAccoundReadyText isDisable={disableButton}>
                                {messages?.onBoarding?.trial?.accountReady}
                            </StyledAccoundReadyText>
                        </Box>
                        <Box>
                            <Button
                                label={messages?.onBoarding?.trial?.beginBtn}
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={disableButton}
                                endIcon={<StyleArrowForwardIcon isDisable={disableButton} />}
                                onClick={() => {
                                    reduxDispatch(
                                        updateAuthenticationStatus(AuthenticationStatus.INCOMPLETE_BUSINESS_ASSESSMENT)
                                    );
                                    reduxDispatch(
                                        push(routes.freedomScorecardStep)
                                    )
                                }}
                            />
                        </Box>
                    </StyledAccountReadyContainer>
                </StyledRightBoxContainer>
            </Box>
        </Container>
    )
};

export default TrialPageComponent;