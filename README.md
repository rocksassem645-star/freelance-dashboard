# Freelancer Dashboard 💼

A comprehensive **SaaS platform** for freelancers to manage clients, track projects, generate PDF invoices, and monitor payments.

🌍 **Markets:** Egypt & UK  
💻 **Status:** In Development (Backend Infrastructure Complete)  
📅 **Last Updated:** July 12, 2026

---

## ✨ Features

### Current ✅
- [x] Database connection with MySQL connection pool
- [x] Environment variable configuration
- [x] Server health check endpoint
- [x] Git security (.env protection)
- [x] Onion Architecture structure

### In Development ⏳
- [ ] User Authentication (Registration/Login with JWT)
- [ ] User Profile Management
- [ ] Client Management (CRUD)
- [ ] Project Tracking
- [ ] Invoice Generation & PDF Export
- [ ] Payment Tracking

### Coming Soon 🚀
- [ ] React Frontend Dashboard
- [ ] Email Notifications
- [ ] Real-time Project Updates
- [ ] Advanced Reporting
- [ ] Mobile App

---

## 🛠️ Tech Stack

### Backend
```
Framework:       Node.js + Express.js
Language:        JavaScript
Database:        MySQL
Authentication:  JWT (JSON Web Tokens)
Password Hash:   bcrypt
PDF Generation:  PDFKit
Architecture:    Onion Architecture (Clean Code)
```

### Deployment
```
Frontend:  Vercel
Backend:   Railway
Database:  MySQL (Railway)
```

### Development
```
Environment:     Node.js 18+
Package Manager: npm
Version Control: Git & GitHub
```

