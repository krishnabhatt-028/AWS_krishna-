#!/bin/bash
# usage: ./scripts/start-backend.sh   (run from project root)
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
nohup python app.py > flask.log 2>&1 &
echo "Flask started on :5000"
