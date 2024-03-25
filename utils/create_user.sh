#!/bin/bash

if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <username> <name> <password>"
    exit 1
fi

username="$1"
name="$2"
password="$3"

curl -X POST \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$username\",\"name\":\"$name\",\"password\":\"$password\"}" \
  http://localhost:3001/api/users

echo "User created successfully."

