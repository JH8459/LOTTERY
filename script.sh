#!/bin/sh
echo "=> Docker Compose Build..."
docker compose build
sleep 2s
echo "=> Docker Compose Up..."
docker compose up -d