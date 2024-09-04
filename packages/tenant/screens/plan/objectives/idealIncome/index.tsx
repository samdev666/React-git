import React from 'react';
import {Switch, Route} from 'react-router-dom';
import { routes } from '../../../../utils';
import IdealIncome from "./idealIncome";

export default (): JSX.Element =>(
    <Switch>
        <Route 
        exact
        key='idealIncome'
        path={routes.idealIncome.root}
        component={IdealIncome}
        />
    </Switch>
)