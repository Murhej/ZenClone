import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserContext } from '../../../UserContext'; // Correct the import path as needed
import Footer from '../../MainPage/Footer';
import './Follow.css';

function Follow() {
    const { user } = useContext(UserContext);
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProfiles = (type) => {
        setLoading(true);
        axios.get(`http://localhost:4000/user/${user._id}/${type}`, {
            withCredentials: true // ensure cookies are sent with the request if using sessions
        })
        .then(response => {
            setProfiles(response.data.map(profile => ({
                ...profile,
                imageUrl: profile.image || 'defaultProfileUrl' // Set default URL or handle it differently
            })));
            setLoading(false);
        })
        .catch(error => {
            console.error(`Error fetching ${type}:`, error);
            setError(`Failed to fetch ${type}`);
            setLoading(false);
        });
    };

    if (!user) {
        return <div>Loading user data...</div>;
    }

    return (
        <div>
            <header className="followHeader">
                <button onClick={() => fetchProfiles('following')}>Following: {user.following.length}</button>
                <button onClick={() => fetchProfiles('followers')}>Followers: {user.followers.length}</button>
            </header>
            <div className='followDesign'>
                {loading ? <p>Loading...</p> : profiles.map(profile => (
                    <Link key={profile._id} to={`/user/${profile._id}`}>
                        <div className="UserProfile">
                            <img src={profile.imageUrl} alt="User Profile" />
                            <p>{profile.username}</p>
                        </div>
                    </Link>
                ))}
                {error && <p>{error}</p>}
            </div>
            <Footer />
        </div>
    );
}

export default Follow;
