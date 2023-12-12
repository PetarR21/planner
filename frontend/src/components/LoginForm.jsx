/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { useState, forwardRef, useImperativeHandle } from 'react';

const LoginForm = forwardRef(({ handleLogin }, refs) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = (event) => {
    event.preventDefault();
    handleLogin({ username, password });
  };

  useImperativeHandle(refs, () => {
    return {
      setUsername,
      setPassword,
    };
  });

  return (
    <form onSubmit={login}>
      <div>
        username
        <input
          type='text'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type='password'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type='submit'>login</button>
    </form>
  );
});

export default LoginForm;
