# AccessMend

### Prove the flaw. Repair access. Verify the fix.

**AccessMend** is a cybersecurity project designed to demonstrate and repair broken document-level authorization. It identifies when an authenticated user can access another user's private document, proposes a minimal repair, requires human approval, and verifies that the repair works without breaking legitimate access.

Built for **HACK ON TRACK — Round 1 | Problem Statement 1: The Verified Fix**.

---

## Table of Contents

- [The Problem](#the-problem)
- [Our Solution](#our-solution)
- [How It Works](#how-it-works)
- [Key Features](#key-features)
- [Demo Scenario](#demo-scenario)
- [Authorization Policy](#authorization-policy)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
- [Testing and Verification](#testing-and-verification)
- [AI Integration](#ai-integration)
- [Project Scope and Limitations](#project-scope-and-limitations)
- [Future Enhancements](#future-enhancements)
- [Project Status](#project-status)

---

## The Problem

Imagine a document portal where students can access their marksheets.

Alice owns `doc-101`, and Bob owns `doc-202`. Due to an authorization bug, Bob can change a document ID and access Alice's private marksheet.

The application checks whether Bob is logged in but fails to check whether he has permission to read Alice's document.

This is an **authorization failure**, commonly associated with Broken Object-Level Authorization (BOLA) or Insecure Direct Object Reference (IDOR).

A security fix must do more than block unauthorized users. It must also preserve legitimate access for document owners and administrators.

## Our Solution

AccessMend provides a controlled environment for demonstrating the complete security remediation process.

Instead of simply reporting a vulnerability, it connects the security finding to a proposed repair, human approval, and repeatable verification.

**Core workflow:**

`Prove → Explain → Propose Repair → Approve → Verify`

The goal is to demonstrate two outcomes:

- Unauthorized users can no longer access private documents.
- Authorized users can still access the documents they are permitted to read.

## How It Works

### 1. Prove the vulnerability

In Vulnerable Mode, Bob requests Alice's document. The application incorrectly returns `200 OK` and exposes the fictional document content.

AccessMend records the expected and actual behavior.

### 2. Explain the failure

The application explains that login verification alone is insufficient. The missing check is whether the requesting user owns the document or has administrator privileges.

### 3. Propose a minimal repair

AccessMend presents a repair recommendation that enforces the owner-or-admin policy before returning private content.

### 4. Require human approval

A reviewer examines the proposed change and explicitly approves or rejects it.

The repair must not be silently activated without approval.

### 5. Verify the repair

In Repaired Mode, AccessMend reruns the defined authorization tests. It checks that unauthorized access is denied while valid owner and administrator access remains available.

---

## Key Features

- **Controlled vulnerability demonstration:** Reproduce a document-level authorization failure using fictional data.
- **Request simulator:** Select a demo identity and document to inspect access behavior.
- **Authorization test suite:** Execute six defined access-control and error-handling cases.
- **Content-leak detection:** Identify when a supposedly unauthorized response exposes private content.
- **Readable diagnosis:** Explain the difference between authentication and authorization.
- **Minimal repair recommendation:** Present the intended owner-or-admin access rule.
- **Human approval:** Require explicit review before activating the repair.
- **Before-and-after verification:** Compare behavior before and after the repair.
- **Regression testing:** Confirm that legitimate access continues to work.
- **Demo reset:** Restore Vulnerable Mode and clear the current test evidence.
- **Honest verification boundaries:** Clearly communicate what the defined tests do and do not prove.

## Demo Scenario

The prototype uses fictional identities and documents.

| Entity    | Description                                      |
| --------- | ------------------------------------------------ |
| Alice     | Normal user who owns `doc-101`                   |
| Bob       | Normal user who owns `doc-202`                   |
| Admin     | Administrator who can read any existing document |
| `doc-101` | Fictional private document owned by Alice        |
| `doc-202` | Fictional private document owned by Bob          |

### Before the repair

Bob requests Alice's document.

```text
User: Bob
Document: doc-101
Expected: 403 Forbidden
Actual:   200 OK
Result:   FAIL — unauthorized content exposed
```

### After the repair

The same request is evaluated again.

```text
User: Bob
Document: doc-101
Expected: 403 Forbidden
Actual:   403 Forbidden
Result:   PASS — access denied, no private content
```

Meanwhile, Alice and Admin retain their legitimate access.

## Authorization Policy

AccessMend follows a simple, explicit policy.

| Request                           | Expected HTTP status | Expected outcome |
| --------------------------------- | -------------------: | ---------------- |
| Alice reads `doc-101`             |                  200 | Allowed          |
| Bob reads `doc-202`               |                  200 | Allowed          |
| Bob reads `doc-101`               |                  403 | Denied           |
| Admin reads `doc-101`             |                  200 | Allowed          |
| Anonymous user reads `doc-101`    |                  401 | Denied           |
| Alice requests a missing document |                  404 | Not found        |

The authorization decision must be enforced by the backend before private document content is returned.

Denied responses must never contain private document content.

## Technology Stack

The proposed Version 1 architecture uses the following technologies.

| Technology                           | Purpose                                             |
| ------------------------------------ | --------------------------------------------------- |
| Python 3                             | Backend programming language                        |
| FastAPI                              | Backend web framework and API routes                |
| Uvicorn                              | Local application server                            |
| Jinja2                               | Server-rendered HTML templates                      |
| HTML and CSS                         | Interface structure and styling                     |
| Vanilla JavaScript                   | Interactive frontend behavior                       |
| pytest                               | Automated acceptance and regression tests           |
| In-memory dictionaries               | Temporary fictional users and document data         |
| SQLite (optional)                    | Lightweight persistence for a future iteration      |
| Gemini or another LLM API (optional) | Future AI-assisted diagnosis and repair suggestions |

This is the proposed stack documented in the technical requirements. If the implementation uses a different frontend or backend, update this section to match the actual repository.

## System Architecture

The proposed application flow is:

```text
              Browser Interface
                     |
                     v
               FastAPI Server
                     |
                     v
          Authorization Service
                     |
                     v
          Fictional Document Data
                     ^
                     |
          Automated Test Runner
                     |
                     v
          Expected vs Actual Results
```

A separate repair recommendation component uses the failed test and intended access policy to produce a constrained suggestion.

Once approved, the prototype switches to Repaired Mode and reruns the tests.

### Suggested project structure

```text
AccessMend/
├── app/
│   ├── main.py
│   ├── security.py
│   ├── test_runner.py
│   ├── patch_service.py
│   ├── templates/
│   └── static/
├── tests/
│   └── test_authorization.py
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```

This is a suggested structure, not a claim that every file already exists. Adapt it to the actual project.

## Getting Started

### Prerequisites

- Python 3.10 or a compatible Python version.
- pip.
- A code editor such as Visual Studio Code.
- A terminal.

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd AccessMend
```

Replace `<your-repository-url>` with your actual repository URL.

### 2. Create a virtual environment

**Windows PowerShell:**

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**Windows Command Prompt:**

```bat
python -m venv .venv
.venv\Scripts\activate.bat
```

### 3. Install dependencies

If `requirements.txt` exists:

```bash
pip install -r requirements.txt
```

Otherwise, for the proposed FastAPI stack:

```bash
pip install fastapi uvicorn jinja2 pytest
```

Install any additional dependencies required by the actual implementation.

### 4. Start the application

If the FastAPI application is located at `app/main.py` and exposes an `app` object:

```bash
uvicorn app.main:app --reload
```

Open the local URL shown in the terminal, typically:

```text
http://127.0.0.1:8000
```

The commands above assume the proposed project structure. Adjust the module path and setup steps if your repository differs.

### 5. Run the tests

If pytest tests are implemented:

```bash
pytest -v
```

For the in-app authorization test runner, open the dashboard and select **Run Security Tests**.

Do not treat a successful application startup as proof that all features or security tests are working.

## Testing and Verification

The six defined cases evaluate both security enforcement and preservation of legitimate access.

In Vulnerable Mode, the Bob-to-Alice request should fail the intended policy, while the other defined cases should behave as specified.

In Repaired Mode, all six cases should pass.

The test runner should report:

- Test name and acting identity.
- Requested document.
- Expected HTTP status.
- Actual HTTP status.
- PASS or FAIL.
- Whether private content was exposed.
- Current application mode.

### Success criteria

1. The unauthorized document access is reproduced in the controlled vulnerable environment.
2. The repair changes the unauthorized request to `403 Forbidden`.
3. Denied responses contain no private document content.
4. Owner and administrator access remain functional.
5. Anonymous and missing-document behavior remain correct.
6. Results reflect actual executions rather than hardcoded success messages.

## AI Integration

AccessMend is designed to support optional AI-assisted diagnosis and repair recommendations.

**AI integration is pending unless it has been implemented and tested in the current version.**

Version 1 can use a deterministic, rule-based recommendation so the core workflow does not depend on an external AI service or API key.

A future AI module may receive limited code context, the intended authorization policy, and failed-test evidence. It may then return:

- A plain-language diagnosis.
- A minimal proposed code change.
- Relevant assumptions.
- Tests that should be rerun.

AI-generated output must be reviewed and validated. It must never activate a repair without human approval.

Any API key must remain on the backend and must not be committed to version control.

## Project Scope and Limitations

AccessMend Version 1 is a controlled, local demonstration.

**Included in the intended scope:**

- Fictional users and documents.
- A deliberately vulnerable mode.
- A constrained owner-or-admin authorization policy.
- Six defined test cases.
- A repair approval workflow.
- Before-and-after verification.

**Outside the intended scope:**

- Scanning arbitrary websites or external targets.
- Production-grade authentication.
- Autonomous deployment of security patches.
- Universal vulnerability detection.
- Certification that an entire application is secure.

Demo authentication is not production authentication.

Passing six defined tests demonstrates expected behavior for those cases only. Production deployment would require broader security testing, proper authentication, code review, integration testing, and additional safeguards.

## Future Enhancements

Potential improvements include:

- A configurable role- and attribute-based policy editor.
- Shared documents and multi-tenant access boundaries.
- CSV/JSON authorization-matrix import and export.
- Patch diff review, rollback, and audit trails.
- Isolated patch testing.
- Static-analysis and source-control integrations.
- AI-assisted code analysis with explicit assumptions and review.
- Production authentication and persistent storage.

These are future possibilities, not necessarily completed features.

## Project Status

AccessMend is scoped as a hackathon prototype for demonstrating verifiable authorization remediation.

The project is complete only to the extent that the corresponding features have actually been implemented and tested. Update this README as development progresses, and distinguish planned functionality from verified functionality.

---

## Final Note

**AccessMend connects a security finding to a reviewable repair and repeatable evidence.**

Its central goal is simple: block unauthorized access without breaking legitimate access.

_Prove the flaw. Repair access. Verify the fix._
