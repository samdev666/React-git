import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { routes } from '../../utils';
import BusinessAssessmentForms from './businessAssessment';
import DiscoveryDashboard from './discoveryDashboard';

export default (): JSX.Element => (
    <Switch>
        <Route
            exact
            key="businessAssessment"
            path={routes.businessScoreccards.businessAssessment}
            component={BusinessAssessmentForms}
        />
        <Route
            exact
            key="summary"
            path={routes.businessScoreccards.summary}
            component={DiscoveryDashboard}
        />
    </Switch>
);
