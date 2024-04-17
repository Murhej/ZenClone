import React, { createContext, useState } from 'react';
import axios from 'axios';

export const FollowContext = createContext();

export function FollowContextProvider({ children }) {
  
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [error, setError] = useState('');

  // Function to fetch followers
  const fetchFollowers = async (userId) => {
    try {
      const response = await axios.get(`/followers/${userId}`);
      setFollowers(response.data.followers);
      setError('');
    } catch (error) {
      console.error('Error fetching followers:', error);
    }
  };

  // Function to fetch following
  const fetchFollowing = async (userId) => {
    try {
      const response = await axios.get(`/following/${userId}`);
      setFollowing(response.data.following);
    } catch (error) {
      console.error('Error fetching following:', error);
    }
  };

  return (
    <FollowContext.Provider value={{ followers, following, fetchFollowers, fetchFollowing, error }}>
      {children}
    </FollowContext.Provider>
  );
}
