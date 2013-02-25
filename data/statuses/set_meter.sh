#!/bin/bash

if [[ "$1" = "" ]]
then
    echo "Please specify the name of a status meter as a cmd line arg"
    exit
fi

for (( ; ; ))
do
    for value in 0 1 2 3 5 6 6 6 8 9 9 7 3 3 3 3 2 7 1 1 1 3 4 7 8 8 8 6 3 3 3 2 2 2
    do
        curl -i -X POST \
            http://localhost:3000/status \
            -H "Accept: application/json" \
            -H "Content-Type: application/json" \
            -d '{"ns": "test", "name": "'$1'", "status": {"type": "meter", "value": '$value', "min": 0, "max": 10}}'
        sleep 1
    done
done