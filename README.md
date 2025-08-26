# sokos-frivillig-skattetrekk-frontend

# Innholdsoversikt

* [1. Funksjonelle krav](#1-funksjonelle-krav)
* [2. Utviklingsmiljø](#2-utviklingsmiljø)
* [3. Programvarearkitektur](#3-programvarearkitektur)
* [4. Deployment](#4-deployment)
* [5. Autentisering](#5-autentisering)
* [6. Drift og støtte](#6-drift-og-støtte)
* [7. Henvendelser](#7-henvendelser)

---

# 1. Funksjonelle Krav

Webapplikasjon på nav.no for å administrere frivillig skattetrekk på et utvalg pengestøtter fra NAV.

# 2. Utviklingsmiljø

### Forutsetninger

* [Node.js](https://nodejs.org/en)
* [pnpm](https://pnpm.io/)

### Bygge prosjekt

* Development: `pnpm run build:development` -> For å laste inn [.env.development](.env.development)
* Production: `pnpm run build:production` -> For å laste inn [.env.production](.env.production)

### Lokal utvikling

* Mot mock: `pnpm run dev`
* Mot backend lokalt: `pnpm run dev:backend`

# 3. Programvarearkitektur

[Dokumentasjon](/dokumentasjon/)

# 4. Deployment

Distribusjon av tjenesten er gjort med bruk av Github Actions.
[sokos-frivillig-skattetrekk-frontend CI / CD](https://github.com/navikt/sokos-frivillig-skattetrekk-frontend/actions)

Push/merge til main branche vil teste, bygge og deploye til produksjonsmiljø og testmiljø.

# 7. Autentisering

Applikasjonen bruker [ID-porten](https://docs.nais.io/auth/idporten/) for autentisering til borgere og [TokenX](https://docs.nais.io/auth/tokenx/) for å kunne kalle [sokos-frivillig-skattetrekk-backend](https://github.com/navikt/sokos-frivillig-skattetrekk-backend)

# 6. Drift og støtte

### Logging

Feilmeldinger og infomeldinger som ikke innheholder sensitive data logges til [Grafana Loki](https://docs.nais.io/observability/logging/#grafana-loki).
Sensitive meldinger logges til [Team Logs](https://doc.nais.io/observability/logging/how-to/team-logs/).

### Kubectl

For dev-gcp:

```shell script
kubectl config use-context dev-gcp
kubectl get pods -n okonomi | grep sokos-frivillig-skattetrekk-frontend
kubectl logs -f sokos-frivillig-skattetrekk-frontend-<POD-ID> --namespace okonomi -c sokos-frivillig-skattetrekk-frontend
```

For prod-gcp:

```shell script
kubectl config use-context prod-gcp
kubectl get pods -n okonomi | grep sokos-frivillig-skattetrekk-frontend
kubectl logs -f sokos-frivillig-skattetrekk-frontend-<POD-ID> --namespace okonomi -c sokos-frivillig-skattetrekk-frontend
```

### Alarmer

Applikasjonen bruker [Grafana Alerting](https://grafana.nav.cloud.nais.io/alerting/) for overvåkning og varsling.

Alarmene overvåker metrics som:

- HTTP-feilrater
- JVM-metrikker

Varsler blir sendt til følgende Slack-kanaler:

- Dev-miljø: [#team-mob-alerts-dev](https://nav-it.slack.com/archives/C042SF2FEQM)
- Prod-miljø: [#team-mob-alerts-prod](https://nav-it.slack.com/archives/C042ESY71GX)

### Grafana

- [appavn](url)

---

# 7. Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på Github.
Interne henvendelser kan sendes via Slack i kanalen [#utbetaling](https://nav-it.slack.com/archives/CKZADNFBP)
