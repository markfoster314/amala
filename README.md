# Amala

> A decentralized video file sharing network for private groups. Think Limewire, but for video files with invite-only groups similar to Discord servers.

![Amala Network](internals/smt3.jpg)

> "One more God denied"

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-≥20.0.0-brightgreen)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-≥8.0.0-orange)](https://pnpm.io/)

## What is Amala?

Amala is an open-source, self-hosted video sharing platform that enables private groups to share video files with each other. Whether you're sharing family videos, anime collections, or movies from various sources, Amala gives you control over your content without ads, tracking, or corporate oversight.

The name "Amala" comes from the **Amala Network** in _Shin Megami Tensei III: Nocturne_ a vast interconnected system that channels information and enables rapid communication between terminals. Like its namesake, Amala creates an interconnected network of servers and groups, allowing secure video sharing between trusted communities.

### The Vision

We're tired of ads, broken servers, and losing access to content we love. Amala is designed to bring the discussion about digital media sharing and copyright to the forefront. We believe in open-source technology that empowers users to control their own media infrastructure.

## Key Features

- **Private Groups**: Share videos only within invite-only groups (similar to Discord servers)
- **Self-Hosted**: Run on your own infrastructure for complete control
- **Decentralized**: No single point of failure or corporate control
- **No Ads**: Your content, your rules, zero advertising
- **Secure**: Videos stay within your infrastructure and trusted groups
- **Open Source**: MIT licensed transparent, auditable, and community-driven

## Use Cases

Amala is for any group of people who want to share video files privately:

- **Content Creators**: Share videos with collaborators or patrons
- **Families**: Store and share family videos privately
- **Communities**: Create private collections for anime, movies, or other media
- **Friends**: Set up your own video library without ads or subscriptions

## Deployment Options

### For Technical Users

Set up and run your own Amala server on infrastructure you control. Full documentation for self-hosting will be available as the project matures.

### For Everyone Else

Coming soon: The Amala Foundation will offer server setup services at cost. Donate to the foundation, and we'll help you get your own Amala server running. This ensures the project remains sustainable while keeping access affordable.

## Tech Stack

- **Frontend**: React 19, Vite, TypeScript
- **Build System**: Turborepo (Monorepo)
- **Package Manager**: pnpm
- **Code Quality**: ESLint, Prettier, Commitlint
- **Git Hooks**: Husky, lint-staged
- **Infrastructure**: AWS (for managed hosting option)
- **Containerization**: Docker, Docker Compose

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 8.0.0
- Docker and Docker Compose (for production builds)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Environment Variables

Amala requires environment variables for configuration. Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

### Required Environment Variables

Edit the `.env` file with your configuration:

```bash
# Backend Configuration
NODE_ENV=production
PORT=3001

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key

# DynamoDB Configuration
DYNAMODB_TABLE_NAME=amala-data

# S3 Configuration
AWS_S3_THUMBNAILS_BUCKET=amala-thumbnails

# Cognito Configuration
COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
COGNITO_CLIENT_ID=your-client-id

# Frontend Configuration (for Docker builds)
VITE_API_URL=http://localhost:3001
```

**Important Notes:**

- Never commit your `.env` file to version control (it's already in `.gitignore`)
- The `.env.example` file serves as a template showing all required variables
- For Docker production builds, frontend environment variables are embedded at build time
- Ensure all AWS credentials and Cognito configuration are correctly set before building

## Project Structure

```
amala/
├── apps/
│   ├── frontend/     # React frontend application
│   ├── backend/      # Backend API server
│   └── aws/          # AWS infrastructure/deployment
├── packages/         # Shared packages and utilities
└── ...
```

## Development

### Running the Application

```bash
# Start all apps in development mode
pnpm dev

# Start only frontend
cd apps/frontend && pnpm dev
```

### Code Quality

```bash
# Lint code
pnpm lint

# Format code
pnpm format

# Type check
pnpm type-check

# Run all validation checks
pnpm validate
```

## Building for Production

### Local Build

```bash
# Build all applications
pnpm build
```

### Docker Production Builds

Amala includes Docker configuration for building and running production-ready containers. This is the recommended approach for deployment.

#### Prerequisites

- Docker and Docker Compose installed
- Environment variables configured (see [Environment Variables](#environment-variables) section)
- `.env` file created with all required variables

#### Building Docker Images

```bash
# Build both frontend and backend images
docker-compose build

# Or using npm script
pnpm docker:build
```

#### Running with Docker

```bash
# Start all services in detached mode
docker-compose up -d

# Or using npm script
pnpm docker:up

# View logs
docker-compose logs -f

# Or using npm script
pnpm docker:logs

# Stop services
docker-compose down

# Or using npm script
pnpm docker:down
```

#### Docker Commands

```bash
# Build images
pnpm docker:build          # Build all images
docker-compose build       # Alternative

# Start services
pnpm docker:up            # Start in detached mode
pnpm docker:dev           # Start in foreground (see logs)
docker-compose up -d      # Alternative

# Stop services
pnpm docker:down          # Stop services
docker-compose down       # Alternative

# View logs
pnpm docker:logs          # Follow logs
docker-compose logs -f    # Alternative

# Cleanup
pnpm docker:clean         # Stop and remove all containers, volumes, and images
```

#### Docker Services

When running with Docker Compose, the following services are available:

- **Frontend**: Available at `http://localhost:3000`
  - Production build served by nginx
  - Environment variables embedded at build time
- **Backend**: Available at `http://localhost:3001`
  - Production build running Node.js
  - Health check endpoint: `http://localhost:3001/health`

#### Testing Docker Build

```bash
# Build and start services
docker-compose build
docker-compose up -d

# Test backend health
curl http://localhost:3001/health

# Test frontend
curl http://localhost:3000

# View logs for troubleshooting
docker-compose logs backend
docker-compose logs frontend
```

**Note:** For development, it's recommended to use `pnpm dev` for faster iteration with hot reload. Docker builds are optimized for production deployment and testing.

## Contributing

We welcome contributions to Amala! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct, the development process, and how to submit pull requests.

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md) that all contributors are expected to follow. Please read it before participating.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Legal Notice

Amala is an open-source tool for video file sharing. Users are responsible for ensuring they have the legal right to share any content they upload. This project is designed to facilitate discussions about digital media sharing and copyright in the modern era.

---

**Inspired by the need for better media sharing.** Built for communities, by communities.
