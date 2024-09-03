import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { routes } from '../../../utils';
import MeetingMasterSetup from './meetingMasterSetup';
import MeetingQuestionDetail from './meetingQuestionDetail';
import MeetingAgendaDetail from './meetingAgendaDetail';
import Category from './category';
import ProgressStatus from './progressStatus';

export default (): JSX.Element => (
  <Switch>
    <Route
      exact
      key="meetingMasterSetup"
      path={routes.meetingMasterSetup.root}
      component={MeetingMasterSetup}
    />

    <Route
      exact
      key="agenda"
      path={routes.meetingMasterSetup.agenda}
      component={MeetingMasterSetup}
    />

    <Route
      exact
      key="meetingQuestionDetail"
      path={routes.meetingMasterSetup.meetingQuestionDetail}
      component={MeetingQuestionDetail}
    />

    <Route
      exact
      key="meetingAgendaDetail"
      path={routes.meetingMasterSetup.meetingAgendaDetail}
      component={MeetingAgendaDetail}
    />

    <Route
      exact
      key="category"
      path={routes.meetingMasterSetup.category}
      component={Category}
    />

    <Route
      exact
      key="progressStatus"
      path={routes.meetingMasterSetup.progressStatus}
      component={ProgressStatus}
    />
  </Switch>
);
