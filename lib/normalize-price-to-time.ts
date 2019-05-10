import BigNumber from "bignumber.js";

export interface IPriceToTime {
  priceValue: string;
  priceUnit: string;
  timeUnit: string;
}

export const priceUnits = {
  "wei": new BigNumber(1),
  "kwei": new BigNumber(1000),
  "mwei": new BigNumber(1000000),
  "gwei": new BigNumber(1000000000),
  "microether": new BigNumber(1000000000000),
  "milliether": new BigNumber(1000000000000000),
  "ether": new BigNumber(1000000000000000000),
};

export const timeUnits = {
  "day": 86400,
  "hour": 3600,
  "minute": 60,
  "second": 1,
}

export function normalizePriceToTime(value: IPriceToTime) {
  const result = new BigNumber(value.priceValue)
    .multipliedBy(priceUnits[value.priceUnit])
    .multipliedBy(timeUnits.hour)
    .dividedBy(timeUnits[value.timeUnit]);

  return { result };
}