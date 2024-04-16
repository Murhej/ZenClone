import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Profile from "../../MainPage/Imgs/Profile.png";
import './UserProfile.css'

function UserProfile({ userData }) {
    const { userId } = useParams(); // Get userId from URL
    const [user, setUser] = useState(userData);
    const [image, setImage] = useState(null);
    const [ImageError, setImageError] = useState(false);

    useEffect(() => {
        if (!user && userId) {
            axios.get(`http://localhost:4000/profile/${userId}`)
                .then(response => {
                    setUser(response.data);
                    if (response.data.image) {
                        setImage(response.data.image);
                    }
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                });
        }
    }, [userId, user]);

    useEffect(() => {
        if (!image) {
            axios.get(`http://localhost:4000/getImage/${user._id}`, { responseType: 'blob' })
                .then(response => {
                    const imageUrl = URL.createObjectURL(response.data);
                    setImage(imageUrl);
                })
                .catch(error => {
                    console.error('Error fetching image:', error);
                    setImageError(true);
                });
        }
    }, [image]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <Link to={`/user/${user._id}`}> {/* Adjust the link to use userId */}
            <div className="UserProfileBody">
                <div className="UserProfile">
                    {ImageError ? (
                        <img src={Profile} alt="Default Profile"/>
                    ) : (
                        image && <img src={image} alt="User Profile"/>
                    )}
                    <p>{user.username}</p>
                </div>
            </div>
        </Link>
    );
}

export default UserProfile;
