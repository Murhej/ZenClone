import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Footer from '../MainPage/Footer';
import './Profile.css';
import Grid from '../MainPage/Imgs/grid.png';
import tag from '../MainPage/Imgs/tags.png';
import banner from '../MainPage/Imgs/banner.png';
import profile from '../MainPage/Imgs/ProfilePic.png'; 
import { Link, Navigate } from "react-router-dom";
import { UserContext } from '../../UserContext';

function Profile() {
    const { user, setUser } = useContext(UserContext);
    const [image, setImage] = useState(null);
    const [redir, setRedir] = useState(false);
    const [ImageError, setImageError] = useState(false);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (user && user._id) {
            axios.get(`/Profile/${user._id}/posts`)
                .then(response => {
                    setPosts(response.data);
                })
                .catch(error => console.error('Error fetching posts:', error));
            if (!image) {
                axios.get(`/getImage/${user._id}`, { responseType: 'blob' })
                    .then(response => {
                        const imageUrl = URL.createObjectURL(response.data);
                        setImage(imageUrl);
                    })
                    .catch(error => {
                        console.error('Error fetching image:', error);
                        setImageError(true);
                    });
            }
        }
    }, [user, image]);

    if (!user) {
        return <div>Loading...</div>;
    }

    // Ensure followers and following are defined
    const followers = user.followers || [];
    const following = user.following || [];

    const handleSignOut = async () => {
        try {
            await axios.get('/SignOut');
            setRedir(true);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    if (redir) {
        return <Navigate to={'/SignIn'} />;
    }

    return (
        <div className="Profile">
            <button className="signout" onClick={handleSignOut}>Sign Out</button>
            <div className="Profile-Page">
                <div className="prof">
                    <Link to='/EditProfile'>
                        {ImageError ? <img src={profile} alt="Default Profile"/> : image && <img src={image} alt="User Profile"/>}
                    </Link>
                </div>
                <h6>{user.username}</h6>
                <p>{user.bio}</p>
                <div className="follow">
                    <button><Link to='/Follow'>Follower <br/>{followers.length}</Link></button>
                    <button><Link to='/Follow'>Following <br/>{following.length}</Link></button>
                </div>
                <div className="Grid">
                    <button><img src={Grid} alt="" /></button>
                    <button><img src={tag} alt="" /></button>
                    <button className="tag"><img src={banner} alt="" /></button>
                </div>
                <div className="posts">
                    {posts.map(post => (
                        <div key={post._id} className="post">
                            {post.media.map((mediaItem, index) => (
                                <Link to={`/Posts/${post._id}`} key={index}>
                                    <img src={mediaItem.url} alt={post.alt || "Post image"} />
                                </Link>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Profile;
