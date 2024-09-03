import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { routes } from '../../../utils';
import LeadIndustrySetup from './leadIndustrySetup';

export default (): JSX.Element => (
  <Switch>
    <Route
      exact
      key="leadIndustry"
      path={routes.leadIndustrySetup.root}
      component={LeadIndustrySetup}
    />
  </Switch>
);
