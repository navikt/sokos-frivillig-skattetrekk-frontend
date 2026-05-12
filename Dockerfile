ARG NODE_IMAGE=europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim@sha256:bc1379ce260f5ad69692787eaf0d025dbd034ac9acb1f64d1538d7f8986828f0

FROM ${NODE_IMAGE} AS deps
WORKDIR /usr/src/app/server

# Install prod-only deps so devDependencies (tsx -> esbuild, typescript) are excluded from the runtime image.
# Some packages still pull esbuild as a transitive prod dep, so we strip it explicitly to clear CVE scans.
COPY server/package.json server/pnpm-lock.yaml ./
RUN corepack enable \
    && pnpm install --prod --frozen-lockfile --ignore-scripts \
    && rm -rf node_modules/.pnpm/@esbuild* node_modules/.pnpm/esbuild@*

FROM ${NODE_IMAGE}
ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY dist dist/
COPY server/build server/
COPY --from=deps /usr/src/app/server/node_modules server/node_modules/

WORKDIR /usr/src/app/server

CMD ["server.js"]
