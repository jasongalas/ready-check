import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

// import ReadyCheckForm from '../components/ReadyCheckForm';

const Home = () => {
  // Placeholder for user authentication 
  const navigate = useNavigate();
  const isAuthenticated = true;

  const [isModalOpen, setModalOpen] = useState(false);

  return (
    
   
       <main className='mx-6'>
          {isAuthenticated ? (
            <div className="flex flex-col w-full lg:flex-row">             
                <div className="flex flex-wrap w-2/3 justify-center gap-4">
                  <button className="btn btn-sky card m-10 h-fill w-full bg-sky-600 text-primary-content shadow-xl" onClick={()=>document.getElementById('my_modal_1').showModal()}>
                    <div className="card-body text-white text-center mt-14">
                      <h2 className="text-center font-bold text-6xl m-5">New ReadyCheck</h2>
                      <div className='m-3'>
                        <p className='text-xl font-semibold mb'>Create a new notification to send out to your friends!</p>
                        <div className='m-4'>
                          <ul className='text-lg'>
                            <li>• Group up for a gaming session</li>
                            <li>• Meet up for some pickleball</li>
                            <li>• See who's in for Cabo!</li>
                          </ul>
                        </div>
                        <p className='text-xl font-semibold mb'>The world is your oyster!</p>
                      </div>
                    </div>
                  </button>
                  <dialog id="my_modal_1" className="modal">
                    <div className="modal-box">
                      <h3 className="font-bold text-center p-3 text-3xl">New ReadyCheck</h3>
                        <div className='p-4'>
                          <label className="form-control w-full m-2 max-w-xs">
                            <div className="label">
                              <span className="label-text">Title*</span>                       
                            </div>
                            <input type="text" placeholder="Title" className="input input-bordered w-full max-w-xs" />
                          </label>
                          <label className="form-control w-full m-2 max-w-xs">
                            <div className="label">
                              <span className="label-text">Description</span>                       
                            </div>
                            <textarea className="textarea textarea-bordered" placeholder="Description"></textarea>
                          </label>                          
                          <label className="form-control w-full m-2 max-w-xs">
                            <div className="label">
                              <span className="label-text">Date</span>                       
                            </div>
                            <input type="text" placeholder="MM/DD/YY" className="input input-bordered w-full max-w-xs" />
                          </label>
                          <label for="time" class="label-text">
                          <div className="label m-2">
                              <span className="label-text">Select Time</span>                       
                            </div>
                          </label>
                          <div class="relative m-2">
                              <input type="time" id="time" className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-3/4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="09:00" max="18:00" value="00:00" required />
                          </div>
                        </div>
                      <div className="modal-action">
                        <form method="dialog">
                          <button className="btn">Close</button>
                        </form>
                      </div>
                    </div>
                  </dialog>
                </div>              
              <div className="divider lg:divider-horizontal">
              </div>              
                <div className="flex flex-wrap w-1/2 justify-center gap-4">
                  <button onClick={() => navigate('/active-readychecks')} className="btn btn-accent card mt-10 py-20 w-full bg-accent text-primary-content shadow-xl">
                    <div className="card-body text-white text-center">
                      <h2 className="text-center font-bold text-4xl m-3">Active ReadyChecks</h2>
                    </div>
                  </button>
                  <button onClick={() => navigate('/social')} className="btn btn-success card py-20 w-full text-primary-content shadow-xl">
                    <div className="card-body text-white text-center">
                      <h2 className="text-center font-bold text-4xl m-3">Social</h2>
                    </div>
                  </button>
                  <button onClick={() => navigate('/myprofile')} className="btn btn-warning card  py-20 w-full text-primary-content shadow-xl">
                    <div className="card-body text-white text-center">
                      <h2 className="text-center font-bold text-4xl m-3">Profile</h2>
                    </div>
                  </button>
                </div>
          </div>
            
          ) : (
            <div className="hero min-h-screen bg-base-200">
              <div className="hero-content text-center">
                <div className="max-w-md">
                  <h1 className="text-5xl font-bold">Welcome to Ready Check!</h1>
                  <p className="py-6">An app where you can invite friends to join you while playing video games!</p>
                  <button className='text-primary' onClick={() => navigate('/signup')}>New here? Sign up!</button>
                  <br></br>
                  <button className='text-primary' onClick={() => navigate('/login')}>Already have an account? Log in!</button>
                </div>
              </div>
            </div>
        )}
      {/* {isModalOpen && (<ReadyCheckForm closeModal={() => setModalOpen(false)} />)}  */}
      <script src="../path/to/flowbite/dist/flowbite.min.js"></script>
      </main>
      

  );
};

export default Home;