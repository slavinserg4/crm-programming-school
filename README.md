# CRM Programming School — Backend API


## Tech Stack

- Node.js (v20)
- TypeScript
- Express.js
- MongoDB
- Mongoose
- JWT for authentication
- Joi for validation
- Nodemailer for email sending
- Swagger for API documentation
- Docker & Docker Compose

## Prerequisites

Before running the project, make sure you have:

- Docker
- Docker Compose


### Types of BD
- A database dump in zip format is attached to GitHub, unzip it and use Docker according to the instructions below.
- There is a cloud database:
```
MONGO_URI=mongodb+srv://user:user@node-exam-bd.9spjjgr.mongodb.net/nodejs-exam-db?retryWrites=true&w=majority&appName=node-exam-bd
```
for it you need to remove env.db and in the file docker.compose delete db, and replace mongo_uri in env

## Installation and Running with Docker

1. Clone the repository:

2. Configure environment variables:

Create `.env` file in the project root:
```
PORT=
MONGO_URI=mongodb+srv://user:user@cluster0.vsvnxyt.mongodb.net/ 
its a cloud db



JWT_ACCESS_SECRET=
JWT_ACCESS_LIFETIME=
JWT_REFRESH_SECRET=
JWT_REFRESH_LIFETIME=

JWT_ACTIVATE_SECRET=
JWT_ACTIVATE_LIFETIME=
JWT_RECOVERY_SECRET=
JWT_RECOVERY_LIFETIME=

EMAIL_USER=
EMAIL_PASSWORD=

```
Create `.env.db` file for MongoDB:
```
env
MONGO_INITDB_DATABASE=nodejs-exam-db
MONGO_INITDB_ROOT_USERNAME=your_MONGO_INITDB_ROOT_USERNAME
MONGO_INITDB_ROOT_PASSWORD=_your_MONGO_INITDB_ROOT_PASSWORD
```
4. Install all dependencies
```
cd backend/
npm install
```
3. Run with Docker Compose:
```
bash
# Build and start containers
docker-compose up --build

# Stop containers
docker-compose down
```
The API will be available at `http://localhost:YOUR_PORT"`
MongoDB will be available at `localhost:YOUR_PORT`

## API Documentation (Swagger)
```
http://localhost:5333/docs
```
In Swagger you can:

Explore all API endpoints grouped by modules

Test requests directly in your browser

See request/response bodies, schemas, enums, and examples


