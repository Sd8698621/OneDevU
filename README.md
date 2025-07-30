# OneDevU

A LinkedIn-style social networking app built with React Native and Express.js.  
Users can register, login, follow/unfollow others, and view public profiles.

## 🌐 Features

- 🔐 Authentication (login with email, phone, or username)
- 👤 Public and private user profiles
- 🔍 Search users
- ➕ Follow/Unfollow functionality
- 🖼️ Profile and banner image support
- 📦 Backend with Express + JSON file database
- 📱 Frontend built in React Native (Expo)

## 🚀 Tech Stack

- **Frontend**: React Native (Expo)
- **Backend**: Node.js + Express
- **Storage**: Local JSON file (`users.json`)
- **Auth**: JWT
- **State**: AsyncStorage for token management

## 🛠️ Setup

### 1. Clone the repo

```bash
git clone https://github.com/Sd8698621/OneDevU.git
cd OneDevU
cd frontend/OneDev
npm install
cd ../../backend
npm install
```
### 2. Environment variables
Create a .env file in both frontend/ and backend/
frontend/OneDev/.env
```bash
API_HOST=YOUR_LOCAL_IP
API_PORT=3000
```
backend/.env
```bash
JWT_SECRET=yourSuperSecretKey123
JWT_EXPIRES_IN=1d
EMAIL_USER=
EMAIL_PASS=
BASE_URL=http://localhost:3000
PORT=3000
HOST=localhost
```
### 3. Run the app
Backend
```bash
cd backend
npm start
```
Frontend
```bash
cd frontend/OneDev
npm run [device]
```
[device]: android , ios , web

