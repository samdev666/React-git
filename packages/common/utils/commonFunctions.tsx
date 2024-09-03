import moment, { Moment } from "moment";
import { Id, Option } from "../models";
import { Months } from "../models/modules";
import { EbitdaThresholdEntity } from "../models/genericEntities";
import { greyScaleColour, otherColour } from "../theme/style.palette";

export const convertIsoDatoToIsoDateTime = (
  date?: string
): string | undefined => {
  if (!date) {
    return undefined;
  }
  return `${date}T${moment().format("HH:mm:ssZ")}`;
};

export const encodeBase64 = (input: any) => btoa(JSON.stringify(input));
export const decodeBase64 = (input: string) => JSON.parse(atob(input));

export const convertToIsoDateTime = (date?: string): string | undefined => {
  if (!date) {
    return undefined;
  }
  return moment(date).format("YYYY-MM-DDTHH:mm:ssZ");
};

export const convertToIsoDate = (date?: string): string | undefined => {
  if (!date) {
    return undefined;
  }
  return moment(date).format("YYYY-MM-DD");
};

export const isUndefined = (value: unknown): boolean => value === undefined;
export const isNull = (value: unknown): boolean => value === null;

export const getApiDate = (
  value: string | moment.Moment | undefined | null
): string | undefined | null => {
  if (isNull(value)) return null;
  if (isUndefined(value)) return undefined;
  return convertToIsoDate(value as string);
};

export const convertToMomentDate = (
  value: string | moment.Moment | undefined | null
): moment.Moment | undefined | null => {
  if (isNull(value)) return null;
  if (isUndefined(value)) return undefined;
  return moment(value);
};

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export const getEditUrl =
  (route: string) =>
  (entity: any): string =>
    route.replace(":id", entity?.id);

export const convertSingleToDoubleDigit = (
  value?: number
): string | undefined => {
  if (isNull(value)) return null;
  if (isUndefined(value)) return undefined;

  if (value >= 0 && value <= 9) {
    return `0${value}`;
  }
  return `${value}`;
};

export const fileSizeCheckFunction = (
  fileSize: number,
  acceptedFileSize: number
) => {
  if (fileSize / 1024 / 1024 >= acceptedFileSize) {
    return true;
  }
  return false;
};

export const validFileTypeCheckFunction = (
  fileType: string,
  allowedFilesArray: string[] | string
): boolean => allowedFilesArray.includes(fileType);

export const capitalizeLegend = (str?: string) => {
  if (str === null || str === undefined) {
    return str;
  }
  return `${str?.charAt(0)?.toUpperCase()}${str
    ?.slice(1)
    ?.toLowerCase()
    .replace("_", " ")}`;
};

export const dateFormatterFunction = (
  date: string | Moment,
  formatType: string = "DD MMM YYYY"
) => moment(date).format(formatType);

export const mapIdNameToOptionWithoutCaptializing = (entity: {
  id: Id;
  name: string;
}): Option => ({ id: entity?.id, label: entity?.name });

export const mapIdNameToOptionWithTitleWithoutCaptializing = (entity: {
  id: Id;
  title?: string;
}): Option => ({ id: entity?.id, label: entity?.title });

export const mapIdNameToOptionWithTitle = (entity: {
  id: Id;
  title: string;
}): Option => ({ id: entity?.id, label: entity?.title });

export const mapIdNameToOption = (entity: {
  id: Id;
  name: string;
}): Option => ({ id: entity?.id, label: capitalizeLegend(entity?.name) });

export const mapIdFullNameToOption = (entity: {
  id: Id;
  firstName: string;
  lastName: string;
}): Option => ({
  id: entity?.id,
  label: capitalizeLegend(`${entity?.firstName} ${entity?.lastName}`),
});

export const underscoreChangeFunction = (str: string): string => {
  if (!str.includes("_")) {
    return str;
  }
  return str.replace("_", " ");
};

export const trimWordWrapper = (str: string): string =>
  str ? str.trim() : null;

export const maskData = (data: string) => {
  if (!data) {
    return "";
  }

  if (data.includes("@")) {
    const parts = data.split("@");
    return `${parts[0].slice(0, 2)}****@${parts[1]}`;
  }
  const dialCode = data.substring(0, 2);
  return `${dialCode} ${data.slice(2, 4)}********${data.slice(-2)}`;
};

