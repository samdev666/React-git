import {
  CurrencyType,
  FrequencyType,
  Id,
  Option,
  PersonTypeEnum,
  UserActionConfig,
} from "./baseEntities";
import {
  LaunchPadType,
  MeetingAgendaGuideType,
  Role,
  Status,
  TEAM_TYPE,
} from "./modules";

export interface Company {
  id: string;
  customerName: string;
  businessName: string;
  noOfLocations: number;
  noOfCompanyAdmins: number;
  status: Status;
  createdOn: Date;
}

export interface Locations {
  villageId: string;
  villageName: string;
  noOfVillageAdmins: number;
  noOfVillageManagers: number;
  noOfActiveResidents: number;
  status: Status;
}

export interface CompanyInformation extends Company {
  address: string;
  registeredAddress: string;
  billingEmail: string;
  abn: string;
  dns: string;
  logo: string;
  website: string;
}

export interface LocationInformation {
  villageId: string;
  villageName: string;
  status: Status;
  address: string;
  primaryColor: string;
  secondaryColor: string;
  buttonColor: string;
  buttonTextColor: string;
}

export interface LoaderState {
  visibility?: boolean;
}

export interface TenantState {
  tenantId?: string;
}

export interface LocationType {
  state?: { id: string; villageId: string };
}

export interface CompanyAdmins {
  id: Id;
  name: string;
  email: string;
  status: Status;
  createdOn: Date;
}

export interface ProfileState {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: {
    id: string;
    name: string;
  };
  profileUrl: string;
  dialCode: string;
}

export interface CustomerIdType {
  customerId?: string;
  locationId?: string;
}
export interface StepFormState {
  currentPage: number;
  forms: { [key: string]: any };
  validationErrors: { [key: string]: any };
}

export interface UserManagementEntity {
  id: Id;
  email: string;
  firstName: string;
  lastName: string;
  status: Status;
  role: {
    id: Id;
    name: Role;
  };
  lastLogin?: string;
  data?: {
    name: string;
  };
}

export interface ProductManagementEntity {
  id: Id;
  name: string;
  numberOfTenants: number;
  status: Status;
}

export interface Division {
  id: Id;
  name: string;
  code: string;
  description: string;
  status: Status;
}

export interface Stage {
  id: string;
  title: string;
  description: string;
  status: Status;
}

export interface ProjectManagementEntity {
  id: Id;
  title: string;
  stage: {
    id: Id;
    name: string;
  };
  division: {
    id: Id;
    name: string;
  };
  description: string;
  status: Status;
  links: Array<{
    title: string;
    link: string;
  }>;
  documents: Array<{
    id: Id;
    name: string;
    size: string;
    type: string;
    url: string;
  }>;
}

export interface TenantGroupManagementEntity {
  id: Id;
  name: string;
  description: string;
  status: Status;
  tenantCount?: string;
}

export interface CountryEntity {
  id: Id;
  name: string;
  isoCode: string;
  dialCode: string;
  currencyCode: string;
  currencySymbol: string;
  status: Status;
}

export interface TenantManagementEntity {
  id: Id;
  name: string;
  abn: string;
  group: {
    id: Id;
    name: string;
  };
  nextBillingDate: Date;
  status: Status;
  productName?: string;
}

export interface TenantDetailEntity {
  id: Id;
  name: string;
  abn: string;
  streetAddress: string;
  city: string;
  countryId: {
    id: Id;
    name: string;
  };
  group: {
    id: Id;
    name: string;
  };
  postalCode: string;
  nextBillingDate: Date;
  financialStartMonth: number;
  dateFormat: string;
  status: Status;
}

export interface TenantUserEntity {
  id: Id;
  name: string;
  status: Status;
}

export interface TenantGroupUserEntity {
  id: Id;
  name: string;
  status: Status;
}

export interface TenantGroupTenantEntity {
  id: Id;
  name: string;
  status: Status;
}
export interface TenantProductDetailPaymentEntity {
  id: Id;
  paymentDate: Date;
  validityEndDate: Date;
  transactionId: string;
  transactionMode: string;
  transactionValue: number;
  transactionCurrencyCode: string;
  notes: string;
  status: string;
}

export interface LeadStageEntity {
  id: Id;
  name: string;
  code: string;
  status: Status;
}

