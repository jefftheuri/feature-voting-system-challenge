# Feature Voting System

A full-stack application that allows users to submit feature requests and vote on them. Built with Express.js backend, SQLite database, native Android app (Kotlin), and vanilla web frontend.

## 🚀 Features

- **User Authentication**: Simple username-based login system
- **Feature Management**: Create, view, and vote on feature requests
- **Multi-Platform**: Web frontend and native Android app
- **Real-time Updates**: Vote counts update instantly
- **Session Management**: Persistent user sessions across platforms
- **Responsive Design**: Works on desktop, tablet, and mobile

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Android Studio** (for Android development)
- **Java Development Kit (JDK) 8 or higher**

### Android Development Environment

For mobile development, you need:

1. **Android Studio** with Android SDK (API level 24+)
2. **Android Virtual Device (AVD)** or physical Android device
3. **JDK 8+** for Kotlin compilation
4. **Gradle** (included with Android Studio)

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

## 📱 Android App Setup and Run

The native Android app is built with Kotlin and modern Android architecture:

```bash
# Navigate to Android app directory
cd android-app

# Open project in Android Studio
# OR build from command line:

# Build the project
./gradlew build

# Install on connected device/emulator
./gradlew installDebug

# Run on Android emulator (if AVD is running)
./gradlew connectedAndroidTest
```

**Using Android Studio:**
1. Open `android-app` folder in Android Studio
2. Wait for Gradle sync to complete
3. Click "Run" button or press Shift+F10
4. Select your device/emulator

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

### 4. Test Android App
1. Open Android Studio and import `android-app` project
2. Start Android emulator or connect physical device
3. Run the app and test all functionality
4. Verify login, feature creation, and voting works properly

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
└── android-app/
    ├── build.gradle         # Project build configuration
    ├── settings.gradle      # Gradle settings
    ├── gradle.properties    # Gradle properties
    └── app/
        ├── build.gradle     # App module build config
        ├── proguard-rules.pro
        └── src/main/
            ├── AndroidManifest.xml
            ├── java/com/featurevoting/
            │   ├── models/      # Data models (Kotlin)
            │   ├── api/         # Network layer (Retrofit)
            │   ├── ui/          # Activities & ViewModels
            │   └── utils/       # Utilities (SharedPrefs)
            └── res/             # Android resources
                ├── layout/      # XML layouts
                ├── values/      # Colors, themes, strings
                ├── menu/        # Menu resources
                ├── drawable/    # Icons and drawables
                └── xml/         # Backup & data extraction rules
```

## 🚧 Known Limitations

1. **Authentication**: Uses simple username-based auth (no passwords)
2. **Platform**: Android app only (no iOS version)
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
- [ ] Develop iOS version of the app

### Medium Term
- [ ] Real-time updates with WebSocket
- [ ] Push notifications for Android app
- [ ] Feature commenting system
- [ ] User roles and permissions
- [ ] Feature status tracking (planned, in progress, completed)
- [ ] Offline support for Android app

### Long Term
- [ ] Email notifications
- [ ] Advanced search and filtering
- [ ] Analytics dashboard
- [ ] API rate limiting
- [ ] Database migration to PostgreSQL
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Cross-platform mobile framework migration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.