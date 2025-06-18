import React from 'react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import api from '../utils/api'
import {useNavigate} from 'react-router-dom';

const GoogleLoginButton = () => {
    const navigate = useNavigate();
  return (
        <GoogleLogin
            onSuccess={async (credentialResponse) => {
                const googleToken = credentialResponse.credential;
                try {
                  const res = await api.post("/auth/google", {
                    token: googleToken
                  });
                  const { access_token } = res.data;
                  // Store your own backend-issued JWT
                  localStorage.setItem("token", access_token);
                  navigate("/");
                  console.log("Logged in with Google, token:", access_token);
                  // Optionally redirect user or update app state here
                } catch (err) {
                  console.error("Backend login with Google failed:", err);
                }
              }}
            onError={() => {
            console.log("Login Failed");
            }}
        />
  )
}

export default GoogleLoginButton