import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "../../MainPage/Footer";
import searchIcon from '../../MainPage/Imgs/Serach.png';
import UserProfile from "../../Profile/UserProfile/UserProfile";
import './Search.css';

function Search() {
    const [query, setQuery] = useState('');
    const [userProfiles, setUserProfiles] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    const fetchSuggestions = async (input) => {
        if (!input) return;  // Added check to not fetch if input is empty
        try {
            const response = await axios.get(`/search/suggestions?username=${input}`);
            setSuggestions(response.data || []);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    useEffect(() => {
        if (query) {
            fetchSuggestions(query);
        }
    }, [query]);

    const handleSearch = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.get(`/search?username=${query}`);
            setUserProfiles(response.data);
        } catch (error) {
            console.error('Search error:', error);
        }
    };

    return (
        <div className="SearchPage">
            <div className="searchHeader">
                <input 
                    type="search"  
                    placeholder="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button onClick={handleSearch}>
                    <img src={searchIcon} alt="Search"/>
                </button>
            </div>
            <div>
                {suggestions.map(user => (
                    <div key={user.id} onClick={() => setQuery(user.username)}>
                        <p>{user.username}</p> {/* Display username in suggestions */}
                    </div>
                ))}
            </div>
            <div>
                {userProfiles.map(user => (
                    <UserProfile key={user.id} userData={user} />
                ))}
            </div>
            <Footer />
        </div>
    );
}

export default Search;
