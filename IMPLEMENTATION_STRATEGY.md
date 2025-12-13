# Implementation Strategy: Subagent Orchestration & Skills

**Date**: 2025-12-11
**Status**: Ready for Execution
**Remaining Work**: 37 tasks across 5 phases

---

## Executive Summary

This document outlines the subagent coordination strategy for completing the Phase II full-stack web application. We've created **6 reusable skills** and designed **4 parallel swarms** to efficiently complete the remaining 37 tasks.

---

## Current Status

### ✅ Completed Phases (70/104 tasks - 67%)
- **Phase 1**: Setup (10/10 tasks)
- **Phase 2**: Foundational (7/7 tasks)
- **Phase 3**: US1 Authentication (23/23 tasks)
- **Phase 4**: US2 Task Management - Implementation (20/25 tasks)

### ⚠️ Incomplete Phases (37/104 tasks - 33%)
- **Phase 4**: US2 Testing (5 tasks: T061-T065)
- **Phase 5**: US3 Authorization (5 tasks: T071-T075)
- **Phase 6**: US4 Responsive UI (11 tasks: T076-T086)
- **Phase 7**: US5 API Documentation (6 tasks: T087-T092)
- **Phase 8**: Polish & Production (12 tasks: T093-T104)

---

## Reusable Skills Created

All skills are located in `.claude/skills/` and follow the constitution's skill creation guidelines.

### 1. `create-backend-tests` (.claude/skills/create-backend-tests/skill.md)
**Purpose**: Generate pytest unit and integration tests for FastAPI endpoints

**References**:
- pytest documentation: https://docs.pytest.org/
- FastAPI testing: https://fastapi.tiangolo.com/tutorial/testing/
- pytest fixtures: https://docs.pytest.org/en/stable/fixture.html
- httpx TestClient: https://www.python-httpx.org/advanced/#calling-into-python-web-apps

**Inputs**:
- Model file path (SQLModel)
- Service file path (business logic)
- API file path (FastAPI endpoints)
- Test type (`unit` | `integration` | `both`)

**Outputs**:
- `backend/tests/unit/test_<module>_service.py` (unit tests)
- `backend/tests/integration/test_<module>_api.py` (integration tests)
- Coverage report showing >80% coverage

**Used in tasks**: T061, T062, T074

---

### 2. `create-frontend-tests` (.claude/skills/create-frontend-tests/skill.md)
**Purpose**: Generate Vitest + React Testing Library tests for React components

**References**:
- Vitest documentation: https://vitest.dev/
- React Testing Library: https://testing-library.com/docs/react-testing-library/intro/
- Testing Library best practices: https://kentcdodds.com/blog/common-mistakes-with-react-testing-library
- User event library: https://testing-library.com/docs/user-event/intro

**Inputs**:
- Component file path (React/TypeScript)
- Test scenarios (array of test cases)

**Outputs**:
- `frontend/tests/unit/<ComponentName>.test.tsx` (component tests)
- Coverage report showing >70% coverage

**Used in tasks**: T063, T064

---

### 3. `create-e2e-tests` (.claude/skills/create-e2e-tests/skill.md)
**Purpose**: Generate Playwright end-to-end tests for complete user flows

**References**:
- Playwright documentation: https://playwright.dev/
- Playwright best practices: https://playwright.dev/docs/best-practices
- Page Object Model: https://playwright.dev/docs/pom
- Accessibility testing: https://playwright.dev/docs/accessibility-testing

**Inputs**:
- User story ID (e.g., "US2 - Task Management")
- Flow steps (sequential user actions)
- Acceptance criteria (expected outcomes)

**Outputs**:
- `frontend/tests/e2e/<feature>.spec.ts` (E2E test file)
- Test execution report with screenshots/videos

**Used in tasks**: T065, T075, T086, T104

---

### 4. `make-responsive` (.claude/skills/make-responsive/skill.md)
**Purpose**: Add Tailwind CSS responsive classes for mobile-first design

**References**:
- Tailwind CSS responsive design: https://tailwindcss.com/docs/responsive-design
- Tailwind breakpoints: https://tailwindcss.com/docs/screens
- Mobile-first approach: https://tailwindcss.com/docs/responsive-design#mobile-first
- Responsive grid: https://tailwindcss.com/docs/grid-template-columns#responsive

**Inputs**:
- Component file path (React/TypeScript)
- Breakpoint requirements (mobile/tablet/desktop behavior)

**Outputs**:
- Updated component with responsive Tailwind classes
- Visual verification at 375px, 768px, 1920px viewports

**Used in tasks**: T076, T077, T078, T079

---

### 5. `add-accessibility` (.claude/skills/add-accessibility/skill.md)
**Purpose**: Add WCAG 2.1 AA accessibility features (ARIA, keyboard nav, focus indicators)

