# Pagination Service

This is the repository for the Pagination Service.

## Getting Started

### Installation Instructions

1. Clone the repository:

```bash
git clone https://github.com/raman2798/pagination-service.git

cd pagination-service
```

2. Install node and npm

3. Install dependencies:

```
npm install
```

4. Set the environment variables:

```bash
cp .env.sample .env

# Open .env and modify the environment variables if needed
```

5. Run all migrations:

```bash
npm run migrate
```

### To insert sample data in db

To seed data in db:

```bash
npm run seed
```

### Starting the Server

To start the server:

```bash
npm run start
```

## Project Structure

```
src/
 |--config/             # Environment variables and configuration related things
 |--controllers/        # All types of controllers (controller layer)
 |--middlewares/        # All types of Middlewares (middleware layer)
 |--migrations/         # All types of Migrations
 |--models/             # All types of Models
 |--routes/             # All types of Routes (routes layer)
 |--seeders/            # All types of Seeders
 |--services/           # All types of Services
 |--utilities/          # All types of utilities
 |--validators/         # All types of validators
 |--index.ts            # App entry point
```
