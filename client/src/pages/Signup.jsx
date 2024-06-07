import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const SignUp = () => {
  const [formState, setFormState] = useState({ username: '', email: '', password: '' });
  const [signUp, { error, data }] = useMutation(CREATE_USER);

  // Update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // Handle form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await signUp({
        variables: { ...formState },
      });

      const { token } = response.data.createUser;
      Auth.login(token); 
    } catch (e) {
      console.error(e);
    }

    setFormState({
      username: '',
      email: '',
      password: '',
    });
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center w-96">
          <h1 className="text-5xl font-bold">Sign Up!</h1>
        </div>
        <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        {data ? (
              <p>
                Success! You may now head{' '}
                <Link to="/">back to the homepage.</Link>
              </p>
            ) : (
          <form className="card-body" onSubmit={handleFormSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input 
                type="username" 
                placeholder="username" 
                name="username"
                value={formState.username}
                onChange={handleChange}
                className="input input-bordered" 
                required 
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input 
                type="email" 
                placeholder="email" 
                name="email"
                value={formState.email}
                onChange={handleChange}
                className="input input-bordered" 
                required 
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input 
                type="password" 
                placeholder="password" 
                name="password"
                value={formState.password}
                onChange={handleChange}
                className="input input-bordered" 
                required 
              />
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary" type="submit">Submit</button>
            </div>
          </form>
            )}
            {error && <div className="my-3 p-3 bg-danger text-white">{error.message}</div>}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
