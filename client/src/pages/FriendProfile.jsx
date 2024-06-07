import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_USER } from '../utils/queries';

const FriendProfile = () => {
  const { id: userId } = useParams();
  const { loading, error, data } = useQuery(QUERY_USER, {
    variables: { id: userId },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const user = data?.getUser;

  if (!user) {
    return <div>User not found</div>;
  }

  console.log('User data:', user);

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
              <div className="mb-2 text-blueGray-600 mt-5">
                <p>{user.bio || 'No bio available'}</p>
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

export default FriendProfile;
