import React from "react";
import { Switch, Route } from "react-router-dom";
import { routes } from "../../utils";
import PoliciesAndProcedures from "./policiesAndProcedures";
import PolicyDetails from "./policyDetails";
import PolicyProcedureForm from "./policyProcedureForm";

export default (): JSX.Element => (
    <Switch>
        <Route
            exact
            key="policiesAndProcedures"
            path={routes.policiesAndProcedures?.root}
            component={PoliciesAndProcedures}
        />
        <Route
            exact
            key="policyDetails"
            path={routes.policiesAndProcedures?.policiesAndProceduresDetail}
            component={PolicyDetails}
        />
        <Route
            exact
            key="policyProcedureForm"
            path={`${routes.policiesAndProcedures.root}/:action(add|edit)?`}
            component={PolicyProcedureForm}
        />
    </Switch>
);
