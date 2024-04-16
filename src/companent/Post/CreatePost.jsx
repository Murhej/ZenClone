import React, { useState } from 'react';
import axios from 'axios';
import Footer from '../MainPage/Footer';
import './CreatePost.css';

function CreatePost() {
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState('');
  const [alt, setAlt] = useState('');
  const [message, setMessage] = useState('');

  // In your CreatePost component file (CreatePost.js)

async function Post(e) {
  e.preventDefault();
  try {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('alt', alt);
    files.forEach(file => {
      formData.append('image', file);
    });

    const response = await axios.post('/createPost', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log(response);
    setMessage(response.data.message);
  } catch (error) {
    console.error(error);
    setMessage('Error posting image. Please try again later.');
  }
}


  function handleFileChange(e) {
    const filesArray = Array.from(e.target.files);
    setFiles(filesArray);
  }

  return (
    <div className="createP">
      <h2>Post Picture/Video</h2>
      <form onSubmit={Post} encType="multipart/form-data">
        <div className="CreatePost">
          <label htmlFor="fileInput" className="custom-file-upload">
            Upload Image/Video
          </label>
          <input
            id="fileInput"
            type="file"
            accept="image/*, video/*"
            onChange={handleFileChange}
            multiple 
          />
          <div className="uploadedFiles">
            {files.map((file, index) => (
              <div key={index} className="fileItem">
                <img src={URL.createObjectURL(file)} alt={`File ${index}`} />
              </div>
            ))}
          </div>
        </div>
        <div className="PostInfo">
          <input
            className="desc"
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            className="alt"
            type="text"
            value={alt}
            placeholder="Alt"
            onChange={(e) => setAlt(e.target.value)}
          />
          <button type="submit">Post</button>
        </div>
      </form>
      {message && <p>{message}</p>}
      <Footer />
    </div>
  );
}

export default CreatePost;
