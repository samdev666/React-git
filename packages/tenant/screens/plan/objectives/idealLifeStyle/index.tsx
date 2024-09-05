import React from 'react';
import { Switch, Route } from 'react-router-dom';
import {routes } from "../../../../utils";
import  IdealLifestyle from "./idealLIfestyle";

export default (): JSX.Element => (
    <Switch>
        <Route 
        exact
        key='idealLifestyle'
        path={routes.idealLifestyle.root}
        component={IdealLifestyle}
        />
    </Switch>
)