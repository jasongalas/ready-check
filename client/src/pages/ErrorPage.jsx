import { useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function ErrorPage() {
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState('Loading...');

  useEffect(() => {
    const fetchErrorMessage = async () => {
      try {
        const response = await fetch('/errorMessage.json');
        
        if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
          throw new Error('Failed to fetch error message');
        }
        
        const data = await response.json();
        setErrorMessage(data.message || '404 - Page Not Found');
      } catch (error) {
        console.error('Failed to fetch error message:', error);
        setErrorMessage('404 - Page Not Found');
      }
    };

    fetchErrorMessage();
  }, []);

  return (
    <div>
      <div className="card bg-white card-rounded w-75 mx-auto mt-5 p-4 shadow-lg">
        <div className="card-header bg-dark text-center text-white py-4">
          <h1 className="mb-3">{errorMessage}</h1>
          <p>No match for <code>{location.pathname}</code></p>
        </div>
        <div className="card-body text-center">
          <p className="mb-4">Sorry, the page you're looking for doesn't exist or has been moved.</p>
          <div className="mt-4">
            <ul className="list-unstyled">
              <li className="m-2">
                <Link to="/" className="btn btn-secondary">Go to Home</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
