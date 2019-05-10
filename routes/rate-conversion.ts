import { ServerRoute } from "hapi";
import * as BaseJoi from "joi";
import { normalizePriceToTime, priceUnits, timeUnits, IPriceToTime } from "../lib/normalize-price-to-time";

// Price per unit titme validaor
const priceToTime: BaseJoi.Extension = (joi: typeof BaseJoi) => ({
  base: joi.string(),
  name: "string",
  // Preprocess value
  pre(value: string, state: any, options: any) {
    // Ignore spaces and casing
    return value.replace(/ +/g, "").toLowerCase();
  },
  rules: [
    {
      name: "priceToTime",
      validate(params: any, value: string, state: any, options: any) {
        const regexp = /^(?<priceValue>\d+(\.\d+)?)(?<priceUnit>\w+)\/(?<timeUnit>\w+)$/;
        const { groups: { priceValue, priceUnit, timeUnit } } = value.match(regexp);

        // Current price unit must exist in valid price units list
        if (!Object.keys(priceUnits).includes(priceUnit)) {
          throw new Error("Invalid price unit");
        }

        // Current time unit must exist in valid time units list
        if (!Object.keys(timeUnits).includes(timeUnit)) {
          throw new Error("Invalid price unit");
        }

        // Cast to parsed notation (send back the original value too)
        return { priceValue, priceUnit, timeUnit, value };
      },
    },
  ],
});

const Joi = BaseJoi.extend(priceToTime);

export const rateConversion: ServerRoute = {
  method: "GET",
  path: "/eth-rate-convert",
  options: {
    validate: {
      query: {
        rate: Joi.string().priceToTime().required(),
      },
    },
  },
  // Route handler
  handler(request: { query: { rate: IPriceToTime}}) {
    // Business function
    return normalizePriceToTime(request.query.rate);
  },
};
