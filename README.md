# ApplyTrack Pro – Job Application Tracker

ApplyTrack Pro is a full-stack web application designed to help students and job seekers manage and track their job and internship applications in one place.

It provides a centralized dashboard to organize applications, monitor their status, and keep track of the recruitment process.

## Features

- **User Authentication:** Register and log in securely using JWT authentication.
- **Application Management:** Add, view, edit, and delete job applications.
- **Personalized Dashboard:** View your application records and statistics.
- **Application Status Tracking:** Track applications through different recruitment stages.
- **Data Isolation:** Each user can access only their own applications.
- **MySQL Database:** Store user accounts and application records.

## Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend |
| Node.js | Backend runtime |
| Express.js | REST API |
| MySQL | Database |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Chart.js | Dashboard visualizations |

## Project Structure

```text
ApplyTrack-Pro/
├── backend/
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── auth.js
│   ├── db.js
│   ├── routes.js
│   └── server.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── App.jsx
│       ├── Auth.jsx
│       ├── App.css
│       └── index.css
├── .gitignore
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- MySQL Server
- Git

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/aadhyaa12/ApplyTrack-Pro.git
cd ApplyTrack-Pro
```

**2. Install dependencies**

```bash
npm install
cd frontend
npm install
cd ..
```

**3. Configure environment variables**

Create a `.env` file inside the `backend` folder and configure the required database credentials and JWT secret.

Required variables:

```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=applytrack
DB_PORT=3306
JWT_SECRET=your_secure_random_secret
```

Use your own local MySQL credentials. Never upload your `.env` file to GitHub.

**4. Start the backend**

```bash
npm start
```

**5. Start the frontend**

Open another terminal:

```bash
cd frontend
npm run dev
```

Open the local URL displayed by Vite in your browser.

## Future Improvements

- Interview reminders and calendar integration.
- CSV import and export.
- Job listing API integration.
- Online deployment.

## Author

**Aadhya Shukla**

GitHub: [aadhyaa12](https://github.com/aadhyaa12)

---

*Built as a full-stack development project to simplify job application management.*