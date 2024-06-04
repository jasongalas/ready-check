import React from 'react';
import { useQuery } from '@apollo/client';

const Home = () => {
  return (
    <main>
      <Link to="/">Home</Link>
      <Link to="/social">Social</Link>
      <Link to="/create">Create New Ready Check</Link>
      {isAuthenticated ? (
        <>
          <Link to="/profile">Profile</Link>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </main>
  );
};

export default Home;
