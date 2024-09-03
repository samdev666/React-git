import React from "react";
import { Switch, Route } from "react-router-dom";
import { routes } from "../../utils";
import Fab5Module from "./fab5Module";
import Fab5Preview from "./preview";

export default (): JSX.Element => (
  <Switch>
    <Route exact key="fab5" path={routes.fab5.root} component={Fab5Module} />
    <Route
      exact
      key="fab5"
      path={routes.fab5.preview}
      component={Fab5Preview}
    />
  </Switch>
);
