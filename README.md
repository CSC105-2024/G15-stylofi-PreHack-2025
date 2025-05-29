# :pushpin: Stylofi

A fashion-focused social platform similar to Pinterest, where users can discover, share, and organize fashion inspiration. Stylofi leverages Google Cloud Vision API to automatically validate and categorize fashion-related content, ensuring a curated experience for fashion enthusiasts.

## :rocket: Getting Started

Clone the repository:

```bash
git clone https://github.com/CSC105-2024/G15-stylofi-PreHack-2025.git
cd G15-stylofi-PreHack-2025
```

## :hammer: Frontend - React

### :wrench: Tech Stack

- React
- Axios
- React Router DOM
- Tailwind CSS, shadcn/ui
- Other dependencies...

### :rocket: Getting Started - React Client

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The client will be running on <http://localhost:5173>.

## :wrench: Backend - Node.js

### :hammer_and_wrench: Tech Stack

- Node.js
- Hono (Web framework)
- Prisma (Database ORM)
- PostgreSQL / MySQL (Database)
- JWT (Authentication)
- Cloudinary (Image storage)
- Google Cloud Vision API (Image validation)
- Nodemailer (Email service)

### :electric_plug: API Endpoints

#### Authentication Routes (`/auth`)

| Method | Endpoint           | Description                                    |
| ------ | ------------------ | ---------------------------------------------- |
| GET    | /auth/check        | Check authentication status                    |
| POST   | /auth/signup       | Create a new user account                      |
| POST   | /auth/verify-otp   | Verify OTP for account activation              |
| POST   | /auth/resend-otp   | Resend OTP for verification                    |
| POST   | /auth/signin       | Sign in user                                   |
| POST   | /auth/refresh      | Refresh authentication token                   |
| POST   | /auth/signout      | Sign out user                                  |
| GET    | /auth/me           | Get logged-in user information (requires auth) |
| GET    | /auth/username/:id | Get username by user ID                        |
| PUT    | /auth/update       | Update user profile (requires auth)            |
| GET    | /auth/:id          | Get user by ID                                 |

#### Post Routes (`/posts`)

_All post routes require authentication_

| Method | Endpoint               | Description                          |
| ------ | ---------------------- | ------------------------------------ |
| GET    | /posts/                | Get all posts                        |
| GET    | /posts/user            | Get all posts by current user        |
| GET    | /posts/:id             | Get specific post by ID              |
| GET    | /posts/:id/like-status | Check if current user liked the post |
| POST   | /posts/validate-image  | Validate image for post              |
| POST   | /posts/create          | Create a new post                    |
| PUT    | /posts/:id             | Update existing post                 |
| PUT    | /posts/:id/like        | Like a post                          |
| PUT    | /posts/:id/unlike      | Unlike a post                        |
| DELETE | /posts/:id             | Delete a post                        |

### :rocket: Getting Started - Node.js Server

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file and configure the following variables:

```env
# Database Configuration
DATABASE_URL=your_database_url
# Only needed if using Prisma with migrations
SHADOW_DATABASE_URL=your_shadow_database_url

# JWT and Cookie Secrets
JWT_SECRET_KEY=your_jwt_secret_key
SECRET_COOKIE=your_secret_cookie

# Cloudinary Configuration
CLOUD_NAME=your_cloudinary_name
CLOUD_PRESET=your_cloudinary_preset
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

# Google Cloud Vision API
GOOGLE_CLOUD_KEY=your_google_vision_api_key

# Google App Password (for SMTP mailing)
GOOGLE_APP_PASSWORD=your_google_app_password
```

Start the development server:

```bash
npm run dev
```

The server will be running on <http://localhost:3000>
