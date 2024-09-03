import { Grid } from "@mui/material";
import { Button } from "@wizehub/components";
import React from "react";
import {
    StyledDoDisturbOutlinedIcon,
    StyledFormContainer,
    StyledNoAccessSubHeading,
    StyledScreenWrapper,
    StyledSuccessHeading,
} from "./styles";
import { Container } from "../../components";
import { SidePanel } from "../auth";
import { useDispatch } from "react-redux";
import messages from "../../messages";
import { push } from "connected-react-router";
import { routes } from "../../utils";
import { removeToken, updateTenantId } from "../../redux/actions";

interface Props {
}

const NoAccessComponent: React.FC<Props> = () => {
    const reduxDispatch = useDispatch();

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
                            <StyledDoDisturbOutlinedIcon />
                        </Grid>
                        <Grid item>
                            <StyledSuccessHeading>
                                {messages?.noAccess?.heading}
                            </StyledSuccessHeading>
                        </Grid>
                        <Grid item textAlign="center">
                            <StyledNoAccessSubHeading>
                                {messages?.noAccess?.subHeading}
                            </StyledNoAccessSubHeading>
                        </Grid>
                        <Grid item width="340px">
                            <Button
                                label="Logout"
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={() => {
                                    reduxDispatch(removeToken());
                                    reduxDispatch(updateTenantId(""));
                                    reduxDispatch(push(routes.login));
                                }}
                            />
                        </Grid>
                    </Grid >
                </StyledFormContainer>
            </StyledScreenWrapper>
        </Container>
    )
};

export default NoAccessComponent;