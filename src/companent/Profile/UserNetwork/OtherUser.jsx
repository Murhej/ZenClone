// OtherUser.js
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import Footer from '../../MainPage/Footer';
import Grid from '../../MainPage/Imgs/grid.png';
import tag from '../../MainPage/Imgs/tags.png';
import banner from '../../MainPage/Imgs/banner.png';
import profile from '../../MainPage/Imgs/ProfilePic.png';
import { UserContext } from '../../../UserContext';  
import { Link } from "react-router-dom";
import './OtherUser.css';

function OtherUser() {
    const { userId } = useParams();
    const { user: currentUser } = useContext(UserContext);
    // const { followers, following, fetchFollowers, fetchFollowing } = useContext(FollowContext);
    const [clientProfile, setClientProfile] = useState(null);
    const [image, setImage] = useState(null);
    const [ImageError, setImageError] = useState(false);
    const [posts, setPosts] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    useEffect(() => {
        if (userId) {
            axios.get(`/profile/${userId}`)
                .then(response => {
                    setClientProfile(response.data);
                })
                .catch(error => console.error('Error fetching client profile:', error));
    
            axios.get(`/profile/${userId}/posts`) 
                .then(response => {
                    setPosts(response.data);
                })
                .catch(error => console.error('Error fetching posts:', error));
        }
    }, [userId]);
    const handleFollowClick = () => {
        if (isFollowing) {
            console.log('Unfollow user');
            setIsFollowing(false);
        } else {
            // Follow logic here
            console.log('Follow user');
            axios.post('/followUser', {
              currentUserId: currentUser._id,
              followUserId: userId,
            })
            .then(response => {
              setIsFollowing(true);
            })
            .catch(error => {
              console.error('Error following user:', error);
            });
        }
    };
    // Separate useEffect for fetching the image to prevent loop
    useEffect(() => {
        if (clientProfile && !image) {
            axios.get(`/getImage/${clientProfile.image}`, { responseType: 'blob' }) // assuming clientProfile.image holds the image name or id
                .then(response => {
                    const imageUrl = URL.createObjectURL(response.data);
                    setImage(imageUrl);
                })
                .catch(error => {
                    console.error('Error fetching image:', error);
                    setImageError(true);
                });
        }
    }, [clientProfile, image]);
    
    useEffect(() => {
        if (currentUser && clientProfile) {
            const alreadyFollowing = currentUser.following?.includes(clientProfile._id);
            setIsFollowing(alreadyFollowing);
        }
    }, [currentUser, clientProfile]);
    

    if (!clientProfile) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="ProfileUser">
                <div className="PictureOfUser">
                    {ImageError ? (
                        <img src={profile} alt="Default Profile"/>
                    ) : (
                        image && <img src={image} alt="User Profile"/>
                    )}
                </div>
                <h6>{clientProfile.username}</h6>
                <p>{clientProfile.bio}</p>
                {/* <div className="follow-links">
                    <button><Link to='/follow'>Follower <br/>{followers.length}</Link></button>
                    <button><Link to='/follow'>Following <br/>{following.length}</Link></button>
                </div> */}
                <div className="Follow-Button">
                    <button onClick={handleFollowClick}>
                        {isFollowing ? 'Following' : 'Follow'}
                    </button>
                </div>
                <div className="Post-Grids">
                    <button><img src={Grid} alt="" /></button>
                    <button><img src={tag} alt="" /></button>
                    <button className="tag"><img src={banner} alt="" /></button>
                </div>
                <div className="postsDisplay">
                {posts.map(post => (
                    <div key={post._id} className="post">
                    {post.media.map((mediaItem, index) => (
                        <Link to={`/posts/${post._id}`} key={index}>
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

export default OtherUser;
