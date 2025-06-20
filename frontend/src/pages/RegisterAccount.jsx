import React, { useState } from 'react';
import GoogleLoginButton from '../components/GoogleLoginButton';
import api from '../utils/api';
import {useNavigate} from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        toast.error("Passwords do not match!");
        return;
    }

    try {
        const response = await api.post("/auth/register", {
            email,
            password,
        });
        
        // Store the token from the response
        const { access_token } = response.data;
        localStorage.setItem("token", access_token);
        
        toast.success("Account successfully created!");
        setTimeout(() => {
            navigate("/");
        }, 800);
    } catch (error) {
        if (error.response?.data?.detail) {
            toast.error(error.response.data.detail);
        } else {
            toast.error("Registration failed. Please try again.");
        }
        console.error("Registration error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
        <Toaster className="mt-18"/>
      <div className="bg-base-100 rounded-xl shadow-lg p-8 max-w-md w-full border border-base-300">
        <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="label">
              <span className="text-white label-text">Email</span>
            </label>
            <input
              type="email"
              className="input input-bordered w-full mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">
              <span className="text-white label-text">Password</span>
            </label>
            <input
              type="password"
              className="input input-bordered w-full mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">
              <span className="text-white label-text">Confirm Password</span>
            </label>
            <input
              type="password"
              className="input input-bordered w-full mt-1"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full mt-3">Register</button>
        </form>

        <div className="divider text-sm text-base-content/60 mt-6">OR</div>

        <GoogleLoginButton />

        <p className="text-sm text-center mt-4 text-base-content/60">
          Already have an account? <a href="/login" className="text-info hover:underline">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
