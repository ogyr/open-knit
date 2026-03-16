#!/usr/bin/env bash
docker compose up -d --build
docker compose logs -f backend-app frontend-app