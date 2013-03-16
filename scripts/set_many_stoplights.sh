#!/bin/bash

if [[ "$1" = "" ]]
then
    echo "Please specify a number of meters as a cmd line arg"
    exit
fi

for (( ; ; ))
do
    for value in green green green yellow red red red yellow yellow
    do
        for ((n = 1 ; n <= $1 ; n++))
        do
            curl -i -X POST \
                http://localhost:3000/status \
                -H "Accept: application/json" \
                -H "Content-Type: application/json" \
                -d '{"ns": "test", "name": "meter'$n'", "status": {"type": "stoplight", "color": "'$value'", "label": "'$value'"}}'
        done
        sleep 1
    done
done