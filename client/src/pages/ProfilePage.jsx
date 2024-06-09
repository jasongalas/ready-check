import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import { UPDATE_USER_BIO, UPDATE_USER_STATUS } from '../utils/mutations';
import { useState } from 'react';
import { AuthServiceInstance } from '../utils/auth';

const Profile = () => {
  const { username: userParam } = useParams();
  const { loading, data, refetch } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: userParam ? { id: userParam } : {},
  });

  const [updateUserBio] = useMutation(UPDATE_USER_BIO, {
    update(cache, { data: { updateUserBio } }) {
      cache.writeQuery({
        query: userParam ? QUERY_USER : QUERY_ME,
        variables: userParam ? { id: userParam } : {},
        data: {
          me: userParam ? undefined : updateUserBio,
          getUser: userParam ? updateUserBio : undefined,
        },
      });
    }
  });

  const [updateUserStatus] = useMutation(UPDATE_USER_STATUS, {
    update(cache, { data: { updateUserStatus } }) {
      cache.writeQuery({
        query: userParam ? QUERY_USER : QUERY_ME,
        variables: userParam ? { id: userParam } : {},
        data: {
          me: userParam ? undefined : updateUserStatus,
          getUser: userParam ? updateUserStatus : undefined,
        },
      });
    }
  });

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [newBio, setNewBio] = useState('');
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const user = data?.me || data?.getUser || {};

  const navigate = useNavigate();

  const goToLoginPage = () => {
    navigate('/login');
  };

  const goToSignUpPage = () => {
    navigate('/signup');
  };

  const handleEditBioClick = () => {
    setIsEditingBio(true);
    setNewBio(user.bio || '');
  };

  const handleEditStatusClick = () => {
    setIsEditingStatus(true);
    setNewStatus(user.status || '');
  };

  const handleBioSubmit = async () => {
    try {
      const { data } = await updateUserBio({ variables: { bio: newBio } });
      console.log('Updated bio:', data);
      setIsEditingBio(false);
      refetch(); // This ensures the page is refetched and updated
    } catch (err) {
      console.error('Error updating bio:', err);
    }
  };

  const handleStatusSubmit = async () => {
    try {
      const { data } = await updateUserStatus({ variables: { status: newStatus } });
      console.log('Updated status:', data);
      setIsEditingStatus(false);
      refetch(); // This ensures the page is refetched and updated
    } catch (err) {
      console.error('Error updating status:', err);
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
            <div className="flex flex-col justify-center items-center">
              <div className="w-full px-4 flex justify-center">
                <div className="avatar relative">
                  <div className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 max-w-150-px">
                    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="Profile" />
                  </div>
                </div>
              </div>
              <div className="w-full px-4 text-center mt-16">
                <div className="flex justify-center lg:pt-4 pt-8">
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                      {user.friends ? user.friends.length : 0}
                    </span>
                    <span className="text-sm text-blueGray-400">Friends</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-4">
              <h3 className="text-5xl font-bold leading-normal mb-2 text-blueGray-700">
                {user.username}
              </h3>
              <h3 className="text-lg font-semibold leading-normal mb-2 text-blueGray-700">
                {user.email}
              </h3>
              <div className="mb-2 text-blueGray-600 mt-5">
                {isEditingStatus ? (
                  <div>
                    <textarea
                      className="textarea textarea-bordered w-full"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                    />
                    <button onClick={handleStatusSubmit} className="btn btn-primary mt-2">Submit</button>
                  </div>
                ) : (
                  <div>
                    <p>Status: {user.status || 'No status available'}</p>
                    <div className='mt-2 text-primary'>
                      <button onClick={handleEditStatusClick} className="text-sm">Edit Status</button>
                    </div>
                  </div>
                )}
              </div>
              <div className="mb-2 text-blueGray-600 mt-7">
                {isEditingBio ? (
                  <div>
                    <textarea
                      className="textarea textarea-bordered w-full"
                      value={newBio}
                      onChange={(e) => setNewBio(e.target.value)}
                    />
                    <button onClick={handleBioSubmit} className="btn btn-primary mt-2">Submit</button>
                  </div>
                ) : (
                  <div>
                    <p className='text-xl font-semibold'>{user.bio || 'No bio available'}</p>
                    <div className='mt-2 text-primary'>
                      <button onClick={handleEditBioClick} className="text-sm">Edit Bio</button>
                    </div>
                  </div>
                )}
              </div>
              
            </div>
            <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
              <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-9/12 px-4">
                  <h3 className="text-2xl font-bold leading-normal mb-4 text-blueGray-700">
                    Recent Activity
                  </h3>
                  <div className="flex flex-col items-center">
                    {user.ownedReadyChecks && user.ownedReadyChecks.length > 0 ? (
                      user.ownedReadyChecks.map((check) => (
                        <button
                          key={check._id}
                          onClick={() => navigate(`/readycheck/${check._id}`)}
                          className="mb-4 text-lg leading-relaxed text-blueGray-700 underline"
                        >
                          {check.title}
                        </button>
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
      </div>
    </main>
  );
};

export default Profile;