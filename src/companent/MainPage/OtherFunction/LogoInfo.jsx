import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import PostPic from '../Imgs/PostPic.png'
import Star from '../Imgs/Star.png'
import Live from '../Imgs/Live.png'
import Following from '../Imgs/following.png'
import Heart from '../Imgs/Heart.png'
import './LogInfo.css'





function LogInfo() {
    const [showComponent, setShowComponent] = useState(false);

    useEffect(() => {
        const delay = setTimeout(() => {
            setShowComponent(true);
        }, 125);

        // Clear timeout if the component is unmounted or if the delay duration changes
        return () => clearTimeout(delay);
    }, []);

  return (
    <div >
    {showComponent &&  (
      <header className='HeaderInfo' >
        <Link to="/CreatePost" className='Post'><img src={PostPic} alt='Post pictures' /></Link>
        <Link to="/Star" className='Star'><img src={Star} alt='Star' /></Link>
        <Link to="/Live" className='Live'><img src={Live} alt='Live' /></Link>
        <Link to="/Following" className='Following'><img src={Following} alt='Following' /></Link>
        <Link to="/Heart" className='Heart'><img src={Heart} alt='heart' /></Link>
      </header>
    )}
    </div>
  );
}

export default LogInfo;
