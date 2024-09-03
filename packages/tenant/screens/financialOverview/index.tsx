import React from "react";
import { Switch, Route } from "react-router-dom";
import { routes } from "../../utils";
import Fees from "./fees";
import Lockup from "./lockup";
import Ebidta from "./ebidta";
import EbitdaBonus from "./ebitdaBonus";
import FeeWonAndLost from "./feeWonAndLost";

export default (): JSX.Element => (
  <Switch>
    <Route
      exact
      key="fees"
      path={routes.financialOverview.fees}
      component={Fees}
    />
    <Route
      exact
      key="lockup"
      path={routes.financialOverview.lockups}
      component={Lockup}
    />
    <Route
      exact
      key="ebidta"
      path={routes.financialOverview.ebitda}
      component={Ebidta}
    />
    <Route
      exact
      key="ebidtaBonus"
      path={routes.financialOverview.ebitdaBonus}
      component={EbitdaBonus}
    />
    <Route
      exact
      key="feeWonAndLost"
      path={routes.financialOverview.feeWonAndLast}
      component={FeeWonAndLost}
    />
  </Switch>
);