**References**:
- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/
- WebAIM keyboard accessibility: https://webaim.org/techniques/keyboard/
- Focus management in React: https://reactjs.org/docs/accessibility.html#focus-control
- Color contrast checker: https://webaim.org/resources/contrastchecker/

**Inputs**:
- Component file path (React/TypeScript)
- Accessibility requirements (keyboard nav, ARIA, focus, screen reader)

**Outputs**:
- Updated component with a11y features
- Lighthouse accessibility score ≥90
- Keyboard navigation test passing

**Used in tasks**: T080, T081, T082, T083, T084, T085

---

### 6. `enhance-api-docs` (.claude/skills/enhance-api-docs/skill.md)
**Purpose**: Add comprehensive docstrings and OpenAPI examples to FastAPI endpoints

**References**:
- FastAPI OpenAPI customization: https://fastapi.tiangolo.com/advanced/extending-openapi/
- Pydantic Field examples: https://docs.pydantic.dev/latest/api/fields/#pydantic.fields.Field
- OpenAPI 3.1.0 specification: https://spec.openapi.org/oas/v3.1.0
- FastAPI response models: https://fastapi.tiangolo.com/tutorial/response-model/

**Inputs**:
- API file path (FastAPI routes)
- Model file path (Pydantic models)

**Outputs**:
- Updated API file with comprehensive docstrings
- Updated model file with Field(example=...)
- Verified /docs showing complete documentation

**Used in tasks**: T087, T088, T089, T090, T091

---

## Subagent Coordination Strategy

We'll use **parallel swarm execution** to maximize efficiency. Each swarm consists of specialized subagents working on related tasks.

### Swarm Execution Order
1. **Swarm 1**: Testing Battalion (Phase 4 completion) - **PRIORITY**
2. **Swarm 2**: Security & Authorization (Phase 5) - **HIGH PRIORITY**
3. **Swarm 3**: UI/UX Excellence (Phase 6) - **MEDIUM PRIORITY**
4. **Swarm 4**: Documentation & Polish (Phases 7 + 8) - **LOW PRIORITY**

---

## Swarm 1: Testing Battalion 🧪
**Goal**: Complete Phase 4 (US2 Task Management Testing)
**Tasks**: T061-T065 (5 tasks)
**Parallelization**: 4 subagents running concurrently

### Subagent A: Backend Unit Test Engineer
- **Task**: T061 - Write backend unit tests
- **File**: `backend/tests/unit/test_task_service.py`
- **Skill**: `create-backend-tests`
- **Input**:
  - Model: `backend/src/models/task.py`
  - Service: `backend/src/services/task_service.py`
  - Test type: `unit`
- **Tests to create**:
  - `test_create_task_success()`
  - `test_get_user_tasks_returns_only_owned_tasks()`
  - `test_update_task_ownership_validation()`
  - `test_delete_task_removes_from_db()`
  - `test_toggle_complete_updates_status()`

### Subagent B: Backend Integration Test Engineer
- **Task**: T062 - Write backend integration tests
- **File**: `backend/tests/integration/test_tasks_api.py`
- **Skill**: `create-backend-tests`
- **Input**:
  - Model: `backend/src/models/task.py`
  - API: `backend/src/api/tasks.py`
  - Test type: `integration`
- **Tests to create**:
  - `test_list_tasks_authenticated_200()`
  - `test_create_task_201_with_location_header()`
  - `test_update_task_404_not_found()`
  - `test_delete_task_ownership_403_forbidden()`
  - `test_pagination_limit_offset()`
  - `test_filtering_by_is_complete()`

### Subagent C: Frontend Unit Test Engineer
- **Tasks**: T063, T064 - Write frontend unit tests
- **Files**:
  - `frontend/tests/unit/TaskCard.test.tsx`
  - `frontend/tests/unit/TaskForm.test.tsx`
- **Skill**: `create-frontend-tests`
- **Tests to create**:
  - TaskCard: render, toggle complete, delete button, edit button
  - TaskForm: validation errors, valid submission, max length checks

### Subagent D: E2E Test Engineer
- **Task**: T065 - Write E2E test for task CRUD flow
- **File**: `frontend/tests/e2e/tasks.spec.ts`
- **Skill**: `create-e2e-tests`
- **Flow**: login → create task → view in list → edit → toggle complete → delete → verify removed

**Deliverable**: All Phase 4 tests passing, coverage >80%

---

## Swarm 2: Security & Authorization Squad 🔒
**Goal**: Complete Phase 5 (US3 Protected Routes and Authorization)
**Tasks**: T071-T075 (5 tasks)
**Parallelization**: 3 subagents (T071-T072 parallel, then T073, then T074-T075 parallel)

