#!/bin/bash

if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <content> <important> <jwt>"
    exit 1
fi

content="$1"
important="$2"
jwt="$3"

curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $jwt" \
  -d "{\"content\":\"$content\",\"important\":$important}" \
  http://localhost:3001/api/notes -v

echo "Note created successfully."

