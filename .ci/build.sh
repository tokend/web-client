#!/bin/sh

set -ex

version=$(test -z $CI_COMMIT_TAG && echo $CI_COMMIT_SHORT_SHA || echo $CI_COMMIT_TAG \($CI_COMMIT_SHORT_SHA\))

docker build --build-arg BUILD_VERSION="$version" --pull -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
