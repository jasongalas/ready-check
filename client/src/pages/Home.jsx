import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import ReadyCheckForm from '../components/ReadyCheckForm';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import { AuthServiceInstance } from '../utils/auth';

const Home = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { username: userParam } = useParams();
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });

  const user = data?.me || data?.getUser || {};

  useEffect(() => {
    setIsAuthenticated(AuthServiceInstance.loggedIn());
  }, []);

  const openReadyCheckForm = () => {
    document.getElementById('readyCheckModal').showModal();
  };

  return (
    <main className='mx-6'>
      {isAuthenticated ? (
        <div className="flex flex-col w-full lg:flex-row">
          <div className="flex flex-wrap w-2/3 justify-center gap-4">
          <button onClick={openReadyCheckForm} className="btn btn-sky card m-10 h-fill w-full bg-sky-600 hover:bg-aquamarine text-primary-content shadow-xl">
              <div className="card-body text-white text-center mt-14">
                <h2 className="text-center font-bold text-6xl m-5">New ReadyCheck</h2>
                <div className='m-3'>
                  <p className='text-xl font-semibold mb'>Create a new notification to send out to your friends!</p>
                  <div className='m-4'>
                    <ul className='text-lg'>
                      <li>• Group up for a gaming session</li>
                      <li>• Meet up for some pickleball</li>
                      <li>• See who's in for Cabo!</li>
                    </ul>
                  </div>
                  <p className='text-xl font-semibold mb'>The world is your oyster!</p>
                </div>
              </div>
            </button>

            <dialog id="readyCheckModal" className="modal">
              <div className="modal-box">
                <form method="dialog">
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <ReadyCheckForm userId={user._id} />
              </div>
            </dialog>
          </div>
          <div className="divider lg:divider-horizontal"></div>
          <div className="flex flex-wrap w-1/2 justify-center gap-4">
            <button onClick={() => navigate('/readychecks')} className="btn bg-dark-green hover:bg-green-hover card mt-10 py-20 w-full text-primary-content shadow-xl">
              <div className="card-body text-white text-center">
                <h2 className="text-center font-bold text-4xl m-3">Active ReadyChecks</h2>
              </div>
            </button>
            <button onClick={() => navigate('/social')} className="btn bg-blue-btn hover:bg-blue-hover card py-20 w-full text-primary-content shadow-xl">
              <div className="card-body text-white text-center">
                <h2 className="text-center font-bold text-4xl m-3">Social</h2>
              </div>
            </button>
            <button onClick={() => navigate('/myprofile')} className="btn bg-navy-blue hover:bg-navy-blue-hover card py-20 w-full text-primary-content shadow-xl">
              <div className="card-body text-white text-center">
                <h2 className="text-center font-bold text-4xl m-3">Profile</h2>
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className="hero min-h-screen bg-base-200">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">Welcome to Ready Check!</h1>
              <p className="py-6">An app where you can invite friends to join you while playing video games!</p>
              <button className='text-primary' onClick={() => navigate('/signup')}>New here? Sign up!</button>
              <br></br>
              <button className='text-primary' onClick={() => navigate('/login')}>Already have an account? Log in!</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
