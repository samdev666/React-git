import React from "react";
import { Switch, Route } from "react-router-dom";
import { routes } from "../../../utils";
import MeetingCategory from "./meetingCategory";

export default (): JSX.Element => (
  <Switch>
    <Route
      exact
      key="meetingCategory"
      path={routes.meetingCategory.root}
      component={MeetingCategory}
    />
  </Switch>
);