### Subagent A: Frontend Security Engineer
- **Tasks**: T071, T072, T073 - Frontend auth middleware and error handling
- **Files**:
  - `frontend/middleware.ts` (enhance session expiration handling)
  - `frontend/src/lib/api.ts` (add 403 error handling)
  - `frontend/src/app/layout.tsx` (session persistence check)
- **Implementation**:
  - T071: Add session expiration redirect with "Session expired" message
  - T072: Add 403 handler to redirect to dashboard with error toast
  - T073: Verify auth_token cookie on mount, redirect to /login if missing

### Subagent B: Backend Authorization Test Engineer
- **Task**: T074 - Write backend authorization integration tests
- **File**: `backend/tests/integration/test_authorization.py`
- **Skill**: `create-backend-tests`
- **Tests to create**:
  - `test_user_a_cannot_access_user_b_task_403()`
  - `test_rate_limiting_login_endpoint()`
  - `test_jwt_expiration_returns_401()`
  - `test_ownership_check_on_all_endpoints()`

### Subagent C: E2E Authorization Test Engineer
- **Task**: T075 - Write E2E authorization test
- **File**: `frontend/tests/e2e/authorization.spec.ts`
- **Skill**: `create-e2e-tests`
- **Flow**: User A creates task → logout → User B login → verify cannot see User A's task

**Deliverable**: Complete authorization enforcement, all tests passing

---

## Swarm 3: UI/UX Excellence Team 🎨
**Goal**: Complete Phase 6 (US4 Responsive and Accessible UI)
**Tasks**: T076-T086 (11 tasks)
**Parallelization**: 3 subagents running in waves

### Subagent A: Responsive Design Engineer
- **Tasks**: T076, T077, T078, T079 - Make components responsive
- **Skill**: `make-responsive`
- **Components**:
  - TaskList (phase-2/frontend/components/tasks/TaskList.tsx) - grid-cols-1 md:grid-cols-2 lg:grid-cols-3
  - Header (phase-2/frontend/components/layout/Header.tsx) - hamburger menu mobile, full nav desktop
  - Sidebar (phase-2/frontend/components/layout/Sidebar.tsx) - hidden mobile, visible desktop
  - Forms (phase-2/frontend/components/auth/) - full-width mobile, max-w-md desktop
- **Breakpoints**:
  - Mobile: 320px-767px (single column, hamburger menu)
  - Tablet: 768px-1023px (2-column grid)
  - Desktop: 1024px+ (3-column grid, sidebar)

### Subagent B: Accessibility Engineer
- **Tasks**: T080, T081, T082, T083, T084 - Add accessibility features
- **Skill**: `add-accessibility`
- **Components**: TaskCard (phase-2/frontend/components/tasks/), SignupForm/LoginForm (phase-2/frontend/components/auth/), TaskList, Header
- **Features to add**:
  - ARIA labels for icon buttons (aria-label="Delete task")
  - Focus indicators (ring-2 ring-blue-500)
  - Alt text for images (logo, empty state)
  - Keyboard navigation (Tab, Enter, Escape)
  - Color contrast validation (WCAG 2.1 AA)

### Subagent C: Accessibility Auditor
- **Tasks**: T085, T086 - Run Lighthouse audit and responsive E2E test
- **Files**:
  - Lighthouse audit report
  - `phase-2/frontend/tests/e2e/responsive.spec.ts` (test 375px, 768px, 1920px)
- **Skill**: `create-e2e-tests`
- **Target**: Lighthouse accessibility score ≥90

**Deliverable**: Fully responsive UI, WCAG 2.1 AA compliant, Lighthouse score ≥90

---

## Swarm 4: Documentation & Polish Team 📚
**Goal**: Complete Phases 7 + 8 (API Documentation and Production Polish)
**Tasks**: T087-T104 (18 tasks)
**Parallelization**: 3 subagents working on different concerns

### Subagent A: API Documentation Engineer
- **Tasks**: T087-T092 - Enhance API documentation
- **Skill**: `enhance-api-docs`
- **Files**:
  - `phase-2/backend/src/api/auth.py` (add docstrings)
  - `phase-2/backend/src/api/tasks.py` (add docstrings)
  - `phase-2/backend/src/models/user.py` (add Field(example=...))
  - `phase-2/backend/src/models/task.py` (add Field(example=...))
  - `phase-2/backend/src/main.py` (configure OpenAPI metadata)
- **Requirements**:
  - Comprehensive docstrings for all 15 endpoints
  - Example values for all Pydantic models
  - Error response examples (400, 401, 403, 404, 500)
  - Test /docs endpoint manually

