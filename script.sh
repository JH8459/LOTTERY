#!/bin/sh
echo "=> Docker Compose Build..."
sudo docker compose build
sleep 2s
echo "=> Docker Compose Up..."
sudo docker compose up -d