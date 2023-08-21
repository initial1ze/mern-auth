import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cnfPassword, setCnfPassword] = useState('');
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) return navigate('/dashboard');
    }, [token, navigate]);

    async function handleSignup(e) {
        e.preventDefault();

        try {
            const data = { email, password, cnfPassword };

            const res = await axios.post(
                'http://localhost:8080/auth/signup',
                data
            );

            if (res.data.success) {
                toast.success(res.data.message);
                navigate('/login');
            } else {
                toast.error(res.data.message);
            }

            setEmail('');
            setPassword('');
            setCnfPassword('');
        } catch (error) {
            console.log(error);
        }
    }
    return token ? null : (
        <div className="form-container">
            <form onSubmit={handleSignup}>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    placeholder="Email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    placeholder="Password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    pattern=".{8,}"
                    title="Eight or more characters"
                />

                <label htmlFor="cnfPassword">Confirm Password:</label>
                <input
                    type="password"
                    placeholder="Confirm Password"
                    id="cnfPassword"
                    value={cnfPassword}
                    onChange={(e) => setCnfPassword(e.target.value)}
                    required
                    pattern=".{8,}"
                    title="Eight or more characters"
                />

                <button type="submit">Signup</button>

                <p>
                    Already have an account? <Link to={'/login'}> Login</Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;
