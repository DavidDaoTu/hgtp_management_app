###References:
#1. https://github.com/kubernetes/examples/blob/master/cassandra/Makefile
#2. https://github.com/kubernetes/examples/blob/master/guestbook-go/Makefile
#3. https://github.com/kubernetes/examples/blob/master/staging/explorer/Makefile
#4. https://github.com/kubernetes/examples/blob/master/guestbook/php-redis/Makefile
#5. https://github.com/kubernetes/examples/blob/master/staging/https-nginx/Makefile
#####

#### Build Docker images for local development & release phases

# Usage:
#   $ make build_dev 	#Build local_img for development test
#   $ make deploy		#Restart & deploy K8S YAML files on local machine
#	$ make update		#Update & restart Pods images
#   $ make release [VERSION=6] [REGISTRY="davidfullstack"]	#Build & Push for release
####

VERSION?=v1.0.1
DOCKERHUB?=davidfullstack

## Get current branch & commit ID to save to .env file for each release traces
current_branch:=`git branch --show-current`
commit_id:=`git rev-parse HEAD`

# Local build for development
build_dev: clean local_env build
# Build for release then push to DockerHub registry
release: clean release_env build push
# Restart & deploy K8S YAML files
deploy: reset_k8s restart_k8s build_dev deployment_k8s
# Update Docker images for K8S Deployments
update: build_dev update_docker_imgs

# Add Docker compose environment variables into .env file for local development
local_env:
	@echo "### LOCAL DEVELOPMENT ###" > .env
	@echo "VERSION=${VERSION}\r\nREGISTRY=local" >> .env 
	@echo "Building local Docker images for local development: image version '$(VERSION)'..."

# Add Docker compose environment variables into .env file for release
release_env:
	@echo "### RELEASE ###" > .env
	@echo "VERSION=${VERSION}\r\nREGISTRY=${DOCKERHUB}" >> .env 
	@echo "Building Docker images for release: image version '$(VERSION)' with remote '$(DOCKERHUB)'..."

# Common Docker compose build for local build_dev & release
build:
	@echo "-----------" >> .env
	@echo "#Current Branch: ${current_branch}\r\n#Current Commit ID: ${commit_id}" >> .env
	@echo "#Build at time: $(shell date +'%Y-%m-%d %H:%M:%S')" >> .env
	docker compose -f docker-compose-build.yaml build --parallel

# push the image to an registry
push:
	docker compose -f docker-compose-build.yaml push

# remove previous images and containers
clean:
	@echo "Removing unused Docker images..."
	yes | docker image prune --all

# reset & restart k8s cluster
reset_k8s:
	@echo "Resetting K8S Cluster..."
	/bin/bash ./deployment/setup/k8s/reset_cluster.sh

restart_k8s:	
	@echo "Restarting K8S Cluster..."
	/bin/bash ./deployment/setup/k8s/init_master.sh

# Deployment
deployment_k8s:
	@echo "Deploying the application with YAML files..."
	kubectl apply -f ./deployment/

# Rollout new docker images
update_docker_imgs:
	@echo "Rollout new Docker images"
	kubectl rollout restart deployment hgtp-frontend hgtp-backend reverse-proxy

.PHONY: release clean build_local build_rel push

