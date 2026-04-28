# BF6 Dashboard - Battlefield 6 Statistics Tracker

A full-stack web application to track and analyze Battlefield 6 player statistics with admin user management capabilities.

## 🎯 Features

### Dashboard
- **Overall Statistics**: Kill/Death ratio, Win rate, Average score
- **Recent Performance**: Stats for last 10 matches
- **Map Analysis**: Top 3 maps by K/D ratio (minimum 3 matches)
- **Visual Analytics**: Interactive charts for performance trends
- **Match History**: Complete list of all matches with filtering

### User Management (Admin)
- Create new users
- Edit user profiles (username, email, role)
- Delete users (except self)
- Search and filter users
- Role-based access control (User/Admin)

### Security
- User authentication with bcrypt password hashing
- Session management with secure cookies
- Input validation for all forms
- Admin-only protected routes
- CORS configuration
- Prevent unauthorized access to other users' data

## 🛠️ Tech Stack

**Backend:**
- Node.js with Express
- MongoDB with Mongoose ODM
- bcrypt for password hashing
- Express-session for authentication

**Frontend:**
- EJS templating engine
- HTML5/CSS3
- Chart.js for data visualization
- Vanilla JavaScript

**Tools:**
- nodemon for development
- dotenv for environment configuration

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🚀 Installation

1. **Clone repository**
   ```bash
   git clone https://github.com/your-username/bf6-dashboard.git
   cd bf6-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Configure .env**
   ```
   PORT=3000
   IP=127.0.0.1
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=ProjectName
   SESSION_SECRET=your-secure-random-string-here
   CORS_ORIGIN=http://localhost:3000
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   Or production:
   ```bash
   npm run serve
   ```

6. **Access application**
   ```
   http://localhost:3000
   ```

## 📊 Project Structure

```
bf6-dashboard/
├── models/                 # Mongoose schemas
│   ├── User.js
│   └── Match.js
├── routes/                 # API routes
│   ├── userRoutes.js      # Auth & registration
│   ├── adminRoutes.js     # Admin management
│   ├── matchRoutes.js     # Match CRUD operations
│   └── dashboardRoutes.js # Dashboard views
├── utils/                  # Helper functions
│   ├── authMiddleware.js  # Authentication/authorization
│   └── dashboardUtils.js  # Statistics calculations
├── views/                  # EJS templates
│   ├── index.ejs          # Main dashboard
│   ├── admin.ejs          # Admin panel
│   ├── login.ejs          # Login page
│   └── register.ejs       # Registration page
├── partials/              # Reusable components
│   ├── addUserModal.ejs
│   ├── editUserModal.ejs
│   └── deleteUserModal.ejs
├── public/                # Static assets
│   ├── css/               # Stylesheets
│   └── js/                # Client-side scripts
├── server.js              # Main application file
├── package.json           # Dependencies
└── sampleData.js          # Data generation script
```

## 🔐 Security Features

### Authentication & Authorization
- Passwords hashed with bcrypt (10 salt rounds)
- Session-based authentication
- Automatic session expiry after 24 hours
- Admin-only routes protected with middleware
- Users can only access their own data

### Input Validation
- Email validation using regex: `^\S+@\S+\.\S+$`
- Type checking for all numeric fields
- Required field validation
- Duplicate username/email prevention
- Role enum restriction (user/admin only)

### API Security
- CORS configured for allowed origins
- Proper HTTP status codes
- No sensitive data in responses
- Session secret required (process exits if missing)

## 📁 Database Schema

### User Model
```javascript
{
  username: String (unique, required),
  email: String (unique, required, regex validated),
  password: String (hashed, required),
  role: String (enum: ["user", "admin"], default: "user")
}
```

### Match Model
```javascript
{
  score: Number,
  kills: Number,
  deaths: Number,
  map: String,
  mode: String,
  win: Boolean,
  user: ObjectId (reference to User),
  date: Date (default: now)
}
```

## 🧮 Statistics Calculations

### K/D Ratio
```
Kills / Deaths (rounded to 2 decimals)
```

### Win Rate
```
(Wins / Total Matches) * 100 (percentage)
```

### Average Score
```
Total Score / Total Matches (rounded to nearest integer)
```

### Top Maps
- Filtered to maps with minimum 3 matches
- Sorted by K/D ratio descending
- Top 3 displayed

## 🔌 API Endpoints

### Authentication
- `GET /register` - Registration page
- `POST /register` - Create new user
- `GET /login` - Login page
- `POST /login` - Verify credentials
- `GET /logout` - Destroy session

### Matches
- `GET /matches/` - Get all user matches (authenticated)
- `GET /matches/:id` - Get specific match (authenticated)
- `POST /matches/` - Create new match (authenticated)
- `PUT /matches/:id` - Update match (authenticated)
- `DELETE /matches/:id` - Delete match (authenticated)

### Admin
- `GET /admin` - Admin panel (admin only)
- `GET /users/:id` - Get user details (admin only)
- `PUT /users/:id` - Update user (admin only)
- `DELETE /users/:id` - Delete user (admin only)

### Dashboard
- `GET /` - Main dashboard (authenticated)

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| IP | Server IP address | 127.0.0.1 |
| MONGODB_URI | MongoDB connection string | mongodb+srv://... |
| SESSION_SECRET | Secret for session encryption | random-string-here |
| CORS_ORIGIN | Allowed origin for CORS | http://localhost:3000 |

## 🧪 Sample Data

Generate test data:
```bash
node sampleData.js
```

Creates 150 sample matches with random:
- Maps and game modes
- Kill/Death/Score values
- Win/loss outcomes
- Dates between Feb 23 - Mar 13, 2026

## 🚀 Deployment

### Production Checklist
- [ ] Set strong `SESSION_SECRET` (min 32 characters)
- [ ] Update `CORS_ORIGIN` to production domain
- [ ] Use environment-specific `.env` file
- [ ] Configure MongoDB Atlas security/IP whitelist
- [ ] Use HTTPS in production
- [ ] Set `NODE_ENV=production`
- [ ] Enable session encryption
- [ ] Configure proper logging
- [ ] Set up error monitoring

### Recommended Hosting
- Render, Railway, or Heroku for Node.js backend
- MongoDB Atlas for database
- CloudFlare for DNS/SSL

## 🐛 Error Handling

- Proper HTTP status codes (400, 401, 403, 404, 500)
- Detailed error messages for debugging
- Console logging for server errors
- User-friendly frontend error display

## 📚 Learning Outcomes

This project demonstrates:
- Full-stack web development
- RESTful API design
- Session-based authentication
- Database modeling with MongoDB
- Input validation & security
- Admin role-based access control
- Frontend-backend integration
- Data visualization
- ES6 modules

## 👨‍💻 Author

Created as a portfolio project for educational purposes.

## 📄 License

ISC

## 🙌 Acknowledgments

- Chart.js for visualization library
- Bootstrap for styling inspiration
- MongoDB for database
- Express.js community


