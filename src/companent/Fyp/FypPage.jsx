import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../MainPage/Footer';
import Live from '../MainPage/Imgs/Live.png';
import Search from '../MainPage/Imgs/Serach.png';
import { Link } from 'react-router-dom';
import './fyp.css';

function FypPage() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:4000/allPosts')
            .then(response => {
                console.log("API Response:", response.data); // Check API response data
                const fetchedPosts = response.data;
                const fetchImagePromises = fetchedPosts.map(post =>
                    axios.get(`/getImage/${post.createdBy._id}`, { responseType: 'blob' })
                    .then(imageResponse => {
                        const imageUrl = URL.createObjectURL(imageResponse.data);
                        return { ...post, userImageUrl: imageUrl };
                    })
                    .catch(error => {
                        console.error('Error fetching image:', error);
                        return { ...post, userImageUrl: null };
                    })
                );
    
                Promise.all(fetchImagePromises)
                .then(postsWithImages => {
                    console.log("Post with Images:", postsWithImages); // Log posts with images
                    setPosts(postsWithImages);
                    setIsLoading(false);
                });
            })
            .catch(error => {
                console.error('Failed to fetch posts:', error);
                setError('Failed to fetch posts');
                setIsLoading(false);
            });
    }, []);
    
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className='fyp'>
            <div className='fypHeader'>
                <Link to="/Live" className='Live'><img src={Live} alt='Live' /></Link>
                <div className='search'>
                    <Link to="/search" className='Live'><img src={Search} alt='Search' /></Link>
                </div>
            </div>
            <div className='fyp-Body'>
                <button>Posts</button>
                <div className='fypPosts'>
                    {posts.map(post => (
                        <div key={post._id}>
                          
                            {post.media.map((mediaItem, index) => (
                                <Link to={`/Posts/${post._id}`} key={index}>
                                    <img src={mediaItem.url} />
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

export default FypPage;
