# EgytalChallenge Documentation

this is a quick demo of how to start and test the components

## 🛠 Technology Stack

- **Backend**: NestJS
- **Frontend**: Vue.js
- **Databases**:
  - PostgreSQL (app main database)
  - PostgreSQL (SQL Task database)
  - DynamoDB (NoSQL Task database)
- **Tools**:
  - MySQL Workbench (for database design)
  - NoSQL Workbench (for DynamoDB modeling)
  - Docker & Docker Desktop (for containerization)
  - PgAdmin (for PostgreSQL management)

## 📦 Database Design & Queries Task Files To Import

The repository includes self-contained files with complete database schemas and example queries:

- `LMS_Dump_SelfContainedFile` - MYSQL database schema and sample data
- `LMS_Dynmo_SingleTableDesign` - DynamoDB single-table design implementation

## 🚀 Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- Git

### Installation & Setup

Follow these steps to get the application running on your local machine:

```bash
# Clone the repository
$ git clone https://github.com/omar-anas/EgytalChallenge

# Navigate to project directory
$ cd EgytalChallenge

# Build and start all containers
$ docker-compose up --build
```

This command starts:

- PostgreSQL database on port 5432
- NestJS backend API on port 5000
- PgAdmin interface on port 5050

### Accessing Components

- 🖥️ **Frontend**: http://localhost:8080
- 🔌 **Backend API**: http://localhost:5000
- 📊 **PgAdmin**: http://localhost:5050
  - Email: admin@admin.com
  - Password: pgadmin4

## 📝 Testing Notes

- I Included .env files in this repo for the ease of testing
- please provide a feedback and contact me if anything went wrong

## 🛑 Stopping the Application

To stop and remove all resources:

```bash
$ docker-compose down
```

To stop and remove all resources including volumes (will delete database data):

```bash
$ docker-compose down -v
```
