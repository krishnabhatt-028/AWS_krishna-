#!/bin/bash
# usage: ./scripts/start-frontend.sh <BACKEND_URL>
# single EC2:   ./scripts/start-frontend.sh http://localhost:5000
# separate EC2: ./scripts/start-frontend.sh http://<BACKEND_IP>:5000
BACKEND_URL=${1:-http://localhost:5000}
cd frontend
npm install
BACKEND_URL=$BACKEND_URL nohup node app.js > express.log 2>&1 &
echo "Express started on :3000 -> $BACKEND_URL"
