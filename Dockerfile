FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim@sha256:82bb92c655692d00f682cd3d08ae09207cdf7b929cb8f47c128d59fbc1240e9f
ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY dist dist/
COPY server/build server/
COPY server/node_modules server/node_modules/

WORKDIR /usr/src/app/server

CMD ["server.js"]
