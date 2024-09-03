import React from "react";
import { Switch, Route } from "react-router-dom";
import { routes } from "../../../utils";
import TaskStatus from "./taskStatus";

export default (): JSX.Element => (
  <Switch>
    <Route
      exact
      key="taskStatus"
      path={routes.taskStatus.root}
      component={TaskStatus}
    />
  </Switch>
);
