import React, { createContext, useState } from 'react';
import axios from 'axios';

export const PostsContext = createContext();
export function PostsContextProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState([]); 
  const [comments, setComments] = useState([]); 

  const fetchPosts = async (postId) => {
    try {
      const response = await axios.get(`/fetchPosts/${postId}`);
      setPosts(response.data); 
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchLikes = async (postId) => {
    try {
      const response = await axios.get(`/likes/${postId}`); 
      setLikes(response.data.likes);
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const response = await axios.get(`/comments/${postId}`); 
      setComments(response.data.comments); 
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };


  return (
    <PostsContext.Provider value={{ posts, fetchPosts, likes, fetchLikes, comments, fetchComments }}>
      {children}
    </PostsContext.Provider>
  );
}
