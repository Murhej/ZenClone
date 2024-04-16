import React, { useContext } from "react";
import { Link } from 'react-router-dom';
import Home from '../MainPage/Imgs/Home.png';
import Search from '../MainPage/Imgs/Serach.png';
import Profile from '../MainPage/Imgs/Profile.png';
import { UserContext } from "../../UserContext";
import './Footer.css';

function Footer() {  
    const { user } = useContext(UserContext);


    console.log("User from context:", user?._id);
    return (
        <footer className="Footer">
            <Link to='/' className='Home'><img src={Home} alt=""></img></Link>
            <Link to='/fyp' className="Search"><img src={Search} alt=""></img></Link>
            <Link to={`/Profile/${user?.profile?._id}`} className="Profile"><img src={Profile} alt="" ></img></Link>
        </footer>
    );
}

export default Footer;
