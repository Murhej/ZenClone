import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import UnactiveStar from '../MainPage/Imgs/UnactiveStar.png';
import Message from '../MainPage/Imgs/MessagePost.png';
import Send from '../MainPage/Imgs/SendPost.png';
import Heart from '../MainPage/Imgs/Heart.png';
import RedHeart from '../MainPage/Imgs/redHeart.png'; // Path to the red heart image
import Save from '../MainPage/Imgs/Save.png';
import { PostsContext } from '../../PostsContext';
import '../Post/Posts/PostsList.css';

function PostList() {
    const [posts, setPosts] = useState([]);
    const { userId } = useContext(PostsContext); // Assuming you have user context

    useEffect(() => {
        axios.get('/')
            .then(response => {
                // Mark posts as liked if the user's ID is in the likes array
                const updatedPosts = response.data.map(post => ({
                    ...post,
                    isLiked: post.likes.includes(userId)
                }));
                setPosts(updatedPosts);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
            });
    }, [userId]);

    const toggleLike = (postId) => {
        axios.post(`/posts/${postId}/like`)
            .then(response => {
                setPosts(currentPosts => currentPosts.map(post => {
                    if (post._id === postId) {
                        return { ...post, likes: response.data.likes, isLiked: !post.isLiked };
                    }
                    return post;
                }));
            })
            .catch(error => {
                console.error('Error liking post:', error);
            });
    };

    if (!posts.length) {
        return <div>Loading...</div>;
    }

    return (
        <div className='PicPosts'>
            {posts.map((post, index) => (
                <div key={index} className="postContainer">
                    <div className='postHeader'>
                        {post.createdBy.imageUrl && (
                            <button>
                                <img src={post.createdBy.imageUrl} alt='Profile' />
                            </button>
                        )}
                        <p>{post.username || 'Unknown'}</p>
                        <button className='star'>
                            <img src={UnactiveStar} alt='Unactive star' />
                        </button>
                    </div>
                    <div className='PostImage'>
                        {post.media && post.media.map((mediaItem, idx) => (
                            <img key={idx} src={mediaItem.url} alt={`Post ${idx}`} />
                        ))}
                    </div>
                    <div className='PostBody'>
                        <button onClick={() => toggleLike(post._id)}>
                            <img src={post.isLiked ? RedHeart : Heart} alt='heart' />
                        </button>
                        <span>{post.likes.length}</span>
                        <button>
                            <img src={Message} alt='Message post' />
                        </button>
                        <span>{post.comments.length}</span>
                        <button>
                            <img src={Send} alt='send post' />
                        </button>
                        <button className='SavePost'>
                            <img src={Save} alt='save post' />
                        </button>
                    </div>
                    <div className='PostFooter'>
                        <p>{post.username || 'User'}</p>
                        <p className='Caption'>{post.caption || 'No caption provided.'}</p>
                    </div>
                    <p className='date'>{post.createdAt || 'Date unknown'}</p>
                </div>
            ))}
        </div>
    );
}

export default PostList;
