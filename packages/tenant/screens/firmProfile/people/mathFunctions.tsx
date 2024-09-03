//Functions that are only used in this module.

import {
  calculateNumberOfDaysFromFinancialYearStart,
  leapYearFunction,
  nullablePlaceHolder,
} from "@wizehub/common/utils";

export const billableWorkingWeeks = (
  weeksPerYear: string | number,
  annualLeaves: string | number,
  sickLeave: string | number,
  publicHolidays: string | number
): string => {
  if (!weeksPerYear || !annualLeaves || !sickLeave || !publicHolidays) {
    return "-";
  }
  const addLeaves =
    Number(annualLeaves) + Number(sickLeave) + Number(publicHolidays);
  return Number(Number(weeksPerYear) - Number(addLeaves)).toFixed(2);
};

export const totalHours = (
  weeksPerYear: string | number,
  hoursPerWeek: string | number
): string => {
  if (
    !weeksPerYear ||
    !hoursPerWeek ||
    nullablePlaceHolder(weeksPerYear) === "-" ||
    nullablePlaceHolder(hoursPerWeek) === "-"
  ) {
    return "-";
  }
  return Number(Number(weeksPerYear) * Number(hoursPerWeek)).toFixed(2);
};

export const productiveHours = (
  productivityPercentage: number | string,
  weeksPerYear: string | number,
  hoursPerWeek: string | number
): string => {
  if (!weeksPerYear || !hoursPerWeek || !productivityPercentage) {
    return "-";
  }
  const totalHours = Number(weeksPerYear) * Number(hoursPerWeek);
  const productive = Number(productivityPercentage) / 100;
  return Number(totalHours * Number(productive)).toFixed(2);
};

export const costPerHour = (
  weeksPerYear: string | number,
  hoursPerWeek: string | number,
  salary: string | number
): string => {
  if (!weeksPerYear || !hoursPerWeek || !salary) {
    return "-";
  }
  const totalHours = Number(weeksPerYear) * Number(hoursPerWeek);
  return Number(Number(salary) / totalHours).toFixed(2);
};

export const feeCapacity = (
  productiveHours: string | number,
  chargeRate: string | number
): string => {
  if (!productiveHours || !chargeRate) {
    return "-";
  }
  return Number(Number(productiveHours) * Number(chargeRate)).toFixed(2);
};

export const finalCostPerHour = (
  salary: string | number,
  totalHours: string | number
): string => {
  if (!salary || !totalHours) {
    return "-";
  }
  return Number(Number(salary) / Number(totalHours)).toFixed(2);
};

export const GrossProfitKPI = (
  capacityFee: string | number,
  salary: string | number
): string => {
  if (
    nullablePlaceHolder(capacityFee) === "-" ||
    nullablePlaceHolder(salary) === "-" ||
    Number(capacityFee) / 1 === 0
  ) {
    return "-";
  }
  return Number(
    ((Number(capacityFee) - Number(salary)) / Number(capacityFee)) * 100
  ).toFixed(2);
};

export const finalProductiveHours = (
  totalHours?: string | number,
  productivePercentage?: string | number
): string => {
  if (
    !totalHours ||
    !productivePercentage ||
    nullablePlaceHolder(totalHours) === "-" ||
    nullablePlaceHolder(productivePercentage) === "-"
  ) {
    return "-";
  }
  return ((Number(totalHours) * Number(productivePercentage)) / 100).toFixed(2);
};

export const lockupDays = (
  wip: string | number,
  debtor: string | number,
  budget: string | number,
  financialYearStartMonth: number,
  currentMonth: string
) => {
  if (
    !wip ||
    !debtor ||
    nullablePlaceHolder(wip) === "-" ||
    nullablePlaceHolder(debtor) === "-" ||
    !budget ||
    nullablePlaceHolder(budget) === "-"
  ) {
    return "-";
  }
  return (
    ((Number(wip) + Number(debtor)) / Number(budget)) *
    calculateNumberOfDaysFromFinancialYearStart(
      financialYearStartMonth,
      currentMonth
    )
  ).toFixed(2);
};
