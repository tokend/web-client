#!/bin/sh

set -eux

RELEASE=$CI_COMMIT_REF_NAME                                                                                                                                                                                        
docker pull $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
docker tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA $DH_IMAGE:$RELEASE
docker push $DH_IMAGE:$RELEASE