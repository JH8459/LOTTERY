#!/bin/sh
echo "=> Docker Compose build..."
docker compose build
sleep 2s
echo "=> Docker Compose Push..."
docker compose push