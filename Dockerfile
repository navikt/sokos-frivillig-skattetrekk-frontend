FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim@sha256:0f202869b59d908e508aa562e2fcb210229df9171233d1a38329170a7386c598
ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY dist dist/
COPY server/build server/
COPY server/node_modules server/node_modules/

WORKDIR /usr/src/app/server

CMD ["server.js"]
