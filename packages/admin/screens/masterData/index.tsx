import React from "react";
import { Switch, Route } from "react-router-dom";
import { routes } from "../../utils";
import ApplicationComponent from "./application/application";
import FeeLostReason from "./feeLostReason/feeLostReason";
import TeamPosition from "./teamPosition/teamPosition";
import MeetingQuestionsAndCategories from "./meetingQuestionsAndCategories/meetingQuestionsAndCategories";
import MeetingAgendaAndStatus from "./meetingAgendaAndStatus/meetingAgendaAndStatus";
import ApplicationDetails from "./application/applicationDetails";
import TeamPositionDetails from "./teamPosition/teamPositionDetails";
import MeetingQuestionDetails from "./meetingQuestionsAndCategories/meetingQuestionDetails";
import AgendaDetails from "./meetingAgendaAndStatus/agendaDetails";
import ProjectManagement from "./project/project";
import ProjectDetail from "./project/projectDetail";
import MeetingCategory from "./meetingCategory/meetingCategory";
import TaskStatus from "./taskStatus/taskStatus";

export default (): JSX.Element => (
  <Switch>
    <Route
      exact
      key="application"
      path={routes.masterData.application}
      component={ApplicationComponent}
    />

    <Route
      exact
      key="applicationDetails"
      path={routes.masterData.applicationDetail}
      component={ApplicationDetails}
    />

    <Route
      exact
      key="feeLostReason"
      path={routes.masterData.feeLostReason}
      component={FeeLostReason}
    />

    <Route
      exact
      key="teamPosition"
      path={routes.masterData.teamPosition}
      component={TeamPosition}
    />

    <Route
      exact
      key="teamPositionDetails"
      path={routes.masterData.teamPositionDetails}
      component={TeamPositionDetails}
    />

    <Route
      exact
      key="meetingQuestionsAndCategories"
      path={routes.masterData.meetingQuestionsAndCategories}
      component={MeetingQuestionsAndCategories}
    />

    <Route
      exact
      key="meetingQuestionDetails"
      path={routes.masterData.meetingQuestionDetails}
      component={MeetingQuestionDetails}
    />

    <Route
      exact
      key="meetingAgendaAndStatus"
      path={routes.masterData.meetingAgendaAndStatus}
      component={MeetingAgendaAndStatus}
    />

    <Route
      exact
      key="meetingAgendaDetails"
      path={routes.masterData.meetingAgendaDetails}
      component={AgendaDetails}
    />

    <Route
      exact
      key="project"
      path={routes.masterData.project}
      component={ProjectManagement}
    />
    <Route
      exact
      key="projectDetail"
      path={routes.masterData.projectDetails}
      component={ProjectDetail}
    />
    <Route
      exact
      key="meetingCategory"
      path={routes.masterData.meetingCategories}
      component={MeetingCategory}
    />
    <Route
      exact
      key="taskStatus"
      path={routes.masterData.taskStatus}
      component={TaskStatus}
    />
  </Switch>
);
