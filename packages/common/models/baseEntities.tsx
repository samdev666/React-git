export type Status = "ACTIVE" | "INACTIVE";

export type BasicObject = Record<string, unknown>;

export type Id = string | number | undefined | null;

export interface MetaData<T> {
  order: keyof T | "";
  direction: "asc" | "desc";
  total: number;
  page: number;
  limit: number;
  filters: Record<string, string | boolean>;
  allowedFilters: Array<string>;
  allResults?: boolean;
}

export interface PagedEntity<T> {
  metadata: MetaData<T>;
  records: T[];
  requestDate?: Date;
}

export interface PaginatedEntity {
  key: string;
  name: string;
  api: string;
}

export const getDefaultMetaData = <T,>(): MetaData<T> => ({
  order: "",
  direction: "asc",
  total: 0,
  page: 1,
  limit: 10,
  filters: {},
  allowedFilters: [],
});

export interface ModalActionProps {
  title: string;
  body: string | ((closePopup: () => void) => JSX.Element);
  resolveText?: string;
  resolveMessage?: string;
  rejectText?: string;
  data?: { [id: string]: any };
  className?: string;
  resolveDisabled?: boolean;
  rejectDisabled?: boolean;

  resolve?(): void;

  resolveWithPromise?(): Promise<void>;

  reject?(): void;

  rejectWithPromise?(): Promise<void>;
}

export interface ModalState {
  show: boolean;
  title: string;
  body: string | ((closePopup: () => void) => JSX.Element);
  className: string;
  resolveText?: string;
  resolveMessage?: string;
  rejectText?: string;
  data: { [id: string]: any };
  resolveDisabled: boolean;
  resolveWithPromise: any;
  rejectDisabled: boolean;
  rejectWithPromise: any;

  resolve(): Promise<void>;

  reject(): Promise<void>;
}

export const getDefaultModalState = (): ModalState => ({
  show: false,
  title: "",
  body: "",
  className: "",
  resolveText: "",
  resolveMessage: "",
  rejectText: "",
  data: {},
  resolveDisabled: false,
  resolveWithPromise: undefined,
  rejectDisabled: false,
  rejectWithPromise: undefined,
  reject: () => Promise.reject(),
  resolve: () => Promise.resolve(),
});

export interface Option {
  id: number | string;
  label: string;
}

export interface TabsInterface {
  id: number | string;
  label: string | JSX.Element;
  route?: string;
}

export enum UserActionType {
  EDIT = "EDIT",
  DELETE = "DELETE",
  CREATE = "CREATE",
}

export enum VerificationActionType {
  SETUP = "SETUP",
  ENABLE = "ENABLE",
  DISABLE = "DISABLE",
  MODIFY = "MODIFY",
}

export interface UserActionConfig {
  type: UserActionType;
  id?: Id;
}

export enum RoleType {
  ADMIN_PORTAL = "ADMIN_PORTAL",
}

export interface RoleInterface {
  id: Id;
  name: string;
  type: RoleType;
}

export enum CurrencyType {
  AUD = "AUD",
}

export enum FrequencyType {
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export enum MethodType {
  EMAIL = "Email",
  PHONE = "Phone",
}

export enum MethodValue {
  OTP = "OTP",
}

export enum TeamStructureEnum {
  BOARD = "Board",
  MARKETING = "Marketing",
  SALES = "Sales",
  PRODUCTION = "Production",
  QUALITY = "Quality",
  ADMIN = "Admin",
  ACCOUNTS = "Accounts",
}

export enum MarketingResultsEnum {
  LEAD_DATA = "LEAD_DATA",
  WEBSITE_TRAFFIC = "WEBSITE_TRAFFIC",
  NEWSLETTER_OPEN_RATE = "NEWSLETTER_OPEN_RATE",
  CLICK_THROUGH_RATE = "CLICK_THROUGH_RATE",
  DATABASE_GROWTH = "DATABASE_GROWTH",
}

export enum PersonTypeEnum {
  GRINDER = "GRINDER",
  FINDER = "FINDER",
  MINDER = "MINDER",
}

export enum RoleTypeEnum {
  WIZEHUB_PORTAL = "WIZEHUB_PORTAL",
  ADMIN_PORTAL = "ADMIN_PORTAL",
}

export enum BudgetAndCapacityEnum {
  FEE_BUDGET = "Fee Budget",
  TEAM_CAPCITY = "Team Capacity",
  TEAM_BUDGET = "Team Budget",
  SUMMARY_RESULTS = "Summary Results",
}
