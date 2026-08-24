######
FROM node:22-alpine@sha256:c610fcdfb1d5b4740dd70c284ed3cb16bb857e0f7166196e36a5501df7a3aa32 AS builder
ENV ROOT=/code
ENV DISABLE_NEW_JSX_TRANSFORM=true
ENV PUBLIC_URL=/URL_PREFIX_PLACEHOLDER
WORKDIR $ROOT
COPY ui $ROOT
RUN npm install && \
    npm install --no-save react-scripts@5.0.1 && \
    npm run build

######
FROM node:22-alpine@sha256:c610fcdfb1d5b4740dd70c284ed3cb16bb857e0f7166196e36a5501df7a3aa32
ARG BUILD_DATE
ARG VERSION
ARG VCS_REF
LABEL org.label-schema.build-date=${BUILD_DATE} \
    org.label-schema.docker.dockerfile="docker/Dockerfile" \
    org.label-schema.license="MIT" \
    org.label-schema.name="Allure Docker Service UI" \
    org.label-schema.version=${VERSION} \
    org.label-schema.description="UI Layer for Allure Docker Service container" \
    org.label-schema.vcs-ref=${VCS_REF} \
    org.label-schema.vcs-type="Git" \
    org.label-schema.vcs-url="https://github.com/fescobar/allure-docker-service-ui" \
    authors="Frank Escobar <fescobar.systems@gmail.com>"

RUN apk update && \
    apk upgrade && \
    apk add --no-cache bash curl

ENV ROOT=/app

WORKDIR $ROOT
COPY --chown=node:node --from=builder /code/build $ROOT/ui-template
COPY --chown=node:node --from=builder /code/build $ROOT/ui
COPY --chown=node:node server $ROOT/ui
COPY --chown=node:node scripts $ROOT
COPY --chown=node:node ui/generate_env_file.sh $ROOT

RUN echo "${VERSION}" > $ROOT/ui/ui_version && \
    echo "${VERSION}" > $ROOT/ui-template/ui_version && \
    echo "ALLURE_DOCKER_SERVICE_UI_VERSION:" $(cat $ROOT/ui/ui_version) && \
    chmod +x $ROOT/*.sh && \
    npm install --prefix $ROOT/ui --omit=dev && \
    rm -rf /root/.npm /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx /usr/local/lib/node_modules/corepack /usr/local/bin/corepack /opt/yarn*

RUN chown -R node:node $ROOT

ENV PORT=5252
EXPOSE $PORT

HEALTHCHECK --interval=10s --timeout=60s --retries=3 \
      CMD curl -f http://localhost:$PORT || exit 1

USER node

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["/app/run.sh"]
