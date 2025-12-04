<!--
Sync Impact Report:
- Version change: (initial) → 1.0.0
- This is the initial constitution for Phase 1
- Templates status: ✅ All templates aligned with constitution principles
- Follow-up TODOs: None
-->

# Todo Console App Constitution (Phase 1)

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)
All features MUST be specified before implementation. No code shall be written without a corresponding specification in the `/specs` directory. Specifications must include:
- Clear user stories and acceptance criteria
- Input/output examples
- Edge cases and error handling requirements
- Success criteria that can be tested

**Rationale**: Spec-driven development ensures clear requirements, facilitates Claude Code collaboration, and provides documentation for future phases.

### II. Clean Code & Pythonic Standards
All Python code MUST adhere to:
- PEP 8 style guidelines (enforced via linting)
- Type hints for all function parameters and return values
- Descriptive variable and function names (no single-letter names except loop counters)
- Maximum function length: 50 lines (extract helpers if longer)
- Maximum file length: 300 lines (split into modules if longer)
- Docstrings for all public functions and classes

**Rationale**: Clean code improves maintainability, facilitates AI-assisted development, and prepares codebase for evolution to Phase 2.

### III. Test-First Development (TDD)
Testing discipline MUST follow Red-Green-Refactor cycle:
1. **Red**: Write failing test(s) for the feature
2. **Green**: Implement minimum code to pass tests
3. **Refactor**: Clean up while keeping tests green

Requirements:
- All features MUST have unit tests
- Test coverage target: minimum 80%
- Tests MUST be executable via `pytest`
- Test files MUST mirror source structure in `/tests` directory

**Rationale**: TDD ensures correctness, prevents regressions, and provides executable documentation of feature behavior.

### IV. Simple In-Memory Storage
For Phase 1, data storage MUST remain in-memory:
- Use Python data structures (dict, list) for task storage
- No file I/O or database connections
- State exists only during program execution
- Design MUST anticipate future persistence (Phase 2)

**Rationale**: In-memory storage keeps Phase 1 simple while establishing clear data models for future database integration.

### V. CLI Interface Excellence
Command-line interface MUST be:
- Intuitive: Clear prompts and menu options
- Robust: Handle invalid input gracefully
- Informative: Provide helpful error messages
- Consistent: Uniform command structure across features
- User-friendly: Display task lists in readable format

Features:
- Numbered menu system for main operations
- Clear input prompts with examples
- Confirmation for destructive operations (delete)
- Formatted output tables for task listing

**Rationale**: A polished CLI demonstrates professional software craftsmanship and provides foundation for Phase 3 chatbot interface.

### VI. Python 3.13+ Modern Practices
Technology standards MUST include:
- Python 3.13 or higher
- UV for dependency management (replaces pip/poetry)
- Modern type hints (using `|` for unions, not `Union`)
- Use of match/case statements where appropriate
- Dataclasses or Pydantic models for task representation

**Rationale**: Modern Python features improve code clarity, performance, and align with current industry standards.

## Technology Standards

**Required Stack**:
- **Language**: Python 3.13+
- **Package Manager**: UV
- **Testing Framework**: pytest
- **Type Checking**: mypy (optional but recommended)
- **Linting**: ruff or flake8
- **Spec Management**: Claude Code + Spec-Kit Plus

**Project Structure**:
```
phase-1/
├── .specify/              # Spec-Kit Plus configuration
├── specs/                 # Feature specifications
├── src/
│   └── todo_app/         # Application source code
│       ├── __init__.py
│       ├── main.py       # Entry point
│       ├── models.py     # Task data models
│       ├── storage.py    # In-memory storage logic
│       └── cli.py        # CLI interface logic
├── tests/                # Test files mirroring src/
├── README.md             # Setup and usage instructions
├── CLAUDE.md             # Claude Code instructions
└── pyproject.toml        # UV project configuration
```

**Dependencies**:
- Minimal external dependencies (prefer standard library)
- pytest for testing
- Any UI libraries (rich, click) require justification

## Development Workflow

**Feature Implementation Cycle**:
1. **Specify**: Create/update spec in `/specs` directory using Claude Code
2. **Review Spec**: Verify acceptance criteria and examples are clear
3. **Write Tests**: Create failing tests based on spec (Red)
4. **Implement**: Write minimum code to pass tests (Green)
5. **Refactor**: Clean up code while keeping tests green
6. **Document**: Update README if user-facing changes
7. **Commit**: Create descriptive commit with spec reference

**Code Review Standards**:
- All code changes MUST reference a spec file
- Tests MUST pass before considering feature complete
- Type hints MUST be present
- Code MUST pass linting checks
- No commented-out code in commits

**Quality Gates**:
- ✅ All tests pass (`pytest`)
- ✅ Type checking passes (`mypy`) if configured
- ✅ Linting passes (`ruff check`)
- ✅ Spec acceptance criteria met
- ✅ README updated for user-facing changes

## Governance

**Amendment Process**:
This constitution governs Phase 1 development. Amendments require:
1. Documented rationale for change
2. Impact analysis on existing code/specs
3. Version increment following semantic versioning
4. Update to this file with new version and amendment date

**Versioning Policy**:
- **MAJOR**: Backward-incompatible principle changes
- **MINOR**: New principles or sections added
- **PATCH**: Clarifications, wording improvements

**Compliance**:
- All feature implementations MUST comply with these principles
- Claude Code MUST verify constitution compliance before code generation
- Deviations require explicit justification in spec or ADR
- Constitution supersedes all other practices

**Runtime Guidance**:
See `CLAUDE.md` for Claude Code-specific instructions and workflows.

**Version**: 1.0.0 | **Ratified**: 2025-12-04 | **Last Amended**: 2025-12-04
