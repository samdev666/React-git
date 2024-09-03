import { Option } from "@wizehub/common/models";
import messages from "../messages";

export const headerItems = [
  {
    key: "manage-locations",
    label: messages?.general?.headings?.manageLocations,
  },
  {
    key: "manage-users",
    label: messages?.general?.headings?.manageUsers,
  },
  {
    key: "about",
    label: messages?.general?.headings?.about,
  },
];

export const MAX_FILE_SIZE = 10;

export const allowedFiles = [
  "image/apng",
  "image/jpeg",
  "image/pjpeg",
  "image/png",
];

export const PositionOptions: Option[] = [
  { id: 1, label: "First Level" },
  { id: 2, label: "Second Level" },
  { id: 3, label: "Third Level" },
  { id: 4, label: "Fourth Level" },
  { id: 5, label: "Fifth Level" },
  { id: 6, label: "Sixth Level" },
  { id: 7, label: "Seventh Level" },
  { id: 8, label: "Eighth Level" },
  { id: 9, label: "Nineth Level" },
];

export const AgendaTypeOptions: Option[] = [{ id: "VIDEO", label: "Video" }];

export const TenantFormsCode = {
  wizeGap: "WIZE_GAP",
  businessAssessment: "BUSINESS_ASSESSMENT",
  feeHistory: "FEE_HISTORY",
  idealIncomeCalculation: "IDEAL_INCOME_CALCULATION",
};

export const LeadProgressStatusOptions: Option[] = [
  { id: "NOT_STARTED", label: "Not Started" },
  { id: "IN_PROGRESS", label: "In Progress" },
  { id: "COMPLETE", label: "Complete" },
];

export const VideoOptions: Option[] = [
  { id: 'YOUTUBE', label: 'Youtube' },
  { id: 'VIMEO', label: 'Vimeo' },
];

export const PolicyStatusOptions: Option[] = [
  { id: 'DRAFT', label: 'Draft' },
  { id: 'APPROVED', label: 'Approved' },
  { id: 'INREVIEW', label: 'In-review' },
  { id: 'ARCHIVED', label: 'Archived' },
];

export const MAX_NUMBER = 5000000000000000;
