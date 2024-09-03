import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { routes } from '../../utils';
import WizeGapForms from './wizeGapForms';

export default (): JSX.Element => (
    <Switch>
        <Route
            exact
            key="wizegapForms"
            path={routes.wizegapForms}
            component={WizeGapForms}
        />
    </Switch>
);
