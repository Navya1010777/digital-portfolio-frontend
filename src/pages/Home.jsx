// src/pages/Home.jsx
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="text-center mt-10">
      <h1 className="text-4xl font-bold">Welcome to the Digital Portfolio</h1>
      <div className="mt-6">
        <Link to="/register" className="text-blue-500 hover:underline mx-4">Register</Link>
        <Link to="/login" className="text-blue-500 hover:underline mx-4">Login</Link>
      </div>
    </div>
  );
}

export default Home;