import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { routes } from '../../../utils';
import LeadSourceSetup from './leadSourceSetup';

export default (): JSX.Element => (
  <Switch>
    <Route
      exact
      key="leadSource"
      path={routes.leadSourceSetup.root}
      component={LeadSourceSetup}
    />
  </Switch>
);
