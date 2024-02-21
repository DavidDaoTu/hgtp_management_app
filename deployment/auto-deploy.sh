#! /bin/sh

VERSION=v1.0.1
REGISTRY=davidfullstack

# prune & pull release versions
echo "pulling release versions..."
yes | docker image prune --all
docker pull ${REGISTRY}/hgtp_frontend_img:${VERSION}
docker pull ${REGISTRY}/hgtp_backend_img:${VERSION}
docker pull ${REGISTRY}/hgtp_reverse_proxy_img:${VERSION}

## Re-applying YAML files
echo "Applying YAML files.."
kubectl apply -f .

## update images for k8s
echo "Rolling out images..."
kubectl rollout restart deployment hgtp-frontend hgtp-backend reverse-proxy



