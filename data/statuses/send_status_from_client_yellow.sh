#!/bin/bash

curl -i -X POST \
    http://localhost:3000/status \
    -H "Accept: application/json" \
    -H "Content-Type: application/json" \
    -d '{"ns": "test", "name": "client2003", "status": {"type": "stoplight", "color": "yellow"}}'