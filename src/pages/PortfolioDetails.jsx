import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import FeedbackComponent from '../components/FeedbackComponent';
import { ArrowLeft, Edit, Trash, Plus, Eye, Award, Calendar } from 'lucide-react';

const PortfolioDetails = () => {
  const { id } = useParams();
  const { user, isStudent, isTeacher } = useAuth();
  const navigate = useNavigate();
  
  const [portfolio, setPortfolio] = useState(null);
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // For feedback form
  const [feedbackText, setFeedbackText] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        // Get portfolio details
        const portfolioResponse = await api.getPortfolioById(id);
        setPortfolio(portfolioResponse.data);
        
        // Get projects for this portfolio
        const projectsResponse = await api.getProjectsByPortfolio(id);
        setProjects(projectsResponse.data);
        
        // Get achievements for this portfolio
        const achievementsResponse = await api.getAchievementsByPortfolio(id);
        setAchievements(achievementsResponse.data);
        
        // Get feedback for this portfolio
        const feedbackResponse = await api.getFeedbackByPortfolio(id);
        setFeedbacks(feedbackResponse.data);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load portfolio details');
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, [id]);

  const isOwner = portfolio && user && portfolio.studentId === user.id;

  const handleDeletePortfolio = async () => {
    if (window.confirm('Are you sure you want to delete this portfolio? This action cannot be undone.')) {
      try {
        await api.deletePortfolio(id);
        navigate('/dashboard');
      } catch (err) {
        setError('Failed to delete portfolio');
      }
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    
    setSubmittingFeedback(true);
    setFeedbackError('');
    
    try {
      const response = await api.createFeedback({ comment: feedbackText }, id);
      setFeedbacks([...feedbacks, response.data]);
      setFeedbackText('');
      setSubmittingFeedback(false);
    } catch (err) {
      setFeedbackError('Failed to submit feedback');
      setSubmittingFeedback(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-indigo-100 rounded"></div>
            <div className="h-32 bg-indigo-50 rounded"></div>
            <div className="h-8 bg-indigo-100 rounded"></div>
          </div>
          <p className="mt-6 text-indigo-600 font-medium">Loading portfolio details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
        <div className="container mx-auto max-w-4xl">
          <button 
            onClick={() => navigate('/portfolios')}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Portfolios</span>
          </button>
          
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
            <p className="text-red-700 font-medium">{error}</p>
            <button 
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-full shadow-md transition-all"
              onClick={() => navigate('/portfolios')}
            >
              Return to Portfolios
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>
        
        {/* Portfolio Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-24 md:h-32"></div>
          <div className="p-6 md:p-8 -mt-10">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="bg-white p-4 rounded-xl shadow-md mb-4 md:mb-0 w-full md:w-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                  {portfolio.title}
                </h1>
                <p className="text-indigo-600 font-medium mt-1">
                  {portfolio.studentName || portfolio.studentUsername}
                </p>
                <p className="text-gray-500 text-sm flex items-center gap-1 mt-2">
                  <Calendar size={16} />
                  {new Date(portfolio.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              
              {isOwner && (
                <div className="flex space-x-3 self-end">
                  <Link
                    to={`/portfolios/edit/${portfolio.id}`}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-full shadow-md flex items-center gap-2 transition-all"
                  >
                    <Edit size={18} />
                    <span>Edit</span>
                  </Link>
                  <button
                    onClick={handleDeletePortfolio}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-full shadow-md flex items-center gap-2 transition-all"
                  >
                    <Trash size={18} />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
            
            {portfolio.description && (
              <div className="mt-8 bg-indigo-50 p-6 rounded-xl border-l-4 border-indigo-400">
                <p className="text-gray-700 leading-relaxed">{portfolio.description}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Projects Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-indigo-600">Projects</span> 
                <span className="bg-indigo-100 text-indigo-600 text-sm py-1 px-3 rounded-full">
                  {projects.length}
                </span>
              </h2>
              {isOwner && (
                <Link
                  to={`/portfolios/${id}/projects/new`}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-full shadow-md flex items-center gap-2 transition-all"
                >
                  <Plus size={18} />
                  <span>Add Project</span>
                </Link>
              )}
            </div>
            
            {projects.length === 0 ? (
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-12 text-center">
                <p className="text-gray-500 italic">No projects added yet.</p>
                {isOwner && (
                  <Link
                    to={`/portfolios/${id}/projects/new`}
                    className="mt-4 inline-block bg-indigo-100 hover:bg-indigo-200 text-indigo-600 py-2 px-6 rounded-full transition-all"
                  >
                    Create your first project
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map(project => (
                  <div key={project.id} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all group">
                    {project.imageUrl ? (
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={project.imageUrl} 
                          alt={project.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                          <div className="p-4 text-white w-full">
                            <h3 className="text-xl font-bold truncate">{project.title}</h3>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-32 bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
                        <h3 className="text-xl font-bold text-indigo-600">{project.title}</h3>
                      </div>
                    )}
                    
                    <div className="p-4">
                      {!project.imageUrl && (
                        <h3 className="text-xl font-bold mb-2 text-gray-800">{project.title}</h3>
                      )}
                      <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                      <div className="flex justify-between items-center">
                        <Link 
                          to={`/projects/${project.id}`} 
                          className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                        >
                          <Eye size={18} />
                          <span>View Details</span>
                        </Link>
                        <span className="text-sm text-gray-500">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Achievements Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-indigo-600">Achievements</span> 
                <span className="bg-indigo-100 text-indigo-600 text-sm py-1 px-3 rounded-full">
                  {achievements.length}
                </span>
              </h2>
              {isOwner && (
                <Link
                  to={`/portfolios/${id}/achievements/new`}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-full shadow-md flex items-center gap-2 transition-all"
                >
                  <Plus size={18} />
                  <span>Add Achievement</span>
                </Link>
              )}
            </div>
            
            {achievements.length === 0 ? (
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-12 text-center">
                <p className="text-gray-500 italic">No achievements added yet.</p>
                {isOwner && (
                  <Link
                    to={`/portfolios/${id}/achievements/new`}
                    className="mt-4 inline-block bg-indigo-100 hover:bg-indigo-200 text-indigo-600 py-2 px-6 rounded-full transition-all"
                  >
                    Add your first achievement
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {achievements.map(achievement => (
                  <div key={achievement.id} className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 border-l-4 border-amber-400 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <div className="text-amber-500 mt-1">
                          <Award size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{achievement.title}</h3>
                          <p className="text-gray-600 mt-1">{achievement.description}</p>
                          {achievement.dateAchieved && (
                            <p className="text-sm text-amber-600 mt-2 flex items-center gap-1">
                              <Calendar size={14} />
                              {new Date(achievement.dateAchieved).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {isOwner && (
                        <div className="flex space-x-2">
                          <Link
                            to={`/achievements/${achievement.id}/edit`}
                            className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                          >
                            <Edit size={16} />
                            <span>Edit</span>
                          </Link>
                          <button
                            onClick={() => {/* Add delete achievement handler */}}
                            className="text-red-500 hover:text-red-700 flex items-center gap-1"
                          >
                            <Trash size={16} />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Feedback Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              <span className="text-indigo-600">Feedback</span> 
            </h2>
            <FeedbackComponent portfolioId={id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDetails;