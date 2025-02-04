build:
  docker build -t lemmy-top-rss .

# --env-file ./.env \
run: build
  docker run \
  -p 8000:8000 \
  --rm \
  lemmy-top-rss
