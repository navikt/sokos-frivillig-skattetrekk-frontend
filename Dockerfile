FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:22
ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package.json .
COPY pnpm-lock.yaml .
COPY node_modules/ node_modules/
COPY server server/
COPY dist/ dist/

WORKDIR /usr/src/app/server

CMD ["app.js"]
