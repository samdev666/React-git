import React, { useEffect, useState } from "react";
import { Container } from "../../components";
import { Card } from "@wizehub/components";
import { StyledWizeGapFormHeadingContainer } from "../wizegapForms/styles";
import { Box, Grid } from "@mui/material";
import { StyledOnboardingHeading } from "../onboarding/styles";
import {
    StyledContainer,
    StyledContainerText,
    StyledFormatQuoteOutlinedIcon,
    StyledIconContainer,
    StyledIconHeading,
    StyledWizeGapLink
} from "./styles";
import { routes } from "../../utils";
import messages from "../../messages";
import { GET_TENANT_FORMS } from "../../api";
import { apiCall } from "../../redux/actions";
import { TenantFormData } from "@wizehub/common/models/genericEntities";
import { HttpMethods } from "@wizehub/common/utils";
import { TenantFormsCode } from "../../utils/constant";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { ReduxState } from "../../redux/reducers";
import { push } from "connected-react-router";

interface Props { }

const Overview: React.FC<Props> = () => {
    const reduxDispatch = useDispatch();
    const { tenantId } = useSelector((state: ReduxState) => state.tenantData);
    const [isWizegapCompleted, setIsWizegapCompleted] = useState<boolean>(false);

    const getTenantForms = async () => {
        return (
            new Promise((resolve, reject) => {
                reduxDispatch(
                    apiCall(
                        GET_TENANT_FORMS.replace(':tenantId', tenantId).replace(':code', TenantFormsCode.wizeGap),
                        resolve,
                        reject,
                        HttpMethods.GET
                    )
                );
            })
                .then((res: TenantFormData) => {
                    if (res?.completionStatus !== "COMPLETED") {
                        setIsWizegapCompleted(true);
                    }
                })
                .catch((error) => {
                    console.log(error, "error");
                })
        )
    }

    useEffect(() => {
        if (tenantId) getTenantForms();
    }, [tenantId])

    return (
        <Container noPadding>
            <Card
                cardCss={{
                    margin: '10px 20px 10px 20px',
                    border: 'none',
                    overflow: 'visible'
                }}
                header={
                    <StyledWizeGapFormHeadingContainer container>
                        <Grid item>
                            <StyledOnboardingHeading>
                                {messages?.sidebar?.menuItems?.mainMenuItems?.overview}
                            </StyledOnboardingHeading>
                        </Grid>
                    </StyledWizeGapFormHeadingContainer>
                }
                noHeaderPadding
                contentCss={{
                    marginTop: '10px'
                }}
            >
                <Box display={"flex"} gap="20px">
                    <StyledContainer isCompleted={!isWizegapCompleted}>
                        <Grid container display={"flex"} gap="16px" alignItems={"center"}>
                            <Grid item>
                                <StyledIconContainer>
                                    <StyledFormatQuoteOutlinedIcon />
                                </StyledIconContainer>
                            </Grid>
                            <Grid item>
                                <StyledIconHeading>
                                    {messages?.overview?.quoteHeading}
                                </StyledIconHeading>
                            </Grid>
                        </Grid>
                        <div>
                            <StyledContainerText>
                                {messages?.overview?.quoteText}
                            </StyledContainerText>
                        </div>
                    </StyledContainer>
                    {isWizegapCompleted &&
                        <StyledContainer onClick={() => reduxDispatch(push(routes.wizegapForms))}>
                            <Grid container display={"flex"} gap="16px" alignItems={"center"}>
                                <Grid item>
                                    <StyledIconContainer>
                                        {'\u{1F44B}'}
                                    </StyledIconContainer>
                                </Grid>
                                <Grid item>
                                    <StyledIconHeading>
                                        {messages?.overview?.wizeGapHeading}
                                    </StyledIconHeading>
                                </Grid>
                            </Grid>
                            <div>
                                <StyledWizeGapLink>
                                    <StyledContainerText>
                                        {messages?.overview?.wizeGapText}
                                    </StyledContainerText>
                                </StyledWizeGapLink>
                            </div>
                        </StyledContainer>}
                </Box>
            </Card>
        </Container>
    )
}

export default Overview;