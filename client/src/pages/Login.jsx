import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) return navigate('/dashboard');
    }, [token, navigate]);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const data = { email, password };

            const res = await axios.post(
                'http://localhost:8080/auth/login',
                data
            );

            if (res.data.success) {
                toast.success(res.data.message);

                localStorage.setItem('token', res.data.user.token);
            } else {
                toast.error(res.data.message);
            }

            setEmail('');
            setPassword('');

            navigate('/dashboard');
        } catch (error) {
            console.log(error);
        }
    }
    return token ? null : (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    pattern=".{8,}"
                    title="Eight or more characters"
                />

                <button type="submit">Login</button>

                <p>
                    Don`&apos`t have an account?
                    <Link to={'/signup'}>Sign Up</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
