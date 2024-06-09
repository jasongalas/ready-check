import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../utils/mutations';
import { AuthServiceInstance } from '../utils/auth';

const Login = () => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { error, data }] = useMutation(LOGIN);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await login({ variables: { ...formState } });
      AuthServiceInstance.login(data.login.token);
      navigate('/');
    } catch (e) {
      console.error(e);
    }
    setFormState({ email: '', password: '' });
  };

  return (
    <main className="hero min-h-screen bg-darker-background">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center w-96">
          <h1 className="text-5xl text-white font-bold">Login!</h1>
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
                  <span className="label-text">Email</span>
                </label>
                <input
                  className="input input-bordered"
                  placeholder="Your email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="*******"
                  name="password"
                  value={formState.password}
                  onChange={handleChange}
                  className="input input-bordered"
                  required
                />
                <div className="form-control mt-6">
                  <button className="btn btn-primary" type="submit">Submit</button>
                </div>
              </div>
            </form>
          )}
          {error && <div className="my-3 p-3 bg-danger">{error.message}</div>}
        </div>
      </div>
    </main>
  );
};

export default Login;
