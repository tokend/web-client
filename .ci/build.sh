#!/bin/sh

set -ex

if [ -z "$CI_COMMIT_TAG" ]
then
  docker build --build-arg BUILD_VERSION=$CI_COMMIT_TAG --pull -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
else
  docker build --build-arg BUILD_VERSION=$CI_COMMIT_REF_NAME --pull -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
fi

docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
