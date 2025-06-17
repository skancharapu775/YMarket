import React from 'react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios'

const GoogleLoginButton = () => {
    const clientId = "89565253405-34qjj05nvt5tshoeseu2u733af7n1cin.apps.googleusercontent.com";
  return (
    <GoogleOAuthProvider clientId={clientId}>
        <GoogleLogin
            onSuccess={async (credentialResponse) => {
                const googleToken = credentialResponse.credential;
                try {
                  const res = await axios.post("http://localhost:8000/auth/google", {
                    token: googleToken
                  });
                  const { access_token } = res.data;
                  // Store your own backend-issued JWT
                  localStorage.setItem("token", access_token);
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
    </GoogleOAuthProvider>
  )
}

export default GoogleLoginButton