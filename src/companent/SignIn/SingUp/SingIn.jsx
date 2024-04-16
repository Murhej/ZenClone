import React, { useContext, useState } from "react";
import axios from "axios";
import Logo from '../../MainPage/Imgs/Logo.png';
import './Singin.css'
import Email from '../../MainPage/Imgs/Email.png';
import Google from '../../MainPage/Imgs/Google.png'
import Facebook from '../../MainPage/Imgs/Facebook.png'
import Apple from '../../MainPage/Imgs/Apple.png'
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../../../UserContext";

function SignIn(){

    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");
    const [redir, setRedir] = useState(false);
    const [error, setError] = useState(null);
    const { setUser } = useContext(UserContext);
    
    async function handleSubmit(e) {
        e.preventDefault();
    
        try {
            const { data } = await axios.post('/SignIn/', { emailOrUsername, password });
            setUser(data);
            console.log('Sign in successful');
            setRedir(true);
        } catch (error) {
            console.error('Sign in failed:', error.message);
            setError('Sign in failed. Please try again.');
        }
    }

    if (redir) {
        return <Navigate to={'/'} />;
    }

    return(
        <div className="SigninPage">  
            <h2>Sign In</h2>
            <div className="SignIn">
                <img className='logo' src={Logo} alt="Logo" />
                <Link to='/SignUp' className="Singup-link"> Sign Up</Link>
                <form onSubmit={handleSubmit}>
                    <input 
                        className="emailOrUsername" 
                        type="text" 
                        placeholder="Email or Username"
                        value={emailOrUsername}
                        onChange={(e) => setEmailOrUsername(e.target.value)}
                    />
                    <input 
                        className="Password" 
                        type="password" 
                        placeholder="   Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <p className="error">{error}</p>}
                    <button type="submit">Log In</button>
                    <Link to='/forgetPassword' className="forgetPassword-Link">forget Password?</Link>
                    <br />
                    <line>Other Option</line>
                    <button className="Face"><img src={Facebook} alt="facebook logo" /></button>
                    <button className="go"> <img src={Google}  alt="Google logo" /></button>
                    <button className="Ap"><img src={Apple}  alt="apple logo" /></button>
                    <button className="Ap">  <img src={Email}  alt="email logo" /></button>
                </form>
            </div>
        </div>
    );
}

export default SignIn;
