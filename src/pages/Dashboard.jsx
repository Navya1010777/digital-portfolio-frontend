import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Search, LogOut, Plus, ChevronRight, Edit } from 'lucide-react';

const Dashboard = () => {
  const { user, isStudent, isTeacher, logout } = useAuth();
  const [portfolios, setPortfolios] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPortfolios, setFilteredPortfolios] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (isStudent()) {
          const response = await api.getAllPortfolios();
          setPortfolios(response.data);
          setFilteredPortfolios(response.data);
        } else if (isTeacher()) {
          const studentsResponse = await api.getAllStudents();
          setStudents(studentsResponse.data);
          
          const portfoliosResponse = await api.getAllPortfolios();
          setPortfolios(portfoliosResponse.data);
          setFilteredPortfolios(portfoliosResponse.data);
        }
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isStudent, isTeacher]);

  useEffect(() => {
    if (isTeacher() && portfolios.length > 0) {
      if (searchTerm.trim() === '') {
        setFilteredPortfolios(portfolios);
      } else {
        const filtered = portfolios.filter(portfolio => 
          portfolio.studentUsername?.toLowerCase().includes(searchTerm.toLowerCase()) || 
          portfolio.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          portfolio.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPortfolios(filtered);
      }
    }
  }, [searchTerm, portfolios, isTeacher]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="p-8 rounded-xl bg-white/80 backdrop-blur-sm shadow-xl">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-4 border-t-indigo-500 border-b-indigo-700 border-l-transparent border-r-transparent animate-spin"></div>
            <p className="mt-4 text-lg font-medium text-indigo-900">Loading your portfolio data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      <div className="bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center py-4 px-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">DP</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
                Portfolio Studio
              </h1>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center px-4 py-2 bg-indigo-50 rounded-full">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-medium">
                  {user?.fullName?.[0] || user?.username?.[0] || 'U'}
                </div>
                <span className="ml-2 text-indigo-900 font-medium">
                  {user?.fullName || user?.username} 
                  <span className="ml-1 text-xs py-0.5 px-2 bg-indigo-100 rounded-full text-indigo-700">
                    {isStudent() ? 'Student' : 'Teacher'}
                  </span>
                </span>
              </div>
              
              <button 
                onClick={logout}
                className="flex items-center px-4 py-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all text-gray-700 hover:text-indigo-700"
              >
                <LogOut size={16} className="mr-2" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-8 px-6">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-md shadow-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Student Dashboard */}
        {isStudent() && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">My Portfolio Collection</h2>
                <p className="text-gray-600 mt-1">Showcase your best work and track your progress</p>
              </div>
              <Link
                to="/portfolios/create"
                className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center"
              >
                <Plus size={18} className="mr-2" />
                Create New Portfolio
              </Link>
            </div>

            {portfolios.length === 0 ? (
              <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-xl p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Plus size={32} className="text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Start Your Journey</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  You haven't created any portfolios yet. Create your first one to showcase your skills and achievements.
                </p>
                <Link
                  to="/portfolios/create"
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all inline-flex items-center"
                >
                  <Plus size={18} className="mr-2" />
                  Create Your First Portfolio
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolios.map((portfolio) => (
                  <div
                    key={portfolio.id}
                    className="bg-white/70 backdrop-blur-sm overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                  >
                    <div className="h-3 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {portfolio.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {portfolio.description || 'No description provided.'}
                      </p>
                      <div className="mt-6 flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span>Created: {new Date(portfolio.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 flex justify-between items-center">
                      <Link
                        to={`/portfolios/${portfolio.id}`}
                        className="flex items-center font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        View Details
                        <ChevronRight size={16} className="ml-1" />
                      </Link>
                      <Link
                        to={`/portfolios/edit/${portfolio.id}`}
                        className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
                      >
                        <Edit size={16} className="mr-1" />
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Teacher Dashboard */}
        {isTeacher() && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Student Portfolios</h2>
                <p className="text-gray-600 mt-1">Review and provide feedback on student work</p>
              </div>
              <div className="relative w-full md:w-auto">
                <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-md pl-4 pr-2 py-2">
                  <Search size={18} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by student or title..."
                    className="w-full md:w-64 ml-2 outline-none text-gray-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="p-1 ml-1 rounded-full hover:bg-gray-100"
                    >
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {filteredPortfolios.length === 0 ? (
              <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-xl p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Search size={32} className="text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Portfolios Found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {searchTerm 
                    ? "No portfolios match your search criteria. Try adjusting your search term." 
                    : "There are no student portfolios available at this time."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPortfolios.map((portfolio) => (
                  <div
                    key={portfolio.id}
                    className="bg-white/70 backdrop-blur-sm overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                  >
                    <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-300 to-purple-300 flex items-center justify-center text-white font-medium">
                          {portfolio.studentName?.[0] || portfolio.studentUsername?.[0] || 'S'}
                        </div>
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                          Student Work
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-1 truncate">
                        {portfolio.title}
                      </h3>
                      <p className="text-indigo-600 text-sm font-medium mb-2">
                        {portfolio.studentName || portfolio.studentUsername}
                      </p>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {portfolio.description || 'No description provided.'}
                      </p>
                      <div className="mt-4 flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span>Created: {new Date(portfolio.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4">
                      <Link
                        to={`/teacher/portfolios/${portfolio.id}`}
                        className="w-full inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
                      >
                        View & Provide Feedback
                        <ChevronRight size={16} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;