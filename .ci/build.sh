#!/bin/sh

set -ex

docker build --pull -t $CI_REGISTRY_IMAGE:latest .
docker push $CI_REGISTRY_IMAGE:latest