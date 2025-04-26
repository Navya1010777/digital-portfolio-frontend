import { useState } from 'react';
import { registerUser } from '../utils/api';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'STUDENT', // default role
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await registerUser(formData);

      if (result && result.token) {
        setSuccessMessage('Registration successful! Redirecting to login...');
        setErrorMessage('');
        localStorage.setItem("token", result.token);
        console.log("User registered and token stored:", result.token);

        setTimeout(() => navigate('/login'), 1500);
      } else {
        setSuccessMessage('');
        setErrorMessage('Registration failed. Please try again.');
        console.error("Token not received from backend");
      }
    } catch (error) {
      setSuccessMessage('');
      setErrorMessage('Registration failed. Please try again. ' + error);
    }
  };

  return (

    <div className="max-w-md mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-6 text-black">Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-semibold text-gray-600">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg mt-2 text-black"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-600">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg mt-2 text-black"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-600">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg mt-2 text-black"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="role" className="block text-sm font-semibold text-gray-600">Select Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg mt-2 text-black"
            required
          >
            <option value="STUDENT">Student</option>
            <option value="TEACHER">Teacher</option>
          </select>
        </div>
        {errorMessage && <div className="text-red-500 mb-2">{errorMessage}</div>}
        {successMessage && <div className="text-green-500 mb-2">{successMessage}</div>}
        <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Register
        </button>
      </form>
    </div>

  );
}

export default Register;
