import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { routes } from '../../../utils';
import FeelLostReason from './feeLostReason';

export default (): JSX.Element => (
  <Switch>
    <Route
      exact
      key="feeLostReason"
      path={routes.feeLostReasonSetup.root}
      component={FeelLostReason}
    />
  </Switch>
);
