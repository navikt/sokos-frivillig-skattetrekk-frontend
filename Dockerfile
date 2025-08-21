FROM gcr.io/distroless/nodejs22-debian12
ENV NODE_ENV=production

WORKDIR /usr/src/app
USER nonroot

COPY package.json .
COPY pnpm-lock.yaml .
COPY node_modules/ node_modules/
COPY server server/
COPY dist/ dist/

ENTRYPOINT ["/nodejs/bin/node", "./server/app.js"]
