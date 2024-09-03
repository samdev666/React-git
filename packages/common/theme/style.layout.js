export const breakpoints = {
  desktopExtraSmall: 1200,
  desktopSmall: 1499,
  desktopMedium: 1699,
  desktopLarge: 1700,
  desktopMax: 2500,
};

export const respondTo = {
  smUp: `@media only screen and (min-width: ${breakpoints.desktopExtraSmall}px)`,
  smDown: `@media only screen and (max-width: ${breakpoints.desktopSmall}px)`,
  mdUp: `@media only screen and (min-width: ${breakpoints.desktopSmall + 1}px)`,
  mdDown: `@media only screen and (max-width: ${breakpoints.desktopMedium}px)`,
  lgUp: `@media only screen and (min-width: ${breakpoints.desktopLarge}px)`,
  lgDown: `@media only screen and (max-width: ${breakpoints.desktopMax}px)`,
  smOnly: `@media only screen and (min-width: ${breakpoints.desktopExtraSmall}px) and (max-width: ${breakpoints.desktopSmall}px)`,
  mdOnly: `@media only screen and (min-width: ${
    breakpoints.desktopSmall + 1
  }px) and (max-width: ${breakpoints.desktopMedium}px)`,
  screenDown: (sizeInPixel) =>
    `@media only screen and (max-width: ${sizeInPixel}px)`,
  screenUp: (sizeInPixel) =>
    `@media only screen and (min-width: ${sizeInPixel}px)`,
  screenRange: (sizeInPixelL, sizeInPixelH) =>
    `@media only screen and (min-width: ${sizeInPixelL}px) and (max-width: ${sizeInPixelH}px)`,
  screenHight: (sizeInPixel) =>
    `@media only screen and (max-height: ${sizeInPixel}px)`,
};
