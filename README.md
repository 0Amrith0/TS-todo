# Highway_Delite

A fullstack MERN application with TypeScript, Express, MongoDB, and React (Vite).  
This project contains both the **backend** (Express + MongoDB) and the **frontend** (React + Vite) inside one repository.


Highway_Delite/
│
├── backend/ # Backend (Node.js + Express + MongoDB)
│ ├── src/ # TypeScript source files
│ ├── dist/ # Compiled JS (after build)
│ ├── package.json
│
├── frontend/ # Frontend (React + Vite + TypeScript)
│ ├── src/ # React components & pages
│ ├── dist/ # Production build output
│ ├── package.json
│
└── README.md # This file


## 🚀 Setup Instructions

1. Clone the Repository
```bash
git clone https://github.com/your-username/Highway_Delite.git
cd Highway_Delite

2. backend setup
cd backend
npm install

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development

npm run dev
npm run build
npm start

3. frontend setup
cd frontend
npm install

npm run dev
npm run build



