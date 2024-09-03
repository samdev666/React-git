import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { routes } from '../../utils';
import AccountManagement from './accountManagement';

export default (): JSX.Element => (
  <Switch>
    <Route
      exact
      key="accountManagement"
      path={routes.accountManagement}
      component={AccountManagement}
    />
  </Switch>
);
