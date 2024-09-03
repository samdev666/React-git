import { Grid } from "@mui/material";
import { Button } from "@wizehub/components";
import React from "react";
import { StyledSuccessLoaderImage } from "../auth/styles";
import SuccessLoader from '../../assets/images/success-loader.gif';
import MovingOutlinedIcon from '@mui/icons-material/MovingOutlined';
import {
    StyledBottomContainer,
    StyledBottomContainerHeading,
    StyledBottomContainerSubHeading,
    StyledBottomSubContainer,
    StyledFormCompletionContainer,
    StyledUpperContainer,
    StyledUpperContainerHeading,
    StyledWizegapSuccessIconContainer
} from "./styles";
import messages from "../../messages";
import { routes } from "../../utils";
import { push } from "connected-react-router";
import { useDispatch } from "react-redux";
import { setCurrentStep } from "../../redux/actions";

const FormCompletion = () => {
    const reduxDispatch = useDispatch();
    return (
        <StyledFormCompletionContainer container>
            <Grid item>
                <StyledUpperContainer container>
                    <Grid item>
                        <StyledWizegapSuccessIconContainer>
                            <StyledSuccessLoaderImage src={SuccessLoader} alt="success" />
                        </StyledWizegapSuccessIconContainer>
                    </Grid>
                    <Grid item>
                        <StyledUpperContainerHeading>
                            {messages?.wizeGapForms?.formCompletion?.congratulations}
                        </StyledUpperContainerHeading>
                    </Grid>
                </StyledUpperContainer>
            </Grid>
            <Grid item>
                <StyledBottomContainer container>
                    <Grid item>
                        <StyledBottomSubContainer container>
                            <Grid item>
                                <StyledBottomContainerHeading>
                                    {messages?.wizeGapForms?.formCompletion?.nextSteps}
                                </StyledBottomContainerHeading>
                            </Grid>
                            <Grid item>
                                <StyledBottomContainerSubHeading>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley.
                                </StyledBottomContainerSubHeading>
                            </Grid>
                        </StyledBottomSubContainer>
                    </Grid>
                    <Grid item>
                        <Button
                            label={messages?.wizeGapForms?.formCompletion?.btnText}
                            type="submit"
                            variant="contained"
                            color="primary"
                            endIcon={<MovingOutlinedIcon />}
                            onClick={() => {
                                reduxDispatch(setCurrentStep(0))
                                reduxDispatch(push(routes.overview))
                            }}
                        />
                    </Grid>
                </StyledBottomContainer>
            </Grid>
        </StyledFormCompletionContainer>
    )
};

export default FormCompletion;