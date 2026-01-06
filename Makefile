ARGS ?=

dev: down
	docker compose -f compose.yml -f compose.development.yml up ${ARGS}

production: down
	docker compose -f compose.yml -f compose.production.yml up --build

down:
	docker compose down -v

ENV ?=

ifeq ($(ENV),prod)
    ENVIRONMENT := production
else ifeq ($(ENV),dev)
    ENVIRONMENT := development
endif

migrate:
	docker compose -f compose.yml -f compose.${ENVIRONMENT}.yml run --rm migration pnpm migrate:${ENV} ${ARGS}

SERVICE ?=
SHELL 	:= sh
attach: 
	docker compose exec -it ${SERVICE} ${SHELL}