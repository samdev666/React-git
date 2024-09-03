import React from 'react';

import { Switch, Route } from 'react-router-dom';
import { routes } from '../../../utils';
import LaunchPadSetup from './launchPadSetup';
import LaunchPadSetupDetail from './launchPadSetupDetail';

export default (): JSX.Element => (
  <Switch>
    <Route
      exact
      key="launchPadSetup"
      path={routes.launchPadSetup}
      component={LaunchPadSetup}
    />
  </Switch>
);
