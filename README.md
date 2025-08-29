
# 📚 Library Management System - MERN Stack  

![Landing Page](https://github.com/user-attachments/assets/aebcb78b-373a-406b-b5b4-c468b28b3219)  

[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made for Education](https://img.shields.io/badge/Made%20for-Education-blue?style=flat&logo=bookstack)](#)
[![Student Project](https://img.shields.io/badge/Type-Student%20Project-success)](#)

---

## 📖 Project Overview  

This **Library Management System (LMS)** was developed as part of a **Summer Enrichment Class Project**.  
It is not intended for production but demonstrates how the **MERN stack** can be applied to solve real-world problems such as managing library resources, users, and borrowing histories.  

The system is divided into two main parts:  

- **Backend**: RESTful API using Node.js, Express, and MongoDB  
- **Frontend**: React-based UI for Admin and Users  

---

## ✨ Key Features  

- 📚 **Book Management** – Add, update, delete, and search books  
- 👥 **User Management** – Separate roles for Admin/Librarian and Members  
- 📊 **Analytics Dashboard** – View usage statistics (future scope)  
- 🔍 **Advanced Search** – Search by title, author, category, or ISBN  
- 🔒 **Secure Authentication** – JWT-based login and route protection  
- 💻 **Responsive Web UI** – Built with React  

---

## 🚀 Technology Stack  

### Frontend  
- React  
- React Router  
- Axios  
- Tailwind / CSS Modules  

### Backend  
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JWT Authentication  

### Development Tools  
- Git & GitHub  
- VS Code  
- Postman (API testing)  
- ESLint & Prettier  

---

## 📂 Project Structure  

```bash
Library-Management-System/
│
├── backend/                   # Node.js + Express backend
│   ├── authorization/         # Auth middleware + seed scripts
│   ├── controllers/           # Route controllers (auth, books, borrow)
│   ├── models/                # Mongoose models
│   ├── server.js              # Entry point
│   └── package.json
│
├── frontend/LmsApp/           # React frontend app
│   ├── public/                # Public assets (logos, images)
│   ├── src/
│   │   ├── components/        # Shared UI components
│   │   ├── pages/             # Page-level views (login, signup, admin, user)
│   │   ├── services/          # API services (Axios)
│   │   ├── App.jsx            # Root app component
│   │   └── main.jsx           # Entry point
│   └── package.json
│
├── README.md                  # Documentation
└── .gitignore
````

---

## 🛠️ Installation Guide

### Prerequisites

* Node.js (v16+ recommended)
* MongoDB (running locally or via Atlas)
* NPM (v8+)

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/bhabinexpert/Library-Management-System-Mobile-App.git
   cd Library-Management-System-Mobile-App
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file inside `backend/` with:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/library_db
   JWT_SECRET=your_secure_jwt_secret
   ```

   Start the backend:

   ```bash
   npm start
   ```

3. **Frontend Setup**

   ```bash
   cd ../frontend/LmsApp
   npm install
   npm run dev
   ```

4. **Access the app**

   * Frontend: `http://localhost:5173` (Vite dev server)
   * Backend API: `http://localhost:5000`

---

## 🌐 Usage Guide

### Roles & Permissions

* **Admin/Librarian**

  * Manage books & users
  * Track borrow/return history
  * Configure system settings

* **Member/User**

  * Browse and search books
  * View availability
  * Track personal borrowing history

---

## 📸 Screenshots

**Login Screen**
![Login](https://github.com/user-attachments/assets/b3e0d9dc-37d6-41de-a332-4ff1f564f783)

**Dashboard**
![Dashboard](https://github.com/user-attachments/assets/bace6f81-4393-4440-946e-219178f984ab)

**Book Management**
![Books](https://github.com/user-attachments/assets/c0f6e6a6-f700-4ed5-93ab-f18d048b6aad)

---

## 🤝 Contribution Guidelines

1. Fork the repository
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:

   ```bash
   git commit -m "Add: your feature description"
   ```
4. Push to GitHub and open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License**.
See the [LICENSE](LICENSE) file for details.

---

## ✉️ Contact

**Maintainer:** [Bhabin Dulal](https://github.com/bhabinexpert)
**Email:** [bhabindulal35@example.com](mailto:bhabindulal35@example.com)

---

## 💻 Live Demo ⬇️

👉 [**See Project**](https://gyankosh-lms.netlify.app/)

---

⭐ If you found this useful, consider giving it a star on GitHub!
🐛 Found a bug? Please report it via [Issues](https://github.com/bhabinexpert/Library-Management-System-Mobile-App/issues).

```

