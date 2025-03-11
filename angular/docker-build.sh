#!/bin/bash

# 环境变量
DOCKERFILE=${DOCKERFILE:-"Dockerfile"}
DOCKER_REGISTRY=${DOCKER_REGISTRY:-"localhost:5000"}
IMAGE_NAME=${IMAGE_NAME:-"elijah-angular"}
IMAGE_TAG=$(jq -r '.version' package.json)

if [ -z "$IMAGE_TAG" ]; then
  echo "Error: Could not read version from package.json"
  exit 1
fi

# 构建 Docker 镜像
docker build -t ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} -f ${DOCKERFILE} . --progress=plain

# 推送 Docker 镜像到本地 Docker Registry
docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}
