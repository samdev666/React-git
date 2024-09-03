import React from 'react';

import { Switch, Route } from 'react-router-dom';
import { routes } from '../../utils';
import UserManagementDetails from './userManagementDetails';
import UserManagement from './userManagement';

export default (): JSX.Element => (
  <Switch>
    <Route
      exact
      key="userManagement"
      path={routes.usermanagement.root}
      component={UserManagement}
    />

    <Route
      exact
      key="userManagementdetails"
      path={routes.usermanagement.userProfile}
      component={UserManagementDetails}
    />
  </Switch>
);
