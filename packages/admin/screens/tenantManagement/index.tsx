import React from 'react';

import { Switch, Route } from 'react-router-dom';
import { routes } from '../../utils';
import TenantManagementDetails from './tenantManagementDetails';
import TenantManagement from './tenantManagement';
import TenantGroupDetails from './tenantGroupDetails';

export default (): JSX.Element => (
  <Switch>
    <Route
      exact
      key="tenantManagement"
      path={routes.tenantmanagement.root}
      component={TenantManagement}
    />
    <Route
      exact
      key="tenantManagementGroup"
      path={routes.tenantmanagement.tenantManagementGroup}
      component={TenantManagement}
    />
    <Route
      exact
      key="tenantDetails"
      path={routes.tenantmanagement.tenantDetail}
      component={TenantManagementDetails}
    />
    <Route
      exact
      key="tenantGroupDetails"
      path={routes.tenantmanagement.tenantGroupDetail}
      component={TenantGroupDetails}
    />
  </Switch>
);
