# HomePage Tests

## Running Tests

### Run all tests

```bash
pnpm test
```

### Run only HomePage tests

```bash
pnpm test HomePage.test.tsx
```

### Run tests in watch mode (auto-rerun on file changes)

```bash
pnpm test:watch
```

### Run tests with UI

```bash
pnpm test:ui
```

### Run tests with coverage

```bash
pnpm test:coverage
```

## Test Coverage

The HomePage test suite includes:

- ✅ Component renders without crashing
- ✅ Title is displayed
- ✅ Tagline text is displayed
- ✅ Logo component renders with correct props
- ✅ Sign in button is rendered
- ✅ Footer component is rendered
- ✅ Navigation to `/auth` when button is clicked
- ✅ Correct CSS classes are applied

## Test Structure

Tests use:

- **Vitest** as the test runner
- **React Testing Library** for component testing
- **User Event** for interaction testing
- **MemoryRouter** for routing context
- Mocked components (LogoSvg, Footer) to isolate the component under test
- Mocked `useNavigate` to test navigation behavior
