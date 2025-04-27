import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const EditProject = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    projectLink: '',
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const projectResponse = await api.getProjectById(id);
        const project = projectResponse.data;
        
        // Fetch portfolio to check ownership
        const portfolioResponse = await api.getPortfolioById(project.portfolioId);
        setPortfolio(portfolioResponse.data);
        
        // Check if the current user owns this portfolio/project
        if (portfolioResponse.data.studentId !== user.id) {
          setError('You do not have permission to edit this project');
          return;
        }
        
        // Set form data from project
        setFormData({
          title: project.title || '',
          description: project.description || '',
          imageUrl: project.imageUrl || '',
          projectLink: project.projectLink || '',
        });
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load project details');
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id, user.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Project title is required');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      await api.updateProject(id, formData);
      navigate(`/projects/${id}`);
    } catch (err) {
      setError('Failed to update project');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-6 text-center">Loading project details...</div>;
  }

  if (error && error.includes('permission')) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            className="mt-3 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            onClick={() => navigate('/dashboard')}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Project</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title*
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {formData.imageUrl && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">Preview:</p>
                <img 
                  src={formData.imageUrl} 
                  alt="Preview" 
                  className="max-h-40 rounded border"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="projectLink" className="block text-sm font-medium text-gray-700 mb-1">
              Project Link
            </label>
            <input
              type="url"
              id="projectLink"
              name="projectLink"
              value={formData.projectLink}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/projects/${id}`)}
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProject;