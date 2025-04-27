import React from 'react';

const NotFound = () => {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-light text-gray-800">404</h1>
        <div className="h-px w-16 bg-gray-300 mx-auto my-6"></div>
        <h2 className="text-xl font-normal text-gray-700 mb-2">Page not found</h2>
        <p className="text-gray-500">The page you're looking for doesn't exist or has been moved.</p>
      </div>
    </div>
  );
};

export default NotFound;