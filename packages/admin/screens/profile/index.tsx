import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { routes } from '../../utils';
import ProfileSection from './profileSection';

export default () : JSX.Element => (
  <Switch>
    <Route
      exact
      key="profile"
      path={routes.profile}
      component={ProfileSection}
    />
  </Switch>
);
