import React, { useEffect, useState } from "react";
import { Container } from "../../../components";
import { Card } from "@wizehub/components";
import { Divider, Grid } from "@mui/material";
import { FormComponent } from "../../forms";
import messages from "../../../messages";
import { GET_TENANT_FORMS } from "../../../api";
import { TenantFormData } from "@wizehub/common/models/genericEntities";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import { apiCall, hideLoader, setCurrentStep, showLoader } from "../../../redux/actions";
import { HttpMethods } from "@wizehub/common/utils";
import { StyledWizeGapFormHeadingContainer } from "../../wizegapForms/styles";
import { StyledOnboardingHeading } from "../../onboarding/styles";
import { TenantFormsCode } from "../../../utils/constant";

interface Props { }

const BusinessAssessmentForms: React.FC<Props> = () => {
    const reduxDispatch = useDispatch();
    const [formData, setFormData] = useState<TenantFormData>(null);
    const { tenantId } = useSelector((state: ReduxState) => state.tenantData);
    const [isPrevValue, setIsPrevValue] = useState<boolean>(false);

    const getTenantForms = async (isPrev?: boolean) => {
        return (
            new Promise((resolve, reject) => {
                reduxDispatch(
                    apiCall(
                        GET_TENANT_FORMS.replace(':tenantId', tenantId).replace(':code', TenantFormsCode.businessAssessment),
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
                    setFormData(null);
                    reduxDispatch(hideLoader());
                })
        )
    }

    useEffect(() => {
        reduxDispatch(setCurrentStep(0));
    }, [])

    useEffect(() => {
        if (tenantId) {
            reduxDispatch(setCurrentStep(0));
            reduxDispatch(showLoader());
            getTenantForms();
        }
    }, [tenantId])

    return (
        <Container noPadding>
            <Card
                cardCss={{
                    border: 'none',
                    padding: '0px 20px 10px 20px',
                }}
                header={
                    <StyledWizeGapFormHeadingContainer container>
                        <Grid item>
                            <StyledOnboardingHeading>
                                {messages?.businessAssessment?.heading}
                            </StyledOnboardingHeading>
                        </Grid>
                        <Grid item>
                            <Divider />
                        </Grid>
                    </StyledWizeGapFormHeadingContainer>
                }
                contentCss={{
                    maxHeight: 'calc(100vh - 211px) !important',
                    padding: '10px 0px'

                }}
            >
                {tenantId &&
                    <FormComponent
                        tenantFormsData={formData}
                        getTenantForms={getTenantForms}
                        code={TenantFormsCode.businessAssessment}
                        isPrevValue={isPrevValue}
                    />}
            </Card>
        </Container>
    )
};

export default BusinessAssessmentForms;