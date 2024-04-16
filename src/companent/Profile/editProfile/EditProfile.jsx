import React, { useContext, useState } from "react";
import axios from "axios";
import './EditProfile.css';
import Footer from '../../MainPage/Footer';
import { UserContext } from '../../../UserContext';

function EditProfile() {
    const { user } = useContext(UserContext);

    // Initialize state values based on user object, or provide default values
    const [name, setName] = useState(user ? user.name : "");
    const [username, setUsername] = useState(user ? user.username : "");
    const [email, setEmail] = useState(user ? user.email : "");
    const [bio, setBio] = useState(user && user.bio ? user.bio : "");
    const [file, setImage] = useState(null); 
    const [message, setMessage] = useState("");
    const [imageUrl, setImageUrl] = useState(user ? `/Uploads/${user.image}` : null); 

    const handleImageChange = (e) => {
        setImage(e.target.files[0]); 
        setImageUrl(URL.createObjectURL(e.target.files[0])); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('profileImage', file);
            formData.append('name', name);
            formData.append('username', username);
            formData.append('bio', bio);
            formData.append('email', email);
    
            const response = await axios.put('/updateProfile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Profile updated successfully');
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage("Error updating profile. Please try again later.");
        }
        console.log("Submitting data:", { name, username, email, bio, file });
    };

    const handleDeleteAccount = async () => {
        try {
            const response = await axios.delete('/deleteAccount');
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error deleting account:', error);
            setMessage("Error deleting account. Please try again later.");
        }
    };

    return (
        <div className="editProfile">
            <div>
                <h2>Edit Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="ProfilePic">
                        <label>Profile Picture:</label>
                        {imageUrl && <img src={imageUrl} alt="Profile" />} {/* Display image preview */} <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange} 
                        />
                       
                    </div>
                    <div className="ProfileBio">
                        <label>Bio:</label>
                        <input type="text" value={bio} onChange={(e) => setBio(e.target.value)} />
                    </div>
                    <br/>
                    <h3>Account Info</h3>
                    <div className="ProfileName">
                        <label>Name:</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="ProfileUser">
                        <label>Username:</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="ProfileEmail">
                        <label>Email:</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <button type="submit">Save Changes</button>
                </form>
                <h3>Delete Account</h3>
                <button onClick={handleDeleteAccount}>Delete Account</button>
                {message && <p>{message}</p>}
            </div>
            <Footer />
        </div>
    );
}

export default EditProfile;
