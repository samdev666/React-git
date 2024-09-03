import React from "react";
import { Switch, Route } from "react-router-dom";
import { routes } from "../../../utils";
import BudgetAndCapacity from "./budgetAndCapacity";
import AddTeamForm from "./addTeamForm";
import FirmWideResults from "./firmWideResults";

export default (): JSX.Element => (
  <Switch>
    <Route
      exact
      key="budgetAndCapcity"
      path={routes.budgetAndCapacity.root}
      component={BudgetAndCapacity}
    />
    <Route
      exact
      key="addTeam"
      path={routes.budgetAndCapacity.editTeam}
      component={AddTeamForm}
    />
    <Route
      exact
      key="addTeam"
      path={routes.budgetAndCapacity.addTeam}
      component={AddTeamForm}
    />
    <Route
      exact
      key="firmWideResults"
      path={routes.budgetAndCapacity.firmWideResults}
      component={FirmWideResults}
    />
  </Switch>
);