export interface LeadStageFormEntity {
  actionConfig: UserActionConfig;
  leadStage?: LeadStageEntity;
}

export interface LeadProgressStatusEntity {
  id: Id;
  leadProgressStage: {
    id: Id;
    name: string;
  };
  name: string;
  status: Status;
}

export interface LeadSourceEntity {
  id: Id;
  name: string;
  status: Status;
  clonedType?: string;
}
export interface ApplicationEntity {
  icon: string;
  id: Id;
  name: string;
  status: Status;
  type: LaunchPadType;
}

export interface ApplicationDetailEntity extends ApplicationEntity {
  description: string;
  url: string;
}

export interface FeeLostReasonEntity {
  id: Id;
  name: string;
  status: Status;
  clonedType?: string;
}

export interface LeadIndustryInterface {
  id: Id;
  name: string;
  status: Status;
  clonedType?: string;
}

export interface MeetingAgendaEntity {
  id: Id;
  title: string;
  divisions: Array<{
    id: Id;
    divisionName: string;
  }>;
  project: {
    id: Id;
    title: string;
  };
  status: Status;
  clonedStatus?: string;
}

export interface ProgressEntity {
  clonedType: string;
  description: string;
  id: Id;
  name: string;
  status: Status;
}

export interface MeetingCategoryEntity {
  id: Id;
  name: string;
  description: string;
  status: Status;
  clonedType?: string;
}

export interface MeetingQuestionEntity {
  id: Id;
  category: {
    id: Id;
    name: string;
  };
  divisions: Array<{
    id: Id;
    name: string;
  }>;
  question: string;
  status: Status;
  clonedType: string;
}

export interface GuideEntity {
  id: Id;
  name: string;
  resourceUrl: string;
  type: MeetingAgendaGuideType;
}

export interface MeetingAgendaDetailEntity extends MeetingAgendaEntity {
  guides: Array<GuideEntity>;
  implementationDetail: string;
}

export interface TeamPositionEntity {
  code: string;
  description: string;
  divisions: Array<{
    id: Id;
    name: string;
  }>;
  id: Id;
  name: string;
  positionLevel: number;
  status: Status;
  clonedType?: string;
}

export interface TenantProductDetailEntity {
  id: Id;
  tenant: {
    id: Id;
    name: string;
  };
  product: {
    id: Id;
    name: string;
  };
  startDate: string;
  validityEndDate: string;
  endDate: string;
  status: Status;
  payments: Array<TenantProductDetailPaymentEntity>;
}

export interface ProductManagementDetailEntity {
  name: string;
  identifier: string;
  trialPeriod: number;
  gracePeriod: number;
  currencyCode: CurrencyType;
  basePrice: number;
  baseUsers: number;
  perUserPrice: number;
  billingFrequency: FrequencyType;
  status: Status;
  id: Id;
}

export interface LaunchPad {
  id: number;
  name: string;
  icon: string;
  type: LaunchPadType;
  clonedType: string;
  status: Status;
  url?: string;
}

export interface LaunchPadDetailEntity extends LaunchPad {
  url: string;
  description: string;
  clonedStatus: string;
}
// Wizegap Forms Interface
export interface PresentationData {
  title?: string;
  subTitle?: string;
  fieldText?: string;
}

interface VisibilityData {
  value: string;
  questionId: number;
}
interface ValidatorData {
  valueType?: string;
  isRequired?: boolean;
  errorMessage?: string;
  type?: string;
}

interface OptionData {
  id?: number | string;
  label?: string;
  value?: string;
}

interface ConfigurationData {
  options?: OptionData[];
  isMultipleAllowed?: boolean;
  validators?: ValidatorData;
  visibility?: VisibilityData;
  minRange?: number;
  maxRange?: number;
  displayMode?: string;
}

export interface Question {
  id: number;
  type: string;
  status?: string;
  answer?: string | number | number[];
  presentationData: PresentationData;
  configurationData: ConfigurationData;
}

export interface Row {
  hasSeparator: boolean;
  questionIds: number[];
  sectionIds: string[];
  title?: string;
  subTitle?: string;
}

interface Layout {
  rows: Row[];
}

export interface SubSectionRow {
  hasSeparator: boolean;
  questionIds: number[];
  title?: string;
}

