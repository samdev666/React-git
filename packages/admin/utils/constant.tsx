import { Option } from '@wizehub/common/models';
import messages from '../messages';

export const headerItems = [
  {
    key: 'manage-locations',
    label: messages?.general?.headings?.manageLocations,
  },
  {
    key: 'manage-users',
    label: messages?.general?.headings?.manageUsers,
  },
  {
    key: 'about',
    label: messages?.general?.headings?.about,
  },
];

export const MAX_FILE_SIZE = 4;

export const StatusOptions: Option[] = [
  { id: 'ACTIVE', label: 'Active' },
  { id: 'INACTIVE', label: 'Inactive' },
];

export const PositionOptions: Option[] = [
  { id: 1, label: 'First Level' },
  { id: 2, label: 'Second Level' },
  { id: 3, label: 'Third Level' },
  { id: 4, label: 'Fourth Level' },
  { id: 5, label: 'Fifth Level' },
  { id: 6, label: 'Sixth Level' },
  { id: 7, label: 'Seventh Level' },
  { id: 8, label: 'Eighth Level' },
  { id: 9, label: 'Nineth Level' },
];

export const AgendaTypeOptions: Option[] = [
  { id: 'VIDEO', label: 'Video' },
];
