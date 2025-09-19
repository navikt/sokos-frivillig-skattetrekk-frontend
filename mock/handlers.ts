/* eslint-disable no-console */
import { HttpResponse, http } from "msw";
import skattetrekkInitResponse from "./skattetrekkInitResponse.json";

export const handlers = [

  http.get("/utbetalinger/frivillig-skattetrekk/api/skattetrekk", () => {
    return HttpResponse.json(skattetrekkInitResponse, { status: 200 });
  }),

  http.post("/utbetalinger/frivillig-skattetrekk/api/skattetrekk", async () => {
    return new HttpResponse(null, { status: 200 });
  }),
];