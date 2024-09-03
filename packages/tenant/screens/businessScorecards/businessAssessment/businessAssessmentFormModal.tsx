import { Grid } from "@mui/material";
import { Button } from "@wizehub/components";
import React from "react";
import { StyledSuccessIconContainer, StyledSuccessLoaderImage } from "../../auth/styles";
import SuccessLoader from '../../../assets/images/success-loader.gif';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
    StyledUpperContainer
} from "../../wizegapForms/styles";
import { push } from "connected-react-router";
import { setCurrentStep, updateAuthenticationStatus } from "../../../redux/actions";
import {
    StyledBusinessBottomContainer,
    StyledBusinessBottomContainerHeading,
    StyledBusinessUpperContainerHeading,
    StyledModalContainer
} from "./styles";
import messages from "../../../messages";
import { useDispatch } from "react-redux";
import { routes } from "../../../utils";
import { AuthenticationStatus } from "../../../redux/reducers/auth";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";

interface Props {
    showWizegapPopup: boolean;
}

const BusinessAssessmentFormModal: React.FC<Props> = ({ showWizegapPopup }) => {
    const reduxDispatch = useDispatch();
    const auth = useSelector((state: ReduxState) => state.auth);

    return (
        <StyledModalContainer container>
            <Grid item>
                <StyledUpperContainer container>
                    <Grid item>
                        <StyledSuccessIconContainer>
                            <StyledSuccessLoaderImage src={SuccessLoader} alt="success" />
                        </StyledSuccessIconContainer>
                    </Grid>
                    <Grid item>
                        <StyledBusinessUpperContainerHeading>
                            {messages?.wizeGapForms?.formCompletion?.congratulations}
                        </StyledBusinessUpperContainerHeading>
                    </Grid>
                </StyledUpperContainer>
            </Grid>
            <Grid item>
                <StyledBusinessBottomContainer container>
                    <Grid item>
                        <StyledBusinessBottomContainerHeading>
                            {messages?.businessAssessment?.formModal?.title}
                        </StyledBusinessBottomContainerHeading>
                    </Grid>
                    <Grid item>
                        <Button
                            label={messages?.businessAssessment?.formModal?.btnText}
                            type="submit"
                            variant="contained"
                            color="primary"
                            endIcon={<ArrowForwardIcon />}
                            onClick={() => {
                                if (auth.status !== AuthenticationStatus.AUTHENTICATED) {
                                    reduxDispatch(updateAuthenticationStatus(AuthenticationStatus.AUTHENTICATED));
                                }
                                reduxDispatch(push({
                                    pathname: routes.businessScoreccards.summary,
                                    state: showWizegapPopup
                                }))
                                reduxDispatch(setCurrentStep(0));
                            }}
                        />
                    </Grid>
                </StyledBusinessBottomContainer>
            </Grid>
        </StyledModalContainer>
    )
};

export default BusinessAssessmentFormModal;