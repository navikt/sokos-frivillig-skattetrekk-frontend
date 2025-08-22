import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";
import { http, HttpResponse } from "msw";

// Setup browser service worker using the given handlers
export const worker = setupWorker(
    ...handlers,

    // Mock NAV login session so the app believes we have a session
    http.get("https://login.ekstern.dev.nav.no/oauth2/session", () =>
        HttpResponse.json({ active: true })
    ),

    // Mock representasjon check used by the banner
    http.get(
        "https://representasjon-banner-frontend-borger-q2.ekstern.dev.nav.no/pensjon/selvbetjening/representasjon/api/representasjon/harRepresentasjonsforhold",
        () => HttpResponse.json(false, { status: 200 })
    ),

    // Mock Amplitude remote config so the SDK doesn’t error
    http.get("https://sr-client-cfg.amplitude.com/config", () =>
        HttpResponse.json({
            analyticsSDK: {
                batchEvents: true,
                serverZone: "US",
                ingestionEndpoint: "https://api2.amplitude.com/2/httpapi",
            },
        })
    )
);