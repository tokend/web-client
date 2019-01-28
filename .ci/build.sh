#!/bin/sh

set -ex

docker build --pull -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
