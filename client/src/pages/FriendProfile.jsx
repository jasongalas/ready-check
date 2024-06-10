import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import { ADD_FRIEND, REMOVE_FRIEND } from '../utils/mutations';
import ProfileStandIn from '../../../public/images/profile-stand-in.png'

const FriendProfile = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();

  const { loading: loadingUser, error: errorUser, data: dataUser } = useQuery(QUERY_USER, {
    variables: { id: userId },
  });
  const { loading: loadingMe, error: errorMe, data: dataMe } = useQuery(QUERY_ME);

  const [followFriend] = useMutation(ADD_FRIEND, {
    refetchQueries: [{ query: QUERY_ME }, { query: QUERY_USER, variables: { id: userId } }],
  });
  const [unfollowFriend] = useMutation(REMOVE_FRIEND, {
    refetchQueries: [{ query: QUERY_ME }, { query: QUERY_USER, variables: { id: userId } }],
  });


  if (loadingUser || loadingMe) return <div>Loading...</div>;
  if (errorUser || errorMe) return <div>Error: {errorUser?.message || errorMe?.message}</div>;

  const user = dataUser?.getUser;
  const currentUser = dataMe?.me;

  if (!user) {
    return <div>User not found</div>;
  }

  const isFriend = currentUser?.friends?.some(friend => friend._id === user._id);

  const handleFollow = async () => {
    try {
      await followFriend({ variables: { username: user.username } });
    } catch (err) {
      console.error('Error following friend:', err);
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowFriend({ variables: { username: user.username } });
    } catch (err) {
      console.error('Error unfollowing friend:', err);
    }
  };


  return (
    <main className="pt-16 bg-blueGray-50">
      <div className="w-full lg:w-4/12 px-4 mx-auto">
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16">
          <div className="px-6">
            <div className="flex flex-wrap justify-center">
              <div className="w-full px-4 flex justify-center">
                <div className="avatar relative">
                  <div className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 max-w-150-px">
                    <img src={ProfileStandIn} alt="Profile Image" />
                  </div>
                </div>
              </div>
              <div className="w-full px-4 text-center mt-16">
                <div className="flex justify-center lg:pt-4 pt-8">
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                      {user.friends ? user.friends.length : 0}
                    </span>
                    <span className="text-sm text-gray-700">Friends</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-4">
              <h3 className="text-5xl font-bold leading-normal mb-2 text-gray-700">
                {user.username}
              </h3>
              <div className="mb-2 text-gray-700 mt-5">
                <p>Status: {user.status || 'No bio available'}</p>
              </div>
              <div className="mb-2 text-gray-700 mt-5">
                <p className='text-xl font-semibold'>{user.bio || 'No bio available'}</p>
              </div>
            </div>
            <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
              <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-9/12 px-4">
                  <h3 className="text-xl font-bold leading-normal mb-2 text-gray-700">
                    Recent Activity
                  </h3>
                  <div className="flex flex-col items-center">
                    {user.ownedReadyChecks && user.ownedReadyChecks.length > 0 ? (
                      user.ownedReadyChecks.map((check) => (
                        <button
                          key={check._id}
                          onClick={() => navigate(`/readycheck/${check._id}`)}
                          className="mb-4 text-lg leading-relaxed text-gray-700 underline"
                        >
                          {check.title}
                        </button>
                      ))
                    ) : (
                      <p className="mb-4 text-lg leading-relaxed text-gray-700">No recent activity</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
                {isFriend ? (
                  <button onClick={handleUnfollow} className="btn btn-danger">Unfollow</button>
                ) : (
                  <button onClick={handleFollow} className="btn btn-primary">Follow</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default FriendProfile;
