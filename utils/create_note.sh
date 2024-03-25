#!/bin/bash

if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <content> <important> <userId>"
    exit 1
fi

content="$1"
important="$2"
userId="$3"

curl -X POST \
  -H "Content-Type: application/json" \
  -d "{\"content\":\"$content\",\"important\":$important,\"userId\":\"$userId\"}" \
  http://localhost:3001/api/notes

echo "Note created successfully."