---

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js** v18+ ([Download](https://nodejs.org/))
- **MySQL** 8.0+ ([Download](https://dev.mysql.com/downloads/mysql/))
- **Git** ([Download](https://git-scm.com/))
- **Code Editor** (VS Code recommended)

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/rocksassem645-star/freelance-dashboard.git
cd freelance-dashboard
```

### 2. Navigate to Server
```bash
cd server
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the `server/` directory:

```bash
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=freelancer_dashboard
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Configuration
PORT=5000
NODE_ENV=development
```

⚠️ **Important:** 
- Replace `your_mysql_password` with your actual MySQL password
- Change `JWT_SECRET` to a strong random string in production
- Never commit `.env` to Git!

### 5. Create MySQL Database

```bash
mysql -u root -p
```

Then run:
```sql
CREATE DATABASE freelancer_dashboard;
USE freelancer_dashboard;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  country VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. Start the Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

You should see:
```
✅ MySQL Connected Successfully!
Server running on http://localhost:5000
```

### 7. Test the API

**Check if API is running:**
```bash
curl http://localhost:5000
```

Expected response:
```json
{"message":"Freelancer Dashboard API is running!"}
```

**Check database connection:**
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status":"healthy","database":"connected"}
```

---

## 📁 Project Structure

```
freelance-dashboard/
│
├── server/                          # Backend (Node.js + Express)
│   ├── src/
│   │   ├── core/                    # Core business logic & entities
│   │   ├── application/             # Use cases & application logic
│   │   ├── infrastructure/
│   │   │   └── database.js          # MySQL connection pool
│   │   └── routes/                  # API endpoints
│   │
│   ├── index.js                     # Express server entry point
│   ├── package.json                 # Dependencies
│   ├── .env                         # Environment variables (NOT in Git)
│   ├── .gitignore                   # Git ignore rules
│   └── node_modules/                # Installed packages
│
├── client/                          # Frontend (React) - Coming Soon
│
├── README.md                        # This file
├── .gitignore                       # Root-level Git ignore
└── LICENSE                          # Project license
```

### Architecture Pattern: Onion Architecture

```
          Routes (API Endpoints)
              ↓
       Infrastructure (DB, Services)
              ↓
        Application (Use Cases)
              ↓
           Core (Domain Logic)
```

**Design Principle:** Dependencies point inward. Core depends on nothing.

---

## 🔌 API Endpoints

### Currently Active

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/` | API health message | ✅ Active |
| GET | `/api/health` | Database connection status | ✅ Active |

### Authentication (Coming Soon)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | ⏳ Building |
| POST | `/api/auth/login` | User login | ⏳ Building |
| POST | `/api/auth/logout` | User logout | ⏳ Building |
| GET | `/api/auth/me` | Get current user | ⏳ Building |

### Users (Coming Soon)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/users/profile` | Get user profile | ⏳ Building |
| PUT | `/api/users/profile` | Update user profile | ⏳ Building |
| PUT | `/api/users/password` | Change password | ⏳ Building |
| DELETE | `/api/users/account` | Delete account | ⏳ Building |

### Clients (Coming Soon)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/api/clients` | Create new client | ⏳ Building |
| GET | `/api/clients` | List all clients | ⏳ Building |
| GET | `/api/clients/:id` | Get client details | ⏳ Building |
| PUT | `/api/clients/:id` | Update client | ⏳ Building |
| DELETE | `/api/clients/:id` | Delete client | ⏳ Building |

### Projects (Coming Soon)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/api/projects` | Create project | ⏳ Building |
| GET | `/api/projects` | List projects | ⏳ Building |
| GET | `/api/projects/:id` | Get project details | ⏳ Building |
| PUT | `/api/projects/:id` | Update project | ⏳ Building |
| DELETE | `/api/projects/:id` | Delete project | ⏳ Building |

### Invoices (Coming Soon)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/api/invoices` | Create invoice | ⏳ Building |
| GET | `/api/invoices` | List invoices | ⏳ Building |
| GET | `/api/invoices/:id` | Get invoice details | ⏳ Building |
| PUT | `/api/invoices/:id` | Update invoice | ⏳ Building |
| DELETE | `/api/invoices/:id` | Delete invoice | ⏳ Building |
| GET | `/api/invoices/:id/pdf` | Download invoice as PDF | ⏳ Building |

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  country VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Coming Soon

**Clients Table:**
- Store client information
- Link to freelancer (user)

**Projects Table:**
- Track projects and status
- Link to client and freelancer

**Invoices Table:**
- Store invoice records
- Link to projects and clients

**Payments Table:**
- Track payment history
- Payment status and dates

---

## 🔐 Security Features

✅ **Environment Variables**
- Sensitive data stored in `.env`
- Not committed to Git
- Different values per environment

✅ **Password Security**
- Passwords hashed with bcrypt
- Never stored in plaintext
- Salt included automatically

✅ **JWT Authentication**
- Stateless authentication
- Token-based requests
- No server-side sessions required

✅ **.gitignore Protection**
- `.env` file excluded
- `node_modules/` excluded
- Prevents accidental secret leaks

**Future Security:**
- [ ] Rate limiting on auth endpoints
- [ ] Input validation & sanitization
- [ ] CORS security headers
- [ ] HTTPS enforcement in production
- [ ] SQL injection prevention

---

## 🧪 Testing

### Manual Testing (Curl)

**Test API is running:**
```bash
curl http://localhost:5000
```

**Test database connection:**
```bash
curl http://localhost:5000/api/health
```

**Database Direct Testing:**
```bash
mysql -u root -p freelancer_dashboard
SHOW TABLES;
SELECT * FROM users;
```

### Automated Testing (Coming Soon)
- Jest for unit tests
- Supertest for API tests
- Test coverage reporting

---

## 📝 Git Workflow

### Making Changes

1. **Create a feature branch:**
```bash
git checkout -b feature/auth-system
```

2. **Make your changes and commit:**
```bash
git add .
git commit -m "feat: implement user authentication"
```

3. **Push to GitHub:**
```bash
git push origin feature/auth-system
```

4. **Create a Pull Request on GitHub**

### Commit Message Format

Follow conventional commits:
```
feat:  New feature (new endpoint, new table, etc)
fix:   Bug fix
docs:  Documentation updates
style: Code formatting (no functional changes)
test:  Adding tests
chore: Maintenance tasks
```

Examples:
```bash
git commit -m "feat: add user registration endpoint"
git commit -m "fix: correct database connection error"
git commit -m "docs: update README with API docs"
```

---

## 🚀 Deployment

### Prepare for Production

1. **Update environment variables:**
```env
NODE_ENV=production
JWT_SECRET=very_long_random_secret_string_here
DB_HOST=your_railway_database_host
DB_USER=your_railway_db_user
DB_PASSWORD=your_railway_db_password
```

2. **Test thoroughly:**
```bash
npm test
```

3. **Build & optimize:**
```bash
npm run build
```

### Deploy to Railway

1. **Create Railway account:** https://railway.app
2. **Connect GitHub repository**
3. **Set environment variables in Railway dashboard**
4. **Deploy!**

### Deploy Frontend to Vercel

1. **Create Vercel account:** https://vercel.com
2. **Connect GitHub repository (client folder)**
3. **Add API URL environment variable**
4. **Deploy!**

---

## 📈 Development Roadmap

### Week 1-2: Authentication & User Management ⏳
- User registration
- User login with JWT
- Profile management
- Password reset

### Week 2-3: Core Features ⏳
- Client management
- Project tracking
- Basic invoicing

### Week 3-4: Advanced Features ⏳
- PDF invoice generation
- Payment tracking
- Reporting

### Week 4-5: Frontend Development ⏳
- React dashboard
- Admin panel
- Client/project forms

### Week 5+: Polish & Deploy ⏳
- Testing
- Bug fixes
- Production deployment
- Monitoring

---

## 💡 Tips & Tricks

### Restart Server Quickly
```bash
# Kill current process
Ctrl + C

# Restart
npm start
```

### View Database Contents
```bash
mysql -u root -p freelancer_dashboard
SELECT * FROM users;
EXIT;
```

### Clear node_modules (if issues)
```bash
rm -rf node_modules package-lock.json
npm install
```

### Debug JWT Tokens
Use [jwt.io](https://jwt.io) to decode tokens

### Monitor Server Logs
```bash
# Redirect output to file
npm start > server.log 2>&1

# View logs
tail -f server.log
```

---

## 🐛 Troubleshooting

### "Cannot find module 'mysql2'"
```bash
npm install mysql2
```

### "MySQL Connection Error"
- Check MySQL is running
- Verify credentials in `.env`
- Ensure database exists: `CREATE DATABASE freelancer_dashboard;`

### "EADDRINUSE: address already in use :::5000"
- Port 5000 already in use
- Kill process: `lsof -i :5000` (Mac/Linux) or `netstat -ano | findstr :5000` (Windows)
- Or change PORT in `.env`

### "Cannot read property 'getConnection' of undefined"
- `.env` file not found
- Verify `.env` exists in `server/` directory
- Verify `require('dotenv').config()` is in `index.js`

---

## 📚 Learning Resources

- **Express.js:** https://expressjs.com/
- **MySQL with Node.js:** https://github.com/mysqljs/mysql2
- **JWT Authentication:** https://jwt.io/
- **Bcrypt:** https://www.npmjs.com/package/bcrypt
- **PDFKit:** http://pdfkit.org/
- **Onion Architecture:** https://medium.com/expedia-group-tech/onion-architecture-deed8a554423

---

## 👨‍💻 Contributing

We welcome contributions! 

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

Please ensure:
- Code follows existing style
- Commits have clear messages
- Database changes are documented
- Environment variables are used for secrets

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 👤 Author

**Assem Mostafa**
- GitHub: [@rocksassem645-star](https://github.com/rocksassem645-star)
- Location: Egypt 🇪🇬

---

## 📞 Support

For issues, questions, or suggestions:
1. Check existing GitHub issues
2. Create a new GitHub issue
3. Provide detailed description and error messages

---

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| Backend Status | ✅ Infrastructure Ready |
| Server Port | 5000 |
| Database | MySQL `freelancer_dashboard` |
| API Endpoints (Active) | 2 |
| API Endpoints (Planned) | 25+ |
| Dependencies | 7 |
| Architecture | Onion Pattern |
| Authentication | JWT |
| Git Status | ✅ GitHub synced |

---

## 🎯 Next Steps

1. **Clone this repo**
2. **Follow Quick Start section above**
3. **Run the server**
4. **Test the endpoints**
5. **Check GitHub issues for tasks to work on**
6. **Join development!**

---

**Happy Coding! 🚀**

Last Updated: July 12, 2026  
Built with ❤️ by Assem Mostafa