export interface SubSection {
  id: number;
  code: string;
  presentationData: PresentationData;
  layout: {
    rows: SubSectionRow[];
  };
  questions: Question[];
  completionStatus: string;
  status: string;
}

export interface Section {
  id: number;
  code: string;
  presentationData: PresentationData;
  layout: Layout;
  questions: Question[];
  completionStatus: string;
  status: string;
  subSections: SubSection[];
}

export interface TenantFormData {
  id: number;
  code: string;
  name: string;
  sectionDisplayOrder: string[];
  status: string;
  sections: Section[];
  completionStatus: string;
}

export interface LeadStageEntity {
  id: Id;
  name: string;
  code: string;
  status: Status;
  clonedType: string;
}

export interface LeadStageStatus {
  id: Id;
  name: string;
  leadProgressStage: {
    id: Id;
    name: string;
  };
  clonedType: string;
  status: Status;
}

export interface LeadStageStatusFormEntity {
  actionConfig: UserActionConfig;
  leadStageStatus?: LeadStageStatus;
}
export interface TenantData {
  id: string;
  name: string;
  groupId: number | null;
}

export interface GroupData {
  id: string;
  name: string;
}

export interface FeeLostReasonFormEntity {
  actionConfig: UserActionConfig;
  feeLostReason?: FeeLostReasonEntity;
}

export interface LeadSourceFormEntity {
  actionConfig: UserActionConfig;
  leadSource?: LeadSourceEntity;
}

export interface LeadIndustryFormEntity {
  actionConfig: UserActionConfig;
  leadIndustry?: LeadIndustryInterface;
}

export interface LaunchPadAppFormEntity {
  actionConfig: UserActionConfig;
  id?: Id;
}

export interface ProgressStatusFormEntity {
  actionConfig: UserActionConfig;
  progressEntity?: ProgressEntity;
}

export interface MeetingCategoryFormEntity {
  actionConfig: UserActionConfig;
  categoryEntity?: MeetingCategoryEntity;
}

export interface MeetingQuestionFormEntity {
  actionConfig: UserActionConfig;
  questionEntity?: MeetingQuestionEntity;
}

export interface MeetingAgendaFormEntity {
  actionConfig: UserActionConfig;
  agendaEntity?: MeetingAgendaEntity;
}

export interface FirmProfileEntity {
  id: Id;
  name: string;
  abn: string;
  streetAddress: string;
  logoPath: string;
  city: string;
  countryId: {
    id: Id;
    name: string;
    currencySymbol: string;
    currencyCode: string;
  };
  postalCode: string;
  nextBillingDate: string;
  financialStartMonth: number;
  dateFormat: string;
  status: Status;
  group: {
    id: Id;
    name: string;
  };
}

export interface MissionVisionValueInterface {
  id: Id;
  title: string;
  status: Status;
}

export interface MissionVisionValueEntityInterface
  extends MissionVisionValueInterface {
  mission: string;
  vision: string;
  values: string;
  name: string;
  imageUrl: string;
}
export interface PeopleEntity {
  id: Id;
  name: string;
  role: {
    id: Id;
    name: string;
  };
  dialCode: string;
  phoneNumber: string;
  status: Status;
}

export interface PersonBasicDetailEntity {
  id: Id;
  name?: string;
  firstName: string;
  lastName: string;
  email: string;
  dialCode: string;
  phoneNumber: string;
  dateOfBirth: string;
  profileUrl: string;
  extension: string;
  linkedInUrl: string;
  division: {
    id: Id;
    name: string;
  };
  role: {
    id: Id;
    name: string;
  };
  type: string;
  status: Status;
  bio: string;
}

export interface PersonSensitiveDetailEntity {
  employeeId: Id;
  commencementDate: string;
  preCommencementExperience: string;
  location: string;
  employmentType: string;
  hoursPerWeek: number;
  weeksPerYear: number;
  annualLeave: number;
  sickLeave: number;
  publicHolidays: number;
  salary: number;
  chargeRate: number;
  productivity: number;
  terminatedDate: string;
  hireAgain: string;
  previousExperience: string;
  strength: string;
  weakness: string;
  potentialRole: {
    id: Id;
    name: string;
  };
  personalContactInformation: {
    email: string;
    dialCode: string;
    phoneNumber: string;
  };
  emergencyContactInformation: {
    name: string;
    email: string;
    relation: string;
    dialCode: string;
    phoneNumber: string;
  };
}
export interface FeeHistoryEntity {
  id: number;
  year: number;
  annualFee: number;
  ebita: number;
  growthPercentage: number;
  ebitaPercentage: number;
  tenant: {
    id: number;
    email: string;
  };
}

