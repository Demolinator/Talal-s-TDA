# Regression Test Suite - Quick Reference Guide

## What is the Regression Suite?

The `regression.spec.ts` file is a **comprehensive E2E test suite** that validates all user stories in a single, consolidated test file. It serves as:

- **Smoke Test**: Run before production deployments to catch critical issues
- **Regression Prevention**: Ensure existing functionality still works after changes
- **Quick Validation**: Single file covering all major user journeys
- **Documentation**: Executable specification of all user stories

## Test Coverage at a Glance

| User Story | Test Count | Description |
|------------|------------|-------------|
| **US1: Authentication** | 8 | Signup, login, logout, error handling, protected routes |
| **US2: Task Management** | 10 | CRUD operations, validation, persistence, sorting |
| **US3: Authorization** | 2 | Cross-user isolation, 403 errors |
| **US4: Responsive UI** | 6 | Mobile, tablet, desktop layouts |
| **US5: API Docs** | 3 | Swagger UI accessibility |
| **Smoke Test** | 1 | Complete end-to-end journey |
| **TOTAL** | **30** | All critical user paths |

## Quick Commands

### Run Regression Suite Only

```bash
# From frontend directory
npx playwright test regression.spec.ts
```

### Run Specific User Story

```bash
# US1: Authentication
npx playwright test regression.spec.ts --grep "US1:"

# US2: Task Management
npx playwright test regression.spec.ts --grep "US2:"

# US3: Authorization
npx playwright test regression.spec.ts --grep "US3:"

# US4: Responsive UI
npx playwright test regression.spec.ts --grep "US4:"

# US5: API Documentation
npx playwright test regression.spec.ts --grep "US5:"
```

### Run Smoke Test Only

```bash
npx playwright test regression.spec.ts --grep "Comprehensive Smoke Test"
```

### Run in Debug Mode

```bash
# Debug specific test
npx playwright test regression.spec.ts --grep "should signup" --debug

# Debug entire suite
npx playwright test regression.spec.ts --debug
```

### Run on Specific Browser

```bash
# Chrome only
npx playwright test regression.spec.ts --project=chromium

# Firefox only
npx playwright test regression.spec.ts --project=firefox

# Mobile Chrome
npx playwright test regression.spec.ts --project="Mobile Chrome"
```

## Test Structure

### Helper Functions

The regression suite includes reusable helper functions to keep tests DRY:

```typescript
// User management
generateTestEmail(prefix) // Generate unique test email
signupUser(page, name, emailPrefix) // Create new user account
loginUser(page, email, password) // Login existing user
logoutUser(page) // Logout current user

// Task operations
createTask(page, title, description) // Create new task
editTask(page, oldTitle, newTitle, newDescription) // Update task
toggleTaskCompletion(page, taskTitle) // Mark complete/incomplete
deleteTask(page, taskTitle) // Delete with confirmation
```

### Test Organization

```
regression.spec.ts
├── Configuration (API_URL, APP_URL, VIEWPORTS)
├── Helper Functions (signupUser, createTask, etc.)
├── US1: Authentication (8 tests)
├── US2: Task Management (10 tests)
├── US3: Authorization (2 tests)
├── US4: Responsive UI (6 tests)
├── US5: API Documentation (3 tests)
└── Comprehensive Smoke Test (1 test)
```

## When to Run Regression Tests

### Required Before

- **Production Deployment**: Always run full suite before releasing to production
- **Merging to Main**: Ensure no regressions in main branch
- **Major Refactoring**: Validate functionality after large code changes

### Recommended After

- **Bug Fixes**: Verify fix doesn't break existing features
- **New Features**: Ensure new code doesn't affect existing functionality
- **Dependency Updates**: Check compatibility after updating packages

### Good Practice

- **Daily CI Runs**: Automatically run on every commit to main
- **Pre-commit Hook**: Run smoke test locally before committing
- **Pull Request Checks**: Require passing tests before merge approval

## Expected Test Duration

| Scope | Duration (Parallel) | Duration (Sequential) |
|-------|---------------------|----------------------|
| Smoke Test Only | ~1 minute | ~2 minutes |
| Single User Story | ~1-2 minutes | ~3-5 minutes |
| Full Regression Suite | ~3-5 minutes | ~15-20 minutes |
| All Browsers (3x) | ~5-8 minutes | ~45-60 minutes |

*Note: Times vary based on hardware and network speed*

## Prerequisites Checklist

Before running regression tests:

- [ ] **Backend API running** at http://localhost:8000
  ```bash
  cd backend && uv run uvicorn src.main:app --reload
  ```

- [ ] **Frontend dev server running** at http://localhost:3000
  ```bash
  cd frontend && pnpm dev
  ```

- [ ] **Database accessible** (Neon Postgres configured)

- [ ] **Environment variables set**
  - `NEXT_PUBLIC_API_URL=http://localhost:8000`
  - Database connection string in backend

