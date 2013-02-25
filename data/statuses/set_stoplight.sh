#!/bin/bash

if [[ "$1" = "" ]]
then
    echo "Please specify the name of a status meter as a cmd line arg"
    exit
fi

for (( ; ; ))
do
    for value in green green green yellow red red red yellow yellow
    do
        curl -i -X POST \
            http://localhost:3000/status \
            -H "Accept: application/json" \
            -H "Content-Type: application/json" \
            -d '{"ns": "test", "name": "'$1'", "status": {"type": "stoplight", "color": "'$value'"}}'
        sleep 1
    done
done