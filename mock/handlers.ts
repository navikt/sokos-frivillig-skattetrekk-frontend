/* eslint-disable no-console */
import { HttpResponse, http } from "msw";
import skattetrekkInitResponse from "./skattetrekkInitResponse.json";

export const handlers = [

  http.get("/utbetaling/skattetrekk/api/skattetrekk", () => {
    console.log("Kjører initiate");
    return HttpResponse.json(skattetrekkInitResponse, { status: 200 });
  }),

  http.post("/utbetaling/skattetrekk/api/skattetrekk", async () => {
    console.log("Kjører send");
    return new HttpResponse(null, { status: 200 });
  }),
];