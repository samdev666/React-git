import { Grid } from "@mui/material";
import { Button } from "@wizehub/components";
import React, { useEffect } from "react";
import messages from "../../messages";
import {
    StyledArrowForwardIcon,
    StyledFormContainer,
    StyledScreenWrapper,
    StyledSuccessHeading,
    StyledSuccessIconContainer,
    StyledSuccessLoaderImage,
    StyledSuccessSubHeading
} from "../auth/styles";
import { Container } from "../../components";
import { SidePanel } from "../auth";
import { push } from "connected-react-router";
import { routes } from "../../utils";
import { useDispatch } from "react-redux";
import SuccessLoader from '../../assets/images/success-loader.gif';

interface Props {
}

const SuccessComponent: React.FC<Props> = () => {
    const reduxDispatch = useDispatch();

    useEffect(() => {
        setTimeout(() => {
            reduxDispatch(push(routes.onboarding))
        }, 4000);
    }, [])

    const handleClick = () => reduxDispatch(push(routes.onboarding));

    return (
        <Container noPadding hasHeader={false} hideSidebar>
            <StyledScreenWrapper>
                <SidePanel />
                <StyledFormContainer>
                    <Grid
                        container
                        maxWidth={"340px"}
                        display="flex"
                        flexDirection="column"
                        gap="24px"
                        justifyContent={"center"}
                        alignItems={"center"}
                    >
                        <Grid item>
                            <StyledSuccessIconContainer>
                                <StyledSuccessLoaderImage src={SuccessLoader} alt="success" />
                            </StyledSuccessIconContainer>
                        </Grid>
                        <Grid item>
                            <StyledSuccessHeading>
                                {messages?.signup?.form?.successPage?.heading}
                            </StyledSuccessHeading>
                        </Grid>
                        <Grid item textAlign="center">
                            <StyledSuccessSubHeading>
                                {messages?.signup?.form?.successPage?.subHeading}
                            </StyledSuccessSubHeading>
                        </Grid>
                        <Grid item>
                            <Button
                                label={messages?.signup?.form?.successPage?.successButton}
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                endIcon={<StyledArrowForwardIcon />}
                                fullWidth
                                onClick={handleClick}
                            />
                        </Grid>
                    </Grid >
                </StyledFormContainer>
            </StyledScreenWrapper>
        </Container>
    )
};

export default SuccessComponent;