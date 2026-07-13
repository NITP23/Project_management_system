# Academic Project Management System

## 📌 Overview
An end-to-end Academic Project Management System designed to streamline the workflow between students, teachers (supervisors), and administrators. It provides a centralized platform for managing project submissions, supervisor allocations, deadlines, and notifications.

## 🚀 Features
- **Role-Based Access Control (RBAC):** Dedicated dashboards and interfaces for Admins, Teachers, and Students.
- **Student Dashboard:** Propose projects, request supervisors, track project status, and view upcoming deadlines.
- **Teacher Dashboard:** Accept/reject supervisor requests, manage student projects, track progress, and review submissions.
- **Admin Dashboard:** Oversee all platform activities, manage users, and configure system-wide settings.
- **Project & Deadline Management:** Keep track of important dates, milestones, and project details (`deadline`, `project` models).
- **Notifications & Alerts:** Real-time system notifications and email alerts using Nodemailer.
- **File & Media Handling:** Secure file attachment and storage using Cloudinary and Multer.

## 💻 Tech Stack
**Frontend:**
- **Core:** React 19 (built with Vite)
- **Styling:** Tailwind CSS
- **State Management:** Redux Toolkit & React-Redux
- **Data Fetching:** React Query (@tanstack/react-query) & Axios
- **Routing:** React Router v7
- **UI Components & Charts:** Lucide React, Recharts
- **Notifications:** React Toastify

**Backend:**
- **Core:** Node.js & Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens (JWT) & bcrypt
- **File Storage:** Cloudinary & Multer
- **Email Services:** Nodemailer

## 📁 Project Structure
```text
Project_management_system/
├── Backend/                 # Express.js backend API
│   ├── src/                 
│   │   ├── controllers/     # Route logic
│   │   ├── Models/          # Mongoose schemas (User, Project, Deadline, etc.)
│   │   ├── Router/          # Express routes
│   │   ├── middleWares/     # Custom middlewares (Auth, etc.)
│   │   ├── services/        # Business logic & 3rd party integrations
│   │   └── utils/           # Helper functions
│   └── server.js            # Entry point for backend
│
└── frontend/                # React frontend app
    ├── src/
    │   ├── assets/          # Static files
    │   ├── components/      # Reusable UI components
    │   ├── lib/             # Utility and library configurations
    │   ├── pages/           # Views (admin/, student/, teacher/, auth/)
    │   └── store/           # Redux slices and store setup
    └── App.jsx              # Main React component
```

## 🛠️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) instance (local or Atlas)
- [Cloudinary](https://cloudinary.com/) Account (for file uploads)

### 1. Clone the repository
```bash
git clone <repository-url>
cd Project_management_system
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` directory and add the necessary environment variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
```

Start the backend server:
```bash
# For development (uses nodemon)
npm run dev

# For production
npm start
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```
*(Adjust the API URL based on your backend routing configuration)*

Start the frontend development server:
```bash
npm run dev
```

## 🛡️ Authentication & Security
- **JWT Authentication:** Secure token-based authentication for protected API routes.
- **Password Hashing:** All user passwords are encrypted using `bcrypt` before being saved to the database.
- **Rate Limiting:** API requests are protected using `express-rate-limit`.
- **CORS:** Cross-Origin Resource Sharing is configured to allow secure communication between the frontend and backend.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.
