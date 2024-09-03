import { combineReducers, Reducer } from "redux";
import { connectRouter, RouterState } from "connected-react-router";
import { History } from "history";
import { PagedEntity } from "@wizehub/common/models";
import {
  ApplicationEntity,
  CategoryEntity,
  FeeLostReasonEntity,
  LeadIndustryInterface,
  LeadProgressStatusEntity,
  LeadSourceEntity,
  LoaderState,
  MeetingAgendaEntity,
  MeetingCategoryEntity,
  MeetingQuestionEntity,
  ProductManagementEntity,
  ProfileState,
  ProgressEntity,
  ProjectManagementEntity,
  StepFormState,
  TaskStatusEntity,
  TeamPositionEntity,
  TenantGroupManagementEntity,
  TenantGroupTenantEntity,
  TenantGroupUserEntity,
  TenantUserEntity,
  UserManagementEntity,
} from "@wizehub/common/models/genericEntities";
import { TENANT_GROUP_MANAGEMENT_LISTING } from "@wizehub/common/redux/actions";
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
  USERMANAGEMENTLISTING,
  PRODUCTMANAGEMENTLISTING,
  LEADSOURCELISTING,
  LEADINDUSTRYLISTING,
  LEADSTAGELISTING,
  STAGESTATUSLISTING,
  APPLICATIONLISTING,
  FEELOSTREASONLISTING,
  TEAMPOSITIONLISTING,
  MEETINGQUESTIONLISTING,
  MEETINGCATEGORYLISTING,
  MEETINGAGENDALISTING,
  MEETINGSTATUSLISTING,
  TENANT_MANAGEMENT_LISTING,
  TENANT_USER_MANAGEMENT_LISTING,
  TENANT_GROUP_USER_MANAGEMENT,
  TENANT_GROUP_TENANT_MANAGEMENT,
  PROJECT_MANAGEMENT_LISTING_ACTION,
  CATEGORY_LISTING,
  TASK_STATUS_LISTING,
} from "../actions";

export interface ReduxState {
  router: RouterState;
  auth: AuthState;
  profile: ProfileState;
  loader: LoaderState;
  stepForm?: StepFormState;
  userManagement: PagedEntity<UserManagementEntity>;
  productManagement: PagedEntity<ProductManagementEntity>;
  projectManagement: PagedEntity<ProjectManagementEntity>;
  tenantGroupManagement: PagedEntity<TenantGroupManagementEntity>;
  tenantListingManagement: PagedEntity<ProductManagementEntity>;
  tenantUserManagementListing: PagedEntity<TenantUserEntity>;
  tenantGroupUserManagement: PagedEntity<TenantGroupUserEntity>;
  tenantGroupTenantManagement: PagedEntity<TenantGroupTenantEntity>;
  leadSource: PagedEntity<LeadSourceEntity>;
  leadIndustry: PagedEntity<LeadIndustryInterface>;
  leadStage: PagedEntity<LeadProgressStatusEntity>;
  stageStatus: PagedEntity<LeadProgressStatusEntity>;
  application: PagedEntity<ApplicationEntity>;
  feeLostReason: PagedEntity<FeeLostReasonEntity>;
  teamPosition: PagedEntity<TeamPositionEntity>;
  meetingQuestion: PagedEntity<MeetingQuestionEntity>;
  meetingCategory: PagedEntity<MeetingCategoryEntity>;
  meetingAgenda: PagedEntity<MeetingAgendaEntity>;
  meetingStatus: PagedEntity<ProgressEntity>;
  cateogry: PagedEntity<CategoryEntity>;
  taskStatus: PagedEntity<TaskStatusEntity>;
}

const createRootReducer = (history: History): Reducer =>
  combineReducers<ReduxState>({
    /* Start Third party reducers */
    router: connectRouter(history),
    /* End Third party reducers */
    auth,
    profile: createBasicReducer<ProfileState>(USER_PROFILE, {
      id: 0,
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      dialCode: "",
      role: {
        id: "",
        name: "",
      },
      profileUrl: "",
    }),
    loader: createBasicReducer<LoaderState>(SYSTEM_LOADER, {
      visibility: false,
    }),
    stepForm: createStepFormReducer(STEP_FORM, {
      currentPage: 0,
      forms: {},
      validationErrors: {},
    }),
    userManagement: createPagedReducer<UserManagementEntity>(
      USERMANAGEMENTLISTING,
      []
    ),
    productManagement: createPagedReducer<ProductManagementEntity>(
      PRODUCTMANAGEMENTLISTING,
      []
    ),
    projectManagement: createPagedReducer<ProjectManagementEntity>(
      PROJECT_MANAGEMENT_LISTING_ACTION,
      []
    ),
    tenantGroupUserManagement: createPagedReducer<TenantGroupUserEntity>(
      TENANT_GROUP_USER_MANAGEMENT,
      []
    ),
    tenantGroupTenantManagement: createPagedReducer<TenantGroupTenantEntity>(
      TENANT_GROUP_TENANT_MANAGEMENT,
      []
    ),
    tenantUserManagementListing: createPagedReducer<TenantUserEntity>(
      TENANT_USER_MANAGEMENT_LISTING,
      []
    ),
    tenantGroupManagement: createPagedReducer<TenantGroupManagementEntity>(
      TENANT_GROUP_MANAGEMENT_LISTING,
      []
    ),
    tenantListingManagement: createPagedReducer<ProductManagementEntity>(
      TENANT_MANAGEMENT_LISTING,
      []
    ),
    leadSource: createPagedReducer<LeadSourceEntity>(LEADSOURCELISTING, []),
    leadIndustry: createPagedReducer<LeadIndustryInterface>(
      LEADINDUSTRYLISTING,
      []
    ),
    leadStage: createPagedReducer<LeadProgressStatusEntity>(
      LEADSTAGELISTING,
      []
    ),
    stageStatus: createPagedReducer<LeadProgressStatusEntity>(
      STAGESTATUSLISTING,
      []
    ),
    application: createPagedReducer<ApplicationEntity>(APPLICATIONLISTING, []),
    feeLostReason: createPagedReducer<FeeLostReasonEntity>(
      FEELOSTREASONLISTING,
      []
    ),
    teamPosition: createPagedReducer<TeamPositionEntity>(
      TEAMPOSITIONLISTING,
      []
    ),
    meetingQuestion: createPagedReducer<MeetingQuestionEntity>(
      MEETINGQUESTIONLISTING,
      []
    ),
    meetingCategory: createPagedReducer<MeetingCategoryEntity>(
      MEETINGCATEGORYLISTING,
      []
    ),
    meetingAgenda: createPagedReducer<MeetingAgendaEntity>(
      MEETINGAGENDALISTING,
      []
    ),
    meetingStatus: createPagedReducer<ProgressEntity>(MEETINGSTATUSLISTING, []),
    cateogry: createPagedReducer<CategoryEntity>(CATEGORY_LISTING, []),
    taskStatus: createPagedReducer<TaskStatusEntity>(TASK_STATUS_LISTING, []),
  });
export default createRootReducer;
