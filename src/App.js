import React from 'react';
import axios from "axios"; // Import axios using ES6 style
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './companent/MainPage/MainPage';
import SignIn from './companent/SignIn/SingUp/SingIn';
import SignUp from './companent/SignIn/SingUp/SingUp';
import Profile from './companent/Profile/Profile'
import EditProfile from './companent/Profile/editProfile/EditProfile';
import Posts from './companent/Post/Posts/PostsList';
import Fyp from './companent/Fyp/FypPage'
import CreatePost from './companent/Post/CreatePost';
import Follow from './companent/Profile/FollowFunc/Follow';
import Search from './companent/Fyp/search/search';
import UserProfile from './companent/Profile/UserProfile/UserProfile';
import OtherUser from './companent/Profile/UserNetwork/OtherUser';
import { UserContextProvider } from './UserContext';
import { FollowContextProvider } from './FollowContext';
import { PostsContextProvider } from './PostsContext';


axios.defaults.withCredentials = true;
axios.defaults.baseURL =  "http://localhost:4000"; // Corrected the baseURL format

function App() {
  return (
    <UserContextProvider>
    <PostsContextProvider>    
    <FollowContextProvider>
    <Router>
        <div>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/SignIn" element={<SignIn />} />
            <Route path='/SignUp' element={<SignUp/>}/>
            <Route path='/Profile/:userId' element={<Profile />}/>
            <Route path='/EditProfile' element={<EditProfile />}/>
            <Route path='/fyp' element={<Fyp/>}/>
            <Route path='/Follow' element={<Follow />}/>
            <Route path='/CreatePost' element={<CreatePost/>}/>
            <Route path='/Posts/:postId' element={<Posts/>}/>
            <Route path='/Search' element={<Search/>}/>
            <Route path='/UserProfile' element={<UserProfile/>}/>
            <Route path="/UserProfile/:userId" element={<UserProfile />} />
            <Route path="/user" element={<OtherUser />} />
            <Route path='user/:userId' element={<OtherUser/>}/>

          </Routes>
        </div>
      </Router>
    </FollowContextProvider>
    </PostsContextProvider>
    </UserContextProvider>
  );
}

export default App;
