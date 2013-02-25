#!/bin/bash

curl -i -X POST \
    http://localhost:3000/status \
    -H "Accept: application/json" \
    -H "Content-Type: application/json" \
    -d '{"ns": "test", "name": "client1", "status": {"type": "stoplight", "color": "red"}}'