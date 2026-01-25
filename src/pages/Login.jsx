import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await login(email, password);
            navigate('/shop');
        } catch (err) {
            console.error(err);
            if (err.message.includes('blocked')) {
                setError('Your account has been blocked by the administrator.');
            } else {
                setError('Failed to login. Please check your credentials.');
            }
        }
        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Login</h2>
                {error && <div className="auth-error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <div className="auth-separator">OR</div>

                    <button
                        type="button"
                        className="google-btn"
                        onClick={async () => {
                            try {
                                setError('');
                                setLoading(true);
                                await loginWithGoogle();
                                navigate('/shop');
                            } catch (err) {
                                console.error(err);
                                if (err.message.includes('blocked')) {
                                    setError('Your account has been blocked by the administrator.');
                                } else {
                                    setError('Failed to login with Google.');
                                }
                                setLoading(false);
                            }
                        }}
                        disabled={loading}
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20" />
                        Sign in with Google
                    </button>
                </form>
                <div className="auth-footer">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
