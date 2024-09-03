import { combineReducers, Reducer } from "redux";
import { connectRouter, RouterState } from "connected-react-router";
import { History } from "history";
import auth, { AuthState } from "./auth";
import {
  createBasicReducer,
  createPagedReducer,
  createStepFormReducer,
} from "./utils";
import {
  SYSTEM_LOADER,
  USER_PROFILE,
  STEP_FORM,
  LAUNCH_PAD_ACTION,
  TENANT,
  LEAD_STAGE_ACTION,
  LEAD_STAGE_STATUS_ACTION,
  FEE_LOST_REASON_ACTION,
  LEAD_SOURCE_ACTION,
  LEAD_INDUSTRY_ACTION,
  MEETING_QUESTION_ACTION,
  MEETING_AGENDA_ACTION,
  MEETING_CATEGORY_ACTION,
  PROGRESS_ENTITY_ACTION,
  MISSION_VISION_VALUE_ACTION,
  FEE_HISTORY,
  PEOPLE_ACTION,
  TEAM_POSITION_ACTION,
  DIVISION_EMPLOYEE_ACTION,
  TEAM_EMPLOYEE_ACTION,
  DIVISION_TEAM_ACTION,
  ORGANIZATION_STRUCTURE_ACTION,
  ACCOUNT_MANAGEMENT_ACTION,
  PLAN_ACTION,
  BUDGET_TEAM_ACTION,
  BUDGET_DIVISION_TEAM_ACTION,
  LOCKUP_PLAN_ACTION,
  FEE_TEAM_ACTION,
  SET_FIRM_PROFILE_ACTION,
  SET_BUDGET_AND_CAPACITY_PLAN_ACTION,
  LEAD_MANAGEMENT,
  TENANT_MEETING_CATEGORY_ACTION,
  TASK_STATUS_ACTION,
  EBITDA_THRESHOLD_ACTION,
  TENANT_GROUP,
  POLICIES_AND_PROCEDURES,
} from "../actions";
import { PagedEntity } from "../../../../packages/common/models";
import {
  AccountManagementEntity,
  BudgetTeamEntity,
  CapacityDivisionTeamEntity,
  DivisionEmployeesEntity,
  DivisionTeamEntity,
  EbitdaEntity,
  EbitdaThresholdEntity,
  FeeHistoryEntity,
  FeeLostReasonEntity,
  FirmProfileEntity,
  FirmProfileFinancialYearStartMonthEntity,
  GroupState,
  LaunchPad,
  LeadIndustryInterface,
  LeadSourceEntity,
  LeadStageEntity,
  LeadStageStatus,
  LoaderState,
  LockupPlanEntity,
  MeetingAgendaEntity,
  MeetingCategoryEntity,
  MeetingCategoryTenantEntity,
  MeetingQuestionEntity,
  MissionVisionValueInterface,
  OrganisationStructureEntity,
  PeopleEntity,
  PlanEntity,
  PoliciesAndProceduresEntity,
  ProgressEntity,
  StepFormState,
  TaskStatusEntity,
  TeamEmployeesEntity,
  TeamPositionEntity,
  TenantState,
} from "../../../../packages/common/models/genericEntities";
import { Status } from "@wizehub/common/models/modules";

export interface ReduxState {
  router: RouterState;
  auth: AuthState;
  profile: any;
  loader: LoaderState;
  stepForm?: StepFormState;
  launchPad: PagedEntity<LaunchPad>;
  tenantData: TenantState;
  leadStage: PagedEntity<LeadStageEntity>;
  leadStageStatus: PagedEntity<LeadStageStatus>;
  feeLostReason: PagedEntity<FeeLostReasonEntity>;
  leadSource: PagedEntity<LeadSourceEntity>;
  leadIndustry: PagedEntity<LeadIndustryInterface>;
  meetingQuestion: PagedEntity<MeetingQuestionEntity>;
  meetingAgenda: PagedEntity<MeetingAgendaEntity>;
  teamPosition: PagedEntity<TeamPositionEntity>;
  meetingCategory: PagedEntity<MeetingCategoryEntity>;
  meetingProgress: PagedEntity<ProgressEntity>;
  missionVisionValue: PagedEntity<MissionVisionValueInterface>;
  feeHistory: PagedEntity<FeeHistoryEntity>;
  people: PagedEntity<PeopleEntity>;
  divisionEmployee: PagedEntity<DivisionEmployeesEntity>;
  teamEmployee: PagedEntity<TeamEmployeesEntity>;
  divisionTeam: PagedEntity<DivisionTeamEntity>;
  organisationStructure: Array<OrganisationStructureEntity>;
  accountManagement: PagedEntity<AccountManagementEntity>;
  plan: PagedEntity<PlanEntity>;
  budgetTeam: PagedEntity<BudgetTeamEntity>;
  budgetDivisionTeam: PagedEntity<CapacityDivisionTeamEntity>;
  lockupPlan: PagedEntity<LockupPlanEntity>;
  feeTeam: PagedEntity<BudgetTeamEntity>;
  firmProfile: FirmProfileFinancialYearStartMonthEntity;
  selectedBudgetAndCapacityPlan: number;
  leadManagement: PagedEntity<any>;
  tenantMeetingCategory: PagedEntity<MeetingCategoryTenantEntity>;
  taskStatus: PagedEntity<TaskStatusEntity>;
  ebitdaThreshold: PagedEntity<EbitdaThresholdEntity>;
  tenantGroup: GroupState
  policiesAndProcedures: PagedEntity<PoliciesAndProceduresEntity>;
}

const createRootReducer = (history: History): Reducer =>
  combineReducers<ReduxState>({
    /* Start Third party reducers */
    router: connectRouter(history),
    /* End Third party reducers */
    auth,
    profile: createBasicReducer<any>(USER_PROFILE, {
      id: 0,
      name: "",
      email: "",
      phoneNumber: "",
      dialCode: "",
      role: {
        id: "",
      },
      profilePhoto: "",
    }),
    firmProfile: createBasicReducer<FirmProfileFinancialYearStartMonthEntity>(
      SET_FIRM_PROFILE_ACTION,
      {
        financialYearStartMonth: 0,
      }
    ),
    loader: createBasicReducer<LoaderState>(SYSTEM_LOADER, {
      visibility: false,
    }),
    tenantData: createBasicReducer<TenantState>(TENANT, {
      tenantId: "",
    }),
    stepForm: createStepFormReducer(STEP_FORM, {
      currentPage: 0,
      forms: {},
      validationErrors: {},
    }),
    launchPad: createPagedReducer<LaunchPad>(LAUNCH_PAD_ACTION, []),
    leadStage: createPagedReducer<LeadStageEntity>(LEAD_STAGE_ACTION, []),
    leadStageStatus: createPagedReducer<LeadStageStatus>(
      LEAD_STAGE_STATUS_ACTION,
      []
    ),
    feeLostReason: createPagedReducer<FeeLostReasonEntity>(
      FEE_LOST_REASON_ACTION,
      []
    ),
    leadSource: createPagedReducer<LeadSourceEntity>(LEAD_SOURCE_ACTION, []),
    leadIndustry: createPagedReducer<LeadIndustryInterface>(
      LEAD_INDUSTRY_ACTION,
      []
    ),
    meetingQuestion: createPagedReducer<MeetingQuestionEntity>(
      MEETING_QUESTION_ACTION,
      []
    ),
    meetingAgenda: createPagedReducer<MeetingAgendaEntity>(
      MEETING_AGENDA_ACTION,
      []
    ),
    meetingCategory: createPagedReducer<MeetingCategoryEntity>(
      MEETING_CATEGORY_ACTION,
      []
    ),
    meetingProgress: createPagedReducer<ProgressEntity>(
      PROGRESS_ENTITY_ACTION,
      []
    ),
    missionVisionValue: createPagedReducer<MissionVisionValueInterface>(
      MISSION_VISION_VALUE_ACTION,
      []
    ),
    feeHistory: createPagedReducer<FeeHistoryEntity>(FEE_HISTORY, []),
    people: createPagedReducer<PeopleEntity>(PEOPLE_ACTION, []),
    teamPosition: createPagedReducer<TeamPositionEntity>(
      TEAM_POSITION_ACTION,
      []
    ),
    divisionEmployee: createPagedReducer<DivisionEmployeesEntity>(
      DIVISION_EMPLOYEE_ACTION,
      []
    ),
    teamEmployee: createPagedReducer<TeamEmployeesEntity>(
      TEAM_EMPLOYEE_ACTION,
      []
    ),
    divisionTeam: createPagedReducer<TeamEmployeesEntity>(
      DIVISION_TEAM_ACTION,
      []
    ),
    organisationStructure: createBasicReducer<
      Array<OrganisationStructureEntity>
    >(ORGANIZATION_STRUCTURE_ACTION, []),
    accountManagement: createPagedReducer<AccountManagementEntity>(
      ACCOUNT_MANAGEMENT_ACTION,
      []
    ),
    plan: createPagedReducer<PlanEntity>(PLAN_ACTION, []),
    lockupPlan: createPagedReducer<LockupPlanEntity>(LOCKUP_PLAN_ACTION, []),
    budgetTeam: createPagedReducer<BudgetTeamEntity>(BUDGET_TEAM_ACTION, []),
    budgetDivisionTeam: createPagedReducer<CapacityDivisionTeamEntity>(
      BUDGET_DIVISION_TEAM_ACTION,
      []
    ),
    feeTeam: createPagedReducer<BudgetTeamEntity>(FEE_TEAM_ACTION, []),
    selectedBudgetAndCapacityPlan: createBasicReducer<any>(
      SET_BUDGET_AND_CAPACITY_PLAN_ACTION,
      0
    ),
    leadManagement: createPagedReducer<any>(LEAD_MANAGEMENT, []),
    tenantMeetingCategory: createPagedReducer<MeetingCategoryEntity>(
      TENANT_MEETING_CATEGORY_ACTION,
      []
    ),
    taskStatus: createPagedReducer<TaskStatusEntity>(TASK_STATUS_ACTION, []),
    ebitdaThreshold: createPagedReducer<EbitdaThresholdEntity>(
      EBITDA_THRESHOLD_ACTION,
      []
    ),
    tenantGroup: createBasicReducer<GroupState>(TENANT_GROUP, {
      hasGroup: false,
    }),
    policiesAndProcedures: createPagedReducer<PoliciesAndProceduresEntity>(
      POLICIES_AND_PROCEDURES,
      []
    ),
  });
export default createRootReducer;
