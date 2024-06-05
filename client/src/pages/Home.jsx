import { useState } from 'react';
import { useQuery } from '@apollo/client';

// import ReadyCheckForm from '../components/ReadyCheckForm';

const Home = () => {
  // Placeholder for user authentication 
  const isAuthenticated = true;  

  const [isModalOpen, setModalOpen] = useState(false);

  return (
    
   
       <main>
          {isAuthenticated ? (
            <div className="flex flex-wrap justify-center gap-4">
              <div className="card w-96 bg-accent text-primary-content">
                <div className="card-body">
                  <h2 className="card-title">Active ReadyChecks</h2>
                  <div className="card-actions justify-end">
                    <button className="btn" onClick={() => window.location.href = '/active-readychecks'}>Select</button>
                  </div>
                </div>
              </div>
              <div className="card w-96 bg-primary text-primary-content">
                <div className="card-body">
                  <h2 className="card-title">New ReadyCheck</h2>
                  <div className="card-actions justify-end">
                    <button className="btn" onClick={() => setModalOpen(true)}>Select</button>
                  </div>
                </div>
              </div>
              <div className="card w-96 bg-success text-primary-content">
                <div className="card-body">
                  <h2 className="card-title">Social</h2>
                  <div className="card-actions justify-end">
                    <button className="btn" onClick={() => window.location.href = '/social'}>Select</button>
                  </div>
                </div>
              </div>
              <div className="card w-96 bg-warning text-primary-content">
                <div className="card-body">
                  <h2 className="card-title">Profile</h2>
                  <div className="card-actions justify-end">
                    <button className="btn" onClick={() => window.location.href = '/profile'}>Select</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="hero min-h-screen bg-base-200">
              <div className="hero-content text-center">
                <div className="max-w-md">
                  <h1 className="text-5xl font-bold">Welcome to Ready Check!</h1>
                  <p className="py-6">An app where you can invite friends to join you while playing video games!</p>
                  <button onClick={() => window.location.href = '/signup'}>New here? Sign up!</button>
                  <button onClick={() => window.location.href = '/login'}>Already have an account? Log in!</button>
                </div>
              </div>
            </div>
        )}
      {/* {isModalOpen && (<ReadyCheckForm closeModal={() => setModalOpen(false)} />)}  */}
      </main>

  );
};

export default Home;
