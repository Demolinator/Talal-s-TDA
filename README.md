```
  _____     _       _       _____ ____    _
 |_   _|_ _| | __ _| |___  |_   _|  _ \  / \
   | |/ _` | |/ _` | / __|   | | | | | |/ _ \
   | | (_| | | (_| | \__ \   | | | |_| / ___ \
   |_|\__,_|_|\__,_|_|___/   |_| |____/_/   \_\
```

# Talal's TDA - Evolution of Todo: A Multi-Phase Project

## Project Overview

Welcome to the "Evolution of Todo" project, a multi-phase development effort initiated as part of "Hackathon II." This project aims to demonstrate the progression of a simple Todo application across various architectural styles and technologies.

**Current Phase: Phase I - Todo In-Memory Python Console App** ✅ **COMPLETE**

This initial phase focuses on building a fundamental Todo application using a Python-based Command-Line Interface (CLI) with in-memory data storage. It serves as a foundational example for subsequent phases, which will explore more advanced concepts like databases, web interfaces, and distributed systems.

**Key Features (Phase I):**
*   ✅ **Add Task**: Create new tasks with title and optional description
*   ✅ **View Tasks**: Display all tasks in a formatted table with status and timestamps
*   ✅ **Update Task**: Modify task title and/or description
*   ✅ **Mark Complete**: Toggle task completion status
*   ✅ **Delete Task**: Remove tasks with confirmation
*   ✅ **Professional Banner**: ASCII art branding with version information
*   ✅ **Input Validation**: Robust error handling and user-friendly error messages
*   ✅ **Test Coverage**: 87 tests with 100% pass rate

**Technical Highlights:**
*   Clean 3-layer architecture (UI → Business Logic → Data)
*   Test-Driven Development (TDD) with pytest
*   Python 3.13+ with modern type hints
*   Match/case statement for menu dispatch
*   Comprehensive error handling## Project Phases and Evolution

The "Evolution of Todo" project is structured into five distinct phases, each building upon the last to demonstrate different architectural patterns, technologies, and deployment strategies.

### Phase I: Todo In-Memory Python Console App
*   **Focus**: Foundational CLI application with basic task management.
*   **Requirements**: CRUD operations for tasks, in-memory storage.
*   **Tech Stack**: Python 3.13+, UV, standard CLI.
*   **Deliverables**: Functional Python console application, basic project structure.

### Phase II: Todo SQLite Python Backend with CLI
*   **Focus**: Introduction of data persistence.
*   **Requirements**: Tasks persisted to a SQLite database, enhanced CLI.
*   **Tech Stack**: Python 3.13+, UV, `sqlite3` or `SQLAlchemy`.
*   **Deliverables**: Python backend with SQLite, improved CLI.

### Phase III: Todo FastAPI Backend with Web UI
*   **Focus**: Exposing a web API and developing a basic frontend.
*   **Requirements**: RESTful API for tasks, simple web-based UI.
*   **Tech Stack**: Python 3.13+, UV, FastAPI, `uvicorn`, HTML/CSS/JavaScript.
*   **Deliverables**: FastAPI backend, RESTful API, web frontend.

### Phase IV: Todo Microservices with Kubernetes Deployment
*   **Focus**: Decomposing into microservices and containerized deployment.
*   **Requirements**: Application as microservices, Dockerization, Kubernetes deployment.
*   **Tech Stack**: Python 3.13+, UV, FastAPI/Flask, Docker, Kubernetes, Helm.
*   **Deliverables**: Containerized microservices, Kubernetes manifests, CI/CD.

### Phase V: Real-time Todo with WebSockets and Cloud Deployment
*   **Focus**: Real-time updates and cloud-native scaling.
*   **Requirements**: Real-time task updates via WebSockets, cloud platform deployment.
*   **Tech Stack**: Python 3.13+, UV, FastAPI (WebSockets), cloud services (AWS/GCP/Azure).
*   **Deliverables**: Real-time functionality, cloud deployment.

## Getting Started & Development Setup

This section provides a quickstart guide for setting up your development environment and running the Phase I "Evolution of Todo" console application.

### Prerequisites

*   **Operating System**: WSL 2 (for Windows users) or a native Linux environment.
*   **Python**: Python 3.13 or higher.
*   **UV**: Python package installer and resolver.

### Setup Instructions

1.  **Clone the Repository**:
    ```bash
    git clone <your-repo-url>
    cd phase-1
    ```