export const generateStrongPassword = (length: number = 8): string => {
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const specialChars = "!@#$%^&*()-_=+[{]}|;:,<.>/?";

  const getRandomIndex = (max: number): number => {
    const crypto = window.crypto || (window as any).msCrypto;
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % max;
  };

  let password = "";

  password += uppercaseChars[getRandomIndex(uppercaseChars.length)];
  password += lowercaseChars[getRandomIndex(lowercaseChars.length)];
  password += numberChars[getRandomIndex(numberChars.length)];
  password += specialChars[getRandomIndex(specialChars.length)];

  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;

  for (let i = password.length; i < length; i += 1) {
    password += allChars[getRandomIndex(allChars.length)];
  }

  const shuffleArray = (array: string[]): string[] => {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = getRandomIndex(i + 1);
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  password = shuffleArray(password.split("")).join("");

  return password;
};

export const capitalizeEntireString = (
  str: string | number
): string | undefined => {
  if (!str) {
    return null;
  }
  const stringToCapitalize = str as string;
  return stringToCapitalize?.toUpperCase();
};

export const nullablePlaceHolder = (entity: Id | string) => {
  return entity !== undefined &&
    entity !== null &&
    isFinite(Number(entity)) &&
    !isNaN(Number(entity)) &&
    entity !== "-"
    ? entity
    : "-";
};

export const monthFunction = (monthNumber: number) => {
  return Months[monthNumber - 1];
};

export const financialYearStartMonth = (monthNumber: number) => {
  const resultantArray = [];
  while (resultantArray.length !== 12) {
    if (monthNumber === 13) {
      monthNumber = 1;
    }
    resultantArray.push({
      monthNumber: monthNumber,
      monthName: Months[monthNumber - 1]?.label,
    });
    monthNumber++;
  }
  return resultantArray;
};

export const addAnyNumberOfValues = (...args: Array<number>) => {
  const allNull = args.every((value) => value === null);

  if (allNull) {
    return null;
  }

  const total = args.reduce((acc, curr) => {
    if (curr == null) {
      return;
    }
    return acc + Number(curr);
  }, 0);
  return total;
};

export const totalValueMethod = (array: Array<any>, key: keyof any) => {
  const currentYearTotal = array?.reduce((acc, curr) => {
    if (curr[key] === null) {
      return acc;
    }
    return acc + (curr[key] as number);
  }, 0);

  const isAllNull = array?.every((item) => item[key] === null);
  return isAllNull ? null : currentYearTotal?.toFixed(2);
};

export const formatCurrency = (
  amount: number | string,
  isStyle: boolean = true,
  locale: string = "en-US",
  currency: string = "USD"
): string => {
  if (nullablePlaceHolder(amount) === "-") {
    return "-";
  }
  const hasDecimals = Number(amount) % 1 !== 0;
  return new Intl.NumberFormat(locale, {
    style: isStyle ? "currency" : undefined,
    currency: currency,
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  }).format(Number(amount));
};

export const decimalFormatterFunction = (
  array: Array<any>,
  total: number,
  arrayKeyToAdd: string
) => {
  const arrayTotal = totalValueMethod(array, arrayKeyToAdd);
  const lastNUllIndex =
    array?.lastIndexOf((item: any) => item[arrayKeyToAdd] !== null) !== -1
      ? array?.lastIndexOf((item: any) => item[arrayKeyToAdd] === null)
      : array.length - 1;
  const difference = total - arrayTotal;
  const lastObject = array[lastNUllIndex];
  lastObject[arrayKeyToAdd] = (lastObject[arrayKeyToAdd] + difference).toFixed(
    2
  );
  return [...array.slice(0, array?.length - 1), lastObject];
};

export const reorderMonthArray = (
  array: Array<any>,
  financialStartMonth: number,
  arrayKeyToAdd: string
) => {
  const firstPart = array?.filter(
    (month) => month[arrayKeyToAdd] >= financialStartMonth
  );
  const secondPart = array.filter(
    (month) => month[arrayKeyToAdd] < financialStartMonth
  );
  return [...firstPart, ...secondPart];
};

export const ytdAverageDistribution = (
  ytdTotal: number,
  notNullValues: number
) => {
  return Number(
    Number(ytdTotal) / Number(notNullValues ? notNullValues : 1)
  ).toFixed(2);
};

export const getDiscountPercentage = (
  data: EbitdaThresholdEntity[],
  providedEbitaPercentage: number
): number | null => {
  let selectedDiscount: EbitdaThresholdEntity | null = null;
  for (const { ebitaThresholdPercentage, triggeredBonusPercentage } of data) {
    if (providedEbitaPercentage === ebitaThresholdPercentage) {
      return triggeredBonusPercentage;
    }
    if (providedEbitaPercentage > ebitaThresholdPercentage) {
      if (
        !selectedDiscount ||
        ebitaThresholdPercentage > selectedDiscount.ebitaThresholdPercentage
      ) {
        selectedDiscount = {
          ebitaThresholdPercentage,
          triggeredBonusPercentage,
          id: selectedDiscount?.id || "",
        };
      }
    }
  }
  return selectedDiscount?.triggeredBonusPercentage ?? null;
};

export const decimalValueFix = (value: number): string => {
  if (nullablePlaceHolder(value) !== "-") {
    return "-";
  }
  return value?.toFixed(2);
};

export const colourProviderFunction = (value: number | string): string => {
  if (value === "-") {
    return greyScaleColour.secondaryMain;
  }
  const modifiedNumber = Number(value);
  if (modifiedNumber < 0) {
    return otherColour.errorDefault;
  }
  return otherColour.successDefault;
};
export const stringTrimWithNumberOfCharacters = (
  message: string,
  numberOfCharacters: number
): string => {
  if (!message || message.length < numberOfCharacters) {
    return message;
  }
  const finalMessage = message.slice(0, numberOfCharacters).concat("...");
  return finalMessage;
};

export const leapYearFunction = () => {
  const currentYear = moment().year();
  if (
    currentYear % 100 === 0 ? currentYear % 400 === 0 : currentYear % 4 === 0
  ) {
    return 366;
  }
  return 365;
};

export const calculateNumberOfDaysFromFinancialYearStart = (
  financialYearStart: number,
  currentMonth: string
) => {
  const currentYear = moment().year();
  const financialYearStartDate = moment()
    .month(financialYearStart - 1)
    .startOf("month");
  const lastDateOfCurrentMonth = moment(currentMonth, "MMM")
    .year(currentYear)
    .endOf("month");
  if (lastDateOfCurrentMonth.isBefore(financialYearStartDate)) {
    financialYearStartDate.subtract(1, "year");
  }
  const daysDifference = lastDateOfCurrentMonth.diff(
    financialYearStartDate,
    "days"
  );
  return daysDifference;
};
