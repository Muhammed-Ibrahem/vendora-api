dev:
	docker compose -f compose.yml -f compose.development.yml up

production:
	docker compose -f compose.yml -f compose.production.yml up --build

down:
	docker compose down -v