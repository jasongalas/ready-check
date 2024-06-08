import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import { ADD_FRIEND, REMOVE_FRIEND } from '../utils/mutations';
import { useState } from 'react';
import { AuthServiceInstance } from '../utils/auth';

const Social = () => {
    const { username: userParam } = useParams();
    const { loading, data, refetch } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
        variables: { username: userParam },
    });

    const [addFriend] = useMutation(ADD_FRIEND);
    const [removeFriend] = useMutation(REMOVE_FRIEND);
    const [friendUsername, setFriendUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const user = data?.me || data?.getUser || {};

    const navigate = useNavigate();

    const goToLoginPage = () => {
        navigate('/login');
    };

    const goToSignUpPage = () => {
        navigate('/signup');
    };

    const handleAddFriend = async () => {
        try {
            await addFriend({ variables: { username: friendUsername } });
            setFriendUsername('');
            setErrorMessage('');
            refetch(); // Refetch the user data to get the updated friends list
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handleRemoveFriend = async (username) => {
        try {
            await removeFriend({ variables: { username } });
            refetch(); // Refetch the user data to get the updated friends list
        } catch (error) {
            console.error('Error removing friend:', error);
        }
    };

    const goToFriendProfile = (friendId) => {
        navigate(`/profile/${friendId}`);
    };

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
        );
    }

    return (
        <main>
            <div className="flex flex-col w-full lg:flex-row">
                <div className="grid flex-grow h-fill w-1/2 card bg-darker-background rounded-box place-items-center m-6">
                    <h1 className="text-3xl text-navy-blue font-bold">Friends List</h1>
                    <div className="card w-96 bg-green-hover shadow-xl">
                        <div className="card-body text-navy-blue h-96 w-full">
                            {user.friends && user.friends.length > 0 ? (
                                user.friends.map((friend) => (
                                    <div key={friend._id} className="flex items-center justify-between">
                                        <button
                                            className="btn font-bold text-2xl"
                                            onClick={() => goToFriendProfile(friend._id)}
                                        >
                                            {friend.username}
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger ml-2"
                                            onClick={() => handleRemoveFriend(friend.username)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p>No friends found</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="divider lg:divider-horizontal"></div>
                <div className="flex-grow h-fill w-1/2 card bg-darker-background rounded-box place-items-center m-6">
                    <h1 className="text-3xl text-navy-blue font-bold my-7">Add a Friend</h1>
                    <div className="card w-96 bg-blue-btn shadow-xl mt-8">
                        <div className="card-body p-12 w-full">
                            <label className="input input-bordered flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
                                <input
                                    type="text"
                                    className="grow"
                                    placeholder="Username"
                                    value={friendUsername}
                                    onChange={(e) => setFriendUsername(e.target.value)}
                                />
                            </label>
                            <button className="btn btn-primary mt-4" onClick={handleAddFriend}>Add</button>
                            {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Social;
