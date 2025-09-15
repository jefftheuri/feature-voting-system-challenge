# Feature Voting System

A full-stack application that allows users to submit feature requests and vote on them. Built with Express.js backend, SQLite database, React Native mobile app, and vanilla web frontend.

## 🚀 Features

- **User Authentication**: Simple username-based login system
- **Feature Management**: Create, view, and vote on feature requests
- **Multi-Platform**: Web frontend and React Native mobile app
- **Real-time Updates**: Vote counts update instantly
- **Session Management**: Persistent user sessions across platforms
- **Responsive Design**: Works on desktop, tablet, and mobile

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Expo CLI** (for mobile app development)
- **Android Studio** (for Android emulator) or **Xcode** (for iOS simulator)

### React Native Development Environment

For mobile development, follow the [React Native environment setup guide](https://reactnative.dev/docs/environment-setup):

1. Install Android Studio and set up Android SDK
2. Configure Android Virtual Device (AVD)
3. For iOS development on macOS, install Xcode

## 🗄️ Database Setup

The application uses SQLite for data storage. Initialize the database:

```bash
# Navigate to project root
cd feature-voting-system

# Install dependencies
npm install

# Initialize SQLite database with schema and sample data
npm run init-db
```

This creates `voting_system.db` with three tables and sample users (alice, bob, charlie).

## 🖥️ Backend Setup and Run

The Express.js backend serves both the API and web frontend:

```bash
# Start the backend server
npm start
```

The server runs on **http://localhost:3000** and provides:
- API endpoints at `/login`, `/features`, etc.
- Web frontend at the root path `/`

## 📱 Mobile App Setup and Run

The React Native app is built with Expo SDK 54:

```bash
# Navigate to mobile app directory
cd mobile-app

# Install dependencies
npm install

# Start Expo development server
npm start

# Run on specific platforms
npm run android  # Android emulator
npm run ios      # iOS simulator
npm run web      # Web browser
```

## 🌐 Web Frontend

The web frontend is automatically served by the Express server at **http://localhost:3000**. No separate build process required.

## 📖 API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication
The API uses session-based authentication. Include cookies in requests after login.

### Endpoints

#### POST /login
Authenticate user with username.

**Request:**
```bash
curl -c cookies.txt -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "alice"}'
```

**Response:**
```json
{
  "user_id": 1,
  "username": "alice"
}
```

#### GET /features
Get all features with vote counts and creator information.

**Request:**
```bash
curl -b cookies.txt http://localhost:3000/features
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Dark Mode Support",
    "description": "Add dark theme option for better user experience",
    "created_at": "2024-01-15T10:30:00.000Z",
    "creator": "alice",
    "vote_count": 5
  }
]
```

#### POST /features
Create a new feature request (requires authentication).

**Request:**
```bash
curl -b cookies.txt -X POST http://localhost:3000/features \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mobile App Support",
    "description": "Create a mobile app for iOS and Android"
  }'
```

**Response:**
```json
{
  "id": 2,
  "title": "Mobile App Support",
  "description": "Create a mobile app for iOS and Android",
  "user_id": 1
}
```

#### POST /features/:id/vote
Vote for a feature (requires authentication).

**Request:**
```bash
curl -b cookies.txt -X POST http://localhost:3000/features/1/vote
```

**Response:**
```json
{
  "message": "Vote added successfully"
}
```

**Error (already voted):**
```json
{
  "error": "Already voted for this feature"
}
```

#### DELETE /features/:id/vote
Remove vote from a feature (requires authentication).

**Request:**
```bash
curl -b cookies.txt -X DELETE http://localhost:3000/features/1/vote
```

**Response:**
```json
{
  "message": "Vote removed successfully"
}
```

## 🗃️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Features Table
```sql
CREATE TABLE features (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id)
);
```

### Votes Table
```sql
CREATE TABLE votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  feature_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (feature_id) REFERENCES features (id),
  FOREIGN KEY (user_id) REFERENCES users (id),
  UNIQUE(feature_id, user_id)
);
```

### Relationships
- **Users** can create multiple **Features** (1:many)
- **Users** can vote on multiple **Features** through **Votes** (many:many)
- Each **Vote** is unique per user-feature combination

## 🧪 Testing Instructions

### 1. Start the Backend
```bash
npm run init-db
npm start
```

### 2. Test API Endpoints

**Login as a user:**
```bash
curl -c cookies.txt -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "alice"}'
```

**Get all features:**
```bash
curl -b cookies.txt http://localhost:3000/features
```

**Create a feature:**
```bash
curl -b cookies.txt -X POST http://localhost:3000/features \
  -H "Content-Type: application/json" \
  -d '{
    "title": "API Rate Limiting",
    "description": "Add rate limiting to prevent abuse"
  }'
```

**Vote for a feature:**
```bash
curl -b cookies.txt -X POST http://localhost:3000/features/1/vote
```

**Remove vote:**
```bash
curl -b cookies.txt -X DELETE http://localhost:3000/features/1/vote
```

### 3. Test Web Frontend
1. Open http://localhost:3000 in browser
2. Login with username (alice, bob, or charlie)
3. Create features and vote on them
4. Verify visual feedback for voted items

### 4. Test Mobile App
1. Start Expo: `cd mobile-app && npm start`
2. Open on device/emulator
3. Test all functionality matches web frontend

## 📁 Project Structure

```
feature-voting-system/
├── README.md
├── package.json              # Backend dependencies
├── server.js                 # Express.js server
├── init-db.js               # Database initialization
├── voting_system.db         # SQLite database (created after init)
├── web-frontend/
│   └── index.html           # Vanilla web frontend
└── mobile-app/
    ├── package.json         # Mobile app dependencies
    ├── app.json            # Expo configuration
    ├── App.js              # Main app component
    ├── babel.config.js     # Babel configuration
    ├── components/
    │   ├── LoginScreen.js
    │   ├── FeaturesList.js
    │   └── NewFeatureForm.js
    ├── services/
    │   └── api.js          # API service layer
    └── assets/
        └── .gitkeep        # Placeholder for assets
```

## 🚧 Known Limitations

1. **Authentication**: Uses simple username-based auth (no passwords)
2. **Assets**: Mobile app uses default colors instead of custom icons
3. **Real-time**: No WebSocket updates (manual refresh required)
4. **File Storage**: SQLite database in single file
5. **Error Handling**: Basic error messages (could be more detailed)
6. **Validation**: Minimal input validation on frontend
7. **Performance**: No pagination for large feature lists

## 🔮 Future Improvements

### Short Term
- [ ] Add password-based authentication
- [ ] Implement proper form validation
- [ ] Add user profile management
- [ ] Create custom app icons and splash screens
- [ ] Add feature categories/tags

### Medium Term
- [ ] Real-time updates with WebSocket
- [ ] Push notifications for mobile app
- [ ] Feature commenting system
- [ ] User roles and permissions
- [ ] Feature status tracking (planned, in progress, completed)

### Long Term
- [ ] Email notifications
- [ ] Advanced search and filtering
- [ ] Analytics dashboard
- [ ] API rate limiting
- [ ] Database migration to PostgreSQL
- [ ] Docker containerization
- [ ] CI/CD pipeline

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.