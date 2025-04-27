import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';

// Import pages
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/Dashboard';
import PortfolioDetails from './pages/PortfolioDetails';
import CreatePortfolio from './pages/CreatePortfolio';
import EditPortfolio from './pages/EditPortfolio';
import NotFound from './pages/notFound';
import AddAchievement from './pages/AddAchievement';
import AddProject from './pages/AddProject';
import ProjectDetails from './pages/ProjectDetails';
import EditProject from './pages/EditProject';
import EditAchievement from './pages/EditAchievement';
import TeacherPortfolioView from './pages/TeacherPortfolioView';

// Private route component
const PrivateRoute = ({ element, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  
  return element;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Private routes */}
          <Route
            path="/dashboard"
            element={<PrivateRoute element={<Dashboard />} />}
          />
          
          {/* Student Portfolio routes */}
          <Route
            path="/portfolios/:id"
            element={<PrivateRoute element={<PortfolioDetails />} />}
          />
          <Route
            path="/portfolios/create"
            element={<PrivateRoute element={<CreatePortfolio />} allowedRoles={['STUDENT']} />}
          />
          <Route
            path="/portfolios/edit/:id"
            element={<PrivateRoute element={<EditPortfolio />} allowedRoles={['STUDENT']} />}
          />
          <Route
            path="/portfolios/:portfolioId/achievements/new"
            element={<PrivateRoute element={<AddAchievement />} allowedRoles={['STUDENT']} />}
          />
          <Route
            path="/portfolios/:portfolioId/projects/new"
            element={<PrivateRoute element={<AddProject />} allowedRoles={['STUDENT']} />}
          />
          
          {/* Teacher Portfolio View */}
          <Route
            path="/teacher/portfolios/:id"
            element={<PrivateRoute element={<TeacherPortfolioView />} allowedRoles={['TEACHER']} />}
          />
          
          {/* Project routes */}
          <Route
            path="/projects/:id"
            element={<PrivateRoute element={<ProjectDetails />} />}
          />
          <Route
            path="/projects/:id/edit"
            element={<PrivateRoute element={<EditProject />} allowedRoles={['STUDENT']} />}
          />
          
          {/* Achievement routes */}
          <Route
            path="/achievements/:id/edit"
            element={<PrivateRoute element={<EditAchievement />} allowedRoles={['STUDENT']} />}
          />
          
          {/* Redirect root to dashboard if logged in, otherwise to login */}
          <Route
            path="/"
            element={<Navigate to="/dashboard" />}
          />
          
          {/* Not found page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;