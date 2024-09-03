import { Option } from "./baseEntities";

export enum Status {
  active = "ACTIVE",
  inactive = "INACTIVE",
  expired = "EXPIRED",
  expiring = "EXPIRING",
  cancelled = "CANCELLED",
}

export enum Country {
  AUSTRALIA = "Australia",
  USA = "USA",
}

export enum MeetingAgendaGuideType {
  VIDEO = "VIDEO",
}

export enum LaunchPadType {
  WIZEHUB = "WIZEHUB",
  OTHER = "OTHER",
}

export enum Role {
  superAdmin = "SUPER ADMIN",
}

export const StatusOptions: Option[] = [
  { id: "ACTIVE", label: "Active" },
  { id: "INACTIVE", label: "Inactive" },
];

export const PersonTypeOptions = [
  { value: "FINDER", label: "Finder" },
  { value: "MINDER", label: "Minder" },
  { value: "GRINDER", label: "Grinder" },
];

export const DateFormats: Option[] = [
  { id: "YYYY-MM-DD", label: "YYYY-MM-DD" },
  { id: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { id: "MM-DD-YYYY", label: "MM-DD-YYYY" },
  { id: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { id: "DD-MM-YYYY", label: "DD-MM-YYYY" },
  { id: "YYYY/MM/DD", label: "YYYY/MM/DD" },
];

export const PersonRelations: Option[] = [
  { id: "MOTHER", label: "Mother" },
  { id: "FATHER", label: "Father" },
  { id: "BROTHER", label: "Brother" },
  { id: "SISTER", label: "Sister" },
  { id: "SON", label: "Son" },
  { id: "DAUGHTER", label: "Daughter" },
  { id: "GRANDMOTHER", label: "Grandmother" },
  { id: "GRANDFATHER", label: "Grandfather" },
  { id: "GRANDSON", label: "Grandson" },
  { id: "GRANDDAUGHTER", label: "Granddaughter" },
  { id: "UNCLE", label: "Uncle" },
  { id: "AUNT", label: "Aunt" },
  { id: "NEPHEW", label: "Nephew" },
  { id: "NIECE", label: "Niece" },
  { id: "COUSIN", label: "Cousin" },
  { id: "HUSBAND", label: "Husband" },
  { id: "WIFE", label: "Wife" },
  { id: "STEPMOTHER", label: "Stepmother" },
  { id: "STEPFATHER", label: "Stepfather" },
  { id: "STEPBROTHER", label: "Stepbrother" },
  { id: "STEPSISTER", label: "Stepsister" },
  { id: "HALF-BROTHER", label: "Half-brother" },
  { id: "HALF-SISTER", label: "Half-sister" },
  { id: "GREAT-GRANDMOTHER", label: "Great-grandmother" },
  { id: "GREAT-GRANDFATHER", label: "Great-grandfather" },
  { id: "GREAT-GRANDSON", label: "Great-grandson" },
  { id: "GREAT-GRANDDAUGHTER", label: "Great-granddaughter" },
  { id: "MOTHER-IN-LAW", label: "Mother-in-law" },
  { id: "FATHER-IN-LAW", label: "Father-in-law" },
  { id: "BROTHER-IN-LAW", label: "Brother-in-law" },
  { id: "SISTER-IN-LAW", label: "Sister-in-law" },
  { id: "SON-IN-LAW", label: "Son-in-law" },
  { id: "DAUGHTER-IN-LAW", label: "Daughter-in-law" },
  { id: "GODFATHER", label: "Godfather" },
  { id: "GODMOTHER", label: "Godmother" },
  { id: "GODSON", label: "Godson" },
  { id: "GODDAUGHTER", label: "Goddaughter" },
];

export const EmployeeTypeOptions: Option[] = [
  { id: "PART_TIME", label: "Part Time" },
  { id: "FULL_TIME", label: "Full Time" },
  { id: "CASUAL", label: "Casual" },
];

export const DecisionOption: Option[] = [
  { id: "YES", label: "Yes" },
  { id: "NO", label: "No" },
];

export const CurrencyOptions: Option[] = [{ id: "AUD", label: "AUD" }];

export const PersonTypeAutocompleteOptions = [
  { id: "FINDER", label: "Finder" },
  { id: "MINDER", label: "Minder" },
  { id: "GRINDER", label: "Grinder" },
];

export const Months: Option[] = [
  { id: 1, label: "Jan" },
  { id: 2, label: "Feb" },
  { id: 3, label: "Mar" },
  { id: 4, label: "Apr" },
  { id: 5, label: "May" },
  { id: 6, label: "Jun" },
  { id: 7, label: "Jul" },
  { id: 8, label: "Aug" },
  { id: 9, label: "Sep" },
  { id: 10, label: "Oct" },
  { id: 11, label: "Nov" },
  { id: 12, label: "Dec" },
];

export const OverheadAllocationMethod: Option[] = [
  { id: 1, label: "By Revenue" },
  { id: 2, label: "By Head Count" },
  { id: 3, label: "Manual Input" },
];

export enum FEE_TYPE {
  PREVIOUS = "PREVIOUS",
  CURRENT = "CURRENT",
}

export enum LOCKUP_MONTH_TYPE {
  WIP = "WORK_IN_PROGRESS",
  DEBTORS = "DEBTS",
}

export enum TEAM_TYPE {
  ACCOUNTING = "ACCOUNTING",
  BOOKKEEPING = "BOOKKEEPING",
}

export enum OVERHEAD_TYPE {
  REVENUE = "REVENUE",
  HEADCOUNT = "HEADCOUNT",
  MANUAL = "MANUAL",
}

export enum PolicyProcedureStatus {
  draft = "DRAFT",
  approved = "APPROVED",
  inReview = "INREVIEW",
  archived = "ARCHIVED"
}
