import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Award, Bookmark, Send, Calendar, ExternalLink } from 'lucide-react';
import api from '../services/api';

const TeacherPortfolioView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isTeacher } = useAuth();
    const [portfolio, setPortfolio] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        // Check if user is a teacher
        if (!isTeacher()) {
            navigate('/dashboard');
            return;
        }

        const fetchPortfolio = async () => {
            try {
                const response = await api.getPortfolioById(id);
                setPortfolio(response.data);
            } catch (err) {
                setError('Failed to load portfolio details. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolio();
    }, [id, isTeacher, navigate]);

    const handleSubmitFeedback = async (e) => {
        e.preventDefault();

        if (!feedback.trim()) {
            setError('Feedback cannot be empty.');
            return;
        }

        try {
            setSubmitting(true);

            const feedbackData = {
                comment: feedback,
                portfolioId: portfolio.id,
                teacherId: user.id
            };

            await api.createFeedback(feedbackData, portfolio.id);

            // Refresh portfolio data to include the new feedback
            const response = await api.getPortfolioById(id);
            setPortfolio(response.data);

            setFeedback(''); // Clear the form
            setSubmitSuccess(true);
            setTimeout(() => setSubmitSuccess(false), 3000); // Hide success message after 3 seconds
        } catch (err) {
            setError('Failed to submit feedback. Please try again.');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen w-full bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="p-8 bg-white rounded-2xl shadow-lg">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-lg font-medium text-indigo-700">Loading portfolio details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!portfolio) {
        return (
            <div className="flex justify-center items-center h-screen w-full bg-gradient-to-br from-red-50 to-pink-50">
                <div className="p-8 bg-white rounded-2xl shadow-lg">
                    <p className="text-lg font-medium text-red-600">Portfolio not found.</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="mt-4 flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 to-purple-50">
            {/* Header with glass morphism effect */}
            <header className="sticky top-0 z-10 backdrop-blur-md bg-white/70 shadow-sm">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 hover:bg-indigo-200 transition-all"
                                aria-label="Back to Dashboard"
                            >
                                <ArrowLeft className="w-5 h-5 text-indigo-700" />
                            </button>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Student Portfolio
                            </h1>
                        </div>
                        <div className="text-sm font-medium text-gray-500">
                            Teacher View
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Notification messages */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg shadow-sm animate-fade-in">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {submitSuccess && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg shadow-sm animate-fade-in">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-green-700">Feedback submitted successfully!</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Portfolio Header Card */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 transform transition-all hover:shadow-xl">
                    <div className="px-6 py-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div>
                                <h2 className="text-2xl font-bold">{portfolio.title}</h2>
                                <p className="mt-2 text-indigo-100 flex items-center">
                                    <span className="font-medium">{portfolio.studentName || portfolio.studentUsername}</span>
                                </p>
                            </div>
                            <div className="mt-4 md:mt-0 flex items-center text-indigo-100">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>Created: {new Date(portfolio.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                    <div className="px-6 py-5">
                        <div className="prose max-w-none">
                            <p className="text-gray-700">{portfolio.description || 'No description provided.'}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Projects Section */}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-100 flex items-center">
                                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center mr-4">
                                    <Bookmark className="w-5 h-5 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">Projects</h3>
                            </div>

                            {portfolio.projects && portfolio.projects.length > 0 ? (
                                <div className="divide-y divide-gray-100">
                                    {portfolio.projects.map((project) => (
                                        <div key={project.id} className="px-6 py-6 hover:bg-indigo-50 transition-colors">
                                            <div className="flex flex-col md:flex-row md:space-x-6">
                                                {project.imageUrl && (
                                                    <div className="flex-shrink-0 mb-4 md:mb-0">
                                                        <img
                                                            src={project.imageUrl}
                                                            alt={project.title}
                                                            className="w-full md:w-48 h-auto object-cover rounded-lg shadow-md"
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex-grow">
                                                    <h4 className="text-lg font-semibold text-gray-900">{project.title}</h4>
                                                    <p className="mt-2 text-gray-600">
                                                        {project.description || 'No description provided.'}
                                                    </p>
                                                    {project.projectLink && (
                                                        <a
                                                            href={project.projectLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="mt-3 inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                                                        >
                                                            <ExternalLink className="w-4 h-4 mr-2" />
                                                            View Project
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="px-6 py-10 text-center">
                                    <p className="text-gray-500">No projects added to this portfolio.</p>
                                </div>
                            )}
                        </div>

                        {/* Achievements Section */}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-100 flex items-center">
                                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center mr-4">
                                    <Award className="w-5 h-5 text-amber-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">Achievements</h3>
                            </div>

                            {portfolio.achievements && portfolio.achievements.length > 0 ? (
                                <div className="divide-y divide-gray-100">
                                    {portfolio.achievements.map((achievement) => (
                                        <div key={achievement.id} className="px-6 py-6 hover:bg-amber-50 transition-colors">
                                            <div className="flex items-start">
                                                <div className="hidden md:block mr-4">
                                                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                                                        <Award className="w-5 h-5 text-amber-600" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-semibold text-gray-900">{achievement.title}</h4>
                                                    <p className="mt-2 text-gray-600">
                                                        {achievement.description || 'No description provided.'}
                                                    </p>
                                                    {achievement.dateAchieved && (
                                                        <p className="mt-2 text-sm text-gray-500 flex items-center">
                                                            <Calendar className="w-4 h-4 mr-1" />
                                                            {new Date(achievement.dateAchieved).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="px-6 py-10 text-center">
                                    <p className="text-gray-500">No achievements added to this portfolio.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Add Feedback Form */}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-100">
                                <h3 className="text-xl font-semibold text-gray-900">Provide Feedback</h3>
                            </div>
                            <div className="px-6 py-6">
                                <form onSubmit={handleSubmitFeedback}>
                                    <div className="mb-4">
                                        <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                                            Your Feedback
                                        </label>
                                        <textarea
                                            id="feedback"
                                            rows="6"
                                            className="block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                            disabled={submitting}
                                            placeholder="Enter your feedback for this portfolio..."
                                        ></textarea>
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className={`inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg shadow-sm ${submitting ? 'opacity-75 cursor-not-allowed' : 'hover:from-indigo-700 hover:to-purple-700'
                                                } transition-all`}
                                        >
                                            {submitting ? (
                                                <>
                                                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4 mr-2" />
                                                    Submit Feedback
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Previous Feedback Section */}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-xl font-semibold text-gray-900">Previous Feedback</h3>
                                {portfolio.feedbacks && portfolio.feedbacks.length > 0 && (
                                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full">
                                        {portfolio.feedbacks.length}
                                    </span>
                                )}
                            </div>

                            {portfolio.feedbacks && portfolio.feedbacks.length > 0 ? (
                                <div className="divide-y divide-gray-100">
                                    {portfolio.feedbacks.map((feedbackItem) => (
                                        <div key={feedbackItem.id} className="px-6 py-5 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-start space-x-4">
                                                <div className="flex-shrink-0">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-medium">
                                                        {feedbackItem.teacherName?.charAt(0) || 'T'}
                                                    </div>
                                                </div>
                                                <div className="flex-grow">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <p className="text-sm font-medium text-gray-900">{feedbackItem.teacherName}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(feedbackItem.createdAt).toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                                                        {feedbackItem.comment}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="px-6 py-10 text-center">
                                    <p className="text-gray-500">No feedback provided yet.</p>
                                    <p className="text-sm text-gray-400 mt-1">Be the first to provide feedback!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TeacherPortfolioView;