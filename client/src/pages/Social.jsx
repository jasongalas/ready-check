import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../utils/queries';

import Auth from '../utils/auth';

const Social = () => {
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
    //     return <Navigate to="/social" />;
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
        <main>
            <div className="flex flex-col w-full lg:flex-row">
                <div className="grid flex-grow h-fill w-1/2 card bg-base-300 rounded-box place-items-center m-6">
                    <h1 className='text-3xl font-bold'>Friends List</h1>
                    <div className="card w-96 bg-base-100 shadow-xl">
                        <div className="card-body h-96 w-full ml-6">
                            <p>Friend 1</p>
                            <p>Friend 2</p>
                            <p>Friend 3</p>
                            <p>Friend 4</p>
                            <p>Friend 5</p>
                        </div>
                    </div>
                </div>
                <div className="divider lg:divider-horizontal"></div>
                <div className="flex-grow h-fill w-1/2 card bg-base-300 rounded-box place-items-center m-6">
                    <h1 className='text-3xl font-bold my-7'>Add a Friend</h1>
                    <div className="card w-96 bg-base-100 shadow-xl mt-8">
                        <div className="card-body p-12 w-full">
                            <label className="input input-bordered flex items-center gap-2 mb-4">
                                Username
                                <input type="text" className="grow" />
                            </label>
                            <button className="btn btn-primary">Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Social;
