.PHONY: deps env-nonprod dev start-docker-dev stop-docker-dev docker-build docker-up docker-down

deps:
	npm ci || npm install

env-nonprod:
	./scripts/server_scripts/handle_env.sh Non-Prod

dev: env-nonprod
	npm start

# Docker dev (mounted code) that runs Non-Prod inside the container
start-docker-dev: docker-up

docker-build:
	docker compose -f docker-compose.dev.yml build

docker-up: docker-build
	docker compose -f docker-compose.dev.yml up

docker-down:
	docker compose -f docker-compose.dev.yml down

stop-docker-dev: docker-down

