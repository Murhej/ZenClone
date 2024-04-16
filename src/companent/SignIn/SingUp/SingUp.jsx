import React, { useState } from "react";
import Logo from '../../MainPage/Imgs/Logo.png';
import './Singin.css'
import Email from '../../MainPage/Imgs/Email.png';
import Google from '../../MainPage/Imgs/Google.png'
import Facebook from '../../MainPage/Imgs/Facebook.png'
import Apple from '../../MainPage/Imgs/Apple.png'
import { Link } from "react-router-dom";
import axios from "axios";


function SignUp(){
    const [name, setFName]= useState(''); 
    const [Number, setPhNumber] = useState('');
    const [email, setemail] = useState(""); 
    const [password, setPassword] = useState("");
    const [username, setusername] = useState("");
    const [error] = useState(null);

    async function SignUpUser(e) {
        e.preventDefault();
        try {
            await axios.post('/SignUp', 
            {  
                name,
                phoneNumber: Number, 
                username,
                email,
                password
            });
            alert('Registration is successful. Now you can Sign in');
        } catch (error) {
            console.error('Registration Failed:', error); // Logging the error for better debugging
            alert('Registration Failed. Try again later.');
        }
    }
    

    return(
        <div className="SigninPage">  
           <h2>Sign Up</h2>
            <div className="SignUpNow">
                
                <img className='logo' src={Logo} alt="Logo"></img>
                <Link to='/SignIn' className="Singup-link"> Sign In</Link>
                <form onSubmit={SignUpUser}>
                <input 
                        className="FullName" 
                        type="text" 
                        placeholder="Full-Name"
                        value={name}
                        onChange={(e) => setFName(e.target.value)}
                    />
                      <input 
                        className="PhoneNumber" 
                        type='tel'
                        placeholder="Phone Number"
                        value={Number}
                        onChange={(e) => setPhNumber(e.target.value)}
                    />
                    
                    <input 
                        className="Username" 
                        type='string'
                        placeholder="UserName"
                        value={username}
                        onChange={(e) => setusername(e.target.value)}
                    />
                     <input 
                        className="emailOrUsername" 
                        type="text" 
                        placeholder="Email or Username"
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
                    />
                    <input 
                        className="Password" 
                        type="password" 
                        placeholder="   Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    
                    {error && <p className="error">{error}</p>}
                    <button type="submit">Sign Up</button>
                    
                    <Link to='/forgetPassword' className="forgetPassword-Link">forget Password?</Link>
                    <br></br>
                    <line>Other Option</line>
                    
                
                </form>

            </div>
            <div className="loginOption">
                <button className="Face"><img src={Facebook} alt="facebook logo" ></img></button>
                <button className="go"> <img src={Google}  alt="Google logo" ></img></button>
                <button className="Ap"><img src={Apple}  alt="apple logo" ></img></button>
                <button className="Ap">  <img src={Email}  alt="email logo" ></img></button>

            </div>
        </div>
    );
}

export default SignUp;
