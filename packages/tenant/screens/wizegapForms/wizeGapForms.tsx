import React, { useEffect, useState } from "react";
import { Container } from "../../components";
import { useDispatch } from "react-redux";
import { apiCall, hideLoader, setCurrentStep, showLoader } from "../../redux/actions";
import { GET_TENANT_FORMS } from "../../api";
import { HttpMethods } from "@wizehub/common/utils";
import { FormComponent } from "../forms";
import { Divider, Grid } from "@mui/material";
import { StyledWizeGapCard, StyledWizeGapFormHeadingContainer } from "./styles";
import { useSelector } from "react-redux";
import { ReduxState } from "../../redux/reducers";
import messages from "../../messages";
import { TenantFormData } from "@wizehub/common/models/genericEntities";
import { StyledOnboardingHeading } from "../onboarding/styles";
import { TenantFormsCode } from "../../utils/constant";
import FormCompletion from "./formCompletion";
import { Button } from "@wizehub/components";
import { push } from "connected-react-router";
import { routes } from "../../utils";
import SkipNextIcon from '@mui/icons-material/SkipNext';

const WizeGapForms = () => {
    const [formData, setFormData] = useState<TenantFormData>(null);
    const reduxDispatch = useDispatch();
    const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
    const [isPrevValue, setIsPrevValue] = useState<boolean>(false);

    const getTenantForms = async (isPrev?: boolean) => {
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
                    setFormData(res);
                    setIsPrevValue(isPrev);
                })
                .catch((error) => {
                    console.log(error, "error");
                    reduxDispatch(hideLoader());
                })
        )
    }

    useEffect(() => {
        reduxDispatch(setCurrentStep(0));
    }, [])

    useEffect(() => {
        if (tenantId) {
            reduxDispatch(showLoader());
            getTenantForms();
        }
    }, [tenantId])


    return (
        <Container noPadding>
            <StyledWizeGapCard
                header={
                    <StyledWizeGapFormHeadingContainer container>
                        <Grid item>
                            <Grid container display={"flex"} justifyContent={"space-between"}>
                                <Grid item>
                                    <StyledOnboardingHeading>
                                        {messages?.wizeGapForms?.heading}
                                    </StyledOnboardingHeading>
                                </Grid>
                                <Grid item>
                                    <Button
                                        endIcon={<SkipNextIcon />}
                                        variant="outlined"
                                        color="secondary"
                                        label={messages?.wizeGapForms?.btnText}
                                        onClick={() => {
                                            reduxDispatch(push(routes.overview));
                                        }}
                                    />
                                </Grid>
                            </Grid>

                        </Grid>
                        <Grid item>
                            <Divider />
                        </Grid>
                    </StyledWizeGapFormHeadingContainer>
                }
            >
                <FormComponent
                    tenantFormsData={formData}
                    getTenantForms={getTenantForms}
                    code={TenantFormsCode.wizeGap}
                    formCompletionComponent={FormCompletion}
                    isPrevValue={isPrevValue}
                />
            </StyledWizeGapCard>
        </Container>
    )
};

export default WizeGapForms;