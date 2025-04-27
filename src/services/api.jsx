import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper method to set auth token
const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Auth endpoints
const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Portfolio endpoints
const portfolioService = {
  getAllPortfolios: () => api.get('/portfolios'),
  getPortfolioById: (id) => api.get(`/portfolios/${id}`),
  createPortfolio: (portfolio) => api.post('/portfolios', portfolio),
  updatePortfolio: (id, portfolio) => api.put(`/portfolios/${id}`, portfolio),
  deletePortfolio: (id) => api.delete(`/portfolios/${id}`),
};

// Project endpoints
const projectService = {
  getProjectById: (id) => api.get(`/projects/${id}`),
  getProjectsByPortfolio: (portfolioId) => api.get(`/projects/portfolio/${portfolioId}`),
  createProject: (project, portfolioId) => api.post(`/projects?portfolioId=${portfolioId}`, project),
  updateProject: (id, project) => api.put(`/projects/${id}`, project),
  deleteProject: (id) => api.delete(`/projects/${id}`),
};

// Achievement endpoints
const achievementService = {
  getAchievementById: (id) => api.get(`/achievements/${id}`),
  getAchievementsByPortfolio: (portfolioId) => api.get(`/achievements/portfolio/${portfolioId}`),
  createAchievement: (achievement, portfolioId) => api.post(`/achievements?portfolioId=${portfolioId}`, achievement),
  updateAchievement: (id, achievement) => api.put(`/achievements/${id}`, achievement),
  deleteAchievement: (id) => api.delete(`/achievements/${id}`),
};

// Feedback endpoints
const feedbackService = {
  getFeedbackById: (id) => api.get(`/feedback/${id}`),
  getFeedbackByPortfolio: (portfolioId) => api.get(`/feedback/portfolio/${portfolioId}`),
  createFeedback: (feedback, portfolioId) => api.post(`/feedback?portfolioId=${portfolioId}`, feedback),
  updateFeedback: (id, feedback) => api.put(`/feedback/${id}`, feedback),
  deleteFeedback: (id) => api.delete(`/feedback/${id}`),
};

// User endpoints
const userService = {
  getUserProfile: () => api.get('/users/profile'),
  updateUserProfile: (userData) => api.put('/users/profile', userData),
  getAllTeachers: () => api.get('/users/teachers'),
  getAllStudents: () => api.get('/users/students'),
  getUserById: (id) => api.get(`/users/${id}`),
  getStudentByUsername: (username) => api.get(`/users/student/${username}`),
  searchStudents: (query) => api.get(`/users/search?query=${query}`),
  getUserRole: () => api.get('/users/role')
};

// Export the base api instance
export default {
  ...authService,
  ...portfolioService,
  ...projectService,
  ...achievementService,
  ...feedbackService,
  ...userService,
  setAuthToken,
  get: api.get,
  post: api.post,
  put: api.put,
  delete: api.delete,
};