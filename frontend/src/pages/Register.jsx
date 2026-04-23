import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/register', formData);
            localStorage.setItem('user', JSON.stringify(data));
            window.dispatchEvent(new Event('storage'));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="card auth-card">
            <h1>Create Account</h1>
            {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" placeholder="John Doe" required 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
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
                <button type="submit">Register</button>
            </form>
            <p style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                Already have an account? <Link to="/login" className="link">Login</Link>
            </p>
        </div>
    );
};

export default Register;
