# Amala Backend API

Node.js/Express backend API server for the Amala video sharing platform. Provides REST API endpoints for user profile management using DynamoDB.

## Features

- RESTful API for user profile management
- AWS Cognito JWT authentication
- DynamoDB single-table design
- TypeScript for type safety
- Express.js web framework

## Prerequisites

- Node.js >= 20.0.0
- pnpm >= 8.0.0 (or npm/yarn)
- AWS Account with:
  - DynamoDB table created
  - Cognito User Pool configured
  - AWS credentials configured

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=3001
NODE_ENV=development

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key

DYNAMODB_TABLE_NAME=amala-data

COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
```

### 3. Create DynamoDB Table

See [DYNAMODB_DESIGN.md](./DYNAMODB_DESIGN.md) for table structure details.

**Using AWS CLI:**

```bash
aws dynamodb create-table \
  --table-name amala-data \
  --attribute-definitions \
    AttributeName=PK,AttributeType=S \
    AttributeName=SK,AttributeType=S \
  --key-schema \
    AttributeName=PK,KeyType=HASH \
    AttributeName=SK,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

**Using AWS Console:**

1. Navigate to DynamoDB in AWS Console
2. Click "Create table"
3. Table name: `amala-data`
4. Partition key: `PK` (String)
5. Sort key: `SK` (String)
6. Settings: Use default settings
7. Billing mode: On-demand (Pay per request)
8. Click "Create table"

### 4. Run Development Server

```bash
pnpm dev
```

The server will start on `http://localhost:3001` (or the port specified in `.env`).

### 5. Build for Production

```bash
pnpm build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### 6. Run Production Server

```bash
pnpm start
```

## API Endpoints

### Health Check

- **GET** `/health`
  - Returns server status
  - No authentication required

### Profile Endpoints

All profile endpoints require authentication via Bearer token in the `Authorization` header.

- **GET** `/api/profile/:userId`
  - Get user profile by userId (Cognito sub)
  - Returns: Profile object

- **POST** `/api/profile`
  - Create user profile
  - Body: `{ username: string, displayname: string, description?: string }`
  - Uses userId from JWT token
  - Returns: Created profile object

- **PUT** `/api/profile/:userId`
  - Update user profile
  - Body: `{ username?: string, displayname?: string, description?: string }`
  - userId in URL must match userId in JWT token
  - Returns: Updated profile object

### Authentication

All profile endpoints require a valid Cognito JWT token:

```
Authorization: Bearer <jwt-token>
```

The token is validated against your Cognito User Pool. The `sub` claim from the token is used as the userId.

## Deployment to EC2

### Prerequisites

1. EC2 instance running Ubuntu 22.04 LTS (or similar Linux distribution)
2. SSH access to the EC2 instance
3. AWS credentials configured (IAM role recommended for EC2)
4. Security group configured to allow incoming traffic on your chosen port

### Step 1: Connect to EC2 Instance

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### Step 2: Install Node.js and pnpm

```bash
# Install Node.js 20.x using NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js installation
node --version  # Should be >= 20.0.0

# Install pnpm globally
sudo npm install -g pnpm

# Verify pnpm installation
pnpm --version  # Should be >= 8.0.0
```

### Step 3: Install PM2 Process Manager

```bash
sudo npm install -g pm2
```

PM2 will keep your application running and restart it if it crashes.

### Step 4: Clone Repository

```bash
# Create application directory
sudo mkdir -p /opt/amala
sudo chown $USER:$USER /opt/amala
cd /opt/amala

# Clone your repository (replace with your repo URL)
git clone https://github.com/your-username/amala.git .

# Or upload files using SCP from your local machine
# scp -r -i your-key.pem ./apps/backend ubuntu@your-ec2-ip:/opt/amala/backend
```

### Step 5: Install Dependencies and Build

```bash
cd /opt/amala/apps/backend

# Install dependencies
pnpm install --frozen-lockfile

# Build the application
pnpm build
```

### Step 6: Configure Environment Variables

```bash
# Create .env file
nano .env
```

Add your environment variables:

```env
PORT=3001
NODE_ENV=production

AWS_REGION=us-east-1
# For EC2, it's recommended to use IAM roles instead of access keys
# If using IAM role, comment out the following lines:
# AWS_ACCESS_KEY_ID=your-access-key-id
# AWS_SECRET_ACCESS_KEY=your-secret-access-key

DYNAMODB_TABLE_NAME=amala-data

COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
```

Save and exit (Ctrl+X, then Y, then Enter).

### Step 7: Configure AWS Credentials (Optional - Recommended: Use IAM Role)

**Option A: Use IAM Role (Recommended)**

1. Create an IAM role with DynamoDB permissions
2. Attach the role to your EC2 instance
3. No need to set AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY

**Option B: Use Access Keys**

```bash
# Configure AWS CLI (if using access keys)
aws configure
```

Or set environment variables in `.env` file (less secure).

### Step 8: Start Application with PM2

```bash
cd /opt/amala/apps/backend

