#!/bin/sh
set -e

echo "Optimizing images..."
npm run optimize

echo "Starting server..."
exec npm run start
