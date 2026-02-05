# Campus Expense Manager

Ứng dụng quản lý chi tiêu dành cho sinh viên với kiến trúc monorepo.

## 📁 Cấu trúc dự án

```
CampusExpenseManager/
├── mobile-app/                    # React Native mobile application
│   └── src/
│       ├── assets/                # Static assets (images, fonts, icons)
│       ├── components/            # Reusable UI components
│       ├── constants/             # App-wide constants
│       ├── navigation/            # Navigation logic and navigators
│       ├── screens/               # Main screen components
│       ├── services/              # API calls and data fetching logic
│       ├── store/                 # State management
│       ├── types/                 # TypeScript interface definitions
│       ├── helpers/               # Pure utility functions
│       ├── App.js                 # Main application entry point
│       └── index.js               # Entry point per React Native standards
│
├── server/                        # Express.js backend server
│   └── src/
│       ├── config/                # Configuration files
│       ├── controllers/           # Request handlers
│       ├── middleware/            # Express middleware
│       ├── models/                # Database models/schemas
│       ├── routes/                # API routes definitions
│       ├── services/              # Business logic
│       ├── helper/                # Helper functions
│       └── app.js                 # Main server entry file
│
├── package.json                   # Root package.json (npm workspaces)
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Expo CLI (for mobile development)

### Installation

```bash
# Install all dependencies (root, mobile-app, server)
npm run install:all
```

### Development

#### Mobile App

```bash
# Start Expo development server
npm run mobile:start

# Start on Android emulator
npm run mobile:android

# Start on iOS simulator
npm run mobile:ios

# Start web version
npm run mobile:web
```

#### Server

```bash
# Start server in production mode
npm run server:start

# Start server with hot reload (development)
npm run server:dev
```

## 🛠 Tech Stack

### Mobile App

- React Native with Expo
- Expo Router for navigation
- TypeScript

### Server

- node js
- MySQL

## 📝 License

ISC
