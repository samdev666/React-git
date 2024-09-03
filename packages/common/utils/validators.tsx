/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable */

import moment from "moment";
import { ErrorMessage, Validator } from "../hooks";
import messages from "../messages";

export const required =
  (errMessage: string): Validator =>
  (value: any): ErrorMessage =>
    !value || value.length === 0 ? errMessage : undefined;

export const lengthValidator =
  (errMessage: string, lengthOfWord: number): Validator =>
  (value: any): ErrorMessage =>
    !value || value.length >= lengthOfWord ? errMessage : undefined;

export const emptyValueValidator = (value?: string): ErrorMessage =>
  value && value?.trim() === ""
    ? messages?.general?.errors?.emptyValue
    : undefined;

export const requiredIf =
  (errMessage: string, callback: (formValues: any) => boolean): Validator =>
  (value: any, formValues: any): ErrorMessage => {
    if (callback(formValues)) {
      return required(errMessage)(value);
    }
    return undefined;
  };
export const emailValidator = (value?: string): ErrorMessage =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? messages?.general?.errors?.invalidEmail
    : undefined;

export const monthNumberValidator = (value?: string): ErrorMessage =>
  value && (!/^\d{1,2}$/.test(value) || Number(value) < 1 || Number(value) > 12)
    ? messages?.general?.errors?.invalidMonth
    : undefined;

export const weekHoursValidator =
  (message: string) =>
  (value?: string): string | undefined => {
    const isValid =
      value &&
      /^\d+(\.\d+)?$/.test(value) &&
      Number(value) >= 1 &&
      Number(value) <= 168;
    return !isValid ? message : undefined;
  };

export const weeksPerYearValidator =
  (message: string) =>
  (value?: string): string | undefined => {
    const isValid =
      value &&
      /^\d+(\.\d+)?$/.test(value) &&
      Number(value) >= 0 &&
      Number(value) <= 53;
    return !isValid ? message : undefined;
  };

export const daysInAnYearValidator =
  (message: string) =>
  (value?: string): string | undefined => {
    const isValid =
      value &&
      /^\d+$/.test(value) &&
      Number(value) >= 0 &&
      Number(value) <= 366;
    return !isValid ? message : undefined;
  };

export const confirmPassword =
  (errMessage: string, validateWith = "password"): Validator =>
  (value: any, formValues: any): ErrorMessage =>
    value && formValues?.[validateWith]?.value !== value
      ? errMessage
      : undefined;

export const validateDate =
  (message: string) =>
  (value?: string): ErrorMessage =>
    value && !moment(value).isValid() ? message : undefined;

export const validatePassedDate =
  (message: string, endYear?: number, startYear?: number) =>
  (value?: string): ErrorMessage => {
    if (!value) return undefined;

    const date = moment(value, true);

    if (!date.isValid()) {
      return message;
    }

    const year = date.year();
    if (year < (startYear || 1900) || year > (endYear || 2300)) {
      return message;
    }

    return undefined;
  };

export const validatePassedYear =
  (message: string) =>
  (value?: string): ErrorMessage => {
    const year = moment(value).toDate().getFullYear();
    return value && year >= 1900 && year <= 2400 ? undefined : message;
  };

export const validateFutureDate =
  (message: string) =>
  (value?: string): ErrorMessage => {
    const today = moment();
    return (value && !moment(value).isValid()) || moment(value).isBefore(today)
      ? message
      : undefined;
  };

export const validatePastDate =
  (message: string) =>
  (value?: string): ErrorMessage => {
    const today = moment();
    return (value && !moment(value).isValid()) || moment(value).isAfter(today)
      ? message
      : undefined;
  };

export const numberValidator =
  (message: string) =>
  (value?: string): string | undefined =>
    value && !/^\d+(\.\d+)?$/.test(value) ? message : undefined;

export const passwordValidator = (value?: string): ErrorMessage =>
  value &&
  !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(
    value
  )
    ? messages?.general?.errors?.invalidPassword
    : undefined;

export const decimalValidator =
  (message: string) =>
  (value?: string): ErrorMessage =>
    value && !/^[0-9]\d*(\.\d+)?$/i.test(value) ? message : undefined;

export const phoneValidator = (value?: string): ErrorMessage =>
  value && !/^(?:\+?\d{2,4}[ -]?)?(?:\(\d{2,4}\)[ -]?)?\d{5,20}$/i.test(value)
    ? messages?.general?.errors?.invalidPhone
    : undefined;

export const alphaNumericValidator = (value?: string): ErrorMessage =>
  value && !/^[A-Z0-9]+$/i.test(value)
    ? messages?.general?.errors?.invalidABN
    : undefined;

export const linkValidator = (errorMessage: string) => (value: any) =>
  value && !isUrlValid(value) ? errorMessage : undefined;

function isUrlValid(string: string) {
  try {
    return new URL(string).href;
  } catch (err) {
    return false;
  }
}

export const maxMinNumberValidator =
  (maxValue: number, minValue: number, message: string) =>
  (value: any): ErrorMessage =>
    value < minValue || value > maxValue ? message : undefined;
