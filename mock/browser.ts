import { http, HttpResponse } from "msw";
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// Setup browser service worker using the given handlers
export const worker = setupWorker(
    ...handlers,

    http.get("https://login.ekstern.dev.nav.no/oauth2/session", () =>
        HttpResponse.json()
    ),

    http.get(
        "https://representasjon-banner-frontend-borger-q2.ekstern.dev.nav.no/pensjon/selvbetjening/representasjon/api/representasjon/harRepresentasjonsforhold",
        () => HttpResponse.json(false, { status: 200 })
    ),

    http.get("https://sr-client-cfg.amplitude.com/config", () =>
        HttpResponse.json('', { status: 200 })
    )
);