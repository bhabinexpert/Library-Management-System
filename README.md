# Library Management System - MERN Stack

<img width="2848" height="1601" alt="Screenshot 2025-08-18 214315" src="https://github.com/user-attachments/assets/aebcb78b-373a-406b-b5b4-c468b28b3219" />



[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/bhabinexpert/Library-Management-System.svg?style=social)](https://github.com/bhabinexpert/Library-Management-System/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/bhabinexpert/Library-Management-System)](https://github.com/bhabinexpert/Library-Management-System/issues)

A modern, full-stack Library Management System built with the MERN stack (MongoDB, Express, React, Node.js) that simplifies library operations, enhances user experience, and provides comprehensive administrative control.

## ✨ Key Features

- **📚 Book Management** - Add, update, delete, and search books
- **👥 User Management** - Admin/Librarian and Member roles with granular permissions
- **🔄 Book Circulation** - Intuitive check-in/check-out system with due date tracking
- **⏰ Automated Reminders** - Email notifications for due dates and reservations
- **📊 Analytics Dashboard** - Visualize library usage with interactive charts
- **🔍 Advanced Search** - Filter books by title, author, category, ISBN, or status
- **🔒 Secure Authentication** - JWT-based authentication with role-based access
- **📱 Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **💸 Fine Management** - Automatic calculation of late return fees
- **📈 Reporting System** - Generate PDF reports for inventory, transactions, and users

## 🚀 Technology Stack

### Frontend
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black&style=for-the-badge)](https://reactjs.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?logo=redux&logoColor=white&style=for-the-badge)](https://redux-toolkit.js.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?logo=mui&logoColor=white&style=for-the-badge)](https://mui.com/)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=reactrouter&logoColor=white&style=for-the-badge)](https://reactrouter.com/)
[![Axios](https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=white&style=for-the-badge)](https://axios-http.com/)


### Backend
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white&style=for-the-badge)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white&style=for-the-badge)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white&style=for-the-badge)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-880000?logo=mongoose&logoColor=white&style=for-the-badge)](https://mongoosejs.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white&style=for-the-badge)](https://jwt.io/)


### Development Tools
[![Git](https://img.shields.io/badge/Git-F05032?logo=git&logoColor=white&style=for-the-badge)](https://git-scm.com/)
[![VS Code](https://img.shields.io/badge/VS_Code-007ACC?logo=visualstudiocode&logoColor=white&style=for-the-badge)](https://code.visualstudio.com/)
[![Postman](https://img.shields.io/badge/Postman-FF6C37?logo=postman&logoColor=white&style=for-the-badge)](https://www.postman.com/)
[![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white&style=for-the-badge)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-F7B93E?logo=prettier&logoColor=black&style=for-the-badge)](https://prettier.io/)


## 🛠️ Installation Guide

### Prerequisites
- Node.js (v16.x or higher)
- MongoDB (v6.x or higher)
- NPM (v8.x or higher)

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bhabinexpert/Library-Management-System.git
   cd Library-Management-System
   ```

2. **Install server dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies:**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment variables:**
   Create a `.env` file in the `server` directory with the following content:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/library_db
   JWT_SECRET=your_secure_jwt_secret
   JWT_EXPIRES_IN=30d
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=your_email@example.com
   SMTP_PASS=your_email_password
   FRONTEND_URL=http://localhost:3000
   ```

5. **Initialize the database:**
   Start MongoDB service and seed initial data (optional):
   ```bash
   cd server
   npm run seed
   ```

6. **Start the application:**
   - Start backend server:
     ```bash
     cd server
     npm run dev
     ```
   - Start frontend development server:
     ```bash
     cd client
     npm start
     ```

7. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - Admin credentials (seed data): admin@library.com / admin123

## 🌐 Usage Guide

### User Roles

1. **Admin/Librarian:**
   - Full system access
   - Manage books, users, and categories
   - Process book loans and returns
   - Generate reports and view analytics
   - Configure system settings

2. **Library Staff:**
   - Manage book inventory
   - Process loans and returns
   - View member information
   - Generate basic reports

3. **Members:**
   - Browse and search books
   - View book availability
   - Checkout books (when logged in)
   - View personal loan history
   - Update personal profile

### Core Functionalities

- **📚 Book Management:**
  - Add new books with cover images
  - Update book details and availability
  - Categorize books by genres/subjects
  - Track copies and availability status

- **🔄 Loan Management:**
  - Checkout books with due dates
  - Renew loans (if eligible)
  - Return books with fine calculation
  - Reserve books that are currently checked out

- **📊 Reporting:**
  - Generate inventory reports
  - View loan statistics
  - Track popular books
  - Export reports in PDF/CSV formats

- **🔔 Notifications:**
  - Due date reminders (email)
  - Reservation availability alerts
  - Fine notifications
  - System announcements

## 📊 Database Schema

```mermaid
erDiagram
    USER ||--o{ LOAN : "has"
    USER {
        string _id
        string name
        string email
        string password
        string role "admin/staff/member"
        date registrationDate
        string status "active/inactive"
    }
    
    BOOK ||--o{ LOAN : "has"
    BOOK {
        string _id
        string title
        string author
        string ISBN
        string[] categories
        string publisher
        number publicationYear
        number totalCopies
        number availableCopies
        string coverImage
    }
    
    CATEGORY {
        string _id
        string name
        string description
    }
    
    LOAN {
        string _id
        ObjectId userId
        ObjectId bookId
        date checkoutDate
        date dueDate
        date returnDate
        number fineAmount
        string status "active/returned/overdue"
    }
```

## 🤝 Contribution Guidelines

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes:**
   ```bash
   git commit -m "Add: your meaningful commit message"
   ```
4. **Push to your branch:**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Create a Pull Request**

### Development Guidelines
- Follow existing code style and patterns
- Write meaningful commit messages
- Add appropriate comments for complex logic
- Update documentation when adding new features
- Test your code thoroughly before submitting

### Reporting Issues
Please use the [GitHub Issues](https://github.com/bhabinexpert/Library-Management-System/issues) page to report bugs or suggest enhancements.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ✉️ Contact

**Project Maintainer:** [Bhabin Expert](https://github.com/bhabinexpert)  
**Email:** bhabindulal35@example.com  
**Project Link:** [https://github.com/bhabinexpert/Library-Management-System](https://github.com/bhabinexpert/Library-Management-System)

## 🙏 Acknowledgments

- [MERN Stack Documentation](https://www.mongodb.com/mern-stack)
- [React Community](https://reactjs.org/community/support.html)
- [Material UI Documentation](https://mui.com/)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Mongoose Documentation](https://mongoosejs.com/docs/guide.html)

---

**Ready to transform your library management?** ⭐ Star the repository if you find this project useful!  
**Found a bug?** 🐛 Please open an issue on our [GitHub Issues](https://github.com/bhabinexpert/Library-Management-System/issues) page.