# Start the application
pm2 start dist/index.js --name amala-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Follow the instructions provided by the command
```

### Step 9: Configure Firewall (UFW)

```bash
# Allow SSH (if not already allowed)
sudo ufw allow 22/tcp

# Allow your application port (replace 3001 with your PORT)
sudo ufw allow 3001/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### Step 10: Configure Security Group

In AWS EC2 Console:

1. Select your EC2 instance
2. Go to Security tab
3. Click on the security group
4. Edit inbound rules
5. Add rule:
   - Type: Custom TCP
   - Port: 3001 (or your PORT)
   - Source: 0.0.0.0/0 (or restrict to specific IPs)
   - Description: Amala Backend API

### Step 11: Verify Deployment

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs amala-backend

# Test health endpoint (replace with your EC2 public IP)
curl http://your-ec2-public-ip:3001/health
```

## PM2 Management Commands

```bash
# View all processes
pm2 list

# View logs
pm2 logs amala-backend

# View real-time logs
pm2 logs amala-backend --lines 50

# Restart application
pm2 restart amala-backend

# Stop application
pm2 stop amala-backend

# Delete application from PM2
pm2 delete amala-backend

# Monitor resources
pm2 monit

# View detailed information
pm2 show amala-backend
```

## Systemd Service (Alternative to PM2)

If you prefer systemd over PM2, create a service file:

```bash
sudo nano /etc/systemd/system/amala-backend.service
```

Add the following (adjust paths as needed):

```ini
[Unit]
Description=Amala Backend API
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/amala/apps/backend
Environment="NODE_ENV=production"
EnvironmentFile=/opt/amala/apps/backend/.env
ExecStart=/usr/bin/node dist/index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable amala-backend
sudo systemctl start amala-backend

# Check status
sudo systemctl status amala-backend

# View logs
sudo journalctl -u amala-backend -f
```

## Reverse Proxy with Nginx (Recommended for Production)

For production, use Nginx as a reverse proxy:

### Install Nginx

```bash
sudo apt update
sudo apt install nginx
```

### Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/amala-backend
```

Add configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # or your EC2 public IP

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/amala-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

Update firewall:

```bash
sudo ufw allow 'Nginx Full'
```

## Monitoring and Logging

### PM2 Logs

PM2 automatically logs to:
- `~/.pm2/logs/amala-backend-out.log` - Standard output
- `~/.pm2/logs/amala-backend-error.log` - Standard error

### Application Logs

Application logs are written to console and captured by PM2/systemd.

### Health Checks

Monitor the `/health` endpoint:

```bash
# Simple health check script
while true; do
  curl -f http://localhost:3001/health || echo "Health check failed"
  sleep 60
done
```

## Troubleshooting

### Application won't start

1. Check environment variables:
   ```bash
   cat .env
   ```

2. Check logs:
   ```bash
   pm2 logs amala-backend
   ```

3. Verify Node.js version:
   ```bash
   node --version
   ```

4. Check if port is in use:
   ```bash
   sudo lsof -i :3001
   ```

### DynamoDB connection errors

1. Verify AWS credentials/IAM role
2. Check AWS_REGION matches your table region
3. Verify table name matches DYNAMODB_TABLE_NAME
4. Test AWS CLI access:
   ```bash
   aws dynamodb describe-table --table-name amala-data
   ```

### Cognito JWT validation errors

1. Verify COGNITO_USER_POOL_ID is correct
2. Check AWS_REGION matches User Pool region
3. Verify token is valid and not expired
4. Check Cognito User Pool is active

### Permission denied errors

1. Check file permissions:
   ```bash
   ls -la /opt/amala/apps/backend
   ```

2. Ensure user has read/write permissions
3. Check PM2/systemd service user matches file owner

## Security Considerations

1. **Use IAM Roles**: Instead of access keys, attach an IAM role to your EC2 instance
2. **Environment Variables**: Never commit `.env` files to version control
3. **Firewall**: Restrict access to necessary ports only
4. **HTTPS**: Use Nginx with SSL/TLS certificates (Let's Encrypt) for production
5. **Keep Updated**: Regularly update Node.js, dependencies, and system packages
6. **Logs**: Monitor logs for suspicious activity
7. **Backup**: Regularly backup your DynamoDB table

## Updating the Application

```bash
cd /opt/amala/apps/backend

# Pull latest changes (if using git)
git pull

# Or upload new files via SCP

# Install new dependencies (if any)
pnpm install --frozen-lockfile

# Rebuild
pnpm build

# Restart application
pm2 restart amala-backend

# Check status
pm2 status
pm2 logs amala-backend
```

## Development

See the main project README for development setup instructions.

### Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking

## License

MIT