### Subagent B: Performance & UX Engineer
- **Tasks**: T093-T099 - Performance optimization and UX polish
- **Files**:
  - Database indexes (Alembic migration in phase-2/backend/)
  - Error boundary (`phase-2/frontend/app/error.tsx`)
  - Loading states (`phase-2/frontend/app/(dashboard)/dashboard/tasks/loading.tsx`)
  - Optimistic UI updates (TaskCard, TaskList)
  - Empty state UI (TaskList)
  - Form debouncing (SignupForm, TaskForm)
  - Session expiration with unsaved changes (localStorage)
- **Requirements**:
  - Create index migration for task.user_id, task.created_at, user.email
  - Implement Suspense boundaries with skeleton screens
  - Add optimistic updates with rollback on error
  - Add empty state: "No tasks yet. Click 'Add Task' to get started!"

### Subagent C: Security & Validation Engineer
- **Tasks**: T100-T104 - Production readiness
- **Files**:
  - Global exception handler (`phase-2/backend/src/main.py`)
  - Security audit reports (`npm audit` in phase-2/frontend, `pip-audit` in phase-2/backend)
  - Performance benchmarks (Lighthouse for phase-2/frontend, load testing for phase-2/backend)
  - Success criteria validation (SC-001 through SC-015)
  - E2E regression test suite (`phase-2/frontend/tests/e2e/regression.spec.ts`)
- **Requirements**:
  - Add global 500 error handler with logging
  - Fix all high/critical vulnerabilities (CVSS 7.0+)
  - Verify API p95 latency <200ms with 500 concurrent users
  - Verify all 15 success criteria from spec.md are met
  - Run complete E2E regression suite

**Deliverable**: Production-ready application, /docs complete, all success criteria met

---

## Implementation Sequence

### Phase 1: Testing Battalion (Immediate)
```bash
# Launch Swarm 1 with 4 parallel subagents
# Estimated time: 2-3 hours
# Blocker: None (all dependencies met)
```

### Phase 2: Security & Authorization (After Swarm 1)
```bash
# Launch Swarm 2 with 3 parallel subagents
# Estimated time: 1-2 hours
# Blocker: Requires Phase 4 tests passing
```

### Phase 3: UI/UX Excellence (After Swarm 2)
```bash
# Launch Swarm 3 with 3 parallel subagents
# Estimated time: 2-3 hours
# Blocker: None (can run in parallel with Swarm 2)
```

### Phase 4: Documentation & Polish (After Swarms 1-3)
```bash
# Launch Swarm 4 with 3 parallel subagents
# Estimated time: 3-4 hours
# Blocker: Requires all previous swarms complete
```

**Total Estimated Time**: 8-12 hours with parallel execution

---

## Success Criteria Validation

Before marking complete, verify all 15 success criteria from spec.md:

- [ ] **SC-001**: Signup flow <60 seconds
- [ ] **SC-002**: Task creation appears in <3 seconds
- [ ] **SC-003**: Page load <2s (FCP <1.5s, TTI <3s)
- [ ] **SC-004**: 500 concurrent users handled
- [ ] **SC-005**: 95% first-task creation success rate
- [ ] **SC-006**: 99.5% uptime during business hours
- [ ] **SC-007**: Full keyboard navigation
- [ ] **SC-008**: Lighthouse accessibility ≥90
- [ ] **SC-009**: API p95 latency <200ms
- [ ] **SC-010**: Works on Chrome, Firefox, Safari, Edge
- [ ] **SC-011**: Mobile users 95%+ success rate
- [ ] **SC-012**: Zero CVSS 7.0+ vulnerabilities
- [ ] **SC-013**: 100% passwords hashed
- [ ] **SC-014**: Tokens expire after 15 minutes
- [ ] **SC-015**: API docs cover 100% of routes

---

## Next Steps

1. **Review this strategy** with stakeholders
2. **Launch Swarm 1** (Testing Battalion) immediately
3. **Monitor progress** and unblock agents as needed
4. **Sequential deployment** of Swarms 2-4
5. **Final validation** of all success criteria
6. **Create PHR** for this orchestration session

---

## Constitution Compliance

This strategy follows all 12 constitution principles:

- **I. Spec-Driven Development**: All tasks derived from spec.md
- **II. Clean Code**: Skills follow best practices for each language
- **III. Test-First Development**: Testing battalion runs first
- **IV. Database-First**: Integration tests use real database
- **V. Multi-Interface**: Responsive and accessibility swarms ensure usability
- **VI. Modern Tech Stack**: Uses latest tools (Playwright, Vitest, FastAPI)
- **VII-XII**: API security, validated outputs, incremental delivery all addressed

---

**Document Status**: Ready for Execution
**Next Command**: Launch Swarm 1 subagents with appropriate skills
