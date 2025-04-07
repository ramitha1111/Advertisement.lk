import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = () => {
    // Call backend login API, here we mock it
    const mockToken = 'mockToken123';
    const mockUser = { role: 'user', email };

    // Dispatch login success
    dispatch(loginSuccess({ token: mockToken, user: mockUser }));
  };

  return (
    <div>
      <h1>Login</h1>
      <h1>Login</h1>
      <h1>Login</h1>
      <h1>Login</h1>
      <h1>Login</h1>
      <h1>Login</h1>
      <h1>Login</h1>
      <h1>Login</h1>
      <h1>Login</h1>
      <h1>Login</h1>
      <h1>Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