2.  **Install UV** (if not already installed):
    ```bash
    curl -LsSf https://astral.sh/uv/install.sh | sh
    ```
    Ensure `uv` is in your PATH. You may need to restart your terminal.

3.  **Install Dependencies**:
    UV will automatically create a virtual environment and install dependencies:
    ```bash
    uv sync
    ```

4.  **Run the Application**:
    ```bash
    uv run python -m src.todo_app.main
    ```

5.  **Interact with the Menu**:
    ```
    === Todo List Application ===
    1. Add Task
    2. View All Tasks
    3. Update Task
    4. Delete Task
    5. Mark Task as Complete
    6. Exit

    Enter your choice:
    ```

### Running Tests

Run the complete test suite with pytest:
```bash
# Run all tests
uv run pytest

# Run with verbose output
uv run pytest -v

# Run with coverage report
uv run pytest --cov=src.todo_app --cov-report=html
```

**Test Results**: 87 tests, 100% pass rate ✅

### Project Structure

```
phase-1/
├── src/todo_app/          # Application source code
│   ├── __init__.py
│   ├── main.py            # Entry point and menu loop
│   ├── models.py          # Task data model
│   ├── storage.py         # In-memory storage layer
│   ├── operations.py      # Business logic
│   ├── ui.py              # User interface functions
│   └── banner.py          # ASCII art banner
├── tests/                 # Comprehensive test suite
│   ├── test_models.py
│   ├── test_storage.py
│   ├── test_operations.py
│   ├── test_ui.py
│   ├── test_integration.py
│   └── test_banner.py
├── specs/                 # Feature specifications
│   ├── 001-console-todo-app/
│   ├── 002-cli-banner/
│   └── 003-project-readme/
├── .specify/              # Spec-Kit Plus configuration
├── history/               # Prompt history records
├── README.md              # This file
├── CLAUDE.md              # Claude Code instructions
└── pyproject.toml         # UV project configuration
```## Hackathon II Specifics

This project is part of "Hackathon II - Evolution of Todo." Below are key details relevant to the hackathon participation.

### Bonus Points

*   **Comprehensive Documentation**: Well-structured `README.md`, clear code comments, and detailed architectural plans.
*   **Test Coverage**: High unit and integration test coverage for all implemented features.
*   **CI/CD Pipeline**: Implementation of automated testing and deployment pipelines.
*   **Containerization**: Dockerizing the application components.
*   **Cloud Deployment**: Successful deployment of later phases to a recognized cloud platform.

### Timeline

*   **Submission Deadline**: December 15, 2025, 11:59 PM PST
*   **Judging Period**: December 16-20, 2025
*   **Results Announcement**: December 22, 2025

### Submission Requirements

*   **GitHub Repository**: A publicly accessible and well-organized GitHub repository containing all project code and documentation.
*   **README.md**: A comprehensive `README.md` file (this document) with setup instructions, project overview, phase details, and hackathon specifics.
*   **Video Demo**: A 5-minute video demonstrating the functionality and key features of the application, particularly highlighting the evolution across phases.
*   **Project Report**: A detailed report documenting the project's architecture, challenges faced, solutions implemented, and future plans.

### Resources

*   **Core Tools**:
    *   Python 3.13+
    *   UV (Python package installer and resolver)
    *   Git and GitHub for version control and collaboration
    *   (Further tools will be introduced in later phases)
*   **Infrastructure**:
    *   Local development environment (WSL 2 highly recommended for Windows users)
    *   Cloud platform (e.g., AWS, GCP, Azure) for Phase V deployment

## Frequently Asked Questions (FAQ)

This section addresses common inquiries about the "Evolution of Todo" project, its setup, and basic usage.

**Q: What is the primary goal of the "Evolution of Todo" project?**
A: The project aims to demonstrate the development of a Todo application across five distinct phases, showcasing different architectural patterns, technologies, and deployment strategies.

**Q: How do I run Phase I of the application?**
A: Please refer to the "Getting Started & Development Setup" section above for detailed instructions on setting up your environment and running the Python console application.

**Q: What operating systems are supported for Phase I?**
A: Phase I is designed for Linux-like environments, with specific guidance provided for Windows users leveraging WSL 2 (Windows Subsystem for Linux).

**Q: Where can I find the official Hackathon II document?**
A: A link to the official Hackathon II document will be provided in the "Resources" section for detailed rules and guidelines.

**Q: Can I contribute to this project?**
A: Absolutely! We welcome contributions. Please review the project's `CONTRIBUTING.md` (to be created in a future phase) and current `README.md` for guidelines.
