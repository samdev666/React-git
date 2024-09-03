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

/* eslint-disable no-bitwise */
export const darkenColor = (color: string, percent: number) => {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);

  const clamp = (value: number) => {
    if (value < 1) return 0;
    if (value < 255) return value;
    return 255;
  };

  const R = clamp((num >> 16) - amt);
  const G = clamp(((num >> 8) & 0x00ff) - amt);
  const B = clamp((num & 0x0000ff) - amt);

  return (
    `#${
      (
        0x1000000
      + R * 0x10000
      + G * 0x100
      + B
      )
        .toString(16)
        .slice(1)}`
  );
};

export const lightenColor = (color: string, percent: number) => {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);

  const clamp = (value: number) => {
    if (value > 255) return 255;
    return value;
  };

  const R = clamp((num >> 16) + amt);
  const G = clamp(((num >> 8) & 0x00ff) + amt);
  const B = clamp((num & 0x0000ff) + amt);

  return (
    `#${
      (
        0x1000000
      + R * 0x10000
      + G * 0x100
      + B
      )
        .toString(16)
        .slice(1)}`
  );
};

/* eslint-enable no-bitwise */

export const MAX_FILE_SIZE = 4;
