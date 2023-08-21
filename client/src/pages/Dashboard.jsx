import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) return navigate('/login');
        async function getUser() {
            try {
                const res = await axios.get('http://localhost:8080/auth/user', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(res.data.user);
            } catch (error) {
                console.log(error);
            }
        }

        getUser();
    }, [token, navigate]);

    function handleClick() {
        localStorage.removeItem('token');

        toast.success('Logged out successfully!');
        navigate('/login');
    }

    return token ? (
        <div className="dashboard">
            <h1>Welcome {user?.email}!</h1>

            <button className="logout-btn" onClick={handleClick}>
                Logout
            </button>
        </div>
    ) : null;
};

export default Dashboard;
