# Shine Notes App 💡

Shine Notes is a simple, modern, and fully responsive notes management application built with the MERN stack. It provides a distraction-free workspace for users to capture ideas, manage tasks, and organize their daily thoughts securely.

## Features

- **User Authentication:** Secure signup and login using JWT.
- **CRUD Operations:** Create, read, update, and delete notes effortlessly.
- **Pin Important Notes:** Keep your most important notes at the top for quick access.
- **Search & Sort:** Easily find specific notes using the search bar and automatic sorting.
- **Data Portability:** Import and export your notes in JSON format.
- **Modern UI/UX:** Clean dashboard with a dedicated sidebar and pastel-colored note cards.

## Tech Stack Used

- **Frontend:** React.js, React Router, Axios, CSS3
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Real-time Updates:** Socket.io
- **Code Quality:** SonarQube

## How to Run Locally

1. **Clone the repository:**
   `git clone https://github.com/10pshine-cohort-9/cohort-9-mern-13941-umer.git`

2. **Setup Backend:**
   - Navigate to the backend folder: `cd backend`
   - Install dependencies: `npm install`
   - Create a `.env` file and add your `MONGO_URI` and `JWT_SECRET`.
   - Start the server: `npm run dev`

3. **Setup Frontend:**
   - Open a new terminal and navigate to the frontend folder: `cd frontend`
   - Install dependencies: `npm install`
   - Start the React app: `npm run dev`

4. Open your browser and go to `http://localhost:5173` to start using the app.