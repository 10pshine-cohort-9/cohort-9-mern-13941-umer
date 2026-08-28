# Shine Notes App 💡

Shine Notes is a fast, responsive, and easy-to-use notes management application built on the MERN stack. It is designed to provide a distraction-free environment for users to quickly capture ideas, organize tasks, and securely manage their daily thoughts.

## Key Features
- **User Authentication:** Secure signup, login, and session handling using JWT.
- **CRUD Operations:** Create, read, update, and delete notes effortlessly.
- **Pin Notes:** Keep your most important notes pinned at the top of your workspace for quick access.
- **Search & Sort:** Instantly find what you are looking for using the real-time search functionality.
- **Data Portability:** Export your notes to a JSON file and import them back whenever needed.
- **Modern Interface:** Clean UI with pastel-colored note cards and a dedicated sidebar layout.

## Tech Stack
- **Frontend:** React.js, React Router, Axios, Custom CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Real-time Sync:** Socket.io
- **Code Quality Analysis:** SonarQube

## Local Setup & Run Instructions

**1. Clone the repository**
\`\`\`bash
git clone https://github.com/10pshine-cohort-9/cohort-9-mern-13941-umer.git
cd cohort-9-mern-13941-umer
\`\`\`

**2. Backend Setup**
Open your terminal and navigate to the backend directory:
\`\`\`bash
cd backend
npm install
\`\`\`
Create a `.env` file inside the `backend` folder and add your environment variables (e.g., `MONGO_URI`, `JWT_SECRET`, and `PORT`).
Start the server:
\`\`\`bash
npm run dev
\`\`\`

**3. Frontend Setup**
Open a new terminal window and navigate to the frontend directory:
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
The application will start on `http://localhost:5173`. Open this address in your browser to start using Shine Notes.