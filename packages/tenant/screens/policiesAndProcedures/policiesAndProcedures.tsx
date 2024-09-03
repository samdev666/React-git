import React, { useState } from "react";
import { Container } from "../../components";
import { DIVISION_LISTING_API } from "../../api";
import { useOptions } from "@wizehub/common/hooks";
import { Division } from "@wizehub/common/models/genericEntities";
import {
    StyledHeadingTypography,
    StyledMainHeadingContainer,
    StyledMainLeftHeadingContainer
} from "@wizehub/components/detailPageWrapper/styles";
import { ResponsiveAddIcon } from "../systemPreferences/launchPadSetup/launchPadSetup";
import { Button, MultiTabComponent } from "@wizehub/components";
import { StyledMultiTabContainer } from "../firmProfile/styles";
import { Id } from "@wizehub/common/models";
import messages from "../../messages";
import PolicyProcedureCommonScreen from "./policyProcedureCommonScreen";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { routes } from "../../utils";

const PoliciesAndProcedures = () => {
    const reduxDispatch = useDispatch();
    const { options: divisionOptions } =
        useOptions<Division>(DIVISION_LISTING_API);

    const divisionTabs = divisionOptions.map((division) => {
        return {
            id: division?.id,
            label: division?.name
        };
    })

    const policiesAndProceduresTabs = divisionTabs?.length ? [
        {
            id: 'all',
            label: 'All',
        },
        ...divisionTabs
    ] : [];

    const [activeTab, setActiveTab] = useState<Id>('all');

    return (
        <Container noPadding>
            <StyledMainHeadingContainer>
                <StyledMainLeftHeadingContainer>
                    <StyledHeadingTypography>
                        {messages?.execute?.policiesAndProcedures?.heading}
                    </StyledHeadingTypography>
                </StyledMainLeftHeadingContainer>
                <Button
                    startIcon={<ResponsiveAddIcon />}
                    label={messages?.execute?.policiesAndProcedures?.button}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        reduxDispatch(
                            push({
                                pathname: `${routes.policiesAndProcedures.root}/add`,
                                state: { division: activeTab }
                            })
                        )
                    }}
                />
            </StyledMainHeadingContainer>
            <StyledMultiTabContainer>
                <MultiTabComponent
                    tabs={policiesAndProceduresTabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            </StyledMultiTabContainer>
            <PolicyProcedureCommonScreen
                divisionId={activeTab}
            />
        </Container>
    )
};

export default PoliciesAndProcedures;