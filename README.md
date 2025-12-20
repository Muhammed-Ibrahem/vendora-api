# E-Commerce API – Node.js + Express + TypeScript (Vendora)

A scalable, production-ready e-commerce backend built with modern backend engineering best practices.  
This project demonstrates clean architecture, dependency injection, modular design, and real-world business logic.

---

## Overview

This project is an ecommerce backend API designed with Clean Architecture.
The business logic is fully decoupled from frameworks, databases, and external services.

Key goals:

- Independent business rules
- Framework-agnostic domain logic
- Clear boundaries between layers
- Predictable and deterministic APIs

---

## Architecture

The system follows Clean Architecture, inspired by Robert C. Martin.

Dependency rule:
Source code dependencies always point inward.

Infrastructure -> Application -> Domain

Outer layers depend on inner layers.
Inner layers never depend on outer layers.
Communication happens via interfaces and DTOs.

---

## Project Structure

---

## Core Principles

- Domain is pure

  - No framework imports
  - No database knowledge
  - No decorators or DI containers

- Application layer orchestrates

  - Use-cases coordinate business rules
  - Depends only on Domain abstractions

- Infrastructure is replaceable

  - Express, database, ORM, and DI live here
  - Implements interfaces defined inward

- DTOs are boundary-specific
  - Input DTOs for incoming requests
  - Output DTOs for external responses
  - Domain entities are never exposed directly

---

## Tech Stack

- Language: TypeScript
- Runtime: Node.js
- Framework: Express
- Validation: Zod
- Dependency Injection: Manual / Container-based
- Database: MySQL
- Testing: Jest

---

## Getting Started

Prerequisites:

- Docker
- Docker Compose

---

## Environment Variables

```bash
NODE_ENV=
PORT=

DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
```

---

## Running the Project

```bash
# FOR DEVELOPMENT
make dev
# OR
docker compose -f compose.yml -f compose.development.yml up
```

```bash
# FOR PRODUCTION
make production
# OR
docker compose -f compose.yml -f compose.production.yml up --build
```

---

## API Design

- RESTful conventions
- Deterministic responses
- Proper HTTP status codes
- No leaking of domain entities
- Pagination, filtering, and sorting supported

---

## Testing

- Unit tests for domain logic
- Use-case tests with mocked repositories
- No framework required to test core business rules

---

## License

NOLICENSE
