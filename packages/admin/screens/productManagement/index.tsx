import React from 'react';

import { Switch, Route } from 'react-router-dom';
import { routes } from '../../utils';
import ProductManagementDetails from './productManagementDetails';
import ProductManagement from './productManagement';

export default (): JSX.Element => (
  <Switch>
    <Route
      exact
      key="productManagement"
      path={routes.productmanagement.root}
      component={ProductManagement}
    />

    <Route
      exact
      key="productManagementdetails"
      path={routes.productmanagement.productDetail}
      component={ProductManagementDetails}
    />
  </Switch>
);
