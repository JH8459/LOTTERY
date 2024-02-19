#!/bin/sh
echo "=> Docker Compose Down..."
docker compose down
sleep 2s
echo "=> Docker System Prune..."
docker system prune -f
sleep 2s
echo "=> Docker Volume Prune..."
docker volume prune -f
sleep 2s
echo "=> Docker Network Prune..."
docker network prune -f
sleep 2s
echo "=> Docker Image RM..."
docker image rm jh8459/lottery_api_server
docker image rm jh8459/lottery_crawler_server
sleep 2s
echo "=> Docker Compose Pull..."
docker compose pull
sleep 2s
echo "=> Docker Compose Up..."
docker compose up -d
