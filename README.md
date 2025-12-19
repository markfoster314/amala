# Amala

A private video file sharing service for sharing videos with friends on privately hosted servers.

## What is Amala?

Amala is a self-hosted video sharing platform that allows you to privately share video files with friends and family. Unlike public video platforms, Amala runs on your own servers, giving you complete control over your content, privacy, and data.

### Key Features

- **Private Sharing**: Share videos only with people you choose
- **Self-Hosted**: Run on your own servers for complete control
- **Secure**: Your videos never leave your infrastructure
- **Simple**: Easy-to-use interface for uploading and sharing

## Tech Stack

- **Frontend**: React 19, Vite, TypeScript
- **Build System**: Turborepo (Monorepo)
- **Package Manager**: pnpm
- **Code Quality**: ESLint, Prettier, Commitlint
- **Git Hooks**: Husky, lint-staged

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

\`\`\`bash

# Install dependencies

pnpm install

# Start development server

pnpm dev

# Build for production

pnpm build
\`\`\`

## Project Structure

\`\`\`
amala/
├── apps/
│ ├── frontend/ # React frontend application
│ ├── backend/ # Backend API server
│ └── aws/ # AWS infrastructure/deployment
├── packages/ # Shared packages and utilities
└── ...
\`\`\`

## Development

### Running the Application

\`\`\`bash

# Start all apps in development mode

pnpm dev

# Start only frontend

cd apps/frontend && pnpm dev
\`\`\`

### Code Quality

\`\`\`bash

# Lint code

pnpm lint

# Format code

pnpm format

# Type check

pnpm type-check
\`\`\`

## Building for Production

\`\`\`bash

# Build all applications

pnpm build
\`\`\`

## Contributing

This project follows conventional commit standards and uses ESLint, Prettier, and TypeScript for code quality.

## License

[Your License Here]
