import React from "react";
import { StyledHeadingText } from "../../auth/styles";
import { Button } from "@wizehub/components";
import { Typography } from "@mui/material";
import { StyledNoTeamPopupBody, StyledNoTeamPopupButtonContainer, StyledNoTeamPopupContainer } from "./styles";
import messages from "../../../messages";

interface Props {
    onSuccess: () => void;
    body: string;
    btnText?: string;
}

const NoTeamPopup: React.FC<Props> = ({ onSuccess, body, btnText }) => {
    return (
        <StyledNoTeamPopupContainer>
            <StyledNoTeamPopupBody>
                {body}
            </StyledNoTeamPopupBody>
            <StyledNoTeamPopupButtonContainer>
                <Button
                    label={btnText || messages?.measure?.financialOverview?.feesWonAndLost?.btnText}
                    type={"submit"}
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={onSuccess}
                />
            </StyledNoTeamPopupButtonContainer>
        </StyledNoTeamPopupContainer>
    )
};

export default NoTeamPopup;