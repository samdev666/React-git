import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { routes } from '../../utils';
import LeadManagement from './leadManagement';
import AddEditLeadClientForm from './leadBoard/addEditLeadClientForm';
import ClientDetails from './leadBoard/clientDetails';

export default (): JSX.Element => (
    <Switch>
        <Route
            exact
            key="leadManagement"
            path={routes.leadManagement.root}
            component={LeadManagement}
        />
        <Route
            exact
            key="clientDetail"
            path={routes.leadManagement.clientDetail}
            component={ClientDetails}
        />
        <Route
            exact
            key="addEditLeadClient"
            path={`${routes.leadManagement.root}/:action(add|edit)?`}
            component={AddEditLeadClientForm}
        />
    </Switch>
);
