#!/bin/bash

# 环境变量
DOCKER_REGISTRY=${DOCKER_REGISTRY:-"localhost:5000"}
IMAGE_NAME=${IMAGE_NAME:-"elijah-angular"}
IMAGE_TAG=$(node -e 'console.log(require("./package.json").version)')

if [ -z "$IMAGE_TAG" ]; then
  echo "Error: Could not read version from package.json"
  exit 1
fi

NETWORK_NAME="elijah-network"
PORT=${PORT:-"4000"}

# 创建网络
if ! docker network ls | grep -q "${NETWORK_NAME}"; then
    echo "Network ${NETWORK_NAME} does not exist. Creating..."
    docker network create "${NETWORK_NAME}"
else
    echo "Network ${NETWORK_NAME} already exists."
fi

# 运行 Docker 镜像
docker pull ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}
docker run -d -p ${PORT}:${PORT} --name ${IMAGE_NAME} --network ${NETWORK_NAME} ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}