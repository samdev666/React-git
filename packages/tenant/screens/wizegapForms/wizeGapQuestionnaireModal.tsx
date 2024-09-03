import { Grid } from "@mui/material";
import { Button } from "@wizehub/components";
import React from "react";
import {
    StyledBusinessBottomContainer,
    StyledBusinessBottomContainerHeading,
    StyledBusinessUpperContainerHeading,
    StyledModalContainer
} from "../businessScorecards/businessAssessment/styles";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
    StyleBottomSubContainer,
    StyleBottomSubContainerHeading,
    StyleBottomSubContainerSubHeading,
    StyleBottomSubContentContainer
} from "./styles";
import messages from "../../messages";
import { useDispatch } from "react-redux";
import { routes } from "../../utils";
import { push } from "connected-react-router";

interface Props {
    onClose: () => void
}

const WizegapQuestionnaireModal: React.FC<Props> = ({ onClose }) => {
    const reduxDispatch = useDispatch();

    return (
        <StyledModalContainer container>
            <Grid item>
                <StyledBusinessUpperContainerHeading>
                    {messages?.wizeGapForms?.questionnaireModal?.heading}
                </StyledBusinessUpperContainerHeading>
            </Grid>
            <Grid item>
                <StyledBusinessBottomContainer container>
                    <Grid item>
                        <StyledBusinessBottomContainerHeading>
                            {messages?.wizeGapForms?.questionnaireModal?.subHeading}
                        </StyledBusinessBottomContainerHeading>
                    </Grid>
                    <Grid item>
                        <StyleBottomSubContainer container>
                            <Grid item textAlign={"center"}>
                                <Button
                                    label={messages?.wizeGapForms?.questionnaireModal?.btnText}
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    endIcon={<ArrowForwardIcon />}
                                    onClick={() => reduxDispatch(push(routes.wizegapForms))}
                                />
                            </Grid>
                            <Grid item>
                                <StyleBottomSubContentContainer container>
                                    <Grid item textAlign={"center"}>
                                        <StyleBottomSubContainerHeading onClick={onClose}>
                                            {messages?.wizeGapForms?.questionnaireModal?.skipNow}
                                        </StyleBottomSubContainerHeading>
                                    </Grid>
                                    <Grid item>
                                        <StyleBottomSubContainerSubHeading>
                                            {messages?.wizeGapForms?.questionnaireModal?.supportText}
                                        </StyleBottomSubContainerSubHeading>
                                    </Grid>
                                </StyleBottomSubContentContainer>
                            </Grid>
                        </StyleBottomSubContainer>
                    </Grid>
                </StyledBusinessBottomContainer>
            </Grid >
        </StyledModalContainer >
    )
};

export default WizegapQuestionnaireModal;