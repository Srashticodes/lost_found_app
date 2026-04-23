import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/login', formData);
            localStorage.setItem('user', JSON.stringify(data));
            window.dispatchEvent(new Event('storage'));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        }
    };

    return (
        <div className="card auth-card">
            <h1>Welcome Back</h1>
            {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" placeholder="john@example.com" required 
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" placeholder="••••••••" required 
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </div>
                <button type="submit">Login</button>
            </form>
            <p style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                Don't have an account? <Link to="/register" className="link">Register</Link>
            </p>
        </div>
    );
};

export default Login;
