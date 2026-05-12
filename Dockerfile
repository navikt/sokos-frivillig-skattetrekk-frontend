FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-dev@sha256:d8bc2c65585f59d29b457cac2bb8aab2e81a6987bbdbbccbbf07be34709a4fcf AS builder
WORKDIR /app

# Install prod-only deps so devDependencies (tsx -> esbuild, typescript) are excluded from the runtime image.
# Some packages still pull esbuild as a transitive prod dep, so we strip it explicitly to clear CVE scans.
COPY --chown=65532:65532 server/package.json server/pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile --ignore-scripts \
    && rm -rf node_modules/.pnpm/@esbuild* node_modules/.pnpm/esbuild@*

FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim@sha256:bc1379ce260f5ad69692787eaf0d025dbd034ac9acb1f64d1538d7f8986828f0
ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY dist dist/
COPY server/build server/
COPY --from=builder /app/node_modules server/node_modules/

WORKDIR /usr/src/app/server

CMD ["server.js"]
