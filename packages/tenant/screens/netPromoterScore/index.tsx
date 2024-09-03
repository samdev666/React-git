import React from "react";
import { Switch, Route } from "react-router-dom";
import { routes } from "../../utils";
import Team from "./team";
import Client from "./client";

export default (): JSX.Element => (
  <Switch>
    <Route
      exact
      key="team"
      path={routes.netPromoterScore.team}
      component={Team}
    />
    <Route
      exact
      key="client"
      path={routes.netPromoterScore.client}
      component={Client}
    />
  </Switch>
);