- [ ] **Dependencies installed**
  ```bash
  pnpm install
  npx playwright install
  ```

## Reading Test Results

### Success Output

```
✓ US1: Authentication > should signup with valid credentials (2.3s)
✓ US1: Authentication > should login with valid credentials (1.8s)
✓ US2: Task Management > should create task with title (1.5s)
...
30 passed (3.5m)
```

### Failure Output

```
✗ US1: Authentication > should login with valid credentials (5.0s)

Error: expect(page).toHaveURL(/\/dashboard/)
Expected: /\/dashboard/
Received: /login

Call log:
- page.goto('http://localhost:3000/login')
- page.fill('[name="email"]', 'test@example.com')
- page.fill('[name="password"]', 'TestPass123!')
- page.click('button[type="submit"]')
```

### Viewing Detailed Report

```bash
# After test run, open HTML report
npx playwright show-report
```

The report includes:
- Test execution timeline
- Screenshots on failure
- Video recordings (if enabled)
- Network activity logs
- Console logs

## Common Issues and Solutions

### Issue: "Backend API not responding"

**Symptoms**: Tests timeout on API calls

**Solution**:
```bash
# Check backend is running
curl http://localhost:8000/health

# Start backend if not running
cd backend && uv run uvicorn src.main:app --reload
```

### Issue: "Element not found"

**Symptoms**: "locator.click: Target closed" or "Timeout waiting for selector"

**Possible Causes**:
1. UI structure changed (update selectors)
2. Element not visible yet (check loading states)
3. Modal not fully rendered (add wait conditions)

**Solution**:
```bash
# Run in headed mode to see what's happening
npx playwright test --headed --grep "failing test name"

# Debug step-by-step
npx playwright test --debug --grep "failing test name"
```

### Issue: "Test passes locally but fails in CI"

**Symptoms**: Green locally, red in CI

**Possible Causes**:
1. CI environment slower (increase timeouts)
2. Race conditions (add proper wait conditions)
3. Environment variables missing (check CI config)

**Solution**:
```typescript
// Increase timeout for specific test
test('slow test', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  // ... test code
});
```

### Issue: "Database conflicts between tests"

**Symptoms**: Tests fail when run in parallel but pass individually

**Solution**: Tests should use unique emails for isolation. Check helper functions:
```typescript
const email = generateTestEmail('unique-prefix'); // Auto-generates timestamp
```

## Maintenance Best Practices

### Adding New Tests

1. **Use existing helpers** when possible
2. **Follow naming convention**: "should [action] [expected result]"
3. **Group related tests** in describe blocks
4. **Ensure test isolation** (unique emails, no shared state)

Example:
```typescript
test.describe("US2: Task Management", () => {
  test("should filter tasks by status", async ({ page }) => {
    await signupUser(page, "Filter Test User", "filter");
    await createTask(page, "Active Task");
    await createTask(page, "Completed Task");
    await toggleTaskCompletion(page, "Completed Task");

    // Test filter logic
    await page.click('button:has-text("Active")');
    await expect(page.getByText("Active Task")).toBeVisible();
    await expect(page.getByText("Completed Task")).not.toBeVisible();
  });
});
```

### Updating Tests After UI Changes

1. **Run tests** to identify failures
2. **Use Playwright Inspector** to find new selectors
   ```bash
   npx playwright test --debug
   ```
3. **Update selectors** to match new structure
4. **Re-run tests** to verify fixes
5. **Update helper functions** if common patterns changed

### Removing Obsolete Tests

1. **Mark as skipped** first (don't delete immediately)
   ```typescript
   test.skip("obsolete test", async ({ page }) => {
     // This feature was removed
   });
   ```
2. **Wait one sprint** to ensure feature is truly removed
3. **Delete test** after confirmation

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Regression Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  regression:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          cd frontend
          pnpm install
          npx playwright install --with-deps

      - name: Start backend
        run: |
          cd backend
          uv run uvicorn src.main:app &
          sleep 5

      - name: Run regression tests
        run: |
          cd frontend
          npx playwright test regression.spec.ts

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: frontend/playwright-report/
```

## Performance Benchmarks

Track test execution time to detect performance regressions:

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| Full Suite (Chromium) | < 5 min | 5-8 min | > 8 min |
| Smoke Test | < 1 min | 1-2 min | > 2 min |
| Single Test | < 10 sec | 10-20 sec | > 20 sec |
| Test Startup | < 30 sec | 30-60 sec | > 60 sec |

If tests exceed critical thresholds:
1. Check backend response times
2. Review test wait conditions
3. Optimize database queries
4. Consider test parallelization

## Support and Resources

- **Test Issues**: Check `/frontend/tests/e2e/README.md`
- **Playwright Docs**: https://playwright.dev
- **Project Docs**: `/specs/004-phase-2-web-app/`
- **Team Contact**: QA Agent / Testing Lead

---

**Document Version**: 1.0.0
**Last Updated**: 2025-12-12
**Next Review**: After major UI/API changes
