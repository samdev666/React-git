//Functions that are only used in this module.

export const twoSumFunction = (
  firstNumber: string | number,
  secondNumber: string | number
): number | string => {
  if (
    (!firstNumber && !secondNumber) ||
    (firstNumber === "-" && secondNumber === "-")
  ) {
    return "-";
  }
  const modifiedFirstNumber =
    firstNumber && firstNumber !== "-" ? Number(firstNumber) : 0;
  const modifiedSecondNumber =
    secondNumber && secondNumber !== "-" ? Number(secondNumber) : 0;
  return Number(modifiedFirstNumber + modifiedSecondNumber).toFixed(2);
};

export const twoSubtractFunction = (
  firstNumber: string | number,
  secondNumber: string | number
): number | string => {
  if (
    (!firstNumber && !secondNumber) ||
    (firstNumber === "-" && secondNumber === "-")
  ) {
    return "-";
  }
  const modifiedFirstNumber =
    firstNumber && firstNumber !== "-" ? Number(firstNumber) : 0;
  const modifiedSecondNumber =
    secondNumber && secondNumber !== "-" ? Number(secondNumber) : 0;
  return Number(modifiedFirstNumber - modifiedSecondNumber).toFixed(2);
};

export const calculatePercentageOf = (
  valueWhosePercentageNeedsToBeCalculated: string | number,
  totalNumber: string | number
): number | string => {
  const value = parseFloat(valueWhosePercentageNeedsToBeCalculated as string);
  const total = parseFloat(totalNumber as string);
  if (isNaN(value) || isNaN(total) || total === 0) {
    return "-";
  }
  return (value * (total / 100)).toFixed(2);
};

export const cummulativeTotalFunction = (
  subTotal: string | number,
  feeIncreasedByCPI: string | number,
  feeWonInForecastedYear: string | number,
  newFeeToBeWon: string | number
): number | string => {
  if (
    !subTotal ||
    !feeIncreasedByCPI ||
    !feeWonInForecastedYear ||
    !newFeeToBeWon
  ) {
    return "-";
  }
  return (
    Number(subTotal) +
    Number(feeIncreasedByCPI) +
    Number(feeWonInForecastedYear) +
    Number(newFeeToBeWon)
  );
};

export const percentageCalculatorFunction = (
  firstNumber: string | number,
  secondNumber: string | number
): number | string => {
  if (!firstNumber || !secondNumber) {
    return "0";
  }
  const modifiedFirstNumber =
    firstNumber && firstNumber !== "-" ? Number(firstNumber) : 0;
  const modifiedSecondNumber =
    secondNumber && secondNumber !== "-" ? Number(secondNumber) : 0;

  const percentage =
    (Number(modifiedFirstNumber) / Number(modifiedSecondNumber)) * 100;
  return Number(percentage.toFixed(2));
};

export const allocateBudgetFunction = (
  feeCapacity: string | number,
  totalFeeCapacity: string | number,
  totalBudget: string | number
): number | string => {
  return Number(
    (
      (Number(feeCapacity) / Number(totalFeeCapacity)) *
      Number(totalBudget)
    ).toFixed(2)
  );
};
