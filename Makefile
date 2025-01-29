NAME = transcendance
PATH_DOCKER_COMPOSE = docker-compose.yml

all: down build run

run:
	docker compose -f ${PATH_DOCKER_COMPOSE} -p ${NAME} up

down:
	docker compose -f ${PATH_DOCKER_COMPOSE} -p ${NAME} down

build:
	docker compose -f ${PATH_DOCKER_COMPOSE} -p ${NAME} build

clean: down
	docker system prune -a

fclean: down
	docker system prune -a --volumes

clean-images:
	docker stop $$(docker ps -aq) || true
	docker rm $$(docker ps -aq) || true
	docker rmi $$(docker images -q) || true

clean-volumes:
	docker stop $$(docker ps -aq) || true
	docker rm $$(docker ps -aq) || true
	docker volume rm $$(docker volume ls -q) || true

clean-docker: clean-images clean-volumes
	docker network prune -f
	docker system prune -a --volumes -f

update-ip:
	@echo "Mise à jour de l'adresse IP dans le fichier .env..."
	@bash update_ip_env.sh