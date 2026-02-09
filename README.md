# Auth Social App - Full Stack Application

A complete full-stack web application with Node.js/Express/MongoDB backend and React frontend featuring JWT authentication, email verification, password reset, and role-based access control.

## Features

### Authentication
- User registration with email verification
- JWT-based authentication
- Password reset via email
- Role-based access control (user, monitor, admin)
- Protected routes

### Social Features
- Create and view threads
- Follow/unfollow users
- Private account support with follow requests
- Notifications system
- Like threads

### Tech Stack

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- bcrypt for password hashing
- Nodemailer for email services
- Express validation

**Frontend:**
- React 18
- React Router
- Axios for API calls
- Context API for state management
- Vite for development

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB installed and running
- Gmail account with app password for email services

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/auth-social-app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

4. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

## Usage

1. **Register**: Create a new account with email, password, and role
2. **Email Verification**: Check your email and click the verification link
3. **Login**: Use your credentials to log in
4. **Role-based Redirects**: 
   - Users → User Home (with social features)
   - Monitors → Monitor Home
   - Admins → Admin Home
5. **Social Features**: Create threads, follow users, like posts
6. **Password Reset**: Use forgot password link to reset via email

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `GET /api/auth/verify-email` - Verify email
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout
- `POST /api/auth/forgot-password` - Request password reset
- `GET /api/auth/reset-password` - Validate reset token
- `POST /api/auth/reset-password` - Reset password

### Threads
- `POST /api/threads` - Create thread
- `GET /api/threads` - Get threads
- `POST /api/threads/:id/like` - Like thread

### Follow
- `POST /api/users/:id/follow` - Follow user
- `DELETE /api/users/:id/follow` - Unfollow user
- `GET /api/users/:id/followers` - Get followers
- `GET /api/users/:id/following` - Get following
- `PUT /api/users/requests/:id/accept` - Accept follow request

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

## Email Configuration

For Gmail SMTP:
1. Enable 2-factor authentication on your Gmail account
2. Generate an app password: Google Account → Security → App Passwords
3. Use the app password in the `EMAIL_PASS` environment variable

## Database Schema

### User
- email (unique, required)
- password (hashed)
- role (user/monitor/admin)
- isVerified (boolean)
- isPrivate (boolean)
- bio (string)
- avatar (string)
- createdAt (date)

### Additional Models
- EmailVerificationToken
- PasswordResetToken
- Thread
- Follow
- Notification

## Development

The application runs on:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000
- API Health Check: http://localhost:5000/api/health

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting
- Input validation
- CORS configuration
- Helmet security headers
# RedFeedsBackend
