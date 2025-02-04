# https://hub.docker.com/r/denoland/deno
FROM denoland/deno:alpine

EXPOSE 1210

WORKDIR /app
USER deno
COPY deno.json .
RUN deno install
COPY server.js .

# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache server.js


# TODO:
# - healthcheck
# - allow for port changes
# - consider adding SQLite
# - take reddit user, client id, client secret as env vars

CMD ["run", "--allow-net", "server.js"]


# https://lemmy.ml/feeds/c/memes.xml?sort=TopMonth
