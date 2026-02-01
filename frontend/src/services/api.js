import axios from 'axios';
import { getToken, removeToken } from '../utils/auth';

// ✅ PROXY-BASED AXIOS
const api = axios.create({
  baseURL: '/api',   // 👈 THIS IS THE KEY
  headers: {
    'Content-Type': 'application/json',
  },
});

// ================= REQUEST INTERCEPTOR =================
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);




// ================= AUTH API =================
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  verifyOtp: (userId, otpCode) =>
    api.post(`/auth/verify-otp?userId=${userId}`, { otpCode }),
};

// ================= ONBOARDING API =================
export const onboardingAPI = {
  getOnboardingStatus: () => api.get('/onboarding/status'),
  completeOnboarding: (data) => api.post('/onboarding/complete', data),
};

// ================= INVESTMENT RECOMMENDATION (🔥 CORE) =================
export const investmentAPI = {
  getRecommendations: (investmentType) =>
    api.get('/investments/recommendations', {
      params: { investmentType },
    }),

  getRiskBenefit: (investmentType) =>
    api.get('/investments/risk-benefit', {
      params: { investmentType },
    }),

     // ✅ ADD THIS (REAL-TIME MARKET DATA)
  getRealTimeData: (investmentType, searchTerm) =>
    api.get('/investments/realtime', {
      params: {
        investmentType,
        searchTerm,
      },
    }),
};


// ================= INVESTMENTS (CRUD) =================
export const investmentsAPI = {
  getAll: () => api.get('/investments'),
  getById: (id) => api.get(`/investments/${id}`),
  create: (data) => api.post('/investments', data),
  update: (id, data) => api.put(`/investments/${id}`, data),
  delete: (id) => api.delete(`/investments/${id}`),
};

// ================= DASHBOARD =================
export const dashboardAPI = {
  getDashboard: () => api.get('/dashboard'),
};

// ================= FINANCE =================
export const financeAPI = {
  calculateEmi: (data) => api.post('/finance/calculate-emi', data),
  calculateInvestment: (data) =>
    api.post('/finance/calculate-investment', data),
};

// ================= LOANS =================
export const loansAPI = {
  getAll: () => api.get('/loans'),
  getById: (loanId) => api.get(`/loans/${loanId}`),
  create: (data) => api.post('/loans', data),
  update: (loanId, data) => api.put(`/loans/${loanId}`, data),
  delete: (loanId) => api.delete(`/loans/${loanId}`),
  getAmortization: (loanId) =>
    api.get(`/loans/${loanId}/amortization`),
};

// ================= TRANSACTIONS =================
export const transactionsAPI = {
  getIncomes: (startDate, endDate) =>
    api.get('/transactions/income', {
      params: { startDate, endDate },
    }),

  getExpenses: (startDate, endDate) =>
    api.get('/transactions/expense', {
      params: { startDate, endDate },
    }),

  addIncome: (data) => api.post('/transactions/income', data),
  addExpense: (data) => api.post('/transactions/expense', data),

  updateIncome: (id, data) =>
    api.put(`/transactions/income/${id}`, data),

  updateExpense: (id, data) =>
    api.put(`/transactions/expense/${id}`, data),

  deleteIncome: (id) =>
    api.delete(`/transactions/income/${id}`),

  deleteExpense: (id) =>
    api.delete(`/transactions/expense/${id}`),
};

// ================= REPORTS =================
export const reportsAPI = {
  downloadFinancialReport: () =>
    api.get('/reports/financial-report', {
      responseType: 'blob',
    }),
};

// ================= ADMIN =================
export const adminAPI = {
  getAllUsers: () => api.get('/admin/users'),
  getUserById: (userId) => api.get(`/admin/users/${userId}`),
  activateUser: (userId) =>
    api.post(`/admin/users/${userId}/activate`),
  deactivateUser: (userId) =>
    api.post(`/admin/users/${userId}/deactivate`),
  getStatistics: () => api.get('/admin/statistics'),
};

// ================= USER DATA =================
export const userDataAPI = {
  resetData: () => api.delete('/userdata/reset'),
};

export default api;
