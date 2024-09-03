import React from "react";
import { Switch, Route } from "react-router-dom";
import { routes } from "../../utils";
import FirmDetails from "./firmDetails";
import MissionVisionValue from "./missionVisionValue";
import AddNewMissionVisionValues from "./missionVisionValue/addNewMissionVisionValues";
import People from "./people";
import PeopleForm from "./people/peopleForm";
import PeopleDetail from "./people/peopleDetail";
import TeamStructure from "./teamStructure";
import OrganisationChart from "./organisationChart";

export default (): JSX.Element => (
  <Switch>
    <Route
      exact
      key="feeLostReason"
      path={routes.firmProfile.firmDetails}
      component={FirmDetails}
    />
    <Route
      exact
      key="missionVisionValue"
      path={routes.firmProfile.missionVisionValues}
      component={MissionVisionValue}
    />
    <Route
      exact
      key="addNewMissionVisionValues"
      path={routes.firmProfile.addNewMissionVisionValues}
      component={AddNewMissionVisionValues}
    />
    <Route
      exact
      key="people"
      path={routes.firmProfile.people}
      component={People}
    />
    <Route
      exact
      key="peopleForm"
      path={routes.firmProfile.peopleForm}
      component={PeopleForm}
    />
    <Route
      exact
      key="peopleForm"
      path={routes.firmProfile.editPeopleForm}
      component={PeopleForm}
    />
    <Route
      exact
      key="peopleDetail"
      path={routes.firmProfile.peopleDetail}
      component={PeopleDetail}
    />
    <Route
      exact
      key="teamStructure"
      path={routes.firmProfile.teamStructure}
      component={TeamStructure}
    />
    <Route
      exact
      key="divisionEmployee"
      path={routes.firmProfile.divisionEmployee}
      component={TeamStructure}
    />
    <Route
      exact
      key="organisationChart"
      path={routes.firmProfile.organizationChart}
      component={OrganisationChart}
    />
  </Switch>
);
