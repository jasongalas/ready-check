import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import ReadyCheckForm from '../components/ReadyCheckForm';
import Auth from '../utils/auth';

const ActiveReadyChecks = () => {
  const { username: userParam } = useParams();
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });

  const user = data?.me || data?.getUser || {};

  const navigate = useNavigate();

  const openReadyCheckForm = () => {
    document.getElementById('my_modal_3').showModal();
  };

  const goToLoginPage = () => {
    navigate('/login');
  }

  const goToSignUpPage = () => {
    navigate('/signup');
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
    <main className='mx-6 h-fill'>
      <div className="flex flex-col w-full h-full lg:flex-row">
        <div className="flex flex-wrap justify-center">
          <div className="text-center m-6 p-7">
            <h1 className="text-5xl text-navy-blue font-bold">My ReadyChecks</h1>
            <p className="pt-12 text-navy-blue text-lg">Click on an active ReadyCheck for more details</p>
          </div>
          <button onClick={openReadyCheckForm} className="btn btn-sky card h-fit bg-sky-600 hover:bg-aquamarine text-primary-content shadow-xl">
            <div className="card-body text-white text-center ">
              <h2 className="text-center font-bold text-xl">New ReadyCheck</h2>
            </div>
          </button>
          <dialog id="my_modal_3" className="modal">
            <div className="modal-box">
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
              </form>
              <ReadyCheckForm userId={1} />
            </div>
          </dialog>
        </div>

        <div className="divider lg:divider-horizontal"></div>
        <div className="flex flex-wrap justify-center w-3/5 p-4 overflow-auto max-h-[calc(100vh-200px)]">
          {user.ownedReadyChecks && user.ownedReadyChecks.length > 0 ? (
            user.ownedReadyChecks.map((readyCheck) => (
              <button key={readyCheck._id} onClick={() => navigate(`/readycheck/${readyCheck._id}`)} className="btn-accent card m-2 w-full h-32 bg-blue-btn hover:bg-blue-hover text-primary-content shadow-xl">
                <div className="p-2 text-white text-left">
                  <h2 className="font-bold text-4xl m-3">{readyCheck.title}</h2>
                  <p className='py-2 px-6 text-lg'>{readyCheck.description}</p>
                </div>
              </button>
            ))
          ) : (
            <div className='mt-20'>
                <p className="text-3xl text-navy-blue">No active ReadyChecks found</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ActiveReadyChecks;
