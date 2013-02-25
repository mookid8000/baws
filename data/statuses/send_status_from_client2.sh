#!/bin/bash

curl -i -X POST \
    http://localhost:3000/status \
    -H "Accept: application/json" \
    -H "Content-Type: application/json" \
    -d '{"ns": "test", "name": "bim8", "status": {"type": "meter", "value": 5, "min": 0, "max": 10}}'