export interface DivisionEmployeesEntity {
  id: Id;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  role: {
    id: Id;
    name: string;
  };
  age: number;
  type: string;
  status: Status;
  dateOfBirth: string;
}

export interface TeamEmployeesEntity {
  id: Id;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  employeeManager: {
    id: Id;
    firstName: string;
    lastName: string;
  };
  isLead: boolean;
  role: {
    id: Id;
    name: string;
  };
  dateOfBirth: string;
  type: PersonTypeEnum;
  status: Status;
  profileUrl: string;
}

export interface DivisionTeamEntity {
  id: Id;
  name: string;
  status: Status;
}

export interface OrganisationStructureEntity {
  id: Id;
  firstName: string;
  lastName: string;
  role: {
    id: Id;
    name: string;
  };
  managerId: Id;
  team: {
    id: Id;
    name: string;
  };
  division: {
    id: Id;
    name: string;
  };
  imageUrl: string;
}

export interface AccountManagementEntity {
  id: Id;
  email: string;
  name?: string;
  firstName: string;
  lastName: string;
  status: Status;
  role: {
    id: Id;
    name: string;
  };
  lastLogin: string;
}

export interface PlanEntity {
  id: Id;
  name: string;
  financialYear: number;
  status: Status;
  planBudgetId: Id;
  planFeeId: Id;
  planLockupId: Id;
  planEbitaId: Id;
  planTeamNpsId: Id;
  planClientNpsId: Id;
  planFeeWonLostId: Id;
}

export interface FirmProfileFinancialYearStartMonthEntity {
  financialYearStartMonth: number;
}

export interface BudgetTeamEntity {
  id: Id;
  team: {
    id: Id;
    name: string;
  };
  status: Status;
  createdOn: string;
}

export interface FeeBudgetEntity {
  id: Id;
  scm: {
    id: Id;
    name: string;
  };
  cpi: number;
  totalActualFeeLastYear: number;
  forecastYearGrowthKpi: number;
  businessOverhead: number;
  administrationSalaries: number;
  teamAccountingWages: number | null;
  teamBookkeepingWages: number | null;
  scmGrossProfit: number;
  forecastEbita: number;
  finalAccountingBudget: number;
  finalBookkeepingBudget: number;
  divisionsBudgets: [
    {
      id: Id;
      teamType: string;
      previous_year_fee: number;
      uninvoicedFeeLost: number;
      subtotalTax: number;
      feeIncreasedByCpi: number;
      feeWon: number;
      newFeeToBeWon: number;
      newFeeWonGrowthRate: number;
    },
    {
      id: Id;
      teamType: string;
      previous_year_fee: number;
      uninvoicedFeeLost: number;
      subtotalTax: number;
      feeIncreasedByCpi: number;
      feeWon: number;
      newFeeToBeWon: number;
      newFeeWonGrowthRate: number;
    }
  ];
}

export interface TeamDivisionEntity {
  id: Id;
  name: string;
  status: Status;
}

export interface CapacityDivisionTeamEntity {
  id: Id;
  name: string;
  email: string;
  role: {
    id: Id;
    name: string;
  };
  type: PersonTypeEnum;
  capacityFee: number;
  annualBudget: number;
  experience: string;
  location: string;
  salary: number;
  workingWeeks: number;
  hoursPerWeek: number;
  totalHours: number;
  productivity: number;
  productiveHours: number;
  chargeRate: number;
  costPerHour: number;
  sickLeave: number;
  publicHolidays: number;
  annualLeave: number;
}

export interface TeamMetadataEntity {
  id: Id;
  teamId: Id;
  teamType: string;
  totalSalary: number;
  totalCapacityFee: number;
  totalAnnualBudget: number;
  totalHours: number;
  productiveHours: number;
}

export interface LockupPlanEntity {
  id: Id;
  title?: string;
  notes?: string;
  plan: {
    id: Id;
    name: string;
    financialYear: number;
  };
  status: Status;
}

