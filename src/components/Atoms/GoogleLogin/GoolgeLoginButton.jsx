import React from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

const GoogleLoginButton = ({ clientId, handleGoogleLogin }) => {
    return (
        <GoogleOAuthProvider clientId={clientId}>
            <div className="w-full google-oauth-container">
                <GoogleLogin
                    onSuccess={(response) => {
                        const decoded = jwtDecode(response.credential);
                        handleGoogleLogin(decoded);
                    }}
                    onError={() => toast.error("Google login failed")}
                    theme="outline"
                    size="large"
                    shape="pill"
                    className="google-login-button"
                />
            </div>
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginButton;