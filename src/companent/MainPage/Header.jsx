import React, {useState} from 'react';
import Story from './Imgs/Story.png';
import Logo from './Imgs/Logo.png';
import Message from './Imgs/Message.png';
import LogInfo from './OtherFunction/LogoInfo';
import Stories from './OtherFunction/Stories';
import './Header.css';



function Header() {
    const [showStories, setAdditonalStories] = useState(false)
    const [showInfo, setInfo] = useState(false)
    const [isStoryextended, setStoryextended] = useState(false);
    const [isextended, setextended] = useState(false);

    //display stories to handle extend bar
    const GreaterExtend = () => {
        if (isextended) {
            setAdditonalStories(true);
            setInfo(false);
        } else {
            setAdditonalStories(false);
        }
        setextended(!isextended);
        setStoryextended(!isStoryextended);
    };
      //show the info button

    const handleShowInfo = () => {
        setInfo(true);
        setStoryextended(!isStoryextended);
        setAdditonalStories(false);
        setextended(false);
    };
  
 
    
  return (
  
    
    <header className= {isextended || isStoryextended ? 'header extended' :'header'} >
      <button className='Story' onClick={GreaterExtend} ><img src={Story} alt='Story'></img></button>
      <button className='Logo' onClick={handleShowInfo}><img src={Logo} alt='logo'></img></button>
      <button className='Message'><img src={Message} alt='message'></img></button>
      {showStories && <Stories />}
      {showInfo && isStoryextended && <LogInfo />}
    </header>
    
  );
}   

export default Header;
