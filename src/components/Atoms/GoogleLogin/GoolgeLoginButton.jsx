import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { toast } from 'react-hot-toast';
import { jwtDecode } from "jwt-decode";

const GoogleLoginWrapper = ({ clientId, handleGoogleLogin }) => {
    return (
        <GoogleOAuthProvider clientId={clientId}>
            <div className="w-full">
                <div style={{
                    width: '100%',
                    height: '48px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <GoogleLogin
                        onSuccess={(response) => {
                            const decoded = jwtDecode(response.credential);
                            handleGoogleLogin(decoded);
                        }}
                        onError={() => toast.error("Google login failed")}
                        theme="outline"
                        size="large"
                        shape="pill"
                        type="standard"
                        text="signin_with"
                        logo_alignment="center"
                        className="google-login-button"
                    />
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginWrapper;