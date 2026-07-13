# Project Management System

A full-stack project management application built with the **MERN stack** (MongoDB, Express, React, Node.js) to help teams organize, track, and collaborate on projects efficiently.

## Features

- **Project Management**: Create, update, and manage multiple projects
- **Task Tracking**: Organize tasks within projects with priority levels and status tracking
- **Team Collaboration**: Assign tasks to team members and track progress
- **User Authentication**: Secure login and registration with JWT
- **File Upload**: Upload and manage project attachments using Cloudinary
- **Real-time Updates**: Responsive UI with React and Redux state management
- **Email Notifications**: Send project updates via email using Nodemailer
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

### Frontend
- **React** 19.1.1 - UI library
- **Redux Toolkit** - State management
- **React Query** - Data fetching and caching
- **React Router** - Client-side routing
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express** 5.2.1 - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Cloud storage for files
- **Nodemailer** - Email service
- **Multer** - File upload handling

## Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas)
- **Cloudinary Account** (for file uploads)
- **Email Service** (for notifications)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/NITP23/Project_management_system.git
cd Project_management_system
```

2. **Backend Setup**:
```bash
cd Backend
npm install
```

3. **Frontend Setup**:
```bash
cd ../frontend
npm install
```

### Environment Variables

Create a `.env` file in the `Backend` directory:
```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Service
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_email
SMTP_PASS=your_email_password

# Google Cloud Storage (optional)
GCS_PROJECT_ID=your_project_id
GCS_BUCKET_NAME=your_bucket_name
```

Create a `.env.local` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### Running the Application

**Start the Backend**:
```bash
cd Backend
npm run dev
```
The backend will run on `http://localhost:5000`

**Start the Frontend** (in a new terminal):
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173`

## Project Structure

```
Project_management_system/
├── Backend/
│   ├── models/              # MongoDB schemas
│   ├── controllers/         # Request handlers
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   ├── config/              # Configuration files
│   ├── server.js            # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── redux/           # Redux store & slices
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API calls
│   │   ├── styles/          # CSS/Tailwind styles
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## Usage

1. **Create an Account**: Register with your email
2. **Create a Project**: Start a new project with details and team members
3. **Add Tasks**: Create tasks with descriptions, priorities, and deadlines
4. **Assign Tasks**: Assign tasks to team members
5. **Track Progress**: Update task status and monitor project timeline
6. **Upload Files**: Attach relevant documents to projects/tasks
7. **Get Notifications**: Receive email updates on project changes

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
