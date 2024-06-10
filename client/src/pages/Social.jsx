import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER, QUERY_ME, QUERY_USER_BY_USERNAME } from '../utils/queries';
import { REMOVE_FRIEND } from '../utils/mutations';
import { useState, useEffect } from 'react';

const Social = () => {
    const { username: userParam } = useParams();
    const navigate = useNavigate();

    const { loading: loadingMe, data: dataMe, refetch: refetchMe } = useQuery(QUERY_ME);
    const { loading: loadingUser, data: dataUser, refetch: refetchUser } = useQuery(QUERY_USER, {
        variables: { username: userParam },
        skip: !userParam,
    });

    const [removeFriend] = useMutation(REMOVE_FRIEND);
    const [searchUsername, setSearchUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [searchResult, setSearchResult] = useState(null);

    const { loading: loadingSearch, data: searchData, refetch: refetchUserByUsername } = useQuery(QUERY_USER_BY_USERNAME, {
        variables: { username: searchUsername },
        skip: true,
    });

    const user = dataMe?.me || dataUser?.getUser || {};

    useEffect(() => {
        if (searchData?.getUserByUsername) {
            setSearchResult(searchData.getUserByUsername);
        } else {
            setSearchResult(null);
        }
    }, [searchData]);

    const goToLoginPage = () => {
        navigate('/login');
    };

    const goToSignUpPage = () => {
        navigate('/signup');
    };

    const handleSearch = async () => {
        if (searchUsername.trim() === '') {
            setErrorMessage('Please enter a username to search.');
            return;
        }
        setErrorMessage('');
        try {
            const { data } = await refetchUserByUsername({ username: searchUsername });
            setSearchResult(data?.getUserByUsername || null);
        } catch (error) {
            console.error('Error searching for user:', error);
            setErrorMessage('An error occurred while searching for the user.');
        }
    };

    const goToUserProfile = (userId) => {
        navigate(`/profile/${userId}`);
    };

    const handleRemoveFriend = async (username) => {
        try {
            await removeFriend({ variables: { username } });
            refetchMe();
            if (userParam) refetchUser();
        } catch (error) {
            console.error('Error removing friend:', error);
        }
    };

    if (loadingMe || (userParam && loadingUser)) {
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
        <main className='h-fill1'>
            <div className="flex flex-col w-full lg:flex-row">
                <div className="grid flex-grow h-fill w-1/2 card bg-darker-background rounded-box place-items-center m-6">
                    <h1 className="text-5xl text-white font-bold">Friends List</h1>
                    <div className="card w-96 bg-neutral-700 shadow-xl">
                        <div className="card-body text-navy-blue h-96 w-full">
                            {user.friends && user.friends.length > 0 ? (
                                user.friends.map((friend) => (
                                    <div key={friend._id} className="flex items-center justify-between">
                                        <button
                                            className="btn font-bold text-2xl"
                                            onClick={() => goToUserProfile(friend._id)}
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
                                <p className="text-white text-center">No friends found</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="divider lg:divider-horizontal"></div>
                <div className="flex-grow h-fill w-1/2 card bg-darker-background rounded-box place-items-center m-6">
                    <h1 className="text-5xl text-white font-bold my-7">Find a Friend</h1>
                    <div className="card w-96 bg-neutral-700 shadow-xl mt-8">
                        <div className="card-body p-12 w-full">
                            <label className="input input-bordered flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                                </svg>
                                <input
                                    type="text"
                                    className="grow"
                                    placeholder="Username"
                                    value={searchUsername}
                                    onChange={(e) => setSearchUsername(e.target.value)}
                                />
                            </label>
                            <button className="btn btn-primary mt-4" onClick={handleSearch} disabled={loadingSearch}>
                                {loadingSearch ? 'Searching...' : 'Search'}
                            </button>
                            {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
                            <div className="mt-4">
                                {searchResult ? (
                                    <div className="flex items-center justify-between mb-2">
                                        <span>{searchResult.username}</span>
                                        <button
                                            className="btn btn-sm btn-primary ml-2"
                                            onClick={() => goToUserProfile(searchResult._id)}
                                        >
                                            View Profile
                                        </button>
                                    </div>
                                ) : (
                                    searchUsername && !loadingSearch && <p>No users found</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Social;
