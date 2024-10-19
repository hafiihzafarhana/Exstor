# What is Exstor?
### Exstor is a website-based application that functions as a File Explorer like Google Drive in the cloud and File Explorer on the desktop

## Tech
### Front-end
```
- React TS using Vite
- Tailwind
- React Router Dom
- Axios
- Sweetalert2
```
### Back-end & Database
```
- Express TS
- PostgreSQL
- Bcrypt
- JWT
- Joi
```

## What are the features?
### - Login
### - Register
### - Logout
### - Get all file (.txt and .docx) and folder
### - Create file (.txt and .docx) and folder
### - Update file (.txt and .docx)
### - Open file (.txt and .docx) and folder
### - Delete file (.txt and .docx) and folder

## Concept
![Digichallenge-Exstor drawio(1)](https://github.com/user-attachments/assets/c8400e1d-024b-47bf-bbd8-b1b92a74929d)

### a) tokens: Stores the user's authenticated token
### b) users: To store valid user data. Only registered users can access the system
### c) items: To save an item (folder or file). Of course, there is a root folder for each user who has registered with the system. So, each root will be separate from the property of other users

## How to start?
The initial setup is database initialization. I prefer to install the database within Docker, rather than using the traditional method of creating the database in the PG Admin application for PostgreSQL.

### Backend
#### Using traditional Setup
```
1) Create database in PG Admin
2) After that the credential into .env
3) Put another credential like:
    - TODO_NODE_ENV
    - TODO_CLIENT_URL
    - TODO_CLUSTER_TYPE
    - TODO_ACCESS_TOKEN_SECRET
    - TODO_REFRESH_TOKEN_SECRET
    - TODO_ACCESS_TOKEN_TIME
    - TODO_REFRESH_TOKEN_TIME
4) npm run dev (Running in port 4002)
```
#### Using Docker
```
1) npm run composeUp
2) After that the credential into .env
3) Put another credential like:
    - TODO_NODE_ENV
    - TODO_CLIENT_URL
    - TODO_CLUSTER_TYPE
    - TODO_ACCESS_TOKEN_SECRET
    - TODO_REFRESH_TOKEN_SECRET
    - TODO_ACCESS_TOKEN_TIME
    - TODO_REFRESH_TOKEN_TIME
4) npm run dev (Running in port 4002)
```

### Front-end
```
The port of backend is 4002

And then

npm run dev (Running in port 3000)
```

## Or export the .sql located in "db/db/file_explorer.sql"
