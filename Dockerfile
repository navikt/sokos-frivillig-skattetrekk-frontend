FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim@sha256:180a66d1c00e29058241bee04e42a27fc14e77c30be9ee68ace195f384ce6f0a
ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY dist dist/
COPY server/build server/
COPY server/node_modules server/node_modules/

WORKDIR /usr/src/app/server

CMD ["server.js"]