export interface MarketingResultsEntity {
  id: number;
  year: number;
  type: string;
  data: {
    monthlyResults: {
      month: number;
      value: number;
    }[];
  };
  status: Status;
}
export interface LockupEntity {
  lockupTeamId: Id;
  team: {
    id: Id;
    name: string;
  };
  workInProgress: number;
  debts: number;
}

export interface LockupTeamEntity {
  id: Id;
  month: number;
  workInProgress: number;
  debts: number;
}

export interface FeeBreakdownEntity {
  id: Id;
  month: number;
  currentMonthFee: number;
  previousMonthFee: number;
}

export interface FeeBreakdownFirmWideEntity {
  month: number;
  teamsData: Array<{
    budgetTeamId: Id;
    currentActualFee: number;
    previousActualFee: number;
    teamName: string;
  }>;
}

export interface TeamMonthlyBudgetEntity {
  month: number;
  totalBudget: number;
}

export interface EbitdaEntity {
  id: Id;
  teamName: string;
  writeOnOff: number;
  overhead: number;
  wages: number;
  directExpenses: number;
  otherDirectExpenses: number;
  employees: number;
  revenue: number;
  ownerMarketSalary: number;
  ownerWithdrawalSalary: number;
}

interface MonthEntity {
  id: Id;
  month: number;
  budget: number;
}

export interface TeamBudgetEntity {
  employee: {
    id: Id;
    firstName: string;
    lastName: string;
  };
  annualBudget: number;
  monthlyBudget: Array<MonthEntity>;
}

export interface SummaryResultEntity {
  id: Id;
  forecast_annual_fee: number;
  capacity_fee: number;
  team_type: TEAM_TYPE;
  totalSalary: number;
}

export interface FirmWideResultEntity {
  totalCapacityFee: number;
  totalForecastAnnualFee: number;
  totalSalary: number;
}

export interface TeamMonthlyCogs {
  id: Id;
  month: number;
  wages: number;
  directExpenses: number;
  otherDirectExpenses: number;
  ownerWithdrawalSalary: number;
  ownerMarketSalary: number;
}

export interface MonthlyOverheadEntity {
  id: Id;
  name: string;
  overhead: number;
}

export interface OverheadEntity {
  month: number;
  totalOverhead: number;
  overheadType: string;
  monthlyOverheads: Array<MonthlyOverheadEntity>;
}

export interface WriteOnAndOffEntity {
  month: number;
  writeOnOff: number;
}

export interface ScoreEntity {
  month: number;
  score: number;
}

export interface TeamNPSEntity {
  teamNpsId: Id;
  teamName: string;
  scores: Array<ScoreEntity>;
}

export interface Fab5RevnueEntity {
  budgetTeamId: Id;
  teamName: string;
  totalCurrentYTD: number;
  totalPreviousYTD: number;
  totalBudget: number;
}

export interface Fab5ProfitabilityEntity {
  budgetTeamId: Id;
  teamName: string;
  totalWriteOffs: number;
  overhead: number;
  wages: number;
  directExpenses: number;
  otherDirectExpenses: number;
  revenue: number;
}

export interface Fab5LockupEntity {
  planId: Id;
  budgetId: Id;
  budgetTeamId: Id;
  teamName: string;
  totalWorkInProgress: number;
  totalDebts: number;
}

export interface Fab5SalesEntity {
  budgetTeamId: Id;
  teamName: string;
  wonCurrentYearAccounting: number;
  wonCurrentYearBookkeeping: number;
  lostCurrentYearAccounting: number;
  lostCurrentYearBookkeeping: number;
  clientCount: number;
  prospectCount: number;
  leadCount: number;
}

export interface Fab5NpsEntity {
  planId: Id;
  budgetId: Id;
  budgetTeamId: Id;
  teamName: string;
  averageTeamScore: number;
  averageClientScore: number;
}

export interface ClientManagerEntity {
  id: number;
  firstName: string;
  lastName: string;
}

export interface LeadDataEntity {
  id: number;
  name: string;
}

export interface DocumentEntity {
  id: number;
  fileName: string;
  fileSize: number;
  mimeType: string;
  resourceUrl: string;
}

export interface ClientClassEntity {
  id: number;
  code: string;
  description: string;
  name: string;
  status: string;
}

