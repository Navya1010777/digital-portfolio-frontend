import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { MessageSquare, Calendar, Trash, Send } from 'lucide-react';

const FeedbackComponent = ({ portfolioId }) => {
  const { isTeacher } = useAuth();
  
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackText, setFeedbackText] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await api.getFeedbackByPortfolio(portfolioId);
        setFeedbacks(response.data);
        setLoading(false);
      } catch (err) {
        setFeedbackError('Failed to load feedback');
        setLoading(false);
      }
    };
    
    fetchFeedbacks();
  }, [portfolioId]);
  
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    
    setSubmittingFeedback(true);
    setFeedbackError('');
    
    try {
      const response = await api.createFeedback({ comment: feedbackText }, portfolioId);
      setFeedbacks([...feedbacks, response.data]);
      setFeedbackText('');
      setSubmittingFeedback(false);
    } catch (err) {
      setFeedbackError('Failed to submit feedback');
      setSubmittingFeedback(false);
    }
  };
  
  const handleDeleteFeedback = async (feedbackId) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await api.deleteFeedback(feedbackId);
        setFeedbacks(feedbacks.filter(feedback => feedback.id !== feedbackId));
      } catch (err) {
        setFeedbackError('Failed to delete feedback');
      }
    }
  };
  
  if (loading) {
    return (
      <div className="animate-pulse p-4">
        <div className="h-6 bg-indigo-100 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-20 bg-indigo-50 rounded"></div>
          <div className="h-20 bg-indigo-50 rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          <span className="text-indigo-600">Teacher Feedback</span> 
        </h2>
        <span className="bg-indigo-100 text-indigo-600 text-sm py-1 px-3 rounded-full">
          {feedbacks.length}
        </span>
      </div>
      
      {feedbackError && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
          <p className="font-medium">{feedbackError}</p>
        </div>
      )}
      
      {feedbacks.length === 0 ? (
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-12 text-center mb-6">
          <div className="flex justify-center mb-4 text-indigo-400">
            <MessageSquare size={40} />
          </div>
          <p className="text-gray-500 italic">No feedback provided yet.</p>
          {isTeacher() && (
            <p className="mt-2 text-indigo-600">Be the first to provide feedback for this portfolio!</p>
          )}
        </div>
      ) : (
        <div className="space-y-5 mb-8">
          {feedbacks.map(feedback => (
            <div 
              key={feedback.id} 
              className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow border-l-4 border-indigo-500"
            >
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 text-indigo-600 p-2 rounded-full">
                  <MessageSquare size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-800">
                      {feedback.teacherName || 'Teacher'}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      {isTeacher() && feedback.teacherId === localStorage.getItem('userId') && (
                        <button
                          onClick={() => handleDeleteFeedback(feedback.id)}
                          className="text-red-500 hover:text-red-700 flex items-center gap-1 hover:bg-red-50 p-1 rounded transition-colors"
                          title="Delete feedback"
                        >
                          <Trash size={14} />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{feedback.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Feedback Form (Only for Teachers) */}
      {isTeacher() && (
        <div className="mt-8">
          <div className="bg-indigo-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-indigo-800 mb-4 flex items-center gap-2">
              <MessageSquare size={20} />
              Provide Feedback
            </h3>
            
            <form onSubmit={handleSubmitFeedback}>
              <div className="mb-4">
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows="4"
                  className="w-full p-4 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-shadow bg-white"
                  placeholder="Share your professional feedback about this portfolio..."
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className={`flex items-center gap-2 py-2 px-6 rounded-full shadow-md transition-all ${
                    submittingFeedback 
                      ? 'bg-indigo-400 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'
                  } text-white`}
                  disabled={submittingFeedback}
                >
                  {submittingFeedback ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Submit Feedback</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackComponent;