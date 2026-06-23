# CashPilot - Treasury & Cash Management Platform

## Overview
CashPilot is a modern treasury and cash management platform designed to help businesses track, control, and optimize their cash flow through invoices, payments, and financial records.

**Current Status**: In active development (MVP Phase)

---

## Current Progress (as of June 23, 2026)

### ✅ Completed
- **Project Structure**: Feature-based modular architecture
- **Domain Modeling**: Core entities (`Company`, `Customer`, `Invoice`, `Payment`, `LedgerEntry`)
- **Database Schema**: PostgreSQL with Flyway migrations
- **Backend Setup**: Spring Boot 3 + Java 21
- **Entities & Enums**: `InvoiceStatus`, `LedgerEntryType`, general status fields
- **Docker Setup**: 
  - `docker-compose.yml` for PostgreSQL + Backend
  - Multi-stage `Dockerfile`
- **Configuration**: `.env` support + Flyway integration
- **Database**: Initial schema migration (`V1__Initial_Schema.sql`)

### 🚧 In Progress
- Repository, Service, and Controller layers
- Business logic implementation
- API endpoints
- Authentication & Authorization

---

## Tech Stack
- **Backend**: Java 21 + Spring Boot 3
- **Database**: PostgreSQL + Flyway
- **Containerization**: Docker + Docker Compose
- **Build Tool**: Maven

---

## How to Run Locally

### Using Docker (Recommended)

```bash
# 1. Go to project root
cd CashPilot

# 2. Start all services
docker compose up --build -d




