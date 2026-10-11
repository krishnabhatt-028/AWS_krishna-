#!/bin/bash
# usage: ./scripts/push-to-ecr.sh <ACCOUNT_ID> <REGION>
ACCOUNT=$1; REGION=$2
REG=$ACCOUNT.dkr.ecr.$REGION.amazonaws.com
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $REG
for svc in flask-backend:backend express-frontend:frontend; do
  NAME=${svc%%:*}; DIR=${svc##*:}
  aws ecr describe-repositories --repository-names $NAME --region $REGION >/dev/null 2>&1 || \
    aws ecr create-repository --repository-name $NAME --region $REGION
  docker build -t $NAME ./$DIR
  docker tag $NAME:latest $REG/$NAME:latest
  docker push $REG/$NAME:latest
done
