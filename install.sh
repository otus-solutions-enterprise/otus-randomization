#!/bin/bash
DARKGRAY='\033[1;30m'
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

cp ./mongodb/config/initdb.js ./mongodb/persistence/initdb.js
cp ./mongodb/config/mongo.conf ./mongodb/persistence/mongo.conf

printf "\n * * * MONGODB * * * \n"
printf "PASSWORD Mongo Admin(default = ${YELLOW}XRYs9yjU${NC}): "
read passAdmin
if [[ -z ${passAdmin} ]]; then
    passAdmin='XRYs9yjU'
fi

sed -i "s/XRYs9yjU/$passAdmin/g" ./mongodb/persistence/initdb.js