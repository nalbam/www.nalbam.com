#!/bin/bash

OS_NAME="$(uname | awk '{print tolower($0)}')"

RUN_PATH=$(dirname $0)

BUCKET="${CIRCLE_PROJECT_REPONAME}"

# aws s3 sync
aws s3 sync ${RUN_PATH}/src/main/webapp/ s3://${PUBLISH_PATH}/ --acl public-read

# aws cf reset
CFID=$(aws cloudfront list-distributions --query "DistributionList.Items[].{Id:Id,Origin:Origins.Items[0].DomainName}[?contains(Origin,'${BUCKET}')] | [0]" | grep 'Id' | cut -d'"' -f4)
if [ "${CFID}" != "" ]; then
    aws cloudfront create-invalidation --distribution-id ${CFID} --paths "/*"
fi
