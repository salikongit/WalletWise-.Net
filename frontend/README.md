# 🚀 WalletWise Frontend

**React + Vite + Tailwind CSS** frontend application for WalletWise Personal Finance Manager.

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Authentication Flow](#authentication-flow)
- [Role-Based Routing](#role-based-routing)
- [API Integration](#api-integration)
- [Features](#features)
- [Screenshots](#screenshots)

---

## 📦 Prerequisites

Before running the frontend, ensure you have:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/

2. **npm** or **yarn** package manager
   - Comes with Node.js

3. **Backend API** running
   - The backend should be running on `http://localhost:5000`
   - See main project README for backend setup

---

## 🚀 Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

   Or using yarn:
   ```bash
   yarn install
   ```

---

## ⚙️ Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

**Note:** The `.env.example` file is provided as a template. Copy it to `.env` and update the values.

---

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

The application will start on `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Layout.jsx       # Main layout with navigation
│   │   ├── LoadingSpinner.jsx
│   │   ├── ErrorMessage.jsx
│   │   └── SuccessMessage.jsx
│   ├── pages/               # Page components
│   │   ├── Login.jsx        # Login page
│   │   ├── VerifyOtp.jsx    # OTP verification page
│   │   ├── Dashboard.jsx    # Customer dashboard
│   │   ├── EmiPlanner.jsx   # EMI calculation page
│   │   ├── InvestmentPlanner.jsx  # Investment planning
│   │   ├── Transactions.jsx # Income/Expense manager
│   │   ├── AdminDashboard.jsx  # Admin dashboard
│   │   └── UserManagement.jsx  # User management
│   ├── routes/              # Route protection
│   │   ├── ProtectedRoute.jsx
│   │   └── PublicRoute.jsx
│   ├── services/            # API services
│   │   └── api.js          # Axios configuration & API calls
│   ├── utils/               # Utility functions
│   │   └── auth.js          # Authentication utilities
│   ├── App.jsx              # Main app component with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles & Tailwind
├── public/                  # Static assets
├── .env                     # Environment variables
├── .env.example             # Environment variables template
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── postcss.config.js        # PostCSS configuration
```

---

## 🔐 Authentication Flow

### Step 1: Login
1. User enters email and password
2. Backend validates credentials
3. Backend generates and sends OTP via email
4. Frontend stores `userId` temporarily
5. User is redirected to OTP verification page

### Step 2: OTP Verification
1. User enters 6-digit OTP code
2. Frontend sends OTP to backend for verification
3. Backend validates OTP and returns JWT token
4. Frontend stores JWT token in `localStorage`
5. User is redirected based on role:
   - **Customer** → `/dashboard`
   - **Admin** → `/admin/dashboard`

### Step 3: Authenticated Requests
- JWT token is automatically attached to all API requests via Axios interceptor
- Token is stored in `localStorage` as `token`
- User info is stored in `localStorage` as `user`

### Logout
- Clears `localStorage` (token and user data)
- Redirects to login page

---

## 🛡️ Role-Based Routing

### Customer Routes
- `/dashboard` - Financial dashboard
- `/emi-planner` - EMI calculation and planning
- `/investment-planner` - SIP & Lumpsum investment planning
- `/transactions` - Income & expense management

### Admin Routes
- `/admin/dashboard` - Admin statistics dashboard
- `/admin/users` - User management (activate/deactivate)

### Route Protection
- **ProtectedRoute**: Requires authentication
- **PublicRoute**: Redirects authenticated users to their dashboard
- Role-based access control ensures users can only access routes for their role

---

## 🔌 API Integration

### Axios Configuration

All API calls are made through a centralized Axios instance (`src/services/api.js`):

- **Base URL**: Configured via `VITE_API_BASE_URL` environment variable
- **Request Interceptor**: Automatically attaches JWT token to all requests
- **Response Interceptor**: Handles 401 errors (unauthorized) and redirects to login

### API Services

- `authAPI` - Authentication endpoints
- `dashboardAPI` - Dashboard data
- `financeAPI` - Financial calculations (EMI, Investment)
- `loansAPI` - Loan management
- `investmentsAPI` - Investment management
- `transactionsAPI` - Income & expense transactions
- `reportsAPI` - PDF report generation
- `adminAPI` - Admin operations

---

## ✨ Features

### Customer Features

1. **Financial Dashboard**
   - Total income, expenses, savings summary
   - Charts for income vs expenses
   - Recent transactions list
   - PDF report download

2. **EMI Planner**
   - Calculate EMI for loans
   - View amortization schedule
   - Save loans for future reference
   - Visual charts for payment breakdown

3. **Investment Planner**
   - SIP (Systematic Investment Plan) calculator
   - Lumpsum investment calculator
   - Future value projections
   - Save investment plans

4. **Income & Expense Manager**
   - Add/edit/delete income transactions
   - Add/edit/delete expense transactions
   - Categorize transactions
   - Filter by date range

### Admin Features

1. **Admin Dashboard**
   - User statistics
   - Financial aggregations
   - Charts and visualizations

2. **User Management**
   - View all users
   - Activate/deactivate users
   - View user details

---

## 🎨 UI Components

### Reusable Components

- **Layout**: Main layout with navigation bar
- **LoadingSpinner**: Loading indicator
- **ErrorMessage**: Error message display
- **SuccessMessage**: Success message display

### Styling

- **Tailwind CSS** for all styling
- Custom color palette (primary, success, danger)
- Responsive design (mobile-first)
- Custom utility classes in `index.css`

---

## 📊 Charts

Charts are implemented using **Recharts**:

- **Pie Charts**: Income vs expenses distribution
- **Bar Charts**: Transaction breakdowns
- **Line Charts**: Amortization schedules

---

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Structure

- **Components**: Reusable UI components
- **Pages**: Full page components
- **Services**: API integration layer
- **Utils**: Utility functions
- **Routes**: Route protection logic

---

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Error**
   - Ensure backend is running on `http://localhost:5000`
   - Check `.env` file has correct `VITE_API_BASE_URL`

2. **Authentication Issues**
   - Clear `localStorage` and try logging in again
   - Check browser console for errors

3. **Build Errors**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

4. **Port Already in Use**
   - Change port in `vite.config.js`:
     ```js
     server: {
       port: 3001, // Change to available port
     }
     ```

---

## 📝 Notes

- **JWT Token**: Stored in `localStorage` (not secure for production - use httpOnly cookies)
- **CORS**: Backend must allow requests from frontend origin
- **Environment Variables**: Must start with `VITE_` to be accessible in frontend code
- **Responsive Design**: All pages are mobile-responsive

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy Options

1. **Static Hosting** (Netlify, Vercel, GitHub Pages)
   - Upload `dist` folder
   - Configure environment variables

2. **Traditional Web Server** (Nginx, Apache)
   - Serve `dist` folder as static files
   - Configure reverse proxy for API calls

---

## 📸 Screenshots

_Placeholder for screenshots:_

- Login Page
- OTP Verification
- Customer Dashboard
- EMI Planner
- Investment Planner
- Transactions Manager
- Admin Dashboard
- User Management

---

## 🎓 CDAC Project Checklist

- ✅ React + Vite setup
- ✅ Tailwind CSS styling
- ✅ OTP + JWT authentication
- ✅ Role-based routing
- ✅ Protected routes
- ✅ Axios API integration
- ✅ Charts (Recharts)
- ✅ Responsive design
- ✅ PDF download functionality
- ✅ Form validation
- ✅ Error handling
- ✅ Loading states

---

## 📚 Dependencies

### Main Dependencies
- `react` - React library
- `react-dom` - React DOM renderer
- `react-router-dom` - Routing
- `axios` - HTTP client
- `recharts` - Chart library
- `lucide-react` - Icons

### Dev Dependencies
- `vite` - Build tool
- `@vitejs/plugin-react` - React plugin for Vite
- `tailwindcss` - CSS framework
- `autoprefixer` - CSS post-processor
- `eslint` - Linting tool

---

## 👥 Support

For issues or questions:
- Check browser console for errors
- Verify backend API is running
- Check network tab for API call failures
- Review environment variables

---

**Built with ❤️ for CDAC Major Project**




