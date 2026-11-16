FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim@sha256:201f7e52e67178d18aaa84041b7566966dea675c6092066adccb48870ba5e2c0
ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY dist dist/
COPY server/build server/
COPY server/node_modules server/node_modules/

WORKDIR /usr/src/app/server

CMD ["server.js"]
