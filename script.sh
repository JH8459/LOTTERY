#!/bin/sh
echo "=> Docker Compose Down..."
docker compose down
sleep 2s
echo "=> Docker System Prune..."
docker system prune -f
sleep 2s
echo "=> Docker Network Prune..."
docker network prune -f
sleep 2s
echo "=> Docker Compose Build..."
docker compose build
sleep 2s
echo "=> Docker Compose Up..."
docker compose up -d
echo "=> Docker Volume Prune..."
docker volume prune -f
sleep 2s