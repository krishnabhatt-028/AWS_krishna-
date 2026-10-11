# AWS_krishna-
AWS Deployment DevOps Assignment demonstrating the deployment of a Flask backend and Express.js frontend using AWS EC2, Docker, Amazon ECR, Amazon ECS (Fargate), and VPC networking. Includes deployment scripts, Dockerfiles, configuration files, and documentation with screenshots and step-by-step instructions.
# AWS Deployment – Flask Backend + Express Frontend

DevOps assignment: deploy a Flask backend and an Express frontend on AWS in three ways.

| Task | Setup |
|------|-------|
| 1 | Both apps on a **single EC2** instance |
| 2 | Apps on **separate EC2** instances (frontend EC2 + backend EC2) |
| 3 | **Docker** containers using **ECR, ECS (Fargate) and VPC** |



## Project Structure
```
AWS_YourName/
├── backend/              Flask API (port 5000)
│   ├── app.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/             Express app (port 3000)
│   ├── app.js
│   ├── package.json
│   └── Dockerfile
├── ecs/task-definition.json   Fargate task (both containers)
├── scripts/                   EC2 + ECR helper scripts
├── docker-compose.yml         Local run
├── AWS_Documentation.docx     Steps, commands, screenshots, explanations

```

## How It Works
The Express frontend shows a form. On submit it sends the data to the Flask backend
(`POST /submit`) at the address in the `BACKEND_URL` environment variable and displays
a success or error page.

| Endpoint (Flask) | Purpose |
|------------------|---------|
| `GET /api` | Health/info JSON |
| `POST /submit` | Save a name + message |
| `GET /submissions` | List saved entries |

## Run Locally
```bash
# Backend
cd backend && pip install -r requirements.txt && python app.py

# Frontend (new terminal)
cd frontend && npm install && BACKEND_URL=http://localhost:5000 node app.js
```
Or with Docker: `docker compose up --build` → http://localhost:3000

## Task 1 – Single EC2
1. Launch Ubuntu 22.04 t2.micro; open ports 22, 3000, 5000.
2. SSH in, clone the repo, run `bash scripts/install-prereqs.sh`.
3. `bash scripts/start-backend.sh`
4. `bash scripts/start-frontend.sh http://localhost:5000`
5. Open `http://<EC2_PUBLIC_IP>:3000`.

## Task 2 – Separate EC2 Instances
1. Launch `backend-ec2` and `frontend-ec2`; backend allows 5000 from the frontend, frontend allows 3000.
2. Backend instance: install prerequisites, `bash scripts/start-backend.sh`.
3. Frontend instance: install prerequisites, `bash scripts/start-frontend.sh http://<BACKEND_IP>:5000`.
4. Open `http://<FRONTEND_PUBLIC_IP>:3000`.

## Task 3 – Docker + ECR + ECS + VPC
1. Create ECR repos `flask-backend` and `express-frontend`.
2. `aws configure`, then `bash scripts/push-to-ecr.sh <ACCOUNT_ID> <REGION>`.
3. Use the default VPC; create a security group allowing TCP 3000.
4. Create an ECS Fargate cluster, register `ecs/task-definition.json`
   (replace `<ACCOUNT_ID>` and `<REGION>`), and create a service with a public IP.
5. Open `http://<ECS_TASK_PUBLIC_IP>:3000`.

## Cost Note
Stop EC2 instances and set the ECS service desired count to 0 when not in use.

## Tech Stack
Python 3 / Flask · Node.js 20 / Express · Docker · AWS EC2, ECR, ECS (Fargate), VPC
