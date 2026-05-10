# WanderNest Node.js Backend

Simple Node.js + Express backend connected to AWS DynamoDB.

## What this backend does

- `GET /api/health` checks whether the server is running
- `POST /api/users/register` creates a user in DynamoDB
- `POST /api/users/login` validates a user from DynamoDB
- `GET /api/users` lists saved users without password hashes

## DynamoDB table

Create one DynamoDB table with:

- Table name: `wandernest_users`
- Partition key: `email` (String)

This project stores items like:

```json
{
  "email": "user@example.com",
  "name": "Amara Patel",
  "role": "user",
  "passwordHash": "bcrypt-hash",
  "joinedAt": "2026-05-10T10:00:00.000Z",
  "isActive": true
}
```

## Local setup

1. Install Node.js 18 or newer.
2. In the project root, copy `.env.example` to `.env`.
3. Run `npm install`.
4. Run `npm start`.

Example `.env`:

```env
PORT=4000
AWS_REGION=ap-south-1
DYNAMODB_TABLE_NAME=wandernest_users
CORS_ORIGIN=*
```

If you run locally, configure AWS credentials with one of these:

- `aws configure`
- environment variables like `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
- AWS SSO if you already use it

## Ubuntu EC2 deployment

Use an IAM role on the EC2 instance instead of hardcoding AWS keys.

### 1. Launch EC2

- Ubuntu 22.04 or 24.04
- Open inbound port `4000` for testing, or use `80/443` behind Nginx

### 2. Attach IAM role

Attach a role with DynamoDB permissions for your table, for example:

- `dynamodb:GetItem`
- `dynamodb:PutItem`
- `dynamodb:Scan`

Scope it to the specific table ARN when possible.

### 3. Install runtime

```bash
sudo apt update
sudo apt install -y nodejs npm
node -v
npm -v
```

### 4. Upload project and install dependencies

```bash
cd /home/ubuntu
git clone <your-repo-url>
cd Wandernest
npm install
cp .env.example .env
```

Edit `.env` with your AWS region and DynamoDB table name.

### 5. Start the backend

```bash
npm start
```

For production, run it with `pm2`:

```bash
sudo npm install -g pm2
pm2 start src/server.js --name wandernest-backend
pm2 save
pm2 startup
```

### 6. Optional Nginx reverse proxy

If you want requests on port `80`:

```nginx
server {
    listen 80;
    server_name your-domain-or-ec2-public-ip;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Example requests

Register:

```bash
curl -X POST http://localhost:4000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Amara","lastName":"Patel","email":"user@example.com","password":"pass123"}'
```

Login:

```bash
curl -X POST http://localhost:4000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'
```
