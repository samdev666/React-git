import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { routes } from '../../utils';
import LeadSource from './leadSource';
import LeadIndustry from './leadIndustry';
import LeadProgressStages from './leadProgressStages/leadProgressStages';

export default (): JSX.Element => (
  <Switch>
    <Route
      exact
      key="leadProgressStages"
      path={routes.leadData.leadProgressStages}
      component={LeadProgressStages}
    />

    <Route
      exact
      key="leadSource"
      path={routes.leadData.leadSources}
      component={LeadSource}
    />

    <Route
      exact
      key="leadIndustry"
      path={routes.leadData.leadIndustry}
      component={LeadIndustry}
    />
  </Switch>
);
