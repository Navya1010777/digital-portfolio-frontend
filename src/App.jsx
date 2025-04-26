// src/App.jsx
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <h1 className="text-center text-4xl font-bold my-8">Digital Portfolio Platform</h1>
      <Link to="/" className="block text-center text-blue-500">Go to Home</Link>
    </div>
  );
}

export default App;