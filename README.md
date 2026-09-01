# Shine Notes App 💡

Shine Notes is a comprehensive full-stack notes management web application developed as part of the **10Pearls Shine Program (Cohort 9)**. It provides a secure and distraction-free environment for users to create, edit, manage, and organize their daily tasks and thoughts.

## 🚀 Key Features

### Core Functionalities
- **User Authentication & Authorization:** Secure user registration, login, and logout functionalities using JSON Web Tokens (JWT). Notes are strictly associated with authenticated users.
- **Note Management (CRUD):** Users can seamlessly create, read, update, and delete notes. 
- **Rich Text Editing:** Integrated editor to format notes effectively and provide a better user experience.

### Advanced Features (Optional Modules Implemented)
- **Real-time Updates (Socket.IO):** Instant real-time synchronization of notes data across sessions using Socket.IO.
- **Import/Export Data:** Users can easily export their notes to a local JSON file or import notes directly into the application.
- **Search & Filter:** Dynamic search bar and filtering functionality to quickly locate specific notes from the dashboard.

### Robust Architecture & Quality
- **Application Logging:** Centralized logging implemented using **Pino Logger**. Logs important events, HTTP requests/responses, errors, and user activities.
- **Global Exception Handling:** Custom middleware to catch unhandled errors gracefully and send meaningful, standard HTTP responses to the client while logging the exceptions via Pino.
- **Code Quality Analysis:** Integrated with **SonarQube** (via Docker) for static code analysis, identifying bugs, vulnerabilities, and code smells.
- **Unit Testing:** Comprehensive test suites built for both backend and frontend to ensure maximum code reliability.

## 🛠️ Technology Stack

**Frontend:**
- **React.js:** Interactive user interface and dashboard layout.
- **Jest:** For frontend unit testing and coverage reporting.
- **Axios & CSS3:** For API communication and custom styling.

**Backend:**
- **Node.js & Express.js:** RESTful API architecture.
- **MySQL:** Relational database for storing user profiles and note data.
- **Mocha & Chai:** Backend unit testing framework.
- **Pino Logger:** High-speed application logging.
- **Socket.IO:** WebSocket communication.

## ⚙️ Local Setup & Run Instructions

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MySQL](https://www.mysql.com/) server running locally
- [Docker](https://www.docker.com/) (Optional: required only for local SonarQube scanning)

### 2. Clone the Repository
```bash
git clone https://github.com/10pshine-cohort-9/cohort-9-mern-13941-umer.git
cd cohort-9-mern-13941-umer
```

### 3. Database Setup (MySQL)

1. Open your MySQL client (e.g., MySQL Workbench).
2. Create a new database: `CREATE DATABASE notes_app;`
3. The application will automatically connect to this database based on the environment variables. Ensure your user schema (`users`) and notes schema (`notes`) are properly aligned with the models.

### 4. Backend Setup

Open a terminal and navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder and add the following keys:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=notes_app
JWT_SECRET=your_super_secret_key
PORT=5000
```

Start the backend server:

```bash
npm run dev
```

*(The backend runs on http://localhost:5000)*

### 5. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

*(The frontend runs on http://localhost:5173)*

## 🧪 Testing Guidelines

**Backend Tests (Mocha/Chai):**

```bash
cd backend
npm test
```

**Frontend Tests (Jest):**

```bash
cd frontend
npm test -- --coverage
```

## 📊 SonarQube Code Analysis

To run a local code quality scan:

1. Ensure Docker is running.
2. Run the SonarQube container: `docker run -d --name sonarqube -p 9000:9000 sonarqube:lts-community`
3. Open `http://localhost:9000` (admin/admin), create a local project, and generate a token.
4. From the root of the project, run the scanner: `npx sonar-scanner -Dsonar.login=YOUR_GENERATED_TOKEN`

## 🔌 Core API Endpoints

| Endpoint | Method | Description | Access |
| --- | --- | --- | --- |
| `/api/auth/signup` | POST | Register a new user | Public |
| `/api/auth/login` | POST | Authenticate user & receive JWT | Public |
| `/api/notes` | GET | Fetch all notes for logged-in user | Private (JWT) |
| `/api/notes` | POST | Create a new note | Private (JWT) |
| `/api/notes/:id` | PUT | Update an existing note | Private (JWT) |
| `/api/notes/:id` | DELETE | Delete a specific note | Private (JWT) |
| `/api/notes/export` | GET | Export notes to JSON | Private (JWT) |
| `/api/notes/import` | POST | Import notes from JSON | Private (JWT) |