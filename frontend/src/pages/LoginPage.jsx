import { useState } from 'react';
import api from '../utils/api';
import GoogleLoginButton from '../components/GoogleLoginButton';
import {useNavigate} from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", {
        email,
        password
      });
      localStorage.setItem("token", res.data.access_token);
      navigate("/");
      alert("Logged in!");
    } catch (err) {
      console.error(err);
      setError("Invalid credentials");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-base-100 shadow rounded-xl mt-10 space-y-4">
      <h2 className="text-2xl font-bold text-center">Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <input
          className="input input-bordered w-full"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="input input-bordered w-full"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary w-full">Login</button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>

      <div className="divider">OR</div>
      <div className="flex justify-center">
        <GoogleLoginButton/>
      </div>


    </div>
  );
};

export default LoginPage;
