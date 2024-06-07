import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../utils/queries';

import Auth from '../utils/auth';

const Profile = () => {
  const { username: userParam } = useParams();
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });

  // const user = data?.me || data?.user || {};
  const user = { username: 'testuser' };

  const navigate = useNavigate();

  const goToLoginPage = () => {
    navigate('/login');
  }

  const goToSignUpPage = () => {
    navigate('/signup');
  }

  // if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
  //   return <Navigate to="/myprofile" />;
  // }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user?.username) {
    return (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">You're signed out!</h1>
            <p className="py-6">You need to be logged in to see this. Click below or use the navigation links above to sign up or log in!</p>
            <button onClick={goToLoginPage} className="btn btn-primary m-2">Login</button>
            <button onClick={goToSignUpPage} className="btn btn-primary m-2">Sign Up</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="pt-16 bg-blueGray-50">
      <div className="w-full lg:w-4/12 px-4 mx-auto">
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16">
          <div className="px-6">
            <div className="flex flex-wrap justify-center">
              <div className="w-full px-4 flex justify-center">
                <div className="avatar relative">
                  <div className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 max-w-150-px">
                    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                  </div>
                </div>
              </div>
              <div className="w-full px-4 text-center mt-20">
                <div className="flex justify-center lg:pt-4 pt-8">
                  <div className="flex flex-col items-center mr-4 p-1">
                    <button onClick={() => navigate('/social')} className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                      22
                    </button>
                    <button onClick={() => navigate('/social')} className="text-sm text-blueGray-400">Friends</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-4">
              <h3 className="text-xl font-bold leading-normal mb-2 text-blueGray-700">
                Chase Friedman
              </h3>
              <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                Los Angeles, California
              </div>
              <div className="mb-2 text-blueGray-600 mt-10">
                <p>
                  Bio
                </p>
              </div>
            </div>
            <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
              <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-9/12 px-4">
                  <h3 className="text-xl font-bold leading-normal mb-2 text-blueGray-700">
                    Recent Activity
                  </h3>
                  <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                    ReadyCheck Title 1
                  </p>
                  <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                    ReadyCheck Title 1
                  </p>
                  <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                    ReadyCheck Title 1
                  </p>
                  <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                    ReadyCheck Title 1
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
