#!/bin/bash
# Run on any Ubuntu 22.04 EC2 instance
sudo apt update -y
sudo apt install -y python3-pip python3-venv git curl
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
python3 --version && node --version && npm --version
