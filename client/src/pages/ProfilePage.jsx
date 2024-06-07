import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import { UPDATE_USER_BIO } from '../utils/mutations';
import { useState } from 'react';
import Auth from '../utils/auth';

const Profile = () => {
  const { username: userParam } = useParams();
  const { loading, data, refetch } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });

  const [updateUserBio] = useMutation(UPDATE_USER_BIO, {
    update(cache, { data: { updateUserBio } }) {
      cache.writeQuery({
        query: userParam ? QUERY_USER : QUERY_ME,
        data: {
          me: userParam ? undefined : updateUserBio,
          getUser: userParam ? updateUserBio : undefined,
        },
      });
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [newBio, setNewBio] = useState('');

  const user = data?.me || data?.getUser || {};

  const navigate = useNavigate();

  const goToLoginPage = () => {
    navigate('/login');
  };

  const goToSignUpPage = () => {
    navigate('/signup');
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setNewBio(user.bio || '');
  };

  const handleSubmit = async () => {
    try {
      const { data } = await updateUserBio({ variables: { bio: newBio } });
      console.log('Updated bio:', data);
      setIsEditing(false);
      refetch(); // This ensures the page is refetched and updated
    } catch (err) {
      console.error('Error updating bio:', err);
    }
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
    <main className="pt-16 bg-blueGray-50">
      <div className="w-full lg:w-4/12 px-4 mx-auto">
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16">
          <div className="px-6">
            <div className="flex flex-wrap justify-center">
              <div className="w-full px-4 flex justify-center">
                <div className="avatar relative">
                  <div className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 max-w-150-px">
                    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="Profile" />
                  </div>
                </div>
              </div>
              <div className="w-full px-4 text-center mt-20">
                <div className="flex justify-center lg:pt-4 pt-8">
                  <div className="flex flex-col items-center mr-4 p-1">
                    <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                      {user.friends ? user.friends.length : 0}
                    </span>
                    <span className="text-sm text-blueGray-400">Friends</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-4">
              <h3 className="text-3xl font-bold leading-normal mb-2 text-blueGray-700">
                {user.username}
              </h3>
              <h3 className="text-lg font-semibold leading-normal mb-2 text-blueGray-700">
                {user.email}
              </h3>
              <div className="mb-2 text-blueGray-600 mt-5">
                {isEditing ? (
                  <div>
                    <textarea
                      className="textarea textarea-bordered w-full"
                      value={newBio}
                      onChange={(e) => setNewBio(e.target.value)}
                    />
                    <button onClick={handleSubmit} className="btn btn-primary mt-2">Submit</button>
                  </div>
                ) : (
                  <div>
                    <p>{user.bio || 'No bio available'}</p>
                    <div className='mt-6 text-primary'>
                      <button onClick={handleEditClick} className="text-sm">Edit Bio</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
              <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-9/12 px-4">
                  <h3 className="text-xl font-bold leading-normal mb-2 text-blueGray-700">
                    Recent Activity
                  </h3>
                  {user.ownedReadyChecks && user.ownedReadyChecks.length > 0 ? (
                    user.ownedReadyChecks.map((check) => (
                      <p key={check._id} className="mb-4 text-lg leading-relaxed text-blueGray-700">
                        {check.title}
                      </p>
                    ))
                  ) : (
                    <p className="mb-4 text-lg leading-relaxed text-blueGray-700">No recent activity</p>
                  )}
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
