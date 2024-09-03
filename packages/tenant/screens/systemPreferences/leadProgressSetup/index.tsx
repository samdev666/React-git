import React from "react";
import { Switch, Route } from "react-router-dom";
import { routes } from "../../../utils";
import PracticeLeadStageSetup from "./practiceLeadStageSetup";

export default (): JSX.Element => (
  <Switch>
    <Route
      exact
      key="stageStatus"
      path={routes.practiceLeadProgressSetup.root}
      component={PracticeLeadStageSetup}
    />
  </Switch>
);
