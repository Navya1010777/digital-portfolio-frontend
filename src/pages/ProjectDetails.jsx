import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user, isStudent } = useAuth();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        // Get project details
        const projectResponse = await api.getProjectById(id);
        setProject(projectResponse.data);
        
        // Get associated portfolio details
        const portfolioResponse = await api.getPortfolioById(projectResponse.data.portfolioId);
        setPortfolio(portfolioResponse.data);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load project details');
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  const isOwner = portfolio && user && portfolio.studentId === user.id;

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await api.deleteProject(id);
        // Navigate back to the portfolio page
        navigate(`/portfolios/${project.portfolioId}`);
      } catch (err) {
        setError('Failed to delete project');
      }
    }
  };

  if (loading) {
    return <div className="container mx-auto p-6 text-center">Loading project details...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            className="mt-3 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            onClick={() => navigate(`/portfolios/${project?.portfolioId || ''}`)}
          >
            Return to Portfolio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
                Dashboard
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link to={`/portfolios/${project.portfolioId}`} className="text-gray-700 hover:text-blue-600">
                  Portfolio
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500">{project.title}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Project Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
            <p className="text-gray-600 mb-4">
              Added on {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>
          
          {isOwner && (
            <div className="flex space-x-2">
              <Link
                to={`/projects/${id}/edit`}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                Edit Project
              </Link>
              <button
                onClick={handleDeleteProject}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Project Content */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {/* Project Image */}
        {project.imageUrl && (
          <div className="mb-6">
            <img 
              src={project.imageUrl} 
              alt={project.title} 
              className="w-full max-h-96 object-contain rounded"
            />
          </div>
        )}
        
        {/* Project Description */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Description</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line">{project.description}</p>
          </div>
        </div>
        
        {/* Project Link */}
        {project.projectLink && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Project Link</h2>
            <a 
              href={project.projectLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 underline"
            >
              {project.projectLink}
            </a>
          </div>
        )}
      </div>
      
      {/* Return to Portfolio Button */}
      <div className="flex justify-center mt-6">
        <Link
          to={`/portfolios/${project.portfolioId}`}
          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded"
        >
          Back to Portfolio
        </Link>
      </div>
    </div>
  );
};

export default ProjectDetails;