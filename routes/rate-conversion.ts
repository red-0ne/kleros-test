import { ServerRoute } from "hapi";
import * as BaseJoi from "joi";
import { IPriceToTime, normalizePriceToTime, priceUnits, timeUnits } from "../lib/normalize-price-to-time";

// Price per unit time validator
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
        let regexResult: any;
        try {
          regexResult = value.match(regexp);
        } catch (e) {
          throw new Error("BAD_FORMAT");
        }

        if (!regexResult) {
          throw new Error("BAD_FORMAT");
        }

        const { groups: { priceValue, priceUnit, timeUnit } } = regexResult;

        // Current price unit must exist in valid price units list
        if (!Object.keys(priceUnits).includes(priceUnit)) {
          throw new Error("INVALID_PRICE_UNIT");
        }

        // Current time unit must exist in valid time units list
        if (!Object.keys(timeUnits).includes(timeUnit)) {
          throw new Error("INVALID_TIME_UNIT");
        }

        // Cast to parsed notation (send back the original value too)
        return { priceValue, priceUnit, timeUnit, value };
      },
    },
  ],
});

const Joi = BaseJoi.extend(priceToTime);

const errorResponse = {
  BAD_FORMAT: "Badly formatted message <value><priceUnit>/<timeUnit>",
  INVALID_PRICE_UNIT: "Price unit must be a valid ethereum unit",
  INVALID_TIME_UNIT: "Time unit must be either (second, minute, hour or day)",
}

export const rateConversion: ServerRoute = {
  method: "GET",
  path: "/eth-rate-convert",
  options: {
    validate: {
      query: {
        rate: Joi.string().priceToTime().required(),
      },
      failAction(request: any, h: any, err: any) {
        if (err.isJoi && Array.isArray(err.details) && err.details.length > 0) {
          return h.response({ error: "query parameter " + err.details[0].message }).code(400).takeover();
        } else {
          return h.response({ error: errorResponse[err.message] }).code(400).takeover();
        }
      },
    },
  },
  // Route handler
  handler(request: { query: { rate: IPriceToTime}}) {
    // Business function
    return normalizePriceToTime(request.query.rate);
  },
};
