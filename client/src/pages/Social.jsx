import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../utils/queries';

import Auth from '../utils/auth';

const Social = () => {
    const { username: userParam } = useParams();
    const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
        variables: { username: userParam },
    });

    const user = data?.me || data?.user || {};

    const navigate = useNavigate();
    
    const goToLoginPage = () => {
        navigate('/login');
      }

    const goToSignUpPage = () => {
    navigate('/signup');
    }

    if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
        return <Navigate to="/social" />;
    }

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
        <div>
            Hi
            <div className="flex-row justify-center mb-3">
                <h2 className="col-12 col-md-10 bg-dark text-light p-3 mb-5">
                    Viewing {userParam ? `${user.username}'s` : 'your'} profile.
                </h2>
            </div>
        </div>
    );
};

export default Social;
