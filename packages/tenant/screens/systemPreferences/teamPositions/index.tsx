import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { routes } from '../../../utils';
import TeamPositions from './teamPositions';
import TeamPositionDetail from './teamPositionDetail';

export default (): JSX.Element => (
  <Switch>
    <Route
      exact
      key="teamPositions"
      path={routes.teamPositions.root}
      component={TeamPositions}
    />
    <Route
      exact
      key="teamPositionDetail"
      path={routes.teamPositions.teamPositionDetail}
      component={TeamPositionDetail}
    />
  </Switch>
);
