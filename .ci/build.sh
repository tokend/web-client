#!/bin/sh

set -ex

docker build --build-arg BUILD_VERSION=$CI_COMMIT_REF_NAME --pull -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
