import React, { useState, useEffect, useContext } from 'react'; // Import useContext
import axios from 'axios';
import UnactiveStar from '../../MainPage/Imgs/UnactiveStar.png';
import Message from '../../MainPage/Imgs/MessagePost.png';
import Send from '../../MainPage/Imgs/SendPost.png';
import Heart from '../../MainPage/Imgs/Heart.png';
import Save from '../../MainPage/Imgs/Save.png';
import { PostsContext } from '../../../PostsContext';
import { useParams } from 'react-router-dom';
import './PostsList.css';

function PostList() {
  
  let { postId } = useParams();
  const [post, setPost] = useState(null);
  const { likes, comments, fetchLikes, fetchComments } = useContext(PostsContext);
  const [image, setimage] = useState('');


  useEffect(() => {
    axios.get(`/post/${postId}`).then(response => {
        console.log('Post fetched:', response.data);
        setPost(response.data);
        fetchLikes(postId);
        fetchComments(postId);
        // Fetch user image if userId is available in the post data
        if (response.data.userId) {
            fetchUserImage(response.data.userId);
        }
    }).catch(error => {
        console.error('Error fetching post:', error);
    });
}, [postId, fetchLikes, fetchComments]);

const fetchUserImage = (userId) => {
    axios.get(`/getImage/${userId}`, { responseType: 'blob' }).then(response => {
        const imageUrl = URL.createObjectURL(response.data);
        setimage(imageUrl);
    }).catch(error => {
        console.error('Error fetching image:', error);
    });
};

if (!post) {
  return <div>Loading...</div>;
}

return (
  <div className='PicPosts'>
    <div className="postContainer">
      <div className='postHeader'>
        {image && (
          <button>
            <img src={image} alt='Profile' />
          </button>
        )}
        <p>{post.username || 'Unknown'}</p>
        <button className='star'>
          <img src={UnactiveStar} alt='Unactive star' />
        </button>
      </div>

      <div className='PostImage'>
        {post.media && post.media.map((mediaItem, index) => (
          <img key={index} src={mediaItem.url} alt={`Post ${index + 1}`} />
        ))}
      </div>

      <div className='PostBody'>
        <button>
          <img src={Heart} alt='heart' /> 
        </button>
        <span>{likes.length}</span>
        
        <button>
          <img src={Message} alt='Message post' />
        </button>
        <span>{comments.length}</span>

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
  </div>
);
}

export default PostList;