export interface ClientEntity {
  annualFee: number;
  businessName: string;
  clientManager: ClientManagerEntity;
  contactName: string;
  id: number;
  leadIndustry: LeadDataEntity;
  leadSource: LeadDataEntity;
  leadStage: LeadDataEntity;
  status: string;
  class?: LeadDataEntity;
  dialCode?: string;
  documents?: DocumentEntity[];
  email?: string;
  isAppointmentBooked?: boolean;
  isConvertedToClient?: boolean;
  leadFoundOn?: string;
  name?: string;
  phoneNumber?: string;
  referredBy?: string;
  tenantId?: number;
  leadDetails?: string;
  appointmentMonth?: number;
  appointmentYear?: number;
}

export interface LeadProgressEntity {
  id: number;
  leadStatus: LeadDataEntity;
  actionBy: ClientManagerEntity;
  tenantId: number;
  status: string;
}

export interface NoteEntity {
  id: number;
  tenantId: number;
  createdOn: string;
  updatedOn: string;
  note: string;
}

export interface CategoryEntity {
  id: Id;
  code: string;
  name: string;
  status: Status;
}

export interface TaskStatusEntity {
  id: Id;
  name: string;
  status: Status;
  clonedType?: string;
}

export interface MeetingCategoryTenantEntity {
  id: Id;
  name: string;
  status: Status;
  clonedType: string;
}

export interface EbitdaThresholdEntity {
  id: Id;
  ebitaThresholdPercentage: number;
  triggeredBonusPercentage: number;
}

export interface ClientNpsResponseRateEntity {
  month: number;
  responseRate: number;
}

export interface GroupState {
  hasGroup: boolean;
}

export interface EbitdaBonusEntity {
  id: Id;
  tenantId: Id;
  ebitaId: Id;
  firmEbitaThresholdPercentage: number;
  teamEbitaThresholdPercentage: number;
  scmBonusPercentage: number;
  productionTeamBonusPercentage: number;
  adminTeamBonusPercentage: number;
  status: Status;
}

export interface ClientPortfolioEntity {
  id: number;
  name: string;
  clientCount: number;
  totalAnnualFee: number;
}

export interface FeeWonAndLostPlan {
  id: Id;
  name: string;
  financialYear: string;
}
export interface FeeWonAndLostPlanEntity {
  id: Id;
  notes?: string;
  plan: FeeWonAndLostPlan;
  status: Status;
}
export interface FeeWonAndLostTeamEntity {
  id: Id;
  team: {
    id: Id;
    name: string;
  };
  status: Status;
}

export interface FeeWonsClientEntity {
  id: Id;
  businessName: string;
  contactName: string;
}

export interface FeeWonsEntity {
  id: Id;
  client: FeeWonsClientEntity;
  currentYearAccountingFee: number | null;
  currentYearBookkeepingFee: number | null;
  nextYearAccountingFee: number;
  nextYearBookkeepingFee: number;
}

export interface FeeLostsEntity {
  id: Id;
  client: FeeWonsClientEntity;
  feeLostReason: {
    id: Id;
    name: string;
  };
  currentYearAccountingFee: number | null;
  currentYearBookkeepingFee: number | null;
  nextYearAccountingFee: number;
  nextYearBookkeepingFee: number;
}

export interface AuthorEntity {
  id: Id;
  firstName: string;
  lastName: string;
}

export interface PolicyProcedureDivisionEntity {
  id: Id;
  name: string;
}

export interface PolicyProcedureDocumentEntity {
  id: Id;
  fileName: string;
  mimeType: string;
  fileSize: string;
  resourceUrl: string;
}

export interface PolicyProcedureLinkEntity {
  id: Id;
  name: string;
  link: string;
}

export interface PolicyProcedureVideoEntity extends PolicyProcedureLinkEntity {
  type: Option | string;
}

export interface PoliciesAndProceduresEntity {
  id: Id;
  name: string;
  number?: string;
  keywords?: string;
  description?: string;
  author: AuthorEntity;
  division?: PolicyProcedureDivisionEntity;
  documents?: PolicyProcedureDocumentEntity[];
  links?: PolicyProcedureLinkEntity[];
  videos?: PolicyProcedureVideoEntity[];
  status: string;
  updatedOn?: string;
  isRecent?: boolean;
}
