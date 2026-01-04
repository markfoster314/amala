# Contributing to Amala

Thank you for your interest in contributing to Amala! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Style Guidelines](#style-guidelines)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before participating.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/amala.git
   cd amala
   ```
3. **Install dependencies**:
   ```bash
   pnpm install
   ```
4. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Process

### Running the Development Environment

```bash
# Start all apps in development mode
pnpm dev

# Start only frontend
cd apps/frontend && pnpm dev

# Run linting
pnpm lint

# Run type checking
pnpm type-check

# Format code
pnpm format
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

## Making Changes

### Before You Start

- Check existing issues and pull requests to see if someone is already working on something similar
- For large changes, consider opening an issue first to discuss the approach
- Make sure your changes align with the project's goals and vision

### Coding Standards

1. **TypeScript**: We use TypeScript for type safety. Ensure all new code is properly typed.
2. **Linting**: Code must pass ESLint. Run `pnpm lint` before committing.
3. **Formatting**: Code must be formatted with Prettier. Run `pnpm format` before committing.
4. **Commits**: We use [Conventional Commits](https://www.conventionalcommits.org/). Commit messages should follow this format:

   ```
   <type>(<scope>): <subject>

   <body>

   <footer>
   ```

   Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Example Commit Messages

```
feat(frontend): add video upload component
fix(backend): resolve authentication token expiration
docs(readme): update installation instructions
```

## Submitting Changes

1. **Ensure your code passes all checks**:

   ```bash
   pnpm validate  # Runs lint, type-check, and format:check
   ```

2. **Commit your changes** using conventional commits:

   ```bash
   git add .
   git commit -m "feat(scope): your commit message"
   ```

3. **Push to your fork**:

   ```bash
   git push origin feature/your-feature-name
   ```

4. **Open a Pull Request** on GitHub:
   - Provide a clear description of your changes
   - Reference any related issues
   - Ensure all CI checks pass

### Pull Request Guidelines

- **Title**: Use a clear, descriptive title following conventional commits
- **Description**: Explain what changes you made and why
- **Testing**: Describe how you tested your changes
- **Breaking Changes**: If applicable, clearly mark and describe any breaking changes

## Style Guidelines

### TypeScript/JavaScript

- Use meaningful variable and function names
- Prefer functional programming patterns where appropriate
- Keep functions small and focused
- Add JSDoc comments for public APIs

### React Components

- Use functional components with hooks
- Keep components focused and reusable
- Use TypeScript interfaces for props
- Extract complex logic into custom hooks

### File Organization

- Keep related files together
- Use consistent naming conventions
- Separate concerns (components, hooks, utils, types)

## Questions?

If you have questions about contributing, please:

- Open an issue with the `question` label
- Check existing issues and discussions
- Review the documentation

Thank you for contributing to Amala!
