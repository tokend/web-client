#!/bin/sh

docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
docker build --pull -t $CI_REGISTRY_IMAGE:latest .
docker push $CI_REGISTRY_IMAGE:latest